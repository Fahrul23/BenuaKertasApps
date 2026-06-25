/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `galleries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `galleries` DROP FOREIGN KEY `galleries_productId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `custom_orders`;

-- DropTable
DROP TABLE `galleries`;

-- DropTable
DROP TABLE `products`;
