# Prompt: Generate Prisma Schema — Custom Order System

Gunakan prompt di bawah ini dan paste langsung ke Claude atau AI lain.

---

## PROMPT

Buatkan Prisma schema lengkap beserta migration untuk sistem **Custom Order Box** menggunakan **Prisma ORM** dengan database **PostgreSQL**.

### Konteks Sistem
Sistem ini menangani pemesanan custom packaging box dengan 8 step pemesanan. Ada dua role user: `USER` (pelanggan) dan `ADMIN`.

---

### Requirement Tabel

Buat semua tabel berikut secara lengkap dan berurutan:

---

#### 1. Enum: `Role`
```
USER
ADMIN
```

#### 2. Enum: `OrderStatus`
```
DRAFT
PENDING_REVIEW
PENDING_PAYMENT
PAYMENT_VERIFIED
IN_PRODUCTION
READY_TO_SHIP
SHIPPED
COMPLETED
CANCELLED
```

#### 3. Enum: `PaymentStatus`
```
PENDING
AWAITING_VERIFICATION
VERIFIED
FAILED
REFUNDED
```

---

#### 4. Model: `User`
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `email` — String, unique
- `password` — String (hashed)
- `name` — String
- `phone` — String, nullable
- `role` — Enum Role, default USER
- `isActive` — Boolean, default true
- `createdAt` — DateTime, default now
- `updatedAt` — DateTime, auto-update
- Relasi ke: Order (one-to-many)

---

#### 5. Model: `BoxModel` (master data)
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `code` — String, unique (contoh: `earlock-box-depan`, `top-bottom-box`, `sleeve-box`)
- `name` — String (nama tampil)
- `description` — String (Text), nullable
- `imageUrl` — String, nullable
- `isActive` — Boolean, default true
- `basePrice` — Float, nullable (harga dasar)
- `createdAt` — DateTime, default now
- `updatedAt` — DateTime, auto-update
- Index pada: `code`, `isActive`

---

#### 6. Model: `Material` (master data)
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `code` — String, unique (contoh: `duplex`, `ivory`, `kraft`)
- `name` — String
- `description` — String (Text), nullable
- `imageUrl` — String, nullable
- `isActive` — Boolean, default true
- Harga per ketebalan:
  - `price300gsm` — Float, nullable
  - `price350gsm` — Float, nullable
  - `price400gsm` — Float, nullable
  - `price450gsm` — Float, nullable
- `createdAt` — DateTime, default now
- `updatedAt` — DateTime, auto-update
- Index pada: `code`, `isActive`

---

#### 7. Model: `FinishingOption` (master data)
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `code` — String, unique (contoh: `glossy`, `doff`, `sisi-luar`, `tanpa-laminasi`)
- `name` — String
- `description` — String (Text), nullable
- `imageUrl` — String, nullable
- `isActive` — Boolean, default true
- `additionalPrice` — Float, nullable (harga tambahan)
- `createdAt` — DateTime, default now
- `updatedAt` — DateTime, auto-update
- Index pada: `code`, `isActive`

---

#### 8. Model: `PricingRule` (master data)
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `name` — String (nama aturan harga)
- `minQuantity` — Int
- `maxQuantity` — Int, nullable (null = unlimited)
- `minTotalArea` — Float, nullable (P x L x T minimal)
- `maxTotalArea` — Float, nullable
- `pricePerUnit` — Float
- `discountPercent` — Float, nullable
- `isActive` — Boolean, default true
- `createdAt` — DateTime, default now
- `updatedAt` — DateTime, auto-update
- Index pada: `minQuantity`, `isActive`

---

#### 9. Model: `Order` (tabel utama)
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `orderNumber` — String, unique (format: `ORD-YYYYMMDD-XXXX`)
- `userId` — String (foreign key ke User)
- Step 1 — Model box:
  - `boxModel` — String (kode dari BoxModel.code)
- Step 2 — Ukuran:
  - `length` — Float (panjang, cm)
  - `width` — Float (lebar, cm)
  - `height` — Float (tinggi, cm)
  - `lidHeight` — Float, nullable (khusus top-bottom box)
- Step 3 — Bahan:
  - `material` — String (kode dari Material.code)
  - `thickness` — Int (nilai: 300, 350, 400, 450 gsm)
- Step 4 — Warna:
  - `colorSides` — String (nilai: `1-sisi`, `2-sisi`)
- Step 5 — Finishing:
  - `finishing` — String (kode dari FinishingOption.code)
- Step 6 — File & Catatan:
  - `designFileUrl` — String, nullable
  - `designFileName` — String, nullable
  - `designFileSize` — Float, nullable (MB)
  - `notes` — String (Text), nullable
- Step 7 — Kuantitas:
  - `quantity` — Int (minimal 1000)
- Harga & Pembayaran:
  - `pricePerUnit` — Float, nullable (diisi admin)
  - `totalPrice` — Float, nullable (quantity * pricePerUnit)
  - `paymentStatus` — Enum PaymentStatus, default PENDING
  - `paymentProofUrl` — String, nullable
- Status & Timeline:
  - `status` — Enum OrderStatus, default DRAFT
  - `estimatedDays` — Int, default 10
- Timestamps:
  - `createdAt` — DateTime, default now
  - `updatedAt` — DateTime, auto-update
  - `submittedAt` — DateTime, nullable
  - `paidAt` — DateTime, nullable
  - `completedAt` — DateTime, nullable
- Relasi: User (many-to-one), OrderHistory (one-to-many)
- Index pada: `userId`, `orderNumber`, `status`, `createdAt`
- Composite index: `(userId, status)`, `(status, createdAt)`

---

#### 10. Model: `OrderHistory`
Field yang dibutuhkan:
- `id` — UUID, primary key, auto-generate
- `orderId` — String (foreign key ke Order)
- `action` — String (contoh: `STATUS_CHANGED`, `PAYMENT_UPLOADED`, `PRICE_SET`, `EDITED`)
- `fromStatus` — String, nullable
- `toStatus` — String, nullable
- `description` — String (Text)
- `performedBy` — String, nullable (userId yang melakukan aksi, bisa user atau admin)
- `createdAt` — DateTime, default now
- Relasi: Order (many-to-one)
- Index pada: `orderId`, `createdAt`

---

### Instruksi Tambahan

1. Gunakan `@default(uuid())` untuk semua primary key
2. Gunakan `@db.Text` untuk field yang bertipe teks panjang (description, notes, dll)
3. Semua relasi harus menggunakan `onDelete: Cascade` untuk child records
4. Tambahkan `@@map("nama_tabel_snake_case")` di setiap model untuk nama tabel PostgreSQL yang konsisten
5. Setelah schema selesai, berikan juga:
   - Perintah migration: `npx prisma migrate dev --name init_custom_order`
   - Seed file `prisma/seed.ts` yang mengisi data awal untuk: `BoxModel`, `Material`, `FinishingOption`, dan 1 sample `PricingRule`
   - Contoh seed data untuk BoxModel: earlock-box-depan, top-bottom-box, sleeve-box, tuck-end-box
   - Contoh seed data untuk Material: duplex, ivory, kraft
   - Contoh seed data untuk FinishingOption: glossy, doff, sisi-luar, tanpa-laminasi

6. Tambahkan konfigurasi di `package.json` untuk menjalankan seed:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

7. Output akhir yang diharapkan:
   - File `prisma/schema.prisma` yang lengkap
   - File `prisma/seed.ts` yang siap dijalankan
   - Daftar perintah untuk setup awal

---

### Tech Stack
- Runtime: Node.js
- ORM: Prisma
- Database: PostgreSQL
- Language: TypeScript
