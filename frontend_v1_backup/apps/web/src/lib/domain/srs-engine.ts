export type SRSGrade = 'again' | 'hard' | 'good' | 'easy';

export interface SRSState {
  interval: number;      // Days until next review
  repetitions: number;   // Number of successful reviews
  easeFactor: number;    // Ease factor (multiplier, min 1.3, default 2.5)
  leitnerBox: number;    // Leitner Box level (1 to 5)
  lapses: number;        // Total lapse count
}

export interface SRSResult extends SRSState {
  dueDate: Date;
  dueLabel: string;
}

export interface SRSReviewHistoryItem {
  flashcardId: string;
  previousState: SRSState;
  newState: SRSResult;
  ratedAt: Date;
  rating: SRSGrade;
}

/**
 * Calculates next Spaced Repetition (FSRS / SM-2) state
 */
export function calculateSRS(
  currentState: SRSState = { interval: 1, repetitions: 0, easeFactor: 2.5, leitnerBox: 1, lapses: 0 },
  rating: SRSGrade
): SRSResult {
  let { interval, repetitions, easeFactor, leitnerBox, lapses } = currentState;

  switch (rating) {
    case 'again': {
      repetitions = 0;
      interval = 1;
      lapses += 1;
      leitnerBox = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    }
    case 'hard': {
      repetitions += 1;
      interval = repetitions === 1 ? 1 : Math.max(1, Math.round(interval * 1.2));
      leitnerBox = Math.min(5, leitnerBox);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    }
    case 'good': {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 4;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      leitnerBox = Math.min(5, leitnerBox + 1);
      break;
    }
    case 'easy': {
      if (repetitions === 0) {
        interval = 4;
      } else if (repetitions === 1) {
        interval = 10;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      repetitions += 1;
      leitnerBox = Math.min(5, leitnerBox + 1);
      easeFactor += 0.15;
      break;
    }
  }

  // Calculate Due Date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  // Friendly human readable due label
  let dueLabel = 'Ôn lại ngay';
  if (rating === 'again') {
    dueLabel = 'Ôn lại sau 10 phút';
  } else if (interval === 1) {
    dueLabel = 'Ôn sau 1 ngày';
  } else if (interval > 1) {
    dueLabel = `Ôn sau ${interval} ngày`;
  }

  return {
    interval,
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    leitnerBox,
    lapses,
    dueDate,
    dueLabel,
  };
}

/**
 * Calculates due status for a flashcard based on dueDate
 */
export function isFlashcardDue(dueDate: Date | string | null | undefined): boolean {
  if (!dueDate) return true; // New cards are due immediately
  const due = new Date(dueDate);
  return due.getTime() <= Date.now();
}
