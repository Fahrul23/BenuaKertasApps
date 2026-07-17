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

  // Extract data (handling both frontend payload and flat payload)
  const boxModel = orderData.selectedModel || orderData.boxModel;
  const sizePanjang = orderData.sizes?.panjang ? parseFloat(orderData.sizes.panjang) : parseFloat(orderData.sizePanjang || 0);
  const sizeLebar = orderData.sizes?.lebar ? parseFloat(orderData.sizes.lebar) : parseFloat(orderData.sizeLebar || 0);
  const sizeTinggi = orderData.sizes?.tinggi ? parseFloat(orderData.sizes.tinggi) : parseFloat(orderData.sizeTinggi || 0);
  const sizeTinggiTutup = orderData.sizes?.tinggiTutup ? parseFloat(orderData.sizes.tinggiTutup) : (orderData.sizeTinggiTutup ? parseFloat(orderData.sizeTinggiTutup) : null);
  const material = orderData.selectedMaterial || orderData.material;
  const materialThickness = parseInt(orderData.selectedThickness || orderData.materialThickness || 0);
  const colorOption = orderData.selectedColor || orderData.colorOption || orderData.colorSides;
  const laminationSide = orderData.laminationSide || 'none';
  const laminationType = orderData.laminationType || null;
  const finishing = orderData.finishing || null;
  const quantity = parseInt(orderData.quantity || 0);
  
  // Ambil lidah (untuk Earlock Box Samping) dan tinggiTutup (untuk Top Bottom Box)
  const lidah = orderData.sizes?.lidah ? parseFloat(orderData.sizes.lidah) : (orderData.lidah ? parseFloat(orderData.lidah) : null);

  const normalizedData = {
    boxModel, sizePanjang, sizeLebar, sizeTinggi, sizeTinggiTutup,
    material, materialThickness, colorOption, laminationSide, laminationType, finishing, quantity,
    lidah, // ← wajib untuk Earlock Box Samping
    colorSides: colorOption, laminationPart: laminationSide
  };

  // Calculate pricing
  const pricing = await calculateOrderPrice(normalizedData);

  // Generate order number
  const orderNumber = await generateOrderNumber();

  // Fetch user for shipping details
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      boxModel,
      sizePanjang,
      sizeLebar,
      sizeTinggi,
      sizeTinggiTutup,
      material,
      materialThickness,
      colorOption,
      laminationSide,
      laminationType: laminationSide === 'tanpa-laminasi' ? null : laminationType,
      finishing,
      designFileUrl: orderData.designFile?.url || orderData.designFileUrl || null,
      designFilePublicId: orderData.designFile?.publicId || orderData.designFilePublicId || null,
      designFileName: orderData.designFile?.name || orderData.designFileName || null,
      designFileSize: orderData.designFile?.size || orderData.designFileSize || null,
      designFileFormat: orderData.designFile?.format || orderData.designFileFormat || null,
      customerNote: orderData.note || orderData.customerNote || null,
      quantity,

      // Pricing Engine v3 fields (info plano — untuk referensi teknis produksi)
      planoType: pricing.planoType || null,
      paperWidth: pricing.paperWidth || null,
      paperHeight: pricing.paperHeight || null,
      jumlahMata: pricing.jumlahMata || null,
      planoOrientation: pricing.planoOrientation || null,
      qtyPlano: pricing.qtyPlano || null,
      qtyRim: pricing.qtyRim || null,

      // Total harga (breakdown hanya dihitung di backend, tidak disimpan)
      totalBayar: pricing.totalBayar || null,
      hargaPerPcs: pricing.hargaPerPcs || null,

      // Total fields
      subtotal: pricing.totalBayar || pricing.subtotal || 0,
      totalAmount: pricing.totalBayar || pricing.totalAmount || 0,

      orderStatus: 'WAITING_PAYMENT',
      paymentStatus: 'UNPAID',

      customerPhone: user?.phone || null,
      shippingProvince: user?.province || null,
      shippingCity: user?.city || null,
      shippingDistrict: user?.district || null,
      shippingPostalCode: user?.postalCode || null,
      shippingDetailAddress: user?.detailAddress || null,
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

  // Prepare update data
  const updateData = {
    orderStatus: newStatus,
  };

  // Auto-update paymentStatus based on workflow transitions
  if (newStatus === 'IN_PRODUCTION' && (previousStatus === 'WAITING_PAYMENT' || previousStatus === 'PENDING')) {
    updateData.paymentStatus = 'UNPAID'; // Reset to UNPAID for the upcoming pelunasan
    
    // Verify latest payment
    const latestPayment = await prisma.payments.findFirst({
      where: { orderId: orderId, paymentStatus: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    if (latestPayment) {
      await prisma.payments.update({
        where: { id: latestPayment.id },
        data: { paymentStatus: 'VERIFIED', verifiedBy: changedBy, verifiedAt: new Date() }
      });
    }
  } else if (newStatus === 'SHIPPED' && previousStatus === 'READY_TO_SHIP') {
    updateData.paymentStatus = 'PAID'; // Mark as PAID once pelunasan is accepted
    
    // Verify latest payment
    const latestPayment = await prisma.payments.findFirst({
      where: { orderId: orderId, paymentStatus: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    if (latestPayment) {
      await prisma.payments.update({
        where: { id: latestPayment.id },
        data: { paymentStatus: 'VERIFIED', verifiedBy: changedBy, verifiedAt: new Date() }
      });
    }
  }

  // Update order
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
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

  // If newStatus is FAILED, also reject the latest pending payment
  if (newStatus === 'FAILED') {
    const latestPayment = await prisma.payments.findFirst({
      where: { orderId: orderId, paymentStatus: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestPayment) {
      await prisma.payments.update({
        where: { id: latestPayment.id },
        data: {
          paymentStatus: 'REJECTED',
          verifiedBy: changedBy,
          verifiedAt: new Date(),
          rejectionReason: notes
        }
      });
    }
  }

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

/**
 * Generate unique payment number
 */
const generatePaymentNumber = async () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Find the last payment of the day
  const lastPayment = await prisma.payments.findFirst({
    where: {
      paymentNumber: {
        startsWith: `PAY-${dateStr}`
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  let seq = 1;
  if (lastPayment) {
    const lastSeqStr = lastPayment.paymentNumber.split('-').pop();
    seq = parseInt(lastSeqStr, 10) + 1;
  }

  const seqStr = seq.toString().padStart(4, '0');
  return `PAY-${dateStr}-${seqStr}`;
};

/**
 * Create a new order with a payment proof in a transaction
 */
export const createOrderWithPayment = async (userId, orderData, paymentData) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // 2. Generate Order Number
    const orderNumber = await generateOrderNumber();

    // 3. Prepare Order Data
    const {
      selectedModel, sizes, selectedMaterial, selectedThickness,
      selectedColor, laminationSide, laminationType, quantity, pricingData, note, designFile
    } = orderData;

    // Fetch user details for shipping address
    const user = await tx.user.findUnique({
      where: { id: userId }
    });

    const newOrder = await tx.order.create({
      data: {
        userId: userId,
        orderNumber,
        boxModel: selectedModel || orderData.boxModel,
        sizePanjang: sizes?.panjang ? parseFloat(sizes.panjang) : (orderData.sizePanjang || 0),
        sizeLebar: sizes?.lebar ? parseFloat(sizes.lebar) : (orderData.sizeLebar || 0),
        sizeTinggi: sizes?.tinggi ? parseFloat(sizes.tinggi) : (orderData.sizeTinggi || 0),
        sizeTinggiTutup: sizes?.tinggiTutup ? parseFloat(sizes.tinggiTutup) : (orderData.sizeTinggiTutup || null),
        material: selectedMaterial || orderData.material,
        materialThickness: parseInt(selectedThickness || orderData.materialThickness),
        colorOption: selectedColor || orderData.colorOption || orderData.colorSides,
        laminationSide: laminationSide || orderData.laminationSide || 'none',
        laminationType: laminationType || orderData.laminationType || null,
        designFileUrl: designFile?.url || orderData.designFileUrl || null,
        designFilePublicId: designFile?.publicId || orderData.designFilePublicId || null,
        designFileName: designFile?.name || orderData.designFileName || null,
        designFileSize: designFile?.size || orderData.designFileSize || null,
        designFileFormat: designFile?.format || orderData.designFileFormat || null,
        customerNote: note || orderData.customerNote || null,
        quantity: parseInt(quantity || orderData.quantity),
        planoType: pricingData?.planoType || null,
        paperWidth: pricingData?.paperWidth || null,
        paperHeight: pricingData?.paperHeight || null,
        jumlahMata: pricingData?.jumlahMata || null,
        planoOrientation: pricingData?.planoOrientation || null,
        qtyPlano: pricingData?.qtyPlano || null,
        qtyRim: pricingData?.qtyRim || null,
        totalBayar: pricingData?.totalPrice || pricingData?.totalBayar || orderData.totalBayar || 0,
        hargaPerPcs: (pricingData?.totalPrice || pricingData?.totalBayar) ? (pricingData.totalPrice || pricingData.totalBayar) / parseInt(quantity || orderData.quantity) : (orderData.hargaPerPcs || 0),
        subtotal: pricingData?.totalPrice || pricingData?.totalBayar || orderData.subtotal || 0,
        totalAmount: pricingData?.totalPrice || pricingData?.totalBayar || orderData.totalAmount || 0,
        orderStatus: 'WAITING_PAYMENT',
        paymentStatus: 'PENDING',
        customerPhone: user?.phone || null,
        shippingProvince: user?.province || null,
        shippingCity: user?.city || null,
        shippingDistrict: user?.district || null,
        shippingPostalCode: user?.postalCode || null,
        shippingDetailAddress: user?.detailAddress || null,
      }
    });

    // 4. Create Order History
    await tx.orderHistory.create({
      data: {
        orderId: newOrder.id,
        newStatus: 'WAITING_PAYMENT',
        changedBy: userId,
        changeType: 'STATUS_CHANGE',
        notes: 'Pesanan dibuat dan menunggu verifikasi pembayaran'
      }
    });

    // 5. Create Payment Record
    const paymentNumber = await generatePaymentNumber();

    const newPayment = await tx.payments.create({
      data: {
        orderId: newOrder.id,
        paymentNumber,
        paymentMethod: paymentData.paymentMethod || 'BANK_TRANSFER',
        bankName: paymentData.bankName || null,
        accountNumber: paymentData.accountNumber || null,
        accountHolderName: paymentData.accountHolderName || null,
        amount: pricingData?.totalPrice || pricingData?.totalBayar || orderData.totalBayar || 0,
        paymentProofUrl: paymentData.paymentProofUrl || null,
        paymentProofPublicId: paymentData.paymentProofPublicId || null,
        paymentProofName: paymentData.paymentProofName || null,
        paymentStatus: 'PENDING'
      }
    });

    return { order: newOrder, payment: newPayment };
  });
};

/**
 * Submit payment proof for an existing order
 */
export const submitPaymentProof = async (orderId, paymentData, userId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new Error('Order not found or unauthorized');

  const paymentNumber = await generatePaymentNumber();

  const newPayment = await prisma.payments.create({
    data: {
      orderId: order.id,
      paymentNumber,
      paymentMethod: paymentData.paymentMethod || 'BANK_TRANSFER',
      bankName: paymentData.bankName || null,
      accountNumber: paymentData.accountNumber || null,
      accountHolderName: paymentData.accountHolderName || null,
      amount: paymentData.amount || 0,
      paymentProofUrl: paymentData.paymentProofUrl || null,
      paymentProofPublicId: paymentData.paymentProofPublicId || null,
      paymentProofName: paymentData.paymentProofName || null,
      paymentStatus: 'PENDING'
    }
  });

  let newStatus = order.orderStatus;
  if (order.orderStatus === 'PENDING') newStatus = 'WAITING_PAYMENT';

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { 
      orderStatus: newStatus,
      paymentStatus: 'PENDING'
    }
  });

  await createOrderHistory(orderId, order.orderStatus, newStatus, userId, 'PAYMENT_UPDATE', 'Uploaded payment proof');

  return { order: updatedOrder, payment: newPayment };
};
