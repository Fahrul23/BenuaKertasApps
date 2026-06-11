-- ============================================================
-- MIGRATION: Redesign PricingRule — 7-field matrix (NO FK)
-- ============================================================
-- Jalankan query ini ketika database aktif.
-- Perintah: Salin ke MySQL client atau jalankan via Prisma migrate.
-- ============================================================

-- Step 1: Hapus tabel lama
DROP TABLE IF EXISTS `pricing_rules`;

-- Step 2: Buat tabel baru dengan struktur 7-field matrix
CREATE TABLE `pricing_rules` (
  `id`             INT           NOT NULL AUTO_INCREMENT,
  `boxModelCode`   VARCHAR(100)  NOT NULL COMMENT 'Nilai: earlock-box-samping | top-bottom-box | dst',
  `materialCode`   VARCHAR(100)  NOT NULL COMMENT 'Nilai: kraft | ivory | duplex',
  `thickness`      INT           NOT NULL COMMENT 'Nilai: 300 | 350 | 400 | 450',
  `colorSides`     VARCHAR(50)   NOT NULL COMMENT 'Nilai: 1-sisi | 2-sisi',
  `laminationPart` VARCHAR(100)  NOT NULL COMMENT 'Nilai: luar | dalam | luar-dan-dalam | tanpa-laminasi',
  `laminationType` VARCHAR(50)   NULL     COMMENT 'Nilai: glossy | doff | NULL',
  `quantityTier`   INT           NOT NULL COMMENT 'Nilai: 500 | 1000 | 1500 | dst',
  `pricePerUnit`   DECIMAL(15,2) NOT NULL COMMENT 'Harga per unit (Rp)',
  `shippingCost`   DECIMAL(15,2) NULL     COMMENT 'Ongkos kirim (opsional)',
  `isActive`       BOOLEAN       NOT NULL DEFAULT TRUE,
  `createdAt`      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`      DATETIME(3)   NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),

  -- Unique constraint: kombinasi 7 field = satu baris harga
  -- Database MENOLAK insert jika kombinasi yang sama sudah ada
  UNIQUE KEY `pricing_rules_7field_unique` (
    `boxModelCode`,
    `materialCode`,
    `thickness`,
    `colorSides`,
    `laminationPart`,
    `laminationType`,
    `quantityTier`
  ),

  INDEX `pricing_rules_boxModelCode_idx` (`boxModelCode`),
  INDEX `pricing_rules_isActive_idx` (`isActive`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Contoh insert data (opsional — hapus jika tidak diperlukan)
-- ============================================================
-- INSERT INTO `pricing_rules`
--   (boxModelCode, materialCode, thickness, colorSides, laminationPart, laminationType, quantityTier, pricePerUnit)
-- VALUES
--   ('earlock-box-samping', 'kraft', 300, '1-sisi', 'tanpa-laminasi', NULL,     500,  850.00),
--   ('earlock-box-samping', 'kraft', 300, '1-sisi', 'luar',           'glossy', 500,  900.00),
--   ('earlock-box-samping', 'kraft', 300, '1-sisi', 'luar',           'glossy', 1000, 750.00),
--   ('earlock-box-samping', 'kraft', 300, '1-sisi', 'luar',           'doff',   500,  950.00),
--   ('earlock-box-samping', 'ivory', 300, '1-sisi', 'luar',           'glossy', 500, 1100.00);
