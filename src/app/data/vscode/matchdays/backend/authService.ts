export const authServiceCode = `import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Register new user
   * Frontend sends: firstName, lastName, birthDate, country, email, phone, password, confirmPassword
   */
  async register(registerDto: RegisterDto, req: any) {
    const {
      firstName, lastName, birthDate, country, email, phone,
      password, confirmPassword, username,
    } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const existingUserByEmail = await this.usersService.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException("An account with this email already exists");
    }

    // Generate username if not provided — random suffix collisions are rare,
    // but we retry once with more entropy just in case.
    let finalUsername = username;
    if (!finalUsername) {
      finalUsername = \`\${firstName.toLowerCase()}\${Math.floor(Math.random() * 10000)}\`;
    }

    const existingUserByUsername = await this.usersService.findByUsername(finalUsername);
    if (existingUserByUsername) {
      if (!username) {
        finalUsername = \`\${firstName.toLowerCase()}\${Math.floor(Math.random() * 100000)}\`;
      } else {
        throw new ConflictException("This username is already taken");
      }
    }

    // Age check — must be at least 16
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    if (age < 16) {
      throw new BadRequestException("You must be at least 16 years old to register");
    }

    const newUser = await this.usersService.create({
      name: firstName.trim(),
      lastName: lastName?.trim(),
      email: email.toLowerCase().trim(),
      password, // hashed by @BeforeInsert
      username: finalUsername.trim(),
      birthDate: birthDateObj,
      country: country.toUpperCase(),
      phone: phone.trim(),
      isVerified: true,
      role: "user",
      status: "active",
      lastIP: req.ip,
      lastActivity: new Date(),
      failedLoginAttempts: 0,
      accountLocked: false,
    });

    const tokens = this.generateTokens(newUser.id, newUser.role);
    return { user: newUser.toPublicProfile(), ...tokens };
  }

  /**
   * Login with enterprise security:
   *  - Active ban check
   *  - Auto-unlock after lock window expires
   *  - Account lockout after 4 failed attempts (15min)
   *  - Login history tracking (IP + user-agent)
   */
  async login(loginDto: LoginDto, req: any) {
    const { emailOrUsername, password } = loginDto;
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // Find by email OR username (case-insensitive)
    let userRaw = await this.usersService.findByEmail(emailOrUsername.toLowerCase().trim());
    if (!userRaw) {
      userRaw = await this.usersService.findByUsername(emailOrUsername.toLowerCase().trim());
    }
    if (!userRaw) {
      // No userId yet → can't log to LoginHistory
      throw new UnauthorizedException("Invalid email/username or password");
    }

    const user = await this.usersService.toUserWithMethods(userRaw);

    // Active ban (separate model — can be permanent or temporary)
    const activeBan = await this.usersService.getActiveBan(user.id);
    if (activeBan) {
      await this.usersService.logLoginAttempt({
        userId: user.id,
        success: false,
        ipAddress, userAgent,
        failureReason: "account_banned",
      });

      const banMessage = activeBan.type === "permanent"
        ? "Your account has been permanently banned."
        : \`Your account is banned until \${new Date(activeBan.endDate!).toLocaleString("en-GB")}.\`;
      throw new UnauthorizedException(\`\${banMessage} Reason: \${activeBan.reason}\`);
    }

    // Temporary lock from failed attempts — auto-unlock after window
    if (user.accountLocked) {
      const lockTime = user.lockUntil;
      if (lockTime && lockTime > new Date()) {
        const remainingTime = Math.ceil((lockTime.getTime() - Date.now()) / (1000 * 60));
        throw new UnauthorizedException(\`Account is locked. Try again in \${remainingTime} minutes.\`);
      } else {
        await this.usersService.update(user.id, {
          accountLocked: false,
          failedLoginAttempts: 0,
          lockUntil: null,
        });
      }
    }

    if (user.status === "suspended" || user.status === "banned") {
      throw new UnauthorizedException("Your account has been suspended. Please contact support.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      await this.usersService.logLoginAttempt({
        userId: user.id,
        success: false,
        ipAddress, userAgent,
        failureReason: "wrong_password",
      });

      const failedAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock after 4 attempts for 15 minutes
      if (failedAttempts >= 4) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await this.usersService.update(user.id, {
          failedLoginAttempts: failedAttempts,
          accountLocked: true,
          lockUntil,
        });

        await this.usersService.logLoginAttempt({
          userId: user.id,
          success: false,
          ipAddress, userAgent,
          failureReason: "account_locked_too_many_attempts",
        });

        throw new UnauthorizedException(
          "Account locked for 15 minutes due to too many failed login attempts.",
        );
      }

      await this.usersService.update(user.id, { failedLoginAttempts: failedAttempts });
      const attemptsLeft = 4 - failedAttempts;
      throw new UnauthorizedException(
        \`Invalid email or password. \${attemptsLeft} \${attemptsLeft === 1 ? "attempt" : "attempts"} remaining.\`,
      );
    }

    // Successful login — reset counters, log success
    await this.usersService.update(user.id, {
      failedLoginAttempts: 0,
      lastLogin: new Date(),
      lastActivity: new Date(),
      lastIP: ipAddress,
    });

    await this.usersService.logLoginAttempt({
      userId: user.id,
      success: true,
      ipAddress, userAgent,
    });

    const tokens = this.generateTokens(user.id, user.role);
    return { user: user.toPublicProfile(), ...tokens };
  }

  /**
   * Generate access (15min) + refresh (7d) JWTs.
   */
  private generateTokens(userId: string, role: string) {
    const payload = { userId, role, type: "access" };
    const refreshPayload = { userId, role, type: "refresh" };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_SECRET"),
      expiresIn: this.configService.get("JWT_EXPIRES_IN", "15m"),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", "7d"),
    });

    return { accessToken, refreshToken };
  }

  /**
   * Set HTTP-only, sameSite:strict cookies. Secure in production only.
   */
  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = this.configService.get("NODE_ENV") === "production";

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
  }

  /**
   * Refresh access token. Also auto-downgrades expired paid subscriptions
   * so the new token always reflects the user's current plan.
   */
  async refreshToken(refreshToken: string, req: any) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });

      const user = await this.usersService.findById(payload.userId);

      if (user.status === "suspended" || user.status === "banned") {
        throw new UnauthorizedException("User account suspended");
      }

      // Auto-downgrade lapsed subscriptions
      if (
        user.subscriptionTier !== "free" &&
        user.subscriptionExpiry &&
        new Date(user.subscriptionExpiry) < new Date()
      ) {
        await this.usersService.update(user.id, {
          subscriptionTier: "free",
          subscriptionExpiry: null,
        });
      }

      const tokens = this.generateTokens(user.id, user.role);

      await this.usersService.update(user.id, {
        lastActivity: new Date(),
        lastIP: req.ip,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
`;
