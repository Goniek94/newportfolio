export const auctionsServiceCode = `import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { PlaceBidDto } from "./dto/place-bid.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { BidsGateway } from "../bids/bids.gateway";
import { NotificationsService } from "../notifications/notifications.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";

/** Maximum active + upcoming listings per subscription tier */
const LISTING_LIMITS: Record<string, number> = {
  free: 5,
  basic: 25,
  premium: 50,
  vip: 999,
};

@Injectable()
export class AuctionsService {
  constructor(
    private prisma: PrismaService,
    private bidsGateway: BidsGateway,
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Create new auction with tier-based listing-limit enforcement.
   */
  async create(createAuctionDto: CreateAuctionDto, sellerId: string) {
    const { startingBid, bidIncrement, buyNowPrice, startTime, endTime, ...rest } = createAuctionDto;

    const seller = await this.prisma.user.findUnique({ where: { id: sellerId } });
    if (seller) {
      const tier = seller.subscriptionTier ?? "free";
      const limit = LISTING_LIMITS[tier] ?? LISTING_LIMITS.free;
      const activeCount = await this.prisma.auction.count({
        where: { sellerId, status: { in: ["active", "upcoming"] } },
      });
      if (activeCount >= limit) {
        throw new ForbiddenException(
          \`Your \${tier} plan allows up to \${limit} active listing\${limit === 1 ? "" : "s"}. Upgrade your plan to list more items.\`,
        );
      }
    }

    if (startingBid <= 0) throw new BadRequestException("Starting bid must be greater than 0");
    if (bidIncrement <= 0) throw new BadRequestException("Bid increment must be greater than 0");

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) throw new BadRequestException("End time must be after start time");
    if (buyNowPrice && buyNowPrice <= startingBid) {
      throw new BadRequestException("Buy now price must be greater than starting bid");
    }

    const now = new Date();
    const status = start > now ? "upcoming" : "active";

    const auction = await this.prisma.auction.create({
      data: {
        ...rest,
        startingBid: new Decimal(startingBid),
        currentBid: new Decimal(startingBid),
        bidIncrement: new Decimal(bidIncrement),
        buyNowPrice: buyNowPrice ? new Decimal(buyNowPrice) : null,
        startTime: start,
        endTime: end,
        status,
        sellerId,
        bidCount: 0,
      },
      include: {
        seller: { select: { id: true, username: true, rating: true, reviews: true } },
      },
    });

    // Fire-and-forget seller notification — non-critical, don't fail listing creation
    try {
      const notification = await this.notificationsService.create(
        sellerId,
        "listing_published",
        "Your listing is live!",
        \`"\${auction.title}" has been published and is now visible to buyers.\`,
        \`/auction/\${auction.id}\`,
        { auctionId: auction.id },
      );
      this.notificationsGateway.emitToUser(sellerId, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read: notification.read,
        createdAt: notification.createdAt.toISOString(),
      });
    } catch {
      // Non-critical — swallow
    }

    return auction;
  }

  /**
   * Place bid — the flagship method.
   *
   * Wrapped in a Prisma transaction with optimistic locking:
   * the auction.update has \`where: { id, currentBid }\` so it only succeeds
   * if currentBid hasn't changed since we read it. If a concurrent bid won
   * the race, Prisma throws P2025 and we surface a clear error.
   *
   * Anti-snipe: if bid arrives in the last 5 minutes, endTime extends by 5min.
   *
   * After commit (outside the transaction), we broadcast the bid to all
   * watchers via WS and notify the previously-winning bidder they were outbid.
   */
  async placeBid(auctionId: string, placeBidDto: PlaceBidDto, bidderId: string) {
    const { amount } = placeBidDto;

    return await this.prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({
        where: { id: auctionId },
        include: {
          bids: {
            orderBy: { amount: "desc" },
            take: 1,
            select: { bidderId: true, amount: true },
          },
        },
      });

      if (!auction) throw new NotFoundException(\`Auction with ID \${auctionId} not found\`);
      if (auction.status !== "active") throw new BadRequestException("Auction is not active");

      const now = new Date();
      if (now < auction.startTime) throw new BadRequestException("Auction has not started yet");
      if (now >= auction.endTime) throw new BadRequestException("Auction has ended");
      if (auction.sellerId === bidderId) {
        throw new ForbiddenException("You cannot bid on your own auction");
      }

      const minBid = Number(auction.currentBid) + Number(auction.bidIncrement);
      if (amount < minBid) {
        throw new BadRequestException(\`Bid must be at least \${minBid} (current bid + increment)\`);
      }

      // Capture who is currently winning — they'll be outbid after this update
      const previousHighestBid = auction.bids[0] ?? null;
      const previousBidderId =
        previousHighestBid && previousHighestBid.bidderId !== bidderId
          ? previousHighestBid.bidderId
          : null;

      const bid = await tx.bid.create({
        data: { amount: new Decimal(amount), auctionId, bidderId },
        include: { bidder: { select: { id: true, username: true } } },
      });

      // Optimistic lock — succeeds only if currentBid is still what we read.
      // P2025 = "Record to update not found" → another bid won the race.
      let updatedAuction;
      try {
        updatedAuction = await tx.auction.update({
          where: {
            id: auctionId,
            currentBid: auction.currentBid, // optimistic lock on the value we read
          },
          data: {
            currentBid: new Decimal(amount),
            bidCount: { increment: 1 },
            // Anti-snipe: extend by 5 minutes if bid placed in last 5 minutes
            ...(now >= new Date(auction.endTime.getTime() - 5 * 60 * 1000) && {
              endTime: new Date(auction.endTime.getTime() + 5 * 60 * 1000),
            }),
          },
        });
      } catch (err: any) {
        if (err?.code === "P2025") {
          throw new BadRequestException(
            "The auction was updated by another bid just now. Please refresh and try again.",
          );
        }
        throw err;
      }

      return { bid, auction: updatedAuction, previousBidderId };
    }).then(async (result) => {
      // Post-transaction: broadcast + notify (don't hold the DB connection)
      this.bidsGateway.emitBidPlaced(auctionId, {
        bidId: result.bid.id,
        amount: Number(result.bid.amount),
        bidderUsername: result.bid.bidder.username,
        bidderId: result.bid.bidderId,
        bidCount: result.auction.bidCount,
        endTime: result.auction.endTime.toISOString(),
        createdAt: result.bid.createdAt.toISOString(),
      });

      if (result.previousBidderId) {
        const notification = await this.notificationsService.create(
          result.previousBidderId,
          "bid_outbid",
          "You've been outbid!",
          \`Someone placed a higher bid of €\${Number(result.bid.amount)} on "\${result.auction.title}". Bid again to stay in the lead!\`,
          \`/auction/\${auctionId}\`,
          { auctionId, newBidAmount: Number(result.bid.amount) },
        );

        this.notificationsGateway.emitToUser(result.previousBidderId, {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          read: notification.read,
          createdAt: notification.createdAt.toISOString(),
        });
      }

      return result;
    });
  }

  /**
   * Buy now — instant purchase, transactional.
   */
  async buyNow(auctionId: string, buyerId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({ where: { id: auctionId } });
      if (!auction) throw new NotFoundException(\`Auction with ID \${auctionId} not found\`);
      if (!auction.buyNowPrice) throw new BadRequestException("This auction does not have a buy now option");
      if (auction.listingType === "auction") {
        throw new BadRequestException("Buy now is not available for auction-only listings");
      }
      if (auction.status !== "active") throw new BadRequestException("Auction is not active");
      if (auction.sellerId === buyerId) throw new ForbiddenException("You cannot buy your own item");

      return tx.auction.update({
        where: { id: auctionId },
        data: { status: "sold", winnerId: buyerId, endTime: new Date() },
        include: {
          seller: { select: { id: true, username: true } },
          winner: { select: { id: true, username: true } },
        },
      });
    });
  }

  /**
   * Returns derived auction state for the UI — what the user can do, time left, etc.
   */
  async getAuctionStatus(auctionId: string, userId?: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { amount: "desc" },
          take: 1,
          include: { bidder: { select: { id: true } } },
        },
      },
    });
    if (!auction) throw new NotFoundException(\`Auction with ID \${auctionId} not found\`);

    const now = new Date();
    const isActive = auction.status === "active" && now >= auction.startTime && now < auction.endTime;
    const canBid = isActive && auction.listingType !== "buy_now" && auction.sellerId !== userId;
    const canBuyNow = isActive && auction.buyNowPrice !== null && auction.listingType !== "auction" && auction.sellerId !== userId;
    const minBid = Number(auction.currentBid) + Number(auction.bidIncrement);
    const endsIn = Math.max(0, auction.endTime.getTime() - now.getTime());
    const isWinning = userId ? auction.bids[0]?.bidder?.id === userId : false;

    return {
      canBid, canBuyNow, minBid,
      buyNowPrice: auction.buyNowPrice ? Number(auction.buyNowPrice) : null,
      endsIn, isActive,
      status: auction.status,
      isWinning,
    };
  }

  /**
   * Cron-driven: close all expired auctions, mark winners,
   * notify all participants in batch.
   */
  async closeExpiredAuctions() {
    const now = new Date();

    const expiredAuctions = await this.prisma.auction.findMany({
      where: { status: "active", endTime: { lte: now } },
      include: {
        bids: {
          orderBy: { amount: "desc" },
          select: { bidderId: true, amount: true },
        },
      },
    });

    const results = [];

    for (const auction of expiredAuctions) {
      if (auction.bids.length > 0) {
        const highestBid = auction.bids[0];
        await this.prisma.auction.update({
          where: { id: auction.id },
          data: { status: "sold", winnerId: highestBid.bidderId },
        });
        results.push({ id: auction.id, status: "sold", winnerId: highestBid.bidderId });

        // Notify each unique bidder — winner gets win msg, losers get loss msg
        const uniqueBidderIds = [...new Set(auction.bids.map((b) => b.bidderId))];
        for (const bidderId of uniqueBidderIds) {
          const isWinner = bidderId === highestBid.bidderId;
          const notification = await this.notificationsService.create(
            bidderId,
            isWinner ? "auction_won" : "auction_ended",
            isWinner ? "🏆 You won the auction!" : "Auction ended",
            isWinner
              ? \`Congratulations! You won "\${auction.title}" with a bid of €\${Number(highestBid.amount)}. Go to your purchases to complete the transaction.\`
              : \`The auction "\${auction.title}" has ended. Unfortunately you didn't win this time.\`,
            \`/auction/\${auction.id}\`,
            { auctionId: auction.id },
          );

          this.notificationsGateway.emitToUser(bidderId, {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            link: notification.link,
            read: notification.read,
            createdAt: notification.createdAt.toISOString(),
          });
        }
      } else {
        // No bids → just mark ended
        await this.prisma.auction.update({
          where: { id: auction.id },
          data: { status: "ended" },
        });
        results.push({ id: auction.id, status: "ended" });
      }
    }

    return { closed: results.length, auctions: results };
  }

  /**
   * IDOR-safe cancellation. Only the seller or an admin may cancel.
   * Logs denied attempts for security audit.
   */
  async cancelAuction(auctionId: string, requesterId: string, requesterRole: string) {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction) throw new NotFoundException(\`Auction \${auctionId} not found\`);

    if (auction.sellerId !== requesterId && requesterRole !== "admin") {
      console.warn("[security] IDOR deny — cancelAuction", {
        requesterId,
        ownerId: auction.sellerId,
        auctionId,
      });
      throw new ForbiddenException("You do not have permission to cancel this auction");
    }

    if (["ended", "sold", "cancelled"].includes(auction.status)) {
      throw new BadRequestException(\`Cannot cancel an auction with status "\${auction.status}"\`);
    }

    return this.prisma.auction.update({
      where: { id: auctionId },
      data: { status: "cancelled" },
    });
  }
}
`;
