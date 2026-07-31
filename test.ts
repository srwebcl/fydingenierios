import { prisma } from './src/lib/db';
async function test() {
  const c = await prisma.credential.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log(c.length);
}
test();
