import { describe, it, expect } from 'vitest';
import {
  GRAMMAR_DATASET,
  getGrammarLessons,
  GRAMMAR_COMPARISONS,
  GRAMMAR_ERROR_LAB,
  GRAMMAR_DIALOGUES,
} from '../../data/grammar-dataset';
import {
  generate1000GrammarExercises,
  getGrammarExercisesFiltered,
} from '../../data/grammar-exercise-generator';

describe('General Daily Life Communication Grammar Module Test Suite', () => {
  // Test 1: Production dataset contains authentic Chinese and English general communication lessons
  it('1. should contain verified Chinese (HSK) and English (CEFR) grammar lessons', () => {
    expect(GRAMMAR_DATASET.length).toBeGreaterThan(3);
    const zhLesson = GRAMMAR_DATASET.find((l) => l.language === 'zh');
    const enLesson = GRAMMAR_DATASET.find((l) => l.language === 'en');
    expect(zhLesson).toBeDefined();
    expect(enLesson).toBeDefined();
  });

  // Test 2: Purge synthetic dummy placeholders ("Bài 248")
  it('2. should not contain synthetic placeholder titles like "Bài 248"', () => {
    for (const item of GRAMMAR_DATASET) {
      expect(item.titleVi).not.toContain('Mẫu 248');
      expect(item.titleVi).not.toContain('Bài 248');
      expect(item.formula).not.toContain('Mẫu 248');
    }
  });

  // Test 3: Multi-parameter filtering by level and topic
  it('3. should filter lessons by language, level, and daily life topic', () => {
    const zhDaily = getGrammarLessons('zh', 'HSK2', 'daily-life');
    expect(zhDaily.length).toBeGreaterThan(0);
    for (const l of zhDaily) {
      expect(l.language).toBe('zh');
      expect(l.level).toBe('HSK2');
      expect(l.topic).toBe('daily-life');
    }
  });

  // Test 4: Sentence Scrambler data integrity
  it('4. should validate scrambledWords and correctOrder arrays for sentence scrambler practice', () => {
    for (const l of GRAMMAR_DATASET) {
      expect(l.scrambledWords.length).toBeGreaterThan(0);
      expect(l.correctOrder.length).toBeGreaterThan(0);
      expect(l.scrambledWords.length).toEqual(l.correctOrder.length);
    }
  });

  // Test 6: Verify all 12 English tenses + 3 future variations exist
  it('6. should contain all 15 English tenses and future variations', () => {
    const enLessons = GRAMMAR_DATASET.filter((l) => l.language === 'en');
    expect(enLessons.length).toBeGreaterThanOrEqual(15);

    const tenseTitles = [
      'Present Simple',
      'Present Continuous',
      'Present Perfect',
      'Present Perfect Continuous',
      'Past Simple',
      'Past Continuous',
      'Past Perfect',
      'Past Perfect Continuous',
      'Future Simple',
      'Future Continuous',
      'Future Perfect',
      'Future Perfect Continuous',
      'Be going to',
      'Present Continuous for Future',
      'Present Simple for Timetables',
    ];

    for (const title of tenseTitles) {
      const match = enLessons.find(
        (l) => l.titleVi.includes(title) || l.titleEn.includes(title)
      );
      expect(match, `Missing English tense: ${title}`).toBeDefined();
    }
  });

  // Test 7: Verify all 17 Chinese aspect and time structures exist
  it('7. should contain all 17 Chinese aspect and time structures', () => {
    const zhLessons = GRAMMAR_DATASET.filter((l) => l.language === 'zh');
    expect(zhLessons.length).toBeGreaterThanOrEqual(17);

    const zhTitles = [
      '1. Hành động thường xuyên',
      '2. Hành động đang diễn ra',
      '3. Hành động đã hoàn thành',
      '4. Trải nghiệm trong quá khứ',
      '5. Trạng thái hoặc hành động đang duy trì',
      '6. Trạng thái mới hoặc sự thay đổi',
      '7. Hành động đã xảy ra',
      '8. Hành động chưa xảy ra',
      '9. Hành động đang tiếp tục',
      '10. Dự định tương lai',
      '11. Dự đoán hoặc khả năng tương lai',
      '12. Tương lai gần',
      '13. Hành động đang diễn ra tại mốc quá khứ',
      '14. Hành động xảy ra trước một hành động quá khứ khác',
      '15. Hành động sẽ đang diễn ra trong tương lai',
      '16. Hành động sẽ hoàn thành trước mốc tương lai',
      '17. Hành động kéo dài đến hiện tại',
    ];

    for (const title of zhTitles) {
      const match = zhLessons.find((l) => l.titleVi.includes(title));
      expect(match, `Missing Chinese structure: ${title}`).toBeDefined();
    }
  });

  // Test 8: 1,000+ Exercise Suite Generator & Language Filtering
  it('8. should generate 1,000+ exercises and correctly separate Chinese & English', () => {
    const allExercises = generate1000GrammarExercises();
    expect(allExercises.length).toBeGreaterThanOrEqual(1000);

    const zhEx = getGrammarExercisesFiltered('zh');
    const enEx = getGrammarExercisesFiltered('en');

    expect(zhEx.length).toBeGreaterThan(0);
    expect(enEx.length).toBeGreaterThan(0);
    expect(zhEx.every((item) => item.language === 'zh')).toBe(true);
    expect(enEx.every((item) => item.language === 'en')).toBe(true);
  });
});


