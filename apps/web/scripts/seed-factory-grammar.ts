import { PrismaClient } from '@prisma/client';
import { GRAMMAR_DATASET, GRAMMAR_DIALOGUES } from '../src/lib/data/grammar-dataset';

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Starting Factory Grammar Master Database Seeding...');

  // 1. Seed Grammar Lessons into Prisma GrammarLesson table
  let countLessons = 0;
  for (const lesson of GRAMMAR_DATASET) {
    await prisma.grammarLesson.upsert({
      where: { id: lesson.id },
      update: {
        title: lesson.titleVi,
        titleVi: lesson.titleVi,
        titleEn: lesson.titleEn,
        titleZh: lesson.titleZhSimp || null,
        level: lesson.level,
        topic: lesson.topic,
        factoryDomain: lesson.factoryDomain,
        formula: lesson.formula,
        explanationVi: lesson.explanationVi,
        explanationEn: lesson.explanationEn || '',
        correctExample: lesson.correctExampleZh || lesson.correctExampleEn || '',
        wrongExample: lesson.wrongExampleZh || lesson.wrongExampleEn || '',
        commonMistakes: lesson.commonMistakesVi,
        comparisonNotes: lesson.comparisonNotesVi || null,
        factoryScenario: lesson.factoryScenarioVi,
      },
      create: {
        id: lesson.id,
        language: lesson.language,
        title: lesson.titleVi,
        titleVi: lesson.titleVi,
        titleEn: lesson.titleEn,
        titleZh: lesson.titleZhSimp || null,
        level: lesson.level,
        topic: lesson.topic,
        factoryDomain: lesson.factoryDomain,
        formula: lesson.formula,
        explanationVi: lesson.explanationVi,
        explanationEn: lesson.explanationEn || '',
        correctExample: lesson.correctExampleZh || lesson.correctExampleEn || '',
        wrongExample: lesson.wrongExampleZh || lesson.wrongExampleEn || '',
        commonMistakes: lesson.commonMistakesVi,
        comparisonNotes: lesson.comparisonNotesVi || null,
        factoryScenario: lesson.factoryScenarioVi,
      },
    });
    countLessons++;
  }
  console.log(`✅ Upserted ${countLessons} Grammar Lessons into SQLite (GrammarLesson table).`);

  // 2. Seed Workplace Dialogues into WorkplaceDialogue table
  let countDialogues = 0;
  for (const diag of GRAMMAR_DIALOGUES) {
    await prisma.workplaceDialogue.upsert({
      where: { id: diag.id },
      update: {
        titleVi: diag.title,
        category: diag.topic,
        factoryDomain: diag.language,
      },
      create: {
        id: diag.id,
        titleVi: diag.title,
        category: diag.topic,
        factoryDomain: diag.language,
      },
    });
    countDialogues++;
  }
  console.log(`✅ Upserted ${countDialogues} Workplace Dialogues into SQLite (WorkplaceDialogue table).`);

  console.log('🎉 Factory Grammar Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
