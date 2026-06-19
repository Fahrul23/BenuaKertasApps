import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar, Footer } from '@/components';
import { Upload, CheckCircle, CreditCard, Landmark, AlertCircle, ChevronLeft } from 'lucide-react';

const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const orderData = location.state?.orderData;
  const totalAmount = orderData?.pricingData?.totalBayar || 0;
  const dpAmount = totalAmount * 0.3; // 30% DP

  useEffect(() => {
    if (!orderData) {
      // If no order data, redirect back to custom order
      navigate('/custom-order');
    }
  }, [orderData, navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/profile', { state: { newOrder: true, orderData } });
      }, 3000);
    }, 1500);
  };

  if (!orderData) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-6 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link to="/custom-order" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-color-secondary transition-all">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Pembayaran</h1>
              <p className="text-gray-500 mt-1">Selesaikan pembayaran untuk memproses pesanan Anda</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-gray-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran DP Berhasil Disubmit!</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Terima kasih, bukti pembayaran DP (30%) Anda sedang kami verifikasi. Anda akan dialihkan ke halaman Profile untuk melacak pesanan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side: Order & Payment Info */}
              <div className="space-y-6">
                {/* Total Bayar Card */}
                <div className="bg-gradient-to-br from-color-secondary to-blue-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <CreditCard size={100} />
                  </div>
                  <p className="text-blue-100 font-medium mb-1 relative z-10">Total DP (30%)</p>
                  <h2 className="text-4xl font-bold mb-3 relative z-10">{formatRupiah(dpAmount)}</h2>
                  <div className="relative z-10 mb-4 text-blue-200 text-sm flex items-center gap-2">
                    <span>Total Pesanan:</span>
                    <span className="line-through">{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 inline-block relative z-10 backdrop-blur-sm">
                    <p className="text-sm font-medium">Order ID: #ORD-{Math.floor(Math.random() * 1000000)}</p>
                  </div>
                </div>

                {/* Bank Account Info */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-color-secondary">
                      <Landmark size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Transfer Bank</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border-2 border-gray-100 rounded-xl hover:border-color-secondary transition-colors cursor-pointer group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900 text-lg">Bank BCA</span>
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">Cek Otomatis</span>
                      </div>
                      <p className="text-2xl font-mono text-gray-800 tracking-wider mb-1">1234 5678 90</p>
                      <p className="text-sm text-gray-500 font-medium">a.n. PT Benua Kertas Indonesia</p>
                    </div>
                    <div className="p-4 border-2 border-gray-100 rounded-xl hover:border-color-secondary transition-colors cursor-pointer group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900 text-lg">Bank Mandiri</span>
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">Manual</span>
                      </div>
                      <p className="text-2xl font-mono text-gray-800 tracking-wider mb-1">0987 6543 21</p>
                      <p className="text-sm text-gray-500 font-medium">a.n. PT Benua Kertas Indonesia</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-amber-50 rounded-lg p-4 flex gap-3 text-amber-700 items-start">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Pastikan nominal transfer sesuai hingga 3 digit terakhir agar mempercepat proses verifikasi otomatis.</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Upload Form */}
              <div>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Pembayaran DP</h3>
                  <p className="text-gray-500 text-sm mb-6">Harap transfer sesuai nominal DP (30%) yang tertera.</p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Upload Bukti Transfer <span className="text-red-500">*</span>
                      </label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-color-secondary hover:bg-gray-50 transition-all text-center">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${uploadedFile ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-color-secondary'}`}>
                            {uploadedFile ? <CheckCircle size={28} /> : <Upload size={28} />}
                          </div>
                          <p className="font-semibold text-gray-900 mb-1">
                            {uploadedFile ? uploadedFile.name : 'Klik atau Drag & Drop file'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Format JPG, PNG, atau PDF (Maks. 5MB)'}
                          </p>
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
                        'Konfirmasi Pembayaran'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
