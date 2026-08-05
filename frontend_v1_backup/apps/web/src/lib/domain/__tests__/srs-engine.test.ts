import { describe, it, expect } from 'vitest';
import { calculateSRS, isFlashcardDue } from '../srs-engine';

describe('SRS Engine (FSRS / SM-2)', () => {
  it('should reset interval and lapses on "again" rating', () => {
    const state = { interval: 10, repetitions: 3, easeFactor: 2.5, leitnerBox: 3, lapses: 1 };
    const result = calculateSRS(state, 'again');

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.lapses).toBe(2);
    expect(result.leitnerBox).toBe(1);
    expect(result.dueLabel).toBe('Ôn lại sau 10 phút');
  });

  it('should increase interval and Leitner Box on "good" rating', () => {
    const state = { interval: 1, repetitions: 0, easeFactor: 2.5, leitnerBox: 1, lapses: 0 };
    const result = calculateSRS(state, 'good');

    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
    expect(result.leitnerBox).toBe(2);

    const result2 = calculateSRS(result, 'good');
    expect(result2.repetitions).toBe(2);
    expect(result2.interval).toBe(4);
    expect(result2.leitnerBox).toBe(3);
  });

  it('should boost interval and ease factor on "easy" rating', () => {
    const state = { interval: 4, repetitions: 2, easeFactor: 2.5, leitnerBox: 3, lapses: 0 };
    const result = calculateSRS(state, 'easy');

    expect(result.repetitions).toBe(3);
    expect(result.easeFactor).toBeGreaterThan(2.5);
    expect(result.interval).toBeGreaterThan(4);
    expect(result.dueLabel).toContain('ngày');
  });

  it('should correctly evaluate if flashcard is due', () => {
    const pastDate = new Date(Date.now() - 3600 * 1000);
    const futureDate = new Date(Date.now() + 86400 * 1000);

    expect(isFlashcardDue(pastDate)).toBe(true);
    expect(isFlashcardDue(futureDate)).toBe(false);
    expect(isFlashcardDue(null)).toBe(true);
  });
});
