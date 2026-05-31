# Database Schema Recommendation - Custom Order System

## Overview
Dokumen ini berisi rekomendasi struktur database untuk sistem Custom Order yang terdiri dari 8 step pemesanan box custom.

---

## 📋 Tabel-Tabel yang Dibutuhkan

### 1. **orders** (Tabel Utama Pesanan)
Menyimpan informasi utama pesanan custom box.

```prisma
model Order {
  id                String   @id @default(uuid())
  orderNumber       String   @unique // Format: ORD-YYYYMMDD-XXXX
  userId            String
  
  // Step 1: Model & Tipe Box
  boxModel          String   // earlock-box-depan, top-bottom-box, dll
  
  // Step 2: Ukuran
  length            Float    // Panjang (cm)
  width             Float    // Lebar (cm)
  height            Float    // Tinggi (cm)
  lidHeight         Float?   // Tinggi Tutup (cm) - nullable, khusus Top Bottom Box
  
  // Step 3: Bahan
  material          String   // duplex, ivory, kraft
  thickness         Int      // 300, 350, 400, 450 (gsm)
  
  // Step 4: Warna Kemasan
  colorSides        String   // 1-sisi, 2-sisi
  
  // Step 5: Finishing Laminasi
  finishing         String   // sisi-luar, dalam, luar-dalam, tanpa-laminasi, glossy, doff
  
  // Step 6: File Upload
  designFileUrl     String?  // URL file design yang diupload
  designFileName    String?  // Nama file original
  designFileSize    Float?   // Ukuran file (MB)
  notes             String?  @db.Text // Catatan tambahan dari user
  
  // Step 7: Kuantitas
  quantity          Int      // Jumlah pesanan (pcs)
  
  // Pricing & Payment
  pricePerUnit      Float?   // Harga per unit (akan dihitung admin)
  totalPrice        Float?   // Total harga (quantity * pricePerUnit)
  paymentStatus     PaymentStatus @default(PENDING)
  paymentProofUrl   String?  // URL bukti pembayaran
  
  // Order Status & Timeline
  status            OrderStatus @default(DRAFT)
  estimatedDays     Int      @default(10) // Estimasi hari kerja
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  submittedAt       DateTime? // Waktu submit order (setelah review)
  paidAt            DateTime? // Waktu pembayaran
  completedAt       DateTime? // Waktu selesai produksi
  
  // Relations
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderHistory      OrderHistory[]
  
  @@index([userId])
  @@index([orderNumber])
  @@index([status])
  @@index([createdAt])
}
```

### 2. **OrderStatus** (Enum)
Status pesanan dari draft hingga selesai.

```prisma
enum OrderStatus {
  DRAFT           // Belum submit, masih di step 1-8
  PENDING_REVIEW  // Sudah submit, menunggu review admin
  PENDING_PAYMENT // Sudah di-review, menunggu pembayaran
  PAYMENT_VERIFIED // Pembayaran sudah diverifikasi
  IN_PRODUCTION   // Sedang dalam proses produksi
  READY_TO_SHIP   // Siap dikirim
  SHIPPED         // Sudah dikirim
  COMPLETED       // Pesanan selesai
  CANCELLED       // Dibatalkan
}
```

### 3. **PaymentStatus** (Enum)
Status pembayaran.

```prisma
enum PaymentStatus {
  PENDING         // Belum bayar
  AWAITING_VERIFICATION // Menunggu verifikasi admin
  VERIFIED        // Sudah diverifikasi
  FAILED          // Pembayaran gagal
  REFUNDED        // Dikembalikan
}
```

### 4. **orderHistory** (History/Log Perubahan)
Menyimpan riwayat perubahan status dan aktivitas order.

```prisma
model OrderHistory {
  id          String   @id @default(uuid())
  orderId     String
  
  action      String   // "STATUS_CHANGED", "PAYMENT_UPLOADED", "EDITED", dll
  fromStatus  String?  // Status sebelumnya
  toStatus    String?  // Status baru
  description String   @db.Text // Deskripsi perubahan
  
  performedBy String?  // userId yang melakukan aksi (bisa user atau admin)
  
  createdAt   DateTime @default(now())
  
  // Relations
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
  @@index([createdAt])
}
```

### 5. **boxModels** (Master Data Model Box) - Optional
Tabel master untuk menyimpan data model box yang tersedia.

```prisma
model BoxModel {
  id          String   @id @default(uuid())
  code        String   @unique // earlock-box-depan, top-bottom-box, dll
  name        String   // Earlock Box Depan, Top Bottom Box, dll
  description String?  @db.Text
  imageUrl    String?  // URL gambar model
  isActive    Boolean  @default(true)
  
  // Pricing factors (optional)
  basePrice   Float?   // Harga dasar model ini
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
  @@index([isActive])
}
```

### 6. **materials** (Master Data Material) - Optional
Tabel master untuk material yang tersedia.

```prisma
model Material {
  id          String   @id @default(uuid())
  code        String   @unique // duplex, ivory, kraft
  name        String   // Duplex, Ivory, Kraft
  description String?  @db.Text
  imageUrl    String?
  isActive    Boolean  @default(true)
  
  // Pricing per thickness
  price300gsm Float?
  price350gsm Float?
  price400gsm Float?
  price450gsm Float?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
  @@index([isActive])
}
```

### 7. **finishingOptions** (Master Data Finishing) - Optional
Tabel master untuk opsi finishing yang tersedia.

```prisma
model FinishingOption {
  id          String   @id @default(uuid())
  code        String   @unique // sisi-luar, glossy, doff, dll
  name        String   // Sisi Luar, Glossy, Doff
  description String?  @db.Text
  imageUrl    String?
  isActive    Boolean  @default(true)
  
  // Pricing
  additionalPrice Float? // Harga tambahan untuk finishing ini
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
  @@index([isActive])
}
```

### 8. **pricingRules** (Aturan Harga) - Optional
Tabel untuk menyimpan aturan pricing berdasarkan quantity, size, dll.

```prisma
model PricingRule {
  id              String   @id @default(uuid())
  name            String   // Nama aturan pricing
  
  // Quantity tiers
  minQuantity     Int
  maxQuantity     Int?     // null = unlimited
  
  // Size factors
  minTotalArea    Float?   // Minimal total area (P x L x T)
  maxTotalArea    Float?
  
  // Pricing
  pricePerUnit    Float    // Harga per unit untuk tier ini
  discountPercent Float?   // Diskon persen (optional)
  
  isActive        Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([minQuantity])
  @@index([isActive])
}
```

---

## 🔗 Relasi Antar Tabel

### Relasi Utama:
```
User (1) ──────< (N) Order
Order (1) ──────< (N) OrderHistory
```

### Relasi Optional (jika menggunakan master data):
```
BoxModel (1) ────── (lookup) ────── Order.boxModel
Material (1) ────── (lookup) ────── Order.material
FinishingOption (1) ── (lookup) ── Order.finishing
```

---

## 📊 ERD Diagram (Simplified)

```
┌─────────────┐
│    User     │
│─────────────│
│ id          │
│ email       │
│ name        │
│ role        │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────────────────────────────────────┐
│                   Order                          │
│──────────────────────────────────────────────────│
│ id, orderNumber, userId                          │
│ boxModel, length, width, height, lidHeight       │
│ material, thickness                              │
│ colorSides, finishing                            │
│ designFileUrl, notes                             │
│ quantity, pricePerUnit, totalPrice               │
│ status, paymentStatus                            │
│ createdAt, updatedAt, submittedAt, paidAt        │
└──────┬───────────────────────────────────────────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐
│   OrderHistory      │
│─────────────────────│
│ id, orderId         │
│ action, description │
│ fromStatus, toStatus│
│ performedBy         │
│ createdAt           │
└─────────────────────┘
```

---

## 🎯 Rekomendasi Implementasi

### Phase 1: MVP (Minimum Viable Product)
1. ✅ Implementasi tabel `Order` dengan semua field dari 8 step
2. ✅ Implementasi enum `OrderStatus` dan `PaymentStatus`
3. ✅ Implementasi tabel `OrderHistory` untuk tracking
4. ✅ Relasi dengan tabel `User` yang sudah ada

### Phase 2: Enhancement
1. ✅ Tambah tabel master data (`BoxModel`, `Material`, `FinishingOption`)
2. ✅ Implementasi sistem pricing otomatis dengan `PricingRule`
3. ✅ Tambah field untuk tracking shipping (nomor resi, kurir, dll)
4. ✅ Implementasi notifikasi email/WhatsApp untuk setiap perubahan status

### Phase 3: Advanced Features
1. ✅ Sistem review & rating setelah order selesai
2. ✅ Reorder feature (pesan ulang dengan spesifikasi sama)
3. ✅ Template design (user bisa save spesifikasi sebagai template)
4. ✅ Bulk order (pesan multiple order sekaligus)

---

## 💡 Tips & Best Practices

### 1. **Indexing**
- Index pada field yang sering di-query: `userId`, `orderNumber`, `status`, `createdAt`
- Composite index untuk query kompleks: `(userId, status)`, `(status, createdAt)`

### 2. **Soft Delete**
- Pertimbangkan soft delete untuk order (tambah field `deletedAt`)
- Jangan hard delete order yang sudah ada payment

### 3. **File Storage**
- Simpan file design di cloud storage (AWS S3, Cloudinary, dll)
- Simpan hanya URL di database, bukan file binary
- Implementasi file size limit (max 10MB)

### 4. **Pricing Calculation**
- Hitung harga di backend, jangan trust dari frontend
- Simpan snapshot harga saat order dibuat (untuk history)
- Pertimbangkan faktor: material, size, quantity, finishing

### 5. **Order Number Format**
```
ORD-YYYYMMDD-XXXX
Contoh: ORD-20240530-0001
```

### 6. **Status Flow**
```
DRAFT → PENDING_REVIEW → PENDING_PAYMENT → PAYMENT_VERIFIED 
  → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → COMPLETED
```

### 7. **Validation Rules**
- Quantity minimal: 1000 pcs
- Size minimal: > 0 cm
- File format: pdf, jpg, png, svg
- File size max: 10 MB

---

## 🔐 Security Considerations

1. **Authorization**
   - User hanya bisa akses order miliknya sendiri
   - Admin bisa akses semua order
   - Implementasi row-level security

2. **File Upload**
   - Validasi file type dan size di backend
   - Scan virus untuk uploaded files
   - Generate unique filename untuk avoid collision

3. **Payment Proof**
   - Encrypt sensitive payment information
   - Audit log untuk setiap perubahan payment status

---

## 📝 Migration Strategy

### Step 1: Create Tables
```bash
npx prisma migrate dev --name add_custom_order_tables
```

### Step 2: Seed Master Data (Optional)
```bash
npx prisma db seed
```

### Step 3: Test with Sample Data
- Create test orders dengan berbagai kombinasi
- Test semua status transitions
- Verify relasi dan constraints

---

## 🚀 API Endpoints yang Dibutuhkan

### Order Management
- `POST /api/orders` - Create new order (draft)
- `PUT /api/orders/:id` - Update order (saat edit)
- `POST /api/orders/:id/submit` - Submit order untuk review
- `GET /api/orders/:id` - Get order detail
- `GET /api/orders` - List user's orders
- `DELETE /api/orders/:id` - Delete draft order

### Payment
- `POST /api/orders/:id/payment` - Upload payment proof
- `PUT /api/orders/:id/payment/verify` - Verify payment (admin only)

### File Upload
- `POST /api/upload/design` - Upload design file
- `GET /api/upload/design/:filename` - Get design file

### Admin
- `GET /api/admin/orders` - List all orders (with filters)
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/price` - Set order price

---

## 📚 References

- Prisma Documentation: https://www.prisma.io/docs
- Database Design Best Practices
- E-commerce Order Management Patterns

---

**Created**: 2024-05-30  
**Last Updated**: 2024-05-30  
**Version**: 1.0
