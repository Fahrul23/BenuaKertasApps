# Migration Guide - Custom Order System

## 📋 Overview
Panduan untuk menjalankan migration database untuk sistem Custom Order yang baru.

---

## 🚀 Cara Menjalankan Migration

### 1. **Pastikan Database Server Running**
```bash
# Check MySQL service
# Windows: Services -> MySQL
# Atau jalankan XAMPP/WAMP
```

### 2. **Jalankan Migration**
```bash
cd server
npx prisma migrate dev --name add_custom_order_system
```

### 3. **Generate Prisma Client**
```bash
npx prisma generate
```

### 4. **Jalankan Seeder (Optional)**
```bash
npm run prisma:seed
# atau
node prisma/seed.js
```

---

## 📊 Tabel yang Dibuat

### 1. **orders**
Tabel utama untuk menyimpan pesanan custom box dari 8 steps.

**Kolom Utama:**
- `orderNumber` - Nomor order unik (ORD-YYYY-MM-DD-XXXX)
- `userId` - ID user yang membuat order
- `boxModel` - Model box yang dipilih
- `sizePanjang`, `sizeLebar`, `sizeTinggi`, `sizeTinggiTutup` - Ukuran box
- `material`, `materialThickness` - Material dan ketebalan
- `colorOption` - Pilihan warna (1-sisi, 2-sisi)
- `finishingOption` - Pilihan finishing laminasi
- `designFileUrl`, `designFilePublicId` - URL file design dari Cloudinary
- `quantity` - Jumlah pesanan
- `subtotal`, `tax`, `totalAmount` - Harga
- `orderStatus` - Status order
- `paymentStatus` - Status pembayaran

### 2. **payments**
Tabel untuk menyimpan informasi pembayaran.

**Kolom Utama:**
- `paymentNumber` - Nomor pembayaran unik (PAY-YYYY-MM-DD-XXXX)
- `orderId` - ID order terkait
- `paymentMethod` - Metode pembayaran
- `bankName`, `accountNumber` - Info bank
- `amount` - Jumlah yang dibayar
- `paymentProofUrl`, `paymentProofPublicId` - Bukti pembayaran dari Cloudinary
- `paymentStatus` - Status verifikasi (PENDING, VERIFIED, REJECTED)
- `verifiedBy` - ID admin yang verifikasi

### 3. **bank_accounts**
Tabel untuk menyimpan rekening bank perusahaan.

**Kolom Utama:**
- `bankName` - Nama bank
- `accountNumber` - Nomor rekening
- `accountHolderName` - Nama pemilik rekening
- `branch` - Cabang bank
- `isActive` - Status aktif/tidak
- `displayOrder` - Urutan tampilan

### 4. **order_history**
Tabel untuk menyimpan log perubahan order.

**Kolom Utama:**
- `orderId` - ID order terkait
- `previousStatus` - Status sebelumnya
- `newStatus` - Status baru
- `changedBy` - ID user yang mengubah
- `changeType` - Tipe perubahan
- `notes` - Catatan

---

## 🔄 Rollback Migration (Jika Diperlukan)

```bash
# Rollback last migration
npx prisma migrate reset

# Atau manual drop tables
DROP TABLE IF EXISTS order_history;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS bank_accounts;
```

---

## 📝 Enum Values

### OrderStatus
```
PENDING - Pesanan baru dibuat
WAITING_PAYMENT - Menunggu pembayaran
PAYMENT_CONFIRMED - Pembayaran dikonfirmasi
IN_PRODUCTION - Sedang produksi
READY_TO_SHIP - Siap dikirim
SHIPPED - Sudah dikirim
COMPLETED - Selesai
CANCELLED - Dibatalkan
```

### PaymentStatus
```
UNPAID - Belum dibayar
PENDING - Menunggu verifikasi
PAID - Sudah dibayar
FAILED - Gagal
REFUNDED - Dikembalikan
```

### PaymentMethod
```
BANK_TRANSFER - Transfer bank
E_WALLET - E-Wallet (GoPay, OVO, dll)
CREDIT_CARD - Kartu kredit
CASH - Tunai
```

### PaymentVerificationStatus
```
PENDING - Menunggu verifikasi
VERIFIED - Terverifikasi
REJECTED - Ditolak
REFUNDED - Dikembalikan
```

### ChangeType
```
STATUS_CHANGE - Perubahan status
PAYMENT_UPDATE - Update pembayaran
PRODUCTION_UPDATE - Update produksi
SHIPPING_UPDATE - Update pengiriman
OTHER - Lainnya
```

---

## 🧪 Testing Migration

### 1. **Check Tables Created**
```sql
SHOW TABLES;
```

### 2. **Check Table Structure**
```sql
DESCRIBE orders;
DESCRIBE payments;
DESCRIBE bank_accounts;
DESCRIBE order_history;
```

### 3. **Check Seed Data**
```sql
SELECT * FROM bank_accounts;
```

---

## 🔍 Troubleshooting

### Error: Can't reach database server
```bash
# Solution: Start MySQL service
# Windows: Services -> MySQL -> Start
# XAMPP: Start MySQL module
```

### Error: Database does not exist
```bash
# Solution: Create database first
mysql -u root -p
CREATE DATABASE benua_kertas_db;
```

### Error: Migration already applied
```bash
# Solution: Reset migrations
npx prisma migrate reset
# Then run migration again
npx prisma migrate dev
```

### Error: Prisma Client not generated
```bash
# Solution: Generate Prisma Client
npx prisma generate
```

---

## 📚 Next Steps

Setelah migration berhasil:

1. ✅ **Generate Prisma Client** - `npx prisma generate`
2. ✅ **Run Seeder** - `node prisma/seed.js`
3. ✅ **Test API Endpoints** - Buat order baru via API
4. ✅ **Implement Controllers** - Buat controller untuk orders & payments
5. ✅ **Setup Cloudinary** - Untuk upload files
6. ✅ **Create API Routes** - Endpoint untuk CRUD operations

---

## 📊 Database Diagram

```
users
  ├── 1:N → orders
  ├── 1:N → payments (verifiedBy)
  └── 1:N → order_history (changedBy)

orders
  ├── N:1 → users
  ├── 1:N → payments
  └── 1:N → order_history

payments
  ├── N:1 → orders
  └── N:1 → users (verifiedBy)

order_history
  ├── N:1 → orders
  └── N:1 → users (changedBy)

bank_accounts (standalone)
```

---

## 🔐 Security Notes

1. **Sensitive Data**: Jangan commit `.env` file
2. **Password Hashing**: Gunakan bcrypt untuk password
3. **File Upload**: Validasi tipe dan ukuran file
4. **Access Control**: Pastikan user hanya bisa akses order mereka
5. **Payment Verification**: Hanya admin yang bisa verifikasi

---

**Last Updated**: May 30, 2026
**Version**: 1.0
