import { FileNode } from "../index";

// ============================================
// MATCHDAYS — SPORTS AUCTION MARKETPLACE
// Next.js 14 · NestJS · PostgreSQL · Socket.IO
// ============================================

const matchdaysFrontend: FileNode = {
  name: "FRONTEND (Next.js 14)",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "AuctionCard.tsx",
      language: "typescript",
      content: `"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useAuctionStore } from "@/store/auctionStore";

// Auction card with live bid updates via Zustand store
// Re-renders automatically when a new bid is placed via WebSocket
interface AuctionCardProps {
  auction: {
    id: string;
    title: string;
    team: string;
    sport: string;
    currentBid: number;
    endTime: string;
    imageUrl: string;
    bidCount: number;
    verified: boolean;
  };
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const liveBid = useAuctionStore((s) => s.bids[auction.id]);
  const currentBid = liveBid ?? auction.currentBid;
  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Verified badge */}
      {auction.verified && (
        <div className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          Verified
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{auction.sport} · {auction.team}</p>
          <h3 className="font-black text-gray-900 text-lg leading-tight mt-0.5">{auction.title}</h3>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Current bid</p>
            <p className="text-2xl font-black text-gray-900">{currentBid.toFixed(0)} PLN</p>
            <p className="text-xs text-gray-400 mt-0.5">{auction.bidCount} bids · ends {timeLeft}</p>
          </div>
          <button className="bg-black text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
            Bid Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}`,
    },
    {
      name: "useAuctionSocket.ts",
      language: "typescript",
      content: `import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuctionStore } from "@/store/auctionStore";

// Custom hook — connects to NestJS WebSocket Gateway
// Joins auction-specific room, syncs Zustand store on every bid event
export function useAuctionSocket(auctionId: string) {
  const socketRef = useRef<Socket | null>(null);
  const { updateBid, setConnected } = useAuctionStore();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join:auction", { auctionId });
    });

    // Live bid — updates Zustand, triggers AuctionCard re-render
    socket.on("bid:placed", (data: { amount: number; bidder: string }) => {
      updateBid(auctionId, data.amount, data.bidder);
    });

    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.emit("leave:auction", { auctionId });
      socket.disconnect();
    };
  }, [auctionId]);

  return socketRef.current;
}`,
    },
    {
      name: "auctionStore.ts",
      language: "typescript",
      content: `import { create } from "zustand";

// Global Zustand store for real-time auction state
// Updated by WebSocket events — no polling required
interface AuctionState {
  bids: Record<string, number>;
  isConnected: boolean;
  updateBid: (auctionId: string, amount: number, bidder: string) => void;
  setConnected: (status: boolean) => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  bids: {},
  isConnected: false,

  updateBid: (auctionId, amount) =>
    set((state) => ({
      bids: { ...state.bids, [auctionId]: amount },
    })),

  setConnected: (status) => set({ isConnected: status }),
}));`,
    },
  ],
};

const matchdaysBackend: FileNode = {
  name: "BACKEND (NestJS)",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "auctions.service.ts",
      language: "typescript",
      content: `import { Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuctionsGateway } from "./auctions.gateway";

// Bid placement with Prisma transaction
// Prevents race conditions under concurrent bids
@Injectable()
export class AuctionsService {
  constructor(
    private prisma: PrismaService,
    private gateway: AuctionsGateway,
  ) {}

  async placeBid(auctionId: string, bidderId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({
        where: { id: auctionId },
        select: { currentBid: true, status: true, sellerId: true, endTime: true },
      });

      if (!auction || auction.status !== "active")
        throw new BadRequestException("Auction is not active");

      if (auction.sellerId === bidderId)
        throw new ForbiddenException("Cannot bid on your own auction");

      if (new Date() > auction.endTime)
        throw new BadRequestException("Auction has ended");

      const minBid = Number(auction.currentBid) + 5;
      if (amount < minBid)
        throw new BadRequestException(\`Minimum bid is \${minBid} PLN\`);

      // Atomic update — bid + auction price in one transaction
      const [bid, updated] = await Promise.all([
        tx.bid.create({ data: { auctionId, bidderId, amount } }),
        tx.auction.update({
          where: { id: auctionId },
          data: { currentBid: amount, bidCount: { increment: 1 } },
        }),
      ]);

      // Broadcast to all clients in this auction's room
      this.gateway.broadcastBid(auctionId, { amount, bidderId });

      return { bid, currentBid: updated.currentBid };
    });
  }
}`,
    },
    {
      name: "auctions.gateway.ts",
      language: "typescript",
      content: `import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "../auth/guards/ws-jwt.guard";

// NestJS WebSocket Gateway — per-auction rooms
// JWT-authenticated connections, targeted broadcasts
@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL, credentials: true } })
export class AuctionsGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("join:auction")
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionId: string }) {
    client.join(\`auction:\${data.auctionId}\`);
  }

  @SubscribeMessage("leave:auction")
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionId: string }) {
    client.leave(\`auction:\${data.auctionId}\`);
  }

  // Called by AuctionsService after a successful bid transaction
  broadcastBid(auctionId: string, payload: { amount: number; bidderId: string }) {
    this.server.to(\`auction:\${auctionId}\`).emit("bid:placed", payload);
  }
}`,
    },
    {
      name: "schema.prisma",
      language: "prisma",
      content: `// Prisma schema — PostgreSQL relational model
// Key relations: User → Auctions → Bids

model User {
  id                  String    @id @default(uuid())
  email               String    @unique
  username            String    @unique
  password            String
  role                String    @default("user")
  rating              Float     @default(0)
  stripeAccountId     String?
  failedLoginAttempts Int       @default(0)
  accountLocked       Boolean   @default(false)
  lockUntil           DateTime?
  createdAt           DateTime  @default(now())

  createdAuctions     Auction[] @relation("SellerAuctions")
  wonAuctions         Auction[] @relation("WinnerAuctions")
  bids                Bid[]

  @@map("users")
}

model Auction {
  id           String   @id @default(uuid())
  title        String
  category     String
  itemType     String   @default("shirt")
  team         String
  sport        String
  startingBid  Decimal  @db.Decimal(10, 2)
  currentBid   Decimal  @db.Decimal(10, 2)
  buyNowPrice  Decimal? @db.Decimal(10, 2)
  bidCount     Int      @default(0)
  status       String   @default("active")
  verified     Boolean  @default(false)
  endTime      DateTime
  sellerId     String
  winnerId     String?

  seller       User     @relation("SellerAuctions", fields: [sellerId], references: [id])
  winner       User?    @relation("WinnerAuctions", fields: [winnerId], references: [id])
  bids         Bid[]

  @@index([status, endTime])
  @@map("auctions")
}

model Bid {
  id        String   @id @default(uuid())
  amount    Decimal  @db.Decimal(10, 2)
  auctionId String
  bidderId  String
  createdAt DateTime @default(now())

  auction   Auction  @relation(fields: [auctionId], references: [id], onDelete: Cascade)
  bidder    User     @relation(fields: [bidderId], references: [id])

  @@index([auctionId])
  @@map("bids")
}`,
    },
  ],
};

export const matchdaysFiles: FileNode[] = [
  matchdaysFrontend,
  matchdaysBackend,
  {
    name: "README.md",
    language: "markdown",
    content: `# Matchdays — Sports Auction Marketplace

## Overview
Full-stack sports memorabilia auction platform. Users list, bid on, and buy
authenticated football jerseys and collectibles in real time.

> 🔴 **Live:** [www.matchdaysproject.vercel.app](https://www.matchdaysproject.vercel.app)
> Register and test the platform — bidding, messaging, and AI Legit Check are live.

---

## Architecture

### Frontend — Next.js 14 (App Router)
- **Framework:** Next.js 14 · App Router · Server Components
- **State:** Zustand (real-time auction state) · TanStack Query (server state)
- **Real-time:** Socket.IO client — live bid updates, auction countdowns
- **UI:** Tailwind CSS · shadcn/ui · Framer Motion
- **Auth:** JWT stored in httpOnly cookies

### Backend — NestJS
- **Framework:** NestJS 10 — modular architecture
- **Database:** PostgreSQL · Prisma ORM
- **Real-time:** Socket.IO Gateway — per-auction rooms, JWT-authenticated
- **Auth:** JWT Access Token (15min) + Refresh Token (7d, httpOnly)
  - Account lockout after 4 failed attempts
- **Payments:** Stripe Connect — marketplace payouts to sellers
- **AI:** Google Gemini — jersey authenticity verification
- **Queue:** Bull + Redis — auction timers, email notifications

---

## Key Features
- 🏆 Real-time bidding — WebSocket rooms per auction
- 🤖 AI Legit Check — Google Gemini jersey verification
- 💬 Buyer/seller messaging linked to auctions
- 💳 Stripe Connect — secure marketplace payments
- 🔐 JWT auth with account lockout protection

---

## Stack
\`\`\`
Frontend:  Next.js 14 · TypeScript · Zustand · Socket.IO · Tailwind · Framer Motion
Backend:   NestJS · TypeScript · Prisma · PostgreSQL · Socket.IO · Redis · Bull
Services:  Stripe Connect · Google Gemini AI · Supabase Storage
Deploy:    Vercel (frontend) · Railway (backend + DB + Redis)
\`\`\`
`,
  },
];
