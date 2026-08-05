import fs from 'fs';
import path from 'path';
import { PINYIN_DATASET } from '../src/lib/data/pinyin-dataset';
import { IPA_DATASET } from '../src/lib/data/ipa-dataset';
import { PinyinRecordSchema, IPARecordSchema } from '../src/lib/validation/pronunciation-schema';

async function runPronunciationAudit() {
  console.log('🔍 Starting Pronunciation Data & Schema Audit...');

  const reportDir = path.join(process.cwd(), 'reports', 'pronunciation-audit');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const duplicates: any[] = [];
  const invalidPinyin: any[] = [];
  const invalidIPA: any[] = [];
  const missingDescription: any[] = [];
  const missingExamples: any[] = [];
  const unverifiedRecords: any[] = [];

  const seenIds = new Set<string>();

  // Audit Pinyin
  for (const record of PINYIN_DATASET) {
    if (seenIds.has(record.id)) {
      duplicates.push({ id: record.id, symbol: record.symbol });
    }
    seenIds.add(record.id);

    const parseRes = PinyinRecordSchema.safeParse(record);
    if (!parseRes.success) {
      invalidPinyin.push({ id: record.id, symbol: record.symbol, errors: parseRes.error.format() });
    }

    if (!record.descriptionVi || record.descriptionVi.trim().length < 10) {
      missingDescription.push({ id: record.id, symbol: record.symbol });
    }

    if (!record.exampleWords || record.exampleWords.length === 0) {
      missingExamples.push({ id: record.id, symbol: record.symbol });
    }

    if (!record.verified) {
      unverifiedRecords.push({ id: record.id, symbol: record.symbol });
    }
  }

  // Audit IPA
  for (const record of IPA_DATASET) {
    if (seenIds.has(record.id)) {
      duplicates.push({ id: record.id, symbol: record.symbol });
    }
    seenIds.add(record.id);

    const parseRes = IPARecordSchema.safeParse(record);
    if (!parseRes.success) {
      invalidIPA.push({ id: record.id, symbol: record.symbol, errors: parseRes.error.format() });
    }

    if (!record.descriptionVi || record.descriptionVi.trim().length < 10) {
      missingDescription.push({ id: record.id, symbol: record.symbol });
    }

    if (!record.exampleWords || record.exampleWords.length === 0) {
      missingExamples.push({ id: record.id, symbol: record.symbol });
    }

    if (!record.verified) {
      unverifiedRecords.push({ id: record.id, symbol: record.symbol });
    }
  }

  const summary = {
    timestamp: new Date().toISOString(),
    totalPinyinRecords: PINYIN_DATASET.length,
    totalIPARecords: IPA_DATASET.length,
    duplicatesCount: duplicates.length,
    invalidPinyinCount: invalidPinyin.length,
    invalidIPACount: invalidIPA.length,
    missingDescriptionCount: missingDescription.length,
    missingExamplesCount: missingExamples.length,
    unverifiedRecordsCount: unverifiedRecords.length,
    passed:
      duplicates.length === 0 &&
      invalidPinyin.length === 0 &&
      invalidIPA.length === 0 &&
      missingDescription.length === 0 &&
      unverifiedRecords.length === 0,
  };

  fs.writeFileSync(path.join(reportDir, 'duplicate-records.json'), JSON.stringify(duplicates, null, 2));
  fs.writeFileSync(path.join(reportDir, 'invalid-pinyin.json'), JSON.stringify(invalidPinyin, null, 2));
  fs.writeFileSync(path.join(reportDir, 'invalid-ipa.json'), JSON.stringify(invalidIPA, null, 2));
  fs.writeFileSync(path.join(reportDir, 'missing-description.json'), JSON.stringify(missingDescription, null, 2));
  fs.writeFileSync(path.join(reportDir, 'missing-examples.json'), JSON.stringify(missingExamples, null, 2));
  fs.writeFileSync(path.join(reportDir, 'unverified-records.json'), JSON.stringify(unverifiedRecords, null, 2));
  fs.writeFileSync(path.join(reportDir, 'audit-summary.json'), JSON.stringify(summary, null, 2));

  console.log('✅ Pronunciation audit complete. Results saved in reports/pronunciation-audit/ Summary:');
  console.log(summary);
}

runPronunciationAudit();
