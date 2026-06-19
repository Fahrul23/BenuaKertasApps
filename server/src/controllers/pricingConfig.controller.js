import prisma from '../config/prisma.js';

/**
 * GET /api/master-data/pricing-config
 * Get global pricing config (always returns the first and only row, or creates default)
 */
export const getPricingConfig = async (req, res, next) => {
  try {
    let config = await prisma.pricingConfig.findFirst();
    if (!config) {
      config = await prisma.pricingConfig.create({
        data: {
          pondMultiplier: 85,
          packingDivisor: 500,
          packingMultiplier: 15000,
          laminasiMultiplier: 0.3,
          pisauPrice: 700000,
          dragThreshold: 1000
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/master-data/pricing-config
 * Update global pricing config
 */
export const updatePricingConfig = async (req, res, next) => {
  try {
    const {
      pondMultiplier,
      packingDivisor,
      packingMultiplier,
      laminasiMultiplier,
      pisauPrice,
      dragThreshold
    } = req.body;

    let config = await prisma.pricingConfig.findFirst();
    
    if (config) {
      config = await prisma.pricingConfig.update({
        where: { id: config.id },
        data: {
          pondMultiplier: pondMultiplier !== undefined ? parseFloat(pondMultiplier) : config.pondMultiplier,
          packingDivisor: packingDivisor !== undefined ? parseInt(packingDivisor) : config.packingDivisor,
          packingMultiplier: packingMultiplier !== undefined ? parseFloat(packingMultiplier) : config.packingMultiplier,
          laminasiMultiplier: laminasiMultiplier !== undefined ? parseFloat(laminasiMultiplier) : config.laminasiMultiplier,
          pisauPrice: pisauPrice !== undefined ? parseFloat(pisauPrice) : config.pisauPrice,
          dragThreshold: dragThreshold !== undefined ? parseInt(dragThreshold) : config.dragThreshold
        }
      });
    } else {
      config = await prisma.pricingConfig.create({
        data: {
          pondMultiplier: parseFloat(pondMultiplier) || 85,
          packingDivisor: parseInt(packingDivisor) || 500,
          packingMultiplier: parseFloat(packingMultiplier) || 15000,
          laminasiMultiplier: parseFloat(laminasiMultiplier) || 0.3,
          pisauPrice: parseFloat(pisauPrice) || 700000,
          dragThreshold: parseInt(dragThreshold) || 1000
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing config updated successfully',
      data: config,
    });
  } catch (error) {
    next(error);
  }
};
