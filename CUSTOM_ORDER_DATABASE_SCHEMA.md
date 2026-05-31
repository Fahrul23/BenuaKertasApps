# Database Schema - Custom Order System

## Overview
Dokumen ini berisi rekomendasi struktur database untuk sistem Custom Order yang mencakup 8 langkah pemesanan dan pembayaran.

---

## 📋 Tabel Utama

### 1. **orders** (Tabel Pesanan Utama)
Menyimpan informasi utama pesanan dari customer.

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  
  -- Step 1: Model & Tipe Box
  box_model VARCHAR(50) NOT NULL,
  
  -- Step 2: Ukuran
  size_panjang DECIMAL(10,2) NOT NULL,
  size_lebar DECIMAL(10,2) NOT NULL,
  size_tinggi DECIMAL(10,2) NOT NULL,
  size_tinggi_tutup DECIMAL(10,2) NULL,
  
  -- Step 3: Material
  material VARCHAR(50) NOT NULL,
  material_thickness INT NOT NULL,
  
  -- Step 4: Warna Kemasan
  color_option VARCHAR(50) NOT NULL,
  
  -- Step 5: Finishing Laminasi
  finishing_option VARCHAR(50) NOT NULL,
  
  -- Step 6: Upload File
  design_file_path VARCHAR(255) NULL,
  design_file_name VARCHAR(255) NULL,
  design_file_size INT NULL,
  customer_note TEXT NULL,
  
  -- Step 7: Kuantitas
  quantity INT NOT NULL,
  
  -- Pricing & Payment
  subtotal DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  
  -- Status
  order_status ENUM('pending', 'waiting_payment', 'payment_confirmed', 'in_production', 'ready_to_ship', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'pending', 'paid', 'failed', 'refunded') DEFAULT 'unpaid',
  
  -- Production
  estimated_production_days INT DEFAULT 10,
  production_start_date DATE NULL,
  production_end_date DATE NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_order_number (order_number),
  INDEX idx_user_id (user_id),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
);
```

---

### 2. **payments** (Tabel Pembayaran)
Menyimpan informasi pembayaran untuk setiap pesanan.

```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  payment_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Payment Details
  payment_method ENUM('bank_transfer', 'e_wallet', 'credit_card', 'cash') NOT NULL,
  bank_name VARCHAR(100) NULL,
  account_number VARCHAR(50) NULL,
  account_holder_name VARCHAR(100) NULL,
  
  -- Amount
  amount DECIMAL(15,2) NOT NULL,
  
  -- Payment Proof
  payment_proof_path VARCHAR(255) NULL,
  payment_proof_name VARCHAR(255) NULL,
  
  -- Status
  payment_status ENUM('pending', 'verified', 'rejected', 'refunded') DEFAULT 'pending',
  
  -- Verification
  verified_by INT NULL,
  verified_at TIMESTAMP NULL,
  rejection_reason TEXT NULL,
  
  -- Timestamps
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_payment_number (payment_number),
  INDEX idx_payment_status (payment_status)
);
```

---

### 3. **bank_accounts** (Tabel Rekening Bank Perusahaan)
Menyimpan informasi rekening bank untuk pembayaran.

```sql
CREATE TABLE bank_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder_name VARCHAR(100) NOT NULL,
  branch VARCHAR(100) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_is_active (is_active)
);
```

---

### 4. **order_history** (Tabel Riwayat Perubahan Order)
Menyimpan log setiap perubahan status pesanan.

```sql
CREATE TABLE order_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  
  -- Status Changes
  previous_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NOT NULL,
  
  -- Details
  changed_by INT NULL,
  change_type ENUM('status_change', 'payment_update', 'production_update', 'shipping_update', 'other') NOT NULL,
  notes TEXT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_created_at (created_at)
);
```

---

## 📊 Tabel Master Data (Optional - Untuk Fleksibilitas)

### 5. **box_models** (Master Data Model Box)
```sql
CREATE TABLE box_models (
  id INT PRIMARY KEY AUTO_INCREMENT,
  model_id VARCHAR(50) UNIQUE NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  image_path VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_model_id (model_id),
  INDEX idx_is_active (is_active)
);
```

### 6. **materials** (Master Data Material)
```sql
CREATE TABLE materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  material_id VARCHAR(50) UNIQUE NOT NULL,
  material_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  image_path VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_material_id (material_id),
  INDEX idx_is_active (is_active)
);
```

### 7. **material_thickness** (Master Data Ketebalan Material)
```sql
CREATE TABLE material_thickness (
  id INT PRIMARY KEY AUTO_INCREMENT,
  thickness_value INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_is_active (is_active)
);
```

### 8. **finishing_options** (Master Data Finishing)
```sql
CREATE TABLE finishing_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  finishing_id VARCHAR(50) UNIQUE NOT NULL,
  finishing_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  image_path VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_finishing_id (finishing_id),
  INDEX idx_is_active (is_active)
);
```

### 9. **pricing_rules** (Aturan Harga)
```sql
CREATE TABLE pricing_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Conditions
  box_model VARCHAR(50) NULL,
  material VARCHAR(50) NULL,
  material_thickness INT NULL,
  finishing_option VARCHAR(50) NULL,
  min_quantity INT NULL,
  max_quantity INT NULL,
  
  -- Pricing
  base_price DECIMAL(15,2) NOT NULL,
  price_per_unit DECIMAL(15,2) NOT NULL,
  price_per_sqcm DECIMAL(10,4) NULL,
  
  -- Multipliers
  color_multiplier DECIMAL(5,2) DEFAULT 1.00,
  finishing_multiplier DECIMAL(5,2) DEFAULT 1.00,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  effective_from DATE NULL,
  effective_to DATE NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_is_active (is_active),
  INDEX idx_effective_dates (effective_from, effective_to)
);
```

---

## 🔗 Relasi Antar Tabel

```
users (existing)
  ├── 1:N → orders
  └── 1:N → order_history (changed_by)

orders
  ├── 1:N → payments
  ├── 1:N → order_history
  └── N:1 → users

payments
  ├── N:1 → orders
  └── N:1 → users (verified_by)

order_history
  ├── N:1 → orders
  └── N:1 → users (changed_by)

bank_accounts (standalone)

box_models (standalone - optional)
materials (standalone - optional)
material_thickness (standalone - optional)
finishing_options (standalone - optional)
pricing_rules (standalone - optional)
```

---

## 📝 Enum Values Reference

### Order Status
- `pending` - Pesanan baru dibuat, belum bayar
- `waiting_payment` - Menunggu pembayaran
- `payment_confirmed` - Pembayaran sudah dikonfirmasi
- `in_production` - Sedang dalam proses produksi
- `ready_to_ship` - Siap dikirim
- `shipped` - Sudah dikirim
- `completed` - Pesanan selesai
- `cancelled` - Pesanan dibatalkan

### Payment Status
- `unpaid` - Belum dibayar
- `pending` - Menunggu verifikasi pembayaran
- `paid` - Sudah dibayar dan terverifikasi
- `failed` - Pembayaran gagal
- `refunded` - Pembayaran dikembalikan

### Payment Method
- `bank_transfer` - Transfer Bank
- `e_wallet` - E-Wallet (GoPay, OVO, Dana, dll)
- `credit_card` - Kartu Kredit
- `cash` - Tunai

---

## 🎯 Mapping Data dari 8 Steps ke Database

### Step 1: Model & Tipe Box
```javascript
orders.box_model = selectedModel
// Values: 'earlock-box-depan', 'earlock-box-samping', 'top-bottom-box', 
//         'lunch-box', 'clamshell-box', 'tray-box'
```

### Step 2: Ukuran
```javascript
orders.size_panjang = sizes.panjang
orders.size_lebar = sizes.lebar
orders.size_tinggi = sizes.tinggi
orders.size_tinggi_tutup = sizes.tinggiTutup // NULL jika bukan Top Bottom Box
```

### Step 3: Bahan
```javascript
orders.material = selectedMaterial
// Values: 'duplex', 'ivory', 'kraft'

orders.material_thickness = selectedThickness
// Values: 300, 350, 400, 450
```

### Step 4: Warna Kemasan
```javascript
orders.color_option = selectedColor
// Values: '1-sisi', '2-sisi'
```

### Step 5: Finishing Laminasi
```javascript
orders.finishing_option = selectedFinishing
// Values: 'sisi-luar', 'dalam', 'luar-dalam', 'tanpa-laminasi', 'glossy', 'doff'
```

### Step 6: Upload File
```javascript
orders.design_file_path = '/uploads/designs/...'
orders.design_file_name = uploadedFile.name
orders.design_file_size = uploadedFile.size
orders.customer_note = note
```

### Step 7: Kuantitas
```javascript
orders.quantity = quantity
// Values: 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000
```

### Step 8: Review & Payment
```javascript
// Calculate pricing
orders.subtotal = calculatePrice(orderData)
orders.tax = orders.subtotal * 0.11 // PPN 11%
orders.total_amount = orders.subtotal + orders.tax

// Generate order number
orders.order_number = generateOrderNumber() // e.g., 'ORD-2026-05-30-0001'

// Set initial status
orders.order_status = 'waiting_payment'
orders.payment_status = 'unpaid'
```

---

## 💳 Flow Pembayaran

### 1. Setelah Review Order (Step 8)
```javascript
// Create order
INSERT INTO orders (...) VALUES (...)

// Redirect ke halaman pembayaran
// Tampilkan:
// - Order Number
// - Total Amount
// - List Bank Accounts (dari tabel bank_accounts)
// - Upload Payment Proof Form
```

### 2. Customer Upload Bukti Pembayaran
```javascript
// Create payment record
INSERT INTO payments (
  order_id,
  payment_number,
  payment_method,
  bank_name,
  account_number,
  amount,
  payment_proof_path,
  payment_status,
  paid_at
) VALUES (...)

// Update order status
UPDATE orders 
SET payment_status = 'pending',
    order_status = 'waiting_payment'
WHERE id = ?

// Create history log
INSERT INTO order_history (
  order_id,
  previous_status,
  new_status,
  change_type,
  notes
) VALUES (...)
```

### 3. Admin Verifikasi Pembayaran
```javascript
// Update payment
UPDATE payments 
SET payment_status = 'verified',
    verified_by = ?,
    verified_at = NOW()
WHERE id = ?

// Update order
UPDATE orders 
SET payment_status = 'paid',
    order_status = 'payment_confirmed'
WHERE id = ?

// Create history log
INSERT INTO order_history (...)
```

---

## 🔍 Query Examples

### Get Order dengan Payment Info
```sql
SELECT 
  o.*,
  u.name as customer_name,
  u.email as customer_email,
  p.payment_number,
  p.payment_method,
  p.payment_status as payment_verification_status,
  p.paid_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN payments p ON o.id = p.order_id
WHERE o.order_number = 'ORD-2026-05-30-0001';
```

### Get Order History
```sql
SELECT 
  oh.*,
  u.name as changed_by_name
FROM order_history oh
LEFT JOIN users u ON oh.changed_by = u.id
WHERE oh.order_id = ?
ORDER BY oh.created_at DESC;
```

### Get Active Bank Accounts
```sql
SELECT * 
FROM bank_accounts 
WHERE is_active = TRUE 
ORDER BY display_order ASC;
```

### Get Orders by Status
```sql
SELECT 
  o.*,
  u.name as customer_name,
  p.payment_status as payment_verification_status
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN payments p ON o.id = p.order_id
WHERE o.order_status = 'waiting_payment'
ORDER BY o.created_at DESC;
```

---

## 📦 Sample Data

### Bank Accounts
```sql
INSERT INTO bank_accounts (bank_name, account_number, account_holder_name, branch, is_active, display_order) VALUES
('Bank BCA', '1234567890', 'PT Benua Kertas Indonesia', 'KCP Jakarta Pusat', TRUE, 1),
('Bank Mandiri', '9876543210', 'PT Benua Kertas Indonesia', 'KCP Jakarta Selatan', TRUE, 2),
('Bank BNI', '5555666677', 'PT Benua Kertas Indonesia', 'KCP Jakarta Barat', TRUE, 3);
```

### Box Models
```sql
INSERT INTO box_models (model_id, model_name, description, is_active, display_order) VALUES
('earlock-box-depan', 'Earlock Box Depan', 'Box dengan lock di bagian depan', TRUE, 1),
('earlock-box-samping', 'Earlock Box Samping', 'Box dengan lock di bagian samping', TRUE, 2),
('top-bottom-box', 'Top Bottom Box', 'Box dengan tutup terpisah', TRUE, 3),
('lunch-box', 'Lunch Box', 'Box untuk kemasan makanan', TRUE, 4),
('clamshell-box', 'Clamshell Box', 'Box dengan engsel', TRUE, 5),
('tray-box', 'Tray Box', 'Box berbentuk tray', TRUE, 6);
```

### Materials
```sql
INSERT INTO materials (material_id, material_name, description, is_active, display_order) VALUES
('duplex', 'Duplex', 'Kertas duplex berkualitas tinggi', TRUE, 1),
('ivory', 'Ivory', 'Kertas ivory premium', TRUE, 2),
('kraft', 'Kraft', 'Kertas kraft natural', TRUE, 3);
```

### Material Thickness
```sql
INSERT INTO material_thickness (thickness_value, is_active, display_order) VALUES
(300, TRUE, 1),
(350, TRUE, 2),
(400, TRUE, 3),
(450, TRUE, 4);
```

### Finishing Options
```sql
INSERT INTO finishing_options (finishing_id, finishing_name, description, is_active, display_order) VALUES
('sisi-luar', 'Sisi Luar', 'Laminasi pada sisi luar saja', TRUE, 1),
('dalam', 'Dalam', 'Laminasi pada bagian dalam', TRUE, 2),
('luar-dalam', 'Luar & Dalam', 'Laminasi pada kedua sisi', TRUE, 3),
('tanpa-laminasi', 'Tanpa Laminasi', 'Tanpa laminasi', TRUE, 4),
('glossy', 'Glossy', 'Laminasi glossy mengkilap', TRUE, 5),
('doff', 'Doff', 'Laminasi doff matte', TRUE, 6);
```

---

## 🚀 Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
- ✅ Tabel `orders`
- ✅ Tabel `payments`
- ✅ Tabel `bank_accounts`
- ✅ Tabel `order_history`

### Phase 2: Enhancement
- ⏳ Tabel master data (box_models, materials, dll)
- ⏳ Tabel `pricing_rules`
- ⏳ Admin dashboard untuk manage master data

### Phase 3: Advanced Features
- ⏳ Shipping integration
- ⏳ Invoice generation
- ⏳ Email notifications
- ⏳ WhatsApp notifications

---

## 📌 Notes

1. **Order Number Format**: `ORD-YYYY-MM-DD-XXXX` (e.g., ORD-2026-05-30-0001)
2. **Payment Number Format**: `PAY-YYYY-MM-DD-XXXX` (e.g., PAY-2026-05-30-0001)
3. **File Upload Path**: `/uploads/designs/{order_id}/{filename}`
4. **Payment Proof Path**: `/uploads/payments/{payment_id}/{filename}`
5. **Estimasi Produksi**: Default 7-10 hari kerja
6. **PPN**: 11% dari subtotal
7. **Currency**: IDR (Indonesian Rupiah)

---

## 🔐 Security Considerations

1. **File Upload**: Validasi tipe file dan ukuran maksimal
2. **SQL Injection**: Gunakan prepared statements
3. **Access Control**: Pastikan user hanya bisa akses order mereka sendiri
4. **Payment Verification**: Hanya admin yang bisa verifikasi pembayaran
5. **Sensitive Data**: Encrypt data sensitif seperti nomor rekening customer

---

## 📊 Indexes untuk Performance

```sql
-- Orders table
CREATE INDEX idx_order_number ON orders(order_number);
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(order_status);
CREATE INDEX idx_payment_status ON orders(payment_status);
CREATE INDEX idx_created_at ON orders(created_at);

-- Payments table
CREATE INDEX idx_order_id ON payments(order_id);
CREATE INDEX idx_payment_number ON payments(payment_number);
CREATE INDEX idx_payment_status ON payments(payment_status);

-- Order History table
CREATE INDEX idx_order_id ON order_history(order_id);
CREATE INDEX idx_created_at ON order_history(created_at);
```

---

**Last Updated**: May 30, 2026
**Version**: 1.0
**Author**: Development Team
