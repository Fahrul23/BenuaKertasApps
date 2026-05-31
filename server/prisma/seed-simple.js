import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting simple seeder...\n');

  // Seed Users
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
