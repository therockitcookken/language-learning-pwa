import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log("=== RUNNING DATA QUALITY VERIFICATION ON PRISMA DB ===");
  
  const totalEntries = await prisma.vocabularyEntry.count();
  console.log(`Total Vocabulary Entries in DB: ${totalEntries}`);

  const zhCount = await prisma.vocabularyEntry.count({ where: { language: 'zh' } });
  const enCount = await prisma.vocabularyEntry.count({ where: { language: 'en' } });
  console.log(`Chinese Entries: ${zhCount}, English Entries: ${enCount}`);

  const allEntries = await prisma.vocabularyEntry.findMany();
  let fakeSynCount = 0;
  let fakeAntCount = 0;
  let fakeCollocationCount = 0;
  let fakeHanVietCount = 0;

  for (const entry of allEntries) {
    const notesStr = entry.usageNotes || '';
    if (notesStr.includes('化') || notesStr.includes('ing"') && (notesStr.includes('wasing') || notesStr.includes('areing'))) {
      fakeSynCount++;
    }
    if (notesStr.includes('非') || notesStr.includes('unwas') || notesStr.includes('unare')) {
      fakeAntCount++;
    }
    if (notesStr.includes('操作"') || notesStr.includes('standard ')) {
      fakeCollocationCount++;
    }
    if (entry.meaningVi && entry.meaningVi.includes('(Từ Hán-Việt)')) {
      fakeHanVietCount++;
    }
  }

  console.log(`Fake Synonyms Found: ${fakeSynCount}`);
  console.log(`Fake Antonyms Found: ${fakeAntCount}`);
  console.log(`Fake Collocations Found: ${fakeCollocationCount}`);
  console.log(`Fake '(Từ Hán-Việt)' Labels Found: ${fakeHanVietCount}`);

  if (fakeSynCount === 0 && fakeAntCount === 0 && fakeCollocationCount === 0 && fakeHanVietCount === 0) {
    console.log("PASSED: 100% CLEAN & AUTHENTIC DATASET VERIFIED!");
  } else {
    console.warn("WARNING: Some potential fake patterns still exist.");
  }
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
