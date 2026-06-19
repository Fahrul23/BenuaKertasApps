# Prompt: Perubahan Logic Perhitungan Harga (Pricing Engine v3)

Paste prompt di bawah ini ke Claude atau AI lain untuk implementasi.

---

## PROMPT

Saya perlu mengubah total logic perhitungan harga di sistem Custom Order Box. Sistem sebelumnya pakai matrix sederhana, sekarang harus diubah menjadi **formula produksi lengkap** yang mencakup harga kertas, cetak, drag, plat, pisau, pond, packing, dan laminasi.

---

### Konteks Sistem
- ORM: Prisma + PostgreSQL
- Backend: Node.js + TypeScript
- Frontend: React + TypeScript
- 1 Rim = 500 lembar plano. Qty box minimal 1000 pcs (2 rim)
- Logic penentuan ukuran aktual & jenis plano sudah ada di file `ALUR_PENENTUAN_PLANO.md` (gunakan formula yang sudah ada di sana, jangan diubah)

---

## Contoh Kasus Lengkap (Acuan Validasi)

**Input:**
- Tipe Box: Earlock Box Samping
- Bahan: Duplex, Gramatur 310
- Ukuran: Panjang 25, Lebar 15, Tinggi 8, Lidah 3
- Qty Box: 2500 pcs

**Hasil Kalkulasi:**

| Tahap | Formula | Hasil |
|---|---|---|
| Ukuran Aktual | sesuai formula box di `ALUR_PENENTUAN_PLANO.md` | P=49, L=41 |
| Jenis Plano | sesuai logic rekomendasi plano | 90×120, jumlah mata = 4 |
| Qty Plano | `qtyBox ÷ jumlahMata ÷ 500` | `2500 ÷ 4 ÷ 500 = 1.25` |
| Qty Rim | `qtyPlano ÷ jumlahMata` *(catatan: lihat bagian "Perlu Verifikasi" di bawah)* | `1.25 ÷ ... = 5` |

**Breakdown Harga:**

| Komponen | Formula | Hasil |
|---|---|---|
| Harga Kertas/Plano | lookup `MaterialPrice[plano=90x120][bahan=duplex][gramatur=310]` | 2.382.629 |
| Harga Cetak | lookup `CmykBlokPrice[gramatur=310].cetak` | 460.000 |
| Harga Drag | `(qtyBox − 1000) × CmykBlokPrice[gramatur=310].drag` = `(2500−1000) × 120` | 180.000 |
| Harga Plat | tetap (flat) | 170.000 |
| Harga Pisau | tetap (flat) | 700.000 |
| Harga Pond | `qtyBox × 85` = `2500 × 85` | 212.500 |
| Harga Packing | `(qtyBox ÷ 500) × 15.000` = `(2500÷500) × 15.000` | 75.000 |
| Harga Laminasi | `panjangAktual × lebarAktual × 0.3 × qtyBox` = `49 × 41 × 0.3 × 2500` | 1.506.750 |
| **Total Bayar** | sum semua komponen di atas | **5.886.879** |
| **Harga per pcs** | `totalBayar ÷ qtyBox` | **2.354,75** |

> ⚠️ **Catatan ketidaksesuaian dengan contoh gambar asli:** Pada gambar referensi, "Harga Packing" tertulis 750.000 dan "Total Bayar" tertulis 6.321.879 — namun setelah verifikasi formula, nilai yang konsisten secara matematis adalah **Harga Packing = 75.000** dan **Total Bayar = 5.886.879**. Gunakan formula tertulis di atas sebagai sumber kebenaran, bukan angka di gambar yang mengandung salah ketik.

---

## 10 Aturan Perhitungan Harga

### 1. Harga Kertas/Plano
```
Lookup dari tabel MaterialPrice berdasarkan: jenisPlano × bahan × gramatur
```

### 2. Harga Cetak
```
Lookup dari tabel CmykBlokPrice berdasarkan: gramatur → field cetak
```

### 3. Harga Drag
```
hargaDrag = (qtyBox − 1000) × CmykBlokPrice[gramatur].drag
```
> Jika `qtyBox ≤ 1000`, maka `hargaDrag = 0` (tidak boleh negatif)

### 4. Harga Plat
```
hargaPlat = CmykBlokPrice[gramatur].plat   // nilai tetap per gramatur, biasanya 170.000
```

### 5. Harga Pisau
```
hargaPisau = 700.000   // nilai tetap, flat untuk semua order
```

### 6. Harga Pond
```
hargaPond = qtyBox × 85
```

### 7. Harga Packing
```
hargaPacking = (qtyBox ÷ 500) × 15.000
```

### 8. Harga Laminasi
```
hargaLaminasi = panjangAktual × lebarAktual × 0.3 × qtyBox
```
> `panjangAktual` dan `lebarAktual` adalah hasil dari formula ukuran aktual di `ALUR_PENENTUAN_PLANO.md`, BUKAN ukuran plano.

### 9. Total Bayar
```
totalBayar = hargaKertas + hargaCetak + hargaDrag + hargaPlat + hargaPisau + hargaPond + hargaPacking + hargaLaminasi
```

### 10. Harga per Pcs
```
hargaPerPcs = totalBayar ÷ qtyBox
```

---

## ⚠️ Perlu Verifikasi Sebelum Implementasi

Sebelum AI mengimplementasikan, mohon konfirmasi ulang ke tim/owner sistem untuk 2 hal berikut karena ada ambiguitas dari data contoh:

1. **Rumus Qty Rim** — disebutkan `qtyPlano ÷ jumlahMata`, namun `1.25 ÷ 4 = 0.3125`, bukan `5`. Kemungkinan rumus yang benar adalah `qtyPlano × jumlahMata` atau `qtyBox ÷ 500` (yaitu `2500 ÷ 500 = 5`). **Rekomendasi: gunakan `qtyBox ÷ 500` karena hasilnya konsisten dengan tabel "QTY Rim" di gambar (500=1 rim, 1000=2 rim, dst).**
2. **Field CMYK Blok untuk gramatur 310** — gambar tabel `CMYK Blok` hanya punya baris `210-330`, `350`, `400`. Pastikan gramatur 310 termasuk dalam range `210-330` untuk lookup cetak/drag/plat.

---

## 🗂️ Perubahan Tabel Database

### Tabel BARU

#### 1. `CmykBlokPrice` — Master harga cetak, drag, plat per range gramatur
```prisma
model CmykBlokPrice {
  id            String   @id @default(uuid())
  thicknessMin  Int               // gramatur minimal range, contoh: 210
  thicknessMax  Int               // gramatur maksimal range, contoh: 330
  cetakPrice    Float             // harga cetak, contoh: 460000
  dragPrice     Float             // harga per unit drag, contoh: 120
  platPrice     Float             // harga plat flat, contoh: 170000
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([thicknessMin])
  @@index([isActive])
  @@map("cmyk_blok_prices")
}
```

Seed data:
```typescript
{ thicknessMin: 210, thicknessMax: 330, cetakPrice: 460000, dragPrice: 120, platPrice: 170000 }
{ thicknessMin: 350, thicknessMax: 350, cetakPrice: 550000, dragPrice: 140, platPrice: 170000 }
{ thicknessMin: 400, thicknessMax: 400, cetakPrice: 600000, dragPrice: 160, platPrice: 170000 }
```

#### 2. `FixedCost` — Biaya tetap (pisau, dan biaya flat lainnya di masa depan)
```prisma
model FixedCost {
  id          String   @id @default(uuid())
  code        String   @unique   // "pisau" | dst
  name        String             // "Harga Pisau"
  amount      Float              // 700000
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("fixed_costs")
}
```

Seed data:
```typescript
{ code: 'pisau', name: 'Harga Pisau', amount: 700000 }
```

> Field `pondMultiplier` (85) dan `packingDivisor` (500) serta `packingMultiplier` (15000) dan `laminasiMultiplier` (0.3) dapat disimpan sebagai konstanta di kode backend, ATAU sebagai baris tambahan di tabel `FixedCost` jika ingin bisa diubah admin tanpa deploy ulang. Rekomendasi: simpan sebagai **config yang bisa diubah admin**, tambahkan field berikut:

```prisma
model PricingConfig {
  id                   String   @id @default(uuid())
  pondMultiplier       Float    @default(85)     // hargaPond = qty × ini
  packingDivisor       Int      @default(500)    // qty ÷ ini
  packingMultiplier    Float    @default(15000)  // hasil ÷ dikali ini
  laminasiMultiplier   Float    @default(0.3)    // P × L × ini × qty
  pisauPrice           Float    @default(700000) // harga pisau flat
  dragThreshold        Int      @default(1000)   // qty dikurangi ini sebelum dikali dragPrice
  updatedAt            DateTime @updatedAt

  @@map("pricing_config")
}
```
> Hanya 1 baris (singleton) di tabel ini — semua nilai bisa diubah admin lewat dashboard tanpa perlu deploy ulang aplikasi.

### Tabel DIUPDATE

#### `MaterialPrice` — tetap dipakai sebagai harga kertas/plano (sudah benar dari perubahan sebelumnya)
```prisma
model MaterialPrice {
  id           String   @id @default(uuid())
  planoCode    String             // "65x100" | "79x109" | "90x120"
  materialCode String             // "duplex" | "ivory"
  thickness    Int                // gramatur: 230|250|270|300|310|350|400
  price        Float              // harga per plano
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([planoCode, materialCode, thickness])
  @@map("material_prices")
}
```

#### `Order` — Tambah field breakdown harga baru
```prisma
// Tambahkan ke model Order:

// Hasil kalkulasi plano (sudah ada dari perubahan sebelumnya)
planoType        String?
paperWidth       Float?
paperHeight      Float?
actualLength     Float?   // ukuran aktual hasil formula (panjang)
actualWidth      Float?   // ukuran aktual hasil formula (lebar)
jumlahMata       Int?
qtyPlano         Float?   // hasil qtyBox ÷ jumlahMata ÷ 500 (desimal, tidak dibulatkan)
qtyRim           Int?     // jumlah rim yang dibutuhkan

// Breakdown harga produksi (BARU - ganti dari versi sebelumnya)
hargaKertas      Float?   // dari MaterialPrice lookup
hargaCetak       Float?   // dari CmykBlokPrice lookup
hargaDrag        Float?   // (qty - 1000) × dragPrice
hargaPlat        Float?   // flat dari CmykBlokPrice
hargaPisau       Float?   // flat dari FixedCost/PricingConfig
hargaPond        Float?   // qty × 85
hargaPacking     Float?   // (qty ÷ 500) × 15000
hargaLaminasi    Float?   // actualLength × actualWidth × 0.3 × qty
totalBayar       Float?   // sum semua harga di atas
hargaPerPcs      Float?   // totalBayar ÷ qty

// HAPUS field dari versi sebelumnya (tidak dipakai lagi):
// hargaMaterial, hargaWarna, subtotalPerUnit, markup, totalPrice
// (kecuali totalBayar yang menggantikan totalPrice, dan hargaPerPcs yang baru)
```

> **Catatan:** Field `hargaWarna` (warna 1 sisi/2 sisi) dari logic sebelumnya **tidak muncul** di 10 poin baru ini. Jika warna sisi kemasan masih jadi bagian dari order, perlu konfirmasi apakah `hargaWarna` masih dihitung terpisah dan ditambahkan ke `totalBayar`, atau sudah tidak dipakai lagi di model harga yang baru ini.

---

## 🔢 Logic Kalkulasi Backend (Lengkap)

```typescript
// ============================================================
// STEP A: Ukuran Aktual & Plano (pakai logic existing dari ALUR_PENENTUAN_PLANO.md)
// ============================================================
// Tidak diubah — gunakan fungsi hitungUkuranKertas() dan rekomendasiPlano()
// yang sudah diimplementasikan sebelumnya.

// ============================================================
// STEP B: Qty Plano & Qty Rim
// ============================================================
function hitungQtyPlano(qtyBox: number, jumlahMata: number): number {
  return qtyBox / jumlahMata / 500
}

function hitungQtyRim(qtyBox: number): number {
  // Berdasarkan tabel referensi: 500=1, 1000=2, 1500=3, 2000=4, 2500=5
  return qtyBox / 500
}

// ============================================================
// STEP C: Harga Kertas
// ============================================================
async function hitungHargaKertas(planoCode: string, materialCode: string, thickness: number) {
  const record = await prisma.materialPrice.findUnique({
    where: { planoCode_materialCode_thickness: { planoCode, materialCode, thickness } }
  })
  if (!record) throw new Error(`Harga kertas tidak ditemukan: ${planoCode} × ${materialCode} × ${thickness}gsm`)
  return record.price
}

// ============================================================
// STEP D: Harga Cetak, Drag, Plat (lookup CmykBlokPrice by gramatur range)
// ============================================================
async function getCmykBlokPrice(thickness: number) {
  const record = await prisma.cmykBlokPrice.findFirst({
    where: { thicknessMin: { lte: thickness }, thicknessMax: { gte: thickness }, isActive: true }
  })
  if (!record) throw new Error(`Harga CMYK Blok tidak ditemukan untuk gramatur ${thickness}`)
  return record
}

async function hitungHargaCetak(thickness: number) {
  const cmyk = await getCmykBlokPrice(thickness)
  return cmyk.cetakPrice
}

async function hitungHargaDrag(qtyBox: number, thickness: number, dragThreshold: number = 1000) {
  const cmyk = await getCmykBlokPrice(thickness)
  const excessQty = Math.max(0, qtyBox - dragThreshold)
  return excessQty * cmyk.dragPrice
}

async function hitungHargaPlat(thickness: number) {
  const cmyk = await getCmykBlokPrice(thickness)
  return cmyk.platPrice
}

// ============================================================
// STEP E: Harga Pisau (flat)
// ============================================================
async function hitungHargaPisau() {
  const config = await prisma.pricingConfig.findFirst()
  return config?.pisauPrice ?? 700000
}

// ============================================================
// STEP F: Harga Pond
// ============================================================
async function hitungHargaPond(qtyBox: number) {
  const config = await prisma.pricingConfig.findFirst()
  const multiplier = config?.pondMultiplier ?? 85
  return qtyBox * multiplier
}

// ============================================================
// STEP G: Harga Packing
// ============================================================
async function hitungHargaPacking(qtyBox: number) {
  const config = await prisma.pricingConfig.findFirst()
  const divisor = config?.packingDivisor ?? 500
  const multiplier = config?.packingMultiplier ?? 15000
  return (qtyBox / divisor) * multiplier
}

// ============================================================
// STEP H: Harga Laminasi
// ============================================================
async function hitungHargaLaminasi(actualLength: number, actualWidth: number, qtyBox: number) {
  const config = await prisma.pricingConfig.findFirst()
  const multiplier = config?.laminasiMultiplier ?? 0.3
  return actualLength * actualWidth * multiplier * qtyBox
}

// ============================================================
// STEP I: Total Bayar & Harga per Pcs
// ============================================================
function hitungTotalBayar(components: {
  hargaKertas: number
  hargaCetak: number
  hargaDrag: number
  hargaPlat: number
  hargaPisau: number
  hargaPond: number
  hargaPacking: number
  hargaLaminasi: number
}) {
  const totalBayar = Object.values(components).reduce((sum, v) => sum + v, 0)
  return totalBayar
}

function hitungHargaPerPcs(totalBayar: number, qtyBox: number) {
  return totalBayar / qtyBox
}

// ============================================================
// MAIN: Orkestrasi seluruh kalkulasi
// ============================================================
async function calculatePricing(input: {
  boxModel: string
  length: number
  width: number
  height: number
  extras: { lidah?: number; tTutup?: number }
  materialCode: string
  thickness: number
  qtyBox: number
}) {
  // A. Ukuran aktual & plano (pakai fungsi existing)
  const { paperWidth, paperHeight } = hitungUkuranKertas(input.boxModel, input.length, input.width, input.height, input.extras)
  const plano = rekomendasiPlano(paperWidth, paperHeight, input.boxModel)

  // B. Qty plano & rim
  const qtyPlano = hitungQtyPlano(input.qtyBox, plano.jumlahMata)
  const qtyRim = hitungQtyRim(input.qtyBox)

  // C-H. Semua komponen harga
  const hargaKertas   = await hitungHargaKertas(plano.code, input.materialCode, input.thickness)
  const hargaCetak    = await hitungHargaCetak(input.thickness)
  const hargaDrag     = await hitungHargaDrag(input.qtyBox, input.thickness)
  const hargaPlat     = await hitungHargaPlat(input.thickness)
  const hargaPisau    = await hitungHargaPisau()
  const hargaPond     = await hitungHargaPond(input.qtyBox)
  const hargaPacking  = await hitungHargaPacking(input.qtyBox)
  const hargaLaminasi = await hitungHargaLaminasi(paperWidth, paperHeight, input.qtyBox)
  // ⚠️ Ganti paperWidth/paperHeight di atas dengan actualLength/actualWidth
  // jika "ukuran aktual" berbeda dari "ukuran kertas" dalam implementasi existing —
  // sesuaikan dengan output fungsi hitungUkuranKertas() di ALUR_PENENTUAN_PLANO.md

  // I. Total
  const totalBayar = hitungTotalBayar({
    hargaKertas, hargaCetak, hargaDrag, hargaPlat,
    hargaPisau, hargaPond, hargaPacking, hargaLaminasi
  })
  const hargaPerPcs = hitungHargaPerPcs(totalBayar, input.qtyBox)

  return {
    planoType: plano.code,
    paperWidth, paperHeight,
    jumlahMata: plano.jumlahMata,
    qtyPlano, qtyRim,
    hargaKertas, hargaCetak, hargaDrag, hargaPlat,
    hargaPisau, hargaPond, hargaPacking, hargaLaminasi,
    totalBayar, hargaPerPcs
  }
}
```

---

## 🖥️ Perubahan Frontend

### Alur Step Baru

```
Step 1: Pilih Box Model
Step 2: Input Ukuran (P, L, T, + Lidah/T-Tutup jika perlu)
        → [AUTO] hitung ukuran aktual + rekomendasi plano + jumlah mata
Step 3: Pilih Bahan + Gramatur
        → [AUTO] hitung hargaKertas, hargaCetak, hargaDrag, hargaPlat
Step 4: Pilih Laminasi (Bagian + Tipe)
        → [AUTO] hitung hargaLaminasi
Step 5: Pilih Quantity (kelipatan 500, minimal 1000/2 rim)
        → [AUTO] hitung qtyPlano, qtyRim, hargaPond, hargaPacking
Step 6: Review — tampilkan breakdown lengkap + total bayar + harga per pcs
```

> **Catatan:** Step warna sisi kemasan (1 sisi/2 sisi) tidak muncul di 10 rumus baru ini — perlu dikonfirmasi apakah step ini masih ada di flow atau dihapus.

### Validasi Quantity (Kelipatan Rim)

```typescript
const RIM_SIZE = 500

const isValidQty = (qty: number): boolean => {
  return qty >= 1000 && qty % RIM_SIZE === 0  // minimal 2 rim, kelipatan 500
}

// UI: tampilkan pilihan kelipatan rim
const QTY_OPTIONS = [1000, 1500, 2000, 2500, 3000] // dst, bisa generate dinamis
```

### Komponen Breakdown Harga (Live Update)

```tsx
function PriceBreakdown({ pricing }: { pricing: PricingResult }) {
  return (
    <div className="price-breakdown">
      <Row label="Jenis Plano"        value={pricing.planoType} />
      <Row label="Jumlah Mata"        value={`${pricing.jumlahMata} mata`} />
      <Row label="Qty Plano"          value={pricing.qtyPlano.toFixed(2)} />
      <Row label="Qty Rim"            value={`${pricing.qtyRim} rim`} />
      <Divider />
      <Row label="Harga Kertas"       value={formatRupiah(pricing.hargaKertas)} />
      <Row label="Harga Cetak"        value={formatRupiah(pricing.hargaCetak)} />
      <Row label="Harga Drag"         value={formatRupiah(pricing.hargaDrag)} />
      <Row label="Harga Plat"         value={formatRupiah(pricing.hargaPlat)} />
      <Row label="Harga Pisau"        value={formatRupiah(pricing.hargaPisau)} />
      <Row label="Harga Pond"         value={formatRupiah(pricing.hargaPond)} />
      <Row label="Harga Packing"      value={formatRupiah(pricing.hargaPacking)} />
      <Row label="Harga Laminasi"     value={formatRupiah(pricing.hargaLaminasi)} />
      <Divider />
      <Row label="Total Bayar"        value={formatRupiah(pricing.totalBayar)} bold highlight />
      <Row label="Harga per Pcs"      value={formatRupiah(pricing.hargaPerPcs)} bold />
    </div>
  )
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
```

### Endpoint API yang Dipanggil Frontend

```typescript
// Dipanggil setiap kali user menyelesaikan step yang relevan dengan harga
POST /api/calculator/pricing
Body: {
  boxModel, length, width, height, lidah, tTutup,
  materialCode, thickness, qtyBox
}
Response: {
  planoType, paperWidth, paperHeight, jumlahMata,
  qtyPlano, qtyRim,
  hargaKertas, hargaCetak, hargaDrag, hargaPlat,
  hargaPisau, hargaPond, hargaPacking, hargaLaminasi,
  totalBayar, hargaPerPcs
}
```

---

## ✅ Checklist Implementasi

### Database
- [ ] Buat tabel `cmyk_blok_prices` + seed data (3 baris range gramatur)
- [ ] Buat tabel `pricing_config` (singleton, isi default 85/500/15000/0.3/700000/1000)
- [ ] Update model `Order`: tambah field breakdown harga baru (qtyPlano, qtyRim, hargaKertas, hargaCetak, hargaDrag, hargaPlat, hargaPisau, hargaPond, hargaPacking, hargaLaminasi, totalBayar, hargaPerPcs)
- [ ] Hapus field lama yang tidak relevan: `hargaMaterial`, `hargaWarna`, `subtotalPerUnit`, `markup`, `totalPrice` (konfirmasi dulu apakah hargaWarna masih dipakai)
- [ ] Jalankan `npx prisma migrate dev --name pricing_engine_v3_production_cost`

### Backend
- [ ] Fungsi `hitungQtyPlano(qtyBox, jumlahMata)`
- [ ] Fungsi `hitungQtyRim(qtyBox)`
- [ ] Fungsi `hitungHargaKertas(planoCode, materialCode, thickness)`
- [ ] Fungsi `getCmykBlokPrice(thickness)` — lookup by range
- [ ] Fungsi `hitungHargaCetak`, `hitungHargaDrag`, `hitungHargaPlat`
- [ ] Fungsi `hitungHargaPisau`, `hitungHargaPond`, `hitungHargaPacking`, `hitungHargaLaminasi`
- [ ] Fungsi `hitungTotalBayar` + `hitungHargaPerPcs`
- [ ] Fungsi orkestrasi `calculatePricing()` yang memanggil semua fungsi di atas
- [ ] Endpoint `POST /api/calculator/pricing`
- [ ] Update endpoint `POST /api/orders` untuk simpan semua field breakdown
- [ ] **Verifikasi rumus Qty Rim dengan tim/owner** sebelum deploy (lihat bagian "Perlu Verifikasi")

### Frontend
- [ ] Validasi quantity: kelipatan 500, minimal 1000 (2 rim)
- [ ] Auto-call `/api/calculator/pricing` setiap step relevan selesai diisi
- [ ] Komponen `PriceBreakdown` yang tampilkan semua 8 komponen harga + total + per pcs
- [ ] Update step review dengan breakdown lengkap
- [ ] Konfirmasi: apakah step warna sisi kemasan masih ada di flow atau dihapus

---

## 📊 Dampak Perubahan

| Area | Perubahan | Level |
|---|---|---|
| Tabel baru `CmykBlokPrice` | Master harga cetak/drag/plat per gramatur | 🟢 Additive |
| Tabel baru `PricingConfig` | Config singleton untuk konstanta pricing | 🟢 Additive |
| Tabel `Order` | Tambah 11 field breakdown, hapus 5 field lama | 🔴 Breaking |
| Field `hargaWarna` | Status tidak jelas — perlu konfirmasi | 🟡 Perlu Klarifikasi |
| Backend | 9 fungsi kalkulasi baru + endpoint baru | 🔴 Breaking |
| Frontend | Breakdown harga 8 komponen, validasi qty kelipatan rim | 🔴 Breaking |
| Step Warna Sisi | Mungkin dihapus dari flow — perlu konfirmasi | 🟡 Perlu Klarifikasi |
