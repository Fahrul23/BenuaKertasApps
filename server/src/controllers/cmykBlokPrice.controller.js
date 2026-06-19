import prisma from '../config/prisma.js';

/**
 * GET /api/master-data/cmyk-blok-prices
 * Get all active CMYK Blok prices
 */
export const getCmykBlokPrices = async (req, res, next) => {
  try {
    const prices = await prisma.cmykBlokPrice.findMany({
      where: { isActive: true },
      orderBy: { thicknessMin: 'asc' },
    });
    
    res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/master-data/cmyk-blok-prices/all
 * Get all CMYK Blok prices (including inactive) - for admin
 */
export const getAllCmykBlokPrices = async (req, res, next) => {
  try {
    const prices = await prisma.cmykBlokPrice.findMany({
      orderBy: { thicknessMin: 'asc' },
    });
    
    res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/master-data/cmyk-blok-prices
 * Create new CMYK Blok price rule
 */
export const createCmykBlokPrice = async (req, res, next) => {
  try {
    const { thicknessMin, thicknessMax, cetakPrice, dragPrice, platPrice, isActive } = req.body;
    
    const newPrice = await prisma.cmykBlokPrice.create({
      data: {
        thicknessMin: parseInt(thicknessMin),
        thicknessMax: parseInt(thicknessMax),
        cetakPrice: parseFloat(cetakPrice),
        dragPrice: parseFloat(dragPrice),
        platPrice: parseFloat(platPrice),
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Harga CMYK & Blok berhasil dibuat',
      data: newPrice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/master-data/cmyk-blok-prices/:id
 * Update CMYK Blok price rule
 */
export const updateCmykBlokPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { thicknessMin, thicknessMax, cetakPrice, dragPrice, platPrice, isActive } = req.body;
    
    const data = {};
    if (thicknessMin !== undefined) data.thicknessMin = parseInt(thicknessMin);
    if (thicknessMax !== undefined) data.thicknessMax = parseInt(thicknessMax);
    if (cetakPrice !== undefined) data.cetakPrice = parseFloat(cetakPrice);
    if (dragPrice !== undefined) data.dragPrice = parseFloat(dragPrice);
    if (platPrice !== undefined) data.platPrice = parseFloat(platPrice);
    if (isActive !== undefined) data.isActive = isActive;

    const updatedPrice = await prisma.cmykBlokPrice.update({
      where: { id: parseInt(id) },
      data
    });

    res.status(200).json({
      success: true,
      message: 'Harga CMYK & Blok berhasil diperbarui',
      data: updatedPrice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/master-data/cmyk-blok-prices/:id
 * Delete CMYK Blok price rule
 */
export const deleteCmykBlokPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.cmykBlokPrice.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Harga CMYK & Blok berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/master-data/cmyk-blok-prices/:id/toggle
 * Toggle active status
 */
export const toggleCmykBlokPriceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const current = await prisma.cmykBlokPrice.findUnique({
      where: { id: parseInt(id) }
    });

    if (!current) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    const updated = await prisma.cmykBlokPrice.update({
      where: { id: parseInt(id) },
      data: { isActive: !current.isActive }
    });

    res.status(200).json({
      success: true,
      message: `Status berhasil diubah menjadi ${updated.isActive ? 'Aktif' : 'Nonaktif'}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
