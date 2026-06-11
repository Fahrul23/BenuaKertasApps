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
 * Get all box models (including inactive) - for admin
 */
export const getAllBoxModels = async () => {
  return await prisma.boxModel.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get box model by ID
 */
export const getBoxModelById = async (id) => {
  return await prisma.boxModel.findUnique({
    where: { id: parseInt(id) },
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

/**
 * Create new box model
 */
export const createBoxModel = async (data) => {
  return await prisma.boxModel.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      basePrice: data.basePrice ? parseFloat(data.basePrice) : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Update box model
 */
export const updateBoxModel = async (id, data) => {
  return await prisma.boxModel.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      basePrice: data.basePrice ? parseFloat(data.basePrice) : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Delete box model
 */
export const deleteBoxModel = async (id) => {
  return await prisma.boxModel.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle box model active status
 */
export const toggleBoxModelStatus = async (id) => {
  const boxModel = await prisma.boxModel.findUnique({
    where: { id: parseInt(id) },
  });

  if (!boxModel) {
    throw new Error('Box model not found');
  }

  return await prisma.boxModel.update({
    where: { id: parseInt(id) },
    data: {
      isActive: !boxModel.isActive,
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
    },
  });
};

/**
 * Get all materials (including inactive) - for admin
 */
export const getAllMaterials = async () => {
  return await prisma.material.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get material by ID
 */
export const getMaterialById = async (id) => {
  return await prisma.material.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new material
 */
export const createMaterial = async (data) => {
  return await prisma.material.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Update material
 */
export const updateMaterial = async (id, data) => {
  return await prisma.material.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Delete material
 */
export const deleteMaterial = async (id) => {
  return await prisma.material.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle material active status
 */
export const toggleMaterialStatus = async (id) => {
  const material = await prisma.material.findUnique({
    where: { id: parseInt(id) },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  return await prisma.material.update({
    where: { id: parseInt(id) },
    data: {
      isActive: !material.isActive,
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
      category: true,
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
      category: true,
    },
  });
};

// ==========================================
// FINISHING OPTIONS (additional CRUD)
// ==========================================

/**
 * Get all finishing options (including inactive) - for admin
 */
export const getAllFinishingOptions = async () => {
  return await prisma.finishingOption.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get finishing option by ID
 */
export const getFinishingOptionById = async (id) => {
  return await prisma.finishingOption.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new finishing option
 */
export const createFinishingOption = async (data) => {
  return await prisma.finishingOption.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      category: data.category,
    },
  });
};

/**
 * Update finishing option
 */
export const updateFinishingOption = async (id, data) => {
  return await prisma.finishingOption.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      category: data.category,
    },
  });
};

/**
 * Delete finishing option
 */
export const deleteFinishingOption = async (id) => {
  return await prisma.finishingOption.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle finishing option active status
 */
export const toggleFinishingOptionStatus = async (id) => {
  const option = await prisma.finishingOption.findUnique({
    where: { id: parseInt(id) },
  });

  if (!option) {
    throw new Error('Finishing option not found');
  }

  return await prisma.finishingOption.update({
    where: { id: parseInt(id) },
    data: { isActive: !option.isActive },
  });
};

// ==========================================
// PRICING RULES — 7-field matrix (NO FK)
// ==========================================

/**
 * Validasi manual input PricingRule ke master data
 * Karena tidak ada FK constraint, validasi dilakukan di aplikasi
 */
export const validatePricingRuleInput = async (input) => {
  // Standarisasi nilai laminationPart agar kompatibel dengan data seed (luar -> sisi-luar, luar-dalam -> luar-dan-dalam)
  if (input.laminationPart) {
    const lower = input.laminationPart.toLowerCase().trim();
    if (lower === 'luar') input.laminationPart = 'sisi-luar';
    else if (lower === 'luar-dalam') input.laminationPart = 'luar-dan-dalam';
  }

  const [boxModel, material, finishing, qty] = await Promise.all([
    prisma.boxModel.findUnique({ where: { code: input.boxModelCode } }),
    prisma.material.findUnique({ where: { code: input.materialCode } }),
    prisma.finishingOption.findFirst({ where: { code: input.laminationPart } }),
    // quantityTier adalah integer bebas (tidak ada tabel QuantityTier), skip validasi ke tabel lain
  ]);

  if (!boxModel)  throw new Error(`BoxModel tidak ditemukan: ${input.boxModelCode}`);
  if (!material)  throw new Error(`Material tidak ditemukan: ${input.materialCode}`);
  if (!finishing && input.laminationPart !== 'tanpa-laminasi') {
    throw new Error(`FinishingOption tidak ditemukan: ${input.laminationPart}`);
  }
  if (!input.quantityTier || input.quantityTier <= 0) {
    throw new Error('quantityTier harus berupa angka positif');
  }
  if (!input.thickness || ![300, 350, 400, 450].includes(parseInt(input.thickness))) {
    throw new Error('thickness harus salah satu dari: 300, 350, 400, 450');
  }
  if (!['1-sisi', '2-sisi'].includes(input.colorSides)) {
    throw new Error('colorSides harus "1-sisi" atau "2-sisi"');
  }

  // Validasi laminationType
  if (input.laminationPart !== 'tanpa-laminasi' && !input.laminationType) {
    throw new Error('laminationType wajib diisi jika laminationPart bukan tanpa-laminasi');
  }
  if (input.laminationPart === 'tanpa-laminasi' && input.laminationType) {
    throw new Error('laminationType harus null jika laminationPart adalah tanpa-laminasi');
  }
};

/**
 * Upsert PricingRule (insert atau update berdasarkan kombinasi 7 field)
 */
export const upsertPricingRule = async (input) => {
  await validatePricingRuleInput(input);

  const laminationType = input.laminationPart === 'tanpa-laminasi' ? null : (input.laminationType ?? null);
  const thickness = parseInt(input.thickness);
  const quantityTier = parseInt(input.quantityTier);

  try {
    return await prisma.pricingRule.upsert({
      where: {
        boxModelCode_materialCode_thickness_colorSides_laminationPart_laminationType_quantityTier: {
          boxModelCode:   input.boxModelCode,
          materialCode:   input.materialCode,
          thickness,
          colorSides:     input.colorSides,
          laminationPart: input.laminationPart,
          laminationType,
          quantityTier,
        },
      },
      update: {
        pricePerUnit: parseFloat(input.pricePerUnit),
        shippingCost: input.shippingCost != null ? parseFloat(input.shippingCost) : null,
        isActive: input.isActive !== undefined ? input.isActive : true,
      },
      create: {
        boxModelCode:   input.boxModelCode,
        materialCode:   input.materialCode,
        thickness,
        colorSides:     input.colorSides,
        laminationPart: input.laminationPart,
        laminationType,
        quantityTier,
        pricePerUnit:   parseFloat(input.pricePerUnit),
        shippingCost:   input.shippingCost != null ? parseFloat(input.shippingCost) : null,
        isActive:       input.isActive !== undefined ? input.isActive : true,
      },
    });
  } catch (e) {
    if (e.code === 'P2002') {
      throw new Error('Kombinasi harga ini sudah ada. Gunakan update.');
    }
    throw e;
  }
};

/**
 * Lookup harga dari PricingRule berdasarkan 7 field kombinasi
 * Digunakan saat user submit order
 */
export const lookupPrice = async (order) => {
  const quantityTier = parseInt(order.quantityTier);

  if (!quantityTier || quantityTier <= 0) {
    return { found: false, reason: 'custom_quantity' };
  }

  // Standarisasi nilai laminationPart agar kompatibel dengan data seed
  if (order.laminationPart) {
    const lower = order.laminationPart.toLowerCase().trim();
    if (lower === 'luar') order.laminationPart = 'sisi-luar';
    else if (lower === 'luar-dalam') order.laminationPart = 'luar-dan-dalam';
  }

  const laminationType = order.laminationPart === 'tanpa-laminasi'
    ? null
    : (order.laminationType ?? null);

  const rule = await prisma.pricingRule.findFirst({
    where: {
      boxModelCode:   order.boxModelCode || order.boxModel,
      materialCode:   order.materialCode || order.material,
      thickness:      parseInt(order.thickness),
      colorSides:     order.colorSides,
      laminationPart: order.laminationPart,
      laminationType,
      quantityTier,
      isActive:       true,
    },
  });

  if (!rule) {
    return { found: false, reason: 'price_not_set' };
  }

  const totalPrice = parseFloat(rule.pricePerUnit) * quantityTier;

  return {
    found:        true,
    pricePerUnit: parseFloat(rule.pricePerUnit),
    shippingCost: rule.shippingCost ? parseFloat(rule.shippingCost) : null,
    totalPrice,
    ruleId:       rule.id,
  };
};

/**
 * Get all active pricing rules
 */
export const getActivePricingRules = async () => {
  return await prisma.pricingRule.findMany({
    where: { isActive: true },
    orderBy: [
      { boxModelCode: 'asc' },
      { materialCode: 'asc' },
      { thickness: 'asc' },
      { quantityTier: 'asc' },
    ],
    select: {
      id: true,
      boxModelCode: true,
      materialCode: true,
      thickness: true,
      colorSides: true,
      laminationPart: true,
      laminationType: true,
      quantityTier: true,
      pricePerUnit: true,
      shippingCost: true,
    },
  });
};

/**
 * Get all pricing rules (including inactive) - for admin
 */
export const getAllPricingRules = async () => {
  return await prisma.pricingRule.findMany({
    orderBy: [
      { boxModelCode: 'asc' },
      { materialCode: 'asc' },
      { thickness: 'asc' },
      { quantityTier: 'asc' },
    ],
  });
};

/**
 * Get pricing rule by ID
 */
export const getPricingRuleById = async (id) => {
  return await prisma.pricingRule.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new pricing rule (dengan validasi manual)
 */
export const createPricingRule = async (data) => {
  return await upsertPricingRule(data);
};

/**
 * Update pricing rule by ID
 */
export const updatePricingRuleById = async (id, data) => {
  await validatePricingRuleInput(data);

  const laminationType = data.laminationPart === 'tanpa-laminasi' ? null : (data.laminationType ?? null);

  try {
    return await prisma.pricingRule.update({
      where: { id: parseInt(id) },
      data: {
        boxModelCode:   data.boxModelCode,
        materialCode:   data.materialCode,
        thickness:      parseInt(data.thickness),
        colorSides:     data.colorSides,
        laminationPart: data.laminationPart,
        laminationType,
        quantityTier:   parseInt(data.quantityTier),
        pricePerUnit:   parseFloat(data.pricePerUnit),
        shippingCost:   data.shippingCost != null ? parseFloat(data.shippingCost) : null,
        isActive:       data.isActive !== undefined ? data.isActive : true,
      },
    });
  } catch (e) {
    if (e.code === 'P2002') {
      throw new Error('Kombinasi 7 field ini sudah digunakan oleh baris lain. Ubah salah satu field.');
    }
    throw e;
  }
};

/**
 * Delete pricing rule
 */
export const deletePricingRule = async (id) => {
  return await prisma.pricingRule.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle pricing rule active status
 */
export const togglePricingRuleStatus = async (id) => {
  const rule = await prisma.pricingRule.findUnique({
    where: { id: parseInt(id) },
  });

  if (!rule) {
    throw new Error('Pricing rule not found');
  }

  return await prisma.pricingRule.update({
    where: { id: parseInt(id) },
    data: { isActive: !rule.isActive },
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

/**
 * Get all bank accounts (both active & inactive, Admin only)
 */
export const getAllBankAccounts = async () => {
  return await prisma.bank_accounts.findMany({
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Get bank account by ID
 */
export const getBankAccountById = async (id) => {
  return await prisma.bank_accounts.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create bank account
 */
export const createBankAccount = async (data) => {
  const { bankName, accountNumber, accountHolderName, branch, isActive, displayOrder } = data;

  const existing = await prisma.bank_accounts.findFirst({
    where: {
      bankName,
      accountNumber,
    },
  });

  if (existing) {
    throw new Error('Rekening bank dengan nomor ini sudah terdaftar');
  }

  return await prisma.bank_accounts.create({
    data: {
      bankName,
      accountNumber,
      accountHolderName,
      branch,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder != null ? parseInt(displayOrder) : 0,
      updatedAt: new Date(),
    },
  });
};

/**
 * Update bank account
 */
export const updateBankAccount = async (id, data) => {
  return await prisma.bank_accounts.update({
    where: { id: parseInt(id) },
    data: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      branch: data.branch,
      isActive: data.isActive !== undefined ? data.isActive : true,
      displayOrder: data.displayOrder != null ? parseInt(data.displayOrder) : 0,
      updatedAt: new Date(),
    },
  });
};

/**
 * Toggle bank account status
 */
export const toggleBankAccountStatus = async (id) => {
  const acc = await prisma.bank_accounts.findUnique({
    where: { id: parseInt(id) },
  });

  if (!acc) {
    throw new Error('Rekening bank tidak ditemukan');
  }

  return await prisma.bank_accounts.update({
    where: { id: parseInt(id) },
    data: {
      isActive: !acc.isActive,
      updatedAt: new Date(),
    },
  });
};

/**
 * Delete bank account
 */
export const deleteBankAccount = async (id) => {
  return await prisma.bank_accounts.delete({
    where: { id: parseInt(id) },
  });
};

// ==========================================
// PRICE CALCULATION (menggunakan PricingRule 7-field)
// ==========================================

/**
 * Calculate order price menggunakan PricingRule matrix 7-field
 * Jika kombinasi tidak ditemukan di PricingRule, kembalikan found=false
 * @param {Object} orderData - Data order dari form
 */
export const calculateOrderPrice = async (orderData) => {
  const {
    boxModel,
    material,
    thickness,
    colorSides,
    laminationSide,   // alias laminationPart
    laminationPart,
    laminationType,
    quantity,
  } = orderData;

  const resolvedLaminationPart = laminationPart || laminationSide;
  const resolvedLaminationType = resolvedLaminationPart === 'tanpa-laminasi' ? null : (laminationType || null);

  // Cari PricingRule berdasarkan 7 field
  const priceResult = await lookupPrice({
    boxModelCode:   boxModel,
    materialCode:   material,
    thickness:      parseInt(thickness),
    colorSides,
    laminationPart: resolvedLaminationPart,
    laminationType: resolvedLaminationType,
    quantityTier:   parseInt(quantity),
  });

  if (!priceResult.found) {
    return {
      found:          false,
      reason:         priceResult.reason,
      message:        priceResult.reason === 'price_not_set'
                        ? 'Harga untuk kombinasi ini belum diatur oleh admin. Silakan hubungi kami.'
                        : 'Silakan masukkan quantity yang valid.',
      boxModel,
      material,
      thickness,
      colorSides,
      laminationPart: resolvedLaminationPart,
      laminationType: resolvedLaminationType,
      quantity,
    };
  }

  const pricePerUnit = priceResult.pricePerUnit;
  const shippingCost = priceResult.shippingCost || 0;
  const subtotal = pricePerUnit * parseInt(quantity);
  const tax = subtotal * 0.11; // PPN 11%
  const totalAmount = subtotal + tax + shippingCost;

  return {
    found:          true,
    pricePerUnit,
    shippingCost,
    quantity:       parseInt(quantity),
    subtotal:       subtotal.toFixed(2),
    tax:            tax.toFixed(2),
    totalAmount:    totalAmount.toFixed(2),
    ruleId:         priceResult.ruleId,
    // Info kombinasi
    boxModel,
    material,
    thickness,
    colorSides,
    laminationPart: resolvedLaminationPart,
    laminationType: resolvedLaminationType,
  };
};

