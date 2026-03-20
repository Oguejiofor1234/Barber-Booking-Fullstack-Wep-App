const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const barberPassword = await bcrypt.hash('Barber@1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@barbershop.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@barbershop.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });

  const barber = await prisma.user.upsert({
    where: { email: 'barber@barbershop.com' },
    update: {},
    create: {
      name: 'James the Barber',
      email: 'barber@barbershop.com',
      password: barberPassword,
      role: 'BARBER',
      phone: '+0987654321',
    },
  });

  console.log('Seeded:', { admin, barber });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
