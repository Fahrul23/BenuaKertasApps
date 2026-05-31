-- Create BoxModel table
CREATE TABLE IF NOT EXISTS `box_models` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `imageUrl` VARCHAR(500) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
    `basePrice` DECIMAL(15, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    UNIQUE INDEX `box_models_code_key`(`code`),
    INDEX `box_models_code_idx`(`code`),
    INDEX `box_models_isActive_idx`(`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Material table
CREATE TABLE IF NOT EXISTS `materials` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `imageUrl` VARCHAR(500) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
    `price300gsm` DECIMAL(15, 2) NULL,
    `price350gsm` DECIMAL(15, 2) NULL,
    `price400gsm` DECIMAL(15, 2) NULL,
    `price450gsm` DECIMAL(15, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    UNIQUE INDEX `materials_code_key`(`code`),
    INDEX `materials_code_idx`(`code`),
    INDEX `materials_isActive_idx`(`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create FinishingOption table
CREATE TABLE IF NOT EXISTS `finishing_options` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `imageUrl` VARCHAR(500) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
    `additionalPrice` DECIMAL(15, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    UNIQUE INDEX `finishing_options_code_key`(`code`),
    INDEX `finishing_options_code_idx`(`code`),
    INDEX `finishing_options_isActive_idx`(`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create PricingRule table
CREATE TABLE IF NOT EXISTS `pricing_rules` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `minQuantity` INT NOT NULL,
    `maxQuantity` INT NULL,
    `minTotalArea` DECIMAL(15, 2) NULL,
    `maxTotalArea` DECIMAL(15, 2) NULL,
    `pricePerUnit` DECIMAL(15, 2) NOT NULL,
    `discountPercent` DECIMAL(5, 2) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    INDEX `pricing_rules_minQuantity_idx`(`minQuantity`),
    INDEX `pricing_rules_isActive_idx`(`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert seed data for BoxModel
INSERT INTO `box_models` (`code`, `name`, `description`, `imageUrl`, `isActive`, `basePrice`) VALUES
('earlock-box-depan', 'Earlock Box Depan', 'Box dengan lock di bagian depan untuk kemudahan akses', '/assets/earlock-box-depan.svg', TRUE, 5000),
('earlock-box-samping', 'Earlock Box Samping', 'Box dengan lock di bagian samping untuk tampilan yang unik', '/assets/earlock-box-samping.svg', TRUE, 5200),
('top-bottom-box', 'Top Bottom Box', 'Box dengan tutup terpisah, cocok untuk produk premium', '/assets/top-bottom-box.svg', TRUE, 6000),
('lunch-box', 'Lunch Box', 'Box khusus untuk kemasan makanan', '/assets/lunch-box.svg', TRUE, 4800),
('clamshell-box', 'Clamshell Box', 'Box dengan engsel untuk kemudahan buka tutup', '/assets/clamshell-box.svg', TRUE, 5300),
('tray-box', 'Tray Box', 'Box berbentuk tray untuk display produk', '/assets/tray-box.svg', TRUE, 4200);

-- Insert seed data for Material
INSERT INTO `materials` (`code`, `name`, `description`, `imageUrl`, `isActive`, `price300gsm`, `price350gsm`, `price400gsm`, `price450gsm`) VALUES
('duplex', 'Duplex', 'Kertas duplex berkualitas tinggi dengan permukaan halus', '/assets/duplex.svg', TRUE, 450, 520, 600, 680),
('ivory', 'Ivory', 'Kertas ivory premium dengan warna putih bersih', '/assets/ivory.svg', TRUE, 550, 630, 720, 810),
('kraft', 'Kraft', 'Kertas kraft natural dengan tampilan eco-friendly', '/assets/kraft.svg', TRUE, 380, 440, 510, 580);

-- Insert seed data for FinishingOption
INSERT INTO `finishing_options` (`code`, `name`, `description`, `imageUrl`, `isActive`, `additionalPrice`) VALUES
('glossy', 'Glossy', 'Laminasi glossy mengkilap untuk tampilan premium', '/assets/glossy.svg', TRUE, 800),
('doff', 'Doff', 'Laminasi doff matte untuk tampilan elegan', '/assets/doff.svg', TRUE, 850),
('sisi-luar', 'Sisi Luar', 'Laminasi pada sisi luar saja', '/assets/sisi-luar.svg', TRUE, 600),
('dalam', 'Dalam', 'Laminasi pada bagian dalam', '/assets/dalam.svg', TRUE, 600),
('luar-dalam', 'Luar & Dalam', 'Laminasi pada kedua sisi', '/assets/luar-dalam.svg', TRUE, 1200),
('tanpa-laminasi', 'Tanpa Laminasi', 'Tanpa laminasi, hanya cetak biasa', '/assets/tanpa-laminasi.svg', TRUE, 0);

-- Insert seed data for PricingRule
INSERT INTO `pricing_rules` (`name`, `minQuantity`, `maxQuantity`, `pricePerUnit`, `discountPercent`, `isActive`) VALUES
('Standard Pricing (1000-2999 pcs)', 1000, 2999, 1.0, 0, TRUE),
('Bulk Discount 5% (3000-4999 pcs)', 3000, 4999, 1.0, 5, TRUE),
('Bulk Discount 10% (5000+ pcs)', 5000, NULL, 1.0, 10, TRUE);
