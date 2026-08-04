/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * Grade ranges from 0 to 5 (or mapped from 'again', 'hard', 'good', 'easy'):
 * - Again (1): Complete blackout, total failure to recall.
 * - Hard (2): Correct response recalled with serious difficulty.
 * - Good (3): Correct response recalled after a hesitation.
 * - Easy (5): Perfect recall, effortless.
 */

export type SM2Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SM2State {
  interval: number;   // In days
  repetitions: number;
  easeFactor: number;
}

export interface SM2Result extends SM2State {
  dueDate: Date;
}

export function calculateSM2(
  currentState: SM2State = { interval: 1, repetitions: 0, easeFactor: 2.5 },
  rating: SM2Rating
): SM2Result {
  let grade = 3;
  switch (rating) {
    case 'again':
      grade = 1;
      break;
    case 'hard':
      grade = 2;
      break;
    case 'good':
      grade = 4;
      break;
    case 'easy':
      grade = 5;
      break;
  }

  let { interval, repetitions, easeFactor } = currentState;

  if (grade >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Calculate new Ease Factor (EF)
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    interval,
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    dueDate,
  };
}
