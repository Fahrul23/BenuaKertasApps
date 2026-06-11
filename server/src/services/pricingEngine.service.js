import prisma from '../config/prisma.js';

/**
 * ============================================================
 * PRICING ENGINE SERVICE
 * Formula: Total = (hargaMaterial + hargaWarna + hargaLaminasi) × quantity × 85
 * ============================================================
 */

// Plano constants (fallback jika DB belum ada data)
const PLANOS = [
  { code: '65x100', width: 65, height: 100, effW: 63, effH: 97.5 },
  { code: '79x109', width: 79, height: 109, effW: 77, effH: 106.5 },
  { code: '90x120', width: 90, height: 120, effW: 88, effH: 117.5 },
];

/**
 * Hitung ukuran kertas berdasarkan model box dan dimensi
 * @param {string} boxModel - Kode model box
 * @param {number} p - Panjang (cm)
 * @param {number} l - Lebar (cm)
 * @param {number} t - Tinggi (cm)
 * @param {object} extras - { lidah, tTutup } field tambahan
 * @returns {{ paperWidth: number, paperHeight: number }}
 */
export const hitungUkuranKertas = (boxModel, p, l, t, extras = {}) => {
  const parsedP = parseFloat(p);
  const parsedL = parseFloat(l);
  const parsedT = parseFloat(t);

  switch (boxModel) {
    case 'earlock-box-depan':
      return {
        paperWidth: 3 * parsedT + 2 * parsedL,
        paperHeight: 4 * parsedT + parsedP,
      };

    case 'earlock-box-samping': {
      const lidah = parseFloat(extras.lidah || 2);
      return {
        paperWidth: 2 * parsedT + 2 * parsedL + lidah,
        paperHeight: 2 * parsedT + parsedP,
      };
    }

    case 'top-bottom-box': {
      const tTutup = parseFloat(extras.tTutup || extras.tinggiTutup || parsedT);
      return {
        paperWidth: 2 * tTutup + 2 * parsedT + 2 * parsedL + 0.5,
        paperHeight: 2 * parsedT + parsedP,
      };
    }

    case 'lunch-box':
      return {
        paperWidth: 2 * parsedT + parsedP - 2,
        paperHeight: 3 * parsedT + 2 * parsedL - 2,
      };

    case 'tray-box':
      return {
        paperWidth: 2 * parsedT + parsedP,
        paperHeight: 2 * parsedT + parsedL,
      };

    default:
      throw new Error(`Model box "${boxModel}" belum memiliki formula kalkulasi kertas.`);
  }
};

/**
 * Hitung jumlah mata pada sebuah plano
 * @param {number} effW - Effective width plano (cm)
 * @param {number} effH - Effective height plano (cm)
 * @param {number} pw - Paper width (cm)
 * @param {number} ph - Paper height (cm)
 * @returns {{ normal: number, rotasi: number, best: number, orientasi: string }}
 */
export const hitungMata = (effW, effH, pw, ph) => {
  const normal = Math.floor(effW / pw) * Math.floor(effH / ph);
  const rotasi = Math.floor(effW / ph) * Math.floor(effH / pw);
  return {
    normal,
    rotasi,
    best: Math.max(normal, rotasi),
    orientasi: normal >= rotasi ? 'normal' : 'rotasi',
  };
};

/**
 * Rekomendasi plano terbaik berdasarkan ukuran kertas
 * Memilih plano dengan jumlah mata terbanyak
 * @param {number} paperWidth - Lebar kertas (cm)
 * @param {number} paperHeight - Panjang kertas (cm)
 * @returns {object|null} Plano terbaik dengan jumlahMata dan orientasi
 */
export const rekomendasiPlano = async (paperWidth, paperHeight) => {
  // Coba ambil dari database dulu
  let planos;
  try {
    const dbPlanos = await prisma.planoType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (dbPlanos.length > 0) {
      planos = dbPlanos.map((p) => ({
        code: p.code,
        width: p.width,
        height: p.height,
        effW: p.effectiveWidth,
        effH: p.effectiveHeight,
      }));
    } else {
      planos = PLANOS;
    }
  } catch {
    planos = PLANOS;
  }

  const hasil = planos
    .map((plano) => {
      const { best, orientasi } = hitungMata(plano.effW, plano.effH, paperWidth, paperHeight);
      return { ...plano, jumlahMata: best, orientasi };
    })
    .filter((p) => p.jumlahMata > 0)
    .sort((a, b) => b.jumlahMata - a.jumlahMata);

  if (hasil.length === 0) {
    return null;
  }

  return hasil[0]; // Plano terbaik = mata terbanyak
};

/**
 * Hitung harga material dari tabel MaterialPrice
 * @param {string} planoCode - Kode plano ("65x100" | "79x109" | "90x120")
 * @param {string} materialCode - Kode material ("duplex" | "ivory")
 * @param {number} thickness - GSM
 * @returns {Promise<number>} Harga per plano
 */
export const hitungHargaMaterial = async (planoCode, materialCode, thickness) => {
  const record = await prisma.materialPrice.findFirst({
    where: {
      planoCode,
      materialCode,
      thickness: parseInt(thickness),
      isActive: true,
    },
  });

  if (!record) {
    throw new Error(`Harga material tidak ditemukan: ${planoCode} × ${materialCode} × ${thickness}gsm`);
  }

  return record.price;
};

/**
 * Hitung harga warna berdasarkan GSM dan sisi cetak
 * @param {number} thickness - GSM
 * @param {string} colorSides - "1-sisi" | "2-sisi"
 * @returns {Promise<number>} Harga warna total
 */
export const hitungHargaWarna = async (thickness, colorSides) => {
  const parsedThickness = parseInt(thickness);
  const record = await prisma.colorPrice.findFirst({
    where: {
      thicknessMin: { lte: parsedThickness },
      thicknessMax: { gte: parsedThickness },
      isActive: true,
    },
  });

  if (!record) {
    throw new Error(`Harga warna tidak ditemukan untuk ${parsedThickness}gsm`);
  }

  const multiplier = colorSides === '2-sisi' ? 2 : 1;
  return record.pricePerSide * multiplier;
};

/**
 * Hitung harga laminasi dari dimensi plano
 * Formula: plano.width × plano.height × 0.3
 * @param {number} planoWidth - Lebar plano (cm)
 * @param {number} planoHeight - Panjang plano (cm)
 * @param {string} laminationSide - Sisi laminasi (jika "tanpa-laminasi", return 0)
 * @returns {number} Harga laminasi
 */
export const hitungHargaLaminasi = (planoWidth, planoHeight, laminationSide = '') => {
  if (laminationSide === 'tanpa-laminasi') {
    return 0;
  }
  return planoWidth * planoHeight * 0.3;
};

/**
 * Hitung total harga final
 * Formula: (hargaMaterial + hargaWarna + hargaLaminasi) × quantity × markup
 * @param {number} hargaMaterial
 * @param {number} hargaWarna
 * @param {number} hargaLaminasi
 * @param {number} quantity
 * @param {number} markup - Default 85
 * @returns {{ subtotalPerUnit: number, totalPrice: number }}
 */
export const hitungTotalHarga = (hargaMaterial, hargaWarna, hargaLaminasi, quantity, markup = 85) => {
  const subtotalPerUnit = hargaMaterial + hargaWarna + hargaLaminasi;
  const totalPrice = subtotalPerUnit * quantity * markup;
  return { subtotalPerUnit, totalPrice };
};

/**
 * Full pricing calculation — menggabungkan semua langkah
 * @param {object} orderData - Data pesanan lengkap
 * @returns {Promise<object>} Full price breakdown
 */
export const calculateFullPrice = async (orderData) => {
  const {
    boxModel,
    sizePanjang,
    sizeLebar,
    sizeTinggi,
    sizeTinggiTutup,
    material,
    materialThickness,
    colorOption,
    laminationSide,
    quantity,
  } = orderData;

  // Step 1: Hitung ukuran kertas
  const extras = {};
  if (sizeTinggiTutup) extras.tTutup = sizeTinggiTutup;
  if (orderData.lidah) extras.lidah = orderData.lidah;

  const { paperWidth, paperHeight } = hitungUkuranKertas(
    boxModel,
    sizePanjang,
    sizeLebar,
    sizeTinggi,
    extras
  );

  // Step 2: Rekomendasi plano
  const plano = await rekomendasiPlano(paperWidth, paperHeight);
  if (!plano) {
    throw new Error('Tidak ada plano yang cocok untuk ukuran kertas ini. Ukuran box mungkin terlalu besar.');
  }

  // Step 3: Harga material
  const hargaMaterial = await hitungHargaMaterial(plano.code, material, materialThickness);

  // Step 4: Harga warna
  const colorSides = orderData.colorSides || colorOption;
  const hargaWarna = await hitungHargaWarna(materialThickness, colorSides);

  // Step 5: Harga laminasi
  const hargaLaminasi = hitungHargaLaminasi(plano.width, plano.height, laminationSide);

  // Step 6: Total
  const parsedQuantity = parseInt(quantity);
  const markup = 85;
  const { subtotalPerUnit, totalPrice } = hitungTotalHarga(
    hargaMaterial,
    hargaWarna,
    hargaLaminasi,
    parsedQuantity,
    markup
  );

  return {
    // Ukuran kertas
    paperWidth,
    paperHeight,

    // Plano terpilih
    planoType: plano.code,
    planoWidth: plano.width,
    planoHeight: plano.height,
    jumlahMata: plano.jumlahMata,
    planoOrientation: plano.orientasi,

    // Breakdown harga
    hargaMaterial,
    hargaWarna,
    hargaLaminasi,
    subtotalPerUnit,
    markup,
    totalPrice,

    // Legacy compatibility
    subtotal: totalPrice,
    tax: 0,
    totalAmount: totalPrice,
  };
};
