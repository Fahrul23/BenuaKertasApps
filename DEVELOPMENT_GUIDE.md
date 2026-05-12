# 📘 Development Guide — Benua Kertas Apps

Panduan ini wajib dibaca dan diikuti oleh semua developer yang berkontribusi pada project ini.

---

## 📁 Struktur Monorepo

```
benua-kertas-apps/
├── client/   ← React + Vite (Frontend)
└── server/   ← Node.js + Express + Prisma (Backend)
```

---

## 🎨 Color Palette (WAJIB)

Semua warna **harus** menggunakan token dari color palette yang sudah didefinisikan di `client/tailwind.config.js`.
**Dilarang keras menggunakan hardcode hex** seperti `text-[#5E9434]` atau `bg-[#154321]`.

### Token Warna

| Token | Hex | Kegunaan |
|---|---|---|
| `color-primary` | `#5E9434` | Warna utama — tombol CTA, badge, aksen aktif |
| `color-dark` | `#3E6D30` | Hover state, border, teks emphasis |
| `color-darker` | `#154321` | Footer, heading besar, elemen dominan |
| `color-light` | `#E3ECDA` | Background section, card light |
| `color-black` | `#000000` | Teks utama, ikon |
| `color-gray` | `#6D747D` | Teks sekunder, placeholder, caption |
| `color-white` | `#FFFFFF` | Background putih, teks di atas bg gelap |
| `color-grad_start` | `#4A750C` | Warna awal untuk efek gradien (hover button/card) |
| `color-grad_end` | `#8BDB16` | Warna akhir untuk efek gradien (hover button/card) |

### Cara Pemakaian

```jsx
// ✅ BENAR — gunakan token
<button className="bg-color-primary hover:bg-color-dark text-color-white">
  Pesan Sekarang
</button>

<p className="text-color-gray text-sm">Teks sekunder atau keterangan</p>

<section className="bg-color-light">
  ...
</section>

// ❌ SALAH — jangan hardcode hex
<button className="bg-[#5E9434] text-white">
<p className="text-[#6D747D]">
```

---

## 🖥️ Aturan Frontend (Client)

### Struktur Folder

```
src/
├── assets/       ← Gambar, ikon statis
├── components/   ← Komponen reusable (Navbar, Footer, dll)
│   └── ui/       ← Komponen UI primitif (shadcn/ui)
├── hooks/        ← Custom React hooks
├── pages/        ← Halaman aplikasi (Wajib terstruktur dalam folder per halaman)
│   ├── HomePage/
│   │   ├── components/  ← Komponen spesifik hanya untuk halaman ini
│   │   ├── constants/   ← Data statis/dummy khusus halaman ini
│   │   └── HomePage.jsx ← Entry point halaman
│   └── admin/    ← Halaman khusus admin
├── router/       ← Konfigurasi React Router
├── services/     ← Fungsi pemanggil API (axios)
├── store/        ← Redux Toolkit (slice & store)
└── utils/        ← Fungsi helper/utilitas
```

### Aturan Komponen

- Satu file = satu komponen utama.
- Nama file komponen menggunakan **PascalCase**: `ProductCard.jsx`, `OrderTable.jsx`.
- Komponen reusable taruh di `components/`.
- Jangan menaruh logika API call langsung di komponen — gunakan `services/`.
- **Clean Architecture untuk Halaman (Page):**
  - Setiap halaman wajib dibuatkan folder tersendiri (contoh: `pages/HomePage/`).
  - Pecah UI halaman yang panjang menjadi komponen-komponen kecil, simpan di sub-folder `components/` milik halaman tersebut (contoh: `pages/HomePage/components/HeroSection.jsx`).
  - Jangan mencampur data *dummy*, *hardcoded array*, atau daftar konfigurasi di dalam file komponen UI. Ekstrak ke dalam file `constants/index.js` di folder halaman tersebut.

### Aturan Styling

- Gunakan **Tailwind CSS** untuk semua styling.
- Gunakan color token `color-*` (lihat bagian Color Palette).
- Hindari inline style (`style={{}}`), kecuali untuk nilai dinamis yang tidak bisa dilakukan dengan Tailwind.
- Gunakan class `container` dari Tailwind untuk layout konten utama.

### Aturan Asset (Gambar & Ikon)

- **Semua file gambar dan ikon (termasuk SVG)** harus disimpan di dalam folder `src/assets/`.
- **Dilarang** membuat komponen SVG inline atau menyimpannya di dalam variabel di file komponen (misalnya `const MyIcon = () => <svg>...</svg>`).
- Impor file SVG/gambar dari `assets/` dan gunakan melalui tag `<img src={...} />`.

### State Management

- Gunakan **Redux Toolkit** untuk state global (auth, cart, dll).
- Gunakan `useState` / `useReducer` untuk state lokal komponen.
- Jangan menaruh data fetching langsung di Redux — gunakan `createAsyncThunk`.

### Naming Convention

| Jenis | Convention | Contoh |
|---|---|---|
| Komponen | PascalCase | `ProductCard.jsx` |
| Hook | camelCase + `use` prefix | `useAuth.js` |
| Service | camelCase | `authService.js` |
| Store slice | camelCase | `authSlice.js` |
| Halaman | PascalCase + `Page` suffix | `LoginPage.jsx` |

---

## ⚙️ Aturan Backend (Server)

### Struktur Folder

```
src/
├── config/       ← Konfigurasi (Prisma, Mailer)
├── controllers/  ← Handler request/response
├── middleware/   ← Middleware Express (auth, validate, error)
├── routes/       ← Definisi route API
├── services/     ← Logika bisnis utama
└── validations/  ← Schema validasi Zod
```

### Aturan Arsitektur

- Ikuti pola **Route → Controller → Service → Prisma**.
- **Controller** hanya boleh berisi: ambil data dari `req`, panggil service, kirim response.
- **Service** berisi semua logika bisnis dan interaksi database.
- Jangan akses `prisma` langsung dari controller — selalu lewat service, kecuali untuk query sederhana seperti `findUnique` di `getMe`.

### Aturan API

- Semua route diawali dengan `/api/v1/`.
- Gunakan HTTP method yang sesuai: `GET`, `POST`, `PUT`/`PATCH`, `DELETE`.
- Response selalu berbentuk JSON dengan struktur konsisten:
  ```json
  // Sukses
  { "success": true, "message": "...", "data": {} }

  // Error
  { "success": false, "message": "Pesan error", "errors": [] }
  ```

### Validasi

- Semua input dari client **wajib** divalidasi menggunakan **Zod** sebelum masuk controller.
- Taruh semua schema validasi di folder `validations/`.

### Environment Variables

- Semua konfigurasi sensitif disimpan di file `.env` (tidak di-commit ke Git).
- Ikuti format yang sudah ada di file `.env`.
- Variabel yang dibutuhkan:
  ```
  PORT
  NODE_ENV
  DATABASE_URL
  JWT_SECRET
  CLIENT_URL
  MAIL_HOST
  MAIL_PORT
  MAIL_USER
  MAIL_PASS
  ```

---

## 🛢️ Database (Prisma + MySQL)

- Semua perubahan skema database dilakukan di file `server/prisma/schema.prisma`.
- Setelah mengubah schema, jalankan:
  ```bash
  npx prisma migrate dev --name <nama_perubahan>
  ```
- **Jangan** mengedit file di folder `prisma/migrations/` secara manual.
- Gunakan `npx prisma studio` untuk melihat data di browser secara visual.

---

## 🚀 Menjalankan Project

### Backend (Server)
```bash
cd server
# Pastikan Node.js >= 18
npm install
npm run dev
```
> Server berjalan di `http://localhost:5000`

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```
> Client berjalan di `http://localhost:5173`

---

## 🔒 Git & Branching

- Branch utama: `main` (production-ready).
- Branch development: `development`.
- Untuk fitur baru, buat branch dari `development`:
  ```
  feature/<nama-fitur>     → fitur baru
  fix/<nama-bug>           → perbaikan bug
  refactor/<nama-bagian>   → refactor kode
  ```
- **Jangan push langsung ke `main`.**
- Buat Pull Request (PR) untuk setiap perubahan, minta review sebelum merge.

---

## 📝 Catatan Penting

- File `.env` **tidak boleh** di-commit ke Git (sudah ada di `.gitignore`).
- Selalu jalankan `npx prisma generate` setelah pull jika ada perubahan schema.
- Gunakan Node.js versi **18 atau ke atas** (Prisma 5 tidak support Node < 16).
