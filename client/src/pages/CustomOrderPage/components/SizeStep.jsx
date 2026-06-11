import { NumberInput } from '@/components';
import { Grid3X3, Layers, RotateCcw } from 'lucide-react';
import ukuranBoxImg from '@/assets/ukuran-box.svg';

const SizeStep = ({ sizes, onSizeChange, selectedModel, planoInfo = {} }) => {
  const isTopBottomBox = selectedModel === 'top-bottom-box';
  const isEarlockSamping = selectedModel === 'earlock-box-samping';

  const hasPlanoData = planoInfo.planoType && planoInfo.jumlahMata;
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-2">Ukuran Box</h2>
      </div>

      {/* Size Inputs - Always 3 columns */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <NumberInput
          label="Panjang"
          unit="cm"
          value={sizes.panjang}
          onChange={(e) => onSizeChange('panjang', e.target.value)}
          min="0"
          placeholder="0"
        />
        <NumberInput
          label="Lebar"
          unit="cm"
          value={sizes.lebar}
          onChange={(e) => onSizeChange('lebar', e.target.value)}
          min="0"
          placeholder="0"
        />
        <NumberInput
          label="Tinggi"
          unit="cm"
          value={sizes.tinggi}
          onChange={(e) => onSizeChange('tinggi', e.target.value)}
          min="0"
          placeholder="0"
        />
        {/* Tinggi Tutup - Only for Top Bottom Box */}
        {isTopBottomBox && (
          <NumberInput
            label="Tinggi Tutup"
            unit="cm"
            value={sizes.tinggiTutup || ''}
            onChange={(e) => onSizeChange('tinggiTutup', e.target.value)}
            min="0"
            placeholder="0"
          />
        )}
        {/* Lidah - Only for Earlock Box Samping */}
        {isEarlockSamping && (
          <NumberInput
            label="Lidah"
            unit="cm"
            value={sizes.lidah || ''}
            onChange={(e) => onSizeChange('lidah', e.target.value)}
            min="0"
            placeholder="2"
          />
        )}
      </div>

      {/* Plano Info — auto kalkulasi setelah input ukuran */}
      {hasPlanoData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Grid3X3 size={16} />
            Rekomendasi Plano
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-blue-600 mb-1">Plano</p>
              <p className="font-bold text-blue-900 text-lg">{planoInfo.planoType}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-600 mb-1 flex items-center justify-center gap-1">
                <Layers size={12} /> Jumlah Mata
              </p>
              <p className="font-bold text-blue-900 text-lg">{planoInfo.jumlahMata}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-600 mb-1 flex items-center justify-center gap-1">
                <RotateCcw size={12} /> Orientasi
              </p>
              <p className="font-bold text-blue-900 text-lg capitalize">{planoInfo.planoOrientation}</p>
            </div>
          </div>
          {planoInfo.paperWidth && planoInfo.paperHeight && (
            <p className="text-xs text-blue-500 mt-3 text-center">
              Ukuran kertas: {planoInfo.paperWidth} × {planoInfo.paperHeight} cm
            </p>
          )}
        </div>
      )}

      {/* Box Image with Labels */}
      <div className="relative p-8 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Box Image */}
          <img
            src={ukuranBoxImg}
            alt="Box dimensions"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SizeStep;
