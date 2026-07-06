# Dokumentasi Pengembangan Sistem Pemesanan Custom Box
## Benua Kertas Apps — Dokumentasi Skripsi

> **Nama Sistem :** Sistem Pemesanan dan Manajemen Custom Box Packaging Berbasis Web  
> **Nama Aplikasi :** Benua Kertas Apps  
> **Platform :** Web Application (Fullstack)  
> **Metode Pengembangan :** Waterfall (Sequential Linear Model)

---

## Daftar Isi

1. [Rekayasa Sistem dan Analisis](#1-rekayasa-sistem-dan-analisis)
2. [Analisis Kebutuhan Perangkat Lunak](#2-analisis-kebutuhan-perangkat-lunak)
3. [Perancangan (Design)](#3-perancangan-design)
4. [Pembuatan Kode (Coding)](#4-pembuatan-kode-coding)
5. [Pengujian (Testing)](#5-pengujian-testing)
6. [Pemeliharaan (Maintenance)](#6-pemeliharaan-maintenance)

---

---

# 1. Rekayasa Sistem dan Analisis
## (System Engineering and Analysis)

### 1.1 Latar Belakang

Benua Kertas adalah perusahaan percetakan yang bergerak di bidang produksi kemasan/packaging custom box. Proses pemesanan yang sebelumnya dilakukan secara manual — melalui WhatsApp, telepon, atau tatap muka — memiliki sejumlah permasalahan yang menghambat efisiensi operasional bisnis, antara lain:

- Tidak adanya sistem harga yang transparan dan real-time bagi pelanggan
- Proses kalkulasi harga manual yang rentan terhadap kesalahan manusia
- Tidak ada sistem pelacakan status pesanan
- Administrasi pesanan dan pembayaran yang tidak terstruktur
- Tidak ada dokumentasi riwayat perubahan status pesanan

Berdasarkan permasalahan tersebut, dibangunlah sebuah sistem informasi pemesanan berbasis web yang mampu mengotomatisasi seluruh proses: dari konfigurasi pesanan oleh pelanggan, kalkulasi harga dinamis oleh mesin pricing engine, hingga verifikasi pembayaran dan manajemen produksi oleh admin.

---

### 1.2 Tujuan Sistem

1. Menyediakan antarmuka kalkulator custom box yang interaktif dan real-time bagi pelanggan
2. Mengotomatisasi proses kalkulasi harga berdasarkan parameter: model box, dimensi, material, gramatur (GSM), warna cetak, dan finishing/laminasi
3. Menyediakan sistem pembayaran berbasis transfer bank manual dengan mekanisme upload bukti pembayaran
4. Menyediakan dashboard admin untuk memantau dan mengelola seluruh pesanan, pembayaran, dan data master
5. Menghasilkan riwayat (audit trail) setiap perubahan status pesanan secara otomatis

---

### 1.3 Ruang Lingkup Sistem

#### Fitur untuk Pelanggan (User):
- Registrasi dan login akun
- Kalkulator custom box 8 langkah dengan harga real-time
- Upload file desain kemasan
- Pembayaran via transfer bank + upload bukti bayar
- Pelacakan status pesanan secara mandiri
- Manajemen profil dan alamat pengiriman

#### Fitur untuk Admin:
- Login ke dashboard admin terpisah
- Manajemen data master: model box, material, finishing
- Manajemen mesin pricing: harga plano, harga CMYK, harga laminasi, konfigurasi
- Manajemen pesanan: melihat, mengubah status, mendownload file desain
- Verifikasi pembayaran: menyetujui atau menolak bukti pembayaran
- Manajemen rekening bank tujuan pembayaran

---

### 1.4 Arsitektur Sistem

Sistem dibangun menggunakan arsitektur **Client-Server** dengan pola **3-Tier Architecture**:

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION TIER                  │
│         React 19 + Vite (localhost:5173)            │
│   (Halaman Pelanggan & Dashboard Admin)             │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST API (JSON)
┌────────────────────▼────────────────────────────────┐
│                  APPLICATION TIER                   │
│         Node.js + Express.js (localhost:5000)       │
│   (Business Logic, Auth, Pricing Engine, Upload)    │
└────────────────────┬────────────────────────────────┘
                     │ Prisma ORM (SQL Query)
┌────────────────────▼────────────────────────────────┐
│                    DATA TIER                        │
│              MySQL Database                         │
│          (13 Tabel Relasional)                      │
└─────────────────────────────────────────────────────┘

                  [Cloudinary CDN]
          File desain & gambar bank disimpan
              di cloud storage Cloudinary
```

---

### 1.5 Infrastruktur Teknologi

| Komponen | Teknologi | Versi | Fungsi |
|---|---|---|---|
| Frontend Framework | React | 19.x | UI/UX aplikasi web |
| Build Tool | Vite | 8.x | Bundler & dev server |
| Backend Runtime | Node.js | LTS | Runtime server |
| Backend Framework | Express.js | 5.x | REST API server |
| Database | MySQL | 8.x | Penyimpanan data relasional |
| ORM | Prisma | 5.14 | Query builder & migrasi |
| Cloud Storage | Cloudinary | - | Penyimpanan file & gambar |
| Authentication | JWT (jsonwebtoken) | 9.x | Token-based auth |
| Password Hashing | bcrypt | 6.x | Enkripsi password |
| Validasi Backend | Zod | 4.x | Schema validation |
| HTTP Client | Axios | 1.x | Request ke API |
| State Management | Redux Toolkit | 2.x | Global state frontend |
| Routing Frontend | React Router DOM | 7.x | Navigasi halaman |
| CSS Framework | Tailwind CSS | 3.x | Utility-first styling |
| UI Components | Radix UI | - | Headless component library |
| Form Handler | React Hook Form | 7.x | Manajemen form |
| Email | Nodemailer | 8.x | Pengiriman email |
| File Upload | Multer | 2.x | Middleware upload file |
| Security | Helmet | 8.x | HTTP security headers |
| CORS | cors | 2.x | Cross-origin resource sharing |
| Logger | Morgan | 1.x | HTTP request logger |
| Dev Tool | Nodemon | 3.x | Auto-restart server |
| Testing Frontend | Vitest + Playwright | - | Unit & E2E testing |
| Component Docs | Storybook | 10.x | Component development |

---

---

# 2. Analisis Kebutuhan Perangkat Lunak
## (Software Requirements Analysis)

### 2.1 Identifikasi Aktor

| Aktor | Deskripsi |
|---|---|
| **Pelanggan (User)** | Pengguna akhir yang melakukan pemesanan custom box melalui antarmuka web |
| **Admin** | Operator internal perusahaan yang mengelola pesanan, pembayaran, dan data master |
| **Sistem** | Backend yang secara otomatis menghitung harga, memvalidasi input, dan mencatat riwayat |

---

### 2.2 Kebutuhan Fungsional

#### A. Kebutuhan Fungsional — Pelanggan

| Kode | Nama Fungsi | Deskripsi |
|---|---|---|
| KF-U01 | Registrasi Akun | Pelanggan dapat mendaftar dengan mengisi nama, email, dan password |
| KF-U02 | Login | Pelanggan login menggunakan email dan password; sistem mengembalikan JWT token |
| KF-U03 | Lupa Password | Pelanggan dapat mereset password melalui email (token reset disimpan di DB) |
| KF-U04 | Kelola Profil | Pelanggan dapat mengubah nama, nomor telepon, dan alamat pengiriman |
| KF-U05 | Kalkulator Box — Pilih Model | Pelanggan memilih model box dari daftar (data dari DB) |
| KF-U06 | Kalkulator Box — Input Ukuran | Pelanggan memasukkan dimensi (P × L × T) dalam cm; harga dihitung real-time |
| KF-U07 | Kalkulator Box — Pilih Material | Pelanggan memilih jenis material dan gramatur (GSM) |
| KF-U08 | Kalkulator Box — Pilih Warna | Pelanggan memilih opsi cetak (1 sisi / 2 sisi) |
| KF-U09 | Kalkulator Box — Pilih Finishing | Pelanggan memilih laminasi (Glossy/Doff) dan sisi laminasi |
| KF-U10 | Upload File Desain | Pelanggan mengunggah file desain (JPG/PNG/PDF) ke Cloudinary |
| KF-U11 | Input Kuantitas | Pelanggan memasukkan jumlah pesanan; harga total diperbarui |
| KF-U12 | Review & Checkout | Pelanggan melihat ringkasan pesanan dan total harga sebelum konfirmasi |
| KF-U13 | Konfirmasi Pembayaran | Pelanggan upload bukti transfer dan mengajukan konfirmasi pembayaran |
| KF-U14 | Lacak Status Pesanan | Pelanggan melihat status terkini pesanan di halaman profil |

#### B. Kebutuhan Fungsional — Admin

| Kode | Nama Fungsi | Deskripsi |
|---|---|---|
| KF-A01 | Login Admin | Admin login ke dashboard khusus menggunakan akun admin |
| KF-A02 | Kelola Model Box | Admin CRUD model box (nama, kode, gambar, harga dasar) |
| KF-A03 | Kelola Material | Admin CRUD jenis material/kertas |
| KF-A04 | Kelola Finishing | Admin CRUD opsi finishing/laminasi |
| KF-A05 | Kelola Tipe Plano | Admin CRUD ukuran kertas plano (lebar, tinggi, efektif) |
| KF-A06 | Kelola Harga Material | Admin mengatur harga per plano berdasarkan kombinasi plano × material × GSM |
| KF-A07 | Kelola Harga Warna | Admin mengatur harga per sisi cetak berdasarkan range GSM |
| KF-A08 | Kelola Harga CMYK Blok | Admin mengatur harga cetak, drag, dan plat berdasarkan range GSM |
| KF-A09 | Kelola Pricing Config | Admin mengatur multiplier global: laminasi, ongkos kemas, harga pisau, dll. |
| KF-A10 | Lihat Daftar Pesanan | Admin melihat semua pesanan dengan status dan informasi pelanggan |
| KF-A11 | Update Status Pesanan | Admin mengubah status pesanan (PENDING → IN_PRODUCTION → SHIPPED, dst.) |
| KF-A12 | Verifikasi Pembayaran | Admin menyetujui atau menolak bukti pembayaran yang diupload pelanggan |
| KF-A13 | Kelola Rekening Bank | Admin CRUD rekening bank tujuan pembayaran pelanggan |

---

### 2.3 Kebutuhan Non-Fungsional

| Kode | Kategori | Kebutuhan |
|---|---|---|
| KNF-01 | Keamanan | Password disimpan dalam format hash bcrypt (bukan plaintext) |
| KNF-02 | Keamanan | Autentikasi menggunakan JSON Web Token (JWT) dengan masa berlaku terbatas |
| KNF-03 | Keamanan | Middleware Helmet digunakan untuk mengamankan HTTP header |
| KNF-04 | Keamanan | Validasi input di sisi server menggunakan library Zod |
| KNF-05 | Kinerja | Kalkulasi harga dilakukan di server-side untuk konsistensi dan keamanan |
| KNF-06 | Kinerja | Debounce 300ms pada input ukuran untuk mengurangi frekuensi request API |
| KNF-07 | Skalabilitas | File desain dan gambar disimpan di Cloudinary (cloud CDN) bukan di server lokal |
| KNF-08 | Ketersediaan | API berjalan pada port 5000, frontend pada port 5173 |
| KNF-09 | Portabilitas | Konfigurasi lingkungan menggunakan file `.env` untuk memudahkan deployment |
| KNF-10 | Maintainability | Arsitektur backend terstruktur: routes → controllers → services → database |
| KNF-11 | Maintainability | ORM Prisma digunakan sehingga skema database dapat diverifikasi dan dimigrasikan secara otomatis |

---

### 2.4 Use Case Diagram (Deskripsi)

```
┌──────────────────────────────────────────────────────────────────┐
│                    SISTEM BENUA KERTAS APPS                      │
│                                                                  │
│  [Pelanggan]───→ Registrasi Akun                                 │
│  [Pelanggan]───→ Login                                           │
│  [Pelanggan]───→ Kelola Profil                                   │
│  [Pelanggan]───→ Kalkulator Custom Box (8 Step)                  │
│                      ↳ include: Login                            │
│  [Pelanggan]───→ Upload Desain Kemasan                           │
│  [Pelanggan]───→ Checkout Pesanan                                │
│                      ↳ include: Kalkulator Custom Box            │
│  [Pelanggan]───→ Konfirmasi Pembayaran                           │
│                      ↳ include: Checkout Pesanan                 │
│  [Pelanggan]───→ Lacak Status Pesanan                            │
│                                                                  │
│  [Admin]───────→ Login Admin                                     │
│  [Admin]───────→ Kelola Data Master Kustomisasi                  │
│  [Admin]───────→ Kelola Data Mesin Harga (Pricing Engine)        │
│  [Admin]───────→ Kelola Pesanan                                  │
│  [Admin]───────→ Verifikasi Pembayaran                           │
│  [Admin]───────→ Kelola Rekening Bank                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2.5 Alur Proses Bisnis (Business Process Flow)

#### A. Alur Pemesanan Pelanggan

```
[Mulai]
   ↓
Registrasi / Login
   ↓
Buka Halaman Custom Order
   ↓
Step 1: Pilih Model Box
   ↓
Step 2: Input Dimensi (P × L × T) → Harga dihitung real-time
   ↓
Step 3: Pilih Material + Gramatur GSM
   ↓
Step 4: Pilih Warna Cetak (1 Sisi / 2 Sisi)
   ↓
Step 5: Pilih Finishing/Laminasi
   ↓
Step 6: Upload File Desain (JPG/PNG/PDF)
   ↓
Step 7: Input Kuantitas (min. 1 pcs)
   ↓
Step 8: Review Spesifikasi + Ringkasan Harga
   ↓
Konfirmasi → Redirect ke Halaman Pembayaran
   ↓
Transfer Bank sesuai nominal DP
   ↓
Upload Bukti Transfer → Submit Konfirmasi Pembayaran
   ↓
Status Pesanan: ⏳ WAITING_PAYMENT
   ↓
[Menunggu Admin]
```

#### B. Alur Verifikasi & Produksi (Admin)

```
[Admin Login]
   ↓
Dashboard → Order Management
   ↓
Lihat pesanan status WAITING_PAYMENT
   ↓
Buka detail pesanan → Cek bukti transfer
   ↓
   ├─ [TOLAK] → Status: PENDING / Notifikasi penolakan
   │
   └─ [SETUJUI] → Status: PAYMENT_CONFIRMED
         ↓
       Download file desain pelanggan
         ↓
       Mulai produksi → Status: IN_PRODUCTION
         ↓
       Produksi selesai → Status: READY_TO_SHIP
         ↓
       Kirim paket → Status: SHIPPED
         ↓
       Konfirmasi terima → Status: COMPLETED
         ↓
       [Selesai]
```

---

### 2.6 Status Alur Pesanan

| Status | Keterangan | Aktor yang Mengubah |
|---|---|---|
| `PENDING` | Pesanan dibuat, belum ada pembayaran | Sistem (otomatis) |
| `WAITING_PAYMENT` | Pelanggan sudah upload bukti bayar, menunggu verifikasi | Sistem (otomatis) |
| `PAYMENT_CONFIRMED` | Admin menyetujui bukti pembayaran | Admin |
| `IN_PRODUCTION` | Proses produksi sedang berjalan | Admin |
| `READY_TO_SHIP` | Produksi selesai, siap dikirim | Admin |
| `SHIPPED` | Paket sudah dikirim ke pelanggan | Admin |
| `COMPLETED` | Pesanan selesai, diterima pelanggan | Admin |
| `CANCELLED` | Pesanan dibatalkan | Admin |

---

---

# 3. Perancangan (Design)

### 3.1 Perancangan Arsitektur Backend

Struktur direktori backend mengikuti pola **MVC + Service Layer**:

```
server/
├── server.js              # Entry point aplikasi
├── prisma/
│   ├── schema.prisma      # Definisi skema database
│   ├── migrations/        # File migrasi database
│   └── seed.js            # Data awal (seeding)
└── src/
    ├── app.js             # Konfigurasi Express (middleware, routes)
    ├── config/            # Konfigurasi koneksi database (Prisma Client)
    ├── routes/            # Definisi endpoint API
    │   ├── auth.routes.js
    │   ├── masterData.routes.js
    │   ├── calculator.routes.js
    │   ├── order.routes.js
    │   └── upload.routes.js
    ├── controllers/       # Handler request & response HTTP
    ├── services/          # Business logic & query database
    ├── middleware/        # Auth guard, error handler
    ├── validations/       # Skema validasi Zod
    └── utils/             # Helper functions
```

---

### 3.2 Perancangan Arsitektur Frontend

Struktur direktori frontend mengikuti pola **Feature-based Structure**:

```
client/src/
├── main.jsx               # Entry point React
├── App.jsx                # Root component & routing
├── router/                # Konfigurasi React Router
├── store/                 # Redux Toolkit state management
├── pages/
│   ├── HomePage/          # Halaman beranda
│   ├── LoginPage/         # Halaman login
│   ├── RegisterPage/      # Halaman registrasi
│   ├── CustomOrderPage/   # Halaman kalkulator 8 step
│   │   └── components/
│   │       ├── ModelStep.jsx
│   │       ├── SizeStep.jsx
│   │       ├── MaterialStep.jsx
│   │       ├── ColorStep.jsx
│   │       ├── FinishingStep.jsx
│   │       ├── UploadStep.jsx
│   │       ├── QuantityStep.jsx
│   │       └── ReviewStep.jsx
│   ├── PaymentPage/       # Halaman konfirmasi pembayaran
│   ├── ProfilePage/       # Halaman profil & riwayat pesanan
│   └── admin/
│       ├── AdminPage.jsx                     # Dashboard admin
│       ├── OrderManagementPage/              # Kelola pesanan
│       ├── BoxModelManagementPage/           # Kelola model box
│       ├── MaterialManagementPage/           # Kelola material
│       ├── FinishingOptionManagementPage/    # Kelola finishing
│       ├── PlanoTypeManagementPage/          # Kelola tipe plano
│       ├── MaterialPriceManagementPage/      # Kelola harga material
│       ├── CmykBlokPriceManagementPage.jsx   # Kelola harga CMYK
│       ├── PricingConfigManagementPage.jsx   # Kelola config harga
│       └── BankAccountManagementPage/        # Kelola rekening bank
├── components/            # Shared/reusable UI components
├── services/              # API service (Axios calls)
├── hooks/                 # Custom React hooks
└── utils/                 # Utility functions
```

---

### 3.3 Perancangan Database (ERD)

Database menggunakan **MySQL** dengan **13 tabel relasional**, dikelompokkan menjadi:

#### Kelompok A — Tabel Autentikasi & Pengguna

```
[users]
  id (PK) | name | email | password | role | phone |
  province | city | district | postalCode | detailAddress |
  createdAt | resetPasswordToken | resetPasswordExpiry
```

#### Kelompok B — Tabel Master Data Kustomisasi

```
[box_models]       → Model box (Regular, Top-Bottom, Earlock, dll.)
[materials]        → Jenis material kertas (Duplex, Ivory, Kraft)
[finishing_options] → Opsi finishing/laminasi (Glossy, Doff, Tanpa)
[plano_types]      → Ukuran kertas plano (65x100, 79x109, 90x120 cm)
```

#### Kelompok C — Tabel Pricing Engine

```
[material_prices]  → Harga per plano: planoCode × materialCode × thickness
[color_prices]     → Harga per sisi cetak berdasarkan range GSM
[cmyk_blok_prices] → Harga cetak CMYK (cetakPrice, dragPrice, platPrice)
[pricing_config]   → Multiplier global (laminasi, kemas, pisau, drag threshold)
```

#### Kelompok D — Tabel Transaksi

```
[orders]           → Data pesanan lengkap (44 field)
[order_history]    → Audit log setiap perubahan status pesanan
[payments]         → Data pembayaran & bukti transfer
[bank_accounts]    → Rekening bank perusahaan
```

#### Relasi Tabel:

```
users (1) ───── (N) orders          [orders.userId → users.id]
users (1) ───── (N) order_history   [order_history.changedBy → users.id]
users (1) ───── (N) payments        [payments.verifiedBy → users.id]
orders (1) ───── (N) order_history  [order_history.orderId → orders.id]
orders (1) ───── (N) payments       [payments.orderId → orders.id]

[Logical Foreign Keys — tidak di-enforce database]
orders.boxModel    → box_models.code
orders.material    → materials.code
orders.planoType   → plano_types.code
material_prices.planoCode    → plano_types.code
material_prices.materialCode → materials.code
```

---

### 3.4 Perancangan API Endpoint

#### Auth API (`/api/v1/auth`)

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/register` | Registrasi pengguna baru | ❌ |
| POST | `/login` | Login & mendapatkan JWT token | ❌ |
| POST | `/forgot-password` | Kirim email reset password | ❌ |
| POST | `/reset-password` | Reset password dengan token | ❌ |
| GET | `/me` | Mengambil data profil pengguna | ✅ |

#### Master Data API (`/api/v1/master-data`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/box-models` | Daftar semua model box aktif |
| GET | `/materials` | Daftar semua material aktif |
| GET | `/materials/code/:code/thicknesses` | Daftar GSM tersedia untuk material tertentu |
| GET | `/finishing-options` | Daftar opsi finishing aktif |
| GET | `/plano-types` | Daftar tipe plano aktif |
| GET | `/bank-accounts` | Daftar rekening bank aktif |

#### Calculator API (`/api/v1/calculator`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/calculate` | Kalkulasi harga berdasarkan semua parameter pesanan |

#### Order API (`/api/v1/orders`)

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/` | Buat pesanan baru | ✅ User |
| GET | `/my-orders` | Riwayat pesanan pelanggan | ✅ User |
| GET | `/:id` | Detail pesanan | ✅ User/Admin |
| GET | `/admin/all` | Semua pesanan (admin) | ✅ Admin |
| PATCH | `/:id/status` | Update status pesanan | ✅ Admin |
| POST | `/:id/payment` | Upload bukti pembayaran | ✅ User |
| PATCH | `/payment/:paymentId/verify` | Verifikasi pembayaran | ✅ Admin |

#### Upload API (`/api/v1/upload`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/design` | Upload file desain ke Cloudinary |
| POST | `/payment-proof` | Upload bukti pembayaran ke Cloudinary |
| DELETE | `/:publicId` | Hapus file dari Cloudinary |

---

### 3.5 Perancangan Mesin Kalkulasi Harga (Pricing Engine)

Kalkulasi harga dilakukan secara **server-side** berdasarkan parameter yang dikirim frontend:

```
INPUT:
  - boxModel (kode model box)
  - dimensi: panjang × lebar × tinggi (cm)
  - material (kode material)
  - thickness (GSM)
  - colorOption (1-sisi / 2-sisi)
  - laminationSide (luar / dalam / luar-dalam / tanpa)
  - laminationType (glossy / doff)
  - quantity (pcs)

PROSES:
  1. Tentukan planoType yang paling efisien
     → Hitung jumlahMata dari setiap tipe plano
     → Pilih planoType dengan jumlahMata terbanyak

  2. Hitung harga kertas
     → Ambil dari tabel material_prices
       (planoCode × materialCode × thickness)
     → hargaKertas = (qtyPlano × hargaPerPlano)

  3. Hitung harga cetak (ongkos cetak)
     → Ambil cetakPrice & dragPrice dari cmyk_blok_prices
       (berdasarkan range thickness/GSM)
     → Hitung jumlah drag dari quantity
     → hargaCetak = cetakPrice + (drag × dragPrice) + platPrice

  4. Hitung harga warna (dari color_prices)
     → pricePerSide × jumlah sisi

  5. Hitung harga ongkos pon/plong
     → hargaPond = quantity × pondMultiplier (dari pricing_config)

  6. Hitung harga kemas/packing
     → hargaKemas = (quantity / packingDivisor) × packingMultiplier

  7. Hitung harga laminasi (jika ada)
     → hargaLaminasi = P_plano × L_plano × laminasiMultiplier × quantity

  8. Hitung harga pisau (cetakan awal)
     → pisauPrice (nilai flat dari pricing_config)

OUTPUT:
  - totalBayar = sum semua komponen
  - hargaPerPcs = totalBayar / quantity
  - subtotal & totalAmount (disimpan ke tabel orders)
```

---

### 3.6 Perancangan Antarmuka (UI Design)

#### Halaman Utama Pelanggan:
1. **Beranda (Home)** — Informasi produk dan CTA kalkulator
2. **Custom Order** — Stepper 8 langkah dengan preview harga real-time
3. **Pembayaran** — Instruksi transfer + form upload bukti
4. **Profil** — Data pribadi, alamat, dan riwayat pesanan

#### Dashboard Admin:
1. **Dashboard** — Ringkasan statistik pesanan
2. **Order Management** — Tabel pesanan dengan filter status
3. **Master Data**: Box Model, Material, Finishing, Plano Type
4. **Pricing Engine**: Harga Material, Harga Warna, Harga CMYK, Pricing Config
5. **Bank Account** — Manajemen rekening bank

---

---

# 4. Pembuatan Kode (Coding)

### 4.1 Teknologi dan Versi yang Digunakan

#### Backend (Server)

| Library | Versi | Fungsi |
|---|---|---|
| `express` | ^5.2.1 | Framework web server REST API |
| `@prisma/client` | ^5.14.0 | ORM — akses database MySQL |
| `prisma` | ^5.14.0 | CLI migrasi & generator |
| `jsonwebtoken` | ^9.0.3 | Pembuatan & verifikasi JWT token |
| `bcrypt` | ^6.0.0 | Hashing password |
| `zod` | ^4.4.2 | Validasi schema input/output |
| `cloudinary` | ^1.41.3 | SDK upload ke cloud storage |
| `multer` | ^2.1.1 | Middleware parsing multipart/form-data |
| `multer-storage-cloudinary` | ^4.0.0 | Storage adapter Multer ke Cloudinary |
| `nodemailer` | ^8.0.7 | Pengiriman email (lupa password) |
| `cors` | ^2.8.6 | Cross-origin resource sharing |
| `helmet` | ^8.1.0 | Keamanan HTTP header |
| `morgan` | ^1.10.1 | Logger request HTTP |
| `dotenv` | ^17.4.2 | Manajemen environment variable |
| `nodemon` | ^3.1.14 | Auto-restart server (development) |

#### Frontend (Client)

| Library | Versi | Fungsi |
|---|---|---|
| `react` | ^19.2.5 | Library UI |
| `react-dom` | ^19.2.5 | DOM rendering untuk React |
| `vite` | ^8.0.10 | Build tool dan dev server |
| `react-router-dom` | ^7.14.2 | Routing halaman single page |
| `@reduxjs/toolkit` | ^2.11.2 | State management global |
| `react-redux` | ^9.2.0 | Binding React dengan Redux |
| `axios` | ^1.16.0 | HTTP client untuk memanggil API |
| `react-hook-form` | ^7.75.0 | Manajemen form dan validasi |
| `@hookform/resolvers` | ^5.2.2 | Integrasi Zod dengan React Hook Form |
| `zod` | ^4.4.2 | Validasi schema form |
| `tailwindcss` | ^3.4.19 | Utility-first CSS framework |
| `@radix-ui/react-dialog` | ^1.1.15 | Komponen modal/dialog |
| `@radix-ui/react-label` | ^2.1.8 | Komponen label form |
| `@radix-ui/react-toast` | ^1.2.15 | Komponen notifikasi toast |
| `lucide-react` | ^1.14.0 | Library ikon SVG |
| `class-variance-authority` | ^0.7.1 | Manajemen varian class CSS |
| `clsx` + `tailwind-merge` | latest | Utility conditional class |

---

### 4.2 Struktur Implementasi Backend

#### Layer Routes (Routing)
Mendefinisikan endpoint API dan menghubungkan ke controller yang sesuai.

```
/api/v1/auth       → auth.routes.js
/api/v1/master-data → masterData.routes.js
/api/v1/calculator  → calculator.routes.js
/api/v1/orders      → order.routes.js
/api/v1/upload      → upload.routes.js
```

#### Layer Controllers
Menangani request HTTP, memanggil service, dan mengembalikan response JSON.

#### Layer Services
Berisi seluruh business logic — query database via Prisma, kalkulasi harga, validasi business rule.

#### Layer Middleware
- `authMiddleware.js` — Verifikasi JWT token pada protected route
- `adminMiddleware.js` — Memastikan role === 'ADMIN'
- `errorHandler.js` — Global error handler untuk semua uncaught exception

#### Layer Validations
Skema validasi Zod untuk setiap request body yang masuk ke API.

---

### 4.3 Struktur Implementasi Frontend

#### State Management (Redux Toolkit)
State global yang dikelola menggunakan Redux Toolkit:
- `authSlice` — Data pengguna yang sedang login (token, profil)
- Slice lainnya sesuai kebutuhan fitur

#### Routing (React Router DOM)
```
/                        → HomePage
/login                   → LoginPage
/register                → RegisterPage
/custom-order            → CustomOrderPage (8 Step)
/payment/:orderId        → PaymentPage
/profile                 → ProfilePage
/admin                   → AdminPage (Dashboard)
/admin/orders            → OrderManagementPage
/admin/box-models        → BoxModelManagementPage
/admin/materials         → MaterialManagementPage
/admin/finishing         → FinishingOptionManagementPage
/admin/plano-types       → PlanoTypeManagementPage
/admin/material-prices   → MaterialPriceManagementPage
/admin/cmyk-prices       → CmykBlokPriceManagementPage
/admin/pricing-config    → PricingConfigManagementPage
/admin/bank-accounts     → BankAccountManagementPage
```

#### Custom Hooks
Hooks yang dibuat untuk memisahkan logic dari komponen UI:
- Hook untuk fetching data API
- Hook untuk kalkulasi harga

---

### 4.4 Konfigurasi Environment

#### Backend `.env`
```env
DATABASE_URL="mysql://root:password@localhost:3306/benua_kertas_db"
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

### 4.5 Standar Penulisan Kode

- **Backend**: ES Modules (`import`/`export`), `async/await` untuk semua operasi async
- **Frontend**: React Functional Components + Hooks (tidak menggunakan Class Component)
- **Penamaan**: camelCase untuk variabel dan fungsi, PascalCase untuk komponen React
- **Database**: Prisma schema sebagai single source of truth; perubahan melalui migrasi
- **Keamanan**: Tidak ada kredensial yang di-hardcode; semua via `.env`

---

---

# 5. Pengujian (Testing)

### 5.1 Strategi Pengujian

Pengujian dilakukan dalam tiga level:

| Level | Jenis | Tools | Cakupan |
|---|---|---|---|
| Unit Testing | Pengujian komponen individual | Vitest | Fungsi kalkulasi, validasi |
| Integration Testing | Pengujian API endpoint | Manual / Postman | Semua REST API |
| E2E Testing | Pengujian alur pengguna | Playwright | Alur checkout lengkap |

---

### 5.2 Pengujian API (Integration Testing)

Pengujian dilakukan menggunakan **Postman** atau **curl** untuk setiap endpoint. Berikut skenario pengujian utama:

#### Skenario Pengujian Auth API

| No | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-A01 | Registrasi akun baru | name, email, password valid | HTTP 201, data user | ✅ |
| TC-A02 | Registrasi email duplikat | email yang sudah ada | HTTP 409, pesan error | ✅ |
| TC-A03 | Login akun valid | email + password benar | HTTP 200, JWT token | ✅ |
| TC-A04 | Login password salah | password tidak cocok | HTTP 401, pesan error | ✅ |
| TC-A05 | Akses endpoint protected tanpa token | tanpa header Authorization | HTTP 401 Unauthorized | ✅ |

#### Skenario Pengujian Master Data API

| No | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-M01 | Ambil daftar model box | GET request | HTTP 200, array box models | ✅ |
| TC-M02 | Ambil daftar material | GET request | HTTP 200, array materials | ✅ |
| TC-M03 | Ambil GSM berdasarkan kode material | materialCode = "duplex" | HTTP 200, array thickness | ✅ |
| TC-M04 | Ambil daftar finishing | GET request | HTTP 200, array options | ✅ |
| TC-M05 | Ambil daftar rekening bank | GET request | HTTP 200, array bank accounts | ✅ |

#### Skenario Pengujian Calculator API

| No | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-C01 | Kalkulasi harga valid | semua parameter lengkap | HTTP 200, totalBayar, hargaPerPcs | ✅ |
| TC-C02 | Kalkulasi input tidak lengkap | parameter tidak lengkap | HTTP 400, validation error | ✅ |
| TC-C03 | Kalkulasi dimensi = 0 | panjang = 0 | HTTP 400, error dimensi tidak valid | ✅ |
| TC-C04 | Kalkulasi material tidak ditemukan | materialCode tidak ada | HTTP 404 | ✅ |

#### Skenario Pengujian Order API

| No | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-O01 | Buat pesanan baru | semua data valid + auth | HTTP 201, order data | ✅ |
| TC-O02 | Lihat pesanan tanpa auth | tanpa token | HTTP 401 | ✅ |
| TC-O03 | Upload bukti pembayaran | file valid + orderId | HTTP 200 | ✅ |
| TC-O04 | Admin verifikasi pembayaran | paymentId, status=VERIFIED | HTTP 200, status diupdate | ✅ |
| TC-O05 | Admin update status pesanan | orderId, orderStatus baru | HTTP 200, history tercatat | ✅ |

---

### 5.3 Pengujian Fungsional (Black Box Testing)

Pengujian black box dilakukan untuk memvalidasi fungsi dari sudut pandang pengguna:

| No | Skenario | Langkah Uji | Expected Result |
|---|---|---|---|
| BT-01 | Alur pemesanan lengkap | Registrasi → Login → Custom Order 8 Step → Checkout → Upload Bukti | Pesanan terbuat, status = WAITING_PAYMENT |
| BT-02 | Edit spesifikasi dari Review | Step 8 → klik Edit pada step 2 → ubah ukuran → simpan | Kembali ke Review, harga diperbarui |
| BT-03 | Upload file desain | Pilih file PDF → upload | File terupload ke Cloudinary, URL tersimpan |
| BT-04 | Admin verifikasi pembayaran | Admin login → buka pesanan → klik Approve | Status pesanan berubah, order_history tercatat |
| BT-05 | Admin tolak pembayaran | Admin login → buka pesanan → klik Reject + alasan | Status pesanan ke PENDING, alasan tersimpan |
| BT-06 | Pelanggan cek status pesanan | Login → Profil → Riwayat Pesanan | Daftar pesanan muncul dengan status terkini |
| BT-07 | Reset password | Klik Lupa Password → masukkan email → cek email → reset | Password berhasil diubah |
| BT-08 | Admin kelola data master | Admin → Box Model → Tambah → Edit → Nonaktifkan | Data tersimpan, tidak muncul di kalkulator jika nonaktif |

---

### 5.4 Pengujian Validasi Input

| No | Field | Input Tidak Valid | Respons Sistem |
|---|---|---|---|
| VI-01 | Email (registrasi) | Format bukan email | Pesan: "Format email tidak valid" |
| VI-02 | Password (registrasi) | Kurang dari 8 karakter | Pesan: "Password minimal 8 karakter" |
| VI-03 | Dimensi box | Nilai 0 atau negatif | Pesan: "Dimensi harus lebih dari 0" |
| VI-04 | Kuantitas | Nilai 0 | Pesan: "Kuantitas minimal 1 pcs" |
| VI-05 | File desain | Format bukan JPG/PNG/PDF | Pesan: "Format file tidak didukung" |
| VI-06 | File desain | Ukuran file > batas | Pesan: "Ukuran file melebihi batas" |

---

### 5.5 Pengujian Keamanan

| No | Skenario | Metode | Expected Result |
|---|---|---|---|
| KA-01 | SQL Injection | Input berbahaya di form | Ditolak oleh Prisma ORM (parameterized query) |
| KA-02 | Akses route admin oleh user biasa | Request dengan token user ke `/admin/*` | HTTP 403 Forbidden |
| KA-03 | Token JWT expired | Request dengan token kadaluarsa | HTTP 401, token tidak valid |
| KA-04 | Password tersimpan plaintext | Cek langsung di database | Password dalam format hash bcrypt |
| KA-05 | XSS di input form | Script tag di field nama | Tidak dieksekusi (React auto-escaping) |

---

---

# 6. Pemeliharaan (Maintenance)

### 6.1 Strategi Pemeliharaan

Pemeliharaan sistem Benua Kertas Apps dikategorikan dalam empat jenis:

| Jenis | Keterangan |
|---|---|
| **Corrective** | Perbaikan bug dan error yang ditemukan setelah sistem berjalan |
| **Adaptive** | Penyesuaian sistem terhadap perubahan lingkungan (update library, perubahan API pihak ketiga) |
| **Perfective** | Peningkatan performa dan penambahan fitur berdasarkan feedback pengguna |
| **Preventive** | Refactoring kode, update dependensi keamanan, backup database |

---

### 6.2 Prosedur Backup Database

```bash
# Backup database MySQL
mysqldump -u root -p benua_kertas_db > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u root -p benua_kertas_db < backup_20260101.sql
```

Jadwal backup yang disarankan:
- **Harian**: Backup otomatis setiap hari pukul 00.00
- **Mingguan**: Backup penuh disimpan selama 4 minggu
- **Bulanan**: Backup arsip disimpan selama 12 bulan

---

### 6.3 Prosedur Update dan Migrasi Database

Setiap perubahan skema database dilakukan melalui **Prisma Migrate**:

```bash
# Membuat migrasi baru setelah mengubah schema.prisma
npx prisma migrate dev --name nama_perubahan

# Deploy migrasi ke production
npx prisma migrate deploy

# Memeriksa status migrasi
npx prisma migrate status

# Regenerate Prisma Client
npx prisma generate
```

---

### 6.4 Prosedur Update Dependensi

```bash
# Cek dependensi yang perlu diupdate
npm outdated

# Update dependensi minor (aman)
npm update

# Update dependensi major (perlu testing)
npm install nama-package@latest
```

> **Perhatian**: Update library major (misalnya Express 5 → 6) harus melalui tahap pengujian penuh sebelum diterapkan ke production.

---

### 6.5 Monitoring dan Logging

- **Morgan** digunakan untuk mencatat semua HTTP request ke konsol server
- Setiap perubahan status pesanan otomatis dicatat ke tabel `order_history` (audit trail)
- Error yang tidak tertangani dicatat oleh global error handler (`errorHandler.js`)

Informasi yang dicatat di `order_history`:
- `orderId` — Pesanan yang berubah
- `previousStatus` — Status sebelum perubahan
- `newStatus` — Status setelah perubahan
- `changedBy` — ID admin/sistem yang mengubah
- `changeType` — Jenis perubahan (STATUS_CHANGE, PAYMENT_UPDATE, dll.)
- `notes` — Catatan tambahan
- `createdAt` — Waktu perubahan

---

### 6.6 Panduan Menjalankan Ulang Sistem

#### Menjalankan Backend (Development)
```bash
cd server
npm install          # Install dependensi
cp .env.example .env # Salin file environment
# Edit .env sesuai konfigurasi lokal
npm run dev          # Jalankan server (http://localhost:5000)
```

#### Menjalankan Frontend (Development)
```bash
cd client
npm install          # Install dependensi
# Buat file .env berisi VITE_API_URL=http://localhost:5000/api/v1
npm run dev          # Jalankan frontend (http://localhost:5173)
```

#### Inisialisasi Database (Pertama Kali)
```bash
cd server
npx prisma migrate deploy  # Jalankan semua migrasi
node prisma/seed.js        # Isi data awal
npx prisma studio          # (Opsional) Buka antarmuka visual database
```

---

### 6.7 Rencana Pengembangan Lanjutan (Future Enhancement)

| Prioritas | Fitur | Keterangan |
|---|---|---|
| Tinggi | Notifikasi Email | Kirim email ke pelanggan saat status pesanan berubah |
| Tinggi | Invoice PDF | Generate invoice/bukti pesanan dalam format PDF |
| Sedang | Dashboard Statistik | Laporan penjualan, grafik pesanan per bulan |
| Sedang | Notifikasi WhatsApp | Integrasi WhatsApp Business API |
| Rendah | Tracking Pengiriman | Integrasi dengan API kurir (JNE, J&T) |
| Rendah | Katalog Produk Jadi | Etalase produk ready-stock untuk pembeli non-custom |
| Rendah | Multi-bahasa | Dukungan bahasa Inggris selain Indonesia |

---

### 6.8 Troubleshooting Umum

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Server tidak bisa konek ke database | `DATABASE_URL` salah di `.env` | Periksa dan perbaiki connection string |
| Upload file gagal | Kredensial Cloudinary salah | Periksa `CLOUDINARY_API_KEY` dan `CLOUDINARY_API_SECRET` |
| JWT token ditolak | Secret key berubah atau token expired | Clear token di localStorage, login ulang |
| Harga kalkulasi = 0 | Data pricing belum ada di database | Jalankan seed: `node prisma/seed.js` |
| CORS error di frontend | `CLIENT_URL` tidak terdaftar di backend | Tambahkan origin frontend di `app.js` CORS config |
| Migrasi gagal | Konflik skema database | Jalankan `npx prisma migrate reset` (hati-hati: data hilang) |

---

## Ringkasan Akhir

| Aspek | Detail |
|---|---|
| **Nama Proyek** | Benua Kertas Apps — Sistem Pemesanan Custom Box |
| **Jenis Aplikasi** | Web Application (Fullstack) |
| **Metode Pengembangan** | Waterfall |
| **Backend** | Node.js + Express.js + Prisma + MySQL |
| **Frontend** | React 19 + Vite + Tailwind CSS + Redux Toolkit |
| **Cloud Storage** | Cloudinary |
| **Autentikasi** | JWT (JSON Web Token) |
| **Jumlah Tabel DB** | 13 tabel |
| **Jumlah Halaman** | 8 halaman user + 10 halaman admin |
| **Jumlah API Endpoint** | 30+ endpoint |
| **Fitur Utama** | Kalkulator harga real-time, upload file desain, verifikasi pembayaran manual, audit trail status pesanan |
