const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ── Credentials (change passwords here and redeploy to update) ────────────────
// Admin   → email: admin@barbershop.com   password: Admin@1234
// J.P     → email: jp@barbershop.com      password: Barber@1234
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const adminPassword  = await bcrypt.hash('Admin@1234',  10);
  const barberPassword = await bcrypt.hash('Barber@1234', 10);

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@barbershop.com' },
    update: {},
    create: {
      name:     'Admin',
      email:    'admin@barbershop.com',
      password: adminPassword,
      role:     'ADMIN',
      phone:    '+1234567890',
    },
  });

  const jp = await prisma.user.upsert({
    where:  { email: 'jp@barbershop.com' },
    update: {},
    create: {
      name:     'J.P Barber',
      email:    'jp@barbershop.com',
      password: barberPassword,
      role:     'BARBER',
      phone:    '+0987654321',
    },
  });

  console.log('Seeded:', { admin, jp });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
