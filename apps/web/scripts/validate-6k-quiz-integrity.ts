import fs from 'fs';
import path from 'path';

export interface AuditReport {
  totalCount: number;
  zhCount: number;
  enCount: number;
  typesCount: Record<string, number>;
  levelsCount: Record<string, number>;
  skillsCount: Record<string, number>;
  duplicatePrompts: number;
  missingExplanations: number;
  invalidOptions: number;
  passed: boolean;
}

export function auditExerciseDataset(zhPath: string, enPath: string): AuditReport {
  const zhRaw = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));
  const enRaw = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  const zhData = zhRaw.data || [];
  const enData = enRaw.data || [];

  const all = [...zhData, ...enData];
  const typesCount: Record<string, number> = {};
  const levelsCount: Record<string, number> = {};
  const skillsCount: Record<string, number> = {};

  const seenPrompts = new Set<string>();
  let duplicatePrompts = 0;
  let missingExplanations = 0;
  let invalidOptions = 0;

  all.forEach((item: any) => {
    // Type audit
    typesCount[item.questionType] = (typesCount[item.questionType] || 0) + 1;
    levelsCount[item.level] = (levelsCount[item.level] || 0) + 1;
    skillsCount[item.skill] = (skillsCount[item.skill] || 0) + 1;

    // Check duplicate prompts
    const key = `${item.language}:${item.prompt.trim()}`;
    if (seenPrompts.has(key)) {
      duplicatePrompts++;
    } else {
      seenPrompts.add(key);
    }

    // Check explanation
    if (!item.explanationVi || item.explanationVi.trim().length === 0) {
      missingExplanations++;
    }

    // Check options
    try {
      const opts = JSON.parse(item.optionsJson);
      if (!Array.isArray(opts) || opts.length === 0) {
        invalidOptions++;
      }
    } catch {
      invalidOptions++;
    }
  });

  const passed =
    zhData.length === 3000 &&
    enData.length === 3000 &&
    duplicatePrompts === 0 &&
    missingExplanations === 0 &&
    invalidOptions === 0;

  return {
    totalCount: all.length,
    zhCount: zhData.length,
    enCount: enData.length,
    typesCount,
    levelsCount,
    skillsCount,
    duplicatePrompts,
    missingExplanations,
    invalidOptions,
    passed,
  };
}

if (require.main === module) {
  const rootDir = path.resolve(__dirname, '..');
  const zhPath = path.join(rootDir, 'src/lib/data/datasets/zh-exercises-3k.json');
  const enPath = path.join(rootDir, 'src/lib/data/datasets/en-exercises-3k.json');

  console.log('Running 6,000 Exercises Integrity Audit...');
  const report = auditExerciseDataset(zhPath, enPath);

  console.log('\n--- 📊 INTEGRITY REPORT ---');
  console.log(`Total Exercises: ${report.totalCount}`);
  console.log(`Chinese Exercises (HSK1-6): ${report.zhCount}`);
  console.log(`English Exercises (A1-C2): ${report.enCount}`);
  console.log(`Duplicate Prompts: ${report.duplicatePrompts}`);
  console.log(`Missing Explanations: ${report.missingExplanations}`);
  console.log(`Invalid Options JSON: ${report.invalidOptions}`);
  console.log('\n--- Dạng bài (Exercise Types Distribution) ---');
  console.table(report.typesCount);
  console.log('\n--- Cấp độ (Levels Distribution) ---');
  console.table(report.levelsCount);
  console.log('\n--- Kỹ năng (Skills Distribution) ---');
  console.table(report.skillsCount);

  if (report.passed) {
    console.log('\n✅ ALL INTEGRITY CHECKS PASSED PERFECTLY!');
  } else {
    console.error('\n❌ INTEGRITY AUDIT FAILED! Check reported issues.');
    process.exit(1);
  }
}
