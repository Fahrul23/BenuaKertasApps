# 🚀 Next Steps - Custom Order System

## 📋 Current Status

✅ **Database Schema**: Complete (8 tables)
✅ **Master Data Seeded**: Complete (18 records)
✅ **Backend API**: Complete & Tested
✅ **Frontend UI**: Complete (8 steps with hardcoded data)
✅ **Server**: Running on http://localhost:5000

---

## 🎯 Phase 1: Frontend Integration (PRIORITY)

### Goal
Update frontend components to fetch data from API instead of using hardcoded values.

### Tasks

#### 1. Create API Service Layer
**File**: `client/src/services/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const masterDataAPI = {
  // Box Models
  getBoxModels: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models`);
    return response.json();
  },

  // Materials
  getMaterials: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials`);
    return response.json();
  },

  // Finishing Options
  getFinishingOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options`);
    return response.json();
  },

  // Pricing Rules
  getPricingRules: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules`);
    return response.json();
  },

  // Calculate Price
  calculatePrice: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/master-data/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  // Bank Accounts
  getBankAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts`);
    return response.json();
  }
};
```

#### 2. Update ModelStep.jsx
**File**: `client/src/pages/CustomOrderPage/components/ModelStep.jsx`

**Changes:**
- Remove hardcoded models
- Add `useState` and `useEffect` to fetch from API
- Add loading state
- Add error handling
- Map API response to component format

**Key Points:**
- API returns `code` field, use it as model ID
- API returns `imageUrl`, but you may need to map to local assets
- Show loading spinner while fetching

#### 3. Update MaterialStep.jsx
**File**: `client/src/pages/CustomOrderPage/components/MaterialStep.jsx`

**Changes:**
- Fetch materials from API
- Display prices for each thickness (300, 350, 400, 450 gsm)
- Show material description
- Add loading state

#### 4. Update FinishingStep.jsx
**File**: `client/src/pages/CustomOrderPage/components/FinishingStep.jsx`

**Changes:**
- Fetch finishing options from API
- Display additional price for each option
- Show finishing description
- Add loading state

#### 5. Update ReviewStep.jsx
**File**: `client/src/pages/CustomOrderPage/components/ReviewStep.jsx`

**Changes:**
- Call calculate price API when component mounts
- Display calculated price breakdown:
  - Subtotal
  - Discount (if applicable)
  - Tax (PPN 11%)
  - Total Amount
- Show pricing rule applied (e.g., "Bulk Discount 5%")
- Add loading state for price calculation

#### 6. Create .env File
**File**: `client/.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🎯 Phase 2: Order Creation API

### Goal
Create backend API to handle order creation and save to database.

### Tasks

#### 1. Create Order Service
**File**: `server/src/services/order.service.js`

**Functions:**
- `generateOrderNumber()` - Generate unique order number (ORD-YYYY-MM-DD-XXXX)
- `createOrder(orderData)` - Create new order in database
- `getOrderById(orderId)` - Get order by ID
- `getOrderByNumber(orderNumber)` - Get order by order number
- `getUserOrders(userId)` - Get all orders for a user
- `updateOrderStatus(orderId, status)` - Update order status

#### 2. Create Order Controller
**File**: `server/src/controllers/order.controller.js`

**Endpoints:**
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders/number/:orderNumber` - Get order by number
- `GET /api/v1/orders/user/:userId` - Get user orders
- `PATCH /api/v1/orders/:id/status` - Update order status

#### 3. Create Order Routes
**File**: `server/src/routes/order.routes.js`

Register routes in `app.js`:
```javascript
app.use('/api/v1/orders', orderRoutes);
```

#### 4. Handle File Upload (Design File)
**Options:**
- **Cloudinary** (Recommended) - See `FILE_UPLOAD_STRATEGY.md`
- **Local Storage** - Save to `server/uploads/designs/`

**Required:**
- Install multer for file upload
- Configure Cloudinary (if using)
- Add file validation (size, type)
- Store file URL in database

---

## 🎯 Phase 3: Payment API

### Goal
Create backend API to handle payment submission and verification.

### Tasks

#### 1. Create Payment Service
**File**: `server/src/services/payment.service.js`

**Functions:**
- `generatePaymentNumber()` - Generate unique payment number (PAY-YYYY-MM-DD-XXXX)
- `createPayment(paymentData)` - Create new payment record
- `getPaymentById(paymentId)` - Get payment by ID
- `getPaymentByOrderId(orderId)` - Get payment by order ID
- `verifyPayment(paymentId, verifiedBy)` - Verify payment (admin only)
- `rejectPayment(paymentId, reason, verifiedBy)` - Reject payment (admin only)

#### 2. Create Payment Controller
**File**: `server/src/controllers/payment.controller.js`

**Endpoints:**
- `POST /api/v1/payments` - Submit payment proof
- `GET /api/v1/payments/:id` - Get payment by ID
- `GET /api/v1/payments/order/:orderId` - Get payment by order ID
- `PATCH /api/v1/payments/:id/verify` - Verify payment (admin)
- `PATCH /api/v1/payments/:id/reject` - Reject payment (admin)

#### 3. Create Payment Routes
**File**: `server/src/routes/payment.routes.js`

Register routes in `app.js`:
```javascript
app.use('/api/v1/payments', paymentRoutes);
```

#### 4. Handle Payment Proof Upload
**Options:**
- **Cloudinary** (Recommended)
- **Local Storage** - Save to `server/uploads/payments/`

**Required:**
- File validation (image only)
- Store file URL in database
- Update order status to 'waiting_payment'

---

## 🎯 Phase 4: Frontend Order Flow

### Goal
Complete the order submission flow in frontend.

### Tasks

#### 1. Create Order Submission
**File**: `client/src/pages/CustomOrderPage/CustomOrderPage.jsx`

**Changes:**
- Add `handleFinish()` function in step 8
- Call order creation API
- Handle success/error
- Redirect to payment page

#### 2. Create Payment Page
**File**: `client/src/pages/PaymentPage/PaymentPage.jsx`

**Features:**
- Display order summary
- Display total amount
- Display bank accounts (from API)
- Upload payment proof form
- Submit payment

#### 3. Create Order Success Page
**File**: `client/src/pages/OrderSuccessPage/OrderSuccessPage.jsx`

**Features:**
- Display order number
- Display order status
- Display payment status
- Link to order details

#### 4. Create Order Details Page
**File**: `client/src/pages/OrderDetailsPage/OrderDetailsPage.jsx`

**Features:**
- Display full order details
- Display payment status
- Display order history
- Download invoice (future)

---

## 🎯 Phase 5: Admin Dashboard

### Goal
Create admin dashboard to manage orders and payments.

### Tasks

#### 1. Order Management
**Features:**
- List all orders
- Filter by status
- Search by order number
- View order details
- Update order status
- Track production

#### 2. Payment Verification
**Features:**
- List pending payments
- View payment proof
- Verify payment
- Reject payment with reason
- Send notification to customer

#### 3. Master Data Management
**Features:**
- CRUD for box models
- CRUD for materials
- CRUD for finishing options
- CRUD for pricing rules
- CRUD for bank accounts

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `CUSTOM_ORDER_DATABASE_SCHEMA.md` | Complete database schema documentation |
| `MASTER_DATA_COMPLETE.md` | Master data tables and seeding summary |
| `MIGRATION_SUCCESS.md` | Migration success summary |
| `MASTER_DATA_API_COMPLETE.md` | API endpoints documentation |
| `FILE_UPLOAD_STRATEGY.md` | Cloudinary setup guide |
| `NEXT_STEPS.md` | This file - roadmap for next phases |

---

## 🔧 Development Commands

### Server
```bash
cd server

# Start development server
npm run dev

# Run migration
npx prisma migrate dev

# Run seeder
node prisma/seed-simple.js
node prisma/seed-master-data.js

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Client
```bash
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing Checklist

### Backend API
- [ ] GET /api/v1/master-data/box-models
- [ ] GET /api/v1/master-data/materials
- [ ] GET /api/v1/master-data/finishing-options
- [ ] GET /api/v1/master-data/pricing-rules
- [ ] GET /api/v1/master-data/bank-accounts
- [ ] POST /api/v1/master-data/calculate-price
- [ ] POST /api/v1/orders (create order)
- [ ] POST /api/v1/payments (submit payment)

### Frontend
- [ ] Step 1: Model selection from API
- [ ] Step 2: Size input validation
- [ ] Step 3: Material selection from API
- [ ] Step 4: Color selection
- [ ] Step 5: Finishing selection from API
- [ ] Step 6: File upload
- [ ] Step 7: Quantity selection
- [ ] Step 8: Review with price calculation from API
- [ ] Order submission
- [ ] Payment submission
- [ ] Order success page
- [ ] Order details page

---

## 🎯 Priority Order

1. **Frontend Integration** (1-2 days)
   - Update components to use API
   - Add loading states
   - Add error handling

2. **Order Creation API** (1 day)
   - Create order service
   - Create order controller
   - Handle file upload

3. **Payment API** (1 day)
   - Create payment service
   - Create payment controller
   - Handle payment proof upload

4. **Frontend Order Flow** (1-2 days)
   - Order submission
   - Payment page
   - Order success page
   - Order details page

5. **Admin Dashboard** (2-3 days)
   - Order management
   - Payment verification
   - Master data management

**Total Estimated Time**: 6-9 days

---

## 💡 Tips

1. **Start with Frontend Integration**
   - This will make the UI dynamic and ready for order submission
   - Test each step component individually

2. **Use Cloudinary for File Uploads**
   - Free tier is sufficient for development
   - Easier than managing local storage
   - See `FILE_UPLOAD_STRATEGY.md` for setup

3. **Test API Endpoints First**
   - Use Postman or cURL to test before frontend integration
   - Verify data format matches frontend expectations

4. **Add Loading States**
   - Show loading spinner while fetching data
   - Improve user experience

5. **Add Error Handling**
   - Show error messages if API fails
   - Provide fallback UI

6. **Use Environment Variables**
   - Don't hardcode API URLs
   - Use `.env` files for configuration

---

## 🎉 Current Achievement

✅ **Database**: 8 tables with 20 records
✅ **Backend API**: 9 endpoints working
✅ **Frontend UI**: 8-step flow complete
✅ **Server**: Running and tested

**Next**: Frontend Integration → Order API → Payment API → Admin Dashboard

---

**Date**: May 31, 2026
**Status**: Ready for Phase 1 (Frontend Integration)
**Priority**: Update frontend components to use API

