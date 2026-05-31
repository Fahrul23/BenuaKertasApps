import prisma from '../src/config/prisma.js';

async function main() {
  console.log('🌱 Starting master data seeder...\n');

  // ==========================================
  // 1. Seed BoxModel
  // ==========================================
  console.log('📦 Seeding box models...');
  
  const boxModels = [
    {
      code: 'earlock-box-depan',
      name: 'Earlock Box Depan',
      description: 'Box dengan lock di bagian depan untuk kemudahan akses',
      imageUrl: '/assets/earlock-box-depan.svg',
      isActive: true,
      basePrice: 5000,
    },
    {
      code: 'earlock-box-samping',
      name: 'Earlock Box Samping',
      description: 'Box dengan lock di bagian samping untuk tampilan yang unik',
      imageUrl: '/assets/earlock-box-samping.svg',
      isActive: true,
      basePrice: 5200,
    },
    {
      code: 'top-bottom-box',
      name: 'Top Bottom Box',
      description: 'Box dengan tutup terpisah, cocok untuk produk premium',
      imageUrl: '/assets/top-bottom-box.svg',
      isActive: true,
      basePrice: 6000,
    },
    {
      code: 'lunch-box',
      name: 'Lunch Box',
      description: 'Box khusus untuk kemasan makanan',
      imageUrl: '/assets/lunch-box.svg',
      isActive: true,
      basePrice: 4800,
    },
    {
      code: 'clamshell-box',
      name: 'Clamshell Box',
      description: 'Box dengan engsel untuk kemudahan buka tutup',
      imageUrl: '/assets/clamshell-box.svg',
      isActive: true,
      basePrice: 5300,
    },
    {
      code: 'tray-box',
      name: 'Tray Box',
      description: 'Box berbentuk tray untuk display produk',
      imageUrl: '/assets/tray-box.svg',
      isActive: true,
      basePrice: 4200,
    },
  ];

  for (const boxModel of boxModels) {
    const existing = await prisma.boxModel.findUnique({
      where: { code: boxModel.code },
    });

    if (!existing) {
      await prisma.boxModel.create({ data: boxModel });
      console.log(`✅ Box model created: ${boxModel.name}`);
    } else {
      console.log(`⚠️  Box model already exists: ${boxModel.name}`);
    }
  }
  console.log('');

  // ==========================================
  // 2. Seed Material
  // ==========================================
  console.log('📄 Seeding materials...');
  
  const materials = [
    {
      code: 'duplex',
      name: 'Duplex',
      description: 'Kertas duplex berkualitas tinggi dengan permukaan halus',
      imageUrl: '/assets/duplex.svg',
      isActive: true,
      price300gsm: 450,
      price350gsm: 520,
      price400gsm: 600,
      price450gsm: 680,
    },
    {
      code: 'ivory',
      name: 'Ivory',
      description: 'Kertas ivory premium dengan warna putih bersih',
      imageUrl: '/assets/ivory.svg',
      isActive: true,
      price300gsm: 550,
      price350gsm: 630,
      price400gsm: 720,
      price450gsm: 810,
    },
    {
      code: 'kraft',
      name: 'Kraft',
      description: 'Kertas kraft natural dengan tampilan eco-friendly',
      imageUrl: '/assets/kraft.svg',
      isActive: true,
      price300gsm: 380,
      price350gsm: 440,
      price400gsm: 510,
      price450gsm: 580,
    },
  ];

  for (const material of materials) {
    const existing = await prisma.material.findUnique({
      where: { code: material.code },
    });

    if (!existing) {
      await prisma.material.create({ data: material });
      console.log(`✅ Material created: ${material.name}`);
    } else {
      console.log(`⚠️  Material already exists: ${material.name}`);
    }
  }
  console.log('');

  // ==========================================
  // 3. Seed FinishingOption
  // ==========================================
  console.log('✨ Seeding finishing options...');
  
  const finishingOptions = [
    {
      code: 'glossy',
      name: 'Glossy',
      description: 'Laminasi glossy mengkilap untuk tampilan premium',
      imageUrl: '/assets/glossy.svg',
      isActive: true,
      additionalPrice: 800,
    },
    {
      code: 'doff',
      name: 'Doff',
      description: 'Laminasi doff matte untuk tampilan elegan',
      imageUrl: '/assets/doff.svg',
      isActive: true,
      additionalPrice: 850,
    },
    {
      code: 'sisi-luar',
      name: 'Sisi Luar',
      description: 'Laminasi pada sisi luar saja',
      imageUrl: '/assets/sisi-luar.svg',
      isActive: true,
      additionalPrice: 600,
    },
    {
      code: 'dalam',
      name: 'Dalam',
      description: 'Laminasi pada bagian dalam',
      imageUrl: '/assets/dalam.svg',
      isActive: true,
      additionalPrice: 600,
    },
    {
      code: 'luar-dalam',
      name: 'Luar & Dalam',
      description: 'Laminasi pada kedua sisi',
      imageUrl: '/assets/luar-dalam.svg',
      isActive: true,
      additionalPrice: 1200,
    },
    {
      code: 'tanpa-laminasi',
      name: 'Tanpa Laminasi',
      description: 'Tanpa laminasi, hanya cetak biasa',
      imageUrl: '/assets/tanpa-laminasi.svg',
      isActive: true,
      additionalPrice: 0,
    },
  ];

  for (const finishing of finishingOptions) {
    const existing = await prisma.finishingOption.findUnique({
      where: { code: finishing.code },
    });

    if (!existing) {
      await prisma.finishingOption.create({ data: finishing });
      console.log(`✅ Finishing option created: ${finishing.name}`);
    } else {
      console.log(`⚠️  Finishing option already exists: ${finishing.name}`);
    }
  }
  console.log('');

  // ==========================================
  // 4. Seed PricingRule
  // ==========================================
  console.log('💰 Seeding pricing rules...');
  
  const pricingRules = [
    {
      name: 'Standard Pricing (1000-2999 pcs)',
      minQuantity: 1000,
      maxQuantity: 2999,
      minTotalArea: null,
      maxTotalArea: null,
      pricePerUnit: 1.0,
      discountPercent: 0,
      isActive: true,
    },
    {
      name: 'Bulk Discount 5% (3000-4999 pcs)',
      minQuantity: 3000,
      maxQuantity: 4999,
      minTotalArea: null,
      maxTotalArea: null,
      pricePerUnit: 1.0,
      discountPercent: 5,
      isActive: true,
    },
    {
      name: 'Bulk Discount 10% (5000+ pcs)',
      minQuantity: 5000,
      maxQuantity: null,
      minTotalArea: null,
      maxTotalArea: null,
      pricePerUnit: 1.0,
      discountPercent: 10,
      isActive: true,
    },
  ];

  for (const rule of pricingRules) {
    const existing = await prisma.pricingRule.findFirst({
      where: { name: rule.name },
    });

    if (!existing) {
      await prisma.pricingRule.create({ data: rule });
      console.log(`✅ Pricing rule created: ${rule.name}`);
    } else {
      console.log(`⚠️  Pricing rule already exists: ${rule.name}`);
    }
  }
  console.log('');

  console.log('🎉 Master data seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
