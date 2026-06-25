# Prompt untuk Generate Tabel Spesifikasi Database (Excel/Word)

Jika Anda ingin men-generate spesifikasi ini menggunakan AI lain, Anda bisa *copy-paste* prompt di bawah ini:

---
**PROMPT:**
> "Buatkan saya spesifikasi file/tabel database dalam bentuk tabel untuk disalin ke Excel. Format kolomnya harus persis seperti ini: `No`, `Nama Field`, `Tipe`, `Panjang`, dan `Keterangan`. Jika tipenya `Int`, beri panjang `11`. Jika `Text`, `DateTime`, atau `Enum`, kosongkan panjangnya (`-`). Beri keterangan `Primary key` atau `Foreign key` jika sesuai. Berikut adalah daftar tabel dan kolomnya dari schema.prisma saya: (lalu paste isi file schema.prisma Anda)"

---

Atau, Anda tidak perlu repot-repot lagi! **Saya sudah buatkan seluruh tabel spesifikasinya di bawah ini.** 
Anda tinggal **blok (highlight)** tabel-tabel di bawah ini, lalu **Copy (Ctrl+C)** dan langsung **Paste (Ctrl+V)** di aplikasi **Microsoft Excel** atau **Word**.

### Spesifikasi file users
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | name | varchar | 100 | |
| 3 | email | varchar | 255 | Unique |
| 4 | password | varchar | 255 | |
| 5 | role | enum | - | Default: USER |
| 6 | phone | varchar | 20 | Nullable |
| 7 | province | varchar | 100 | Nullable |
| 8 | city | varchar | 100 | Nullable |
| 9 | district | varchar | 100 | Nullable |
| 10 | postalCode | varchar | 10 | Nullable |
| 11 | detailAddress | text | - | Nullable |
| 12 | createdAt | datetime | - | |
| 13 | resetPasswordExpiry | datetime | - | Nullable |
| 14 | resetPasswordToken | varchar | 255 | Nullable |

### Spesifikasi file box_models
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | code | varchar | 100 | Unique |
| 3 | name | varchar | 200 | |
| 4 | description | text | - | Nullable |
| 5 | imageUrl | varchar | 500 | Nullable |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | basePrice | decimal | 15,2 | Nullable |
| 8 | createdAt | datetime | - | |
| 9 | updatedAt | datetime | - | |

### Spesifikasi file materials
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | code | varchar | 100 | Unique |
| 3 | name | varchar | 200 | |
| 4 | description | text | - | Nullable |
| 5 | imageUrl | varchar | 500 | Nullable |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | createdAt | datetime | - | |
| 8 | updatedAt | datetime | - | |

### Spesifikasi file finishing_options
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | code | varchar | 100 | Unique |
| 3 | name | varchar | 200 | |
| 4 | description | text | - | Nullable |
| 5 | imageUrl | varchar | 500 | Nullable |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | category | varchar | 10 | |
| 8 | createdAt | datetime | - | |
| 9 | updatedAt | datetime | - | |

### Spesifikasi file plano_types
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | code | varchar | 20 | Unique |
| 3 | width | float | - | |
| 4 | height | float | - | |
| 5 | effectiveWidth | float | - | |
| 6 | effectiveHeight | float | - | |
| 7 | isActive | boolean | 1 | Default: true |
| 8 | sortOrder | Int | 11 | Default: 0 |
| 9 | createdAt | datetime | - | |
| 10 | updatedAt | datetime | - | |

### Spesifikasi file material_prices
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | planoCode | varchar | 20 | Logical Foreign Key |
| 3 | materialCode | varchar | 100 | Logical Foreign Key |
| 4 | thickness | Int | 11 | |
| 5 | price | float | - | |
| 6 | isActive | boolean | 1 | Default: true |
| 7 | createdAt | datetime | - | |
| 8 | updatedAt | datetime | - | |

### Spesifikasi file color_prices
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | thicknessMin | Int | 11 | |
| 3 | thicknessMax | Int | 11 | |
| 4 | pricePerSide | float | - | |
| 5 | isActive | boolean | 1 | Default: true |
| 6 | createdAt | datetime | - | |
| 7 | updatedAt | datetime | - | |

### Spesifikasi file cmyk_blok_prices
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | thicknessMin | Int | 11 | |
| 3 | thicknessMax | Int | 11 | |
| 4 | cetakPrice | float | - | |
| 5 | dragPrice | float | - | |
| 6 | platPrice | float | - | |
| 7 | isActive | boolean | 1 | Default: true |
| 8 | createdAt | datetime | - | |
| 9 | updatedAt | datetime | - | |

### Spesifikasi file pricing_config
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | pondMultiplier | float | - | |
| 3 | packingDivisor | Int | 11 | |
| 4 | packingMultiplier | float | - | |
| 5 | laminasiMultiplier | float | - | |
| 6 | pisauPrice | float | - | |
| 7 | dragThreshold | Int | 11 | |
| 8 | updatedAt | datetime | - | |

### Spesifikasi file orders
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | orderNumber | varchar | 50 | Unique |
| 3 | userId | Int | 11 | Foreign key |
| 4 | boxModel | varchar | 50 | Logical Foreign Key |
| 5 | sizePanjang | decimal | 10,2 | |
| 6 | sizeLebar | decimal | 10,2 | |
| 7 | sizeTinggi | decimal | 10,2 | |
| 8 | sizeTinggiTutup | decimal | 10,2 | Nullable |
| 9 | material | varchar | 50 | Logical Foreign Key |
| 10 | materialThickness | Int | 11 | |
| 11 | colorOption | varchar | 50 | |
| 12 | laminationSide | varchar | 50 | |
| 13 | laminationType | varchar | 50 | Nullable |
| 14 | designFileUrl | varchar | 500 | Nullable |
| 15 | designFilePublicId | varchar | 255 | Nullable |
| 16 | designFileName | varchar | 255 | Nullable |
| 17 | designFileSize | Int | 11 | Nullable |
| 18 | designFileFormat | varchar | 10 | Nullable |
| 19 | customerNote | text | - | Nullable |
| 20 | quantity | Int | 11 | |
| 21 | customerPhone | varchar | 20 | Nullable |
| 22 | shippingProvince | varchar | 100 | Nullable |
| 23 | shippingCity | varchar | 100 | Nullable |
| 24 | shippingDistrict | varchar | 100 | Nullable |
| 25 | shippingPostalCode | varchar | 10 | Nullable |
| 26 | shippingDetailAddress | text | - | Nullable |
| 27 | planoType | varchar | 20 | Logical Foreign Key |
| 28 | paperWidth | float | - | Nullable |
| 29 | paperHeight | float | - | Nullable |
| 30 | jumlahMata | Int | 11 | Nullable |
| 31 | planoOrientation | varchar | 20 | Nullable |
| 32 | qtyPlano | float | - | Nullable |
| 33 | qtyRim | Int | 11 | Nullable |
| 34 | totalBayar | float | - | Nullable |
| 35 | hargaPerPcs | float | - | Nullable |
| 36 | subtotal | decimal | 15,2 | |
| 37 | totalAmount | decimal | 15,2 | |
| 38 | orderStatus | enum | - | |
| 39 | paymentStatus | enum | - | |
| 40 | estimatedProductionDays | Int | 11 | |
| 41 | productionStartDate | datetime | - | Nullable |
| 42 | productionEndDate | datetime | - | Nullable |
| 43 | createdAt | datetime | - | |
| 44 | updatedAt | datetime | - | |

### Spesifikasi file order_history
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | orderId | Int | 11 | Foreign key |
| 3 | previousStatus | varchar | 50 | Nullable |
| 4 | newStatus | varchar | 50 | |
| 5 | changedBy | Int | 11 | Foreign key (User) |
| 6 | changeType | enum | - | |
| 7 | notes | text | - | Nullable |
| 8 | createdAt | datetime | - | |

### Spesifikasi file bank_accounts
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | bankName | varchar | 100 | |
| 3 | accountNumber | varchar | 50 | |
| 4 | accountHolderName | varchar | 100 | |
| 5 | branch | varchar | 100 | Nullable |
| 6 | imageUrl | varchar | 500 | Nullable |
| 7 | publicId | varchar | 255 | Nullable |
| 8 | isActive | boolean | 1 | Default: true |
| 9 | displayOrder | Int | 11 | Default: 0 |
| 10 | createdAt | datetime | - | |
| 11 | updatedAt | datetime | - | |

### Spesifikasi file payments
| No | Nama Field | Tipe | Panjang | Keterangan |
|---|---|---|---|---|
| 1 | id | Int | 11 | Primary key |
| 2 | orderId | Int | 11 | Foreign key |
| 3 | paymentNumber | varchar | 50 | Unique |
| 4 | paymentMethod | enum | - | |
| 5 | bankName | varchar | 100 | Nullable |
| 6 | accountNumber | varchar | 50 | Nullable |
| 7 | accountHolderName | varchar | 100 | Nullable |
| 8 | amount | decimal | 15,2 | |
| 9 | paymentProofUrl | varchar | 500 | Nullable |
| 10 | paymentProofPublicId | varchar | 255 | Nullable |
| 11 | paymentProofName | varchar | 255 | Nullable |
| 12 | paymentStatus | enum | - | |
| 13 | verifiedBy | Int | 11 | Foreign key (User) |
| 14 | verifiedAt | datetime | - | Nullable |
| 15 | rejectionReason | text | - | Nullable |
| 16 | paidAt | datetime | - | Nullable |
| 17 | createdAt | datetime | - | |
| 18 | updatedAt | datetime | - | |
