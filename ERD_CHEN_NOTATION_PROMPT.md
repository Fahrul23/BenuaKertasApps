# Prompt: ERD Notasi Chen — Alur Proses Pemesanan Benua Kertas Apps

> **Fokus Diagram**: Proses lengkap dari User memilih model box → konfigurasi → pembayaran → verifikasi admin → produksi → selesai.
> Hanya entitas yang **terlibat langsung** dalam proses ini yang ditampilkan. Master data yang direferensi oleh pesanan ikut disertakan; entitas katalog produk (categories, products, galleries, custom_orders) **tidak ditampilkan** karena tidak berelasi dengan alur ini.

---

## 📋 Prompt Lengkap (Copy–Paste ke AI / Tools Diagram)

```
Buatkan Entity Relationship Diagram (ERD) dengan Notasi Chen yang menggambarkan
alur proses pemesanan custom box pada sistem "Benua Kertas Apps", mulai dari
user memilih model box hingga admin menyelesaikan produksi.

Gunakan aturan notasi Chen standar:
  - Entitas          → Persegi panjang (Rectangle)
  - Entitas lemah    → Double rectangle
  - Relasi           → Belah ketupat (Diamond)
  - Relasi identifikasi → Double diamond
  - Atribut          → Ellipse/Oval
  - Atribut PK       → Ellipse dengan nama bergaris bawah
  - Atribut derivasi → Ellipse garis putus-putus
  - Atribut nullable → Ellipse berlabel "(opt)"
  - Partisipasi total   → Garis double (==)
  - Partisipasi parsial → Garis single (-)
  - Kardinalitas     → 1 atau N di ujung garis

================================================================
ENTITAS & ATRIBUT
================================================================

Tampilkan 11 entitas berikut (urutan pengelompokan logis):

--- GRUP A: PENGGUNA & PESANAN (inti proses) ---

ENTITAS 1: users
  Atribut:
    - id (PK)
    - name
    - email (UNIQUE)
    - password
    - role (ENUM: ADMIN | USER)
    - createdAt
    - resetPasswordToken (opt)
    - resetPasswordExpiry (opt)

ENTITAS 2: orders  ← entitas UTAMA proses pemesanan
  Atribut:
    --- Identifikasi ---
    - id (PK)
    - orderNumber (UNIQUE)               → Format ORD-YYYY-MM-DD-XXXX
    - userId (FK)
    --- Step 1: Model Box ---
    - boxModel                           → Nilai: kode dari box_models
    --- Step 2: Ukuran ---
    - sizePanjang
    - sizeLebar
    - sizeTinggi
    - sizeTinggiTutup (opt)              → Khusus Top-Bottom Box
    --- Step 3: Material ---
    - material                           → Nilai: kode dari materials
    - materialThickness                  → GSM
    --- Step 4: Warna ---
    - colorOption                        → "1-sisi" | "2-sisi"
    --- Step 5: Finishing ---
    - laminationSide                     → Kode dari finishing_options (side)
    - laminationType (opt)               → Kode dari finishing_options (type)
    --- Step 6: File Desain ---
    - designFileUrl (opt)
    - designFileName (opt)
    - designFileSize (opt)
    - designFileFormat (opt)
    - customerNote (opt)
    --- Step 7: Kuantitas ---
    - quantity
    --- Pricing Engine (kalkulasi otomatis) ---
    - planoType (opt)                    → Kode dari plano_types
    - paperWidth (opt)
    - paperHeight (opt)
    - jumlahMata (opt)
    - planoOrientation (opt)
    - qtyPlano (opt)
    - qtyRim (opt)
    --- Total Harga (disimpan di DB; breakdown hanya dihitung di backend) ---
    - totalBayar (opt, derived)          → Sum semua komponen harga (backend only)
    - hargaPerPcs (opt, derived)         → totalBayar ÷ quantity
    - subtotal
    - totalAmount (derived)              → sama dengan totalBayar
    --- Status & Produksi ---
    - orderStatus  (ENUM: PENDING | WAITING_PAYMENT | PAYMENT_CONFIRMED |
                          IN_PRODUCTION | READY_TO_SHIP | SHIPPED |
                          COMPLETED | CANCELLED)
    - paymentStatus (ENUM: UNPAID | PENDING | PAID | FAILED | REFUNDED)
    - estimatedProductionDays
    - productionStartDate (opt)
    - productionEndDate (opt)
    - createdAt
    - updatedAt

ENTITAS 3: order_history  ← ENTITAS LEMAH (weak entity)
  Bergantung pada: orders (identifying relationship)
  Atribut:
    - id (PK)
    - orderId (FK)                       → orders.id
    - changedBy (FK, opt)                → users.id
    - previousStatus (opt)
    - newStatus
    - changeType (ENUM: STATUS_CHANGE | PAYMENT_UPDATE |
                        PRODUCTION_UPDATE | SHIPPING_UPDATE | OTHER)
    - notes (opt)
    - createdAt

--- GRUP B: PEMBAYARAN ---

ENTITAS 4: payments
  Atribut:
    - id (PK)
    - orderId (FK)                       → orders.id
    - verifiedBy (FK, opt)              → users.id (admin yg verifikasi)
    - paymentNumber (UNIQUE)            → Format PAY-YYYY-MM-DD-XXXX
    - paymentMethod (ENUM: BANK_TRANSFER | E_WALLET | CREDIT_CARD | CASH)
    - bankName (opt)
    - accountNumber (opt)
    - accountHolderName (opt)
    - amount
    - paymentProofUrl (opt)
    - paymentProofName (opt)
    - paymentStatus (ENUM: PENDING | VERIFIED | REJECTED | REFUNDED)
    - verifiedAt (opt)
    - rejectionReason (opt)
    - paidAt (opt)
    - createdAt
    - updatedAt

ENTITAS 5: bank_accounts  ← data rekening ditampilkan ke user saat bayar
  Atribut:
    - id (PK)
    - bankName
    - accountNumber
    - accountHolderName
    - branch (opt)
    - isActive
    - displayOrder
    - createdAt
    - updatedAt

--- GRUP C: MASTER DATA KONFIGURASI (direferensi oleh orders) ---

ENTITAS 6: box_models
  Direferensi oleh: orders.boxModel → box_models.code
  Atribut:
    - id (PK)
    - code (UNIQUE)
    - name
    - description (opt)
    - imageUrl (opt)
    - isActive
    - basePrice (opt)
    - createdAt
    - updatedAt

ENTITAS 7: materials
  Direferensi oleh: orders.material → materials.code
  Atribut:
    - id (PK)
    - code (UNIQUE)
    - name
    - description (opt)
    - imageUrl (opt)
    - isActive
    - createdAt
    - updatedAt

ENTITAS 8: finishing_options
  Direferensi oleh: orders.laminationSide & orders.laminationType
  Atribut:
    - id (PK)
    - code (UNIQUE)
    - name
    - category                           → "side" | "type"
    - description (opt)
    - imageUrl (opt)
    - isActive
    - createdAt
    - updatedAt

--- GRUP D: PRICING ENGINE (digunakan saat kalkulasi harga order) ---

ENTITAS 9: plano_types
  Direferensi oleh: orders.planoType → plano_types.code
  Atribut:
    - id (PK)
    - code (UNIQUE)                      → "65x100" | "79x109" | "90x120"
    - width
    - height
    - effectiveWidth                     → width - 2
    - effectiveHeight                    → height - 2.5
    - isActive
    - sortOrder
    - createdAt
    - updatedAt

ENTITAS 10: material_prices
  Digunakan saat kalkulasi orders.hargaKertas
  Direferensi oleh: (planoCode, materialCode, thickness)
  Atribut:
    - id (PK)
    - planoCode                          → Referensi plano_types.code
    - materialCode                       → Referensi materials.code
    - thickness                          → GSM
    - price                              → Harga per plano (Rp)
    - isActive
    - createdAt
    - updatedAt

ENTITAS 11: cmyk_blok_prices
  Digunakan saat kalkulasi orders.hargaCetak & orders.hargaPlat
  Atribut:
    - id (PK)
    - thicknessMin
    - thicknessMax
    - cetakPrice                         → Harga cetak dasar
    - dragPrice                          → Harga per unit drag
    - platPrice                          → Harga plat flat
    - isActive
    - createdAt
    - updatedAt

================================================================
RELASI ANTAR ENTITAS
================================================================

--- RELASI FK (Relasi Struktural / Database Level) ---

RELASI 1: users ── MEMBUAT ── orders
  Kardinalitas : 1 users : N orders
  Partisipasi  : users (parsial) — orders (total)
  FK           : orders.userId → users.id  [ON DELETE CASCADE]
  Keterangan   : Satu user bisa membuat banyak order.
                 Setiap order pasti dimiliki oleh satu user.

RELASI 2: orders ── MEMILIKI_PEMBAYARAN ── payments
  Kardinalitas : 1 orders : N payments
  Partisipasi  : orders (parsial) — payments (total)
  FK           : payments.orderId → orders.id  [ON DELETE CASCADE]
  Keterangan   : Satu order bisa memiliki beberapa record pembayaran
                 (misal: ditolak lalu upload ulang).
                 Setiap payment pasti terikat ke satu order.

RELASI 3: orders ── MEMILIKI_RIWAYAT ── order_history  [IDENTIFYING]
  Kardinalitas : 1 orders : N order_history
  Partisipasi  : orders (parsial) — order_history (total)
  FK           : order_history.orderId → orders.id  [ON DELETE CASCADE]
  Keterangan   : Identifying relationship karena order_history adalah
                 weak entity yang tidak bisa eksis tanpa orders.
                 Gunakan DOUBLE DIAMOND dan DOUBLE RECTANGLE.

RELASI 4: users ── MENCATAT_PERUBAHAN ── order_history
  Kardinalitas : 1 users : N order_history
  Partisipasi  : users (parsial) — order_history (parsial)
  FK           : order_history.changedBy → users.id  [nullable]
  Keterangan   : User (atau admin) yang melakukan perubahan status.
                 Nullable karena bisa dicatat otomatis oleh sistem.

RELASI 5: users ── MEMVERIFIKASI ── payments
  Kardinalitas : 1 users : N payments
  Partisipasi  : users (parsial) — payments (parsial)
  FK           : payments.verifiedBy → users.id  [nullable]
  Keterangan   : Hanya user ber-role ADMIN yang mengisi field ini.
                 Nullable karena belum tentu sudah diverifikasi.

--- RELASI LOGIS (Referensi via String/Code, bukan FK) ---
Tampilkan sebagai garis putus-putus (dashed line) dengan label relasi.

RELASI 6: box_models ── DIPILIH_PADA ── orders
  Kardinalitas : 1 box_models : N orders
  Partisipasi  : box_models (parsial) — orders (parsial)
  Referensi    : box_models.code = orders.boxModel
  Keterangan   : Saat Step 1, user memilih model box dari daftar
                 box_models; nilai code-nya disimpan di orders.boxModel.

RELASI 7: materials ── DIPILIH_PADA ── orders
  Kardinalitas : 1 materials : N orders
  Partisipasi  : materials (parsial) — orders (parsial)
  Referensi    : materials.code = orders.material
  Keterangan   : Saat Step 3, user memilih material; code-nya tersimpan
                 di orders.material.

RELASI 8: finishing_options ── DITERAPKAN_PADA ── orders
  Kardinalitas : 1 finishing_options : N orders
  Partisipasi  : finishing_options (parsial) — orders (parsial)
  Referensi    : finishing_options.code = orders.laminationSide
                 dan finishing_options.code = orders.laminationType
  Keterangan   : Dua atribut order (laminationSide & laminationType)
                 masing-masing mereferensi kode dari tabel ini.

RELASI 9: plano_types ── DIGUNAKAN_KALKULASI ── orders
  Kardinalitas : 1 plano_types : N orders
  Partisipasi  : plano_types (parsial) — orders (parsial)
  Referensi    : plano_types.code = orders.planoType
  Keterangan   : Pricing engine menentukan plano terbaik dan menyimpan
                 hasilnya di orders.planoType.

RELASI 10: material_prices ── MENENTUKAN_HARGA_KERTAS ── orders
  Kardinalitas : N material_prices : N orders  (lookup many-to-many logis)
  Referensi    : (material_prices.planoCode, material_prices.materialCode,
                  material_prices.thickness) ↔ (orders.planoType,
                  orders.material, orders.materialThickness)
  Keterangan   : Pricing engine mencari satu baris di material_prices
                 sesuai kombinasi plano + material + GSM, hasilnya
                 tersimpan di orders.hargaKertas.

RELASI 11: material_prices ── MENGACU ── plano_types
  Kardinalitas : N material_prices : 1 plano_types
  Referensi    : material_prices.planoCode = plano_types.code
  Keterangan   : Setiap baris material_prices berlaku untuk satu ukuran plano.

RELASI 12: material_prices ── MENGACU ── materials
  Kardinalitas : N material_prices : 1 materials
  Referensi    : material_prices.materialCode = materials.code
  Keterangan   : Setiap baris material_prices berlaku untuk satu jenis material.

RELASI 13: cmyk_blok_prices ── MENENTUKAN_HARGA_CETAK ── orders
  Kardinalitas : 1 cmyk_blok_prices : N orders
  Referensi    : cmyk_blok_prices.(thicknessMin–thicknessMax) ↔
                 orders.materialThickness  (range lookup)
  Keterangan   : Pricing engine mencari baris cmyk_blok_prices yang
                 thicknessMin ≤ orders.materialThickness ≤ thicknessMax,
                 mengisi orders.hargaCetak, hargaPlat, dan hargaDrag.

--- RELASI TAMPILAN (Fungsional, bukan FK) ---

RELASI 14: bank_accounts ── DITAMPILKAN_SAAT ── payments
  Kardinalitas : 1 bank_accounts : N payments
  Partisipasi  : bank_accounts (parsial) — payments (parsial)
  Keterangan   : Tidak ada FK eksplisit. Sistem menampilkan daftar
                 bank_accounts aktif ke user saat halaman pembayaran.
                 User memilih rekening dan detail bank tersebut
                 disalin ke payments.(bankName, accountNumber,
                 accountHolderName).
  Tampilkan sebagai garis putus-putus (dashed).

================================================================
INSTRUKSI VISUAL DIAGRAM
================================================================

Layout & Pengelompokan:
  Kelompokkan entitas ke dalam 4 area dengan border/swimlane berbeda:

  [AREA A — Pengguna & Pesanan]
    users  ←──MEMBUAT──→  orders  ←──MEMILIKI_RIWAYAT──→  order_history

  [AREA B — Pembayaran]
    orders  ←──MEMILIKI_PEMBAYARAN──→  payments
    bank_accounts  ←··DITAMPILKAN_SAAT··→  payments

  [AREA C — Master Data Konfigurasi]
    box_models  ··DIPILIH_PADA··→  orders
    materials   ··DIPILIH_PADA··→  orders
    finishing_options  ··DITERAPKAN_PADA··→  orders

  [AREA D — Pricing Engine]
    plano_types  ··DIGUNAKAN_KALKULASI··→  orders
    material_prices  ··MENENTUKAN_HARGA_KERTAS··→  orders
    cmyk_blok_prices  ··MENENTUKAN_HARGA_CETAK··→  orders
    material_prices  ──MENGACU──  plano_types
    material_prices  ──MENGACU──  materials

Aturan Garis:
  - Relasi FK (Relasi 1–5)  → Garis solid
  - Relasi logis/kode (Relasi 6–13) → Garis putus-putus (dashed)
  - Relasi tampilan (Relasi 14) → Garis putus-putus

Atribut yang wajib digambar (minimal):
  - Semua atribut PK dan FK di setiap entitas
  - Atribut status (orderStatus, paymentStatus, role)
  - Atribut kunci proses: boxModel, material, materialThickness,
    colorOption, laminationSide, quantity, totalAmount

Atribut Derivasi (ellipse putus-putus) di entitas orders:
  totalBayar, hargaPerPcs, totalAmount
  (Catatan: hargaKertas, hargaCetak, hargaDrag, hargaPlat, hargaPisau,
   hargaPond, hargaPacking, hargaLaminasi, tax — dihapus dari DB;
   hanya dikalkulasi sementara di backend saat pembuatan order)

Sertakan di sudut diagram:
  LEGEND / KETERANGAN:
  □  = Entitas             ◇  = Relasi
  ══ = Entitas lemah       ◈  = Relasi identifikasi
  ○  = Atribut             ○̲  = Atribut kunci (PK)
  ◌  = Atribut derivasi    ══ = Partisipasi total
  ─  = Partisipasi parsial
  ---= Relasi logis (non-FK)

Judul diagram: "ERD Benua Kertas Apps — Notasi Chen"
Sub-judul    : "Alur Proses: Pemilihan Box → Konfigurasi → Pembayaran → Produksi → Selesai"
```

---

## 📊 Ringkasan Cepat

### Entitas yang Ditampilkan (11 Entitas)

| No | Entitas | Grup | Jenis | Keterangan |
|----|---------|------|-------|------------|
| 1 | **users** | A | Entitas Kuat | Pelanggan & Admin |
| 2 | **orders** | A | Entitas Kuat | Inti proses pemesanan |
| 3 | **order_history** | A | **Entitas Lemah** | Log perubahan status |
| 4 | **payments** | B | Entitas Kuat | Bukti & verifikasi bayar |
| 5 | **bank_accounts** | B | Entitas Kuat | Rekening tujuan transfer |
| 6 | **box_models** | C | Entitas Kuat | Master model box |
| 7 | **materials** | C | Entitas Kuat | Master jenis material |
| 8 | **finishing_options** | C | Entitas Kuat | Master finishing/laminasi |
| 9 | **plano_types** | D | Entitas Kuat | Ukuran kertas plano |
| 10 | **material_prices** | D | Entitas Kuat | Harga material × plano × GSM |
| 11 | **cmyk_blok_prices** | D | Entitas Kuat | Harga cetak CMYK per GSM range |

> **Tidak ditampilkan**: `categories`, `products`, `galleries`, `custom_orders`, `color_prices`, `pricing_config`
> (tidak berelasi langsung dengan alur pemesanan ini)

### Peta Relasi

```
                    ┌──────────────────────────────────────────────────────────┐
                    │                  AREA A: Pengguna & Pesanan               │
                    │                                                            │
  [box_models] ····DIPILIH_PADA····╮                                            │
  [materials]  ····DIPILIH_PADA····┤                                            │
  [finishing]  ····DITERAPKAN_PADA·┤   1        N                    N          │
  [plano_types]····DIGUNAKAN_KALKULASI·┤  [users] ──MEMBUAT──→ [orders] ──MEMILIKI_RIWAYAT══ [order_history]
  [mat_prices] ····MENENTUKAN_KERTAS···┤    |           |                                    │
  [cmyk_blok]  ····MENENTUKAN_CETAK····╯    |           |    N                               │
                                            |     1      ↓                                   │
                    │               [users] ──MEMVERIFIKASI──→ [payments]                    │
                    │                                    |                                    │
                    └────────────────────────────────────┼────────────────────────────────────┘
                                                         |
                    ┌────────────────────────────────────↓────────────────┐
                    │            AREA B: Pembayaran                        │
                    │                                                      │
                    │   [orders] ──MEMILIKI_PEMBAYARAN──→ [payments]       │
                    │   [bank_accounts] ····DITAMPILKAN_SAAT···→ [payments]│
                    │                                                      │
                    └──────────────────────────────────────────────────────┘
```

### Tipe Relasi

| # | Nama Relasi | Dari | Ke | Kardinalitas | Jenis Garis |
|---|-------------|------|----|--------------|-------------|
| 1 | MEMBUAT | users | orders | 1:N | Solid |
| 2 | MEMILIKI_PEMBAYARAN | orders | payments | 1:N | Solid |
| 3 | MEMILIKI_RIWAYAT | orders | order_history | 1:N | Solid (double diamond) |
| 4 | MENCATAT_PERUBAHAN | users | order_history | 1:N | Solid |
| 5 | MEMVERIFIKASI | users | payments | 1:N | Solid |
| 6 | DIPILIH_PADA | box_models | orders | 1:N | Dashed |
| 7 | DIPILIH_PADA | materials | orders | 1:N | Dashed |
| 8 | DITERAPKAN_PADA | finishing_options | orders | 1:N | Dashed |
| 9 | DIGUNAKAN_KALKULASI | plano_types | orders | 1:N | Dashed |
| 10 | MENENTUKAN_HARGA_KERTAS | material_prices | orders | N:N | Dashed |
| 11 | MENGACU | material_prices | plano_types | N:1 | Dashed |
| 12 | MENGACU | material_prices | materials | N:1 | Dashed |
| 13 | MENENTUKAN_HARGA_CETAK | cmyk_blok_prices | orders | 1:N | Dashed |
| 14 | DITAMPILKAN_SAAT | bank_accounts | payments | 1:N | Dashed |

### Alur Status Pesanan (orders.orderStatus)

```
[WAITING_PAYMENT] → [PAYMENT_CONFIRMED] → [IN_PRODUCTION] → [READY_TO_SHIP] → [SHIPPED] → [COMPLETED]
        ↑                    ↑
  (dibuat saat         (admin approve
   order submit)        pembayaran)
        └─── [CANCELLED] (bisa dari status manapun kecuali SHIPPED/COMPLETED)
```

### Alur Status Pembayaran (payments.paymentStatus)

```
User upload bukti → [PENDING] → Admin verifikasi → [VERIFIED] → orders.paymentStatus = PAID
                         └──→ Admin tolak → [REJECTED] → orders.paymentStatus = UNPAID
```

---

## 🛠️ Tools yang Bisa Digunakan

| Tool | URL | Cara |
|------|-----|------|
| **ERDPlus** | erdplus.com | Pilih "Entity Relationship Diagram" → notasi Chen built-in |
| **draw.io** | diagrams.net | Shape library "Entity Relation" → Pilih bentuk Chen |
| **Lucidchart** | lucidchart.com | Template "Chen ERD" |
| **PlantUML** | plantuml.com | Paste prompt → minta format `@startuml` dengan class/entity |
| **AI (ChatGPT/Claude)** | - | Paste prompt di atas → minta PlantUML atau deskripsi visual |

---

*Dokumen ini berdasarkan Prisma Schema v3 + order.service.js + payment.service.js*
*Dibuat: Juni 2026 | Versi: 2.1 (Hapus breakdown harga & tax dari DB — hanya totalBayar + hargaPerPcs yang disimpan)*
