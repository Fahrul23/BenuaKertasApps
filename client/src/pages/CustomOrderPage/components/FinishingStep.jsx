import { Check } from 'lucide-react';
import { cn } from '@/utils';
import sisiLuarImg from '@/assets/sisi-luar.svg';
import dalamImg from '@/assets/dalam.svg';
import luarDalamImg from '@/assets/luar-dalam.svg';
import tanpaLaminasiImg from '@/assets/tanpa-laminasi.svg';
import glossyImg from '@/assets/glossy.svg';
import doffImg from '@/assets/doff.svg';

const FINISHING_OPTIONS = [
  { id: 'sisi-luar', name: 'Sisi Luar', image: sisiLuarImg },
  { id: 'dalam', name: 'Dalam', image: dalamImg },
  { id: 'luar-dalam', name: 'Luar & Dalam', image: luarDalamImg },
  { id: 'tanpa-laminasi', name: 'Tanpa Laminasi', image: tanpaLaminasiImg },
  { id: 'glossy', name: 'Glossy', image: glossyImg },
  { id: 'doff', name: 'Doff', image: doffImg },
];

const FinishingStep = ({ selectedFinishing, onFinishingSelect }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Finishing Laminasi</h2>
        <p className="text-color-secondary text-sm font-semibold">Tipe Laminasi</p>
      </div>

      {/* Finishing Selection */}
      <div className="grid grid-cols-4 gap-6">
        {FINISHING_OPTIONS.map((finishing) => (
          <div
            key={finishing.id}
            onClick={() => onFinishingSelect(finishing.id)}
            className="relative cursor-pointer group"
          >
            {/* Card Container */}
            <div className="relative w-full aspect-[3/4] max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
              {/* Background with shadow */}
              <div className={cn(
                "absolute inset-0 bg-white rounded-lg transition-all duration-300",
                "shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)]",
                selectedFinishing === finishing.id
                  ? 'ring-2 ring-color-secondary scale-105'
                  : 'group-hover:ring-2 group-hover:ring-color-secondary group-hover:scale-105 group-hover:shadow-lg'
              )} />

              {/* Checkmark - Top Left */}
              {selectedFinishing === finishing.id && (
                <div className="absolute -top-3 -left-3 w-6 h-6 md:w-7 md:h-7 bg-color-secondary rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in duration-300">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
              )}

              {/* Content Container */}
              <div className="absolute inset-2 md:inset-3 bottom-10 md:bottom-12 bg-white overflow-hidden rounded transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                {/* Image from assets */}
                <img
                  src={finishing.image}
                  alt={finishing.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Label - Bottom */}
              <div className="absolute left-0 bottom-0 w-full h-10 md:h-12 flex items-center justify-center px-1">
                <span className="text-xs md:text-sm font-semibold text-black transition-colors duration-300 group-hover:text-color-secondary text-center">
                  {finishing.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinishingStep;
