/*
  Migration: update_finishing_lamination_fields
  
  Perubahan:
  1. Tambah kolom `category` di `finishing_options` (dengan data migration)
  2. Drop kolom `finishingOption` dan tambah `laminationSide` + `laminationType` di `orders`
*/

-- ============================================================
-- Step 1: Tambah kolom `category` dengan default value sementara
-- ============================================================
ALTER TABLE `finishing_options` ADD COLUMN `category` VARCHAR(10) NOT NULL DEFAULT 'side';

-- Step 2: Update data existing berdasarkan code
-- Sisi Laminasi (category = 'side')
UPDATE `finishing_options` SET `category` = 'side'
WHERE `code` IN ('sisi-luar', 'dalam', 'luar-dalam', 'luar-dan-dalam', 'tanpa-laminasi');

-- Tipe Laminasi (category = 'type')
UPDATE `finishing_options` SET `category` = 'type'
WHERE `code` IN ('glossy', 'doff');

-- Step 3: Hapus default value (opsional, schema sudah handle ini)
ALTER TABLE `finishing_options` ALTER COLUMN `category` DROP DEFAULT;

-- ============================================================
-- Step 4: Update tabel `orders`
--   - Drop kolom `finishingOption` lama
--   - Tambah `laminationSide` (nullable dulu untuk handle data existing)
--   - Tambah `laminationType` (nullable)
-- ============================================================

-- Tambah kolom baru dengan nullable dulu
ALTER TABLE `orders`
    ADD COLUMN `laminationSide` VARCHAR(50) NULL,
    ADD COLUMN `laminationType` VARCHAR(50) NULL;

-- Migrate data lama dari finishingOption ke laminationSide
-- Nilai yang termasuk 'side': sisi-luar, dalam, luar-dalam, tanpa-laminasi
UPDATE `orders` SET `laminationSide` = `finishingOption`
WHERE `finishingOption` IN ('sisi-luar', 'dalam', 'luar-dalam', 'luar-dan-dalam', 'tanpa-laminasi');

-- Nilai yang termasuk 'type' (glossy/doff) tidak bisa otomatis dipindah ke laminationSide,
-- set ke 'sisi-luar' sebagai fallback dan simpan tipe di laminationType
UPDATE `orders` SET `laminationSide` = 'sisi-luar', `laminationType` = `finishingOption`
WHERE `finishingOption` IN ('glossy', 'doff');

-- Set default untuk row yang belum terisi (fallback)
UPDATE `orders` SET `laminationSide` = 'tanpa-laminasi'
WHERE `laminationSide` IS NULL;

-- Jadikan NOT NULL setelah data terisi
ALTER TABLE `orders` MODIFY COLUMN `laminationSide` VARCHAR(50) NOT NULL;

-- Drop kolom lama
ALTER TABLE `orders` DROP COLUMN `finishingOption`;

-- ============================================================
-- Step 5: Buat index
-- ============================================================
CREATE INDEX `finishing_options_category_idx` ON `finishing_options`(`category`);
