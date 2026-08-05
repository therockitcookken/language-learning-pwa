import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Required 30 attributes validation check
const REQUIRED_ATTRIBUTES = [
  'id',
  'language',
  'titleVi',
  'titleEn',
  'level',
  'topic',
  'factoryDomain',
  'formula',
  'breakdownAnalysis',
  'explanationVi',
  'communicativeFunction',
  'usageConditions',
  'forbiddenCases',
  'exceptions',
  'sentencePosition',
  'registerStyle',
  'correctExamples',
  'factoryExamples',
  'wrongExamples',
  'commonLearnerErrors',
  'confusingStructures',
  'comparisonTable',
  'workplaceDialogue',
  'coreVocabulary',
  'quickCheck',
  'fullQuiz',
  'relatedLessons',
  'flashcardData',
  'audioText',
  'filterMetadata',
];

async function validateAndSeedFile(filePath: string) {
  console.log(`\n🔍 Reading & validating seed file: ${path.basename(filePath)}`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const items = JSON.parse(rawData);

  if (!Array.isArray(items)) {
    throw new Error(`File ${filePath} does not contain a JSON array.`);
  }

  let validCount = 0;
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const missing: string[] = [];

    for (const attr of REQUIRED_ATTRIBUTES) {
      if (item[attr] === undefined || item[attr] === null || item[attr] === '') {
        missing.push(attr);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `❌ Validation Error in ${path.basename(filePath)} at index ${idx} (ID: ${item.id || 'N/A'}): Missing mandatory attributes: ${missing.join(', ')}`
      );
    }

    // Upsert into Prisma GrammarLesson table
    await prisma.grammarLesson.upsert({
      where: { id: item.id },
      update: {
        title: item.titleVi,
        titleVi: item.titleVi,
        titleEn: item.titleEn,
        titleZh: item.titleZhSimp || null,
        level: item.level,
        topic: item.topic,
        factoryDomain: item.factoryDomain,
        formula: item.formula,
        explanationVi: item.explanationVi,
        explanationEn: item.communicativeFunction || '',
        correctExample: typeof item.correctExamples === 'string' ? item.correctExamples : JSON.stringify(item.correctExamples),
        wrongExample: typeof item.wrongExamples === 'string' ? item.wrongExamples : JSON.stringify(item.wrongExamples),
        commonMistakes: typeof item.commonLearnerErrors === 'string' ? item.commonLearnerErrors : JSON.stringify(item.commonLearnerErrors),
        comparisonNotes: item.comparisonTable || null,
        factoryScenario: typeof item.factoryExamples === 'string' ? item.factoryExamples : JSON.stringify(item.factoryExamples),
      },
      create: {
        id: item.id,
        language: item.language,
        title: item.titleVi,
        titleVi: item.titleVi,
        titleEn: item.titleEn,
        titleZh: item.titleZhSimp || null,
        level: item.level,
        topic: item.topic,
        factoryDomain: item.factoryDomain,
        formula: item.formula,
        explanationVi: item.explanationVi,
        explanationEn: item.communicativeFunction || '',
        correctExample: typeof item.correctExamples === 'string' ? item.correctExamples : JSON.stringify(item.correctExamples),
        wrongExample: typeof item.wrongExamples === 'string' ? item.wrongExamples : JSON.stringify(item.wrongExamples),
        commonMistakes: typeof item.commonLearnerErrors === 'string' ? item.commonLearnerErrors : JSON.stringify(item.commonLearnerErrors),
        comparisonNotes: item.comparisonTable || null,
        factoryScenario: typeof item.factoryExamples === 'string' ? item.factoryExamples : JSON.stringify(item.factoryExamples),
      },
    });

    validCount++;
  }

  console.log(`✅ Successfully validated and seeded ${validCount} lessons from ${path.basename(filePath)}!`);
}

async function main() {
  console.log('🚀 Starting Master Data Ingestion Pipeline & Validation Execution...');

  const zhDir = path.join(process.cwd(), 'src/lib/data/seeds/zh');
  const enDir = path.join(process.cwd(), 'src/lib/data/seeds/en');

  // Process Chinese seed files if directory exists
  if (fs.existsSync(zhDir)) {
    const zhFiles = fs.readdirSync(zhDir).filter((f) => f.endsWith('.json'));
    for (const f of zhFiles) {
      await validateAndSeedFile(path.join(zhDir, f));
    }
  }

  // Process English seed files if directory exists
  if (fs.existsSync(enDir)) {
    const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith('.json'));
    for (const f of enFiles) {
      await validateAndSeedFile(path.join(enDir, f));
    }
  }

  console.log('\n🎉 ALL MASTER SEED BATCHES VALIDATED & SEEDED WITH 100% SUCCESS!');
}

main()
  .catch((err) => {
    console.error('❌ Pipeline Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
