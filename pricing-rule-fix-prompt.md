# Prompt: Fix PricingRule — Hapus Relasi Semu ke Master Data

Paste prompt di bawah ini ke Claude atau AI lain.

---

## PROMPT

Saya perlu memperbaiki desain tabel `PricingRule` di sistem Custom Order Box. Sebelumnya ada kesalahan konsep di mana `PricingRule` dibuat seolah-olah berelasi (foreign key) ke semua tabel master data. Padahal seharusnya `PricingRule` hanya menyimpan **nilai string/int langsung** tanpa foreign key, dan dilindungi oleh **unique constraint kombinasi 7 field**.

---

### Konteks Sistem
- ORM: Prisma + PostgreSQL
- `PricingRule` adalah tabel matrix harga yang diisi manual oleh admin
- Satu baris = satu kombinasi unik dari 7 faktor penentu harga
- Admin mengisi harga melalui dashboard

---

### Masalah yang Harus Diperbaiki

#### ❌ Desain Sebelumnya (Salah)
Field di `PricingRule` diperlakukan sebagai foreign key ke tabel master:
```prisma
// SALAH — ini bukan FK, tapi diperlakukan seperti FK
boxModelCode   String   // seolah FK ke BoxModel.code
materialCode   String   // seolah FK ke Material.code
laminationPart String   // seolah FK ke FinishingOption.code
quantityTier   Int      // seolah FK ke QuantityTier.value
```

Akibatnya di LRS/ERD digambar ada relasi dari `BoxModel`, `Material`, `FinishingOption`, `QuantityTier` ke `PricingRule` — ini **misleading** dan **tidak benar secara teknis**.

#### ✅ Desain yang Benar
Field-field tersebut adalah **plain string/int** yang nilainya mengacu ke master data secara konseptual (lookup), tapi **tidak ada foreign key constraint** di database. Yang melindungi dari duplikat adalah **unique constraint kombinasi**:

```prisma
model PricingRule {
  id             String   @id @default(uuid())

  // 7 faktor — plain string/int, BUKAN foreign key
  boxModelCode   String   // nilai: "earlock-box-samping" | "top-bottom-box" | dst
  materialCode   String   // nilai: "kraft" | "ivory" | "duplex"
  thickness      Int      // nilai: 300 | 350 | 400 | 450
  colorSides     String   // nilai: "1-sisi" | "2-sisi"
  laminationPart String   // nilai: "luar" | "dalam" | "luar-dan-dalam" | "tanpa-laminasi"
  laminationType String?  // nilai: "glossy" | "doff" | null
  quantityTier   Int      // nilai: 500 | 1000 | 1500

  // Output harga
  pricePerUnit   Float
  shippingCost   Float?

  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Unique constraint: kombinasi 7 field = satu baris harga
  // Database MENOLAK insert jika kombinasi yang sama sudah ada
  @@unique([
    boxModelCode,
    materialCode,
    thickness,
    colorSides,
    laminationPart,
    laminationType,
    quantityTier
  ])

  @@index([boxModelCode])
  @@index([isActive])
  @@map("pricing_rules")
}
```

---

### Penjelasan Unique Constraint

Contoh data yang **valid** (tidak ada duplikat):

| boxModelCode | materialCode | thickness | colorSides | laminationPart | laminationType | quantityTier | pricePerUnit |
|---|---|---|---|---|---|---|---|
| earlock-box-samping | kraft | 300 | 1-sisi | luar | glossy | 500 | 850 |
| earlock-box-samping | kraft | 300 | 1-sisi | luar | glossy | 1000 | 750 |
| earlock-box-samping | kraft | 300 | 1-sisi | luar | doff | 500 | 900 |
| earlock-box-samping | ivory | 300 | 1-sisi | luar | glossy | 500 | 1100 |

Contoh data yang **ditolak** (duplikat kombinasi):
```
// Error: Unique constraint failed
// Kombinasi 7 field ini sudah ada di baris pertama
{ earlock-box-samping, kraft, 300, 1-sisi, luar, glossy, 500, pricePerUnit: 999 }
```

---

### Relasi yang Benar di Seluruh Sistem

Setelah perbaikan, relasi database yang ada hanya:

```
// Relasi nyata (ada foreign key di database)
User         ||--o{ Order         : userId FK
Order        ||--o{ OrderHistory  : orderId FK

// Lookup konseptual (TIDAK ada FK, hanya nilai string/int)
Order.boxModel      → BoxModel.code        (no FK)
Order.material      → Material.code        (no FK)
Order.laminationPart/Type → FinishingOption.code (no FK)
Order.quantityTier  → QuantityTier.value   (no FK)

// PricingRule: TIDAK berelasi ke tabel manapun
// Dilindungi hanya oleh @@unique constraint
PricingRule  (standalone, no FK, protected by @@unique)
```

---

### Yang Perlu Diupdate

#### 1. Prisma Schema
Pastikan model `PricingRule` **tidak memiliki** field relasi (`@relation`) ke tabel manapun. Hapus jika ada:
```prisma
// HAPUS jika ada di PricingRule:
boxModel     BoxModel?  @relation(...)   // ← hapus
material     Material?  @relation(...)   // ← hapus
finishing    FinishingOption? @relation(...) // ← hapus
qtyTier      QuantityTier? @relation(...) // ← hapus
```

Pastikan juga tabel master (`BoxModel`, `Material`, `FinishingOption`, `QuantityTier`) **tidak memiliki** back-relation ke `PricingRule`:
```prisma
// HAPUS jika ada di BoxModel / Material / FinishingOption / QuantityTier:
pricingRules  PricingRule[]  // ← hapus dari semua tabel master
```

#### 2. ERD / LRS
Update diagram agar:
- Tidak ada garis relasi dari tabel master ke `PricingRule`
- `PricingRule` berdiri sendiri (standalone)
- Tambahkan catatan/legend: *"PricingRule dilindungi @@unique constraint, bukan FK"*
- Relasi yang digambar hanya:
  - `User` → `Order`
  - `Order` → `OrderHistory`
  - Master data → `Order` (dengan label "lookup, no FK")

#### 3. Backend — Validasi Manual Sebelum Insert/Update

Karena tidak ada FK constraint ke master data, validasi harus dilakukan **manual di aplikasi** sebelum menyimpan `PricingRule`:

```typescript
// Sebelum upsert PricingRule, validasi semua kode ada di master data
const validatePricingRuleInput = async (input: CreatePricingRuleInput) => {
  const [boxModel, material, finishing, qty] = await Promise.all([
    prisma.boxModel.findUnique({ where: { code: input.boxModelCode } }),
    prisma.material.findUnique({ where: { code: input.materialCode } }),
    prisma.finishingOption.findUnique({ where: { code: input.laminationPart } }),
    prisma.quantityTier.findUnique({ where: { value: input.quantityTier } }),
  ])

  if (!boxModel)  throw new Error(`BoxModel tidak ditemukan: ${input.boxModelCode}`)
  if (!material)  throw new Error(`Material tidak ditemukan: ${input.materialCode}`)
  if (!finishing) throw new Error(`FinishingOption tidak ditemukan: ${input.laminationPart}`)
  if (!qty)       throw new Error(`QuantityTier tidak ditemukan: ${input.quantityTier}`)

  // Validasi laminationType jika laminationPart bukan tanpa-laminasi
  if (input.laminationPart !== 'tanpa-laminasi' && !input.laminationType) {
    throw new Error('laminationType wajib diisi jika laminationPart bukan tanpa-laminasi')
  }
  if (input.laminationPart === 'tanpa-laminasi' && input.laminationType) {
    throw new Error('laminationType harus null jika laminationPart adalah tanpa-laminasi')
  }
}

// Upsert dengan handle duplicate error
const upsertPricingRule = async (input: CreatePricingRuleInput) => {
  await validatePricingRuleInput(input)

  try {
    return await prisma.pricingRule.upsert({
      where: {
        boxModelCode_materialCode_thickness_colorSides_laminationPart_laminationType_quantityTier: {
          boxModelCode:   input.boxModelCode,
          materialCode:   input.materialCode,
          thickness:      input.thickness,
          colorSides:     input.colorSides,
          laminationPart: input.laminationPart,
          laminationType: input.laminationType ?? null,
          quantityTier:   input.quantityTier,
        }
      },
      update: {
        pricePerUnit: input.pricePerUnit,
        shippingCost: input.shippingCost ?? null,
      },
      create: { ...input }
    })
  } catch (e: any) {
    if (e.code === 'P2002') {
      throw new Error('Kombinasi harga ini sudah ada. Gunakan update.')
    }
    throw e
  }
}
```

#### 4. Backend — Lookup Harga di Order

Saat user submit order, cari harga dari `PricingRule` berdasarkan kombinasi 7 field:

```typescript
const lookupPrice = async (order: OrderInput) => {
  // Hanya bisa lookup jika quantityTier (bukan custom)
  if (!order.quantityTier) {
    return { found: false, reason: 'custom_quantity' }
  }

  const rule = await prisma.pricingRule.findUnique({
    where: {
      boxModelCode_materialCode_thickness_colorSides_laminationPart_laminationType_quantityTier: {
        boxModelCode:   order.boxModel,
        materialCode:   order.material,
        thickness:      order.thickness,
        colorSides:     order.colorSides,
        laminationPart: order.laminationPart,
        laminationType: order.laminationPart === 'tanpa-laminasi'
                          ? null
                          : order.laminationType,
        quantityTier:   order.quantityTier,
      }
    }
  })

  if (!rule) {
    return { found: false, reason: 'price_not_set' }
  }

  return {
    found:        true,
    pricePerUnit: rule.pricePerUnit,
    shippingCost: rule.shippingCost,
    totalPrice:   rule.pricePerUnit * order.quantityTier,
  }
}
```

---

### Output yang Diharapkan

1. `prisma/schema.prisma` — model `PricingRule` tanpa relasi ke tabel manapun, hanya `@@unique`
2. Konfirmasi bahwa model master data (`BoxModel`, `Material`, `FinishingOption`, `QuantityTier`) tidak punya back-relation ke `PricingRule`
3. Fungsi `validatePricingRuleInput` untuk validasi manual
4. Fungsi `upsertPricingRule` dengan error handling untuk duplicate
5. Fungsi `lookupPrice` untuk dipakai saat order dibuat
6. Update ERD/LRS yang menunjukkan `PricingRule` sebagai tabel standalone tanpa FK

---

### Ringkasan Relasi Final Seluruh Sistem

```
[Relasi dengan FK nyata]
User         ──(1:N)──> Order
Order        ──(1:N)──> OrderHistory

[Lookup konseptual — tidak ada FK]
BoxModel.code        <── Order.boxModel
Material.code        <── Order.material  
FinishingOption.code <── Order.laminationPart
FinishingOption.code <── Order.laminationType
QuantityTier.value   <── Order.quantityTier

[Standalone — tidak ada FK, dilindungi @@unique]
PricingRule  (7 field kombinasi + @@unique constraint)
```
