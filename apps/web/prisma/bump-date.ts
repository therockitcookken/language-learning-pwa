import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 10); // 10 years in the future

  // Update 'maintenance' to be the absolute newest
  await prisma.vocabularyEntry.updateMany({
    where: { word: 'maintenance' },
    data: { createdAt: futureDate }
  });

  // Update '生活' to be the absolute newest
  await prisma.vocabularyEntry.updateMany({
    where: { word: '生活' },
    data: { createdAt: futureDate }
  });

  console.log('Bumped createdAt for maintenance and 生活 successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
