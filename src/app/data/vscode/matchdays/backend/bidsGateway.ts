export const bidsGatewayCode = `import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/",
})
export class BidsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(\`[WS] Client connected: \${client.id}\`);
  }

  handleDisconnect(client: Socket) {
    console.log(\`[WS] Client disconnected: \${client.id}\`);
  }

  @SubscribeMessage("join-auction")
  handleJoinAuction(
    @MessageBody() auctionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(\`auction:\${auctionId}\`);
    return { event: "joined", data: auctionId };
  }

  @SubscribeMessage("leave-auction")
  handleLeaveAuction(
    @MessageBody() auctionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(\`auction:\${auctionId}\`);
    return { event: "left", data: auctionId };
  }

  /** Called by AuctionsService after a bid is successfully placed */
  emitBidPlaced(
    auctionId: string,
    payload: {
      bidId: string;
      amount: number;
      bidderUsername: string;
      bidderId: string;
      bidCount: number;
      endTime: string;
      createdAt: string;
    },
  ) {
    this.server.to(\`auction:\${auctionId}\`).emit("bid:placed", payload);
  }
}
`;
