# Prompt: Update Finishing Laminasi — Schema, Migration & Frontend


## PROMPT

Saya perlu mengubah struktur field **finishing laminasi** di sistem Custom Order Box. Sebelumnya ada 1 field `finishing` yang menggabungkan dua hal berbeda. Sekarang harus dipisah jadi 2 field karena secara UI ada **2 baris pilihan** yang berbeda kategorinya.

---

### Konteks Perubahan

**UI saat ini punya 2 baris pilihan dengan label yang sama (salah):**
- Baris 1 — label salah "Tipe Laminasi", isinya: Sisi Luar | Dalam | Luar & Dalam | Tanpa Laminasi
- Baris 2 — label salah "Tipe Laminasi", isinya: Glossy | Doff

**Yang benar seharusnya:**
- Baris 1 → label: **"Sisi Laminasi"** (menentukan di mana laminasi diaplikasikan)
- Baris 2 → label: **"Tipe Laminasi"** (menentukan jenis/tekstur laminasi)

---

### Tech Stack
- ORM: Prisma
- Database: PostgreSQL
- Frontend: React + TypeScript
- State management: bebas (gunakan useState atau yang sudah ada di project)

---

### Perubahan yang Dibutuhkan

#### 1. Prisma Schema — Model `Order`

Ubah field ini:
```prisma
// SEBELUM (hapus ini):
finishing   String

// SESUDAH (ganti dengan ini):
laminationSide   String    // "sisi-luar" | "dalam" | "luar-dan-dalam" | "tanpa-laminasi"
laminationType   String?   // "glossy" | "doff" — nullable jika tanpa-laminasi
```

#### 2. Prisma Schema — Model `FinishingOption`

Tambahkan field `category` untuk membedakan kelompok pilihan:
```prisma
// Tambahkan field baru:
category   String   // "side" | "type"

// Tambahkan index:
@@index([category])
```

#### 3. Migration Prisma

Buatkan migration dengan nama: `update_finishing_lamination_fields`

Migration harus:
1. Tambah kolom `lamination_side` (NOT NULL) dan `lamination_type` (nullable) di tabel `orders`
2. Migrate data lama dari kolom `finishing`:
   - Nilai `sisi-luar`, `dalam`, `luar-dan-dalam`, `tanpa-laminasi` → pindah ke `lamination_side`
   - Nilai `glossy`, `doff` → pindah ke `lamination_type`
3. Drop kolom `finishing` lama
4. Tambah kolom `category` di tabel `finishing_options`
5. Update data existing di `finishing_options` dengan nilai category yang sesuai

Gunakan `prisma migrate dev` dengan custom SQL jika perlu untuk handle data migration.

#### 4. Update Seed Data `prisma/seed.ts`

Re-seed tabel `FinishingOption` dengan data berikut (tambah field `category`):

```typescript
// Sisi Laminasi
{ code: 'sisi-luar',       name: 'Sisi Luar',     category: 'side', additionalPrice: 0 }
{ code: 'dalam',           name: 'Dalam',          category: 'side', additionalPrice: 500 }
{ code: 'luar-dan-dalam',  name: 'Luar & Dalam',   category: 'side', additionalPrice: 1000 }
{ code: 'tanpa-laminasi',  name: 'Tanpa Laminasi', category: 'side', additionalPrice: 0 }

// Tipe Laminasi
{ code: 'glossy',          name: 'Glossy',         category: 'type', additionalPrice: 0 }
{ code: 'doff',            name: 'Doff',            category: 'type', additionalPrice: 200 }
```

#### 5. Update API Endpoints (Backend)

Endpoint yang perlu diupdate:
- `POST /api/orders` — ganti field `finishing` dengan `laminationSide` + `laminationType`
- `PUT /api/orders/:id` — sama seperti di atas
- `GET /api/finishing-options` — pastikan response include field `category`

Tambahkan validasi:
```typescript
// laminationType wajib ada KECUALI jika laminationSide === 'tanpa-laminasi'
if (laminationSide !== 'tanpa-laminasi' && !laminationType) {
  throw new Error('Tipe laminasi wajib dipilih')
}
// Jika tanpa-laminasi, set laminationType = null
if (laminationSide === 'tanpa-laminasi') {
  laminationType = null
}
```

#### 6. Update Frontend — Komponen Step Finishing Laminasi

Lakukan perubahan berikut di komponen React step finishing:

**A. Perbaiki label heading:**
```diff
- <h3>Tipe Laminasi</h3>  {/* baris atas — label salah */}
+ <h3>Sisi Laminasi</h3>  {/* baris atas — label benar */}

  <h3>Tipe Laminasi</h3>  {/* baris bawah — sudah benar */}
```

**B. Pisahkan state:**
```diff
- const [finishing, setFinishing] = useState<string>('')
+ const [laminationSide, setLaminationSide] = useState<string>('')
+ const [laminationType, setLaminationType] = useState<string>('')
```

**C. Filter data dari API berdasarkan category:**
```typescript
const sideOptions = finishingOptions.filter(opt => opt.category === 'side')
const typeOptions  = finishingOptions.filter(opt => opt.category === 'type')
```

**D. Kondisi tampil — sembunyikan Tipe Laminasi jika pilih "Tanpa Laminasi":**
```typescript
const showLaminationType = laminationSide !== '' && laminationSide !== 'tanpa-laminasi'

// Saat user pilih "tanpa-laminasi", auto-reset laminationType
const handleSideChange = (code: string) => {
  setLaminationSide(code)
  if (code === 'tanpa-laminasi') {
    setLaminationType('')
  }
}
```

**E. Render kondisional:**
```tsx
{/* Baris 1: Sisi Laminasi — selalu tampil */}
<section>
  <h3>Sisi Laminasi</h3>
  <div className="options-grid">
    {sideOptions.map(opt => (
      <OptionCard
        key={opt.code}
        label={opt.name}
        imageUrl={opt.imageUrl}
        selected={laminationSide === opt.code}
        onClick={() => handleSideChange(opt.code)}
      />
    ))}
  </div>
</section>

{/* Baris 2: Tipe Laminasi — hanya tampil jika bukan tanpa-laminasi */}
{showLaminationType && (
  <section>
    <h3>Tipe Laminasi</h3>
    <div className="options-grid">
      {typeOptions.map(opt => (
        <OptionCard
          key={opt.code}
          label={opt.name}
          imageUrl={opt.imageUrl}
          selected={laminationType === opt.code}
          onClick={() => setLaminationType(opt.code)}
        />
      ))}
    </div>
  </section>
)}
```

**F. Update validasi sebelum lanjut ke step berikutnya:**
```typescript
const isStepValid = (): boolean => {
  if (!laminationSide) return false
  if (laminationSide !== 'tanpa-laminasi' && !laminationType) return false
  return true
}
```

**G. Update payload saat submit/next step:**
```typescript
const payload = {
  // ... field lain
  laminationSide,
  laminationType: laminationSide === 'tanpa-laminasi' ? null : laminationType,
}
```

**H. Update tampilan di Step Review (step 8):**
```tsx
<ReviewItem label="Sisi Laminasi" value={order.laminationSide} />
{order.laminationType && (
  <ReviewItem label="Tipe Laminasi" value={order.laminationType} />
)}
```

---

### Output yang Diharapkan

1. `prisma/schema.prisma` yang sudah diupdate (bagian model `Order` dan `FinishingOption`)
2. File migration baru di `prisma/migrations/`
3. `prisma/seed.ts` yang sudah diupdate
4. Kode backend untuk endpoint yang diupdate (validasi + handler)
5. Komponen React untuk step Finishing Laminasi yang sudah diupdate lengkap
6. Perintah untuk menjalankan migration dan seed:
   ```bash
   npx prisma migrate dev --name update_finishing_lamination_fields
   npx prisma db seed
   ```
