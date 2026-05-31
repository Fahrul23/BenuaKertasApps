# 🚀 Admin Dashboard - Quick Start Guide

## 📋 Overview

Admin Dashboard untuk mengelola master data Box Model dengan fitur CRUD lengkap.

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| **Admin Dashboard** | http://localhost:5173/admin/box-models |
| **API Base** | http://localhost:5000/api/v1/master-data |
| **Server Health** | http://localhost:5000/api/health |

---

## 🚀 Quick Start

### 1. Start Server
```bash
cd server
npm run dev
```
✅ Server running on http://localhost:5000

### 2. Start Client
```bash
cd client
npm run dev
```
✅ Client running on http://localhost:5173

### 3. Access Admin Dashboard
Open browser: **http://localhost:5173/admin/box-models**

---

## 🎯 Features

### ✅ View All Box Models
- Display all box models in table
- Show ID, Code, Name, Description, Base Price, Status
- Status badge (Active/Inactive)

### ✅ Search
- Search by name or code
- Real-time filtering

### ✅ Create New Box Model
1. Click "Add New Box Model" button
2. Fill form:
   - **Code** (required): e.g., "new-box"
   - **Name** (required): e.g., "New Box Model"
   - **Description** (optional)
   - **Image URL** (optional): e.g., "/assets/new-box.svg"
   - **Base Price** (optional): e.g., 5000
   - **Active** (checkbox)
3. Click "Create"

### ✅ Edit Box Model
1. Click edit icon (blue pencil) on any row
2. Update fields
3. Click "Update"

### ✅ Toggle Status
1. Click power icon (orange/green) on any row
2. Status toggles between Active/Inactive

### ✅ Delete Box Model
1. Click delete icon (red trash) on any row
2. Confirm deletion in modal
3. Box model deleted

---

## 📡 API Endpoints

### Get All Box Models (Admin)
```bash
GET /api/v1/master-data/box-models/all
```

### Get Active Box Models (Public)
```bash
GET /api/v1/master-data/box-models
```

### Get Box Model by ID
```bash
GET /api/v1/master-data/box-models/:id
```

### Create Box Model
```bash
POST /api/v1/master-data/box-models
Content-Type: application/json

{
  "code": "new-box",
  "name": "New Box Model",
  "description": "Description here",
  "imageUrl": "/assets/new-box.svg",
  "basePrice": 5000,
  "isActive": true
}
```

### Update Box Model
```bash
PUT /api/v1/master-data/box-models/:id
Content-Type: application/json

{
  "code": "new-box",
  "name": "Updated Name",
  "description": "Updated description",
  "imageUrl": "/assets/new-box.svg",
  "basePrice": 5500,
  "isActive": true
}
```

### Delete Box Model
```bash
DELETE /api/v1/master-data/box-models/:id
```

### Toggle Status
```bash
PATCH /api/v1/master-data/box-models/:id/toggle
```

---

## 🧪 Testing with cURL

### Get All Box Models
```bash
curl http://localhost:5000/api/v1/master-data/box-models/all
```

### Create New Box Model
```bash
curl -X POST http://localhost:5000/api/v1/master-data/box-models \
  -H "Content-Type: application/json" \
  -d '{
    "code": "test-box",
    "name": "Test Box",
    "description": "Test description",
    "imageUrl": "/assets/test-box.svg",
    "basePrice": 6000,
    "isActive": true
  }'
```

### Update Box Model
```bash
curl -X PUT http://localhost:5000/api/v1/master-data/box-models/1 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "earlock-box-depan",
    "name": "Earlock Box Depan Updated",
    "description": "Updated description",
    "imageUrl": "/assets/earlock-box-depan.svg",
    "basePrice": 5500,
    "isActive": true
  }'
```

### Toggle Status
```bash
curl -X PATCH http://localhost:5000/api/v1/master-data/box-models/1/toggle
```

### Delete Box Model
```bash
curl -X DELETE http://localhost:5000/api/v1/master-data/box-models/7
```

---

## 📁 Key Files

### Backend
```
server/
├── src/
│   ├── services/masterData.service.js      # CRUD logic
│   ├── controllers/masterData.controller.js # API handlers
│   └── routes/masterData.routes.js         # Routes
```

### Frontend
```
client/
├── src/
│   ├── services/api.js                     # API calls
│   ├── pages/admin/BoxModelManagementPage/
│   │   ├── BoxModelManagementPage.jsx      # Main page
│   │   └── components/
│   │       ├── BoxModelModal.jsx           # Create/Edit modal
│   │       └── DeleteConfirmModal.jsx      # Delete confirmation
│   └── router/index.jsx                    # Routes
└── .env                                    # API URL config
```

---

## 🎨 UI Components

### Main Page
- **Header**: Title and description
- **Search Bar**: Filter by name or code
- **Add Button**: Create new box model
- **Table**: Display all box models
- **Actions**: Edit, Toggle, Delete buttons

### Create/Edit Modal
- **Form**: All box model fields
- **Validation**: Required fields marked
- **Buttons**: Cancel / Create or Update

### Delete Confirmation
- **Warning**: Show box model details
- **Buttons**: Cancel / Delete

---

## 🔧 Troubleshooting

### Server not starting
```bash
cd server
npm install
npx prisma generate
npm run dev
```

### Client not starting
```bash
cd client
npm install
npm run dev
```

### API returns 404
- Check server is running on port 5000
- Check .env file exists in client folder
- Check VITE_API_URL is correct

### Data not loading
- Open browser console (F12)
- Check for errors
- Verify API endpoint is correct
- Check server logs

---

## 💡 Tips

1. **Always test API first** with curl before testing UI
2. **Check browser console** for errors
3. **Check server logs** for backend errors
4. **Use search** to find specific box models
5. **Confirm before delete** to avoid accidents

---

## 🎯 Current Data

**Box Models (6):**
1. Earlock Box Depan (Rp 5,000)
2. Earlock Box Samping (Rp 5,200)
3. Top Bottom Box (Rp 6,000)
4. Lunch Box (Rp 4,800)
5. Clamshell Box (Rp 5,300)
6. Tray Box (Rp 4,200)

---

## 🚀 Next Steps

1. **Test all CRUD operations** in UI
2. **Add authentication** for production
3. **Add more master data pages**:
   - Materials
   - Finishing Options
   - Pricing Rules
   - Bank Accounts
4. **Improve UI**:
   - Toast notifications
   - Pagination
   - Sorting
   - Export to CSV

---

## 📞 Support

**Documentation:**
- `ADMIN_DASHBOARD_COMPLETE.md` - Full documentation
- `MASTER_DATA_API_COMPLETE.md` - API documentation
- `PROJECT_STATUS_SUMMARY.md` - Project overview

**Status:**
- ✅ Backend API: 8 endpoints working
- ✅ Frontend UI: Full CRUD interface
- ✅ Integration: Connected and tested

---

**Date**: May 31, 2026  
**Status**: ✅ Ready to Use  
**URL**: http://localhost:5173/admin/box-models

