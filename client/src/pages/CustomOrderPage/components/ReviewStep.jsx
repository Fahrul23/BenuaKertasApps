import { Edit, Package, Ruler, FileText, Palette, Sparkles, Upload, Hash, Clock, CheckCircle, Calculator, DollarSign, Layers, Grid3X3 } from 'lucide-react';
import { formatRupiah } from '../constants';

const ReviewStep = ({ 
  selectedModel, 
  sizes, 
  selectedMaterial, 
  selectedThickness,
  selectedColor,
  laminationSide,
  laminationType,
  uploadedFile,
  quantity,
  boxData,
  pricingData = {},
  onEditStep,
  onEditAll
}) => {
  // Get model name
  const modelName = boxData.models.find(m => m.id === selectedModel)?.name || '-';
  
  // Format size string
  const sizeString = selectedModel === 'top-bottom-box'
    ? `${sizes.panjang} x ${sizes.lebar} x ${sizes.tinggi} x ${sizes.tinggiTutup} cm (P x L x T x TT)`
    : selectedModel === 'earlock-box-samping'
    ? `${sizes.panjang} x ${sizes.lebar} x ${sizes.tinggi} cm (P x L x T) — Lidah: ${sizes.lidah || 2} cm`
    : `${sizes.panjang} x ${sizes.lebar} x ${sizes.tinggi} cm (P x L x T)`;

  // Get material name
  const materialName = selectedMaterial ? selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1) : '-';

  // Get color name
  const colorName = selectedColor === '1-sisi' ? '1 Sisi' : '2 Sisi';

  // Get lamination side name
  const laminationSideNames = {
    'sisi-luar': 'Sisi Luar',
    'dalam': 'Dalam',
    'luar-dan-dalam': 'Luar & Dalam',
    'tanpa-laminasi': 'Tanpa Laminasi',
  };
  const laminationSideName = laminationSideNames[laminationSide] || '-';

  // Get lamination type name
  const laminationTypeNames = {
    'glossy': 'Glossy',
    'doff': 'Doff',
  };
  const laminationTypeName = laminationType ? (laminationTypeNames[laminationType] || laminationType) : null;

  const reviewItems = [
    {
      icon: Package,
      label: 'Model Produk',
      value: modelName,
      step: 1
    },
    {
      icon: Ruler,
      label: 'Ukuran',
      value: sizeString,
      step: 2
    },
    {
      icon: FileText,
      label: 'Bahan',
      value: `${materialName} ${selectedThickness} gsm`,
      step: 3
    },
    {
      icon: Palette,
      label: 'Warna Kemasan',
      value: colorName,
      step: 4
    },
    {
      icon: Sparkles,
      label: 'Sisi Laminasi',
      value: laminationSideName,
      step: 5
    },
    ...(laminationTypeName ? [{
      icon: Sparkles,
      label: 'Tipe Laminasi',
      value: laminationTypeName,
      step: 5
    }] : []),
    {
      icon: Upload,
      label: 'Unggah File',
      value: uploadedFile ? uploadedFile.name : '-',
      subValue: uploadedFile ? (
        <>
          <span className="text-color-gray text-xs">
            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <span className="flex items-center gap-1 text-color-secondary text-xs">
            <CheckCircle size={12} />
            File sesuai standar
          </span>
        </>
      ) : null,
      step: 6
    },
    {
      icon: Hash,
      label: 'Tentukan Kuantitas',
      value: `${Number(quantity).toLocaleString('id-ID')} pcs`,
      step: 7
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">Review Orderan</h2>
          <p className="text-color-secondary text-sm font-semibold">Periksa kembali spesifikasi pesanan Anda</p>
        </div>
        <button
          onClick={onEditAll}
          className="px-6 py-2 border-2 border-color-secondary text-color-secondary rounded-lg font-semibold hover:bg-color-secondary hover:text-white transition-all duration-300"
        >
          Edit Semua
        </button>
      </div>

      {/* Review Container */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-color-black mb-6">Spesifikasi Kemasan</h3>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4 group">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-color-light flex items-center justify-center flex-shrink-0">
                <item.icon size={20} className="text-color-secondary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-color-secondary mb-1">{item.label}</p>
                <p className="text-color-black font-medium break-words">{item.value}</p>
                {item.subValue && (
                  <div className="mt-1 flex flex-col gap-0.5">
                    {item.subValue}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => onEditStep(item.step)}
                className="flex items-center gap-1 text-color-secondary hover:text-color-darker transition-colors opacity-0 group-hover:opacity-100"
              >
                <Edit size={16} />
                <span className="text-sm font-semibold">Edit</span>
              </button>
            </div>
          ))}
        </div>

        {/* ============ RINGKASAN HARGA (NEW) ============ */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-color-secondary to-color-secondary/80 flex items-center justify-center flex-shrink-0">
              <Calculator size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-color-black">Ringkasan Harga</h3>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 space-y-3">
            {/* Plano Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Plano</span>
              </div>
              <span className="text-sm font-semibold">{pricingData.planoType || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Jumlah mata</span>
              </div>
              <span className="text-sm font-semibold">{pricingData.jumlahMata ? `${pricingData.jumlahMata} mata` : '-'}</span>
            </div>

            <div className="border-t border-gray-200 my-2" />

            {/* Bahan */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bahan</span>
              <span className="text-sm">{materialName} {selectedThickness}gsm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Harga material</span>
              <span className="text-sm font-semibold">{formatRupiah(pricingData.hargaMaterial)}</span>
            </div>

            {/* Warna */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warna kemasan</span>
              <span className="text-sm">{colorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Harga warna</span>
              <span className="text-sm font-semibold">{formatRupiah(pricingData.hargaWarna)}</span>
            </div>

            {/* Laminasi */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Laminasi</span>
              <span className="text-sm">{laminationSideName}{laminationTypeName ? ` - ${laminationTypeName}` : ''}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Harga laminasi</span>
              <span className="text-sm font-semibold">{formatRupiah(pricingData.hargaLaminasi)}</span>
            </div>

            <div className="border-t-2 border-gray-300 my-3" />

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">Subtotal / plano</span>
              <span className="text-sm font-bold">{formatRupiah(pricingData.subtotalPerUnit)}</span>
            </div>

            {/* Quantity & Markup */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quantity</span>
              <span className="text-sm">{Number(quantity).toLocaleString('id-ID')} pcs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Markup</span>
              <span className="text-sm">× 85</span>
            </div>

            <div className="border-t-2 border-color-secondary/30 my-3" />

            {/* Total */}
            <div className="flex items-center justify-between bg-color-secondary/10 rounded-lg p-4 -mx-2">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-color-secondary" />
                <span className="text-base font-extrabold text-color-secondary">Total yang dibayar</span>
              </div>
              <span className="text-lg font-extrabold text-color-secondary">
                {formatRupiah(pricingData.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Estimasi Produksi */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-color-light flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-color-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-color-secondary mb-1">Estimasi Produksi</p>
              <div className="flex items-center gap-2">
                <p className="text-color-black font-bold text-lg">7 - 10 Hari Kerja</p>
                <div className="w-5 h-5 rounded-full bg-color-secondary/10 flex items-center justify-center cursor-help" title="Estimasi waktu produksi dapat berubah tergantung kompleksitas pesanan">
                  <span className="text-color-secondary text-xs font-bold">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
