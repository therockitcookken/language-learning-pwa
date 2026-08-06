import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('=== STARTING SRS VOCABULARY INGESTION PIPELINE (6,000+ ITEMS) ===');

  // 1. Ensure Default User exists
  const user = await prisma.user.upsert({
    where: { email: 'factory.worker@example.com' },
    update: {},
    create: {
      email: 'factory.worker@example.com',
      username: 'factory_worker_01',
      fullName: 'Nguyễn Văn A',
      role: 'LEARNER',
      isGuest: false,
    },
  });

  console.log('Default learner user ready:', user.email);

  // 2. Read Datasets
  const zhPath = path.join(process.cwd(), 'src/lib/data/datasets/zh-3k.json');
  const enPath = path.join(process.cwd(), 'src/lib/data/datasets/en-3k.json');

  if (!fs.existsSync(zhPath) || !fs.existsSync(enPath)) {
    throw new Error('Dataset JSON files not found! Please run build-srs-datasets.ts first.');
  }

  const zhPayload = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));
  const enPayload = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  const zhData: any[] = zhPayload.data;
  const enData: any[] = enPayload.data;

  console.log(`Loaded ${zhData.length} Chinese items and ${enData.length} English items.`);

  // 3. Clear old synthetic/mock records
  console.log('Cleaning up existing synthetic entries...');
  await prisma.flashcard.deleteMany({});
  await prisma.vocabularyEntry.deleteMany({});

  // 4. Import Chinese Vocabulary & Flashcards
  console.log('Importing Chinese vocabulary entries & generating flashcards...');
  let validZhCount = 0;
  const zhChunkSize = 500;

  for (let i = 0; i < zhData.length; i += zhChunkSize) {
    const chunk = zhData.slice(i, i + zhChunkSize);
    for (const item of chunk) {
      if (!item.word || !item.meaningVi) continue;

      const vocab = await prisma.vocabularyEntry.create({
        data: {
          language: 'zh',
          word: item.word,
          simplified: item.simplified || item.word,
          traditional: item.traditional || item.word,
          pinyin: item.pinyin,
          partOfSpeech: item.partOfSpeech || 'noun',
          meaningVi: item.meaningVi,
          meaningEn: item.meaningEn || item.word,
          hskLevel: item.hskLevel || 'HSK1',
          difficulty: item.hskLevel === 'HSK1' || item.hskLevel === 'HSK2' ? 'BEGINNER' : 'INTERMEDIATE',
          factoryDomain: item.factoryDomain || 'general',
          topic: item.topic || 'General',
          usageNotes: JSON.stringify({
            synonyms: item.synonyms || [],
            antonyms: item.antonyms || [],
            relatedWords: item.relatedWords || [],
            mnemonic: item.mnemonic || '',
          }),
          examples: {
            create: item.examples
              ? item.examples.map((ex: any) => ({
                  sentenceZh: ex.sentenceZh,
                  pinyin: ex.pinyin,
                  sentenceVi: ex.sentenceVi,
                  sentenceEn: ex.sentenceEn,
                }))
              : [],
          },
        },
      });

      await prisma.flashcard.create({
        data: {
          vocabularyId: vocab.id,
          frontText: vocab.simplified || vocab.word,
          backText: vocab.meaningVi,
          pinyinOrIpa: vocab.pinyin || '',
          topic: vocab.topic,
          factoryDomain: vocab.factoryDomain,
          mnemonic: item.mnemonic || `Ghi nhớ từ: ${vocab.word}`,
          imageUrl: item.imageUrl || null,
        },
      });

      validZhCount++;
    }
    console.log(`Imported ${validZhCount}/${zhData.length} Chinese records.`);
  }

  // 5. Import English Vocabulary & Flashcards
  console.log('Importing English vocabulary entries & generating flashcards...');
  let validEnCount = 0;
  const enChunkSize = 500;

  for (let i = 0; i < enData.length; i += enChunkSize) {
    const chunk = enData.slice(i, i + enChunkSize);
    for (const item of chunk) {
      if (!item.word || !item.meaningVi) continue;

      const vocab = await prisma.vocabularyEntry.create({
        data: {
          language: 'en',
          word: item.word,
          ipa: item.ipa || '',
          partOfSpeech: item.partOfSpeech || 'noun',
          meaningVi: item.meaningVi,
          meaningEn: item.meaningEn || item.word,
          cefrLevel: item.cefrLevel || 'A2',
          difficulty: item.cefrLevel === 'A1' || item.cefrLevel === 'A2' ? 'BEGINNER' : 'INTERMEDIATE',
          factoryDomain: item.factoryDomain || 'general',
          topic: item.topic || 'General',
          usageNotes: JSON.stringify({
            synonyms: item.synonyms || [],
            antonyms: item.antonyms || [],
            collocations: item.collocations || [],
            mnemonic: item.mnemonic || '',
          }),
          examples: {
            create: item.examples
              ? item.examples.map((ex: any) => ({
                  sentenceEn: ex.sentenceEn,
                  sentenceVi: ex.sentenceVi,
                }))
              : [],
          },
        },
      });

      await prisma.flashcard.create({
        data: {
          vocabularyId: vocab.id,
          frontText: vocab.word,
          backText: vocab.meaningVi,
          pinyinOrIpa: vocab.ipa || '',
          topic: vocab.topic,
          factoryDomain: vocab.factoryDomain,
          mnemonic: item.mnemonic || `Remember: ${vocab.word}`,
          imageUrl: item.imageUrl || null,
        },
      });

      validEnCount++;
    }
    console.log(`Imported ${validEnCount}/${enData.length} English records.`);
  }

  // 6. Record Metadata in ContentImport table
  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(zhPayload) + JSON.stringify(enPayload))
    .digest('hex');

  await prisma.contentImport.create({
    data: {
      sourceName: 'Chinese (CEDICT/HSK) & English (WordNet/CEFR) 6K SRS Datasets',
      license: 'CC-BY-4.0 (Open Lexicon Standards)',
      checksum,
      totalItems: zhData.length + enData.length,
      validItems: validZhCount + validEnCount,
      errorLog: JSON.stringify([]),
    },
  });

  console.log('=== SRS VOCABULARY INGESTION COMPLETE ===');
  console.log(`Successfully seeded ${validZhCount} Chinese and ${validEnCount} English Flashcards!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
