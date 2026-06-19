import React, { useState } from 'react';
import { Package, Search, Filter, CheckCircle, Clock, AlertCircle, Eye, RefreshCw, X, FileText, Layers, Palette } from 'lucide-react';

const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Initial Mock Orders matching ProfilePage
const initialOrders = [
  {
    id: 'ORD-2026-05-123',
    customerName: 'Budi Santoso',
    date: '10 Mei 2026',
    model: 'Earlock Box Depan',
    quantity: 2000,
    total: 2500000,
    dp: 750000,
    status: 'waiting_final_payment', 
    dpProof: 'https://placehold.co/400x300/e2e8f0/475569?text=Bukti+Transfer+DP',
    finalProof: null,
    size: '20 x 15 x 5 cm',
    material: 'Duplex 350gsm',
    color: '1 Sisi (Luar)',
    finishing: 'Glossy (Luar Dalam)',
    note: 'Tolong cetak sesuai warna brand kami (Biru Navy).'
  },
  {
    id: 'ORD-2026-05-098',
    customerName: 'Siti Aminah',
    date: '05 Mei 2026',
    model: 'Lunch Box',
    quantity: 3000,
    total: 3600000,
    dp: 1080000,
    status: 'in_production', 
    dpProof: 'https://placehold.co/400x300/e2e8f0/475569?text=Bukti+Transfer+DP',
    finalProof: null,
    size: '18 x 18 x 7 cm',
    material: 'Ivory 270gsm',
    color: 'Full Color 2 Sisi',
    finishing: 'Laminasi Dalam (Food Grade)',
    note: '-'
  },
  {
    id: 'ORD-NEW-9921',
    customerName: 'Andi Setiawan',
    date: '17 Jun 2026',
    model: 'Top Bottom Box',
    quantity: 1000,
    total: 5000000,
    dp: 1500000,
    status: 'waiting_dp_confirmation', 
    dpProof: 'https://placehold.co/400x300/e2e8f0/475569?text=Bukti+Transfer+DP+(Baru)',
    finalProof: null,
    size: '25 x 20 x 10 cm',
    material: 'Kraft 300gsm',
    color: '1 Sisi (Hitam)',
    finishing: 'Tanpa Laminasi',
    note: 'Mohon dikirim sebelum akhir bulan.'
  },
  {
    id: 'ORD-2026-05-055',
    customerName: 'Rina Marlina',
    date: '20 April 2026',
    model: 'Tray Box',
    quantity: 500,
    total: 1000000,
    dp: 300000,
    status: 'final_payment_confirmation', 
    dpProof: 'https://placehold.co/400x300/e2e8f0/475569?text=Bukti+Transfer+DP',
    finalProof: 'https://placehold.co/400x300/e2e8f0/475569?text=Bukti+Pelunasan',
    size: '15 x 10 x 4 cm',
    material: 'Ivory 300gsm',
    color: '2 Sisi',
    finishing: 'Doff (Luar)',
    note: '-'
  }
];

const statusConfig = {
  'waiting_dp_confirmation': { label: 'Menunggu Konfirmasi DP', color: 'bg-amber-100 text-amber-700', icon: Clock },
  'in_production': { label: 'Sedang Diproses (Produksi)', color: 'bg-blue-100 text-blue-700', icon: Package },
  'waiting_final_payment': { label: 'Menunggu Pelunasan User', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  'final_payment_confirmation': { label: 'Menunggu Konfirmasi Pelunasan', color: 'bg-orange-100 text-orange-700', icon: Clock },
  'completed': { label: 'Selesai / Dikirim', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Kelola status pesanan pelanggan dan verifikasi pembayaran.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Order ID atau Nama Pelanggan..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          <span>Filter Status</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Order ID / Tanggal</th>
                <th className="p-4 font-semibold">Pelanggan</th>
                <th className="p-4 font-semibold">Produk & Qty</th>
                <th className="p-4 font-semibold">Total / DP</th>
                <th className="p-4 font-semibold">Status Saat Ini</th>
                <th className="p-4 font-semibold text-center">Aksi / Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.id}</div>
                      <div className="text-gray-500 text-xs mt-1">{order.date}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{order.customerName}</td>
                    <td className="p-4">
                      <div className="text-gray-900">{order.model}</div>
                      <div className="text-gray-500 text-xs mt-1">{order.quantity.toLocaleString('id-ID')} pcs</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{formatRupiah(order.total)}</div>
                      <div className="text-gray-500 text-xs mt-1">DP: {formatRupiah(order.dp)}</div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            setSelectedOrderDetail(order);
                            setIsDetailModalOpen(true);
                          }}
                          className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye size={14} /> Lihat Detail
                        </button>
                        {order.status === 'waiting_dp_confirmation' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'in_production')}
                            className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <CheckCircle size={14} /> Konfirmasi DP
                          </button>
                        )}
                        {order.status === 'in_production' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'waiting_final_payment')}
                            className="w-full px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <RefreshCw size={14} /> Produksi Selesai (Tagih)
                          </button>
                        )}
                        {order.status === 'waiting_final_payment' && (
                          <div className="w-full px-3 py-1.5 bg-gray-50 text-gray-400 rounded text-xs font-semibold text-center border border-gray-100 cursor-not-allowed">
                            Menunggu User Bayar
                          </div>
                        )}
                        {order.status === 'final_payment_confirmation' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <CheckCircle size={14} /> Konfirmasi Lunas & Kirim
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <div className="w-full px-3 py-1.5 bg-green-50 text-green-700 rounded text-xs font-semibold text-center border border-green-200">
                            Pesanan Selesai
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <Package className="mx-auto text-gray-300 mb-2" size={32} />
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-color-secondary/10 text-color-secondary rounded-lg flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Detail Pesanan</h3>
                  <p className="text-sm text-gray-500">{selectedOrderDetail.id}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Informasi Pelanggan & Keuangan */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Pelanggan</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="font-semibold text-gray-900">{selectedOrderDetail.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">Tanggal Pesan: {selectedOrderDetail.date}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Rincian Keuangan</h4>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total Harga</span>
                        <span className="font-bold text-gray-900">{formatRupiah(selectedOrderDetail.total)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">DP Dibayar (30%)</span>
                        <span className="font-semibold text-color-secondary">{formatRupiah(selectedOrderDetail.dp)}</span>
                      </div>
                      <div className="pt-2 border-t border-blue-200/50 flex justify-between items-center font-bold">
                        <span className="text-gray-900">Sisa Pelunasan</span>
                        <span className="text-red-600">{formatRupiah(selectedOrderDetail.total - selectedOrderDetail.dp)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spesifikasi Produk */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Spesifikasi Produk</h4>
                  <div className="bg-white border-2 border-gray-100 p-5 rounded-xl space-y-4">
                    
                    <div className="flex gap-3 items-start">
                      <Package size={18} className="text-color-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Model & Ukuran</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOrderDetail.model}</p>
                        <p className="text-sm text-gray-700">{selectedOrderDetail.size || '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Layers size={18} className="text-color-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Bahan & Laminasi</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrderDetail.material || '-'}</p>
                        <p className="text-sm text-gray-700">{selectedOrderDetail.finishing || '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Palette size={18} className="text-color-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Warna & Kuantitas</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrderDetail.color || '-'}</p>
                        <p className="text-sm text-gray-700">{selectedOrderDetail.quantity.toLocaleString('id-ID')} pcs</p>
                      </div>
                    </div>

                  </div>

                  {selectedOrderDetail.note && selectedOrderDetail.note !== '-' && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-xs font-bold text-amber-800 mb-1">Catatan Pelanggan:</p>
                      <p className="text-sm text-amber-900 italic">"{selectedOrderDetail.note}"</p>
                    </div>
                  )}

                </div>
              </div>

              {/* Bukti Pembayaran Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Lampiran Bukti Pembayaran</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedOrderDetail.dpProof ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-bold text-gray-700">Bukti Transfer DP (30%)</span>
                      </div>
                      <img src={selectedOrderDetail.dpProof} alt="Bukti DP" className="w-full h-auto object-cover" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                      Belum ada bukti DP
                    </div>
                  )}

                  {selectedOrderDetail.finalProof ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-bold text-gray-700">Bukti Transfer Pelunasan (70%)</span>
                      </div>
                      <img src={selectedOrderDetail.finalProof} alt="Bukti Pelunasan" className="w-full h-auto object-cover" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                      Belum ada bukti Pelunasan
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
