import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning Database ---');
  // We delete OrderItems and Orders first to avoid dependency errors during cleaning
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany(); 

  console.log('--- Seeding Bellavista & Ozaano Products ---');

  const products = [
    // BELLAVISTA LINE (Natural Mineral Water)
    {
      id: 'b2', // Matches the "b2" ID from your error logs
      name: 'Bellavista Natural Mineral Water (1L)',
      brand: 'Bellavista',
      description: 'Premium natural mineral water sourced from the Himalayas. Nature in every drop.',
      price: 60.00, // Matches the 60 price in your log
      size: '1 Litre',
      stock: 500,
      image: 'bellavista_1l.jpg', 
    },
    {
      id: 'b1', 
      name: 'Bellavista Natural Mineral Water (200ml)',
      brand: 'Bellavista',
      description: 'The elegant 200ml Bellavista, perfect for premium events and hospitality.',
      price: 15.00,
      size: '200ml',
      stock: 1000,
      image: 'bellavista_200ml.jpg',
    },
    // OZAANO LINE (Premium RO Drinking Water)
    {
      id: 'o1',
      name: 'Ozaano Premium RO Water (1L)',
      brand: 'Ozaano',
      description: 'Ozaano Premium RO Drinking Water. Pure, safe, and perfectly balanced for daily hydration.',
      price: 20.00,
      size: '1 Litre',
      stock: 800,
      image: 'ozaano_1l.jpg',
    },
    {
      id: 'o2',
      name: 'Ozaano Premium RO Water (250ml)',
      brand: 'Ozaano',
      description: 'Ozaano 250ml cup/bottle. Convenient purity for on-the-go hydration.',
      price: 10.00,
      size: '250ml',
      stock: 1200,
      image: 'ozaano_250ml.jpg',
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Success: Bellavista and Ozaano catalogs are live with fixed IDs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });