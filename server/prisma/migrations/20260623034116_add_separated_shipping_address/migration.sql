-- AlterTable
ALTER TABLE `orders` ADD COLUMN `customerPhone` VARCHAR(20) NULL,
    ADD COLUMN `shippingCity` VARCHAR(100) NULL,
    ADD COLUMN `shippingDetailAddress` TEXT NULL,
    ADD COLUMN `shippingDistrict` VARCHAR(100) NULL,
    ADD COLUMN `shippingPostalCode` VARCHAR(10) NULL,
    ADD COLUMN `shippingProvince` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `city` VARCHAR(100) NULL,
    ADD COLUMN `detailAddress` TEXT NULL,
    ADD COLUMN `district` VARCHAR(100) NULL,
    ADD COLUMN `phone` VARCHAR(20) NULL,
    ADD COLUMN `postalCode` VARCHAR(10) NULL,
    ADD COLUMN `province` VARCHAR(100) NULL;
