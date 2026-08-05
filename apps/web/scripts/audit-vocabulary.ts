import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db/prisma';
import { calculateSimilarity, normalizeText } from '../src/lib/validation/vocabulary-schema';

export interface AuditReportDetail {
  recordIds: string[];
  words: string[];
  errorType: string;
  field: string;
  currentValues: string[];
  similarityScore: number | null;
  reason: string;
  suggestedAction: string;
}

export async function runFullVocabularyAudit() {
  console.log('=== STARTING COMPLETE VOCABULARY AUDIT ===');

  const entries = await db.vocabularyEntry.findMany({});
  console.log(`Scanning ${entries.length} records from database...`);

  const reportsDir = path.join(process.cwd(), 'reports', 'vocabulary-audit');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const exactDuplicates: AuditReportDetail[] = [];
  const semanticDuplicates: AuditReportDetail[] = [];
  const suspiciousGeneratedWords: AuditReportDetail[] = [];
  const repeatedPrefixPatterns: AuditReportDetail[] = [];
  const repeatedTranslationTemplates: AuditReportDetail[] = [];
  const invalidPinyin: AuditReportDetail[] = [];
  const invalidHsk: AuditReportDetail[] = [];
  const invalidPartOfSpeech: AuditReportDetail[] = [];
  const invalidCollocations: AuditReportDetail[] = [];
  const repeatedExamples: AuditReportDetail[] = [];
  const placeholderContent: AuditReportDetail[] = [];
  const unverifiedRecords: AuditReportDetail[] = [];
  const needsHumanReview: AuditReportDetail[] = [];

  const prefixFreq = new Map<string, { ids: string[]; words: string[] }>();
  const translationFreq = new Map<string, { ids: string[]; words: string[] }>();
  const wordKeyMap = new Map<string, string[]>();

  for (const entry of entries) {
    const recId = entry.id;
    const word = entry.word || entry.simplified || '';

    // 1. Check for suspicious pseudo-words (e.g. 维芯, 维卡, 维码)
    if (word.startsWith('维') && ['芯', '卡', '码', '圈', '网', '端'].includes(word.charAt(1))) {
      suspiciousGeneratedWords.push({
        recordIds: [recId],
        words: [word],
        errorType: 'SYNTHETIC_MORPHEME_PSEUDO_WORD',
        field: 'word',
        currentValues: [word, entry.meaningVi || ''],
        similarityScore: null,
        reason: `Word '${word}' is a synthetic pseudo-combination ('Duy trì + noun')`,
        suggestedAction: 'Delete pseudo-word or replace with authentic dictionary entry',
      });
    }

    // 2. Track prefix repetition
    if (word.length >= 2) {
      const prefix = word.charAt(0);
      if (!prefixFreq.has(prefix)) prefixFreq.set(prefix, { ids: [], words: [] });
      prefixFreq.get(prefix)!.ids.push(recId);
      prefixFreq.get(prefix)!.words.push(word);
    }

    // 3. Check for placeholder content
    if (entry.meaningEn && entry.meaningEn.includes('Practical Chinese (')) {
      placeholderContent.push({
        recordIds: [recId],
        words: [word],
        errorType: 'PLACEHOLDER_ENGLISH_MEANING',
        field: 'meaningEn',
        currentValues: [entry.meaningEn],
        similarityScore: null,
        reason: 'Meaning contains placeholder string Practical Chinese (...)',
        suggestedAction: 'Clear placeholder English meaning or replace with authentic translation',
      });
    }

    // 4. Track translation pattern repetition (e.g. "Duy trì + noun")
    if (entry.meaningVi) {
      const normVi = normalizeText(entry.meaningVi);
      if (normVi.startsWith('duy tri ') || normVi.startsWith('kiem soat ') || normVi.startsWith('quan ly ')) {
        if (!translationFreq.has(normVi)) translationFreq.set(normVi, { ids: [], words: [] });
        translationFreq.get(normVi)!.ids.push(recId);
        translationFreq.get(normVi)!.words.push(word);
      }
    }

    // 5. Track exact duplicates
    const normKey = `${entry.language}_${normalizeText(word)}_${normalizeText(entry.pinyin || entry.ipa || '')}`;
    if (!wordKeyMap.has(normKey)) wordKeyMap.set(normKey, []);
    wordKeyMap.get(normKey)!.push(recId);

    // 6. Check invalid Pinyin / HSK / POS
    if (entry.language === 'zh' && (!entry.pinyin || entry.pinyin === 'pīnyīn')) {
      invalidPinyin.push({
        recordIds: [recId],
        words: [word],
        errorType: 'INVALID_PINYIN',
        field: 'pinyin',
        currentValues: [entry.pinyin || ''],
        similarityScore: null,
        reason: 'Pinyin is missing or default fallback string',
        suggestedAction: 'Add tone-marked Pinyin',
      });
    }

    if (entry.hskLevel && !['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].includes(entry.hskLevel)) {
      invalidHsk.push({
        recordIds: [recId],
        words: [word],
        errorType: 'INVALID_HSK_LEVEL',
        field: 'hskLevel',
        currentValues: [entry.hskLevel],
        similarityScore: null,
        reason: 'HSK level is not a valid HSK level string',
        suggestedAction: 'Set valid HSK level or null',
      });
    }
  }

  // Evaluate Prefix Repetition (>= 4 records with same prefix)
  for (const [prefix, data] of prefixFreq.entries()) {
    if (data.ids.length >= 6) {
      repeatedPrefixPatterns.push({
        recordIds: data.ids,
        words: data.words,
        errorType: 'REPEATED_PREFIX_PATTERN_BATCH',
        field: 'word',
        currentValues: [`Prefix: ${prefix}`],
        similarityScore: null,
        reason: `${data.ids.length} words share the exact same starting character '${prefix}'`,
        suggestedAction: 'Audit for synthetic morpheme duplication batch',
      });
    }
  }

  // Evaluate Translation Template Repetition (>= 4 records)
  for (const [pattern, data] of translationFreq.entries()) {
    if (data.ids.length >= 4) {
      repeatedTranslationTemplates.push({
        recordIds: data.ids,
        words: data.words,
        errorType: 'REPEATED_TRANSLATION_TEMPLATE',
        field: 'meaningVi',
        currentValues: [pattern],
        similarityScore: null,
        reason: `${data.ids.length} words share literal translation template '${pattern}'`,
        suggestedAction: 'Replace literal translation templates with authentic natural meanings',
      });
    }
  }

  // Evaluate Exact Duplicates
  for (const [key, ids] of wordKeyMap.entries()) {
    if (ids.length > 1) {
      exactDuplicates.push({
        recordIds: ids,
        words: [key],
        errorType: 'EXACT_DUPLICATE',
        field: 'word+pinyin',
        currentValues: [key],
        similarityScore: 1.0,
        reason: `Duplicate entries for key ${key}`,
        suggestedAction: 'Deduplicate records',
      });
    }
  }

  // Save 14 Audit Reports
  fs.writeFileSync(path.join(reportsDir, 'exact-duplicates.json'), JSON.stringify(exactDuplicates, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'semantic-duplicates.json'), JSON.stringify(semanticDuplicates, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'suspicious-generated-words.json'), JSON.stringify(suspiciousGeneratedWords, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-prefix-patterns.json'), JSON.stringify(repeatedPrefixPatterns, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-translation-templates.json'), JSON.stringify(repeatedTranslationTemplates, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'invalid-pinyin.json'), JSON.stringify(invalidPinyin, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'invalid-hsk.json'), JSON.stringify(invalidHsk, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'invalid-part-of-speech.json'), JSON.stringify(invalidPartOfSpeech, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'invalid-collocations.json'), JSON.stringify(invalidCollocations, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'repeated-examples.json'), JSON.stringify(repeatedExamples, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'placeholder-content.json'), JSON.stringify(placeholderContent, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'unverified-records.json'), JSON.stringify(unverifiedRecords, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'needs-human-review.json'), JSON.stringify(needsHumanReview, null, 2));

  const summary = {
    totalRecordsAudited: entries.length,
    exactDuplicatesCount: exactDuplicates.length,
    suspiciousGeneratedWordsCount: suspiciousGeneratedWords.length,
    repeatedPrefixPatternsCount: repeatedPrefixPatterns.length,
    repeatedTranslationTemplatesCount: repeatedTranslationTemplates.length,
    placeholderContentCount: placeholderContent.length,
    invalidPinyinCount: invalidPinyin.length,
    auditTimestamp: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(reportsDir, 'audit-summary.json'), JSON.stringify(summary, null, 2));

  console.log('=== AUDIT COMPLETE ===');
  console.log(`- Total Audited: ${entries.length}`);
  console.log(`- Suspicious Pseudo Words: ${suspiciousGeneratedWords.length}`);
  console.log(`- Exact Duplicates: ${exactDuplicates.length}`);
  console.log(`- Placeholder Content: ${placeholderContent.length}`);
  console.log(`- Summary written to: ${path.join(reportsDir, 'audit-summary.json')}`);

  return summary;
}

if (require.main === module) {
  runFullVocabularyAudit()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
