# Spesifikasi Tabel Database

> **Sumber:** `server/prisma/schema.prisma` (paling terbaru)
> **Database:** MySQL | **ORM:** Prisma

---

Anda tinggal **blok (highlight)** tabel-tabel di bawah ini, lalu **Copy (Ctrl+C)** dan langsung **Paste (Ctrl+V)** di aplikasi **Microsoft Excel** atau **Word**.

---

## Daftar Tabel

1. [users](#spesifikasi-file-users)
2. [box_models](#spesifikasi-file-box_models)
3. [materials](#spesifikasi-file-materials)
4. [finishing_options](#spesifikasi-file-finishing_options)
5. [plano_types](#spesifikasi-file-plano_types)
6. [material_prices](#spesifikasi-file-material_prices)
7. [color_prices](#spesifikasi-file-color_prices)
8. [cmyk_blok_prices](#spesifikasi-file-cmyk_blok_prices)
9. [pricing_config](#spesifikasi-file-pricing_config)
10. [orders](#spesifikasi-file-orders)
11. [order_history](#spesifikasi-file-order_history)
12. [bank_accounts](#spesifikasi-file-bank_accounts)
13. [payments](#spesifikasi-file-payments)

---

### Spesifikasi file users
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | name | varchar | 100 | |
| 3 | email | varchar | 255 | Unique |
| 4 | password | varchar | 255 | |
| 5 | role | enum | - | Nilai: ADMIN, USER. Default: USER |
| 6 | phone | varchar | 20 | Nullable |
| 7 | province | varchar | 100 | Nullable |
| 8 | city | varchar | 100 | Nullable |
| 9 | district | varchar | 100 | Nullable |
| 10 | postalCode | varchar | 10 | Nullable |
| 11 | detailAddress | text | - | Nullable |
| 12 | createdAt | datetime | - | Default: now() |
| 13 | resetPasswordExpiry | datetime | - | Nullable |
| 14 | resetPasswordToken | varchar | 255 | Nullable |

---

### Spesifikasi file box_models
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | code | varchar | 100 | Unique |
| 3 | name | varchar | 200 | |
| 4 | description | text | - | Nullable |
| 5 | imageUrl | varchar | 500 | Nullable |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | basePrice | decimal | 15,2 | Nullable |
| 8 | createdAt | datetime | - | Default: now() |
| 9 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file materials
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | code | varchar | 100 | Unique |
| 3 | name | varchar | 200 | |
| 4 | description | text | - | Nullable |
| 5 | imageUrl | varchar | 500 | Nullable |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | createdAt | datetime | - | Default: now() |
| 8 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file finishing_options
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | code | varchar | 100 | Unique |
| 3 | name | varchar | 200 | |
| 4 | description | text | - | Nullable |
| 5 | imageUrl | varchar | 500 | Nullable |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | category | varchar | 10 | Nilai: "side" atau "type" |
| 8 | createdAt | datetime | - | Default: now() |
| 9 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file plano_types
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | code | varchar | 20 | Unique. Contoh: "65x100", "79x109", "90x120" |
| 3 | width | float | - | Lebar kertas (cm) |
| 4 | height | float | - | Tinggi kertas (cm) |
| 5 | effectiveWidth | float | - | Lebar efektif setelah potong grip (cm) |
| 6 | effectiveHeight | float | - | Tinggi efektif setelah potong grip (cm) |
| 7 | isActive | boolean | 1 | Default: true |
| 8 | sortOrder | Int | 11 | Default: 0 |
| 9 | createdAt | datetime | - | Default: now() |
| 10 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file material_prices
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | planoCode | varchar | 20 | Logical Foreign Key ke plano_types.code |
| 3 | materialCode | varchar | 100 | Logical Foreign Key ke materials.code |
| 4 | thickness | Int | 11 | Gramatur GSM: 230, 250, 270, 300, 310, 350, 400 |
| 5 | price | float | - | Harga per plano (Rupiah) |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | createdAt | datetime | - | Default: now() |
| 8 | updatedAt | datetime | - | Auto update |

> Unique constraint: (planoCode, materialCode, thickness)

---

### Spesifikasi file color_prices
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | thicknessMin | Int | 11 | Gramatur minimal range (GSM) |
| 3 | thicknessMax | Int | 11 | Gramatur maksimal range (GSM) |
| 4 | pricePerSide | float | - | Harga per sisi (Rupiah) |
| 5 | isActive | boolean | 1 | Default: true |
| 6 | createdAt | datetime | - | Default: now() |
| 7 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file cmyk_blok_prices
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | thicknessMin | Int | 11 | Gramatur minimal range (GSM) |
| 3 | thicknessMax | Int | 11 | Gramatur maksimal range (GSM) |
| 4 | cetakPrice | float | - | Harga cetak flat (Rupiah) |
| 5 | dragPrice | float | - | Harga per unit drag (Rupiah) |
| 6 | platPrice | float | - | Harga plat flat (Rupiah) |
| 7 | isActive | boolean | 1 | Default: true |
| 8 | createdAt | datetime | - | Default: now() |
| 9 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file pricing_config
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | pondMultiplier | float | - | Default: 85. hargaPond = qty x nilai ini |
| 3 | packingDivisor | Int | 11 | Default: 500. qty dibagi nilai ini |
| 4 | packingMultiplier | float | - | Default: 15000. hasil dikali nilai ini |
| 5 | laminasiMultiplier | float | - | Default: 0.3. P x L x nilai ini x qty |
| 6 | pisauPrice | float | - | Default: 700000. Harga pisau flat |
| 7 | dragThreshold | Int | 11 | Default: 1000. qty dikurangi nilai ini sebelum dikali dragPrice |
| 8 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file orders
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | orderNumber | varchar | 50 | Unique |
| 3 | userId | Int | 11 | Foreign key ke users.id (Cascade Delete) |
| 4 | boxModel | varchar | 50 | Logical Foreign Key ke box_models.code |
| 5 | sizePanjang | decimal | 10,2 | Panjang box (cm) |
| 6 | sizeLebar | decimal | 10,2 | Lebar box (cm) |
| 7 | sizeTinggi | decimal | 10,2 | Tinggi box (cm) |
| 8 | sizeTinggiTutup | decimal | 10,2 | Nullable. Tinggi tutup box (cm) |
| 9 | material | varchar | 50 | Logical Foreign Key ke materials.code |
| 10 | materialThickness | Int | 11 | Gramatur material (GSM) |
| 11 | colorOption | varchar | 50 | Opsi warna cetak |
| 12 | laminationSide | varchar | 50 | Sisi laminasi |
| 13 | laminationType | varchar | 50 | Nullable. Jenis laminasi |
| 14 | designFileUrl | varchar | 500 | Nullable. URL file desain (Cloudinary) |
| 15 | designFilePublicId | varchar | 255 | Nullable. Public ID Cloudinary |
| 16 | designFileName | varchar | 255 | Nullable. Nama file desain |
| 17 | designFileSize | Int | 11 | Nullable. Ukuran file desain (bytes) |
| 18 | designFileFormat | varchar | 10 | Nullable. Format file desain |
| 19 | customerNote | text | - | Nullable. Catatan dari pelanggan |
| 20 | quantity | Int | 11 | Jumlah pesanan (pcs) |
| 21 | customerPhone | varchar | 20 | Nullable. Nomor telepon pelanggan |
| 22 | shippingProvince | varchar | 100 | Nullable. Provinsi pengiriman |
| 23 | shippingCity | varchar | 100 | Nullable. Kota pengiriman |
| 24 | shippingDistrict | varchar | 100 | Nullable. Kecamatan pengiriman |
| 25 | shippingPostalCode | varchar | 10 | Nullable. Kode pos pengiriman |
| 26 | shippingDetailAddress | text | - | Nullable. Alamat detail pengiriman |
| 27 | planoType | varchar | 20 | Nullable. Logical FK ke plano_types.code |
| 28 | paperWidth | float | - | Nullable. Lebar kertas hasil kalkulasi (cm) |
| 29 | paperHeight | float | - | Nullable. Panjang kertas hasil kalkulasi (cm) |
| 30 | jumlahMata | Int | 11 | Nullable. Hasil kalkulasi mata terbanyak |
| 31 | planoOrientation | varchar | 20 | Nullable. Nilai: "normal" atau "rotasi" |
| 32 | qtyPlano | float | - | Nullable. qtyBox dibagi jumlahMata dibagi 500 |
| 33 | qtyRim | Int | 11 | Nullable. qtyBox dibagi 500 |
| 34 | totalBayar | float | - | Nullable. Total harga semua komponen |
| 35 | hargaPerPcs | float | - | Nullable. totalBayar dibagi quantity |
| 36 | subtotal | decimal | 15,2 | Subtotal harga |
| 37 | totalAmount | decimal | 15,2 | Total tagihan |
| 38 | orderStatus | enum | - | Nilai: PENDING, WAITING_PAYMENT, PAYMENT_CONFIRMED, IN_PRODUCTION, READY_TO_SHIP, SHIPPED, COMPLETED, CANCELLED. Default: PENDING |
| 39 | paymentStatus | enum | - | Nilai: UNPAID, PENDING, PAID, FAILED, REFUNDED. Default: UNPAID |
| 40 | estimatedProductionDays | Int | 11 | Default: 10 |
| 41 | productionStartDate | date | - | Nullable. Tanggal mulai produksi |
| 42 | productionEndDate | date | - | Nullable. Tanggal selesai produksi |
| 43 | createdAt | datetime | - | Default: now() |
| 44 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file order_history
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | orderId | Int | 11 | Foreign key ke orders.id (Cascade Delete) |
| 3 | previousStatus | varchar | 50 | Nullable. Status sebelumnya |
| 4 | newStatus | varchar | 50 | Status baru |
| 5 | changedBy | Int | 11 | Nullable. Foreign key ke users.id |
| 6 | changeType | enum | - | Nilai: STATUS_CHANGE, PAYMENT_UPDATE, PRODUCTION_UPDATE, SHIPPING_UPDATE, OTHER |
| 7 | notes | text | - | Nullable. Catatan perubahan |
| 8 | createdAt | datetime | - | Default: now() |

---

### Spesifikasi file bank_accounts
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | bankName | varchar | 100 | Nama bank |
| 3 | accountNumber | varchar | 50 | Nomor rekening |
| 4 | accountHolderName | varchar | 100 | Nama pemilik rekening |
| 5 | branch | varchar | 100 | Nullable. Cabang bank |
| 6 | imageUrl | varchar | 500 | Nullable. URL logo/gambar bank (Cloudinary) |
| 7 | publicId | varchar | 255 | Nullable. Public ID Cloudinary |
| 8 | isActive | boolean | 1 | Default: true |
| 9 | displayOrder | Int | 11 | Default: 0. Urutan tampil |
| 10 | createdAt | datetime | - | Default: now() |
| 11 | updatedAt | datetime | - | Auto update |

---

### Spesifikasi file payments
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key, Auto Increment |
| 2 | orderId | Int | 11 | Foreign key ke orders.id (Cascade Delete) |
| 3 | paymentNumber | varchar | 50 | Unique |
| 4 | paymentMethod | enum | - | Nilai: BANK_TRANSFER, E_WALLET, CREDIT_CARD, CASH |
| 5 | bankName | varchar | 100 | Nullable. Nama bank pengirim |
| 6 | accountNumber | varchar | 50 | Nullable. Nomor rekening pengirim |
| 7 | accountHolderName | varchar | 100 | Nullable. Nama pemilik rekening pengirim |
| 8 | amount | decimal | 15,2 | Jumlah pembayaran (Rupiah) |
| 9 | paymentProofUrl | varchar | 500 | Nullable. URL bukti pembayaran (Cloudinary) |
| 10 | paymentProofPublicId | varchar | 255 | Nullable. Public ID Cloudinary bukti bayar |
| 11 | paymentProofName | varchar | 255 | Nullable. Nama file bukti pembayaran |
| 12 | paymentStatus | enum | - | Nilai: PENDING, VERIFIED, REJECTED, REFUNDED. Default: PENDING |
| 13 | verifiedBy | Int | 11 | Nullable. Foreign key ke users.id (Admin verifikator) |
| 14 | verifiedAt | datetime | - | Nullable. Waktu verifikasi |
| 15 | rejectionReason | text | - | Nullable. Alasan penolakan |
| 16 | paidAt | datetime | - | Nullable. Waktu pembayaran dikonfirmasi |
| 17 | createdAt | datetime | - | Default: now() |
| 18 | updatedAt | datetime | - | Auto update |

---

## Ringkasan Enum

| Enum | Nilai-nilai |
|---|---|
| users_role | ADMIN, USER |
| orders_orderStatus | PENDING, WAITING_PAYMENT, PAYMENT_CONFIRMED, IN_PRODUCTION, READY_TO_SHIP, SHIPPED, COMPLETED, CANCELLED |
| orders_paymentStatus | UNPAID, PENDING, PAID, FAILED, REFUNDED |
| order_history_changeType | STATUS_CHANGE, PAYMENT_UPDATE, PRODUCTION_UPDATE, SHIPPING_UPDATE, OTHER |
| payments_paymentMethod | BANK_TRANSFER, E_WALLET, CREDIT_CARD, CASH |
| payments_paymentStatus | PENDING, VERIFIED, REJECTED, REFUNDED |

---

## Relasi Antar Tabel

```
users (1) ----------- (N) orders           [users.id = orders.userId]
users (1) ----------- (N) order_history    [users.id = order_history.changedBy, Nullable]
users (1) ----------- (N) payments         [users.id = payments.verifiedBy, Nullable]

orders (1) ---------- (N) order_history    [orders.id = order_history.orderId]
orders (1) ---------- (N) payments         [orders.id = payments.orderId]

[Logical Foreign Keys - tidak di-enforce oleh database]
orders.boxModel          --> box_models.code
orders.material          --> materials.code
orders.planoType         --> plano_types.code
material_prices.planoCode    --> plano_types.code
material_prices.materialCode --> materials.code
```
