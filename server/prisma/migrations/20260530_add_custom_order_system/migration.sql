-- CreateEnum for new order system
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(50) NOT NULL,
    `userId` INTEGER NOT NULL,
    `boxModel` VARCHAR(50) NOT NULL,
    `sizePanjang` DECIMAL(10, 2) NOT NULL,
    `sizeLebar` DECIMAL(10, 2) NOT NULL,
    `sizeTinggi` DECIMAL(10, 2) NOT NULL,
    `sizeTinggiTutup` DECIMAL(10, 2) NULL,
    `material` VARCHAR(50) NOT NULL,
    `materialThickness` INTEGER NOT NULL,
    `colorOption` VARCHAR(50) NOT NULL,
    `finishingOption` VARCHAR(50) NOT NULL,
    `designFileUrl` VARCHAR(500) NULL,
    `designFilePublicId` VARCHAR(255) NULL,
    `designFileName` VARCHAR(255) NULL,
    `designFileSize` INTEGER NULL,
    `designFileFormat` VARCHAR(10) NULL,
    `customerNote` TEXT NULL,
    `quantity` INTEGER NOT NULL,
    `subtotal` DECIMAL(15, 2) NOT NULL,
    `tax` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `orderStatus` ENUM('PENDING', 'WAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `paymentStatus` ENUM('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'UNPAID',
    `estimatedProductionDays` INTEGER NOT NULL DEFAULT 10,
    `productionStartDate` DATE NULL,
    `productionEndDate` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    INDEX `orders_orderNumber_idx`(`orderNumber`),
    INDEX `orders_userId_idx`(`userId`),
    INDEX `orders_orderStatus_idx`(`orderStatus`),
    INDEX `orders_paymentStatus_idx`(`paymentStatus`),
    INDEX `orders_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable for payments
CREATE TABLE IF NOT EXISTS `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `paymentNumber` VARCHAR(50) NOT NULL,
    `paymentMethod` ENUM('BANK_TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'CASH') NOT NULL,
    `bankName` VARCHAR(100) NULL,
    `accountNumber` VARCHAR(50) NULL,
    `accountHolderName` VARCHAR(100) NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `paymentProofUrl` VARCHAR(500) NULL,
    `paymentProofPublicId` VARCHAR(255) NULL,
    `paymentProofName` VARCHAR(255) NULL,
    `paymentStatus` ENUM('PENDING', 'VERIFIED', 'REJECTED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `verifiedBy` INTEGER NULL,
    `verifiedAt` DATETIME(3) NULL,
    `rejectionReason` TEXT NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_paymentNumber_key`(`paymentNumber`),
    INDEX `payments_orderId_idx`(`orderId`),
    INDEX `payments_paymentNumber_idx`(`paymentNumber`),
    INDEX `payments_paymentStatus_idx`(`paymentStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable for bank_accounts
CREATE TABLE IF NOT EXISTS `bank_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(100) NOT NULL,
    `accountNumber` VARCHAR(50) NOT NULL,
    `accountHolderName` VARCHAR(100) NOT NULL,
    `branch` VARCHAR(100) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `bank_accounts_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable for order_history
CREATE TABLE IF NOT EXISTS `order_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `previousStatus` VARCHAR(50) NULL,
    `newStatus` VARCHAR(50) NOT NULL,
    `changedBy` INTEGER NULL,
    `changeType` ENUM('STATUS_CHANGE', 'PAYMENT_UPDATE', 'PRODUCTION_UPDATE', 'SHIPPING_UPDATE', 'OTHER') NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_history_orderId_idx`(`orderId`),
    INDEX `order_history_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_verifiedBy_fkey` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_history` ADD CONSTRAINT `order_history_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_history` ADD CONSTRAINT `order_history_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Rename old OrderStatus enum to avoid conflict
ALTER TABLE `custom_orders` MODIFY `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
