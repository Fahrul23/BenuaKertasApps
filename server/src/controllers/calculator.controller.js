import {
  hitungUkuranKertas,
  rekomendasiPlano,
  hitungHargaMaterial,
  hitungHargaWarna,
  hitungHargaLaminasi,
  hitungTotalHarga,
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
 * POST /api/v1/calculator/price
 * Terima semua step data, return full price breakdown
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
      colorOption,
      colorSides,
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

    // Step 1: Paper size
    const { paperWidth, paperHeight } = hitungUkuranKertas(
      boxModel,
      panjang,
      lebar,
      tinggi,
      extras
    );

    // Step 2: Plano recommendation
    const plano = await rekomendasiPlano(paperWidth, paperHeight);
    if (!plano) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada plano yang cocok untuk ukuran ini.',
      });
    }

    const result = {
      paperWidth: Math.round(paperWidth * 100) / 100,
      paperHeight: Math.round(paperHeight * 100) / 100,
      planoType: plano.code,
      planoWidth: plano.width,
      planoHeight: plano.height,
      jumlahMata: plano.jumlahMata,
      planoOrientation: plano.orientasi,
      hargaMaterial: null,
      hargaWarna: null,
      hargaLaminasi: null,
      subtotalPerUnit: null,
      markup: 85,
      totalPrice: null,
    };

    // Step 3: Material price (if material data provided)
    if (material && materialThickness) {
      try {
        result.hargaMaterial = await hitungHargaMaterial(plano.code, material, materialThickness);
      } catch (err) {
        result.hargaMaterial = null;
        result.materialError = err.message;
      }
    }

    // Step 4: Color price (if color data provided)
    const resolvedColorSides = colorSides || colorOption;
    if (materialThickness && resolvedColorSides) {
      try {
        result.hargaWarna = await hitungHargaWarna(materialThickness, resolvedColorSides);
      } catch (err) {
        result.hargaWarna = null;
        result.warnaError = err.message;
      }
    }

    // Step 5: Lamination price (if lamination data provided)
    if (laminationSide) {
      result.hargaLaminasi = hitungHargaLaminasi(plano.width, plano.height, laminationSide);
    }

    // Step 6: Total price (if all components available)
    if (
      result.hargaMaterial !== null &&
      result.hargaWarna !== null &&
      result.hargaLaminasi !== null &&
      quantity
    ) {
      const { subtotalPerUnit, totalPrice } = hitungTotalHarga(
        result.hargaMaterial,
        result.hargaWarna,
        result.hargaLaminasi,
        parseInt(quantity),
        85
      );
      result.subtotalPerUnit = subtotalPerUnit;
      result.totalPrice = totalPrice;
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
 * Calculate complete order pricing (used by order creation)
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
