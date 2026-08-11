import { PrismaClient, Difficulty } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function main() {
  console.log('Seeding database with authentic 2-character Chinese & English vocabulary...');

  // 1. Create a Default User
  const user = await prisma.user.upsert({
    where: { email: 'factory.worker@example.com' },
    update: {},
    create: {
      email: 'factory.worker@example.com',
      username: 'factory_worker_01',
      fullName: 'Nguyễn Văn A',
      role: 'LEARNER',
      isGuest: false,
      preference: {
        create: {
          interfaceLang: 'vi',
          targetLanguage: 'CHINESE',
          factoryDomain: 'general',
          dailyGoalMinutes: 30,
        },
      },
    },
  });

  console.log('User ready:', user.username);

  // 2. Clear existing data
  console.log('Clearing old database entries...');
  await prisma.exampleSentence.deleteMany({});
  await prisma.flashcard.deleteMany({});
  await prisma.vocabularyEntry.deleteMany({});
  await prisma.quiz.deleteMany({});

  // 3. Read Chinese & English JSON datasets (20k entries)
  const zhPath20k = path.resolve('src/lib/data/datasets/zh-20k.json');
  const zhPath3k = path.resolve('src/lib/data/datasets/zh-3k.json');
  const zhPath = fs.existsSync(zhPath20k) ? zhPath20k : zhPath3k;

  const enPath20k = path.resolve('src/lib/data/datasets/en-20k.json');
  const enPath3k = path.resolve('src/lib/data/datasets/en-3k.json');
  const enPath = fs.existsSync(enPath20k) ? enPath20k : enPath3k;

  if (fs.existsSync(zhPath)) {
    console.log('Ingesting authentic Chinese dataset...');
    const zhRaw = fs.readFileSync(zhPath, 'utf8').replace(/^\uFEFF/, '');
    const zhPayload = JSON.parse(zhRaw);
    const zhItems: any[] = zhPayload.data || zhPayload;

    const zhRecords = zhItems.map((item: any) => ({
      language: 'zh',
      word: item.word || item.simplified,
      simplified: item.simplified || item.word,
      traditional: item.traditional || item.simplified || item.word,
      pinyin: item.pinyin || '',
      pinyinNumeric: 'pinyin_std',
      partOfSpeech: item.partOfSpeech || 'noun',
      meaningVi: item.meaningVi || '',
      meaningEn: item.meaningEn || item.meaningVi || '',
      hskLevel: item.hskLevel || 'HSK1',
      difficulty: (item.hskLevel === 'HSK1' || item.hskLevel === 'HSK2' ? Difficulty.BEGINNER : item.hskLevel === 'HSK3' || item.hskLevel === 'HSK4' ? Difficulty.INTERMEDIATE : Difficulty.ADVANCED) as Difficulty,
      factoryDomain: item.factoryDomain || 'general',
      topic: item.topic || 'General',
      usageNotes: item.usageNotes || JSON.stringify({
        synonyms: item.synonyms || [],
        antonyms: item.antonyms || [],
      }),
    }));

    const zhChunks = chunkArray(zhRecords, 500);
    let zhInserted = 0;
    for (const chunk of zhChunks) {
      await prisma.vocabularyEntry.createMany({ data: chunk });
      zhInserted += chunk.length;
    }
    console.log(`Successfully seeded ${zhInserted} Chinese entries.`);
  }

  if (fs.existsSync(enPath)) {
    console.log('Ingesting authentic English dataset...');
    const enRaw = fs.readFileSync(enPath, 'utf8').replace(/^\uFEFF/, '');
    const enPayload = JSON.parse(enRaw);
    const enItems: any[] = enPayload.data || enPayload;

    const enRecords = enItems.map((item: any) => ({
      language: 'en',
      word: item.word,
      ipa: item.ipa || '',
      partOfSpeech: item.partOfSpeech || 'noun',
      meaningVi: item.meaningVi || '',
      meaningEn: item.meaningEn || item.word,
      cefrLevel: item.cefrLevel || 'A2',
      difficulty: (item.cefrLevel === 'A1' || item.cefrLevel === 'A2' ? Difficulty.BEGINNER : Difficulty.INTERMEDIATE) as Difficulty,
      factoryDomain: item.factoryDomain || 'general',
      topic: item.topic || 'General',
      usageNotes: item.usageNotes || JSON.stringify({
        synonyms: item.synonyms || [],
        antonyms: item.antonyms || [],
      }),
    }));

    const enChunks = chunkArray(enRecords, 500);
    let enInserted = 0;
    for (const chunk of enChunks) {
      await prisma.vocabularyEntry.createMany({ data: chunk });
      enInserted += chunk.length;
    }
    console.log(`Successfully seeded ${enInserted} English entries.`);
  }

  // 4. Generate Flashcards
  console.log('Generating flashcards...');
  const allVocab = await prisma.vocabularyEntry.findMany();
  const flashcardRecords = allVocab.map((v: any) => ({
    vocabularyId: v.id,
    frontText: v.language === 'zh' ? v.simplified || v.word : v.word,
    backText: v.meaningVi || v.meaningEn || 'N/A',
    pinyinOrIpa: v.language === 'zh' ? v.pinyin : v.ipa,
    factoryDomain: v.factoryDomain || 'general',
    topic: v.topic || 'General',
  }));

  const fcChunks = chunkArray(flashcardRecords, 500);
  let fcInserted = 0;
  for (const chunk of fcChunks) {
    await prisma.flashcard.createMany({ data: chunk });
    fcInserted += chunk.length;
  }
  console.log(`Generated ${fcInserted} flashcards.`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
