import boxImg from '@/assets/box.svg';

// Data untuk setiap tipe box
export const BOX_TYPES = {
  'earlock-box': {
    title: 'EARLOCK BOX',
    description: 'Atur spesifikasi custom Earlock Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'earlock-box', name: 'Earlock Box', image: boxImg },
      { id: 'top-bottom-box', name: 'Top & Bottom Box', image: boxImg },
      { id: 'clamshell-box', name: 'Clamshell Box', image: boxImg },
      { id: 'tray-box', name: 'Tray Box', image: boxImg },
    ]
  },
  'top-bottom-box': {
    title: 'TOP AND BOTTOM BOX',
    description: 'Atur spesifikasi custom Top and Bottom Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'model-standard', name: 'Model Standard', image: boxImg },
      { id: 'model-premium', name: 'Model Premium', image: boxImg },
    ]
  },
  'clamshell-box': {
    title: 'CLAMSHELL BOX',
    description: 'Atur spesifikasi custom Clamshell Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'engsel-samping', name: 'Engsel Samping', image: boxImg },
      { id: 'engsel-belakang', name: 'Engsel Belakang', image: boxImg },
    ]
  },
  'tray-box': {
    title: 'TRAY BOX',
    description: 'Atur spesifikasi custom Tray Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'tray-single', name: 'Tray Single', image: boxImg },
      { id: 'tray-double', name: 'Tray Double', image: boxImg },
    ]
  },
};

// Steps untuk stepper (8 steps total)
export const ALL_STEPS = [
  { id: 1, label: 'Model\nProduk' },
  { id: 2, label: 'Ukuran' },
  { id: 3, label: 'Bahan' },
  { id: 4, label: 'Warna\nKemasan' },
  { id: 5, label: 'Finishing\nLaminasi' },
  { id: 6, label: 'Unggah\nFile' },
  { id: 7, label: 'Tentukan\nKuantitas' },
  { id: 8, label: 'Review\nOrderan' },
];

// Text untuk tombol Next berdasarkan step
export const NEXT_BUTTON_TEXT = {
  1: 'Tentukan Ukuran',
  2: 'Tentukan Bahan',
  3: 'Tentukan Warna',
  4: 'Tentukan Laminasi',
  5: 'Unggah File',
  6: 'Tentukan Kuantitas',
  7: 'Review Order',
  8: 'Finish',
};

/**
 * Fungsi untuk mendapatkan steps yang akan ditampilkan di stepper
 * berdasarkan currentStep
 * 
 * Logika:
 * - Step 1-5: Tampilkan step 1 sampai current step, ellipsis, dan step 8
 * - Step 6-8: Tampilkan step yang relevan dengan ellipsis
 */
export const getVisibleSteps = (currentStep) => {
  // Jika di step 1-5, tampilkan: step 1 sampai current step, ellipsis, step 8
  if (currentStep <= 5) {
    const visibleSteps = [];
    
    // Tambahkan step 1 sampai current step
    for (let i = 0; i < currentStep; i++) {
      visibleSteps.push(ALL_STEPS[i]);
    }
    
    // Tambahkan ellipsis
    visibleSteps.push({ id: 'ellipsis', label: '', isEllipsis: true });
    
    // Tambahkan step 8
    visibleSteps.push(ALL_STEPS[7]);
    
    return visibleSteps;
  }
  
  // Jika di step 6-8, tampilkan semua step yang relevan
  // Bisa disesuaikan nanti sesuai kebutuhan
  return [
    ALL_STEPS[0], // Step 1
    { id: 'ellipsis', label: '', isEllipsis: true },
    ...ALL_STEPS.slice(currentStep - 2, currentStep + 1), // Steps around current
  ];
};
