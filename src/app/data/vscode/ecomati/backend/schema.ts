export const schemaCode = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Product {
  id          Int       @id @default(autoincrement())
  name        String
  description String    @db.Text
  price       Decimal   @db.Decimal(10, 2)
  isAvailable Boolean   @default(true)
  isFeatured  Boolean   @default(false)
  images      String[]

  categoryId  Int
  category    Category  @relation(fields: [categoryId], references: [id])

  variants    ProductVariant[]
  orderItems  OrderItem[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([categoryId])
}

model ProductVariant {
  id        Int     @id @default(autoincrement())
  size      String
  price     Decimal @db.Decimal(10, 2)
  stock     Int     @default(0)

  productId Int
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

model Order {
  id        Int         @id @default(autoincrement())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  items     OrderItem[]

  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id])

  productId Int
  product   Product @relation(fields: [productId], references: [id])

  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  COMPLETED
  CANCELLED
}`;
