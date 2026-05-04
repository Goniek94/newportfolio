export const notificationsGatewayCode = `import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/notifications",
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<{ userId: string }>(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.userId;
      if (!userId) {
        client.disconnect();
        return;
      }

      // Join user-specific room so we can target them directly
      await client.join(\`user:\${userId}\`);
      (client as Socket & { userId?: string }).userId = userId;

      this.logger.debug(\`[Notifications] User \${userId} connected\`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as Socket & { userId?: string }).userId;
    if (userId) {
      this.logger.debug(\`[Notifications] User \${userId} disconnected\`);
    }
  }

  /**
   * Emit a real-time notification to a specific user.
   * Call this from services after persisting to DB.
   */
  emitToUser(
    userId: string,
    notification: {
      id: string;
      type: string;
      title: string;
      message: string;
      link: string | null;
      read: boolean;
      createdAt: string;
    },
  ) {
    this.server.to(\`user:\${userId}\`).emit("notification", notification);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private extractToken(client: Socket): string | null {
    // 1. Try cookie header (withCredentials: true from frontend)
    const cookieHeader = client.handshake?.headers?.cookie;
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\\s*)token=([^;]+)/);
      if (match?.[1]) return match[1];
    }

    // 2. Try auth object (socket.io auth option)
    const authToken = (client.handshake?.auth as Record<string, string>)?.token;
    if (authToken) return authToken;

    // 3. Try Authorization header
    const authHeader = client.handshake?.headers?.authorization;
    if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

    return null;
  }
}
`;
