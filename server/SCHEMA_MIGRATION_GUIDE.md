# Schema Migration Guide - PostgreSQL + UUID

## ⚠️ IMPORTANT: Database Change

Schema telah diubah dari **MySQL dengan auto-increment** menjadi **PostgreSQL dengan UUID** sesuai spesifikasi di `prisma-schema-prompt.md`.

---

## 🔄 Perubahan Utama

### 1. **Database Provider**
- ❌ Sebelumnya: MySQL
- ✅ Sekarang: PostgreSQL

### 2. **Primary Key**
- ❌ Sebelumnya: `Int @id @default(autoincrement())`
- ✅ Sekarang: `String @id @default(uuid())`

### 3. **Struktur Tabel**
- ✅ Ditambahkan master data tables: `BoxModel`, `Material`, `FinishingOption`, `PricingRule`
- ✅ Simplified `Order` table sesuai 8 steps
- ✅ Simplified `OrderHistory` table
- ❌ Removed: `Payment`, `BankAccount` tables (diganti dengan field di Order)

### 4. **Enum Changes**
- ✅ `OrderStatus`: Ditambahkan `DRAFT`, `PENDING_REVIEW`, `PAYMENT_VERIFIED`
- ✅ `PaymentStatus`: Simplified menjadi `PENDING`, `AWAITING_VERIFICATION`, `VERIFIED`, `FAILED`, `REFUNDED`
- ❌ Removed: `PaymentMethod`, `PaymentVerificationStatus`, `ChangeType`

---

## 🚀 Setup PostgreSQL

### Option 1: Install PostgreSQL Locally

#### Windows:
```bash
# Download dari: https://www.postgresql.org/download/windows/
# Atau gunakan installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

# Setelah install, buat database:
psql -U postgres
CREATE DATABASE benua_kertas_db;
\q
```

#### macOS:
```bash
# Install via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb benua_kertas_db
```

#### Linux:
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb benua_kertas_db
```

### Option 2: Docker (Recommended untuk Development)

```bash
# Create docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: benua_kertas_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: benua_kertas_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

# Start container
docker-compose up -d
```

### Option 3: Cloud PostgreSQL (Production)

**Supabase** (Recommended - Free tier):
1. Sign up di https://supabase.com
2. Create new project
3. Copy connection string
4. Update `.env`

**Neon** (Alternative):
1. Sign up di https://neon.tech
2. Create new project
3. Copy connection string
4. Update `.env`

---

## 📝 Setup Environment

### 1. Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

### 2. Update `.env` dengan connection string PostgreSQL
```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/benua_kertas_db?schema=public"

# Docker PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/benua_kertas_db?schema=public"

# Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Neon
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

---

## 🔧 Run Migration

### 1. Install Dependencies (jika belum)
```bash
cd server
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Migration
```bash
npx prisma migrate dev --name init_custom_order
```

### 4. Run Seeder
```bash
node prisma/seed.js
```

### 5. Verify dengan Prisma Studio
```bash
npx prisma studio
```
Buka browser: http://localhost:5555

---

## 📊 Tabel yang Dibuat

| Table | Purpose | Records Seeded |
|-------|---------|----------------|
| **users** | User accounts | 2 (admin, user) |
| **box_models** | Master data model box | 8 models |
| **materials** | Master data material | 3 materials |
| **finishing_options** | Master data finishing | 6 options |
| **pricing_rules** | Pricing rules | 3 rules |
| **orders** | Custom orders | 0 (empty) |
| **order_history** | Order logs | 0 (empty) |

---

## 🎯 Mapping 8 Steps ke Database

| Step | Field di `Order` Table |
|------|------------------------|
| **Step 1: Model Box** | `boxModel` (code dari BoxModel) |
| **Step 2: Ukuran** | `length`, `width`, `height`, `lidHeight` |
| **Step 3: Bahan** | `material` (code dari Material), `thickness` |
| **Step 4: Warna** | `colorSides` ('1-sisi' atau '2-sisi') |
| **Step 5: Finishing** | `finishing` (code dari FinishingOption) |
| **Step 6: File & Catatan** | `designFileUrl`, `designFileName`, `designFileSize`, `notes` |
| **Step 7: Kuantitas** | `quantity` |
| **Step 8: Review** | `pricePerUnit`, `totalPrice` (diisi admin) |
| **Payment** | `paymentStatus`, `paymentProofUrl` |

---

## 🔍 Verify Installation

### Check Tables
```sql
-- Connect to PostgreSQL
psql -U postgres -d benua_kertas_db

-- List tables
\dt

-- Check users
SELECT * FROM users;

-- Check box models
SELECT * FROM box_models;

-- Check materials
SELECT * FROM materials;

-- Check finishing options
SELECT * FROM finishing_options;

-- Check pricing rules
SELECT * FROM pricing_rules;

-- Exit
\q
```

### Via Prisma Studio
```bash
npx prisma studio
```

---

## 🐛 Troubleshooting

### Error: Can't reach database server
**Solution**: Pastikan PostgreSQL service running
```bash
# Windows
# Services -> PostgreSQL -> Start

# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Docker
docker-compose up -d
```

### Error: Database does not exist
**Solution**: Create database
```bash
# Local
createdb benua_kertas_db

# Docker
docker exec -it benua_kertas_db psql -U postgres -c "CREATE DATABASE benua_kertas_db;"
```

### Error: Authentication failed
**Solution**: Check username/password di `.env`
```env
DATABASE_URL="postgresql://[correct-user]:[correct-password]@localhost:5432/benua_kertas_db"
```

### Error: Prisma Client not generated
**Solution**: Generate client
```bash
npx prisma generate
```

---

## 📚 Seed Data

### Users
```
Email: admin@benuakertas.com
Password: admin123
Role: ADMIN

Email: user@benuakertas.com
Password: user123
Role: USER
```

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
- Duplex (300-450 gsm)
- Ivory (300-450 gsm)
- Kraft (300-450 gsm)

### Finishing Options (6)
- Glossy
- Doff
- Sisi Luar
- Dalam
- Luar & Dalam
- Tanpa Laminasi

### Pricing Rules (3)
- Standard (1000-2999 pcs): 0% discount
- Bulk 5% (3000-4999 pcs): 5% discount
- Bulk 10% (5000+ pcs): 10% discount

---

## 🔄 Migration from MySQL (If Needed)

Jika Anda sudah punya data di MySQL dan ingin migrate ke PostgreSQL:

### 1. Export Data dari MySQL
```bash
mysqldump -u root -p benua_kertas_db > backup.sql
```

### 2. Convert SQL (Manual)
- Change `AUTO_INCREMENT` to `SERIAL` or use UUID
- Change `VARCHAR` to `TEXT` where needed
- Adjust data types

### 3. Import to PostgreSQL
```bash
psql -U postgres -d benua_kertas_db < converted_backup.sql
```

**Note**: Migration manual diperlukan karena perbedaan struktur schema yang signifikan.

---

## ✅ Checklist

- [ ] PostgreSQL installed dan running
- [ ] Database `benua_kertas_db` created
- [ ] `.env` file configured dengan correct DATABASE_URL
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Migration executed (`npx prisma migrate dev`)
- [ ] Seeder executed (`node prisma/seed.js`)
- [ ] Prisma Studio accessible (`npx prisma studio`)
- [ ] Can login dengan admin/user credentials

---

## 🎉 Next Steps

Setelah migration berhasil:

1. ✅ Update services untuk menggunakan UUID instead of Int
2. ✅ Update controllers untuk handle new schema
3. ✅ Update frontend untuk fetch master data (BoxModel, Material, dll)
4. ✅ Implement pricing calculation based on PricingRule
5. ✅ Setup Cloudinary untuk file uploads
6. ✅ Test create order flow

---

**Last Updated**: May 30, 2026
**Version**: 2.0 (PostgreSQL + UUID)
