import prisma from '../config/prisma.js';
import {
  generateOrderNumber,
  calculateOrderPrice,
  validateOrderData,
  createOrderHistory,
} from '../utils/orderHelpers.js';

/**
 * Create new order
 */
export const createOrder = async (userId, orderData) => {
  // Validate order data
  const validation = validateOrderData(orderData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Calculate pricing
  const pricing = calculateOrderPrice(orderData);

  // Generate order number
  const orderNumber = await generateOrderNumber();

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      boxModel: orderData.boxModel,
      sizePanjang: orderData.sizePanjang,
      sizeLebar: orderData.sizeLebar,
      sizeTinggi: orderData.sizeTinggi,
      sizeTinggiTutup: orderData.sizeTinggiTutup || null,
      material: orderData.material,
      materialThickness: orderData.materialThickness,
      colorOption: orderData.colorOption,
      finishingOption: orderData.finishingOption,
      designFileUrl: orderData.designFileUrl || null,
      designFilePublicId: orderData.designFilePublicId || null,
      designFileName: orderData.designFileName || null,
      designFileSize: orderData.designFileSize || null,
      designFileFormat: orderData.designFileFormat || null,
      customerNote: orderData.customerNote || null,
      quantity: orderData.quantity,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      totalAmount: pricing.totalAmount,
      orderStatus: 'WAITING_PAYMENT',
      paymentStatus: 'UNPAID',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Create order history
  await createOrderHistory(
    order.id,
    null,
    'WAITING_PAYMENT',
    userId,
    'STATUS_CHANGE',
    'Order created'
  );

  return order;
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId, userId = null, isAdmin = false) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      orderHistories: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Check ownership (unless admin)
  if (!isAdmin && userId && order.userId !== userId) {
    throw new Error('Unauthorized access to order');
  }

  return order;
};

/**
 * Get order by order number
 */
export const getOrderByNumber = async (orderNumber, userId = null, isAdmin = false) => {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      orderHistories: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Check ownership (unless admin)
  if (!isAdmin && userId && order.userId !== userId) {
    throw new Error('Unauthorized access to order');
  }

  return order;
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId, options = {}) => {
  const { page = 1, limit = 10, status = null } = options;
  const skip = (page - 1) * limit;

  const where = { userId };
  if (status) {
    where.orderStatus = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async (options = {}) => {
  const { page = 1, limit = 10, status = null, paymentStatus = null, search = null } = options;
  const skip = (page - 1) * limit;

  const where = {};
  if (status) {
    where.orderStatus = status;
  }
  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, newStatus, changedBy, notes = null) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const previousStatus = order.orderStatus;

  // Update order
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: newStatus,
    },
  });

  // Create history log
  await createOrderHistory(orderId, previousStatus, newStatus, changedBy, 'STATUS_CHANGE', notes);

  return updatedOrder;
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (orderId, newStatus, changedBy, notes = null) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const previousStatus = order.paymentStatus;

  // Update order
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: newStatus,
    },
  });

  // Create history log
  await createOrderHistory(orderId, previousStatus, newStatus, changedBy, 'PAYMENT_UPDATE', notes);

  return updatedOrder;
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId, userId, reason = null) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Check if order can be cancelled
  if (['SHIPPED', 'COMPLETED', 'CANCELLED'].includes(order.orderStatus)) {
    throw new Error('Order cannot be cancelled');
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: 'CANCELLED',
    },
  });

  // Create history log
  await createOrderHistory(orderId, order.orderStatus, 'CANCELLED', userId, 'STATUS_CHANGE', reason);

  return updatedOrder;
};

/**
 * Delete order (Admin only)
 */
export const deleteOrder = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Delete order (cascade will delete related records)
  await prisma.order.delete({
    where: { id: orderId },
  });

  return { message: 'Order deleted successfully' };
};

/**
 * Get order statistics (Admin only)
 */
export const getOrderStatistics = async () => {
  const [
    totalOrders,
    pendingOrders,
    waitingPayment,
    inProduction,
    completed,
    cancelled,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PENDING' } }),
    prisma.order.count({ where: { orderStatus: 'WAITING_PAYMENT' } }),
    prisma.order.count({ where: { orderStatus: 'IN_PRODUCTION' } }),
    prisma.order.count({ where: { orderStatus: 'COMPLETED' } }),
    prisma.order.count({ where: { orderStatus: 'CANCELLED' } }),
    prisma.order.aggregate({
      where: { orderStatus: 'COMPLETED' },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    waitingPayment,
    inProduction,
    completed,
    cancelled,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };
};
