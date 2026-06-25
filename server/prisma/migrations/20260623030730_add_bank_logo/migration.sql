/*
  Warnings:

  - You are about to drop the column `hargaCetak` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaDrag` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaKertas` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaLaminasi` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaPacking` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaPisau` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaPlat` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hargaPond` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bank_accounts` ADD COLUMN `imageUrl` VARCHAR(500) NULL,
    ADD COLUMN `publicId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `hargaCetak`,
    DROP COLUMN `hargaDrag`,
    DROP COLUMN `hargaKertas`,
    DROP COLUMN `hargaLaminasi`,
    DROP COLUMN `hargaPacking`,
    DROP COLUMN `hargaPisau`,
    DROP COLUMN `hargaPlat`,
    DROP COLUMN `hargaPond`,
    DROP COLUMN `tax`;
