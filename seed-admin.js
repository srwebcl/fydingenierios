const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_USER || 'contacto@fydingenieria.cl';
  const password = process.env.ADMIN_PASSWORD || 'al#2026dnfa';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
      permissions: ['ALL'],
    },
    create: {
      email,
      name: 'Administrador Principal',
      passwordHash,
      role: 'ADMIN',
      permissions: ['ALL'],
    },
  });

  console.log('Admin user seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
