/**
 * Chinese & English Industrial Grammar Lessons Dataset
 * Re-exports verified GRAMMAR_DATASET with zero synthetic dummy generator loops.
 */

import { GRAMMAR_DATASET, GrammarLessonRecord } from './grammar-dataset';

export type { GrammarLessonRecord as GrammarLessonSeed };

export const GRAMMAR_LESSONS_SEED = GRAMMAR_DATASET;

export function generateFullGrammarLessons(): GrammarLessonRecord[] {
  return GRAMMAR_DATASET;
}
