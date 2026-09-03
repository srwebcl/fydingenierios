import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DB:", users);

  if (users.length === 0) {
    console.log("No users found. Creating default admin...");
    const hashedPassword = await bcrypt.hash('al#2026dnfa', 10);
    const newUser = await prisma.user.create({
      data: {
        email: 'contacto@fydingenieria.cl',
        password: hashedPassword,
        name: 'Administrador F&D',
        role: 'ADMIN'
      }
    });
    console.log("Created user:", newUser);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
