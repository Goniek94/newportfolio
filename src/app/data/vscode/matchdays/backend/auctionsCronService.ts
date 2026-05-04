export const auctionsCronServiceCode = `import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuctionsService } from "./auctions.service";

@Injectable()
export class AuctionsCronService {
  private readonly logger = new Logger(AuctionsCronService.name);

  constructor(private readonly auctionsService: AuctionsService) {}

  /**
   * Close expired auctions every minute.
   * Marks winners, notifies all participants, broadcasts to WS.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCloseExpiredAuctions() {
    this.logger.log("Running cron job: Close expired auctions");

    try {
      const result = await this.auctionsService.closeExpiredAuctions();

      if (result.closed > 0) {
        this.logger.log(\`Closed \${result.closed} expired auctions\`);
        this.logger.debug(\`Details: \${JSON.stringify(result.auctions)}\`);
      }
    } catch (error) {
      this.logger.error(\`Error closing expired auctions: \${error.message}\`);
    }
  }
}
`;
