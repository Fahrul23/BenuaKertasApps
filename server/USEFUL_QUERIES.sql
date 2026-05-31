-- ==========================================
-- USEFUL SQL QUERIES - Custom Order System
-- ==========================================

-- ==========================================
-- 1. CHECK TABLES
-- ==========================================

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE orders;
DESCRIBE payments;
DESCRIBE bank_accounts;
DESCRIBE order_history;

-- ==========================================
-- 2. ORDERS QUERIES
-- ==========================================

-- Get all orders with user info
SELECT 
  o.*,
  u.name as customer_name,
  u.email as customer_email
FROM orders o
LEFT JOIN users u ON o.userId = u.id
ORDER BY o.createdAt DESC;

-- Get orders by status
SELECT * FROM orders 
WHERE orderStatus = 'WAITING_PAYMENT'
ORDER BY createdAt DESC;

-- Get orders by payment status
SELECT * FROM orders 
WHERE paymentStatus = 'PENDING'
ORDER BY createdAt DESC;

-- Get order with all related data
SELECT 
  o.*,
  u.name as customer_name,
  u.email as customer_email,
  p.paymentNumber,
  p.paymentStatus as payment_verification_status,
  p.paidAt
FROM orders o
LEFT JOIN users u ON o.userId = u.id
LEFT JOIN payments p ON o.id = p.orderId
WHERE o.orderNumber = 'ORD-2026-05-30-0001';

-- Get orders by date range
SELECT * FROM orders
WHERE createdAt BETWEEN '2026-05-01' AND '2026-05-31'
ORDER BY createdAt DESC;

-- Get orders by user
SELECT * FROM orders
WHERE userId = 1
ORDER BY createdAt DESC;

-- Count orders by status
SELECT 
  orderStatus,
  COUNT(*) as count
FROM orders
GROUP BY orderStatus;

-- Total revenue by status
SELECT 
  orderStatus,
  SUM(totalAmount) as total_revenue,
  COUNT(*) as order_count
FROM orders
GROUP BY orderStatus;

-- ==========================================
-- 3. PAYMENTS QUERIES
-- ==========================================

-- Get all pending payments
SELECT 
  p.*,
  o.orderNumber,
  u.name as customer_name,
  u.email as customer_email
FROM payments p
LEFT JOIN orders o ON p.orderId = o.id
LEFT JOIN users u ON o.userId = u.id
WHERE p.paymentStatus = 'PENDING'
ORDER BY p.createdAt ASC;

-- Get payment with order info
SELECT 
  p.*,
  o.orderNumber,
  o.totalAmount as order_total,
  u.name as customer_name,
  u.email as customer_email,
  v.name as verified_by_name
FROM payments p
LEFT JOIN orders o ON p.orderId = o.id
LEFT JOIN users u ON o.userId = u.id
LEFT JOIN users v ON p.verifiedBy = v.id
WHERE p.paymentNumber = 'PAY-2026-05-30-0001';

-- Get payments by date
SELECT * FROM payments
WHERE DATE(createdAt) = '2026-05-30'
ORDER BY createdAt DESC;

-- Count payments by status
SELECT 
  paymentStatus,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM payments
GROUP BY paymentStatus;

-- Get verified payments with verifier info
SELECT 
  p.*,
  o.orderNumber,
  v.name as verified_by
FROM payments p
LEFT JOIN orders o ON p.orderId = o.id
LEFT JOIN users v ON p.verifiedBy = v.id
WHERE p.paymentStatus = 'VERIFIED'
ORDER BY p.verifiedAt DESC;

-- ==========================================
-- 4. BANK ACCOUNTS QUERIES
-- ==========================================

-- Get all active bank accounts
SELECT * FROM bank_accounts
WHERE isActive = TRUE
ORDER BY displayOrder ASC;

-- Get all bank accounts
SELECT * FROM bank_accounts
ORDER BY displayOrder ASC;

-- ==========================================
-- 5. ORDER HISTORY QUERIES
-- ==========================================

-- Get order history for specific order
SELECT 
  oh.*,
  u.name as changed_by_name
FROM order_history oh
LEFT JOIN users u ON oh.changedBy = u.id
WHERE oh.orderId = 1
ORDER BY oh.createdAt DESC;

-- Get all status changes
SELECT 
  oh.*,
  o.orderNumber,
  u.name as changed_by_name
FROM order_history oh
LEFT JOIN orders o ON oh.orderId = o.id
LEFT JOIN users u ON oh.changedBy = u.id
WHERE oh.changeType = 'STATUS_CHANGE'
ORDER BY oh.createdAt DESC;

-- Get recent activities
SELECT 
  oh.*,
  o.orderNumber,
  u.name as changed_by_name
FROM order_history oh
LEFT JOIN orders o ON oh.orderId = o.id
LEFT JOIN users u ON oh.changedBy = u.id
ORDER BY oh.createdAt DESC
LIMIT 20;

-- ==========================================
-- 6. STATISTICS QUERIES
-- ==========================================

-- Overall statistics
SELECT 
  COUNT(*) as total_orders,
  SUM(CASE WHEN orderStatus = 'PENDING' THEN 1 ELSE 0 END) as pending_orders,
  SUM(CASE WHEN orderStatus = 'WAITING_PAYMENT' THEN 1 ELSE 0 END) as waiting_payment,
  SUM(CASE WHEN orderStatus = 'IN_PRODUCTION' THEN 1 ELSE 0 END) as in_production,
  SUM(CASE WHEN orderStatus = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
  SUM(CASE WHEN orderStatus = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
  SUM(CASE WHEN orderStatus = 'COMPLETED' THEN totalAmount ELSE 0 END) as total_revenue
FROM orders;

-- Daily orders count
SELECT 
  DATE(createdAt) as order_date,
  COUNT(*) as order_count,
  SUM(totalAmount) as daily_revenue
FROM orders
GROUP BY DATE(createdAt)
ORDER BY order_date DESC;

-- Monthly revenue
SELECT 
  DATE_FORMAT(createdAt, '%Y-%m') as month,
  COUNT(*) as order_count,
  SUM(totalAmount) as monthly_revenue
FROM orders
WHERE orderStatus = 'COMPLETED'
GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
ORDER BY month DESC;

-- Top customers by order count
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.totalAmount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.userId
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC
LIMIT 10;

-- Popular box models
SELECT 
  boxModel,
  COUNT(*) as order_count,
  SUM(quantity) as total_quantity
FROM orders
GROUP BY boxModel
ORDER BY order_count DESC;

-- Popular materials
SELECT 
  material,
  materialThickness,
  COUNT(*) as order_count
FROM orders
GROUP BY material, materialThickness
ORDER BY order_count DESC;

-- ==========================================
-- 7. SEARCH QUERIES
-- ==========================================

-- Search orders by order number or customer
SELECT 
  o.*,
  u.name as customer_name,
  u.email as customer_email
FROM orders o
LEFT JOIN users u ON o.userId = u.id
WHERE 
  o.orderNumber LIKE '%0001%'
  OR u.name LIKE '%John%'
  OR u.email LIKE '%john%'
ORDER BY o.createdAt DESC;

-- Search payments by payment number
SELECT * FROM payments
WHERE paymentNumber LIKE '%0001%'
ORDER BY createdAt DESC;

-- ==========================================
-- 8. UPDATE QUERIES (Manual Operations)
-- ==========================================

-- Update order status
UPDATE orders 
SET orderStatus = 'IN_PRODUCTION'
WHERE id = 1;

-- Update payment status
UPDATE orders 
SET paymentStatus = 'PAID'
WHERE id = 1;

-- Verify payment manually
UPDATE payments 
SET 
  paymentStatus = 'VERIFIED',
  verifiedBy = 1,
  verifiedAt = NOW()
WHERE id = 1;

-- Activate/Deactivate bank account
UPDATE bank_accounts 
SET isActive = FALSE
WHERE id = 1;

-- ==========================================
-- 9. DELETE QUERIES (Use with Caution!)
-- ==========================================

-- Delete order (will cascade delete payments and history)
DELETE FROM orders WHERE id = 1;

-- Delete payment
DELETE FROM payments WHERE id = 1;

-- Delete bank account
DELETE FROM bank_accounts WHERE id = 1;

-- Delete order history
DELETE FROM order_history WHERE id = 1;

-- ==========================================
-- 10. MAINTENANCE QUERIES
-- ==========================================

-- Check table sizes
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'benua_kertas_db'
  AND table_name IN ('orders', 'payments', 'bank_accounts', 'order_history')
ORDER BY (data_length + index_length) DESC;

-- Count records in each table
SELECT 
  'orders' as table_name, 
  COUNT(*) as record_count 
FROM orders
UNION ALL
SELECT 
  'payments' as table_name, 
  COUNT(*) as record_count 
FROM payments
UNION ALL
SELECT 
  'bank_accounts' as table_name, 
  COUNT(*) as record_count 
FROM bank_accounts
UNION ALL
SELECT 
  'order_history' as table_name, 
  COUNT(*) as record_count 
FROM order_history;

-- Check for orphaned records (should return 0)
SELECT COUNT(*) as orphaned_payments
FROM payments p
LEFT JOIN orders o ON p.orderId = o.id
WHERE o.id IS NULL;

SELECT COUNT(*) as orphaned_history
FROM order_history oh
LEFT JOIN orders o ON oh.orderId = o.id
WHERE o.id IS NULL;

-- ==========================================
-- 11. BACKUP QUERIES
-- ==========================================

-- Export orders to CSV (run in MySQL client)
-- SELECT * FROM orders INTO OUTFILE '/tmp/orders_backup.csv'
-- FIELDS TERMINATED BY ',' ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

-- ==========================================
-- 12. TESTING QUERIES
-- ==========================================

-- Insert test order
INSERT INTO orders (
  orderNumber, userId, boxModel, sizePanjang, sizeLebar, sizeTinggi,
  material, materialThickness, colorOption, finishingOption,
  quantity, subtotal, tax, totalAmount, orderStatus, paymentStatus
) VALUES (
  'ORD-TEST-0001', 1, 'earlock-box-depan', 20.00, 15.00, 10.00,
  'duplex', 350, '2-sisi', 'glossy',
  2000, 4500000.00, 495000.00, 4995000.00, 'WAITING_PAYMENT', 'UNPAID'
);

-- Insert test payment
INSERT INTO payments (
  paymentNumber, orderId, paymentMethod, bankName, amount, paymentStatus
) VALUES (
  'PAY-TEST-0001', 1, 'BANK_TRANSFER', 'Bank BCA', 4995000.00, 'PENDING'
);

-- ==========================================
-- 13. PERFORMANCE QUERIES
-- ==========================================

-- Check index usage
SHOW INDEX FROM orders;
SHOW INDEX FROM payments;

-- Analyze query performance
EXPLAIN SELECT * FROM orders WHERE orderNumber = 'ORD-2026-05-30-0001';
EXPLAIN SELECT * FROM orders WHERE userId = 1 AND orderStatus = 'WAITING_PAYMENT';

-- ==========================================
-- END OF QUERIES
-- ==========================================
