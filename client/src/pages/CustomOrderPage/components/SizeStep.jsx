import { NumberInput } from '@/components';
import ukuranBoxImg from '@/assets/ukuran-box.svg';

const SizeStep = ({ sizes, onSizeChange, selectedModel }) => {
  const isTopBottomBox = selectedModel === 'top-bottom-box';
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-2">Ukuran Box</h2>
      </div>

      {/* Size Inputs - Always 3 columns */}
      <div className="grid grid-cols-3 gap-4 mb-8">
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
        {/* Tinggi Tutup - Only for Top Bottom Box (will be on second row) */}
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
      </div>

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
