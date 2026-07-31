import { prisma } from './src/lib/db';
async function run() {
  const options = await prisma.courseOption.findMany({ where: { type: 'CATEGORY' } });
  console.log("Categories:", options);
  
  const courses = await prisma.course.findMany({ select: { slug: true, title: true, category: true } });
  console.log("Courses:", courses);
}
run();
