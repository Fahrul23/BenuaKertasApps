import {
  hitungUkuranKertas,
  rekomendasiPlano,
  hitungQtyPlano,
  hitungQtyRim,
  hitungHargaKertas,
  hitungHargaCetak,
  hitungHargaDrag,
  hitungHargaPlat,
  hitungHargaPisau,
  hitungHargaPond,
  hitungHargaPacking,
  hitungHargaLaminasi,
  calculateFullPrice,
} from '../services/pricingEngine.service.js';

/**
 * POST /api/v1/calculator/plano
 * Terima ukuran box, return rekomendasi plano + jumlah mata
 */
export const calculatePlano = async (req, res) => {
  try {
    const { boxModel, panjang, lebar, tinggi, tinggiTutup, lidah } = req.body;

    if (!boxModel || !panjang || !lebar || !tinggi) {
      return res.status(400).json({
        success: false,
        message: 'boxModel, panjang, lebar, dan tinggi wajib diisi.',
      });
    }

    // Hitung ukuran kertas
    const extras = {};
    if (tinggiTutup) extras.tTutup = tinggiTutup;
    if (lidah) extras.lidah = lidah;

    const { paperWidth, paperHeight } = hitungUkuranKertas(
      boxModel,
      panjang,
      lebar,
      tinggi,
      extras
    );

    // Rekomendasi plano
    const plano = await rekomendasiPlano(paperWidth, paperHeight);

    if (!plano) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada plano yang cocok untuk ukuran kertas ini. Ukuran box mungkin terlalu besar.',
      });
    }

    return res.json({
      success: true,
      data: {
        paperWidth: Math.round(paperWidth * 100) / 100,
        paperHeight: Math.round(paperHeight * 100) / 100,
        planoType: plano.code,
        planoWidth: plano.width,
        planoHeight: plano.height,
        jumlahMata: plano.jumlahMata,
        planoOrientation: plano.orientasi,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/v1/calculator/pricing
 * Endpoint utama v3 — kalkulasi harga produksi lengkap
 * Body: { boxModel, panjang, lebar, tinggi, tinggiTutup?, lidah?,
 *          material, materialThickness, laminationSide, quantity }
 * Response: full pricing breakdown (8 komponen + total + per pcs)
 */
export const calculatePricing = async (req, res) => {
  try {
    const {
      boxModel,
      panjang,
      lebar,
      tinggi,
      tinggiTutup,
      lidah,
      material,
      materialThickness,
      laminationSide,
      quantity,
    } = req.body;

    // Validate required fields
    if (!boxModel || !panjang || !lebar || !tinggi) {
      return res.status(400).json({
        success: false,
        message: 'boxModel, panjang, lebar, dan tinggi wajib diisi.',
      });
    }

    // Validate quantity: minimal 1000, kelipatan 500
    const qtyBox = parseInt(quantity);
    if (quantity && (qtyBox < 1000 || qtyBox % 500 !== 0)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity minimal 1000 pcs (2 rim) dan harus kelipatan 500.',
      });
    }

    // Map request body ke format yang dipakai calculateFullPrice
    const orderData = {
      boxModel,
      sizePanjang: panjang,
      sizeLebar: lebar,
      sizeTinggi: tinggi,
      sizeTinggiTutup: tinggiTutup || null,
      lidah: lidah || null,
      material,
      materialThickness,
      laminationSide,
      quantity,
    };

    const result = await calculateFullPrice(orderData);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/v1/calculator/price
 * Kalkulasi progresif (partial — setiap step user mengisi data)
 * Jika quantity + material + laminationSide sudah tersedia, hitung full pricing
 */
export const calculatePrice = async (req, res) => {
  try {
    const {
      boxModel,
      panjang,
      lebar,
      tinggi,
      tinggiTutup,
      lidah,
      material,
      materialThickness,
      laminationSide,
      quantity,
    } = req.body;

    // Validate required fields
    if (!boxModel || !panjang || !lebar || !tinggi) {
      return res.status(400).json({
        success: false,
        message: 'boxModel, panjang, lebar, dan tinggi wajib diisi.',
      });
    }

    // Build partial calculation based on what's available
    const extras = {};
    if (tinggiTutup) extras.tTutup = tinggiTutup;
    if (lidah) extras.lidah = lidah;

    // Step 1: Paper size + plano
    const { paperWidth, paperHeight } = hitungUkuranKertas(
      boxModel, panjang, lebar, tinggi, extras
    );
    const plano = await rekomendasiPlano(paperWidth, paperHeight);
    if (!plano) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada plano yang cocok untuk ukuran ini.',
      });
    }

    const qtyBox = quantity ? parseInt(quantity) : null;

    // Inisialisasi result — hanya data yang dikirim ke frontend
    const result = {
      paperWidth: Math.round(paperWidth * 100) / 100,
      paperHeight: Math.round(paperHeight * 100) / 100,
      planoType: plano.code,
      planoWidth: plano.width,
      planoHeight: plano.height,
      jumlahMata: plano.jumlahMata,
      planoOrientation: plano.orientasi,
      qtyPlano: null,
      qtyRim: null,
      totalBayar: null,
      hargaPerPcs: null,
    };

    // Qty breakdown
    if (qtyBox) {
      result.qtyPlano = Math.round(hitungQtyPlano(qtyBox, plano.jumlahMata) * 1000) / 1000;
      result.qtyRim = hitungQtyRim(qtyBox);
    }

    // Hitung semua komponen harga secara internal (tidak dikembalikan ke frontend)
    let hargaKertas = null;
    let hargaCetak = null;
    let hargaDrag = null;
    let hargaPlat = null;
    let hargaPisau = null;
    let hargaPond = null;
    let hargaPacking = null;
    let hargaLaminasi = null;

    if (material && materialThickness) {
      try {
        hargaKertas = await hitungHargaKertas(plano.code, material, materialThickness);
      } catch (err) {
        result.hargaKertasError = err.message;
      }
    }

    if (materialThickness) {
      try {
        hargaCetak = await hitungHargaCetak(materialThickness);
        hargaPlat = await hitungHargaPlat(materialThickness);
        if (qtyBox) {
          hargaDrag = await hitungHargaDrag(qtyBox, materialThickness);
        }
      } catch (err) {
        result.cmykError = err.message;
      }
    }

    if (qtyBox) {
      try {
        hargaPisau = await hitungHargaPisau();
        hargaPond = await hitungHargaPond(qtyBox);
        hargaPacking = await hitungHargaPacking(qtyBox);
      } catch (err) {
        result.fixedCostError = err.message;
      }
    }

    if (laminationSide && qtyBox) {
      try {
        hargaLaminasi = await hitungHargaLaminasi(
          paperWidth, paperHeight, qtyBox, laminationSide
        );
      } catch (err) {
        result.laminasiError = err.message;
      }
    }

    // Hitung total jika semua komponen tersedia
    if (
      hargaKertas !== null &&
      hargaCetak !== null &&
      hargaDrag !== null &&
      hargaPlat !== null &&
      hargaPisau !== null &&
      hargaPond !== null &&
      hargaPacking !== null &&
      hargaLaminasi !== null &&
      qtyBox
    ) {
      result.totalBayar =
        hargaKertas +
        hargaCetak +
        hargaDrag +
        hargaPlat +
        hargaPisau +
        hargaPond +
        hargaPacking +
        hargaLaminasi;
      result.hargaPerPcs = Math.round((result.totalBayar / qtyBox) * 100) / 100;
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/v1/calculator/full
 * Kalkulasi harga lengkap (digunakan saat submit order)
 */
export const calculateFullOrderPrice = async (req, res) => {
  try {
    const result = await calculateFullPrice(req.body);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
