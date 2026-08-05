import { describe, it, expect } from 'vitest';
import { verifyAnswer, evaluateQuizAttempt, QuizQuestionData } from '../quiz-engine';

describe('Quiz Engine Scoring & Answer Verification', () => {
  const sampleQuestion: QuizQuestionData = {
    id: 'q1',
    quizId: 'quiz_demo',
    questionType: 'select_meaning',
    prompt: 'Từ "头盔" có nghĩa là gì?',
    options: ['Kính bảo hộ', 'Mũ bảo hộ lao động', 'Găng tay', 'Giày bảo hộ'],
    correctAnswer: '1',
    explanationVi: '"头盔" là Mũ bảo hộ lao động.',
    factoryContext: 'PPE An toàn',
  };

  it('should verify answer by index string or option text match', () => {
    expect(verifyAnswer(sampleQuestion, '1')).toBe(true);
    expect(verifyAnswer(sampleQuestion, 'Mũ bảo hộ lao động')).toBe(true);
    expect(verifyAnswer(sampleQuestion, 'Kính bảo hộ')).toBe(false);
  });

  it('should evaluate attempt summary correctly', () => {
    const questions = [sampleQuestion];
    const answers = [{ questionId: 'q1', userAnswer: '1', timeTakenSecs: 5 }];

    const summary = evaluateQuizAttempt(questions, answers);
    expect(summary.totalQuestions).toBe(1);
    expect(summary.correctCount).toBe(1);
    expect(summary.percentage).toBe(100);
    expect(summary.passed).toBe(true);
  });
});
