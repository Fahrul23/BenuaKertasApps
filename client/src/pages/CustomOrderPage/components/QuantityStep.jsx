import { useState } from 'react';
import { NumberInput, SelectInput } from '@/components';
import { QUANTITY_OPTIONS, formatRupiah } from '../constants';

const QuantityStep = ({ quantity, onQuantityChange }) => {
  const [inputMode, setInputMode] = useState('dropdown'); // 'dropdown' | 'custom'

  const handleDropdownChange = (e) => {
    onQuantityChange(e.target.value);
  };

  const handleCustomChange = (e) => {
    onQuantityChange(e.target.value);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Kuantitas</h2>
        <p className="text-color-secondary text-sm font-semibold">Minimal cetak 1000 pcs</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setInputMode('dropdown'); onQuantityChange(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            inputMode === 'dropdown'
              ? 'bg-color-secondary text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pilih Jumlah
        </button>
        <button
          onClick={() => { setInputMode('custom'); onQuantityChange(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            inputMode === 'custom'
              ? 'bg-color-secondary text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Input Manual
        </button>
      </div>

      {/* Quantity Input */}
      <div className="max-w-md">
        {inputMode === 'dropdown' ? (
          <SelectInput
            label="Jumlah"
            unit="pcs"
            value={quantity}
            onChange={handleDropdownChange}
            options={QUANTITY_OPTIONS}
            placeholder="Pilih jumlah"
          />
        ) : (
          <NumberInput
            label="Jumlah Custom"
            unit="pcs"
            value={quantity}
            onChange={handleCustomChange}
            min="1"
            placeholder="Masukkan jumlah"
          />
        )}
      </div>

      {/* Info */}
      {quantity && parseInt(quantity) >= 1 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in duration-200">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">{Number(quantity).toLocaleString('id-ID')} pcs</span> akan dicetak
          </p>
        </div>
      )}
    </div>
  );
};

export default QuantityStep;
