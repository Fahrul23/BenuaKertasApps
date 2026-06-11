/*
  Warnings:

  - You are about to drop the column `additionalPrice` on the `finishing_options` table. All the data in the column will be lost.
  - You are about to drop the column `price300gsm` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `price350gsm` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `price400gsm` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `price450gsm` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the `pricing_rules` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `finishing_options` DROP COLUMN `additionalPrice`;

-- AlterTable
ALTER TABLE `materials` DROP COLUMN `price300gsm`,
    DROP COLUMN `price350gsm`,
    DROP COLUMN `price400gsm`,
    DROP COLUMN `price450gsm`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `hargaLaminasi` DOUBLE NULL,
    ADD COLUMN `hargaMaterial` DOUBLE NULL,
    ADD COLUMN `hargaWarna` DOUBLE NULL,
    ADD COLUMN `jumlahMata` INTEGER NULL,
    ADD COLUMN `markup` INTEGER NOT NULL DEFAULT 85,
    ADD COLUMN `paperHeight` DOUBLE NULL,
    ADD COLUMN `paperWidth` DOUBLE NULL,
    ADD COLUMN `planoOrientation` VARCHAR(20) NULL,
    ADD COLUMN `planoType` VARCHAR(20) NULL,
    ADD COLUMN `subtotalPerUnit` DOUBLE NULL,
    ADD COLUMN `totalPrice` DOUBLE NULL;

-- DropTable
DROP TABLE `pricing_rules`;

-- CreateTable
CREATE TABLE `plano_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `width` DOUBLE NOT NULL,
    `height` DOUBLE NOT NULL,
    `effectiveWidth` DOUBLE NOT NULL,
    `effectiveHeight` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `plano_types_code_key`(`code`),
    INDEX `plano_types_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planoCode` VARCHAR(20) NOT NULL,
    `materialCode` VARCHAR(100) NOT NULL,
    `thickness` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `material_prices_planoCode_idx`(`planoCode`),
    INDEX `material_prices_isActive_idx`(`isActive`),
    UNIQUE INDEX `material_prices_planoCode_materialCode_thickness_key`(`planoCode`, `materialCode`, `thickness`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `color_prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `thicknessMin` INTEGER NOT NULL,
    `thicknessMax` INTEGER NOT NULL,
    `pricePerSide` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `color_prices_thicknessMin_idx`(`thicknessMin`),
    INDEX `color_prices_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
