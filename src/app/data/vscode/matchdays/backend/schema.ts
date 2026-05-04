export const schemaCode = `// Prisma schema — Supabase PostgreSQL
// Real production schema, trimmed for the showcase

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─── User ────────────────────────────────────────────────────────────────────

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String

  // Profile
  name      String?
  lastName  String?
  birthDate DateTime?
  country   String?
  phone     String?
  avatar    String?

  // Gamification
  level              Int       @default(1)
  experience         Int       @default(0)
  totalPoints        Int       @default(0)
  reputationScore    Float     @default(0)
  subscriptionTier   String    @default("free") // free | basic | premium | vip
  subscriptionExpiry DateTime?

  // Seller stats
  rating              Float    @default(0)
  reviews             Int      @default(0)
  sales               Int      @default(0)
  positivePercentage  Float    @default(100)

  // Security
  isVerified           Boolean   @default(false)
  status               String    @default("active") // active | suspended | banned
  role                 String    @default("user")   // user | admin
  failedLoginAttempts  Int       @default(0)
  accountLocked        Boolean   @default(false)
  lockUntil            DateTime?
  lastLogin            DateTime?
  lastIP               String?

  // Stripe Connect
  stripeCustomerId         String?
  stripeAccountId          String?
  stripeOnboardingComplete Boolean @default(false)

  // AI usage credits
  aiCredits Int @default(0)

  // Relations
  createdAuctions Auction[]      @relation("SellerAuctions")
  wonAuctions     Auction[]      @relation("WinnerAuctions")
  bids            Bid[]
  notifications   Notification[]
  loginHistory    LoginHistory[]
  warnings        Warning[]
  bans            Ban[]
  paymentOrders   PaymentOrder[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// ─── Auctions ────────────────────────────────────────────────────────────────

model Auction {
  id          String @id @default(uuid())
  title       String
  description String

  category    String
  itemType    String @default("shirt")    // shirt | shoes | pants | accessory
  listingType String @default("auction")  // auction | buy_now

  team         String
  season       String
  size         String
  condition    String
  manufacturer String?
  playerName   String?
  playerNumber String?
  images       String[]

  // Pricing — Decimal(10, 2) for precision
  startingBid  Decimal  @db.Decimal(10, 2)
  currentBid   Decimal  @db.Decimal(10, 2)
  bidIncrement Decimal  @default(5) @db.Decimal(10, 2)
  buyNowPrice  Decimal? @db.Decimal(10, 2)
  bidCount     Int      @default(0)

  // Timing
  startTime DateTime
  endTime   DateTime

  // Status
  status   String  @default("active") // upcoming | active | ended | sold | cancelled
  verified Boolean @default(false)
  rare     Boolean @default(false)
  featured Boolean @default(false)
  views    Int     @default(0)

  // AI / Expert verification
  expertVerified     Boolean  @default(false)
  expertNote         String?
  verificationStatus String?  // AI_VERIFIED_HIGH | AI_VERIFIED_MEDIUM | FLAGGED | PENDING_APPROVAL
  authenticityScore  Float?

  // Shipping
  shippingCost Decimal @default(0) @db.Decimal(10, 2)
  shippingTime String  @default("3-5 business days")
  shippingFrom String

  // Relations
  seller   User    @relation("SellerAuctions", fields: [sellerId], references: [id])
  sellerId String
  winner   User?   @relation("WinnerAuctions", fields: [winnerId], references: [id])
  winnerId String?
  bids     Bid[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
  @@index([category])
  @@index([team])
  @@index([itemType])
  @@index([listingType])
  @@map("auctions")
}

model Bid {
  id     String  @id @default(uuid())
  amount Decimal @db.Decimal(10, 2)

  auction   Auction @relation(fields: [auctionId], references: [id], onDelete: Cascade)
  auctionId String
  bidder    User    @relation(fields: [bidderId], references: [id])
  bidderId  String

  createdAt DateTime @default(now())

  @@index([auctionId])
  @@index([bidderId])
  @@map("bids")
}

// ─── Payments — replay-attack-safe upgrade flow ──────────────────────────────

model PaymentOrder {
  id             String    @id @default(uuid())
  tokenId        String    @unique  // jti from signed paymentToken — one use only
  user           User      @relation(fields: [userId], references: [id])
  userId         String
  tier           String
  months         Int
  expectedAmount Decimal   @db.Decimal(10, 2)  // server-computed, never trusted from client
  status         String    @default("pending") // pending | completed | expired
  completedAt    DateTime?
  expiresAt      DateTime
  createdAt      DateTime  @default(now())

  @@index([userId])
  @@index([status])
  @@map("payment_orders")
}

// ─── Security: login history, warnings, bans ─────────────────────────────────

model LoginHistory {
  id            String   @id @default(uuid())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String
  success       Boolean
  ipAddress     String
  userAgent     String?
  failureReason String?  // wrong_password | account_locked | account_banned | ...
  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
  @@map("login_history")
}

model Ban {
  id          String   @id @default(uuid())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  type        String   // temporary | permanent
  reason      String
  startDate   DateTime @default(now())
  endDate     DateTime?
  issuedBy    String
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([active])
  @@map("bans")
}

// ─── Notifications ───────────────────────────────────────────────────────────

model Notification {
  id      String  @id @default(uuid())
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId  String
  type    String  // bid_outbid | auction_won | auction_ended | listing_published | ...
  title   String
  message String
  link    String?
  metadata Json?
  read    Boolean  @default(false)
  readAt  DateTime?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([userId, read])
  @@map("notifications")
}

model Warning {
  id          String   @id @default(uuid())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  reason      String
  severity    String   @default("low") // low | medium | high | critical
  issuedBy    String
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([active])
  @@map("warnings")
}
`;
