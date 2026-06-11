import { Check } from 'lucide-react';
import { cn } from '@/utils';
import { LAMINATION_SIDE_OPTIONS, LAMINATION_TYPE_OPTIONS } from '../constants';

const OptionCard = ({ option, selected, onClick }) => (
  <div onClick={() => onClick(option.id)} className="relative cursor-pointer group">
    {/* Card Container */}
    <div className="relative w-full aspect-[3/4] max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
      {/* Background with shadow */}
      <div className={cn(
        "absolute inset-0 bg-white rounded-lg transition-all duration-300",
        "shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)]",
        selected
          ? 'ring-2 ring-color-secondary scale-105'
          : 'group-hover:ring-2 group-hover:ring-color-secondary group-hover:scale-105 group-hover:shadow-lg'
      )} />

      {/* Checkmark - Top Left */}
      {selected && (
        <div className="absolute -top-3 -left-3 w-6 h-6 md:w-7 md:h-7 bg-color-secondary rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in duration-300">
          <Check size={16} className="text-white" strokeWidth={3} />
        </div>
      )}

      {/* Content Container */}
      <div className="absolute inset-2 md:inset-3 bottom-10 md:bottom-12 bg-white overflow-hidden rounded transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
        <img
          src={option.image}
          alt={option.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Label - Bottom */}
      <div className="absolute left-0 bottom-0 w-full h-10 md:h-12 flex items-center justify-center px-1">
        <span className="text-xs md:text-sm font-semibold text-black transition-colors duration-300 group-hover:text-color-secondary text-center">
          {option.name}
        </span>
      </div>
    </div>
  </div>
);

const FinishingStep = ({ laminationSide, laminationType, onSideSelect, onTypeSelect }) => {
  // Tampilkan baris Tipe Laminasi hanya jika sisi sudah dipilih dan bukan tanpa-laminasi
  const showLaminationType = laminationSide !== '' && laminationSide !== null && laminationSide !== 'tanpa-laminasi';

  const handleSideChange = (code) => {
    onSideSelect(code);
    // Auto-reset tipe laminasi jika pilih tanpa-laminasi
    if (code === 'tanpa-laminasi') {
      onTypeSelect('');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Finishing Laminasi</h2>
        <p className="text-color-secondary text-sm font-semibold">Pilih sisi dan tipe laminasi kemasan</p>
      </div>

      {/* Baris 1: Sisi Laminasi — selalu tampil */}
      <section className="mb-8">
        <p className="text-color-secondary text-sm font-semibold mb-4">Sisi Laminasi</p>
        <div className="grid grid-cols-4 gap-6">
          {LAMINATION_SIDE_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              selected={laminationSide === option.id}
              onClick={handleSideChange}
            />
          ))}
        </div>
      </section>

      {/* Baris 2: Tipe Laminasi — hanya tampil jika bukan tanpa-laminasi */}
      {showLaminationType && (
        <section className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-color-secondary text-sm font-semibold mb-4">Tipe Laminasi</p>
          <div className="grid grid-cols-4 gap-6">
            {LAMINATION_TYPE_OPTIONS.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={laminationType === option.id}
                onClick={onTypeSelect}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FinishingStep;
