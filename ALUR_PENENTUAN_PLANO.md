# Ringkasan Logika Plano Kalkulator

> Dokumen ini merangkum cara kerja dan formula perhitungan plano untuk setiap tipe box pada aplikasi **Packaging Plano Kalkulator**.

---

## Alur Logika Secara Umum

```
Input Ukuran Box  →  Hitung Ukuran Kertas  →  Coba 2 Orientasi Tiap Plano  →  Rekomendasikan Plano Terbaik
```

Empat langkah ini berlaku **sama untuk semua tipe box**, yang berbeda hanya formula di langkah pertama.

---

## Langkah 1 — Formula Ukuran Kertas per Tipe Box

> **Keterangan variabel:**
> - `P` = Panjang box
> - `L` = Lebar box
> - `T` = Tinggi box
> - `T-Tutup` = Tinggi tutup (khusus Top Bottom)
> - `Lidah` = Ukuran lidah (khusus Earlock Samping)

### Earlock Box Depan

| Dimensi | Formula |
|---|---|
| Panjang Kertas | `T + L + T + L + T` = **3T + 2L** |
| Lebar Kertas | `T + T + P + T + T` = **4T + P** |

**Catatan:** Earlock berada di sisi depan-belakang, sehingga lebar kertas membutuhkan 4× Tinggi untuk membentuk kedua earlock.

---

### Earlock Box Samping

| Dimensi | Formula |
|---|---|
| Panjang Kertas | `T + L + T + L + Lidah` = **2T + 2L + Lidah** |
| Lebar Kertas | `T + P + T` = **2T + P** |

**Catatan:** Earlock berada di sisi kiri-kanan. Parameter `Lidah` menggantikan peran earlock di sisi depan-belakang.

---

### Top Bottom Box

| Dimensi | Formula |
|---|---|
| Panjang Kertas | `T-Tutup + L + T-Tutup + 0.5 + T + L + T` = **2×T-Tutup + 2T + 2L + 0.5** |
| Lebar Kertas | `T + P + T` = **2T + P** |

**Catatan:** Body dan tutup digabung dalam satu lembar kertas. Angka `+0.5 cm` adalah jeda/gap antara bagian tutup dan body.

---

### Lunch Box

| Dimensi | Formula |
|---|---|
| Panjang Kertas | `T + (P − 2) + T` = **2T + P − 2** |
| Lebar Kertas | `T + L + T + (L − 2) + T` = **3T + 2L − 2** |

**Catatan:** Ada pengurangan `−2 cm` pada Panjang dan Lebar sebagai allowance untuk overlap lipatan tutup lunch box.

---

### Tray Box

| Dimensi | Formula |
|---|---|
| Panjang Kertas | `T + P + T` = **2T + P** |
| Lebar Kertas | `T + L + T` = **2T + L** |

**Catatan:** Formula paling sederhana karena tray bersifat *open-top* — tidak ada tutup terpisah.

---

### Clamshell Box

| Dimensi | Formula |
|---|---|
| Panjang Kertas | `(T/2 + 1) + L + T + L + (T/2 + 1)` = **T + 2L + 2(T/2 + 1)** |
| Lebar Kertas | `(T/2 + 1) + P + (T/2 + 1)` = **P + 2(T/2 + 1)** |

**Catatan:** Box clamshell terbuka dengan engsel (hinge) di tengah — bagian `T/2` mewakili setengah tinggi untuk masing-masing sisi tutup dan alas yang menyatu, ditambah `+1 cm` sebagai allowance per sisi. Karena ada dua sisi sejenis (tutup & alas yang identik), `L` muncul dua kali di formula panjang kertas, dan `T` utuh juga muncul sebagai penghubung di tengah.

---

## Langkah 2 — Margin / Grip Plano

Sebelum menghitung jumlah mata, area efektif plano diperoleh dengan mengurangi margin cetak (grip) di keempat sisi:

| Sisi | Margin |
|---|---|
| Kiri | 1 cm |
| Kanan | 1 cm |
| Atas | 1 cm |
| Bawah | 1.5 cm |

```
Area efektif lebar  = lebar plano − 2 cm
Area efektif tinggi = tinggi plano − 2.5 cm
```

---

## Langkah 3 — Hitung Jumlah Mata (2 Orientasi)

Setiap ukuran plano dicoba dengan dua orientasi penempatan kertas untuk mencari yang paling efisien.

### Orientasi Normal

```
X = floor( efektif-lebar  ÷ Panjang-Kertas )
Y = floor( efektif-tinggi ÷ Lebar-Kertas )

Mata Normal = X × Y
```

### Orientasi Rotasi 90°

```
X = floor( efektif-lebar  ÷ Lebar-Kertas )
Y = floor( efektif-tinggi ÷ Panjang-Kertas )

Mata Rotasi = X × Y
```

### Hasil Akhir

```
Jumlah Mata = max( Mata Normal, Mata Rotasi )
```

Orientasi dengan jumlah mata terbanyak yang dipakai. Khusus **Earlock Depan**, jika jumlah mata sama, dipilih orientasi dengan **sisa area terkecil**.

---

## Langkah 4 — Ukuran Plano yang Tersedia

Perhitungan dilakukan terhadap ketiga ukuran plano berikut:

| Nama Plano | Lebar | Tinggi | Efektif Lebar | Efektif Tinggi |
|---|---|---|---|---|
| 65 × 100 | 65 cm | 100 cm | 63 cm | 97.5 cm |
| 79 × 109 | 79 cm | 109 cm | 77 cm | 106.5 cm |
| 90 × 120 | 90 cm | 120 cm | 88 cm | 117.5 cm |

Hasil ketiga plano diurutkan dari jumlah mata terbanyak. **Plano dengan mata terbanyak** menjadi rekomendasi utama.

---

## Perbandingan Singkat Semua Tipe Box

| Tipe Box | Input Tambahan | P-Kertas | L-Kertas | Kompleksitas |
|---|---|---|---|---|
| Tray Box | — | 2T + P | 2T + L | Sangat sederhana |
| Earlock Samping | Lidah | 2T + 2L + Lidah | 2T + P | Sederhana |
| Earlock Depan | — | 3T + 2L | 4T + P | Sedang |
| Lunch Box | — | 2T + P − 2 | 3T + 2L − 2 | Sedang |
| Clamshell | — | T + 2L + 2(T/2 + 1) | P + 2(T/2 + 1) | Sedang |
| Top Bottom | T-Tutup | 2×T-Tutup + 2T + 2L + 0.5 | 2T + P | Kompleks |

---

## Kesimpulan

1. **Formula kertas** ditentukan oleh struktur fisik box — bagaimana box "dibuka" menjadi flat (diecut).
2. **Grip/margin** selalu dipotong dari ukuran plano sebelum dihitung — nilainya tetap untuk semua tipe.
3. **Dua orientasi** (normal & rotasi) selalu dicoba untuk memaksimalkan jumlah mata dalam satu plano.
4. **Rekomendasi** adalah plano yang menghasilkan jumlah mata terbanyak dari ketiga ukuran yang tersedia.

---

*Packaging Plano Calculator © 2026*
