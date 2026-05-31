import { SelectInput } from '@/components';

const QUANTITY_OPTIONS = [
  { value: '1000', label: '1000' },
  { value: '1500', label: '1500' },
  { value: '2000', label: '2000' },
  { value: '2500', label: '2500' },
  { value: '3000', label: '3000' },
  { value: '3500', label: '3500' },
  { value: '4000', label: '4000' },
  { value: '4500', label: '4500' },
  { value: '5000', label: '5000' },
];

const QuantityStep = ({ quantity, onQuantityChange }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Kuantitas</h2>
        <p className="text-color-secondary text-sm font-semibold">Minimal cetak 1000 pcs</p>
      </div>

      {/* Quantity Select */}
      <div className="max-w-md">
        <SelectInput
          label="Jumlah"
          unit="pcs"
          value={quantity}
          onChange={onQuantityChange}
          options={QUANTITY_OPTIONS}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default QuantityStep;
