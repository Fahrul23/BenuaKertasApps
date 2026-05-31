import prisma from '../config/prisma.js';

/**
 * Master Data Service
 * Handles all master data operations for custom orders
 */

// ==========================================
// BOX MODELS
// ==========================================

/**
 * Get all active box models
 */
export const getActiveBoxModels = async () => {
  return await prisma.boxModel.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      basePrice: true,
    },
  });
};

/**
 * Get box model by code
 */
export const getBoxModelByCode = async (code) => {
  return await prisma.boxModel.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      basePrice: true,
    },
  });
};

// ==========================================
// MATERIALS
// ==========================================

/**
 * Get all active materials
 */
export const getActiveMaterials = async () => {
  return await prisma.material.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      price300gsm: true,
      price350gsm: true,
      price400gsm: true,
      price450gsm: true,
    },
  });
};

/**
 * Get material by code
 */
export const getMaterialByCode = async (code) => {
  return await prisma.material.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      price300gsm: true,
      price350gsm: true,
      price400gsm: true,
      price450gsm: true,
    },
  });
};

/**
 * Get material price by code and thickness
 */
export const getMaterialPrice = async (code, thickness) => {
  const material = await prisma.material.findUnique({
    where: { code },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  const priceField = `price${thickness}gsm`;
  const price = material[priceField];

  if (!price) {
    throw new Error(`Price not available for thickness ${thickness}gsm`);
  }

  return price;
};

// ==========================================
// FINISHING OPTIONS
// ==========================================

/**
 * Get all active finishing options
 */
export const getActiveFinishingOptions = async () => {
  return await prisma.finishingOption.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      additionalPrice: true,
    },
  });
};

/**
 * Get finishing option by code
 */
export const getFinishingOptionByCode = async (code) => {
  return await prisma.finishingOption.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      additionalPrice: true,
    },
  });
};

// ==========================================
// PRICING RULES
// ==========================================

/**
 * Get all active pricing rules
 */
export const getActivePricingRules = async () => {
  return await prisma.pricingRule.findMany({
    where: { isActive: true },
    orderBy: { minQuantity: 'asc' },
    select: {
      id: true,
      name: true,
      minQuantity: true,
      maxQuantity: true,
      minTotalArea: true,
      maxTotalArea: true,
      pricePerUnit: true,
      discountPercent: true,
    },
  });
};

/**
 * Get pricing rule by quantity
 */
export const getPricingRuleByQuantity = async (quantity) => {
  return await prisma.pricingRule.findFirst({
    where: {
      isActive: true,
      minQuantity: { lte: quantity },
      OR: [
        { maxQuantity: { gte: quantity } },
        { maxQuantity: null },
      ],
    },
    orderBy: { minQuantity: 'desc' },
  });
};

// ==========================================
// BANK ACCOUNTS
// ==========================================

/**
 * Get all active bank accounts
 */
export const getActiveBankAccounts = async () => {
  return await prisma.bank_accounts.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      bankName: true,
      accountNumber: true,
      accountHolderName: true,
      branch: true,
    },
  });
};

// ==========================================
// PRICE CALCULATION
// ==========================================

/**
 * Calculate order price
 * @param {Object} orderData - Order data
 * @param {string} orderData.boxModel - Box model code
 * @param {number} orderData.length - Length in cm
 * @param {number} orderData.width - Width in cm
 * @param {number} orderData.height - Height in cm
 * @param {number} orderData.heightLid - Height of lid in cm (optional)
 * @param {string} orderData.material - Material code
 * @param {number} orderData.thickness - Material thickness (300, 350, 400, 450)
 * @param {string} orderData.finishing - Finishing option code
 * @param {number} orderData.quantity - Quantity
 */
export const calculateOrderPrice = async (orderData) => {
  const {
    boxModel,
    length,
    width,
    height,
    heightLid = 0,
    material,
    thickness,
    finishing,
    quantity,
  } = orderData;

  // 1. Get box model base price
  const boxModelData = await getBoxModelByCode(boxModel);
  if (!boxModelData) {
    throw new Error('Box model not found');
  }
  const basePrice = parseFloat(boxModelData.basePrice || 0);

  // 2. Get material price
  const materialPrice = await getMaterialPrice(material, thickness);

  // 3. Get finishing additional price
  const finishingData = await getFinishingOptionByCode(finishing);
  if (!finishingData) {
    throw new Error('Finishing option not found');
  }
  const finishingPrice = parseFloat(finishingData.additionalPrice || 0);

  // 4. Calculate total area (in cm²)
  // Formula: (length * width * 2) + (length * height * 2) + (width * height * 2)
  // For top-bottom box, add lid area
  let totalArea = (length * width * 2) + (length * height * 2) + (width * height * 2);
  if (heightLid > 0) {
    totalArea += (length * width * 2) + (length * heightLid * 2) + (width * heightLid * 2);
  }

  // Convert to m² for calculation
  const totalAreaM2 = totalArea / 10000;

  // 5. Calculate price per unit
  // Formula: (basePrice + materialPrice + finishingPrice) * totalAreaM2
  const pricePerUnit = (basePrice + parseFloat(materialPrice) + finishingPrice) * totalAreaM2;

  // 6. Calculate subtotal
  const subtotal = pricePerUnit * quantity;

  // 7. Get pricing rule for discount
  const pricingRule = await getPricingRuleByQuantity(quantity);
  const discountPercent = pricingRule ? parseFloat(pricingRule.discountPercent || 0) : 0;
  const discountAmount = subtotal * (discountPercent / 100);

  // 8. Calculate final amounts
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.11; // PPN 11%
  const totalAmount = subtotalAfterDiscount + tax;

  return {
    basePrice,
    materialPrice: parseFloat(materialPrice),
    finishingPrice,
    totalArea: totalArea.toFixed(2),
    totalAreaM2: totalAreaM2.toFixed(4),
    pricePerUnit: pricePerUnit.toFixed(2),
    quantity,
    subtotal: subtotal.toFixed(2),
    discountPercent,
    discountAmount: discountAmount.toFixed(2),
    subtotalAfterDiscount: subtotalAfterDiscount.toFixed(2),
    tax: tax.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    pricingRule: pricingRule ? {
      name: pricingRule.name,
      minQuantity: pricingRule.minQuantity,
      maxQuantity: pricingRule.maxQuantity,
    } : null,
  };
};
