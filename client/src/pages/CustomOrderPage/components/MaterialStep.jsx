import { Check } from 'lucide-react';
import { RadioButton } from '@/components';
import { cn } from '@/utils';
import duplexImg from '@/assets/duplex.svg';
import ivoryImg from '@/assets/ivory.svg';
import kraftImg from '@/assets/kraft.svg';

const MATERIALS = [
  { id: 'duplex', name: 'Duplex', image: duplexImg },
  { id: 'ivory', name: 'Ivory', image: ivoryImg },
  { id: 'kraft', name: 'Kraft', image: kraftImg },
];

const THICKNESS_OPTIONS = [
  { label: '300 gsm', value: '300' },
  { label: '350 gsm', value: '350' },
  { label: '400 gsm', value: '400' },
  { label: '450 gsm', value: '450' },
];

const MaterialStep = ({ selectedMaterial, selectedThickness, onMaterialSelect, onThicknessSelect }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Bahan Box</h2>
        <p className="text-color-secondary text-sm font-semibold">Tentukan Bahan</p>
      </div>

      {/* Material Selection */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {MATERIALS.map((material) => (
          <div
            key={material.id}
            onClick={() => onMaterialSelect(material.id)}
            className="relative cursor-pointer group"
          >
            {/* Card Container */}
            <div className="relative w-full aspect-square max-w-[140px] md:max-w-[180px] lg:max-w-[200px]">
              {/* Background with shadow - Exact Figma shadow */}
              <div className={cn(
                "absolute inset-0 bg-white rounded-lg transition-all duration-300",
                "shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)]",
                selectedMaterial === material.id
                  ? 'ring-2 ring-color-secondary scale-105'
                  : 'group-hover:ring-2 group-hover:ring-color-secondary group-hover:scale-105 group-hover:shadow-lg'
              )} />

              {/* Checkmark - Top Left */}
              {selectedMaterial === material.id && (
                <div className="absolute -top-3 -left-3 w-6 h-6 md:w-7 md:h-7 bg-color-secondary rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in duration-300">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
              )}

              {/* Image Container */}
              <div className="absolute inset-2 md:inset-3 bottom-10 md:bottom-12 bg-white overflow-hidden rounded transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                <img
                  src={material.image}
                  alt={material.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Label - Bottom */}
              <div className="absolute left-0 bottom-0 w-full h-10 md:h-12 flex items-center justify-center">
                <span className="text-xs md:text-sm font-semibold text-black transition-colors duration-300 group-hover:text-color-secondary">
                  {material.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thickness Selection */}
      <div>
        <h3 className="font-bold text-black mb-4">Ketebalan Bahan</h3>
        <div className="flex flex-wrap gap-4">
          {THICKNESS_OPTIONS.map((option) => (
            <RadioButton
              key={option.value}
              label={option.label}
              value={option.value}
              name="thickness"
              checked={selectedThickness === option.value}
              onChange={(e) => onThicknessSelect(e.target.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialStep;
