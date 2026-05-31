import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar, Footer, Stepper } from '@/components';
import { getVisibleSteps, NEXT_BUTTON_TEXT } from './constants';
import ModelStep from './components/ModelStep';
import SizeStep from './components/SizeStep';
import MaterialStep from './components/MaterialStep';
import ColorStep from './components/ColorStep';
import FinishingStep from './components/FinishingStep';
import UploadStep from './components/UploadStep';
import QuantityStep from './components/QuantityStep';
import ReviewStep from './components/ReviewStep';
import earlockBoxDepanImg from '@/assets/earlock-box-depan.svg';
import earlockBoxSampingImg from '@/assets/earlock-box-samping.svg';
import topBottomBoxImg from '@/assets/top-bottom-box.svg';
import lunchBoxImg from '@/assets/lunch-box.svg';
import clamshellBoxImg from '@/assets/clamshell-box.svg';
import trayBoxImg from '@/assets/tray-box.svg';

const CustomOrderPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false); // Track if editing from review
  const [selectedModel, setSelectedModel] = useState(null);
  const [sizes, setSizes] = useState({
    panjang: '',
    lebar: '',
    tinggi: '',
    tinggiTutup: '', // For Top Bottom Box only
  });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFinishing, setSelectedFinishing] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('');

  // Use default box data (earlock-box)
  const boxData = {
    title: 'CUSTOM BOX',
    description: 'Atur spesifikasi custom box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'earlock-box-depan', name: 'Earlock Box Depan', image: earlockBoxDepanImg },
      { id: 'earlock-box-samping', name: 'Earlock Box Samping', image: earlockBoxSampingImg },
      { id: 'top-bottom-box', name: 'Top Bottom Box', image: topBottomBoxImg },
      { id: 'lunch-box', name: 'Lunch Box', image: lunchBoxImg },
      { id: 'clamshell-box', name: 'Clamshell Box', image: clamshellBoxImg },
      { id: 'tray-box', name: 'Tray Box', image: trayBoxImg },
    ]
  };

  const handleNext = () => {
    // If in edit mode, return to review (step 8)
    if (isEditMode) {
      setCurrentStep(8);
      setIsEditMode(false);
    } else {
      // Normal flow: go to next step
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    // If in edit mode and going back, cancel edit mode and return to review
    if (isEditMode) {
      setCurrentStep(8);
      setIsEditMode(false);
    } else {
      // Normal flow: go to previous step
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleEditStep = (step) => {
    setIsEditMode(true);
    setCurrentStep(step);
  };

  const handleEditAll = () => {
    // Edit All: reset to step 1 without edit mode (normal flow)
    setIsEditMode(false);
    setCurrentStep(1);
  };

  const handleSizeChange = (field, value) => {
    setSizes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    if (currentStep === 1) {
      return selectedModel !== null;
    }
    if (currentStep === 2) {
      // Check if all size fields have values and are greater than 0
      const basicSizesValid = sizes.panjang > 0 && sizes.lebar > 0 && sizes.tinggi > 0;
      // For Top Bottom Box, also check tinggiTutup
      if (selectedModel === 'top-bottom-box') {
        return basicSizesValid && sizes.tinggiTutup > 0;
      }
      return basicSizesValid;
    }
    if (currentStep === 3) {
      // Check if material and thickness are selected
      return selectedMaterial !== null && selectedThickness !== null;
    }
    if (currentStep === 4) {
      // Check if color is selected
      return selectedColor !== null;
    }
    if (currentStep === 5) {
      // Check if finishing is selected
      return selectedFinishing !== null;
    }
    if (currentStep === 6) {
      // Check if file is uploaded (note is optional)
      return uploadedFile !== null;
    }
    if (currentStep === 7) {
      // Check if quantity is selected
      return quantity !== '';
    }
    // For other steps, allow to proceed (will be implemented later)
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-color-white">
      <Navbar />

      <main className="flex-1 px-6 md:px-10 lg:px-16 py-8 md:py-12">
        {/* Stepper */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <Stepper steps={getVisibleSteps(currentStep)} currentStep={currentStep} />
        </div>

        {/* Navigation Buttons - Below Stepper, Floating Right */}
        <div className="w-full max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-end gap-4">
            {/* Back Button - Circle */}
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full border-2 border-color-secondary flex items-center justify-center text-color-secondary hover:bg-color-secondary hover:text-white hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-color-secondary disabled:hover:scale-100 flex-shrink-0"
            >
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
            </button>

            {/* Next Button - Rounded Rectangle */}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 md:gap-3 pl-6 md:pl-8 pr-0 h-[28px] md:h-[34px] rounded-full bg-color-secondary text-white font-semibold text-xs md:text-sm hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm hover:shadow-md"
            >
              <span>{isEditMode ? 'Update' : NEXT_BUTTON_TEXT[currentStep]}</span>
              <div className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full bg-white border-2 border-color-secondary flex items-center justify-center flex-shrink-0">
                <ChevronRight size={14} className="md:w-4 md:h-4 text-color-secondary" />
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Side - Info (2 columns = 40%) */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-color-secondary">
                  {currentStep > 1 && selectedModel 
                    ? boxData.models.find(m => m.id === selectedModel)?.name.toUpperCase() 
                    : boxData.title}
                </span>
              </h1>
              <div className="border-l-4 border-color-secondary pl-4 py-2 my-6">
                <p className="text-color-gray text-sm leading-relaxed">
                  {boxData.description}
                </p>
              </div>

              {/* WhatsApp Consultation Box */}
              <div className="bg-color-secondary rounded-xl p-6 mt-8">
                <p className="text-white text-sm mb-4">
                  Jika masih ada yang ingin ditanyakan seputar custom packaging Box ini bisa langsung hubungi kami via whatsapp
                </p>
                <button className="bg-white hover:bg-gray-50 text-color-primary font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
                  Konsultasikan sekarang
                </button>
              </div>
            </div>

            {/* Right Side - Step Content (3 columns = 60%) */}
            <div className="lg:col-span-3">
              {/* Step 1: Model Selection */}
              {currentStep === 1 && (
                <ModelStep
                  models={boxData.models}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}

              {/* Step 2: Size Input */}
              {currentStep === 2 && (
                <SizeStep
                  sizes={sizes}
                  onSizeChange={handleSizeChange}
                  selectedModel={selectedModel}
                />
              )}

              {/* Step 3: Material Selection */}
              {currentStep === 3 && (
                <MaterialStep
                  selectedMaterial={selectedMaterial}
                  selectedThickness={selectedThickness}
                  onMaterialSelect={setSelectedMaterial}
                  onThicknessSelect={setSelectedThickness}
                />
              )}

              {/* Step 4: Color Selection */}
              {currentStep === 4 && (
                <ColorStep
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
              )}

              {/* Step 5: Finishing Selection */}
              {currentStep === 5 && (
                <FinishingStep
                  selectedFinishing={selectedFinishing}
                  onFinishingSelect={setSelectedFinishing}
                />
              )}

              {/* Step 6: Upload File */}
              {currentStep === 6 && (
                <UploadStep
                  uploadedFile={uploadedFile}
                  note={note}
                  onFileUpload={setUploadedFile}
                  onNoteChange={setNote}
                />
              )}

              {/* Step 7: Quantity Selection */}
              {currentStep === 7 && (
                <QuantityStep
                  quantity={quantity}
                  onQuantityChange={(e) => setQuantity(e.target.value)}
                />
              )}

              {/* Step 8: Review Order */}
              {currentStep === 8 && (
                <ReviewStep
                  selectedModel={selectedModel}
                  sizes={sizes}
                  selectedMaterial={selectedMaterial}
                  selectedThickness={selectedThickness}
                  selectedColor={selectedColor}
                  selectedFinishing={selectedFinishing}
                  uploadedFile={uploadedFile}
                  quantity={quantity}
                  boxData={boxData}
                  onEditStep={handleEditStep}
                  onEditAll={handleEditAll}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomOrderPage;
