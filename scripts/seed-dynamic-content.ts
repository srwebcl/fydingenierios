import { prisma } from '../src/lib/db';
import { courses } from '../src/content/courses';
import { services } from '../src/content/services';

async function main() {
  console.log('Starting seed...');
  
  // Seed Services
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        benefits: service.benefits || [],
        deliverables: service.deliverables || [],
        normatives: service.normatives || [],
      },
      create: {
        slug: service.slug,
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        benefits: service.benefits || [],
        deliverables: service.deliverables || [],
        normatives: service.normatives || [],
      }
    });
    console.log(`Upserted service: ${service.slug}`);
  }

  // Seed Courses
  for (const course of courses) {
    const instructorName = course.instructor?.name || null;
    const instructorTitle = course.instructor?.title || null;
    const instructorDesc = course.instructor?.description || null;
    
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        shortDescription: course.shortDescription,
        fullDescription: course.fullDescription,
        durationHours: course.durationHours,
        includesDiploma: course.includesDiploma,
        category: course.category,
        level: course.level,
        modality: course.modality,
        evaluation: course.evaluation,
        material: course.material,
        certificationText: course.certificationText,
        audience: course.audience,
        whatYouWillLearn: course.whatYouWillLearn || [],
        whyChooseUs: course.whyChooseUs || [],
        instructorName,
        instructorTitle,
        instructorDesc,
        syllabus: course.syllabus || [],
        faqs: course.faqs || [],
      },
      create: {
        slug: course.slug,
        title: course.title,
        shortDescription: course.shortDescription,
        fullDescription: course.fullDescription,
        durationHours: course.durationHours,
        includesDiploma: course.includesDiploma,
        category: course.category,
        level: course.level,
        modality: course.modality,
        evaluation: course.evaluation,
        material: course.material,
        certificationText: course.certificationText,
        audience: course.audience,
        whatYouWillLearn: course.whatYouWillLearn || [],
        whyChooseUs: course.whyChooseUs || [],
        instructorName,
        instructorTitle,
        instructorDesc,
        syllabus: course.syllabus || [],
        faqs: course.faqs || [],
      }
    });
    console.log(`Upserted course: ${course.slug}`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
