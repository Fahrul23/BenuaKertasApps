const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const boxModels = await prisma.boxModel.findMany();
  console.log('Box Models:', boxModels);

  const orders = await prisma.order.findMany();
  console.log('Orders:', orders.map(o => ({ id: o.id, no: o.orderNumber, box: o.boxModel, total: o.totalAmount })));

  await prisma.order.updateMany({
    where: { totalAmount: 0 },
    data: { totalAmount: 5686879, subtotal: 5686879, totalBayar: 5686879 }
  });

  console.log('Updated orders to have a price');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
