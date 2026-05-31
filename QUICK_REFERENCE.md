# 🚀 Quick Reference - Custom Order System

## 📊 Current Status
✅ Backend API Complete | ✅ Database Ready | ⏳ Frontend Integration Pending

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **Server** | http://localhost:5000 |
| **Client** | http://localhost:5173 |
| **Health Check** | http://localhost:5000/api/health |
| **Prisma Studio** | http://localhost:5555 |
| **API Base** | http://localhost:5000/api/v1 |

---

## 🗄️ Database

**Database**: `benua_kertas_db`  
**User**: `root`  
**Password**: `root`  
**Port**: `3306`

### Tables (8)
1. `orders` - Main orders table
2. `payments` - Payment records
3. `bank_accounts` - Company bank accounts
4. `order_history` - Order audit log
5. `box_models` - Box model master data (6 records)
6. `materials` - Material master data (3 records)
7. `finishing_options` - Finishing master data (6 records)
8. `pricing_rules` - Pricing rules (3 records)

### Seeded Data
- **Users**: 2 (admin@benuakertas.com, user@benuakertas.com)
- **Master Data**: 18 records

---

## 🔌 API Endpoints

### Master Data
```
GET    /api/v1/master-data/box-models
GET    /api/v1/master-data/box-models/:code
GET    /api/v1/master-data/materials
GET    /api/v1/master-data/materials/:code
GET    /api/v1/master-data/finishing-options
GET    /api/v1/master-data/finishing-options/:code
GET    /api/v1/master-data/pricing-rules
GET    /api/v1/master-data/bank-accounts
POST   /api/v1/master-data/calculate-price
```

### Quick Test
```bash
# Get box models
curl http://localhost:5000/api/v1/master-data/box-models

# Calculate price
curl -X POST http://localhost:5000/api/v1/master-data/calculate-price \
  -H "Content-Type: application/json" \
  -d '{"boxModel":"earlock-box-depan","length":20,"width":15,"height":10,"material":"duplex","thickness":350,"finishing":"glossy","quantity":2000}'
```

---

## 💻 Commands

### Server
```bash
cd server
npm run dev              # Start server
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Run migration
node prisma/seed-simple.js           # Seed users
node prisma/seed-master-data.js      # Seed master data
```

### Client
```bash
cd client
npm run dev              # Start client
npm run build            # Build for production
```

---

## 📁 Key Files

### Backend
```
server/
├── src/
│   ├── services/masterData.service.js    ✅ Master data logic
│   ├── controllers/masterData.controller.js  ✅ API handlers
│   ├── routes/masterData.routes.js       ✅ API routes
│   └── app.js                            ✅ Express app
├── prisma/
│   ├── schema.prisma                     ✅ Database schema
│   ├── seed-simple.js                    ✅ User seeder
│   └── seed-master-data.js               ✅ Master data seeder
└── server.js                             ✅ Server entry
```

### Frontend
```
client/
└── src/
    ├── pages/CustomOrderPage/
    │   ├── CustomOrderPage.jsx           ✅ Main page
    │   └── components/
    │       ├── ModelStep.jsx             ✅ Step 1
    │       ├── SizeStep.jsx              ✅ Step 2
    │       ├── MaterialStep.jsx          ✅ Step 3
    │       ├── ColorStep.jsx             ✅ Step 4
    │       ├── FinishingStep.jsx         ✅ Step 5
    │       ├── UploadStep.jsx            ✅ Step 6
    │       ├── QuantityStep.jsx          ✅ Step 7
    │       └── ReviewStep.jsx            ✅ Step 8
    └── services/
        └── api.js                        ⏳ To be created
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| `PROJECT_STATUS_SUMMARY.md` | Complete project status |
| `MASTER_DATA_API_COMPLETE.md` | API documentation |
| `NEXT_STEPS.md` | Development roadmap |
| `CUSTOM_ORDER_DATABASE_SCHEMA.md` | Database schema |
| `MASTER_DATA_COMPLETE.md` | Master data summary |
| `QUICK_REFERENCE.md` | This file |

---

## 🎯 Next Steps (Priority Order)

### 1. Frontend Integration (1-2 days)
- [ ] Create `client/src/services/api.js`
- [ ] Create `client/.env` with `VITE_API_URL`
- [ ] Update `ModelStep.jsx` to fetch from API
- [ ] Update `MaterialStep.jsx` to fetch from API
- [ ] Update `FinishingStep.jsx` to fetch from API
- [ ] Update `ReviewStep.jsx` to calculate price from API

### 2. Order Creation API (1 day)
- [ ] Create order service, controller, routes
- [ ] Handle file upload (Cloudinary)
- [ ] Generate order number

### 3. Payment API (1 day)
- [ ] Create payment service, controller, routes
- [ ] Handle payment proof upload
- [ ] Payment verification

---

## 💰 Price Calculation

### Formula
```
Total Area (m²) = [(P×L×2) + (P×T×2) + (L×T×2)] / 10000
Price Per Unit = (Base + Material + Finishing) × Total Area
Subtotal = Price Per Unit × Quantity
Discount = Subtotal × (Discount% / 100)
Tax = (Subtotal - Discount) × 0.11
Total = Subtotal - Discount + Tax
```

### Discount Rules
- 1000-2999 pcs: 0%
- 3000-4999 pcs: 5%
- 5000+ pcs: 10%

---

## 🔐 Login Credentials

### Admin
```
Email: admin@benuakertas.com
Password: admin123
```

### User
```
Email: user@benuakertas.com
Password: user123
```

---

## 🧪 Test Data

### Box Models (6)
- earlock-box-depan (Rp 5,000)
- earlock-box-samping (Rp 5,200)
- top-bottom-box (Rp 6,000)
- lunch-box (Rp 4,800)
- clamshell-box (Rp 5,300)
- tray-box (Rp 4,200)

### Materials (3)
**Duplex**: 300gsm (Rp 450), 350gsm (Rp 520), 400gsm (Rp 600), 450gsm (Rp 680)  
**Ivory**: 300gsm (Rp 550), 350gsm (Rp 630), 400gsm (Rp 720), 450gsm (Rp 810)  
**Kraft**: 300gsm (Rp 380), 350gsm (Rp 440), 400gsm (Rp 510), 450gsm (Rp 580)

### Finishing Options (6)
- glossy (+Rp 800)
- doff (+Rp 850)
- sisi-luar (+Rp 600)
- dalam (+Rp 600)
- luar-dalam (+Rp 1,200)
- tanpa-laminasi (+Rp 0)

---

## 🚨 Troubleshooting

### Server won't start
```bash
# Check if MySQL is running
# Check .env file exists
# Check DATABASE_URL is correct
cd server
npm install
npx prisma generate
npm run dev
```

### Database connection error
```bash
# Verify MySQL is running
# Check credentials in .env
# Test connection
cd server
node check-db.js
```

### API returns 404
```bash
# Check server is running
# Check route is registered in app.js
# Check URL is correct (include /api/v1)
```

### Prisma errors
```bash
cd server
npx prisma generate      # Regenerate client
npx prisma migrate reset # Reset database (WARNING: deletes data)
npx prisma migrate dev   # Run migrations
```

---

## 📞 Support

**Project**: Benua Kertas Custom Order System  
**Tech Stack**: React + Express + MySQL + Prisma  
**Status**: Backend Complete, Frontend Integration Pending  
**Last Updated**: May 31, 2026

---

## ✅ Quick Checklist

- [x] Database schema created
- [x] Master data seeded
- [x] Backend API created
- [x] API tested
- [x] Frontend UI created
- [ ] Frontend integrated with API
- [ ] Order creation working
- [ ] Payment submission working
- [ ] Admin dashboard

**Progress**: 60% Complete

---

**Need Help?** Check `PROJECT_STATUS_SUMMARY.md` for detailed status  
**Next Task?** Check `NEXT_STEPS.md` for roadmap  
**API Docs?** Check `MASTER_DATA_API_COMPLETE.md` for endpoints

