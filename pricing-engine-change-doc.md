# Change Document: Logic Perhitungan Harga Baru (Full Pricing Engine)

**Tanggal**: 2024-05-30  
**Versi**: 2.0  
**Status**: Proposed

---

## 🔍 Ringkasan Perubahan

Sistem pricing lama menggunakan matrix kombinasi 7 faktor yang diisi manual admin. Sistem baru menggunakan **formula otomatis berbasis plano** dengan struktur harga yang lebih sederhana dan transparan.

---

## 📐 Formula Harga Lengkap

```
Total Harga = (hargaMaterial + hargaWarna + hargaLaminasi) × quantity × 85
```

### Breakdown per komponen:

#### 1. hargaMaterial
Diambil dari tabel `MaterialPrice` berdasarkan kombinasi:
```
planoCode × materialCode × thickness → pricePerPlano
```

#### 2. hargaWarna
Diambil dari tabel `ColorPrice` berdasarkan:
```
thickness (range) → pricePerSide
```
- Jika `colorSides = "1-sisi"` → `hargaWarna = pricePerSide × 1`
- Jika `colorSides = "2-sisi"` → `hargaWarna = pricePerSide × 2`

#### 3. hargaLaminasi
Dihitung otomatis dari dimensi plano terpilih:
```
hargaLaminasi = plano.width × plano.height × 0.3
```
Contoh Plano 65×100: `65 × 100 × 0.3 = 1.950`

#### 4. Kalkulasi Final
```
subtotalPerUnit = hargaMaterial + hargaWarna + hargaLaminasi
totalHarga      = subtotalPerUnit × quantity × 85
```

> **Catatan:** `85` adalah koefisien markup tetap yang berlaku untuk semua pesanan.

---

## 🗂️ Perubahan Tabel Database

### Tabel DIHAPUS
```
❌ PricingRule  — tidak dibutuhkan lagi
```

### Tabel BARU

#### 1. `PlanoType` — Master data ukuran plano
```prisma
model PlanoType {
  id              String   @id @default(uuid())
  code            String   @unique  // "65x100" | "79x109" | "90x120"
  width           Float             // 65 | 79 | 90  (cm)
  height          Float             // 100 | 109 | 120 (cm)
  effectiveWidth  Float             // width - 2  (setelah potong grip kiri+kanan)
  effectiveHeight Float             // height - 2.5 (setelah potong grip atas+bawah)
  isActive        Boolean  @default(true)
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([isActive])
  @@map("plano_types")
}
```

Seed data:
```typescript
{ code: '65x100', width: 65,  height: 100, effectiveWidth: 63,  effectiveHeight: 97.5,  sortOrder: 1 }
{ code: '79x109', width: 79,  height: 109, effectiveWidth: 77,  effectiveHeight: 106.5, sortOrder: 2 }
{ code: '90x120', width: 90,  height: 120, effectiveWidth: 88,  effectiveHeight: 117.5, sortOrder: 3 }
```

---

#### 2. `MaterialPrice` — Matrix harga: Plano × Bahan × GSM
```prisma
model MaterialPrice {
  id           String   @id @default(uuid())
  planoCode    String             // "65x100" | "79x109" | "90x120"
  materialCode String             // "duplex" | "ivory"
  thickness    Int                // GSM: 230|250|270|300|310|350|400
  price        Float              // Harga per plano (Rupiah)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([planoCode, materialCode, thickness])
  @@index([planoCode])
  @@index([isActive])
  @@map("material_prices")
}
```

Seed data (dari tabel matrix):
```typescript
// Duplex
{ planoCode: '65x100', materialCode: 'duplex', thickness: 310, price: 1433990 }
{ planoCode: '65x100', materialCode: 'duplex', thickness: 350, price: 1576416 }
{ planoCode: '65x100', materialCode: 'duplex', thickness: 400, price: 1772225 }
{ planoCode: '79x109', materialCode: 'duplex', thickness: 310, price: 1899706 }
{ planoCode: '79x109', materialCode: 'duplex', thickness: 350, price: 2088387 }
{ planoCode: '79x109', materialCode: 'duplex', thickness: 400, price: 2347789 }
{ planoCode: '90x120', materialCode: 'duplex', thickness: 310, price: 2382629 }
{ planoCode: '90x120', materialCode: 'duplex', thickness: 350, price: 2619275 }
{ planoCode: '90x120', materialCode: 'duplex', thickness: 400, price: 2944620 }

// Ivory
{ planoCode: '65x100', materialCode: 'ivory', thickness: 230, price: 1046500 }
{ planoCode: '65x100', materialCode: 'ivory', thickness: 250, price: 1137500 }
{ planoCode: '65x100', materialCode: 'ivory', thickness: 270, price: 1228500 }
{ planoCode: '65x100', materialCode: 'ivory', thickness: 300, price: 1365000 }
{ planoCode: '79x109', materialCode: 'ivory', thickness: 230, price: 1386371 }
{ planoCode: '79x109', materialCode: 'ivory', thickness: 250, price: 1506925 }
{ planoCode: '79x109', materialCode: 'ivory', thickness: 270, price: 1627479 }
{ planoCode: '79x109', materialCode: 'ivory', thickness: 300, price: 1808310 }
{ planoCode: '90x120', materialCode: 'ivory', thickness: 230, price: 1738800 }
{ planoCode: '90x120', materialCode: 'ivory', thickness: 250, price: 1890000 }
{ planoCode: '90x120', materialCode: 'ivory', thickness: 270, price: 2041200 }
{ planoCode: '90x120', materialCode: 'ivory', thickness: 300, price: 2268000 }
```

---

#### 3. `ColorPrice` — Harga warna per sisi berdasarkan range GSM
```prisma
model ColorPrice {
  id           String   @id @default(uuid())
  thicknessMin Int               // GSM minimal range
  thicknessMax Int               // GSM maksimal range
  pricePerSide Float             // Harga per sisi
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([thicknessMin])
  @@index([isActive])
  @@map("color_prices")
}
```

Seed data (dari tabel matrix warna):
```typescript
{ thicknessMin: 230, thicknessMax: 310, pricePerSide: 460000 }
{ thicknessMin: 350, thicknessMax: 350, pricePerSide: 550000 }
{ thicknessMin: 400, thicknessMax: 400, pricePerSide: 600000 }
```

---

### Tabel DIUPDATE

#### `Order` — Tambah field hasil kalkulasi
```prisma
// Tambah field berikut ke model Order:

// Hasil kalkulasi plano (auto dari step ukuran)
planoType       String?   // "65x100" | "79x109" | "90x120"
paperWidth      Float?    // Lebar kertas hasil formula (cm)
paperHeight     Float?    // Panjang kertas hasil formula (cm)
jumlahMata      Int?      // Hasil kalkulasi mata terbanyak
planoOrientation String?  // "normal" | "rotasi"

// Breakdown harga (auto kalkulasi)
hargaMaterial   Float?    // Dari MaterialPrice lookup
hargaWarna      Float?    // Dari ColorPrice × colorSides
hargaLaminasi   Float?    // plano.width × plano.height × 0.3
subtotalPerUnit Float?    // hargaMaterial + hargaWarna + hargaLaminasi
markup          Int       @default(85)  // Koefisien markup tetap
totalPrice      Float?    // subtotalPerUnit × quantity × markup

// Hapus field ini (tidak relevan lagi):
// pricePerUnit  Float?   ← HAPUS
```

#### `Material` — Hapus field harga per GSM
```prisma
// HAPUS field berikut dari model Material (harga sudah pindah ke MaterialPrice):
// price300gsm, price350gsm, price400gsm, price450gsm

// Sisakan hanya:
model Material {
  id          String   @id @default(uuid())
  code        String   @unique   // "duplex" | "ivory"
  name        String
  description String?  @db.Text
  imageUrl    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### `FinishingOption` — Hapus field additionalPrice
```prisma
// HAPUS: additionalPrice Float?
// Harga laminasi sekarang dihitung dari dimensi plano, bukan dari tabel ini
```

---

## 🔢 Logic Kalkulasi (Pseudocode Lengkap)

```typescript
// ============================================================
// STEP 2-3: Hitung Ukuran Kertas & Rekomendasi Plano
// ============================================================

function hitungUkuranKertas(boxModel: string, p: number, l: number, t: number, extras: any) {
  switch (boxModel) {
    case 'earlock-box-depan':
      return { paperWidth: 3*t + 2*l, paperHeight: 4*t + p }
    case 'earlock-box-samping':
      return { paperWidth: 2*t + 2*l + extras.lidah, paperHeight: 2*t + p }
    case 'top-bottom-box':
      return { paperWidth: 2*extras.tTutup + 2*t + 2*l + 0.5, paperHeight: 2*t + p }
    case 'lunch-box':
      return { paperWidth: 2*t + p - 2, paperHeight: 3*t + 2*l - 2 }
    case 'tray-box':
      return { paperWidth: 2*t + p, paperHeight: 2*t + l }
  }
}

const PLANOS = [
  { code: '65x100', width: 65,  height: 100, effW: 63,  effH: 97.5  },
  { code: '79x109', width: 79,  height: 109, effW: 77,  effH: 106.5 },
  { code: '90x120', width: 90,  height: 120, effW: 88,  effH: 117.5 },
]

function hitungMata(effW: number, effH: number, pw: number, ph: number) {
  const normal = Math.floor(effW / pw) * Math.floor(effH / ph)
  const rotasi = Math.floor(effW / ph) * Math.floor(effH / pw)
  return { normal, rotasi, best: Math.max(normal, rotasi), orientasi: normal >= rotasi ? 'normal' : 'rotasi' }
}

function rekomendasiPlano(paperWidth: number, paperHeight: number, boxModel: string) {
  const hasil = PLANOS.map(plano => {
    const { best, orientasi } = hitungMata(plano.effW, plano.effH, paperWidth, paperHeight)
    return { ...plano, jumlahMata: best, orientasi }
  }).filter(p => p.jumlahMata > 0)
   .sort((a, b) => b.jumlahMata - a.jumlahMata)

  return hasil[0] // Plano terbaik = mata terbanyak
}

// ============================================================
// STEP 5: Harga Material
// ============================================================
async function hitungHargaMaterial(planoCode: string, materialCode: string, thickness: number) {
  const record = await prisma.materialPrice.findUnique({
    where: { planoCode_materialCode_thickness: { planoCode, materialCode, thickness } }
  })
  if (!record) throw new Error(`Harga tidak ditemukan: ${planoCode} × ${materialCode} × ${thickness}gsm`)
  return record.price
}

// ============================================================
// STEP 6: Harga Warna
// ============================================================
async function hitungHargaWarna(thickness: number, colorSides: string) {
  const record = await prisma.colorPrice.findFirst({
    where: {
      thicknessMin: { lte: thickness },
      thicknessMax: { gte: thickness },
      isActive: true
    }
  })
  if (!record) throw new Error(`Harga warna tidak ditemukan untuk ${thickness}gsm`)
  const multiplier = colorSides === '2-sisi' ? 2 : 1
  return record.pricePerSide * multiplier
}

// ============================================================
// STEP 7: Harga Laminasi
// ============================================================
function hitungHargaLaminasi(planoWidth: number, planoHeight: number) {
  return planoWidth * planoHeight * 0.3
}

// ============================================================
// STEP 8: Total Harga Final
// ============================================================
function hitungTotalHarga(
  hargaMaterial: number,
  hargaWarna: number,
  hargaLaminasi: number,
  quantity: number,
  markup: number = 85
) {
  const subtotalPerUnit = hargaMaterial + hargaWarna + hargaLaminasi
  const totalPrice = subtotalPerUnit * quantity * markup
  return { subtotalPerUnit, totalPrice }
}
```

---

## 🖥️ Perubahan Frontend

### Alur Baru Step by Step

```
Step 1: Pilih Box Model
Step 2: Input Ukuran → [AUTO] hitung paperWidth/Height + rekomendasi plano
Step 3: [INFO] Tampilkan plano terpilih + jumlah mata
Step 4: Pilih Bahan (Duplex/Ivory) + GSM → [AUTO] hitung hargaMaterial
Step 5: Pilih Warna Sisi (1/2 sisi) → [AUTO] hitung hargaWarna
Step 6: Pilih Bagian + Tipe Laminasi → [AUTO] hitung hargaLaminasi
Step 7: Pilih Quantity → [AUTO] hitung totalPrice = subtotal × qty × 85
Step 8: Review + konfirmasi harga final dalam Rupiah
```

### Perubahan State Global Order

```typescript
interface OrderState {
  // Step 1
  boxModel: string

  // Step 2
  length: number
  width: number
  height: number
  lidHeight?: number   // khusus top-bottom
  lidah?: number       // khusus earlock samping

  // Auto kalkulasi setelah step 2
  paperWidth: number
  paperHeight: number
  planoType: string        // "65x100" | "79x109" | "90x120"
  planoWidth: number       // actual plano width
  planoHeight: number      // actual plano height
  jumlahMata: number
  planoOrientation: string

  // Step 3 (bahan)
  material: string
  thickness: number
  hargaMaterial: number    // auto dari MaterialPrice

  // Step 4 (warna)
  colorSides: string
  hargaWarna: number       // auto dari ColorPrice

  // Step 5 (laminasi)
  laminationPart: string
  laminationType: string | null
  hargaLaminasi: number    // auto = planoWidth × planoHeight × 0.3

  // Step 6 (quantity)
  quantityTier: number | null
  quantityCustom: number | null
  quantity: number

  // Kalkulasi final
  subtotalPerUnit: number  // hargaMaterial + hargaWarna + hargaLaminasi
  markup: number           // selalu 85
  totalPrice: number       // subtotalPerUnit × quantity × 85
}
```

### Tampilan Harga di Setiap Step

Setiap kali user menyelesaikan sebuah step, tampilkan **progress harga** di sidebar atau footer:

```tsx
<PriceSummary>
  <PriceRow label="Plano terpilih"   value={planoType}                        />
  <PriceRow label="Jumlah mata"      value={`${jumlahMata} mata`}             />
  <PriceRow label="Harga material"   value={formatRupiah(hargaMaterial)}      show={!!hargaMaterial} />
  <PriceRow label="Harga warna"      value={formatRupiah(hargaWarna)}         show={!!hargaWarna} />
  <PriceRow label="Harga laminasi"   value={formatRupiah(hargaLaminasi)}      show={!!hargaLaminasi} />
  <Divider />
  <PriceRow label="Subtotal/plano"   value={formatRupiah(subtotalPerUnit)}    show={!!subtotalPerUnit} bold />
  <PriceRow label={`× ${quantity} pcs × 85`} value=""                        show={!!quantity} />
  <PriceRow label="Total harga"      value={formatRupiah(totalPrice)}         show={!!totalPrice} bold highlight />
</PriceSummary>
```

### Helper Format Rupiah

```typescript
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
// Output: "Rp 79.629.480.000"
```

### Step Review (Step 8) — Tampilan Ringkasan Harga

```tsx
<ReviewSection title="Ringkasan Harga">
  <ReviewRow label="Plano"           value={planoType} />
  <ReviewRow label="Jumlah mata"     value={`${jumlahMata} mata`} />
  <ReviewRow label="Bahan"           value={`${material} ${thickness}gsm`} />
  <ReviewRow label="Harga material"  value={formatRupiah(hargaMaterial)} />
  <ReviewRow label="Warna kemasan"   value={colorSides} />
  <ReviewRow label="Harga warna"     value={formatRupiah(hargaWarna)} />
  <ReviewRow label="Laminasi"        value={`${laminationPart} - ${laminationType ?? '-'}`} />
  <ReviewRow label="Harga laminasi"  value={formatRupiah(hargaLaminasi)} />
  <Divider />
  <ReviewRow label="Subtotal/plano"  value={formatRupiah(subtotalPerUnit)} bold />
  <ReviewRow label="Quantity"        value={`${quantity.toLocaleString('id-ID')} pcs`} />
  <ReviewRow label="Markup"          value="× 85" />
  <Divider />
  <ReviewRow
    label="Total yang dibayar"
    value={formatRupiah(totalPrice)}
    bold
    size="large"
    highlight
  />
</ReviewSection>
```

---

## ✅ Checklist Implementasi

### Database
- [ ] Drop tabel `pricing_rules`
- [ ] Buat tabel `plano_types`
- [ ] Buat tabel `material_prices`
- [ ] Buat tabel `color_prices`
- [ ] Update model `Order`: tambah field kalkulasi, hapus `pricePerUnit`
- [ ] Update model `Material`: hapus field price per GSM
- [ ] Update model `FinishingOption`: hapus `additionalPrice`
- [ ] Jalankan `npx prisma migrate dev --name add_pricing_engine`
- [ ] Seed `PlanoType`, `MaterialPrice`, `ColorPrice`

### Backend
- [ ] Fungsi `hitungUkuranKertas(boxModel, p, l, t, extras)`
- [ ] Fungsi `rekomendasiPlano(paperWidth, paperHeight)`
- [ ] Fungsi `hitungHargaMaterial(planoCode, materialCode, thickness)`
- [ ] Fungsi `hitungHargaWarna(thickness, colorSides)`
- [ ] Fungsi `hitungHargaLaminasi(planoWidth, planoHeight)`
- [ ] Fungsi `hitungTotalHarga(hargaMaterial, hargaWarna, hargaLaminasi, quantity)`
- [ ] Endpoint `POST /api/calculator/plano` — terima ukuran, return rekomendasi plano
- [ ] Endpoint `POST /api/calculator/price` — terima semua step, return breakdown harga
- [ ] Update `POST /api/orders` — simpan semua field kalkulasi ke tabel Order

### Frontend
- [ ] Setelah input ukuran: auto-call `/api/calculator/plano`, tampilkan plano terpilih
- [ ] Setelah pilih bahan+GSM: auto-hitung `hargaMaterial`
- [ ] Setelah pilih warna: auto-hitung `hargaWarna`
- [ ] Setelah pilih laminasi: auto-hitung `hargaLaminasi`
- [ ] Setelah pilih quantity: auto-hitung `totalPrice`
- [ ] Tampilkan progress harga di sidebar/footer setiap step
- [ ] Tampilan review lengkap dengan breakdown harga
- [ ] Helper `formatRupiah()` untuk semua tampilan harga
- [ ] Hapus Kraft dari pilihan bahan

---

## 📊 Dampak Perubahan

| Area | Perubahan | Level |
|---|---|---|
| Tabel `PricingRule` | Dihapus total | 🔴 Breaking |
| Tabel `Material` | Hapus field price per GSM | 🔴 Breaking |
| Tabel `FinishingOption` | Hapus `additionalPrice` | 🟡 Medium |
| Tabel `Order` | Tambah 8 field kalkulasi, hapus `pricePerUnit` | 🔴 Breaking |
| Tabel baru `PlanoType` | Master data plano | 🟢 Additive |
| Tabel baru `MaterialPrice` | Matrix harga plano × bahan × GSM | 🟢 Additive |
| Tabel baru `ColorPrice` | Harga warna per GSM range | 🟢 Additive |
| Backend | Fungsi kalkulasi baru + 2 endpoint baru | 🟡 Medium |
| Frontend | Auto-kalkulasi di setiap step + progress harga | 🟡 Medium |
| Bahan `Kraft` | Dihapus dari pilihan | 🟡 Medium |
