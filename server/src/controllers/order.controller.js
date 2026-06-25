import * as orderService from '../services/order.service.js';

export const createOrder = async (req, res) => {
  try {
    const { orderData } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!orderData) {
      return res.status(400).json({ success: false, message: 'Data pesanan diperlukan' });
    }

    const result = await orderService.createOrder(userId, orderData);

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: result
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat membuat pesanan'
    });
  }
};

export const submitOrderWithPayment = async (req, res) => {
  try {
    const { orderData, paymentData } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!orderData || !paymentData) {
      return res.status(400).json({ success: false, message: 'Data pesanan dan pembayaran diperlukan' });
    }

    const result = await orderService.createOrderWithPayment(userId, orderData, paymentData);

    return res.status(201).json({
      success: true,
      message: 'Pesanan dan bukti pembayaran berhasil disubmit',
      data: result
    });
  } catch (error) {
    console.error('Submit order with payment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat memproses pesanan'
    });
  }
};

export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentData = req.body;
    const userId = req.user.id;

    if (!paymentData || !paymentData.paymentProofUrl) {
      return res.status(400).json({ success: false, message: 'Data pembayaran tidak lengkap' });
    }

    const result = await orderService.submitPaymentProof(parseInt(id), paymentData, userId);

    return res.status(200).json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah',
      data: result
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat memproses pembayaran'
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      status: req.query.status,
    };

    const result = await orderService.getUserOrders(userId, options);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar pesanan',
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat mengambil data pesanan'
    });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      search: req.query.search
    };

    const result = await orderService.getAllOrders(options);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar pesanan',
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat mengambil data pesanan'
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, notes } = req.body;
    const userId = req.user.id;

    if (!orderStatus && !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada status yang diubah'
      });
    }

    let updatedOrder;

    // Use transaction if both need to change, else just call service directly
    // Since our service has separate updateOrderStatus and updatePaymentStatus, we can call them sequentially
    if (orderStatus) {
      updatedOrder = await orderService.updateOrderStatus(parseInt(id), orderStatus, userId, notes);
    }
    
    if (paymentStatus) {
      updatedOrder = await orderService.updatePaymentStatus(parseInt(id), paymentStatus, userId, notes);
    }

    return res.status(200).json({
      success: true,
      message: 'Status pesanan berhasil diperbarui',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat memperbarui status'
    });
  }
};

export const completeOrderByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // updateOrderStatus in service checks ownership if not admin
    const updatedOrder = await orderService.updateOrderStatus(parseInt(id), 'COMPLETED', userId, 'Pesanan telah diterima oleh pelanggan');
    
    return res.status(200).json({
      success: true,
      message: 'Pesanan berhasil diselesaikan',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Complete order error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat menyelesaikan pesanan'
    });
  }
};
