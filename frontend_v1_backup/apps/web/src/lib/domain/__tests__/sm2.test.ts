import { describe, it, expect } from 'vitest';
import { calculateSM2 } from '../sm2';

describe('SM-2 Spaced Repetition Algorithm', () => {
  it('should reset interval to 1 on "again" rating', () => {
    const state = { interval: 10, repetitions: 3, easeFactor: 2.5 };
    const result = calculateSM2(state, 'again');

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it('should increase interval and repetitions on "good" rating', () => {
    const state = { interval: 1, repetitions: 0, easeFactor: 2.5 };
    const result = calculateSM2(state, 'good');

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);

    const secondResult = calculateSM2(result, 'good');
    expect(secondResult.interval).toBe(6);
    expect(secondResult.repetitions).toBe(2);
  });

  it('should enforce minimum Ease Factor of 1.3', () => {
    let state = { interval: 1, repetitions: 0, easeFactor: 1.4 };
    for (let i = 0; i < 5; i++) {
      state = calculateSM2(state, 'again');
    }
    expect(state.easeFactor).toBe(1.3);
  });
});
