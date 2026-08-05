/**
 * Unified Factory Grammar Dataset Aggregator
 * Imports and merges modular grammar catalogs for Chinese and English,
 * and exports auxiliary feature datasets for Comparison Studio, Error Lab, and Dialogue Lab.
 */

import { CHINESE_GRAMMAR_CATALOG } from './grammar-catalogs/chinese-grammar-catalog';
import { ENGLISH_GRAMMAR_CATALOG } from './grammar-catalogs/english-grammar-catalog';
import { GRAMMAR_COMPARISONS_CATALOG, ComparisonSet } from './grammar-catalogs/grammar-comparisons-catalog';
import { GRAMMAR_ERROR_LAB_CATALOG, ErrorLabItem } from './grammar-catalogs/grammar-error-lab-catalog';
import { GRAMMAR_DIALOGUES_CATALOG, WorkplaceDialogueItem } from './grammar-catalogs/grammar-dialogues-catalog';

export type GrammarLanguage = 'zh' | 'en';

export type FactoryGrammarTopic =
  | 'general'
  | 'daily-life'
  | 'travel'
  | 'dining'
  | 'shopping'
  | 'hobbies'
  | 'family'
  | 'school'
  | 'weather'
  | 'sports'
  | 'health'
  | 'services'
  | 'factory-communication'
  | 'production'
  | 'assembly-line'
  | 'safety'
  | 'quality'
  | 'maintenance'
  | 'warehouse'
  | 'logistics'
  | 'packaging'
  | 'electrical'
  | 'mechanical'
  | 'emergency'
  | 'shift-handover'
  | 'attendance'
  | 'overtime'
  | 'human-resources'
  | 'interview'
  | 'management'
  | 'meeting'
  | 'reporting'
  | 'iso'
  | '5s-kaizen';

export interface GrammarLessonRecord {
  id: string;
  language: GrammarLanguage;
  titleVi: string;
  titleEn: string;
  titleZhSimp?: string;
  titleZhTrad?: string;
  level: string; // HSK1-6 or A1-C2
  topic: FactoryGrammarTopic;
  factoryDomain: string;
  formula: string;
  explanationVi: string;
  explanationEn?: string;
  correctExampleZh?: string;
  correctExamplePinyin?: string;
  correctExampleEn?: string;
  correctExampleIpa?: string;
  correctExampleVi: string;
  wrongExampleZh?: string;
  wrongExampleEn?: string;
  wrongExampleVi: string;
  commonMistakesVi: string;
  comparisonNotesVi?: string;
  factoryScenarioVi: string;
  scrambledWords: string[];
  correctOrder: string[];
}

export const GRAMMAR_DATASET: GrammarLessonRecord[] = [
  ...CHINESE_GRAMMAR_CATALOG,
  ...ENGLISH_GRAMMAR_CATALOG,
];

export const GRAMMAR_COMPARISONS: ComparisonSet[] = GRAMMAR_COMPARISONS_CATALOG;
export const GRAMMAR_ERROR_LAB: ErrorLabItem[] = GRAMMAR_ERROR_LAB_CATALOG;
export const GRAMMAR_DIALOGUES: WorkplaceDialogueItem[] = GRAMMAR_DIALOGUES_CATALOG;

/**
 * Filter Grammar Dataset by Parameters
 */
export function getGrammarLessons(
  lang: 'zh' | 'en' | 'all' = 'all',
  level = '',
  topic = '',
  searchQuery = ''
): GrammarLessonRecord[] {
  return GRAMMAR_DATASET.filter((item) => {
    const matchLang = lang === 'all' || item.language === lang;
    const matchLevel = !level || item.level.toLowerCase() === level.toLowerCase();
    const matchTopic = !topic || item.topic.toLowerCase() === topic.toLowerCase();
    const matchQuery =
      !searchQuery ||
      item.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanationVi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchLang && matchLevel && matchTopic && matchQuery;
  });
}
