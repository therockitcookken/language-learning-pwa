import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db/prisma';
import { calculateSimilarity, normalizeText } from '../src/lib/validation/vocabulary-schema';

export interface AuditReportItem {
  recordIds: string[];
  field: string;
  errorType: string;
  currentValues: string[];
  similarityScore: number;
  suggestedAction: string;
}

export async function runVocabularyAudit() {
  console.log('=== STARTING VOCABULARY DATASET AUDIT ===');

  const entries = await db.vocabularyEntry.findMany({});
  console.log(`Auditing ${entries.length} records in SQLite database...`);

  const reportsDir = path.join(process.cwd(), 'reports', 'audit');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const exactDuplicates: AuditReportItem[] = [];
  const semanticDuplicates: AuditReportItem[] = [];
  const repeatedDefinitions: AuditReportItem[] = [];
  const repeatedSynonyms: AuditReportItem[] = [];
  const repeatedAntonyms: AuditReportItem[] = [];
  const repeatedExamples: AuditReportItem[] = [];
  const invalidPinyin: AuditReportItem[] = [];
  const invalidHsk: AuditReportItem[] = [];
  const missingFields: AuditReportItem[] = [];
  const needsHumanReview: AuditReportItem[] = [];

  // Trackers for template / frequency duplication
  const synonymFreqMap = new Map<string, string[]>();
  const antonymFreqMap = new Map<string, string[]>();
  const definitionFreqMap = new Map<string, string[]>();
  const uniqueKeyMap = new Map<string, string[]>();

  for (const entry of entries) {
    const recordId = entry.id;

    // 1. Missing Fields & Pinyin / HSK check
    if (!entry.word || !entry.meaningVi) {
      missingFields.push({
        recordIds: [recordId],
        field: !entry.word ? 'word' : 'meaningVi',
        errorType: 'MISSING_REQUIRED_FIELD',
        currentValues: [entry.word || '', entry.meaningVi || ''],
        similarityScore: 0,
        suggestedAction: 'Fill missing required fields or delete record',
      });
    }

    if (entry.language === 'zh' && (!entry.pinyin || entry.pinyin === 'pīnyīn')) {
      invalidPinyin.push({
        recordIds: [recordId],
        field: 'pinyin',
        errorType: 'INVALID_OR_DEFAULT_PINYIN',
        currentValues: [entry.word, entry.pinyin || ''],
        similarityScore: 0,
        suggestedAction: 'Fix Pinyin tone marks for Chinese character',
      });
    }

    if (entry.hskLevel && !['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].includes(entry.hskLevel)) {
      invalidHsk.push({
        recordIds: [recordId],
        field: 'hskLevel',
        errorType: 'INVALID_HSK_LEVEL',
        currentValues: [entry.hskLevel],
        similarityScore: 0,
        suggestedAction: 'Set hskLevel to valid HSK level or null',
      });
    }

    // 2. Unique Key Tracking (Exact Duplicate)
    const normWord = normalizeText(entry.word);
    const normPinyin = normalizeText(entry.pinyin || entry.ipa || '');
    const uniqueKey = `${entry.language}_${normWord}_${normPinyin}`;

    if (uniqueKeyMap.has(uniqueKey)) {
      uniqueKeyMap.get(uniqueKey)!.push(recordId);
    } else {
      uniqueKeyMap.set(uniqueKey, [recordId]);
    }

    // 3. Track Definitions
    const normMeaning = normalizeText(entry.meaningVi);
    if (definitionFreqMap.has(normMeaning)) {
      definitionFreqMap.get(normMeaning)!.push(recordId);
    } else {
      definitionFreqMap.set(normMeaning, [recordId]);
    }

    // 4. Parse & Track Usage Notes (Synonyms / Antonyms)
    if (entry.usageNotes) {
      try {
        const notes = JSON.parse(entry.usageNotes);
        if (notes.synonyms && Array.isArray(notes.synonyms)) {
          notes.synonyms.forEach((s: any) => {
            if (s.word) {
              const synKey = `${s.word}_${s.meaningVi || ''}`;
              if (!synonymFreqMap.has(synKey)) synonymFreqMap.set(synKey, []);
              synonymFreqMap.get(synKey)!.push(recordId);
            }
          });
        }

        if (notes.antonyms && Array.isArray(notes.antonyms)) {
          notes.antonyms.forEach((a: any) => {
            if (a.word) {
              const antKey = `${a.word}_${a.meaningVi || ''}`;
              if (!antonymFreqMap.has(antKey)) antonymFreqMap.set(antKey, []);
              antonymFreqMap.get(antKey)!.push(recordId);
            }
          });
        }
      } catch (e) {}
    }
  }

  // Evaluate Exact Duplicates
  for (const [key, ids] of uniqueKeyMap.entries()) {
    if (ids.length > 1) {
      exactDuplicates.push({
        recordIds: ids,
        field: 'word+pinyin',
        errorType: 'EXACT_DUPLICATE_KEY',
        currentValues: [key],
        similarityScore: 1.0,
        suggestedAction: 'Deduplicate and keep single authoritative entry',
      });
    }
  }

  // Evaluate Repeated Definitions
  for (const [meaning, ids] of definitionFreqMap.entries()) {
    if (ids.length > 5) {
      repeatedDefinitions.push({
        recordIds: ids,
        field: 'meaningVi',
        errorType: 'REPEATED_DEFINITION_TEMPLATE',
        currentValues: [meaning],
        similarityScore: 1.0,
        suggestedAction: 'Differentiate meanings or flag for human review',
      });
    }
  }

  // Evaluate Repeated Synonyms (Template Duplication > 3 records)
  for (const [synKey, ids] of synonymFreqMap.entries()) {
    if (ids.length >= 3) {
      repeatedSynonyms.push({
        recordIds: ids,
        field: 'synonyms',
        errorType: 'REPEATED_SYNONYM_TEMPLATE_LEAKAGE',
        currentValues: [synKey],
        similarityScore: 1.0,
        suggestedAction: 'Remove template fallback synonym from non-matching entries or set synonyms = []',
      });
    }
  }

  // Evaluate Repeated Antonyms (Template Duplication > 3 records)
  for (const [antKey, ids] of antonymFreqMap.entries()) {
    if (ids.length >= 3) {
      repeatedAntonyms.push({
        recordIds: ids,
        field: 'antonyms',
        errorType: 'REPEATED_ANTONYM_TEMPLATE_LEAKAGE',
        currentValues: [antKey],
        similarityScore: 1.0,
        suggestedAction: 'Remove template fallback antonym from non-matching entries or set antonyms = []',
      });
    }
  }

  // Evaluate Semantic Similarity (> 85%) across entries
  for (let i = 0; i < Math.min(entries.length, 200); i++) {
    for (let j = i + 1; j < Math.min(entries.length, 200); j++) {
      const e1 = entries[i];
      const e2 = entries[j];
      if (e1.word !== e2.word) {
        const score = calculateSimilarity(e1.meaningVi, e2.meaningVi);
        if (score >= 0.85) {
          semanticDuplicates.push({
            recordIds: [e1.id, e2.id],
            field: 'meaningVi',
            errorType: 'SEMANTIC_DUPLICATE_MEANING',
            currentValues: [`${e1.word}: ${e1.meaningVi}`, `${e2.word}: ${e2.meaningVi}`],
            similarityScore: Math.round(score * 100) / 100,
            suggestedAction: 'Check context and refine distinct meanings',
          });

          needsHumanReview.push({
            recordIds: [e1.id, e2.id],
            field: 'meaningVi',
            errorType: 'HIGH_SEMANTIC_SIMILARITY_NEEDS_REVIEW',
            currentValues: [`${e1.word}: ${e1.meaningVi}`, `${e2.word}: ${e2.meaningVi}`],
            similarityScore: Math.round(score * 100) / 100,
            suggestedAction: 'Set needsReview = true for human verification',
          });
        }
      }
    }
  }

  // Write all 10 reports into reports/audit/
  fs.writeFileSync(path.join(reportsDir, 'exact-duplicates.json'), JSON.stringify(exactDuplicates, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'semantic-duplicates.json'), JSON.stringify(semanticDuplicates, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-definitions.json'), JSON.stringify(repeatedDefinitions, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-synonyms.json'), JSON.stringify(repeatedSynonyms, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-antonyms.json'), JSON.stringify(repeatedAntonyms, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-examples.json'), JSON.stringify(repeatedExamples, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'invalid-pinyin.json'), JSON.stringify(invalidPinyin, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'invalid-hsk.json'), JSON.stringify(invalidHsk, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'missing-fields.json'), JSON.stringify(missingFields, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'needs-human-review.json'), JSON.stringify(needsHumanReview, null, 2));

  console.log('=== AUDIT COMPLETED ===');
  console.log(`- Exact Duplicates: ${exactDuplicates.length}`);
  console.log(`- Semantic Duplicates (>85%): ${semanticDuplicates.length}`);
  console.log(`- Repeated Synonyms: ${repeatedSynonyms.length}`);
  console.log(`- Repeated Antonyms: ${repeatedAntonyms.length}`);
  console.log(`- Reports saved to: ${reportsDir}`);

  return {
    exactDuplicates: exactDuplicates.length,
    semanticDuplicates: semanticDuplicates.length,
    repeatedSynonyms: repeatedSynonyms.length,
    repeatedAntonyms: repeatedAntonyms.length,
    needsHumanReview: needsHumanReview.length,
  };
}

if (require.main === module) {
  runVocabularyAudit()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
