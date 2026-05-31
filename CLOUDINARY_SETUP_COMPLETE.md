# ✅ Cloudinary Setup Complete!

## 📋 Summary

Cloudinary telah berhasil di-setup untuk file upload di project Benua Kertas Apps!

---

## 🎉 Yang Sudah Dibuat

### 1. **Dependencies Installed** ✅
```bash
npm install cloudinary multer multer-storage-cloudinary
```

**Packages:**
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage engine for Multer

---

### 2. **Cloudinary Configuration** ✅

**File**: `server/src/config/cloudinary.js`

**Features:**
- ✅ Cloudinary client configuration
- ✅ 3 storage configurations (design, payment, box-model)
- ✅ 3 upload middlewares with validation
- ✅ Utility functions (delete, getInfo, generateSignature)

**Storage Configurations:**

#### Design Files Storage
- **Folder**: `benua-kertas/designs`
- **Max Size**: 10MB
- **Allowed Formats**: JPG, JPEG, PNG, PDF, AI, PSD, SVG
- **Transformation**: Auto quality

#### Payment Proofs Storage
- **Folder**: `benua-kertas/payments`
- **Max Size**: 5MB
- **Allowed Formats**: JPG, JPEG, PNG
- **Transformation**: Auto quality, max width 1000px

#### Box Model Images Storage
- **Folder**: `benua-kertas/box-models`
- **Max Size**: 2MB
- **Allowed Formats**: JPG, JPEG, PNG, SVG
- **Transformation**: Auto quality, max width 500px

---

### 3. **Upload Controller** ✅

**File**: `server/src/controllers/upload.controller.js`

**Endpoints:**
- `uploadDesignFile` - POST /api/v1/upload/design
- `uploadPaymentProof` - POST /api/v1/upload/payment
- `uploadBoxModelImage` - POST /api/v1/upload/box-model
- `deleteUploadedFile` - DELETE /api/v1/upload/:publicId
- `getUploadSignature` - GET /api/v1/upload/signature/:folder

---

### 4. **Upload Routes** ✅

**File**: `server/src/routes/upload.routes.js`

All routes registered with base path: `/api/v1/upload`

---

### 5. **Environment Variables** ✅

**Files Updated:**
- `server/.env` - Added Cloudinary credentials
- `server/.env.example` - Already has Cloudinary template

**Required Variables:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

---

### 6. **App Integration** ✅

**File**: `server/src/app.js`

Upload routes registered:
```javascript
app.use('/api/v1/upload', uploadRoutes);
```

---

## 🔑 How to Get Cloudinary Credentials

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Click "Sign Up" (Free tier available)
3. Fill in your details
4. Verify your email

### Step 2: Get Your Credentials
1. Login to Cloudinary Dashboard
2. Go to Dashboard: https://cloudinary.com/console
3. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Update .env File
```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**⚠️ Important**: Never commit `.env` file to Git!

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1/upload
```

---

### 1. Upload Design File

**Endpoint:**
```
POST /api/v1/upload/design
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/v1/upload/design \
  -F "file=@/path/to/design.pdf"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/v1/upload/design', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
```

**Response:**
```json
{
  "success": true,
  "message": "Design file uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/benua-kertas/designs/abc123.pdf",
    "publicId": "benua-kertas/designs/abc123",
    "originalName": "design.pdf",
    "format": "pdf",
    "size": 1234567,
    "width": null,
    "height": null
  }
}
```

**Validation:**
- Max size: 10MB
- Allowed formats: JPG, JPEG, PNG, PDF, AI, PSD, SVG

---

### 2. Upload Payment Proof

**Endpoint:**
```
POST /api/v1/upload/payment
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/v1/upload/payment \
  -F "file=@/path/to/payment.jpg"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/v1/upload/payment', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
```

**Response:**
```json
{
  "success": true,
  "message": "Payment proof uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/benua-kertas/payments/xyz789.jpg",
    "publicId": "benua-kertas/payments/xyz789",
    "originalName": "payment.jpg",
    "format": "jpg",
    "size": 234567,
    "width": 1920,
    "height": 1080
  }
}
```

**Validation:**
- Max size: 5MB
- Allowed formats: JPG, JPEG, PNG

---

### 3. Upload Box Model Image

**Endpoint:**
```
POST /api/v1/upload/box-model
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/v1/upload/box-model \
  -F "file=@/path/to/box-model.png"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/v1/upload/box-model', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
```

**Response:**
```json
{
  "success": true,
  "message": "Box model image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/benua-kertas/box-models/def456.png",
    "publicId": "benua-kertas/box-models/def456",
    "originalName": "box-model.png",
    "format": "png",
    "size": 123456,
    "width": 500,
    "height": 500
  }
}
```

**Validation:**
- Max size: 2MB
- Allowed formats: JPG, JPEG, PNG, SVG

---

### 4. Delete File

**Endpoint:**
```
DELETE /api/v1/upload/:publicId
```

**Note**: Replace `/` in publicId with `-`

**Example:**
- Public ID: `benua-kertas/designs/abc123`
- URL: `/api/v1/upload/benua-kertas-designs-abc123`

**Example (cURL):**
```bash
curl -X DELETE http://localhost:5000/api/v1/upload/benua-kertas-designs-abc123
```

**Example (JavaScript):**
```javascript
const publicId = 'benua-kertas/designs/abc123';
const encodedPublicId = publicId.replace(/\//g, '-');

const response = await fetch(`http://localhost:5000/api/v1/upload/${encodedPublicId}`, {
  method: 'DELETE',
});

const data = await response.json();
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

### 5. Generate Upload Signature (Direct Upload)

**Endpoint:**
```
GET /api/v1/upload/signature/:folder
```

**Allowed Folders:**
- `benua-kertas/designs`
- `benua-kertas/payments`
- `benua-kertas/box-models`

**Example (cURL):**
```bash
curl http://localhost:5000/api/v1/upload/signature/benua-kertas-designs
```

**Example (JavaScript):**
```javascript
const folder = 'benua-kertas/designs';
const response = await fetch(`http://localhost:5000/api/v1/upload/signature/${folder}`);
const data = await response.json();
```

**Response:**
```json
{
  "success": true,
  "message": "Upload signature generated successfully",
  "data": {
    "signature": "abc123def456...",
    "timestamp": 1234567890,
    "cloudName": "your-cloud-name",
    "apiKey": "your-api-key",
    "folder": "benua-kertas/designs"
  }
}
```

**Use Case**: For direct upload from frontend to Cloudinary without going through backend.

---

## 🎨 Frontend Integration

### 1. Upload Design File (React Example)

```javascript
import { useState } from 'react';

const UploadDesignFile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/v1/upload/design', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedUrl(data.data.url);
        alert('File uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.ai,.psd,.svg" />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadedUrl && (
        <div>
          <p>Uploaded successfully!</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadDesignFile;
```

---

### 2. Upload with Preview

```javascript
import { useState } from 'react';

const UploadWithPreview = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/v1/upload/payment', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Payment proof uploaded!');
        // Save data.data.url and data.data.publicId to your state/database
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />}
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadWithPreview;
```

---

### 3. Delete File

```javascript
const deleteFile = async (publicId) => {
  try {
    // Replace / with - in publicId
    const encodedPublicId = publicId.replace(/\//g, '-');

    const response = await fetch(`http://localhost:5000/api/v1/upload/${encodedPublicId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      alert('File deleted successfully');
    } else {
      alert('Failed to delete file');
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete file');
  }
};

// Usage
deleteFile('benua-kertas/designs/abc123');
```

---

## 📁 File Structure

```
server/
├── src/
│   ├── config/
│   │   └── cloudinary.js              ✅ Cloudinary configuration
│   ├── controllers/
│   │   └── upload.controller.js       ✅ Upload handlers
│   ├── routes/
│   │   └── upload.routes.js           ✅ Upload routes
│   └── app.js                         ✅ Updated with upload routes
├── .env                               ✅ Updated with Cloudinary credentials
└── .env.example                       ✅ Already has Cloudinary template
```

---

## ✅ Checklist

### Backend
- [x] Dependencies installed
- [x] Cloudinary configuration created
- [x] Upload controller created
- [x] Upload routes created
- [x] Routes registered in app.js
- [x] Environment variables added
- [ ] Cloudinary credentials configured (need your credentials)

### Testing
- [ ] Test design file upload
- [ ] Test payment proof upload
- [ ] Test box model image upload
- [ ] Test file deletion
- [ ] Test upload signature generation

### Frontend
- [ ] Create upload component for design files
- [ ] Create upload component for payment proofs
- [ ] Create upload component for box model images
- [ ] Add file preview
- [ ] Add upload progress indicator
- [ ] Add error handling

---

## 🚀 Next Steps

### 1. Configure Cloudinary Credentials
1. Create Cloudinary account (free tier)
2. Get your credentials from dashboard
3. Update `.env` file with real credentials
4. Restart server

### 2. Test Upload Endpoints
```bash
# Test design upload
curl -X POST http://localhost:5000/api/v1/upload/design \
  -F "file=@test-design.pdf"

# Test payment upload
curl -X POST http://localhost:5000/api/v1/upload/payment \
  -F "file=@test-payment.jpg"

# Test box model upload
curl -X POST http://localhost:5000/api/v1/upload/box-model \
  -F "file=@test-box.png"
```

### 3. Integrate with Frontend
- Update UploadStep component to use upload API
- Update BoxModelModal to upload images
- Update PaymentPage to upload payment proofs

### 4. Update Database
When saving orders/payments, store:
- `url` - Cloudinary URL
- `publicId` - For deletion
- `originalName` - Original filename
- `format` - File format
- `size` - File size

---

## 💡 Tips

1. **Free Tier Limits**:
   - 25 GB storage
   - 25 GB bandwidth/month
   - Sufficient for development and small production

2. **File Naming**:
   - Cloudinary auto-generates unique filenames
   - Store `publicId` for deletion

3. **Security**:
   - Never expose API Secret in frontend
   - Use signed uploads for sensitive files
   - Validate file types on backend

4. **Optimization**:
   - Cloudinary auto-optimizes images
   - Use transformations for thumbnails
   - Lazy load images

5. **Error Handling**:
   - Always handle upload errors
   - Show user-friendly messages
   - Provide retry option

---

## 🔐 Security Notes

**Current Implementation:**
- File type validation on backend
- File size limits enforced
- Separate folders for different file types

**Production Recommendations:**
- Add authentication to upload endpoints
- Implement rate limiting
- Add virus scanning
- Use signed uploads
- Implement file access control

---

## 🎉 Status

**✅ CLOUDINARY SETUP COMPLETE**

**Backend**: ✅ Configuration, controllers, routes ready  
**Environment**: ⏳ Need to add real Cloudinary credentials  
**Testing**: ⏳ Ready to test after credentials added  
**Frontend**: ⏳ Ready for integration

**Next**: Add your Cloudinary credentials to `.env` and test!

---

**Date**: May 31, 2026  
**Status**: ✅ Setup Complete (Credentials Pending)  
**API Base**: /api/v1/upload

