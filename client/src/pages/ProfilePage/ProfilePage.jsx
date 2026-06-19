import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Footer } from '@/components';
import { Package, Clock, CheckCircle, CreditCard, Upload, ChevronRight, AlertCircle, X } from 'lucide-react';

const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Initial Mock Orders
const initialOrders = [
  {
    id: 'ORD-2026-05-123',
    date: '10 Mei 2026',
    model: 'Earlock Box Depan',
    size: '20 x 15 x 5 cm',
    quantity: 2000,
    total: 2500000,
    dp: 750000,
    status: 'waiting_final_payment', // Menunggu Pelunasan
  },
  {
    id: 'ORD-2026-05-098',
    date: '05 Mei 2026',
    model: 'Lunch Box',
    size: '18 x 18 x 7 cm',
    quantity: 3000,
    total: 3600000,
    dp: 1080000,
    status: 'in_production', // Sedang Diproses
  },
  {
    id: 'ORD-2026-04-055',
    date: '20 April 2026',
    model: 'Top Bottom Box',
    size: '25 x 20 x 10 cm',
    quantity: 1000,
    total: 5000000,
    dp: 1500000,
    status: 'completed', // Selesai
  }
];

const statusConfig = {
  'waiting_dp_confirmation': { label: 'Menunggu Konfirmasi DP', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  'in_production': { label: 'Sedang Diproses (Produksi)', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
  'waiting_final_payment': { label: 'Menunggu Pelunasan', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
  'final_payment_confirmation': { label: 'Menunggu Konfirmasi Pelunasan', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Clock },
  'completed': { label: 'Selesai / Dikirim', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
};

const ProfilePage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState(initialOrders);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If navigated from PaymentPage with a new order
    if (location.state?.newOrder && location.state?.orderData) {
      const newOrderData = location.state.orderData;
      const totalAmount = newOrderData.pricingData?.totalBayar || 0;
      const dpAmount = totalAmount * 0.3;

      const newOrder = {
        id: `ORD-NEW-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        model: newOrderData.selectedModel?.replace(/-/g, ' ').toUpperCase() || 'Custom Box',
        size: `${newOrderData.sizes?.panjang}x${newOrderData.sizes?.lebar}x${newOrderData.sizes?.tinggi} cm`,
        quantity: newOrderData.quantity,
        total: totalAmount,
        dp: dpAmount,
        status: 'waiting_dp_confirmation',
      };

      // Check if not already added to avoid duplicates on strict mode
      setOrders(prev => {
        if (prev.find(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
      
      // Clear location state to prevent re-adding on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleOpenPaymentModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setUploadedFile(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const submitFinalPayment = (e) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      
      // Update order status locally
      setOrders(prev => prev.map(o => {
        if (o.id === selectedOrder.id) {
          return { ...o, status: 'final_payment_confirmation' };
        }
        return o;
      }));
      
      alert('Bukti Pelunasan Berhasil Diunggah! Menunggu konfirmasi admin.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-6 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
            <p className="text-gray-500">Pantau status pesanan dan selesaikan pembayaran Anda di sini.</p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig['completed'];
              const StatusIcon = statusInfo.icon;
              const sisaPelunasan = order.total - order.dp;

              return (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">{order.id}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm">{order.date}</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                        <StatusIcon size={14} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
                      <p className="font-bold text-lg text-gray-900">{formatRupiah(order.total)}</p>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    {/* Item Info */}
                    <div className="flex-1 flex gap-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={28} className="text-color-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{order.model}</h3>
                        <p className="text-sm text-gray-500 mt-1">Ukuran: {order.size}</p>
                        <p className="text-sm text-gray-500">Kuantitas: {Number(order.quantity).toLocaleString('id-ID')} pcs</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">DP (30%) Terbayar:</span>
                        <span className="font-semibold text-gray-900">{formatRupiah(order.dp)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className={order.status === 'waiting_final_payment' ? 'text-red-600' : 'text-gray-900'}>
                          Sisa Pelunasan (70%):
                        </span>
                        <span className={order.status === 'waiting_final_payment' ? 'text-red-600' : 'text-gray-900'}>
                          {formatRupiah(sisaPelunasan)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end">
                      {order.status === 'waiting_final_payment' ? (
                        <button
                          onClick={() => handleOpenPaymentModal(order)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all w-full md:w-auto"
                        >
                          Bayar Pelunasan
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 text-color-secondary font-semibold hover:text-blue-800 transition-colors">
                          Lihat Detail <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal Upload Pelunasan */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Upload Bukti Pelunasan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium mb-1">Total yang harus dilunasi</p>
                  <p className="text-2xl font-bold text-red-700">{formatRupiah(selectedOrder.total - selectedOrder.dp)}</p>
                </div>
                <CreditCard size={32} className="text-red-200" />
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Transfer ke rekening:</p>
                <div className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900">Bank BCA</span>
                  </div>
                  <p className="text-xl font-mono text-gray-800 tracking-wider">1234 5678 90</p>
                  <p className="text-sm text-gray-500">a.n. PT Benua Kertas Indonesia</p>
                </div>
              </div>

              <form onSubmit={submitFinalPayment}>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload Bukti Transfer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-color-secondary hover:bg-blue-50 transition-all text-center group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${uploadedFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-color-secondary'}`}>
                        {uploadedFile ? <CheckCircle size={24} /> : <Upload size={24} />}
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {uploadedFile ? uploadedFile.name : 'Pilih file bukti transfer'}
                      </p>
                      <p className="text-xs text-gray-500">Format JPG, PNG, atau PDF (Maks. 5MB)</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!uploadedFile || isSubmitting}
                  className="w-full py-4 bg-color-secondary hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    'Konfirmasi Pelunasan'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
