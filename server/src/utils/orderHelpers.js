import prisma from '../config/prisma.js';

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
 * Calculate box area in square centimeters
 * For pricing calculation
 */
export const calculateBoxArea = (panjang, lebar, tinggi, tinggiTutup = null) => {
  // Basic formula for box surface area
  // For standard box: 2(pl + pt + lt)
  // For top-bottom box: add extra for lid
  
  const p = parseFloat(panjang);
  const l = parseFloat(lebar);
  const t = parseFloat(tinggi);
  
  let area = 2 * (p * l + p * t + l * t);
  
  // Add lid area for top-bottom box
  if (tinggiTutup) {
    const tt = parseFloat(tinggiTutup);
    area += 2 * (p * l + p * tt + l * tt);
  }
  
  return area;
};

/**
 * Calculate order price
 * This is a simplified version - adjust based on actual pricing rules
 */
export const calculateOrderPrice = (orderData) => {
  const {
    sizePanjang,
    sizeLebar,
    sizeTinggi,
    sizeTinggiTutup,
    material,
    materialThickness,
    colorOption,
    finishingOption,
    quantity,
  } = orderData;

  // Base price per square cm
  const basePricePerSqCm = 0.5; // Rp 0.5 per cm²

  // Calculate area
  const area = calculateBoxArea(sizePanjang, sizeLebar, sizeTinggi, sizeTinggiTutup);

  // Material multiplier
  const materialMultipliers = {
    duplex: 1.0,
    ivory: 1.2,
    kraft: 0.9,
  };

  // Thickness multiplier
  const thicknessMultipliers = {
    300: 1.0,
    350: 1.1,
    400: 1.2,
    450: 1.3,
  };

  // Color multiplier
  const colorMultipliers = {
    '1-sisi': 1.0,
    '2-sisi': 1.3,
  };

  // Finishing multiplier
  const finishingMultipliers = {
    'tanpa-laminasi': 1.0,
    'sisi-luar': 1.2,
    'dalam': 1.2,
    'luar-dalam': 1.4,
    'glossy': 1.3,
    'doff': 1.3,
  };

  // Quantity discount
  const quantityMultiplier = quantity >= 5000 ? 0.9 : quantity >= 3000 ? 0.95 : 1.0;

  // Calculate subtotal
  const pricePerUnit =
    area *
    basePricePerSqCm *
    (materialMultipliers[material] || 1.0) *
    (thicknessMultipliers[materialThickness] || 1.0) *
    (colorMultipliers[colorOption] || 1.0) *
    (finishingMultipliers[finishingOption] || 1.0);

  const subtotal = pricePerUnit * quantity * quantityMultiplier;

  // Calculate tax (PPN 11%)
  const tax = subtotal * 0.11;

  // Calculate total
  const totalAmount = subtotal + tax;

  return {
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    totalAmount: Math.round(totalAmount),
    pricePerUnit: Math.round(pricePerUnit),
    area: Math.round(area),
  };
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
    'colorOption',
    'finishingOption',
    'quantity',
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
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

  // Validate quantity
  if (data.quantity && data.quantity < 1000) {
    errors.push('Minimum quantity is 1000');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
