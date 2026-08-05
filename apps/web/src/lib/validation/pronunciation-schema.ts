import { z } from 'zod';

export const ArticulationSchema = z.object({
  place: z.string(),
  manner: z.string(),
  voicing: z.string(),
  aspiration: z.string().optional(),
  tonguePosition: z.string(),
  lipPosition: z.string(),
  jawPosition: z.string().optional(),
  airflow: z.string(),
  vietnameseComparison: z.string(),
});

export const MinimalPairSchema = z.object({
  id: z.string(),
  wordA: z.string(),
  wordB: z.string(),
  phoneticA: z.string().optional(),
  phoneticB: z.string().optional(),
  soundA: z.string().optional(),
  soundB: z.string().optional(),
  meaningViA: z.string(),
  meaningViB: z.string(),
  audioUrlA: z.string().optional(),
  audioUrlB: z.string().optional(),
  correctOptionId: z.string().optional(),
  distinctionNote: z.string().optional(),
  differenceNoteVi: z.string().optional(),
});

export const WordExampleSchema = z.object({
  id: z.string(),
  text: z.string(),
  phonetic: z.string(),
  meaningVi: z.string(),
  audioUrl: z.string().optional(),
  accent: z.string().optional(),
  factoryContext: z.union([z.string(), z.boolean()]).optional(),
  verified: z.boolean().default(true).optional(),
});

export const SentenceExampleSchema = z.object({
  id: z.string(),
  sentence: z.string().optional(),
  text: z.string().optional(),
  pinyin: z.string().optional(),
  phonetic: z.string().optional(),
  ipa: z.string().optional(),
  translationVi: z.string(),
  audioUrl: z.string().optional(),
  verified: z.boolean().default(true).optional(),
});

export const QuizItemSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  type: z.enum(['sound_to_symbol', 'symbol_to_sound', 'minimal_pair', 'tongue_position', 'tone_select', 'dictation']),
  question: z.string(),
  audioUrl: z.string().optional(),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string(),
  explanation: z.string(),
  difficulty: z.string().default('beginner').optional(),
  verified: z.boolean().default(true).optional(),
});

export const PinyinRecordSchema = z.object({
  id: z.string(),
  language: z.literal('zh-CN'),
  system: z.literal('pinyin'),
  group: z.enum(['initial', 'final', 'compound-final', 'nasal-final', 'special-syllable', 'tone', 'tone-rule']),
  symbol: z.string(),
  displayName: z.string(),
  pinyin: z.string(),
  ipa: z.string().optional(),
  category: z.string().optional(),
  articulation: ArticulationSchema,
  descriptionVi: z.string(),
  descriptionEn: z.string().optional(),
  commonMistakes: z.array(z.string()).default([]).optional(),
  correctionTips: z.array(z.string()).default([]).optional(),
  legalCombinations: z.array(z.string()).default([]).optional(),
  illegalCombinations: z.array(z.string()).optional(),
  minimalPairs: z.array(MinimalPairSchema).default([]).optional(),
  exampleSyllables: z.array(z.string()).default([]).optional(),
  exampleWords: z.array(WordExampleSchema).default([]).optional(),
  exampleSentences: z.array(SentenceExampleSchema).default([]).optional(),
  quizItems: z.array(QuizItemSchema).default([]).optional(),
  verified: z.boolean().default(true),
  needsReview: z.boolean().default(false).optional(),
});

export const IPARecordSchema = z.object({
  id: z.string(),
  language: z.literal('en'),
  system: z.literal('ipa'),
  group: z.enum(['consonant', 'monophthong', 'diphthong', 'stress', 'linking', 'intonation']),
  symbol: z.string(),
  displayName: z.string(),
  category: z.string().optional(),
  accentSupport: z.array(z.enum(['en-US', 'en-GB'])),
  articulation: ArticulationSchema,
  descriptionVi: z.string(),
  descriptionEn: z.string().optional(),
  spellingPatterns: z.array(z.string()).default([]).optional(),
  commonMistakes: z.array(z.string()).default([]).optional(),
  correctionTips: z.array(z.string()).default([]).optional(),
  minimalPairs: z.array(MinimalPairSchema).default([]).optional(),
  exampleWords: z.array(WordExampleSchema).default([]).optional(),
  exampleSentences: z.array(SentenceExampleSchema).default([]).optional(),
  quizItems: z.array(QuizItemSchema).default([]).optional(),
  verified: z.boolean().default(true),
  needsReview: z.boolean().default(false).optional(),
});

export type PinyinRecord = z.infer<typeof PinyinRecordSchema>;
export type IPARecord = z.infer<typeof IPARecordSchema>;
export type WordExample = z.infer<typeof WordExampleSchema>;
export type SentenceExample = z.infer<typeof SentenceExampleSchema>;
export type MinimalPair = z.infer<typeof MinimalPairSchema>;
export type QuizItem = z.infer<typeof QuizItemSchema>;
