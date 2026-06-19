import prisma from '../config/prisma.js';
import { calculateFullPrice } from '../services/pricingEngine.service.js';

/**
 * Generate unique order number
 * Format: ORD-YYYY-MM-DD-XXXX
 * Example: ORD-2026-05-30-0001
 */
export const generateOrderNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `ORD-${year}-${month}-${day}`;

  // Get count of orders today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todayOrdersCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(todayOrdersCount + 1).padStart(4, '0');
  return `${datePrefix}-${sequence}`;
};

/**
 * Generate unique payment number
 * Format: PAY-YYYY-MM-DD-XXXX
 * Example: PAY-2026-05-30-0001
 */
export const generatePaymentNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `PAY-${year}-${month}-${day}`;

  // Get count of payments today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todayPaymentsCount = await prisma.payment.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(todayPaymentsCount + 1).padStart(4, '0');
  return `${datePrefix}-${sequence}`;
};

/**
 * Calculate order price menggunakan Pricing Engine v2
 * Formula: (hargaMaterial + hargaWarna + hargaLaminasi) × quantity × 85
 * Async function — memanggil database untuk lookup harga
 */
export const calculateOrderPrice = async (orderData) => {
  return await calculateFullPrice(orderData);
};

/**
 * Format currency to IDR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Create order history log
 */
export const createOrderHistory = async (orderId, previousStatus, newStatus, changedBy, changeType, notes = null) => {
  return await prisma.orderHistory.create({
    data: {
      orderId,
      previousStatus,
      newStatus,
      changedBy,
      changeType,
      notes,
    },
  });
};

/**
 * Get order status label in Indonesian
 */
export const getOrderStatusLabel = (status) => {
  const labels = {
    PENDING: 'Menunggu',
    WAITING_PAYMENT: 'Menunggu Pembayaran',
    PAYMENT_CONFIRMED: 'Pembayaran Dikonfirmasi',
    IN_PRODUCTION: 'Sedang Produksi',
    READY_TO_SHIP: 'Siap Dikirim',
    SHIPPED: 'Sudah Dikirim',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return labels[status] || status;
};

/**
 * Get payment status label in Indonesian
 */
export const getPaymentStatusLabel = (status) => {
  const labels = {
    UNPAID: 'Belum Dibayar',
    PENDING: 'Menunggu Verifikasi',
    PAID: 'Sudah Dibayar',
    FAILED: 'Gagal',
    REFUNDED: 'Dikembalikan',
  };
  return labels[status] || status;
};

/**
 * Validate order data
 */
export const validateOrderData = (data) => {
  const errors = [];

  // Required fields
  const requiredFields = [
    'boxModel',
    'sizePanjang',
    'sizeLebar',
    'sizeTinggi',
    'material',
    'materialThickness',
    'quantity',
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  }

  // colorSides atau colorOption wajib ada
  if (!data.colorSides && !data.colorOption) {
    errors.push('colorSides is required');
  }

  // laminationSide atau laminationPart wajib ada
  const laminationPart = data.laminationPart || data.laminationSide;
  if (!laminationPart) {
    errors.push('laminationSide (or laminationPart) is required');
  }

  // Validate laminationType (wajib kecuali jika tanpa-laminasi)
  if (laminationPart && laminationPart !== 'tanpa-laminasi' && !data.laminationType) {
    errors.push('laminationType is required when laminationSide is not tanpa-laminasi');
  }
  // laminationType harus null jika tanpa-laminasi
  if (laminationPart === 'tanpa-laminasi' && data.laminationType) {
    errors.push('laminationType must be null when laminationSide is tanpa-laminasi');
  }

  // Validate sizes
  if (data.sizePanjang && data.sizePanjang <= 0) {
    errors.push('sizePanjang must be greater than 0');
  }
  if (data.sizeLebar && data.sizeLebar <= 0) {
    errors.push('sizeLebar must be greater than 0');
  }
  if (data.sizeTinggi && data.sizeTinggi <= 0) {
    errors.push('sizeTinggi must be greater than 0');
  }

  // Validate top-bottom box
  if (data.boxModel === 'top-bottom-box' && !data.sizeTinggiTutup) {
    errors.push('sizeTinggiTutup is required for top-bottom-box');
  }

  // Validate quantity — minimal 1000 (2 rim), kelipatan 500
  if (data.quantity) {
    if (data.quantity < 1000) {
      errors.push('Minimum quantity adalah 1000 pcs (2 rim)');
    }
    if (data.quantity % 500 !== 0) {
      errors.push('Quantity harus kelipatan 500 (1 rim = 500 lembar)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
