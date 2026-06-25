import express from 'express';
import { submitOrderWithPayment, getAdminOrders, updateStatus, getUserOrders, uploadPaymentProof, createOrder, completeOrderByUser } from '../controllers/order.controller.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(verifyToken);

// GET /api/v1/orders
router.get('/', getUserOrders);

// POST /api/v1/orders
router.post('/', createOrder);

// POST /api/v1/orders/with-payment
router.post('/with-payment', submitOrderWithPayment);

// POST /api/v1/orders/:id/payment
router.post('/:id/payment', uploadPaymentProof);

// PUT /api/v1/orders/:id/complete
router.put('/:id/complete', completeOrderByUser);

// GET /api/v1/orders/admin/all
router.get('/admin/all', authorizeRoles('ADMIN'), getAdminOrders);

// PUT /api/v1/orders/admin/:id/status
router.put('/admin/:id/status', authorizeRoles('ADMIN'), updateStatus);

export default router;
