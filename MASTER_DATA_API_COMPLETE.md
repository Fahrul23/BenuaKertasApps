# ✅ Master Data API Complete!

## 📋 Summary

Backend API untuk Master Data Custom Order System **BERHASIL DIBUAT DAN DITEST**!

---

## 🎉 Yang Sudah Dibuat

### 1. **Service Layer** ✅
**File**: `server/src/services/masterData.service.js`

**Functions:**
- `getActiveBoxModels()` - Get all active box models
- `getBoxModelByCode(code)` - Get box model by code
- `getActiveMaterials()` - Get all active materials
- `getMaterialByCode(code)` - Get material by code
- `getMaterialPrice(code, thickness)` - Get material price by thickness
- `getActiveFinishingOptions()` - Get all active finishing options
- `getFinishingOptionByCode(code)` - Get finishing option by code
- `getActivePricingRules()` - Get all active pricing rules
- `getPricingRuleByQuantity(quantity)` - Get pricing rule by quantity
- `getActiveBankAccounts()` - Get all active bank accounts
- `calculateOrderPrice(orderData)` - Calculate order price with discount

---

### 2. **Controller Layer** ✅
**File**: `server/src/controllers/masterData.controller.js`

**Endpoints:**
- `getBoxModels` - GET /api/v1/master-data/box-models
- `getBoxModelByCode` - GET /api/v1/master-data/box-models/:code
- `getMaterials` - GET /api/v1/master-data/materials
- `getMaterialByCode` - GET /api/v1/master-data/materials/:code
- `getFinishingOptions` - GET /api/v1/master-data/finishing-options
- `getFinishingOptionByCode` - GET /api/v1/master-data/finishing-options/:code
- `getPricingRules` - GET /api/v1/master-data/pricing-rules
- `getBankAccounts` - GET /api/v1/master-data/bank-accounts
- `calculatePrice` - POST /api/v1/master-data/calculate-price

---

### 3. **Routes** ✅
**File**: `server/src/routes/masterData.routes.js`

All routes registered with base path: `/api/v1/master-data`

---

### 4. **App Integration** ✅
**File**: `server/src/app.js`

Master data routes registered:
```javascript
app.use('/api/v1/master-data', masterDataRoutes);
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1/master-data
```

---

### 1. Box Models

#### Get All Box Models
```http
GET /api/v1/master-data/box-models
```

**Response:**
```json
{
  "success": true,
  "message": "Box models retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "earlock-box-depan",
      "name": "Earlock Box Depan",
      "description": "Box dengan lock di bagian depan untuk kemudahan akses",
      "imageUrl": "/assets/earlock-box-depan.svg",
      "basePrice": "5000"
    },
    ...
  ]
}
```

#### Get Box Model by Code
```http
GET /api/v1/master-data/box-models/:code
```

**Example:**
```http
GET /api/v1/master-data/box-models/earlock-box-depan
```

---

### 2. Materials

#### Get All Materials
```http
GET /api/v1/master-data/materials
```

**Response:**
```json
{
  "success": true,
  "message": "Materials retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "duplex",
      "name": "Duplex",
      "description": "Kertas duplex berkualitas tinggi dengan permukaan halus",
      "imageUrl": "/assets/duplex.svg",
      "price300gsm": "450",
      "price350gsm": "520",
      "price400gsm": "600",
      "price450gsm": "680"
    },
    ...
  ]
}
```

#### Get Material by Code
```http
GET /api/v1/master-data/materials/:code
```

**Example:**
```http
GET /api/v1/master-data/materials/duplex
```

---

### 3. Finishing Options

#### Get All Finishing Options
```http
GET /api/v1/master-data/finishing-options
```

**Response:**
```json
{
  "success": true,
  "message": "Finishing options retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "glossy",
      "name": "Glossy",
      "description": "Laminasi glossy mengkilap untuk tampilan premium",
      "imageUrl": "/assets/glossy.svg",
      "additionalPrice": "800"
    },
    ...
  ]
}
```

#### Get Finishing Option by Code
```http
GET /api/v1/master-data/finishing-options/:code
```

**Example:**
```http
GET /api/v1/master-data/finishing-options/glossy
```

---

### 4. Pricing Rules

#### Get All Pricing Rules
```http
GET /api/v1/master-data/pricing-rules
```

**Response:**
```json
{
  "success": true,
  "message": "Pricing rules retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Standard Pricing",
      "minQuantity": 1000,
      "maxQuantity": 2999,
      "minTotalArea": null,
      "maxTotalArea": null,
      "pricePerUnit": "0",
      "discountPercent": "0"
    },
    {
      "id": 2,
      "name": "Bulk Discount 5%",
      "minQuantity": 3000,
      "maxQuantity": 4999,
      "minTotalArea": null,
      "maxTotalArea": null,
      "pricePerUnit": "0",
      "discountPercent": "5"
    },
    {
      "id": 3,
      "name": "Bulk Discount 10%",
      "minQuantity": 5000,
      "maxQuantity": null,
      "minTotalArea": null,
      "maxTotalArea": null,
      "pricePerUnit": "0",
      "discountPercent": "10"
    }
  ]
}
```

---

### 5. Bank Accounts

#### Get All Bank Accounts
```http
GET /api/v1/master-data/bank-accounts
```

**Response:**
```json
{
  "success": true,
  "message": "Bank accounts retrieved successfully",
  "data": [
    {
      "id": 1,
      "bankName": "Bank BCA",
      "accountNumber": "1234567890",
      "accountHolderName": "PT Benua Kertas Indonesia",
      "branch": "KCP Jakarta Pusat"
    },
    ...
  ]
}
```

---

### 6. Calculate Price

#### Calculate Order Price
```http
POST /api/v1/master-data/calculate-price
```

**Request Body:**
```json
{
  "boxModel": "earlock-box-depan",
  "length": 20,
  "width": 15,
  "height": 10,
  "heightLid": 0,
  "material": "duplex",
  "thickness": 350,
  "finishing": "glossy",
  "quantity": 2000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price calculated successfully",
  "data": {
    "basePrice": 5000,
    "materialPrice": 520,
    "finishingPrice": 800,
    "totalArea": "1900.00",
    "totalAreaM2": "0.1900",
    "pricePerUnit": "1200.80",
    "quantity": 2000,
    "subtotal": "2401600.00",
    "discountPercent": 0,
    "discountAmount": "0.00",
    "subtotalAfterDiscount": "2401600.00",
    "tax": "264176.00",
    "totalAmount": "2665776.00",
    "pricingRule": {
      "name": "Standard Pricing",
      "minQuantity": 1000,
      "maxQuantity": 2999
    }
  }
}
```

**Price Calculation Formula:**
1. **Total Area (cm²)** = (length × width × 2) + (length × height × 2) + (width × height × 2)
2. **Total Area (m²)** = Total Area (cm²) / 10000
3. **Price Per Unit** = (basePrice + materialPrice + finishingPrice) × Total Area (m²)
4. **Subtotal** = Price Per Unit × Quantity
5. **Discount** = Subtotal × (Discount Percent / 100)
6. **Subtotal After Discount** = Subtotal - Discount
7. **Tax (PPN 11%)** = Subtotal After Discount × 0.11
8. **Total Amount** = Subtotal After Discount + Tax

**Example with Discount (5000 pcs):**
```json
{
  "boxModel": "earlock-box-depan",
  "length": 20,
  "width": 15,
  "height": 10,
  "material": "duplex",
  "thickness": 350,
  "finishing": "glossy",
  "quantity": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price calculated successfully",
  "data": {
    "basePrice": 5000,
    "materialPrice": 520,
    "finishingPrice": 800,
    "totalArea": "1900.00",
    "totalAreaM2": "0.1900",
    "pricePerUnit": "1200.80",
    "quantity": 5000,
    "subtotal": "6004000.00",
    "discountPercent": 10,
    "discountAmount": "600400.00",
    "subtotalAfterDiscount": "5403600.00",
    "tax": "594396.00",
    "totalAmount": "5997996.00",
    "pricingRule": {
      "name": "Bulk Discount 10%",
      "minQuantity": 5000,
      "maxQuantity": null
    }
  }
}
```

---

## 🧪 Testing API

### Using cURL (PowerShell)
```powershell
# Get box models
curl http://localhost:5000/api/v1/master-data/box-models

# Get materials
curl http://localhost:5000/api/v1/master-data/materials

# Get finishing options
curl http://localhost:5000/api/v1/master-data/finishing-options

# Get pricing rules
curl http://localhost:5000/api/v1/master-data/pricing-rules

# Get bank accounts
curl http://localhost:5000/api/v1/master-data/bank-accounts

# Calculate price
curl -X POST http://localhost:5000/api/v1/master-data/calculate-price `
  -H "Content-Type: application/json" `
  -d '{\"boxModel\":\"earlock-box-depan\",\"length\":20,\"width\":15,\"height\":10,\"material\":\"duplex\",\"thickness\":350,\"finishing\":\"glossy\",\"quantity\":2000}'
```

### Using JavaScript (Fetch API)
```javascript
// Get box models
const boxModels = await fetch('http://localhost:5000/api/v1/master-data/box-models')
  .then(res => res.json());

// Get materials
const materials = await fetch('http://localhost:5000/api/v1/master-data/materials')
  .then(res => res.json());

// Calculate price
const priceData = await fetch('http://localhost:5000/api/v1/master-data/calculate-price', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    boxModel: 'earlock-box-depan',
    length: 20,
    width: 15,
    height: 10,
    material: 'duplex',
    thickness: 350,
    finishing: 'glossy',
    quantity: 2000
  })
}).then(res => res.json());
```

---

## 🔄 Frontend Integration

### 1. Update ModelStep.jsx
```javascript
import { useState, useEffect } from 'react';

const ModelStep = ({ selectedModel, onModelSelect }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/master-data/box-models');
        const data = await response.json();
        if (data.success) {
          setModels(data.data);
        }
      } catch (error) {
        console.error('Error fetching box models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Render models */}
      {models.map(model => (
        <div key={model.id} onClick={() => onModelSelect(model.code)}>
          <img src={model.imageUrl} alt={model.name} />
          <p>{model.name}</p>
        </div>
      ))}
    </div>
  );
};
```

### 2. Update MaterialStep.jsx
```javascript
import { useState, useEffect } from 'react';

const MaterialStep = ({ selectedMaterial, selectedThickness, onMaterialSelect, onThicknessSelect }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/master-data/materials');
        const data = await response.json();
        if (data.success) {
          setMaterials(data.data);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Render materials */}
      {materials.map(material => (
        <div key={material.id} onClick={() => onMaterialSelect(material.code)}>
          <img src={material.imageUrl} alt={material.name} />
          <p>{material.name}</p>
          <p>300gsm: Rp {material.price300gsm}</p>
          <p>350gsm: Rp {material.price350gsm}</p>
          <p>400gsm: Rp {material.price400gsm}</p>
          <p>450gsm: Rp {material.price450gsm}</p>
        </div>
      ))}
    </div>
  );
};
```

### 3. Update FinishingStep.jsx
```javascript
import { useState, useEffect } from 'react';

const FinishingStep = ({ selectedFinishing, onFinishingSelect }) => {
  const [finishingOptions, setFinishingOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinishingOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/master-data/finishing-options');
        const data = await response.json();
        if (data.success) {
          setFinishingOptions(data.data);
        }
      } catch (error) {
        console.error('Error fetching finishing options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishingOptions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Render finishing options */}
      {finishingOptions.map(option => (
        <div key={option.id} onClick={() => onFinishingSelect(option.code)}>
          <img src={option.imageUrl} alt={option.name} />
          <p>{option.name}</p>
          <p>+Rp {option.additionalPrice}</p>
        </div>
      ))}
    </div>
  );
};
```

### 4. Add Price Calculation in ReviewStep.jsx
```javascript
import { useState, useEffect } from 'react';

const ReviewStep = ({ orderData }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculatePrice = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/master-data/calculate-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boxModel: orderData.selectedModel,
            length: orderData.sizes.panjang,
            width: orderData.sizes.lebar,
            height: orderData.sizes.tinggi,
            heightLid: orderData.sizes.tinggiTutup || 0,
            material: orderData.selectedMaterial,
            thickness: orderData.selectedThickness,
            finishing: orderData.selectedFinishing,
            quantity: orderData.quantity
          })
        });
        const data = await response.json();
        if (data.success) {
          setPriceData(data.data);
        }
      } catch (error) {
        console.error('Error calculating price:', error);
      } finally {
        setLoading(false);
      }
    };

    calculatePrice();
  }, [orderData]);

  if (loading) return <div>Calculating price...</div>;

  return (
    <div>
      <h2>Order Summary</h2>
      <p>Subtotal: Rp {priceData.subtotal}</p>
      {priceData.discountPercent > 0 && (
        <p>Discount ({priceData.discountPercent}%): -Rp {priceData.discountAmount}</p>
      )}
      <p>Tax (PPN 11%): Rp {priceData.tax}</p>
      <h3>Total: Rp {priceData.totalAmount}</h3>
    </div>
  );
};
```

---

## 📝 Environment Variables

Make sure `.env` file has:
```env
DATABASE_URL="mysql://root:root@localhost:3306/benua_kertas_db"
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## ✅ Checklist

- [x] Service layer created
- [x] Controller layer created
- [x] Routes created
- [x] Routes registered in app.js
- [x] Server running successfully
- [x] API endpoints tested
- [x] Box models endpoint working
- [x] Materials endpoint working
- [x] Finishing options endpoint working
- [x] Pricing rules endpoint working
- [x] Bank accounts endpoint working
- [x] Price calculation endpoint working
- [ ] Frontend updated to use API
- [ ] Error handling improved
- [ ] API documentation created
- [ ] Postman collection created (optional)

---

## 🎯 Next Steps

### 1. **Update Frontend Components** (Priority)
- Update `ModelStep.jsx` to fetch from API
- Update `MaterialStep.jsx` to fetch from API
- Update `FinishingStep.jsx` to fetch from API
- Update `ReviewStep.jsx` to calculate price from API
- Add loading states
- Add error handling

### 2. **Create Order API** (Next Phase)
- Create order service
- Create order controller
- Create order routes
- Handle file uploads (design file)
- Generate order number
- Save order to database

### 3. **Create Payment API** (Next Phase)
- Create payment service
- Create payment controller
- Create payment routes
- Handle payment proof upload
- Payment verification by admin

### 4. **Admin Dashboard** (Future)
- CRUD for master data
- Order management
- Payment verification
- Reports

---

## 🎉 Status

**✅ MASTER DATA API COMPLETE & TESTED**

Backend API siap digunakan untuk:
- ✅ Fetch box models dynamically
- ✅ Fetch materials with prices
- ✅ Fetch finishing options
- ✅ Calculate order price with discount
- ✅ Get bank accounts for payment

**Ready untuk:**
- Frontend integration
- Order creation API
- Payment API
- Admin dashboard

---

**Date**: May 31, 2026
**Status**: ✅ Complete & Tested
**Server**: Running on http://localhost:5000
**API Base**: /api/v1/master-data

