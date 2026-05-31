import prisma from '../config/prisma.js';
import { generatePaymentNumber, createOrderHistory } from '../utils/orderHelpers.js';

/**
 * Create payment
 */
export const createPayment = async (paymentData) => {
  const { orderId, paymentMethod, bankName, accountNumber, accountHolderName, amount, paymentProofUrl, paymentProofPublicId, paymentProofName } = paymentData;

  // Check if order exists
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Check if order already has pending/verified payment
  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId,
      paymentStatus: {
        in: ['PENDING', 'VERIFIED'],
      },
    },
  });

  if (existingPayment) {
    throw new Error('Order already has a pending or verified payment');
  }

  // Generate payment number
  const paymentNumber = await generatePaymentNumber();

  // Create payment
  const payment = await prisma.payment.create({
    data: {
      paymentNumber,
      orderId,
      paymentMethod,
      bankName,
      accountNumber,
      accountHolderName,
      amount,
      paymentProofUrl,
      paymentProofPublicId,
      paymentProofName,
      paymentStatus: 'PENDING',
      paidAt: new Date(),
    },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Update order payment status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'PENDING',
    },
  });

  // Create order history
  await createOrderHistory(
    orderId,
    'UNPAID',
    'PENDING',
    order.userId,
    'PAYMENT_UPDATE',
    'Payment proof uploaded'
  );

  return payment;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      verifier: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  return payment;
};

/**
 * Get payment by payment number
 */
export const getPaymentByNumber = async (paymentNumber) => {
  const payment = await prisma.payment.findUnique({
    where: { paymentNumber },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      verifier: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  return payment;
};

/**
 * Get payments for an order
 */
export const getOrderPayments = async (orderId) => {
  const payments = await prisma.payment.findMany({
    where: { orderId },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      verifier: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return payments;
};

/**
 * Get all pending payments (Admin only)
 */
export const getPendingPayments = async (options = {}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: {
        paymentStatus: 'PENDING',
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'asc', // Oldest first
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({
      where: {
        paymentStatus: 'PENDING',
      },
    }),
  ]);

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Verify payment (Admin only)
 */
export const verifyPayment = async (paymentId, verifiedBy, notes = null) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.paymentStatus !== 'PENDING') {
    throw new Error('Payment is not pending verification');
  }

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      paymentStatus: 'VERIFIED',
      verifiedBy,
      verifiedAt: new Date(),
    },
  });

  // Update order payment status
  await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      paymentStatus: 'PAID',
      orderStatus: 'PAYMENT_CONFIRMED',
    },
  });

  // Create order history
  await createOrderHistory(
    payment.orderId,
    payment.order.orderStatus,
    'PAYMENT_CONFIRMED',
    verifiedBy,
    'PAYMENT_UPDATE',
    notes || 'Payment verified by admin'
  );

  return updatedPayment;
};

/**
 * Reject payment (Admin only)
 */
export const rejectPayment = async (paymentId, verifiedBy, rejectionReason) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.paymentStatus !== 'PENDING') {
    throw new Error('Payment is not pending verification');
  }

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      paymentStatus: 'REJECTED',
      verifiedBy,
      verifiedAt: new Date(),
      rejectionReason,
    },
  });

  // Update order payment status back to unpaid
  await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      paymentStatus: 'UNPAID',
    },
  });

  // Create order history
  await createOrderHistory(
    payment.orderId,
    'PENDING',
    'UNPAID',
    verifiedBy,
    'PAYMENT_UPDATE',
    `Payment rejected: ${rejectionReason}`
  );

  return updatedPayment;
};

/**
 * Get payment statistics (Admin only)
 */
export const getPaymentStatistics = async () => {
  const [pendingCount, verifiedCount, rejectedCount, totalVerified] = await Promise.all([
    prisma.payment.count({ where: { paymentStatus: 'PENDING' } }),
    prisma.payment.count({ where: { paymentStatus: 'VERIFIED' } }),
    prisma.payment.count({ where: { paymentStatus: 'REJECTED' } }),
    prisma.payment.aggregate({
      where: { paymentStatus: 'VERIFIED' },
      _sum: { amount: true },
    }),
  ]);

  return {
    pendingCount,
    verifiedCount,
    rejectedCount,
    totalVerified: totalVerified._sum.amount || 0,
  };
};
