import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 20,000 Chinese & 20,000 English vocabulary datasets...');

  const zhPath = path.resolve(__dirname, '../src/lib/data/datasets/zh-20k.json');
  const enPath = path.resolve(__dirname, '../src/lib/data/datasets/en-20k.json');

  if (fs.existsSync(zhPath)) {
    const zhRaw = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));
    console.log(`Loaded ${zhRaw.count} Chinese items from dataset.`);

    const batchSize = 1000;
    for (let i = 0; i < zhRaw.data.length; i += batchSize) {
      const chunk = zhRaw.data.slice(i, i + batchSize);
      await prisma.vocabularyEntry.createMany({
        data: chunk.map((item: any) => ({
          language: 'zh',
          word: item.word,
          simplified: item.simplified || item.word,
          traditional: item.traditional || item.word,
          pinyin: item.pinyin,
          partOfSpeech: 'noun',
          meaningVi: item.meaningVi,
          meaningEn: item.meaningEn || item.meaningVi,
          topic: item.topic || 'General',
          factoryDomain: item.topic === 'Giao tiếp công xưởng' ? 'cong_xuong' : 'doi_song',
          usageNotes: JSON.stringify({ synonyms: item.synonyms, antonyms: item.antonyms })
        })),
      });
      console.log(`Inserted Chinese items ${i + 1} to ${Math.min(i + batchSize, zhRaw.data.length)}`);
    }
  }

  if (fs.existsSync(enPath)) {
    const enRaw = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    console.log(`Loaded ${enRaw.count} English items from dataset.`);

    const batchSize = 1000;
    for (let i = 0; i < enRaw.data.length; i += batchSize) {
      const chunk = enRaw.data.slice(i, i + batchSize);
      await prisma.vocabularyEntry.createMany({
        data: chunk.map((item: any) => ({
          language: 'en',
          word: item.word,
          ipa: item.ipa,
          partOfSpeech: 'noun',
          meaningVi: item.meaningVi,
          meaningEn: item.meaningEn || item.meaningVi,
          topic: item.topic || 'General',
          factoryDomain: item.topic === 'Giao tiếp công xưởng' ? 'cong_xuong' : 'doi_song',
          usageNotes: JSON.stringify({ synonyms: item.synonyms, antonyms: item.antonyms })
        })),
      });
      console.log(`Inserted English items ${i + 1} to ${Math.min(i + batchSize, enRaw.data.length)}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
