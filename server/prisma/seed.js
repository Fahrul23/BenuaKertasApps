import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting seeder...\n');

  // ==========================================
  // 1. Seed Users
  // ==========================================
  console.log('👤 Seeding users...');
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@benuakertas.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@benuakertas.com',
        password: hashedPassword,
        name: 'Admin Benua Kertas',
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin created: ${admin.email}`);
  } else {
    console.log('⚠️  Admin already exists.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@benuakertas.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'user@benuakertas.com',
        password: hashedPassword,
        name: 'John Doe',
        role: 'USER',
      },
    });
    console.log(`✅ User created: ${user.email}\n`);
  } else {
    console.log('⚠️  User already exists.\n');
  }

  // ==========================================
  // 2. Seed BoxModel
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
  // 3. Seed Material (tanpa price per GSM)
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
  // 4. Seed FinishingOption (tanpa additionalPrice)
  // ==========================================
  console.log('✨ Seeding finishing options...');
  
  const finishingOptions = [
    // === Sisi Laminasi (category: side) ===
    {
      code: 'sisi-luar',
      name: 'Sisi Luar',
      description: 'Laminasi pada sisi luar saja',
      imageUrl: '/assets/sisi-luar.svg',
      isActive: true,
      category: 'side',
    },
    {
      code: 'dalam',
      name: 'Dalam',
      description: 'Laminasi pada bagian dalam',
      imageUrl: '/assets/dalam.svg',
      isActive: true,
      category: 'side',
    },
    {
      code: 'luar-dan-dalam',
      name: 'Luar & Dalam',
      description: 'Laminasi pada kedua sisi',
      imageUrl: '/assets/luar-dalam.svg',
      isActive: true,
      category: 'side',
    },
    {
      code: 'tanpa-laminasi',
      name: 'Tanpa Laminasi',
      description: 'Tanpa laminasi, hanya cetak biasa',
      imageUrl: '/assets/tanpa-laminasi.svg',
      isActive: true,
      category: 'side',
    },
    // === Tipe Laminasi (category: type) ===
    {
      code: 'glossy',
      name: 'Glossy',
      description: 'Laminasi glossy mengkilap untuk tampilan premium',
      imageUrl: '/assets/glossy.svg',
      isActive: true,
      category: 'type',
    },
    {
      code: 'doff',
      name: 'Doff',
      description: 'Laminasi doff matte untuk tampilan elegan',
      imageUrl: '/assets/doff.svg',
      isActive: true,
      category: 'type',
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
      await prisma.finishingOption.update({
        where: { code: finishing.code },
        data: { category: finishing.category },
      });
      console.log(`🔄 Finishing option updated: ${finishing.name}`);
    }
  }
  console.log('');

  // ==========================================
  // 5. Seed PlanoType (NEW)
  // ==========================================
  console.log('📐 Seeding plano types...');

  const planoTypes = [
    { code: '65x100', width: 65, height: 100, effectiveWidth: 63, effectiveHeight: 97.5, sortOrder: 1 },
    { code: '79x109', width: 79, height: 109, effectiveWidth: 77, effectiveHeight: 106.5, sortOrder: 2 },
    { code: '90x120', width: 90, height: 120, effectiveWidth: 88, effectiveHeight: 117.5, sortOrder: 3 },
  ];

  for (const plano of planoTypes) {
    const existing = await prisma.planoType.findUnique({
      where: { code: plano.code },
    });

    if (!existing) {
      await prisma.planoType.create({ data: plano });
      console.log(`✅ Plano type created: ${plano.code}`);
    } else {
      console.log(`⚠️  Plano type already exists: ${plano.code}`);
    }
  }
  console.log('');

  // ==========================================
  // 6. Seed MaterialPrice (NEW)
  // ==========================================
  console.log('💰 Seeding material prices...');

  const materialPrices = [
    // Duplex
    { planoCode: '65x100', materialCode: 'duplex', thickness: 310, price: 1433990 },
    { planoCode: '65x100', materialCode: 'duplex', thickness: 350, price: 1576416 },
    { planoCode: '65x100', materialCode: 'duplex', thickness: 400, price: 1772225 },
    { planoCode: '79x109', materialCode: 'duplex', thickness: 310, price: 1899706 },
    { planoCode: '79x109', materialCode: 'duplex', thickness: 350, price: 2088387 },
    { planoCode: '79x109', materialCode: 'duplex', thickness: 400, price: 2347789 },
    { planoCode: '90x120', materialCode: 'duplex', thickness: 310, price: 2382629 },
    { planoCode: '90x120', materialCode: 'duplex', thickness: 350, price: 2619275 },
    { planoCode: '90x120', materialCode: 'duplex', thickness: 400, price: 2944620 },

    // Ivory
    { planoCode: '65x100', materialCode: 'ivory', thickness: 230, price: 1046500 },
    { planoCode: '65x100', materialCode: 'ivory', thickness: 250, price: 1137500 },
    { planoCode: '65x100', materialCode: 'ivory', thickness: 270, price: 1228500 },
    { planoCode: '65x100', materialCode: 'ivory', thickness: 300, price: 1365000 },
    { planoCode: '79x109', materialCode: 'ivory', thickness: 230, price: 1386371 },
    { planoCode: '79x109', materialCode: 'ivory', thickness: 250, price: 1506925 },
    { planoCode: '79x109', materialCode: 'ivory', thickness: 270, price: 1627479 },
    { planoCode: '79x109', materialCode: 'ivory', thickness: 300, price: 1808310 },
    { planoCode: '90x120', materialCode: 'ivory', thickness: 230, price: 1738800 },
    { planoCode: '90x120', materialCode: 'ivory', thickness: 250, price: 1890000 },
    { planoCode: '90x120', materialCode: 'ivory', thickness: 270, price: 2041200 },
    { planoCode: '90x120', materialCode: 'ivory', thickness: 300, price: 2268000 },
  ];

  for (const mp of materialPrices) {
    const existing = await prisma.materialPrice.findFirst({
      where: {
        planoCode: mp.planoCode,
        materialCode: mp.materialCode,
        thickness: mp.thickness,
      },
    });

    if (!existing) {
      await prisma.materialPrice.create({ data: mp });
      console.log(`✅ Material price created: ${mp.planoCode} × ${mp.materialCode} × ${mp.thickness}gsm`);
    } else {
      await prisma.materialPrice.update({
        where: { id: existing.id },
        data: { price: mp.price },
      });
      console.log(`🔄 Material price updated: ${mp.planoCode} × ${mp.materialCode} × ${mp.thickness}gsm`);
    }
  }
  console.log('');

  // ==========================================
  // 7. Seed ColorPrice (NEW)
  // ==========================================
  console.log('🎨 Seeding color prices...');

  const colorPrices = [
    { thicknessMin: 230, thicknessMax: 310, pricePerSide: 460000 },
    { thicknessMin: 350, thicknessMax: 350, pricePerSide: 550000 },
    { thicknessMin: 400, thicknessMax: 400, pricePerSide: 600000 },
  ];

  for (const cp of colorPrices) {
    const existing = await prisma.colorPrice.findFirst({
      where: {
        thicknessMin: cp.thicknessMin,
        thicknessMax: cp.thicknessMax,
      },
    });

    if (!existing) {
      await prisma.colorPrice.create({ data: cp });
      console.log(`✅ Color price created: ${cp.thicknessMin}-${cp.thicknessMax}gsm = Rp ${cp.pricePerSide.toLocaleString('id-ID')}`);
    } else {
      await prisma.colorPrice.update({
        where: { id: existing.id },
        data: { pricePerSide: cp.pricePerSide },
      });
      console.log(`🔄 Color price updated: ${cp.thicknessMin}-${cp.thicknessMax}gsm`);
    }
  }
  console.log('');

  // ==========================================
  // 8. Seed CmykBlokPrice (NEW — Pricing Engine v3)
  // ==========================================
  console.log('🖨️  Seeding CMYK blok prices...');

  const cmykBlokPrices = [
    { thicknessMin: 210, thicknessMax: 330, cetakPrice: 460000, dragPrice: 120, platPrice: 170000 },
    { thicknessMin: 350, thicknessMax: 350, cetakPrice: 550000, dragPrice: 140, platPrice: 170000 },
    { thicknessMin: 400, thicknessMax: 400, cetakPrice: 600000, dragPrice: 160, platPrice: 170000 },
  ];

  for (const cbp of cmykBlokPrices) {
    const existing = await prisma.cmykBlokPrice.findFirst({
      where: {
        thicknessMin: cbp.thicknessMin,
        thicknessMax: cbp.thicknessMax,
      },
    });

    if (!existing) {
      await prisma.cmykBlokPrice.create({ data: cbp });
      console.log(`✅ CMYK blok price created: ${cbp.thicknessMin}-${cbp.thicknessMax}gsm`);
    } else {
      await prisma.cmykBlokPrice.update({
        where: { id: existing.id },
        data: { cetakPrice: cbp.cetakPrice, dragPrice: cbp.dragPrice, platPrice: cbp.platPrice },
      });
      console.log(`🔄 CMYK blok price updated: ${cbp.thicknessMin}-${cbp.thicknessMax}gsm`);
    }
  }
  console.log('');

  // ==========================================
  // 9. Seed PricingConfig (NEW — Pricing Engine v3, singleton)
  // ==========================================
  console.log('⚙️  Seeding pricing config...');

  const existingConfig = await prisma.pricingConfig.findFirst();
  if (!existingConfig) {
    await prisma.pricingConfig.create({
      data: {
        pondMultiplier: 85,
        packingDivisor: 500,
        packingMultiplier: 15000,
        laminasiMultiplier: 0.3,
        pisauPrice: 700000,
        dragThreshold: 1000,
      },
    });
    console.log('✅ Pricing config created (singleton)');
  } else {
    console.log('⚠️  Pricing config already exists.');
  }
  console.log('');

  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
