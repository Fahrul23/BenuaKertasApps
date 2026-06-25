# Prompt untuk Generate Activity Diagram: Pemesanan Custom Box

Anda dapat menyalin prompt di bawah ini dan memberikannya kepada AI (seperti ChatGPT, Claude, atau Gemini) untuk menghasilkan kode Activity Diagram (misalnya menggunakan format **Mermaid.js** atau **PlantUML**).

---

## Salin Teks di Bawah Ini:

```text
Tolong buatkan Activity Diagram menggunakan sintaks **Mermaid.js** (format Swimlane) yang menggambarkan proses pemesanan Custom Box di sebuah website e-commerce percetakan. 

Diagram ini harus memiliki 3 aktor/swimlane utama:
1. Customer
2. System
3. Admin

Berikut adalah alur proses (flow) yang harus digambarkan secara berurutan:

1. **Customer**: Mengunjungi website, melakukan Registrasi Akun, lalu Login.
2. **Customer**: Memilih spesifikasi produk Custom Box (Model Box, Ukuran, Bahan, Ketebalan, Laminasi, Warna, dan Kuantitas).
3. **Customer**: Mengunggah file desain (opsional) dan memberikan catatan tambahan.
4. **Customer**: Mengisi informasi alamat pengiriman dan detail kontak.
5. **Customer**: Melakukan checkout pesanan.
6. **System**: Membuat pesanan baru dan mengatur status awal menjadi `WAITING_PAYMENT` (Menunggu Pembayaran / DP).
7. **Customer**: Melakukan transfer pembayaran (DP atau Lunas) dan mengunggah Bukti Pembayaran ke sistem.
8. **System**: Menyimpan bukti pembayaran dan mengirimkan notifikasi ke Admin.
9. **Admin**: Memeriksa detail pesanan dan memvalidasi bukti pembayaran.
   - *Decision Node*: Apakah pembayaran valid?
     - Jika **Tidak**: Admin menolak pembayaran, kembali ke Customer untuk upload ulang bukti pembayaran.
     - Jika **Ya**: Admin menyetujui, System mengubah status pesanan menjadi `PAYMENT_CONFIRMED`.
10. **Admin**: Memulai proses produksi box dan mengubah status pesanan menjadi `IN_PRODUCTION` (Sedang Diproses / Produksi).
11. **Admin**: Setelah produksi selesai, Admin mengubah status menjadi `READY_TO_SHIP` (Siap Dikirim / Pelunasan).
12. **Customer**: (Jika sebelumnya hanya DP) Customer melakukan pelunasan tagihan dan mengunggah bukti pelunasan. Admin memvalidasi pelunasan.
13. **Admin**: Melakukan pengiriman pesanan ke ekspedisi dan mengubah status menjadi `SHIPPED` (Dalam Pengiriman).
14. **Customer**: Menerima paket box pesanan.
15. **Admin / System**: Menandai pesanan telah selesai, status berubah menjadi `COMPLETED` (Selesai).
16. **End State**: Proses pemesanan selesai.

Pastikan alurnya rapi, mudah dibaca, dan menggunakan notasi standar Activity Diagram di Mermaid.js. Tambahkan warna berbeda untuk setiap status pesanan jika memungkinkan.
```

---

### Catatan Penggunaan:
1. Anda bisa paste kode `Mermaid.js` yang dihasilkan oleh AI ke dalam file Markdown Anda atau menggunakan [Mermaid Live Editor](https://mermaid.live/) untuk melihat diagramnya secara visual.
2. Alur di atas sudah disesuaikan dengan kode status yang ada di sistem frontend Anda: `WAITING_PAYMENT`, `PAYMENT_CONFIRMED`, `IN_PRODUCTION`, `READY_TO_SHIP`, `SHIPPED`, dan `COMPLETED`.
