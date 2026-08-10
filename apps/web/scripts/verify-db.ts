import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verify() {
  console.log('=== VERIFYING DATABASE DATA QUALITY ===');
  const totalCount = await prisma.vocabularyEntry.count();
  const zhEntries = await prisma.vocabularyEntry.findMany({
    where: { language: 'zh' },
    take: 15,
  });

  console.log(`Total DB entries: ${totalCount}`);
  console.log('Sample 15 Chinese entries in DB:');
  for (const item of zhEntries) {
    console.log(`- Word: "${item.word}" (Len: ${item.word?.length}), Meaning: "${item.meaningVi}", Pinyin: "${item.pinyin}"`);
  }
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
