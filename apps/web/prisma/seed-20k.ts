import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as fs from 'fs';
import * as path from 'path';

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function main() {
  console.log('=== STARTING SEEDER WITH JSON DATASETS ===');
  
  console.log('1. Clearing old records from database...');
  await prisma.exampleSentence.deleteMany({});
  await prisma.vocabularyEntry.deleteMany({});
  await prisma.flashcard.deleteMany({});
  console.log('Database cleared.');

  console.log('2. Reading Chinese JSON dataset...');
  const zhRaw = fs.readFileSync(path.resolve('src/lib/data/datasets/zh-3k.json'), 'utf8');
  const zhData = JSON.parse(zhRaw.replace(/^\uFEFF/, '')); // Handle BOM just in case
  const zhRecords = zhData.data.map((item: any) => ({
    language: 'zh',
    word: item.word || '',
    simplified: item.simplified || item.word || '',
    traditional: item.traditional || item.word || '',
    pinyin: item.pinyin || '',
    pinyinNumeric: 'pinyin_std',
    partOfSpeech: item.partOfSpeech || 'noun',
    meaningVi: item.meaningVi || '',
    meaningEn: item.meaningEn || '',
    hskLevel: item.hskLevel || null,
    difficulty: item.hskLevel === 'HSK1' || item.hskLevel === 'HSK2' ? 'BEGINNER' : item.hskLevel === 'HSK3' || item.hskLevel === 'HSK4' ? 'INTERMEDIATE' : 'ADVANCED',
    factoryDomain: item.factoryDomain || 'general',
    topic: item.topic || 'General',
    usageNotes: JSON.stringify({ synonyms: item.synonyms || [], antonyms: item.antonyms || [], collocations: item.relatedWords || [] }),
  }));

  const zhChunks = chunkArray(zhRecords, 500);
  let zhInserted = 0;
  for (const chunk of zhChunks) {
    await prisma.vocabularyEntry.createMany({ data: chunk });
    zhInserted += chunk.length;
    console.log(`Inserted ${zhInserted}/${zhRecords.length} Chinese records.`);
  }

  console.log('3. Reading English JSON dataset...');
  const enRaw = fs.readFileSync(path.resolve('src/lib/data/datasets/en-3k.json'), 'utf8');
  const enData = JSON.parse(enRaw.replace(/^\uFEFF/, '')); // Handle BOM
  const enRecords = enData.data.map((item: any) => ({
    language: 'en',
    word: item.word || '',
    ipa: item.ipa || '',
    partOfSpeech: item.partOfSpeech || 'noun',
    meaningVi: item.meaningVi || '',
    meaningEn: item.meaningEn || '',
    cefrLevel: item.cefrLevel || null,
    difficulty: item.cefrLevel === 'A1' || item.cefrLevel === 'A2' ? 'BEGINNER' : item.cefrLevel === 'B1' || item.cefrLevel === 'B2' ? 'INTERMEDIATE' : 'ADVANCED',
    factoryDomain: item.factoryDomain || 'general',
    topic: item.topic || 'General',
    usageNotes: JSON.stringify({ synonyms: item.synonyms || [], antonyms: item.antonyms || [], collocations: item.relatedWords || [] }),
  }));

  const enChunks = chunkArray(enRecords, 500);
  let enInserted = 0;
  for (const chunk of enChunks) {
    await prisma.vocabularyEntry.createMany({ data: chunk });
    enInserted += chunk.length;
    console.log(`Inserted ${enInserted}/${enRecords.length} English records.`);
  }

  console.log('4. Generating Flashcards for all entries...');
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
    console.log(`Inserted ${fcInserted}/${flashcardRecords.length} flashcard records.`);
  }

  console.log('=== SEEDING COMPLETED SUCCESSFULLY ===');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
