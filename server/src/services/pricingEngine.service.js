import prisma from '../config/prisma.js';

/**
 * ============================================================
 * PRICING ENGINE SERVICE — v3
 * Formula Produksi Lengkap:
 *   totalBayar = hargaKertas + hargaCetak + hargaDrag + hargaPlat
 *              + hargaPisau + hargaPond + hargaPacking + hargaLaminasi
 * ============================================================
 */

// Plano constants (fallback jika DB belum ada data)
const PLANOS = [
  { code: '65x100', width: 65, height: 100, effW: 63, effH: 97.5 },
  { code: '79x109', width: 79, height: 109, effW: 77, effH: 106.5 },
  { code: '90x120', width: 90, height: 120, effW: 88, effH: 117.5 },
];

// Default PricingConfig jika DB belum ada data
const DEFAULT_PRICING_CONFIG = {
  pondMultiplier: 85,
  packingDivisor: 500,
  packingMultiplier: 15000,
  laminasiMultiplier: 0.3,
  pisauPrice: 700000,
  dragThreshold: 1000,
};

/**
 * Ambil PricingConfig (singleton) dari database
 * @returns {Promise<object>} Config object dengan semua multiplier
 */
const getPricingConfig = async () => {
  try {
    const config = await prisma.pricingConfig.findFirst();
    return config || DEFAULT_PRICING_CONFIG;
  } catch {
    return DEFAULT_PRICING_CONFIG;
  }
};

// ============================================================
// STEP A: Ukuran Aktual (paperWidth & paperHeight dari box formula)
// ============================================================

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
      const lidah = parseFloat(extras.lidah);
      if (!lidah || lidah <= 0) {
        throw new Error('Panjang lidah wajib diisi untuk model Earlock Box Samping.');
      }
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

    case 'clamshell-box':
      // P-Kertas = T + 2L + 2(T/2 + 1) = 2T + 2L + 2
      // L-Kertas = P + 2(T/2 + 1)       = T  + P  + 2
      return {
        paperWidth:  2 * parsedT + 2 * parsedL + 2,
        paperHeight: parsedT + parsedP + 2,
      };

    default:
      throw new Error(`Model box "${boxModel}" belum memiliki formula kalkulasi kertas.`);
  }
};

// ============================================================
// STEP A.2: Rekomendasi Plano
// ============================================================

/**
 * Hitung jumlah mata pada sebuah plano
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
 * @param {number} paperWidth
 * @param {number} paperHeight
 * @returns {Promise<object|null>} Plano terbaik dengan jumlahMata dan orientasi
 */
export const rekomendasiPlano = async (paperWidth, paperHeight) => {
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

  if (hasil.length === 0) return null;
  return hasil[0];
};

// ============================================================
// STEP B: Qty Plano & Qty Rim
// ============================================================

/**
 * Hitung qty plano = qtyBox ÷ jumlahMata ÷ 500
 * @param {number} qtyBox
 * @param {number} jumlahMata
 * @returns {number}
 */
export const hitungQtyPlano = (qtyBox, jumlahMata) => {
  return qtyBox / jumlahMata / 500;
};

/**
 * Hitung qty rim = qtyBox ÷ 500
 * (500 lembar = 1 rim; 1000=2 rim, 1500=3 rim, dst.)
 * @param {number} qtyBox
 * @returns {number}
 */
export const hitungQtyRim = (qtyBox) => {
  return Math.ceil(qtyBox / 500);
};

// ============================================================
// STEP C: Harga Kertas (lookup MaterialPrice)
// ============================================================

/**
 * Lookup harga kertas/plano dari tabel MaterialPrice
 * @param {string} planoCode
 * @param {string} materialCode
 * @param {number} thickness - GSM
 * @returns {Promise<number>}
 */
export const hitungHargaKertas = async (planoCode, materialCode, thickness) => {
  const record = await prisma.materialPrice.findFirst({
    where: {
      planoCode,
      materialCode,
      thickness: parseInt(thickness),
      isActive: true,
    },
  });

  if (!record) {
    throw new Error(`Harga kertas tidak ditemukan: ${planoCode} × ${materialCode} × ${thickness}gsm`);
  }

  return record.price;
};

// ============================================================
// STEP D: Harga Cetak, Drag, Plat (lookup CmykBlokPrice by gramatur range)
// ============================================================

/**
 * Lookup CmykBlokPrice berdasarkan range gramatur
 * @param {number} thickness - GSM
 * @returns {Promise<object>}
 */
const getCmykBlokPrice = async (thickness) => {
  const parsedThickness = parseInt(thickness);
  const record = await prisma.cmykBlokPrice.findFirst({
    where: {
      thicknessMin: { lte: parsedThickness },
      thicknessMax: { gte: parsedThickness },
      isActive: true,
    },
  });

  if (!record) {
    throw new Error(`Harga CMYK Blok tidak ditemukan untuk gramatur ${parsedThickness}gsm`);
  }

  return record;
};

/**
 * Harga cetak berdasarkan gramatur
 * @param {number} thickness
 * @returns {Promise<number>}
 */
export const hitungHargaCetak = async (thickness) => {
  const cmyk = await getCmykBlokPrice(thickness);
  return cmyk.cetakPrice;
};

/**
 * Harga drag = max(0, qtyBox - dragThreshold) × dragPrice
 * @param {number} qtyBox
 * @param {number} thickness
 * @returns {Promise<number>}
 */
export const hitungHargaDrag = async (qtyBox, thickness) => {
  const [cmyk, config] = await Promise.all([
    getCmykBlokPrice(thickness),
    getPricingConfig(),
  ]);
  const excessQty = Math.max(0, qtyBox - config.dragThreshold);
  return excessQty * cmyk.dragPrice;
};

/**
 * Harga plat (flat) dari CmykBlokPrice
 * @param {number} thickness
 * @returns {Promise<number>}
 */
export const hitungHargaPlat = async (thickness) => {
  const cmyk = await getCmykBlokPrice(thickness);
  return cmyk.platPrice;
};

// ============================================================
// STEP E: Harga Pisau (flat dari PricingConfig)
// ============================================================

/**
 * Harga pisau (flat, sama untuk semua order)
 * @returns {Promise<number>}
 */
export const hitungHargaPisau = async () => {
  const config = await getPricingConfig();
  return config.pisauPrice;
};

// ============================================================
// STEP F: Harga Pond
// ============================================================

/**
 * Harga pond = qtyBox × pondMultiplier (default 85)
 * @param {number} qtyBox
 * @returns {Promise<number>}
 */
export const hitungHargaPond = async (qtyBox) => {
  const config = await getPricingConfig();
  return qtyBox * config.pondMultiplier;
};

// ============================================================
// STEP G: Harga Packing
// ============================================================

/**
 * Harga packing = (qtyBox ÷ packingDivisor) × packingMultiplier
 * Default: (qtyBox ÷ 500) × 15000
 * @param {number} qtyBox
 * @returns {Promise<number>}
 */
export const hitungHargaPacking = async (qtyBox) => {
  const config = await getPricingConfig();
  return (qtyBox / config.packingDivisor) * config.packingMultiplier;
};

// ============================================================
// STEP H: Harga Laminasi
// ============================================================

/**
 * Harga laminasi = paperWidth × paperHeight × laminasiMultiplier × qtyBox
 * Default multiplier: 0.3
 * Jika laminationSide = "tanpa-laminasi", return 0
 * @param {number} paperWidth  - ukuran aktual (cm)
 * @param {number} paperHeight - ukuran aktual (cm)
 * @param {number} qtyBox
 * @param {string} laminationSide
 * @returns {Promise<number>}
 */
export const hitungHargaLaminasi = async (paperWidth, paperHeight, qtyBox, laminationSide = '') => {
  if (laminationSide === 'tanpa-laminasi') return 0;
  const config = await getPricingConfig();
  return paperWidth * paperHeight * config.laminasiMultiplier * qtyBox;
};

// ============================================================
// STEP I: Total Bayar & Harga per Pcs
// ============================================================

/**
 * Jumlahkan semua komponen harga
 */
const hitungTotalBayar = (components) => {
  return Object.values(components).reduce((sum, v) => sum + v, 0);
};

/**
 * Harga per pcs = totalBayar ÷ qtyBox
 */
const hitungHargaPerPcs = (totalBayar, qtyBox) => {
  return totalBayar / qtyBox;
};

// ============================================================
// MAIN: Orkestrasi kalkulasi lengkap (Pricing Engine v3)
// ============================================================

/**
 * Kalkulasi harga penuh — memanggil semua step A–I
 * @param {object} orderData - Data order dari request
 * @returns {Promise<object>} Full pricing breakdown
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
    laminationSide,
    quantity,
  } = orderData;

  const qtyBox = parseInt(quantity);

  // STEP A: Ukuran kertas
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

  // STEP A.2: Rekomendasi plano
  const plano = await rekomendasiPlano(paperWidth, paperHeight);
  if (!plano) {
    throw new Error('Tidak ada plano yang cocok untuk ukuran kertas ini. Ukuran box mungkin terlalu besar.');
  }

  // STEP B: Qty Plano & Rim
  const qtyPlano = hitungQtyPlano(qtyBox, plano.jumlahMata);
  const qtyRim = hitungQtyRim(qtyBox);

  // STEP C-H: Semua komponen harga (paralel untuk performa)
  const [
    hargaKertas,
    hargaCetak,
    hargaDrag,
    hargaPlat,
    hargaPisau,
    hargaPond,
    hargaPacking,
    hargaLaminasi,
  ] = await Promise.all([
    hitungHargaKertas(plano.code, material, materialThickness),
    hitungHargaCetak(materialThickness),
    hitungHargaDrag(qtyBox, materialThickness),
    hitungHargaPlat(materialThickness),
    hitungHargaPisau(),
    hitungHargaPond(qtyBox),
    hitungHargaPacking(qtyBox),
    hitungHargaLaminasi(paperWidth, paperHeight, qtyBox, laminationSide),
  ]);

  // STEP I: Total
  const totalBayar = hitungTotalBayar({
    hargaKertas,
    hargaCetak,
    hargaDrag,
    hargaPlat,
    hargaPisau,
    hargaPond,
    hargaPacking,
    hargaLaminasi,
  });
  const hargaPerPcs = hitungHargaPerPcs(totalBayar, qtyBox);

  return {
    // Plano info
    planoType: plano.code,
    paperWidth: Math.round(paperWidth * 100) / 100,
    paperHeight: Math.round(paperHeight * 100) / 100,
    jumlahMata: plano.jumlahMata,
    planoOrientation: plano.orientasi,
    qtyPlano: Math.round(qtyPlano * 1000) / 1000,
    qtyRim,

    // Breakdown harga
    hargaKertas,
    hargaCetak,
    hargaDrag,
    hargaPlat,
    hargaPisau,
    hargaPond,
    hargaPacking,
    hargaLaminasi,
    totalBayar,
    hargaPerPcs: Math.round(hargaPerPcs * 100) / 100,

    // Legacy compatibility
    totalPrice: totalBayar,
    subtotal: totalBayar,
    tax: 0,
    totalAmount: totalBayar,
  };
};
