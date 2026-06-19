/*
  Warnings:

  - You are about to drop the column `hargaMaterial` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaWarna` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `markup` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalPerUnit` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `hargaMaterial`,
    DROP COLUMN `hargaWarna`,
    DROP COLUMN `markup`,
    DROP COLUMN `subtotalPerUnit`,
    DROP COLUMN `totalPrice`,
    ADD COLUMN `hargaCetak` DOUBLE NULL,
    ADD COLUMN `hargaDrag` DOUBLE NULL,
    ADD COLUMN `hargaKertas` DOUBLE NULL,
    ADD COLUMN `hargaPacking` DOUBLE NULL,
    ADD COLUMN `hargaPerPcs` DOUBLE NULL,
    ADD COLUMN `hargaPisau` DOUBLE NULL,
    ADD COLUMN `hargaPlat` DOUBLE NULL,
    ADD COLUMN `hargaPond` DOUBLE NULL,
    ADD COLUMN `qtyPlano` DOUBLE NULL,
    ADD COLUMN `qtyRim` INTEGER NULL,
    ADD COLUMN `totalBayar` DOUBLE NULL;

-- CreateTable
CREATE TABLE `cmyk_blok_prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `thicknessMin` INTEGER NOT NULL,
    `thicknessMax` INTEGER NOT NULL,
    `cetakPrice` DOUBLE NOT NULL,
    `dragPrice` DOUBLE NOT NULL,
    `platPrice` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `cmyk_blok_prices_thicknessMin_idx`(`thicknessMin`),
    INDEX `cmyk_blok_prices_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pondMultiplier` DOUBLE NOT NULL DEFAULT 85,
    `packingDivisor` INTEGER NOT NULL DEFAULT 500,
    `packingMultiplier` DOUBLE NOT NULL DEFAULT 15000,
    `laminasiMultiplier` DOUBLE NOT NULL DEFAULT 0.3,
    `pisauPrice` DOUBLE NOT NULL DEFAULT 700000,
    `dragThreshold` INTEGER NOT NULL DEFAULT 1000,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
