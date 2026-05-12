-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetPasswordExpiry` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(255) NULL;
