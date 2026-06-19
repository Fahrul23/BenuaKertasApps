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
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781668071/benua-kertas/box-models/rksk0svezhq6znyzeeyj.png',
      isActive: true,
      basePrice: null,
    },
    {
      code: 'earlock-box-samping',
      name: 'Earlock Box Samping',
      description: 'Box dengan lock di bagian samping untuk tampilan yang unik',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781668212/benua-kertas/box-models/z1b5ttocj6kqelso162q.png',
      isActive: true,
      basePrice: null,
    },
    {
      code: 'top-bottom-box',
      name: 'Top Bottom Box',
      description: 'Box dengan tutup terpisah, cocok untuk produk premium',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781668248/benua-kertas/box-models/g0zxgkhcz17pzxxvqqa4.png',
      isActive: true,
      basePrice: null,
    },
    {
      code: 'lunch-box',
      name: 'Lunch Box',
      description: 'Box khusus untuk kemasan makanan',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781668312/benua-kertas/box-models/euqdhukebfqtoncgbpjg.png',
      isActive: true,
      basePrice: null,
    },
    {
      code: 'tray-box',
      name: 'Tray Box',
      description: 'Box berbentuk tray untuk display produk',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781668285/benua-kertas/box-models/s4dpw3l5sb8jmcatnz8k.png',
      isActive: true,
      basePrice: null,
    },
    {
      code: 'clamshell-box',
      name: 'Clamshell Box',
      description: 'Box berbentuk clamshell untuk display produk',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781668388/benua-kertas/box-models/qxndb1cyrx5heq1yji0y.png',
      isActive: true,
      basePrice: null,
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
      await prisma.boxModel.update({
        where: { code: boxModel.code },
        data: boxModel,
      });
      console.log(`🔄 Box model updated: ${boxModel.name}`);
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
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781670046/benua-kertas/box-models/nhajdqc2knrutk2gumyn.png',
      isActive: true,
    },
    {
      code: 'ivory',
      name: 'Ivory',
      description: 'Kertas ivory premium dengan warna putih bersih',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781670065/benua-kertas/box-models/jfgct7mtffharzmshek3.png',
      isActive: true,
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
      await prisma.material.update({
        where: { code: material.code },
        data: material,
      });
      console.log(`🔄 Material updated: ${material.name}`);
    }
  }
  console.log('');

  // ==========================================
  // 3. Seed FinishingOption
  // ==========================================
  console.log('✨ Seeding finishing options...');
  
  const finishingOptions = [
    {
      code: 'sisi-luar',
      name: 'Sisi Luar',
      description: 'Laminasi pada sisi luar saja',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781672437/benua-kertas/box-models/pn6tizwnstisegmmg28h.png',
      category: 'side',
      isActive: true,
    },
    {
      code: 'dalam',
      name: 'Dalam',
      description: 'Laminasi pada bagian dalam',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781672571/benua-kertas/box-models/rmcbechhpgspemacprpa.png',
      category: 'side',
      isActive: true,
    },
    {
      code: 'luar-dan-dalam',
      name: 'Luar & Dalam',
      description: 'Laminasi pada kedua sisi',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781672621/benua-kertas/box-models/ez41tttcixvqliwljorr.png',
      category: 'side',
      isActive: true,
    },
    {
      code: 'tanpa-laminasi',
      name: 'Tanpa Laminasi',
      description: 'Tanpa laminasi, hanya cetak biasa',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781672670/benua-kertas/box-models/iwihhkmz0pcjfdhsf703.png',
      category: 'side',
      isActive: true,
    },
    {
      code: 'glossy',
      name: 'Glossy',
      description: 'Laminasi glossy mengkilap untuk tampilan premium',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781672718/benua-kertas/box-models/xue5yfhstnugqetsdjmf.png',
      category: 'type',
      isActive: true,
    },
    {
      code: 'doff',
      name: 'Doff',
      description: 'Laminasi doff matte untuk tampilan elegan',
      imageUrl: 'https://res.cloudinary.com/datbu1rsi/image/upload/v1781672766/benua-kertas/box-models/h3dbbqao2bas5fb0kj6l.png',
      category: 'type',
      isActive: true,
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
