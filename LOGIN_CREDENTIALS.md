# 🔐 Kredensial Login - Benua Kertas Apps

## Akun yang Tersedia

### 👨‍💼 Admin
- **Email**: `admin@benuakertas.com`
- **Password**: `admin123`
- **Role**: ADMIN
- **Akses**: Dashboard admin, manajemen produk, pesanan, dll.

### 👤 User Biasa
- **Email**: `user@benuakertas.com`
- **Password**: `user123`
- **Role**: USER
- **Akses**: Halaman user, buat pesanan custom, tracking pesanan

### 👤 User Terdaftar
- **Email**: `fahrulihsan2399@gmail.com`
- **Password**: *(tanyakan ke admin atau cek database)*
- **Role**: USER

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Jalankan Backend (Server)
```bash
cd server
npm run dev
```
Server akan berjalan di: `http://localhost:5000`

### 2. Jalankan Frontend (Client)
```bash
cd client
npm run dev
```
Client akan berjalan di: `http://localhost:5173` atau `http://localhost:5174`

---

## ✅ Status Koneksi

### Database
- ✅ **MySQL**: Terkoneksi ke `benua_kertas_db`
- ✅ **Prisma**: Client sudah di-generate
- ✅ **Users**: 3 user tersedia di database

### API Endpoints
- ✅ **Health Check**: `GET http://localhost:5000/api/health`
- ✅ **Login**: `POST http://localhost:5000/api/v1/auth/login`
- ✅ **Register**: `POST http://localhost:5000/api/v1/auth/register`
- ✅ **Get Profile**: `GET http://localhost:5000/api/v1/auth/me` (requires token)

---

## 🔧 Troubleshooting

### Error: "Login gagal" atau "Network Error"

**Penyebab**:
1. Server backend tidak berjalan
2. Port client berbeda dari yang dikonfigurasi (CORS error)
3. Database tidak terkoneksi

**Solusi**:
1. Pastikan server berjalan di port 5000:
   ```bash
   cd server
   npm run dev
   ```

2. Cek apakah MySQL berjalan:
   ```bash
   # Windows
   Get-Service -Name "*mysql*"
   
   # Atau test koneksi database
   cd server
   node check-db.js
   ```

3. Jika client berjalan di port selain 5173, CORS sudah dikonfigurasi untuk menerima:
   - `http://localhost:5173`
   - `http://localhost:5174`

4. Cek browser console (F12) untuk melihat error detail

### Error: "CORS Policy"

**Solusi**: 
- CORS sudah dikonfigurasi untuk port 5173 dan 5174
- Jika menggunakan port lain, tambahkan di `server/src/app.js`:
  ```javascript
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:XXXX', // tambahkan port baru
    ],
    credentials: true,
  }));
  ```

### Error: "Token expired" atau redirect ke login terus

**Solusi**:
1. Hapus token lama dari localStorage:
   ```javascript
   // Di browser console (F12)
   localStorage.removeItem('token')
   ```

2. Login ulang dengan kredensial yang benar

---

## 📝 Catatan Penting

1. **Password Default**: Untuk keamanan, ganti password default setelah login pertama kali
2. **JWT Token**: Token berlaku selama 7 hari (konfigurasi di `JWT_EXPIRES_IN`)
3. **Environment**: Pastikan file `.env` sudah dikonfigurasi dengan benar di folder `server/`
4. **Database**: Jangan lupa jalankan migration jika ada perubahan schema:
   ```bash
   cd server
   npx prisma migrate dev
   ```

---

## 🧪 Test API Langsung

### Test Login dengan cURL (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@benuakertas.com","password":"admin123"}'
```

### Test Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

---

**Terakhir diupdate**: 16 Mei 2026
