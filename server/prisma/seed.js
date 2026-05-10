import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting seeder...');

  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@benuakertas.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin Benua Kertas',
        email: 'admin@benuakertas.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin created: ${admin.email}`);
  } else {
    console.log('⚠️ Admin already exists.');
  }

  // Cek apakah user biasa sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@benuakertas.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'user@benuakertas.com',
        password: hashedPassword,
        role: 'USER',
      },
    });
    console.log(`✅ User created: ${user.email}`);
  } else {
    console.log('⚠️ User already exists.');
  }

  console.log('🎉 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
