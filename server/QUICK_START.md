# Quick Start Guide - Custom Order System

## 🚀 Setup Database (5 menit)

### 1. Start MySQL Server
```bash
# Windows: Start XAMPP/WAMP
# Atau: Services -> MySQL -> Start
```

### 2. Run Migration
```bash
cd server
npx prisma migrate dev --name add_custom_order_system
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Seeder
```bash
node prisma/seed.js
```

### 5. Verify
```bash
# Check if tables created
npx prisma studio
# Atau buka MySQL dan jalankan:
# SHOW TABLES;
```

✅ **Done!** Database siap digunakan.

---

## 📊 Check Data

### Via Prisma Studio (Recommended)
```bash
npx prisma studio
```
Buka browser: http://localhost:5555

### Via MySQL
```sql
-- Check tables
SHOW TABLES;

-- Check bank accounts
SELECT * FROM bank_accounts;

-- Check users
SELECT * FROM users;
```

---

## 🧪 Test Services

### 1. Create Test File
```bash
# Create: server/test-services.js
```

```javascript
import prisma from './src/config/prisma.js';
import * as orderService from './src/services/order.service.js';
import * as bankAccountService from './src/services/bankAccount.service.js';

async function test() {
  try {
    console.log('🧪 Testing services...\n');

    // Test 1: Get bank accounts
    console.log('1. Get Bank Accounts:');
    const banks = await bankAccountService.getActiveBankAccounts();
    console.log(`✅ Found ${banks.length} active bank accounts\n`);

    // Test 2: Create order
    console.log('2. Create Order:');
    const orderData = {
      boxModel: 'earlock-box-depan',
      sizePanjang: 20,
      sizeLebar: 15,
      sizeTinggi: 10,
      material: 'duplex',
      materialThickness: 350,
      colorOption: '2-sisi',
      finishingOption: 'glossy',
      quantity: 2000,
      customerNote: 'Test order',
    };
    
    const order = await orderService.createOrder(1, orderData);
    console.log(`✅ Order created: ${order.orderNumber}`);
    console.log(`   Total: Rp ${order.totalAmount.toLocaleString('id-ID')}\n`);

    // Test 3: Get order
    console.log('3. Get Order:');
    const fetchedOrder = await orderService.getOrderByNumber(order.orderNumber);
    console.log(`✅ Order fetched: ${fetchedOrder.orderNumber}`);
    console.log(`   Status: ${fetchedOrder.orderStatus}\n`);

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
```

### 2. Run Test
```bash
node test-services.js
```

---

## 📝 Next Steps

### Option A: Implement Controllers & Routes (Recommended)
```bash
# 1. Create controllers
# server/src/controllers/order.controller.js
# server/src/controllers/payment.controller.js
# server/src/controllers/bankAccount.controller.js

# 2. Create routes
# server/src/routes/order.routes.js
# server/src/routes/payment.routes.js
# server/src/routes/bankAccount.routes.js

# 3. Register routes in app.js
# app.use('/api/orders', orderRoutes);
# app.use('/api/payments', paymentRoutes);
# app.use('/api/bank-accounts', bankAccountRoutes);
```

### Option B: Setup Cloudinary
```bash
# 1. Sign up at cloudinary.com
# 2. Get API credentials
# 3. Add to .env:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 4. Install dependencies
npm install cloudinary multer multer-storage-cloudinary

# 5. Create config
# server/src/config/cloudinary.js
# server/src/middleware/upload.js
```

### Option C: Test with Postman
```bash
# 1. Start server
npm run dev

# 2. Import Postman collection (create one)
# 3. Test endpoints:
#    - POST /api/orders
#    - GET /api/orders/:orderNumber
#    - GET /api/bank-accounts
```

---

## 🔍 Useful Commands

### Prisma Commands
```bash
# Open Prisma Studio
npx prisma studio

# Generate client
npx prisma generate

# Run migration
npx prisma migrate dev

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Format schema
npx prisma format
```

### Database Commands
```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE benua_kertas_db;

# Show tables
SHOW TABLES;

# Describe table
DESCRIBE orders;

# Count records
SELECT COUNT(*) FROM orders;
```

---

## 📚 Documentation Files

- `MIGRATION_GUIDE.md` - Panduan lengkap migration
- `IMPLEMENTATION_SUMMARY.md` - Summary implementasi
- `USEFUL_QUERIES.sql` - SQL queries berguna
- `CUSTOM_ORDER_DATABASE_SCHEMA.md` - Schema documentation
- `FILE_UPLOAD_STRATEGY.md` - Cloudinary setup guide

---

## 🐛 Troubleshooting

### Error: Can't reach database server
```bash
# Solution: Start MySQL service
# Windows: Services -> MySQL -> Start
# XAMPP: Start MySQL module
```

### Error: Database does not exist
```sql
-- Solution: Create database
CREATE DATABASE benua_kertas_db;
```

### Error: Prisma Client not generated
```bash
# Solution: Generate client
npx prisma generate
```

### Error: Migration already applied
```bash
# Solution: Reset and re-run
npx prisma migrate reset
npx prisma migrate dev
```

---

## ✅ Checklist

- [ ] MySQL server running
- [ ] Migration executed successfully
- [ ] Prisma client generated
- [ ] Seeder executed
- [ ] Bank accounts created (3 accounts)
- [ ] Test services working
- [ ] Prisma Studio accessible

---

## 🎯 What's Working Now

✅ Database schema created
✅ All tables with relations
✅ Services layer complete
✅ Helper functions ready
✅ Seed data loaded
✅ Can create orders programmatically
✅ Can query orders and payments
✅ Order history tracking

## 🔄 What's Next

⏳ Create controllers
⏳ Create routes
⏳ Setup Cloudinary
⏳ Create validation middleware
⏳ Test with Postman
⏳ Integrate with frontend

---

**Ready to code!** 🚀

Start dengan membuat controllers atau setup Cloudinary terlebih dahulu.
