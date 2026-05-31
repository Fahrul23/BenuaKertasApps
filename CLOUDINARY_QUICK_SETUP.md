# 🚀 Cloudinary Quick Setup Guide

## 📋 Overview

Panduan cepat untuk setup Cloudinary di project Benua Kertas Apps.

---

## ✅ Status

- ✅ Dependencies installed
- ✅ Configuration files created
- ✅ Upload endpoints ready
- ⏳ **Need Cloudinary credentials**

---

## 🔑 Get Cloudinary Credentials (5 minutes)

### Step 1: Create Account
1. Go to: https://cloudinary.com/users/register_free
2. Fill in:
   - Email
   - Password
   - Choose "Developer" role
3. Click "Create Account"
4. Verify your email

### Step 2: Get Credentials
1. Login to: https://cloudinary.com/console
2. You'll see your **Dashboard**
3. Copy these 3 values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

### Step 3: Update .env File
Open `server/.env` and update:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

**⚠️ Replace with your actual credentials!**

### Step 4: Restart Server
```bash
# Server will auto-restart if using nodemon
# Or manually restart:
cd server
npm run dev
```

---

## 🧪 Test Upload (2 minutes)

### Test 1: Upload Design File
```bash
# Create a test file or use existing image
curl -X POST http://localhost:5000/api/v1/upload/design \
  -F "file=@test.jpg"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Design file uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/...",
    "publicId": "benua-kertas/designs/abc123",
    ...
  }
}
```

### Test 2: Upload Payment Proof
```bash
curl -X POST http://localhost:5000/api/v1/upload/payment \
  -F "file=@payment.jpg"
```

### Test 3: Upload Box Model Image
```bash
curl -X POST http://localhost:5000/api/v1/upload/box-model \
  -F "file=@box.png"
```

---

## 📡 Available Endpoints

| Endpoint | Method | Purpose | Max Size |
|----------|--------|---------|----------|
| `/api/v1/upload/design` | POST | Upload design file | 10MB |
| `/api/v1/upload/payment` | POST | Upload payment proof | 5MB |
| `/api/v1/upload/box-model` | POST | Upload box model image | 2MB |
| `/api/v1/upload/:publicId` | DELETE | Delete file | - |
| `/api/v1/upload/signature/:folder` | GET | Get upload signature | - |

---

## 🎨 Frontend Integration Example

### Upload Component (React)
```javascript
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/api/v1/upload/design', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      console.log('Uploaded URL:', data.data.url);
      console.log('Public ID:', data.data.publicId);
      // Save to database
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 📁 Cloudinary Folder Structure

```
your-cloud-name/
└── benua-kertas/
    ├── designs/          # Design files (10MB max)
    ├── payments/         # Payment proofs (5MB max)
    └── box-models/       # Box model images (2MB max)
```

---

## 💡 Quick Tips

1. **Free Tier**: 25GB storage + 25GB bandwidth/month
2. **Auto-optimization**: Images are automatically optimized
3. **Unique names**: Cloudinary generates unique filenames
4. **Store publicId**: Save publicId to database for deletion
5. **Security**: Never expose API Secret in frontend

---

## 🔧 Troubleshooting

### Error: "Invalid credentials"
- Check Cloud Name, API Key, API Secret
- Make sure no extra spaces in .env
- Restart server after updating .env

### Error: "File too large"
- Design files: max 10MB
- Payment proofs: max 5MB
- Box model images: max 2MB

### Error: "Invalid file type"
- Design: JPG, PNG, PDF, AI, PSD, SVG
- Payment: JPG, PNG only
- Box model: JPG, PNG, SVG

---

## 📚 Documentation

- **Full Setup**: `CLOUDINARY_SETUP_COMPLETE.md`
- **API Docs**: `MASTER_DATA_API_COMPLETE.md`
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## ✅ Checklist

- [ ] Create Cloudinary account
- [ ] Get credentials from dashboard
- [ ] Update `.env` file
- [ ] Restart server
- [ ] Test upload endpoints
- [ ] Integrate with frontend

---

## 🎉 Next Steps

1. **Get Cloudinary credentials** (5 min)
2. **Update .env file** (1 min)
3. **Test upload** (2 min)
4. **Integrate with frontend** (30 min)

---

**Date**: May 31, 2026  
**Status**: ✅ Ready (Need Credentials)  
**Time to Complete**: ~10 minutes

