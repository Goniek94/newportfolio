import { FileNode } from "./vscode/index";

export const backendFiles: FileNode = {
  name: "BACKEND",
  language: "json",
  isOpen: true,
  children: [
    {
      name: "adController.js",
      language: "javascript",
      content: `import Ad from "../../models/listings/ad.js";
import {
  getActiveStatusFilter,
  getActiveAdsCount,
} from "../../utils/listings/commonFilters.js";
import logger from "../../utils/logger.js";

class AdController {
  static async getAllAds(req, res, next) {
    try {
      const {
        page = 1,
        limit = 30,
        brand,
        model,
        minPrice,
        maxPrice,
        sortBy = "createdAt",
        order = "desc",
        listingType,
      } = req.query;

      const filter = { status: getActiveStatusFilter() };

      if (brand) filter.brand = brand;
      if (model) filter.model = model;
      if (minPrice)
        filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
      if (maxPrice)
        filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
      if (listingType) filter.listingType = listingType;

      const sortOptions = {};
      sortOptions[sortBy] = order === "desc" ? -1 : 1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const ads = await Ad.find(filter)
        .select(
          "_id brand model headline title description year price mileage fuelType transmission power images mainImage status listingType createdAt views favorites"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      const totalAds = await Ad.countDocuments(filter);

      res.status(200).json({
        ads,
        totalPages: Math.ceil(totalAds / parseInt(limit)),
        currentPage: parseInt(page),
        totalAds,
      });
    } catch (error) {
      logger.error("Error in getAllAds", { error: error.message });
      next(error);
    }
  }

  static async getAdById(req, res, next) {
    try {
      const { id } = req.params;

      const ad = await Ad.findById(id);

      if (!ad) {
        return res.status(404).json({
          success: false,
          message: "Ad not found",
        });
      }

      res.status(200).json({
        success: true,
        data: ad,
      });
    } catch (error) {
      logger.error("Error in getAdById", { error: error.message, adId: id });
      next(error);
    }
  }

  static async getActiveAdsCount(req, res, next) {
    try {
      const activeCount = await getActiveAdsCount(Ad);

      res.status(200).json({
        activeCount,
        message: \`Found \${activeCount} active ads in database\`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error in getActiveAdsCount", { error: error.message });
      next(error);
    }
  }

  static async searchAds(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 30;
      const skip = (page - 1) * limit;
      const { sortBy = "createdAt", order = "desc", sellerType } = req.query;

      logger.debug("Search request", { sortBy, order, sellerType });

      const activeFilter = { status: getActiveStatusFilter() };

      if (sellerType && sellerType !== "all") {
        activeFilter.sellerType = sellerType;
        logger.debug("Applied seller type filter", { sellerType });
      }

      const allAds = await Ad.find(activeFilter);
      logger.debug("Ads found after filters", { count: allAds.length });

      const adsWithScore = allAds.map((ad) => {
        const match_score = calculateMatchScore(ad, req.query);
        const is_featured = ad.listingType === "wyróżnione" ? 1 : 0;
        return {
          ...ad.toObject(),
          match_score,
          is_featured,
        };
      });

      adsWithScore.sort((a, b) => {
        if (b.is_featured !== a.is_featured)
          return b.is_featured - a.is_featured;

        let comparison = 0;

        switch (sortBy) {
          case "price":
            comparison = (a.price || 0) - (b.price || 0);
            break;
          case "year":
            comparison = (a.year || 0) - (b.year || 0);
            break;
          case "mileage":
            comparison = (a.mileage || 0) - (b.mileage || 0);
            break;
          case "createdAt":
          default:
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
            break;
        }

        const sortMultiplier = order === "desc" ? -1 : 1;
        comparison *= sortMultiplier;

        if (comparison === 0) {
          if (b.match_score !== a.match_score)
            return b.match_score - a.match_score;

          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return comparison;
      });

      logger.debug("Sorting completed", {
        total: adsWithScore.length,
        sortBy,
        order,
      });

      const paginatedAds = adsWithScore.slice(skip, skip + limit);

      res.status(200).json({
        ads: paginatedAds,
        currentPage: page,
        totalPages: Math.ceil(adsWithScore.length / limit),
        totalAds: adsWithScore.length,
      });
    } catch (error) {
      logger.error("Error in searchAds", { error: error.message });
      next(error);
    }
  }

  static async getBrands(req, res, next) {
    try {
      const activeFilter = { status: getActiveStatusFilter() };
      const brands = await Ad.distinct("brand", activeFilter);

      res
        .status(200)
        .json(brands.filter((brand) => brand && brand.trim() !== ""));
    } catch (error) {
      logger.error("Error in getBrands", { error: error.message });
      next(error);
    }
  }

  static async getModels(req, res, next) {
    try {
      const { brand } = req.query;

      if (!brand) {
        return res.status(400).json({
          message: "Brand parameter is required",
        });
      }

      const activeFilter = {
        brand,
        status: getActiveStatusFilter(),
      };
      const models = await Ad.distinct("model", activeFilter);

      res
        .status(200)
        .json(models.filter((model) => model && model.trim() !== ""));
    } catch (error) {
      logger.error("Error in getModels", { error: error.message, brand });
      next(error);
    }
  }

  static async getSimilarAds(req, res, next) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 6;

      const currentAd = await Ad.findById(id);
      if (!currentAd) {
        return res.status(404).json({
          success: false,
          message: "Ad not found",
        });
      }

      const activeFilter = {
        status: getActiveStatusFilter(),
        _id: { $ne: id },
      };

      const searchCriteria = [
        {
          ...activeFilter,
          brand: currentAd.brand,
          model: currentAd.model,
          bodyType: currentAd.bodyType,
        },
        {
          ...activeFilter,
          brand: currentAd.brand,
          model: currentAd.model,
        },
        {
          ...activeFilter,
          brand: currentAd.brand,
          bodyType: currentAd.bodyType,
        },
        {
          ...activeFilter,
          brand: currentAd.brand,
        },
      ];

      let similarAds = [];

      for (const criteria of searchCriteria) {
        if (similarAds.length >= limit) break;

        const remainingLimit = limit - similarAds.length;
        const foundAds = await Ad.find(criteria)
          .limit(remainingLimit)
          .sort({ createdAt: -1 })
          .select(
            "_id headline brand model year price mileage fuelType mainImage images listingType createdAt bodyType"
          );

        const existingIds = new Set(similarAds.map((ad) => ad._id.toString()));
        const newAds = foundAds.filter(
          (ad) => !existingIds.has(ad._id.toString())
        );

        similarAds.push(...newAds);
      }

      similarAds = similarAds.slice(0, limit);

      logger.debug("Similar ads found", {
        adId: id,
        count: similarAds.length,
      });

      res.status(200).json({
        success: true,
        data: similarAds,
        count: similarAds.length,
      });
    } catch (error) {
      logger.error("Error in getSimilarAds", {
        error: error.message,
        adId: id,
      });
      next(error);
    }
  }
}

function calculateMatchScore(ad, filters) {
  let score = 0;

  const normalize = (str) =>
    typeof str === "string" ? str.trim().toLowerCase() : "";

  if (
    filters.brand &&
    filters.model &&
    normalize(ad.brand) === normalize(filters.brand) &&
    normalize(ad.model) === normalize(filters.model)
  ) {
    score += 100;
  } else if (
    filters.brand &&
    normalize(ad.brand) === normalize(filters.brand)
  ) {
    score += 50;
  }

  if (
    filters.minPrice &&
    filters.maxPrice &&
    ad.price >= parseFloat(filters.minPrice) &&
    ad.price <= parseFloat(filters.maxPrice)
  ) {
    score += 30;
  } else if (filters.minPrice && ad.price >= parseFloat(filters.minPrice)) {
    score += 15;
  } else if (filters.maxPrice && ad.price <= parseFloat(filters.maxPrice)) {
    score += 15;
  }

  if (
    filters.minYear &&
    filters.maxYear &&
    ad.year >= parseInt(filters.minYear) &&
    ad.year <= parseInt(filters.maxYear)
  ) {
    score += 20;
  }

  if (
    filters.fuelType &&
    normalize(ad.fuelType) === normalize(filters.fuelType)
  ) {
    score += 10;
  }
  if (
    filters.transmission &&
    normalize(ad.transmission) === normalize(filters.transmission)
  ) {
    score += 5;
  }
  if (
    filters.bodyType &&
    normalize(ad.bodyType) === normalize(filters.bodyType)
  ) {
    score += 5;
  }

  return score;
}

export default AdController;`,
    },
    // ... POZOSTAŁE PLIKI (conversations.js, profileController.js itd.) BEZ ZMIAN ...
    {
      name: "conversations.js",
      language: "javascript",
      content: `import Message from "../../models/communication/message.js";
import User from "../../models/user/user.js";
import mongoose from "mongoose";
import notificationManager from "../../services/notificationManager.js";
import logger from "../../utils/logger.js";

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adId, page = 1, limit = 50 } = req.query;
    const currentUserId = req.user.userId;

    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    const otherUserObjectId = new mongoose.Types.ObjectId(userId);

    const otherUser = await User.findById(otherUserObjectId);
    if (!otherUser) return res.status(404).json({ message: "User not found" });

    let messageQuery = {
      $or: [
        { sender: currentUserObjectId, recipient: otherUserObjectId, deletedBy: { $nin: [currentUserObjectId] } },
        { sender: otherUserObjectId, recipient: currentUserObjectId, deletedBy: { $nin: [currentUserObjectId] } },
      ],
    };

    if (adId && adId !== "no-ad") {
      messageQuery.relatedAd = new mongoose.Types.ObjectId(adId);
    } else if (adId === "no-ad") {
      messageQuery.relatedAd = { $exists: false };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [messages, totalCount] = await Promise.all([
      Message.find(messageQuery)
        .populate("sender", "name email")
        .populate("recipient", "name email")
        .populate("relatedAd", "headline brand model")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Message.countDocuments(messageQuery),
    ]);

    messages.reverse();

    const unreadMessages = messages.filter(msg => msg.recipient._id.toString() === currentUserId && !msg.read);
    if (unreadMessages.length > 0) {
      await Message.updateMany({ _id: { $in: unreadMessages.map(msg => msg._id) } }, { read: true });
    }

    res.status(200).json({
      otherUser: { id: otherUser._id, name: otherUser.name, email: otherUser.email },
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalMessages: totalCount
      }
    });
  } catch (error) {
    logger.error("Error fetching conversation", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

export const replyToConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { content, adId } = req.body;
    const senderId = req.user.userId;

    if (senderId === userId) return res.status(400).json({ message: "Cannot send message to yourself" });

    const recipient = await User.findById(userId);
    const sender = await User.findById(senderId);
    if (!recipient || !sender) return res.status(404).json({ message: "User not found" });

    const messageData = { sender: senderId, recipient: userId, content, attachments: [] };

    if (adId && adId !== "no-ad") {
      const ad = await Ad.findById(adId);
      if (ad) {
        messageData.relatedAd = adId;
        messageData.subject = \`Message about: \${ad.headline}\`;
      }
    }

    const newMessage = new Message(messageData);
    await newMessage.save();

    try {
      await notificationManager.notifyNewMessage(userId, sender.name, messageData.subject);
    } catch (e) {
      logger.error("Notification error", e);
    }

    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    logger.error("Error sending message", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

export const getConversationsList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { folder } = req.query;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    let query = {
      $or: [
        { sender: userObjectId, deletedBy: { $nin: [userObjectId] } },
        { recipient: userObjectId, deletedBy: { $nin: [userObjectId] } },
      ],
    };

    if (folder === 'inbox') query = { recipient: userObjectId, deletedBy: { $nin: [userObjectId] } };
    if (folder === 'sent') query = { sender: userObjectId, deletedBy: { $nin: [userObjectId] } };

    const messages = await Message.find(query)
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .populate("relatedAd", "headline brand model")
      .sort({ createdAt: -1 })
      .lean();

    const conversationsByUser = {};
    messages.forEach((msg) => {
      const otherUserId = msg.sender._id.toString() === userId ? msg.recipient._id.toString() : msg.sender._id.toString();
      const adId = msg.relatedAd ? msg.relatedAd._id.toString() : "no-ad";
      const key = \`\${otherUserId}:\${adId}\`;

      if (!conversationsByUser[key]) {
        conversationsByUser[key] = {
          user: msg.sender._id.toString() === userId ? msg.recipient : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      
      if (msg.recipient._id.toString() === userId && !msg.read) {
        conversationsByUser[key].unreadCount++;
      }
    });

    const conversations = Object.values(conversationsByUser).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
    return res.status(200).json({ conversations });
  } catch (error) {
    logger.error("Error fetching conversations list", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};`,
    },
    {
      name: "profileController.js",
      language: "javascript",
      content: `import { validationResult } from "express-validator";
import User from "../../models/user/user.js";
import logger from "../../utils/logger.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Not authenticated" });

    const dbUser = await User.findById(user.userId).select("-password");
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });

    if (dbUser.status === "suspended") {
      return res.status(403).json({ success: false, message: "Account suspended" });
    }

    const profileData = {
      id: dbUser._id,
      name: dbUser.name,
      lastName: dbUser.lastName,
      email: dbUser.email,
      phoneNumber: dbUser.phoneNumber,
      role: dbUser.role,
      isVerified: dbUser.isVerified,
      createdAt: dbUser.createdAt,
      lastLogin: dbUser.lastLogin,
      registrationType: dbUser.registrationType,
      notificationPreferences: dbUser.notificationPreferences
    };

    return res.status(200).json({ success: true, user: profileData });
  } catch (error) {
    logger.error("Get profile error", { error: error.message });
    return next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const userId = req.user.userId;
    const { name, lastName } = req.body;
    const user = await User.findById(userId);

    if (name) user.name = name.trim();
    if (lastName) user.lastName = lastName.trim();

    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated", user: { name: user.name, lastName: user.lastName } });
  } catch (error) {
    logger.error("Update profile error", { error: error.message });
    return next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      const { generateResetToken, sendPasswordResetEmail } = await import("../../services/emailService.js");
      const resetToken = generateResetToken();
      
      user.passwordResetToken = resetToken;
      user.passwordResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    }

    return res.status(200).json({ success: true, message: "If account exists, password reset link has been sent" });
  } catch (error) {
    logger.error("Request password reset error", { error: error.message });
    return res.status(200).json({ success: true, message: "If account exists, password reset link has been sent" });
  }
};`,
    },
    {
      name: "rateLimiting.js",
      language: "javascript",
      content: `import rateLimit from "express-rate-limit";
import crypto from "crypto";
import logger from "../utils/logger.js";

const isProd = process.env.NODE_ENV === "production";
const secret = process.env.RL_SECRET || "change-me-in-production";

if (isProd && secret === "change-me-in-production") {
  throw new Error("RL_SECRET must be set in production");
}

const normalizeIp = (ip) => (ip === "::1" ? "127.0.0.1" : ip || "unknown");
const getClientIp = (req) => normalizeIp(req.ip);
const hashEmail = (e = "") => crypto.createHmac("sha256", secret).update(String(e).toLowerCase().trim()).digest("base64url");

const makeLimiter = ({ windowMs, max, keyGenerator, code, message, skipSuccessful }) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: skipSuccessful || false,
    handler: (req, res) => {
      const retryAfterSec = Math.ceil(windowMs / 1000);
      return res.status(429).json({ success: false, error: message, code, retryAfter: retryAfterSec });
    },
  });

const emailAwareKey = (req) => \`\${getClientIp(req)}:\${hashEmail(req.body?.email || "")}\`;
const ipOnlyKey = (req) => getClientIp(req);

export const apiLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 600,
  keyGenerator: ipOnlyKey,
  code: "API_RATE_LIMIT_EXCEEDED",
  message: "Too many requests.",
});

export const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: emailAwareKey,
  code: "AUTH_LIMIT_EXCEEDED",
  message: "Too many login attempts.",
  skipSuccessful: true,
});

export const messageRateLimiter = makeLimiter({
  windowMs: 5 * 1000,
  max: 1,
  keyGenerator: (req) => req.user?.userId || ipOnlyKey(req),
  code: "MSG_LIMIT",
  message: "Please wait before sending another message.",
});

export default { apiLimiter, authLimiter, messageRateLimiter };`,
    },
    {
      name: "socketService.js",
      language: "javascript",
      content: `import { Server } from "socket.io";
import logger from "../utils/logger.js";
import config from "../config/index.js";
import SocketAuth from "./socket/SocketAuth.js";
import SocketConnectionManager from "./socket/SocketConnectionManager.js";
import SocketConversationManager from "./socket/SocketConversationManager.js";
import SocketNotificationManager from "./socket/SocketNotificationManager.js";
import SocketHeartbeatManager from "./socket/SocketHeartbeatManager.js";

class SocketService {
  constructor() {
    this.io = null;
    this.connectionManager = new SocketConnectionManager();
    this.conversationManager = new SocketConversationManager();
    this.notificationManager = null;
    this.heartbeatManager = null;
  }

  initialize(server) {
    if (this.io) return this.io;

    this.io = new Server(server, {
      cors: {
        origin: config.security?.cors?.origin || ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
      },
    });

    this.notificationManager = new SocketNotificationManager(this.io, this.connectionManager);
    this.heartbeatManager = new SocketHeartbeatManager(this.io, this.connectionManager, this.conversationManager);

    this.io.use(SocketAuth.authMiddleware);
    this.io.on("connection", this.handleConnection.bind(this));
    this.heartbeatManager.startHeartbeat();

    logger.info("Socket.IO initialized successfully");
    return this.io;
  }

  handleConnection(socket) {
    const connectionAdded = this.connectionManager.addConnection(socket, this.io);
    if (!connectionAdded) return;

    socket.on("disconnect", () => {
      this.connectionManager.removeConnection(socket);
    });

    socket.on("conversation:opened", async (data) => {
      await this.conversationManager.handleConversationOpened(socket, data);
    });

    socket.on("conversation:closed", async (data) => {
      await this.conversationManager.handleConversationClosed(socket, data);
    });
  }

  sendNotification(userId, notification) {
    return this.notificationManager?.sendNotification(userId, notification);
  }

  isUserOnline(userId) {
    return this.connectionManager.isUserOnline(userId);
  }

  shutdown() {
    if (this.io) {
      this.io.close();
      this.io = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;`,
    },
  ],
};
