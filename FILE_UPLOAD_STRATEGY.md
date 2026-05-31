# File Upload Strategy - Custom Order System

## 📁 Rekomendasi Solusi Upload File

Untuk upload file design dan bukti pembayaran, ada beberapa pilihan solusi yang bisa digunakan:

---

## 🎯 Rekomendasi Terbaik

### **1. Cloudinary** ⭐ (HIGHLY RECOMMENDED)

**Kenapa Cloudinary?**
- ✅ **Free tier generous**: 25 GB storage, 25 GB bandwidth/bulan
- ✅ **Image optimization otomatis**: Resize, compress, format conversion
- ✅ **CDN global**: Loading cepat dari mana saja
- ✅ **Easy integration**: SDK untuk Node.js dan React
- ✅ **Secure**: Built-in security dan access control
- ✅ **File management**: Dashboard untuk manage files
- ✅ **Support berbagai format**: PDF, JPG, PNG, SVG, dll
- ✅ **Transformasi on-the-fly**: Bisa resize/crop via URL

**Pricing:**
- **Free**: 25 GB storage, 25 GB bandwidth
- **Plus**: $99/bulan - 100 GB storage, 100 GB bandwidth
- **Advanced**: Custom pricing

**Use Case:**
- Upload design file (PDF, JPG, PNG, SVG)
- Upload bukti pembayaran (JPG, PNG, PDF)
- Generate thumbnail otomatis
- Watermark untuk design preview

**Setup:**
```bash
npm install cloudinary multer multer-storage-cloudinary
```

**Backend Implementation:**
```javascript
// server/src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

```javascript
// server/src/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage untuk design files
const designStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'benua-kertas/designs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'svg'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }]
  }
});

// Storage untuk payment proofs
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'benua-kertas/payments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto'
  }
});

const uploadDesign = multer({ 
  storage: designStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadPayment = multer({ 
  storage: paymentStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = { uploadDesign, uploadPayment };
```

**API Endpoint:**
```javascript
// server/src/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const { uploadDesign, uploadPayment } = require('../middleware/upload');

// Upload design file
router.post('/design', uploadDesign.single('file'), (req, res) => {
  try {
    res.json({
      success: true,
      file: {
        url: req.file.path,
        public_id: req.file.filename,
        original_name: req.file.originalname,
        size: req.file.size,
        format: req.file.format
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload payment proof
router.post('/payment', uploadPayment.single('file'), (req, res) => {
  try {
    res.json({
      success: true,
      file: {
        url: req.file.path,
        public_id: req.file.filename,
        original_name: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete file (jika user cancel atau ganti file)
router.delete('/:public_id', async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.public_id);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

**Frontend Implementation:**
```javascript
// client/src/services/uploadService.js
export const uploadDesignFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/design`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  return response.json();
};

export const uploadPaymentProof = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/payment`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  return response.json();
};
```

**Database Schema Update:**
```sql
-- Update orders table
ALTER TABLE orders 
  ADD COLUMN design_file_url VARCHAR(500) NULL,
  ADD COLUMN design_file_public_id VARCHAR(255) NULL,
  ADD COLUMN design_file_format VARCHAR(10) NULL;

-- Update payments table
ALTER TABLE payments 
  ADD COLUMN payment_proof_url VARCHAR(500) NULL,
  ADD COLUMN payment_proof_public_id VARCHAR(255) NULL;
```

---

### **2. ImgBB** (Alternative - Lebih Simple)

**Kenapa ImgBB?**
- ✅ **Completely free**: Unlimited storage
- ✅ **No registration needed**: Bisa langsung pakai API key
- ✅ **Simple API**: Sangat mudah digunakan
- ✅ **Direct image links**: Langsung dapat URL gambar
- ❌ **Hanya untuk gambar**: Tidak support PDF
- ❌ **No CDN**: Loading mungkin lebih lambat

**Pricing:**
- **Free**: Unlimited (dengan rate limit)

**Setup:**
```bash
npm install axios form-data
```

**Backend Implementation:**
```javascript
// server/src/services/imgbb.service.js
const axios = require('axios');
const FormData = require('form-data');

const uploadToImgBB = async (fileBuffer, fileName) => {
  const formData = new FormData();
  formData.append('image', fileBuffer.toString('base64'));
  formData.append('name', fileName);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
    {
      headers: formData.getHeaders()
    }
  );

  return {
    url: response.data.data.url,
    display_url: response.data.data.display_url,
    delete_url: response.data.data.delete_url,
    size: response.data.data.size
  };
};

module.exports = { uploadToImgBB };
```

---

### **3. AWS S3** (Enterprise Level)

**Kenapa AWS S3?**
- ✅ **Highly scalable**: Unlimited storage
- ✅ **Reliable**: 99.999999999% durability
- ✅ **Flexible**: Full control atas storage
- ✅ **Integration**: Bisa integrate dengan CloudFront CDN
- ❌ **Complex setup**: Butuh konfigurasi IAM, bucket policy, dll
- ❌ **Pricing**: Pay per use (bisa mahal kalau traffic tinggi)

**Pricing:**
- **First 50 TB/month**: $0.023 per GB
- **Data transfer**: $0.09 per GB (keluar dari AWS)
- **Requests**: $0.005 per 1,000 PUT requests

**Setup:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer multer-s3
```

---

### **4. Supabase Storage** (Modern Alternative)

**Kenapa Supabase?**
- ✅ **Free tier**: 1 GB storage
- ✅ **Built-in CDN**: Fast delivery
- ✅ **Easy integration**: Simple API
- ✅ **Access control**: Row-level security
- ✅ **Automatic backups**: Data safety
- ❌ **Limited free tier**: Hanya 1 GB

**Pricing:**
- **Free**: 1 GB storage, 2 GB bandwidth
- **Pro**: $25/bulan - 100 GB storage, 200 GB bandwidth

---

### **5. Firebase Storage** (Google Solution)

**Kenapa Firebase?**
- ✅ **Free tier**: 5 GB storage, 1 GB/day download
- ✅ **Google infrastructure**: Reliable dan cepat
- ✅ **Easy integration**: SDK lengkap
- ✅ **Security rules**: Flexible access control
- ❌ **Vendor lock-in**: Terikat dengan Google ecosystem

**Pricing:**
- **Spark (Free)**: 5 GB storage, 1 GB/day download
- **Blaze (Pay as you go)**: $0.026 per GB storage, $0.12 per GB download

---

## 📊 Comparison Table

| Feature | Cloudinary | ImgBB | AWS S3 | Supabase | Firebase |
|---------|-----------|-------|--------|----------|----------|
| **Free Storage** | 25 GB | Unlimited | 5 GB (12 months) | 1 GB | 5 GB |
| **Free Bandwidth** | 25 GB/month | Limited | 15 GB (12 months) | 2 GB/month | 1 GB/day |
| **PDF Support** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Image Optimization** | ✅ Auto | ❌ | Manual | ❌ | ❌ |
| **CDN** | ✅ Global | ❌ | ✅ (CloudFront) | ✅ | ✅ |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Pricing** | $99/month | Free | Pay per use | $25/month | Pay per use |
| **Best For** | Production | Simple projects | Enterprise | Modern apps | Google ecosystem |

---

## 🎯 Rekomendasi Final

### **Untuk Project Benua Kertas:**

**Pilihan 1: Cloudinary** ⭐⭐⭐⭐⭐
- **Alasan**: 
  - Support PDF untuk design files
  - Image optimization otomatis untuk bukti pembayaran
  - Free tier cukup untuk startup
  - Easy integration
  - Professional features (watermark, transformation, dll)

**Pilihan 2: AWS S3 + CloudFront**
- **Alasan**:
  - Jika sudah familiar dengan AWS
  - Butuh full control
  - Scalability untuk jangka panjang
  - Bisa integrate dengan services AWS lainnya

---

## 🔧 Implementation Flow

### **Upload Design File (Step 6)**

```javascript
// Frontend: UploadStep.jsx
const handleFileUpload = async (file) => {
  try {
    setUploading(true);
    
    // Upload to Cloudinary
    const result = await uploadDesignFile(file);
    
    // Save URL to state
    setUploadedFile({
      name: file.name,
      size: file.size,
      url: result.file.url,
      public_id: result.file.public_id
    });
    
    setUploading(false);
  } catch (error) {
    console.error('Upload failed:', error);
    setUploading(false);
  }
};
```

### **Submit Order (Step 8)**

```javascript
// Frontend: CustomOrderPage.jsx
const handleSubmitOrder = async () => {
  try {
    const orderData = {
      box_model: selectedModel,
      size_panjang: sizes.panjang,
      size_lebar: sizes.lebar,
      size_tinggi: sizes.tinggi,
      size_tinggi_tutup: sizes.tinggiTutup,
      material: selectedMaterial,
      material_thickness: selectedThickness,
      color_option: selectedColor,
      finishing_option: selectedFinishing,
      design_file_url: uploadedFile.url,
      design_file_public_id: uploadedFile.public_id,
      design_file_name: uploadedFile.name,
      design_file_size: uploadedFile.size,
      customer_note: note,
      quantity: quantity
    };
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    // Redirect to payment page
    navigate(`/payment/${result.order.order_number}`);
  } catch (error) {
    console.error('Submit order failed:', error);
  }
};
```

### **Upload Payment Proof**

```javascript
// Frontend: PaymentPage.jsx
const handlePaymentProofUpload = async (file) => {
  try {
    setUploading(true);
    
    // Upload to Cloudinary
    const result = await uploadPaymentProof(file);
    
    // Submit payment with proof
    await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_method: 'bank_transfer',
        bank_name: selectedBank,
        amount: totalAmount,
        payment_proof_url: result.file.url,
        payment_proof_public_id: result.file.public_id
      })
    });
    
    setUploading(false);
    // Show success message
  } catch (error) {
    console.error('Upload payment proof failed:', error);
    setUploading(false);
  }
};
```

---

## 🔐 Security Best Practices

### 1. **File Validation**
```javascript
const validateFile = (file, type) => {
  const maxSize = type === 'design' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB or 5MB
  const allowedTypes = type === 'design' 
    ? ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']
    : ['image/jpeg', 'image/png', 'application/pdf'];
  
  if (file.size > maxSize) {
    throw new Error(`File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipe file tidak didukung');
  }
  
  return true;
};
```

### 2. **Signed URLs** (untuk private files)
```javascript
// Generate signed URL dengan expiration
const getSignedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  });
};
```

### 3. **Access Control**
```javascript
// Middleware untuk check ownership
const checkOrderOwnership = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  next();
};
```

---

## 📝 Environment Variables

```env
# .env (Backend)

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ImgBB (Alternative)
IMGBB_API_KEY=your_imgbb_key

# AWS S3 (Alternative)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=benua-kertas-uploads
```

---

## 🚀 Next Steps

1. **Pilih provider** (Rekomendasi: Cloudinary)
2. **Setup account** dan dapatkan API credentials
3. **Install dependencies** di backend
4. **Implement upload middleware** di backend
5. **Create API endpoints** untuk upload
6. **Update frontend** untuk integrate dengan API
7. **Update database schema** untuk menyimpan file URLs
8. **Testing** upload flow
9. **Deploy** dan monitor usage

---

## 📚 Resources

### Cloudinary
- Docs: https://cloudinary.com/documentation
- Node.js SDK: https://cloudinary.com/documentation/node_integration
- React SDK: https://cloudinary.com/documentation/react_integration

### AWS S3
- Docs: https://docs.aws.amazon.com/s3/
- SDK: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/

### ImgBB
- API Docs: https://api.imgbb.com/

---

**Recommendation**: Gunakan **Cloudinary** untuk kemudahan, fitur lengkap, dan free tier yang generous. Perfect untuk startup dan production-ready!

**Last Updated**: May 30, 2026
**Version**: 1.0
