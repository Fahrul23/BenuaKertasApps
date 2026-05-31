# ✅ Schema Revision Complete

## 📋 Summary

Schema telah **direvisi ulang** sesuai dengan spesifikasi di `prisma-schema-prompt.md`.

---

## 🔄 Perubahan Besar

### 1. **Database Provider**
```diff
- MySQL
+ PostgreSQL
```

### 2. **Primary Key Strategy**
```diff
- Int @id @default(autoincrement())
+ String @id @default(uuid())
```

### 3. **Struktur Tabel**

#### ✅ Tabel Baru (Master Data):
- `box_models` - Master data model box (8 models)
- `materials` - Master data material (3 materials dengan harga per ketebalan)
- `finishing_options` - Master data finishing (6 options)
- `pricing_rules` - Aturan harga berdasarkan quantity

#### ✅ Tabel Utama:
- `users` - User accounts (UUID, simplified)
- `orders` - Custom orders (simplified, sesuai 8 steps)
- `order_history` - Order logs (simplified)

#### ❌ Tabel Dihapus:
- `payments` - Diganti dengan field di Order (`paymentStatus`, `paymentProofUrl`)
- `bank_accounts` - Tidak diperlukan (payment proof langsung upload)
- `categories`, `products`, `galleries` - Kept for backward compatibility
- `custom_orders` - Legacy table (kept)

---

## 📊 Schema Comparison

### Old Schema (MySQL + Auto-increment)
```prisma
model Order {
  id          Int     @id @default(autoincrement())
  userId      Int
  boxModel    String
  // ... many fields
  subtotal    Decimal
  tax         Decimal
  totalAmount Decimal
  // Separate Payment table
}

model Payment {
  id          Int     @id @default(autoincrement())
  orderId     Int
  // ... payment fields
}
```

### New Schema (PostgreSQL + UUID)
```prisma
model Order {
  id             String  @id @default(uuid())
  userId         String
  boxModel       String  // code from BoxModel
  // ... simplified fields
  pricePerUnit   Float?  // set by admin
  totalPrice     Float?  // calculated
  paymentStatus  PaymentStatus
  paymentProofUrl String?  // direct upload
}

model BoxModel {
  id        String @id @default(uuid())
  code      String @unique
  name      String
  basePrice Float?
}
```

---

## 🎯 Mapping 8 Steps

| Step | Old Field Names | New Field Names |
|------|----------------|-----------------|
| **1. Model Box** | `boxModel` (string) | `boxModel` (code dari BoxModel table) |
| **2. Ukuran** | `sizePanjang`, `sizeLebar`, `sizeTinggi`, `sizeTinggiTutup` | `length`, `width`, `height`, `lidHeight` |
| **3. Bahan** | `material`, `materialThickness` | `material` (code dari Material), `thickness` |
| **4. Warna** | `colorOption` | `colorSides` |
| **5. Finishing** | `finishingOption` | `finishing` (code dari FinishingOption) |
| **6. File** | `designFileUrl`, `designFilePublicId`, `designFileName`, `designFileSize`, `customerNote` | `designFileUrl`, `designFileName`, `designFileSize`, `notes` |
| **7. Kuantitas** | `quantity` | `quantity` |
| **8. Harga** | `subtotal`, `tax`, `totalAmount` | `pricePerUnit`, `totalPrice` |

---

## 📁 Files Updated/Created

### Updated:
- ✅ `server/prisma/schema.prisma` - Complete rewrite
- ✅ `server/prisma/seed.js` - Complete rewrite dengan master data

### Created:
- ✅ `server/.env.example` - PostgreSQL connection string
- ✅ `server/SCHEMA_MIGRATION_GUIDE.md` - Migration guide
- ✅ `SCHEMA_REVISION_COMPLETE.md` - This file

### Need Update:
- ⏳ `server/src/services/*.js` - Update untuk UUID
- ⏳ `server/src/utils/orderHelpers.js` - Update field names
- ⏳ `server/src/controllers/*.js` - Update untuk new schema
- ⏳ Frontend components - Update field names

---

## 🚀 Setup Instructions

### Quick Start (5 menit)

```bash
# 1. Install PostgreSQL
# Windows: Download dari postgresql.org
# macOS: brew install postgresql@15
# Linux: sudo apt install postgresql
# Docker: docker-compose up -d (recommended)

# 2. Create database
createdb benua_kertas_db

# 3. Setup environment
cd server
cp .env.example .env
# Edit .env dengan PostgreSQL connection string

# 4. Run migration
npx prisma generate
npx prisma migrate dev --name init_custom_order

# 5. Run seeder
node prisma/seed.js

# 6. Verify
npx prisma studio
```

### Detailed Guide
Lihat: `server/SCHEMA_MIGRATION_GUIDE.md`

---

## 📊 Seed Data

Setelah run seeder, database akan terisi dengan:

### Users (2)
- `admin@benuakertas.com` / `admin123` (ADMIN)
- `user@benuakertas.com` / `user123` (USER)

### Box Models (8)
- Earlock Box Depan
- Earlock Box Samping
- Top Bottom Box
- Sleeve Box
- Tuck End Box
- Lunch Box
- Clamshell Box
- Tray Box

### Materials (3)
- Duplex (Rp 450-680/gsm)
- Ivory (Rp 550-810/gsm)
- Kraft (Rp 380-580/gsm)

### Finishing Options (6)
- Glossy (+Rp 800)
- Doff (+Rp 850)
- Sisi Luar (+Rp 600)
- Dalam (+Rp 600)
- Luar & Dalam (+Rp 1200)
- Tanpa Laminasi (+Rp 0)

### Pricing Rules (3)
- 1000-2999 pcs: 0% discount
- 3000-4999 pcs: 5% discount
- 5000+ pcs: 10% discount

---

## 🔍 Key Differences

### 1. **Master Data Approach**
**Old**: Hardcoded values di frontend
**New**: Master data di database, fetch via API

**Benefits**:
- ✅ Admin bisa manage data via dashboard
- ✅ Harga bisa diupdate tanpa deploy
- ✅ Bisa add/remove options dinamis

### 2. **Payment Handling**
**Old**: Separate Payment table dengan verifikasi
**New**: Payment fields di Order table

**Benefits**:
- ✅ Simplified schema
- ✅ Easier to query
- ✅ Less joins needed

### 3. **Pricing Strategy**
**Old**: Hardcoded calculation di helper
**New**: PricingRule table dengan flexible rules

**Benefits**:
- ✅ Admin bisa set pricing rules
- ✅ Quantity-based discounts
- ✅ Area-based pricing (future)

### 4. **Order Status**
**Old**: 8 statuses
**New**: 9 statuses (added DRAFT, PENDING_REVIEW, PAYMENT_VERIFIED)

**Benefits**:
- ✅ Better workflow tracking
- ✅ Draft orders (save progress)
- ✅ Clearer payment verification

---

## ⚠️ Breaking Changes

### Backend:
1. **All IDs are now UUID strings** instead of integers
2. **Field names changed** (sizePanjang → length, etc.)
3. **Payment table removed** - use Order.paymentStatus
4. **BankAccount table removed** - not needed
5. **Services need rewrite** for UUID and new field names

### Frontend:
1. **Field names in forms** need update
2. **Master data** needs to be fetched from API
3. **Order creation** payload structure changed
4. **Payment flow** simplified (no separate payment table)

---

## 🎯 Next Steps

### Priority 1: Backend Updates
```bash
# 1. Update services
- order.service.js - Rewrite untuk UUID dan new fields
- Remove payment.service.js (not needed)
- Remove bankAccount.service.js (not needed)
- Add masterData.service.js (untuk BoxModel, Material, dll)

# 2. Update utilities
- orderHelpers.js - Update field names
- Add pricing calculator based on PricingRule

# 3. Update controllers
- order.controller.js - Update untuk new schema
- Add masterData.controller.js

# 4. Update routes
- order.routes.js - Update endpoints
- Add masterData.routes.js
```

### Priority 2: Frontend Updates
```bash
# 1. Update CustomOrderPage
- Fetch master data (BoxModel, Material, FinishingOption)
- Update field names in state
- Update validation

# 2. Update API calls
- Change field names in payload
- Handle UUID instead of Int

# 3. Update ReviewStep
- Simplified payment (no separate payment table)
- Direct upload payment proof
```

### Priority 3: Testing
```bash
# 1. Test migration
# 2. Test seeder
# 3. Test create order
# 4. Test payment flow
# 5. Test admin dashboard
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `SCHEMA_MIGRATION_GUIDE.md` | Setup PostgreSQL & run migration |
| `SCHEMA_REVISION_COMPLETE.md` | This file - summary of changes |
| `prisma-schema-prompt.md` | Original specification |
| `server/prisma/schema.prisma` | New schema |
| `server/prisma/seed.js` | Seed data |

---

## ✅ Verification Checklist

After migration:

- [ ] PostgreSQL installed dan running
- [ ] Database `benua_kertas_db` created
- [ ] `.env` configured dengan PostgreSQL URL
- [ ] Migration executed successfully
- [ ] Seeder executed successfully
- [ ] Prisma Studio shows all tables
- [ ] Can see 2 users in users table
- [ ] Can see 8 box models in box_models table
- [ ] Can see 3 materials in materials table
- [ ] Can see 6 finishing options in finishing_options table
- [ ] Can see 3 pricing rules in pricing_rules table

---

## 🐛 Common Issues

### Issue: PostgreSQL not installed
**Solution**: Follow installation guide in `SCHEMA_MIGRATION_GUIDE.md`

### Issue: Can't connect to PostgreSQL
**Solution**: Check DATABASE_URL in `.env`

### Issue: Migration failed
**Solution**: Drop database and recreate
```bash
dropdb benua_kertas_db
createdb benua_kertas_db
npx prisma migrate dev
```

### Issue: Seeder failed
**Solution**: Check if migration ran successfully first

---

## 💡 Tips

### Development
```bash
# Use Docker for easy PostgreSQL setup
docker-compose up -d

# Use Prisma Studio for GUI
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Production
```bash
# Use cloud PostgreSQL (Supabase/Neon)
# Set DATABASE_URL in production .env
# Run migration in production
npx prisma migrate deploy
```

---

## 🎉 Status

**✅ SCHEMA REVISION COMPLETE**

Schema sudah sesuai dengan spesifikasi di `prisma-schema-prompt.md`:
- ✅ PostgreSQL database
- ✅ UUID primary keys
- ✅ Master data tables
- ✅ Simplified Order table
- ✅ Seed data ready
- ✅ Migration ready to run

**Ready untuk:**
- Run migration
- Update services
- Update controllers
- Update frontend
- Testing

---

**Last Updated**: May 30, 2026
**Version**: 2.0 (PostgreSQL + UUID)
**Status**: ✅ Complete & Ready
