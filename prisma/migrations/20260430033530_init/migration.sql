-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('READY_MADE', 'FULL_CUSTOM');

-- CreateEnum
CREATE TYPE "SizeCategory" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RugFormat" AS ENUM ('RECTANGULAR', 'ROUND', 'ORGANIC', 'CUSTOM');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING_ANALYSIS', 'IN_ANALYSIS', 'WAITING_CUSTOMER_APPROVAL', 'APPROVED', 'WAITING_DEPOSIT', 'DEPOSIT_CONFIRMED', 'DESIGN_APPROVED', 'IN_PRODUCTION', 'READY_FOR_DELIVERY', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "DesignReferenceKind" AS ENUM ('CUSTOMER_REFERENCE', 'ADMIN_UPLOAD', 'AI_GENERATED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProductType" NOT NULL DEFAULT 'READY_MADE',
    "basePriceCents" INTEGER NOT NULL,
    "sizeCategory" "SizeCategory" NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "format" "RugFormat" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customization" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "description" TEXT,
    "preferredColors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sizeCategory" "SizeCategory" NOT NULL DEFAULT 'CUSTOM',
    "sizeLabel" TEXT,
    "format" "RugFormat" NOT NULL DEFAULT 'CUSTOM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "productId" TEXT,
    "customizationId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING_ANALYSIS',
    "estimatedPriceCents" INTEGER,
    "finalPriceCents" INTEGER,
    "depositAmountCents" INTEGER,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "productionPossible" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignReference" (
    "id" TEXT NOT NULL,
    "kind" "DesignReferenceKind" NOT NULL DEFAULT 'CUSTOMER_REFERENCE',
    "url" TEXT NOT NULL,
    "storageKey" TEXT,
    "mimeType" TEXT,
    "originalName" TEXT,
    "customizationId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminReview" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "adminId" TEXT,
    "status" "OrderStatus",
    "productionPossible" BOOLEAN,
    "estimatedPriceCents" INTEGER,
    "finalPriceCents" INTEGER,
    "depositAmountCents" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "Customization_productId_idx" ON "Customization"("productId");

-- CreateIndex
CREATE INDEX "Customization_customerEmail_idx" ON "Customization"("customerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customizationId_key" ON "Order"("customizationId");

-- CreateIndex
CREATE INDEX "Order_productId_idx" ON "Order"("productId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "DesignReference_customizationId_idx" ON "DesignReference"("customizationId");

-- CreateIndex
CREATE INDEX "DesignReference_orderId_idx" ON "DesignReference"("orderId");

-- CreateIndex
CREATE INDEX "DesignReference_kind_idx" ON "DesignReference"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminReview_orderId_idx" ON "AdminReview"("orderId");

-- CreateIndex
CREATE INDEX "AdminReview_adminId_idx" ON "AdminReview"("adminId");

-- AddForeignKey
ALTER TABLE "Customization" ADD CONSTRAINT "Customization_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customizationId_fkey" FOREIGN KEY ("customizationId") REFERENCES "Customization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignReference" ADD CONSTRAINT "DesignReference_customizationId_fkey" FOREIGN KEY ("customizationId") REFERENCES "Customization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignReference" ADD CONSTRAINT "DesignReference_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminReview" ADD CONSTRAINT "AdminReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminReview" ADD CONSTRAINT "AdminReview_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
