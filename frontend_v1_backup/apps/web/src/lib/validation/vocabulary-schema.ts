import { z } from 'zod';

export const SynonymAntonymSchema = z.object({
  word: z.string().min(1, 'Word must not be empty'),
  pinyin: z.string().optional(),
  ipa: z.string().optional(),
  meaningVi: z.string().min(1, 'Meaning must not be empty'),
});

export const ExampleSchema = z.object({
  chinese: z.string().min(1),
  pinyin: z.string().optional(),
  vietnamese: z.string().min(1),
  english: z.string().optional(),
});

export const VocabularySchema = z.object({
  id: z.string().min(1, 'ID must not be empty'),
  simplified: z.string().min(1, 'Simplified must not be empty'),
  traditional: z.string().optional().default(''),
  pinyin: z.string().min(1, 'Pinyin must not be empty'),
  pinyinNumbered: z.string().optional().default(''),
  vietnameseMeanings: z.array(z.string()).min(1, 'At least one Vietnamese meaning is required'),
  englishMeanings: z.array(z.string()).default([]),
  partOfSpeech: z.array(z.string()).min(1, 'At least one Part of Speech is required'),
  hskLevel: z.enum(['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']).nullable().default(null),
  vocabularySystem: z.enum(['HSK', 'TOEIC', 'factory', 'daily']).default('factory'),
  factoryCategory: z.string().nullable().default(null),
  synonyms: z.array(SynonymAntonymSchema).default([]),
  antonyms: z.array(SynonymAntonymSchema).default([]),
  collocations: z.array(z.string()).default([]),
  examples: z.array(ExampleSchema).default([]),
  usageNotes: z.string().default(''),
  source: z.string().default(''),
  verified: z.boolean().default(true),
  needsReview: z.boolean().default(false),
}).superRefine((data, ctx) => {
  // 1. Reject placeholder English meaning "Practical Chinese (...)"
  data.englishMeanings.forEach((mean, idx) => {
    if (mean.includes('Practical Chinese (')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `English meaning '${mean}' is a placeholder template and is not allowed`,
        path: ['englishMeanings', idx],
      });
    }
  });

  // 2. Reject placeholder collocation "+ 第一"
  data.collocations.forEach((col, idx) => {
    if (col.includes('+ 第一') || col.endsWith('第一')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Collocation '${col}' is an unnatural placeholder and is not allowed`,
        path: ['collocations', idx],
      });
    }
  });

  // 3. Synonym cannot be the word itself
  data.synonyms.forEach((syn, idx) => {
    if (syn.word === data.simplified) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Synonym '${syn.word}' cannot be identical to the word itself`,
        path: ['synonyms', idx],
      });
    }
  });

  // 4. Antonym cannot be the word itself
  data.antonyms.forEach((ant, idx) => {
    if (ant.word === data.simplified) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Antonym '${ant.word}' cannot be identical to the word itself`,
        path: ['antonyms', idx],
      });
    }
  });

  // 5. Word cannot appear in both synonyms and antonyms
  const synSet = new Set(data.synonyms.map(s => s.word));
  data.antonyms.forEach((ant, idx) => {
    if (synSet.has(ant.word)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Word '${ant.word}' cannot appear in both synonyms and antonyms`,
        path: ['antonyms', idx],
      });
    }
  });

  // 6. Example sentences must contain the main word
  data.examples.forEach((ex, idx) => {
    if (ex.chinese && !ex.chinese.includes(data.simplified)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Example sentence at index ${idx} must contain the main word '${data.simplified}'`,
        path: ['examples', idx],
      });
    }
  });
});

export const VocabularyRecordSchema = VocabularySchema;
export type VocabularyRecord = z.infer<typeof VocabularySchema>;

// Text normalization helper
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s\u4e00-\u9fa5]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein similarity distance helper
export function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeText(str1);
  const norm2 = normalizeText(str2);
  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  const len1 = norm1.length;
  const len2 = norm2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = norm1[i - 1] === norm2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}
