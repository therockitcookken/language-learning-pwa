/**
 * Quiz Engine for Industrial Language Learning (Chinese HSK1-6 & English CEFR A1-C2)
 * Supports 17+ Exercise Types, Answer Verification, Adaptive Difficulty, Scoring, Weak Topic Mining & SRS Flashcard Generation.
 */

export interface QuizQuestionData {
  id: string;
  quizId: string;
  language?: 'zh' | 'en';
  level?: string;
  topic?: string;
  skill?: string;
  questionType: string;
  prompt: string;
  pinyinOrIpa?: string;
  simplifiedOrWord?: string;
  audioUrl?: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string; // Index, option string, or JSON string array
  explanationVi: string;
  explanationEn?: string;
  factoryContext?: string;
  recommendedTimeSecs?: number;
  points?: number;
  sourceData?: string;
}

export interface UserAnswerInput {
  questionId: string;
  userAnswer: string;
  timeTakenSecs: number;
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  scoreEarned: number;
  explanationVi: string;
  topic?: string;
  level?: string;
}

export interface QuizAttemptSummary {
  totalQuestions: number;
  correctCount: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  timeSpentSecs: number;
  results: QuestionResult[];
  weakTopics: string[];
  recommendationsVi: string[];
}

export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');
}

export function verifyAnswer(
  question: QuizQuestionData,
  userAnswer: string
): boolean {
  if (!userAnswer || userAnswer.trim() === '') return false;

  const normUser = normalizeString(userAnswer);
  const normCorrect = normalizeString(question.correctAnswer);

  // 1. JSON array answer (e.g. for multiple choice or pair matching)
  if (question.correctAnswer.startsWith('[') && question.correctAnswer.endsWith(']')) {
    try {
      const correctArr: string[] = JSON.parse(question.correctAnswer);
      const userArr: string[] = userAnswer.startsWith('[') ? JSON.parse(userAnswer) : [userAnswer];

      const normCorrectSet = new Set(correctArr.map(normalizeString));
      const normUserSet = new Set(userArr.map(normalizeString));

      if (normCorrectSet.size !== normUserSet.size) return false;
      for (const item of normCorrectSet) {
        if (!normUserSet.has(item)) return false;
      }
      return true;
    } catch {
      // Fallback to normal string match if JSON parse fails
    }
  }

  // 2. Index match e.g. "0", "1", "2"
  if (/^\d+$/.test(question.correctAnswer.trim())) {
    const idx = parseInt(question.correctAnswer.trim(), 10);
    const correctOpt = question.options[idx];
    if (correctOpt) {
      if (normUser === normalizeString(correctOpt) || normUser === question.correctAnswer.trim()) {
        return true;
      }
    }
  }

  // 3. Option choice text direct match
  if (question.options.some((opt) => normalizeString(opt) === normUser && normalizeString(opt) === normCorrect)) {
    return true;
  }

  // 4. Fuzzy / Direct String Comparison
  return normUser === normCorrect;
}

export function evaluateQuizAttempt(
  questions: QuizQuestionData[],
  answers: UserAnswerInput[]
): QuizAttemptSummary {
  let correctCount = 0;
  let totalScore = 0;
  let timeSpentSecs = 0;
  const results: QuestionResult[] = [];
  const weakTopicsSet = new Set<string>();

  const answerMap = new Map<string, UserAnswerInput>();
  answers.forEach((ans) => answerMap.set(ans.questionId, ans));

  questions.forEach((q) => {
    const userAns = answerMap.get(q.id);
    const userAnswerStr = userAns?.userAnswer || '';
    const timeSecs = userAns?.timeTakenSecs || 0;
    timeSpentSecs += timeSecs;

    const isCorrect = verifyAnswer(q, userAnswerStr);
    const points = q.points || 10;
    const score = isCorrect ? points : 0;
    if (isCorrect) {
      correctCount++;
      totalScore += score;
    } else {
      if (q.topic) weakTopicsSet.add(q.topic);
      if (q.factoryContext) weakTopicsSet.add(q.factoryContext);
    }

    let displayCorrect = q.correctAnswer;
    if (/^\d+$/.test(q.correctAnswer.trim())) {
      const idx = parseInt(q.correctAnswer.trim(), 10);
      if (q.options[idx]) displayCorrect = q.options[idx];
    }

    results.push({
      questionId: q.id,
      isCorrect,
      correctAnswer: displayCorrect,
      userAnswer: userAnswerStr,
      scoreEarned: score,
      explanationVi: q.explanationVi,
      topic: q.topic || q.factoryContext || 'General',
      level: q.level || 'HSK1/A1',
    });
  });

  const total = Math.max(1, questions.length);
  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 70;

  const weakTopics = Array.from(weakTopicsSet);
  const recommendationsVi: string[] = [];
  if (percentage < 70) {
    recommendationsVi.push(`Nên tập trung ôn luyện lại các chủ đề yếu: ${weakTopics.slice(0, 3).join(', ') || 'Từ vựng & Ngữ pháp công xưởng'}.`);
    recommendationsVi.push('Dùng chức năng Luyện lại câu sai để khắc phục ngay các lỗi vừa mắc phải.');
  } else {
    recommendationsVi.push('Chúc mừng bạn đã đạt chỉ tiêu kiến thức kiểm tra công xưởng!');
    recommendationsVi.push('Hãy tiếp tục thử thách bản thân với các bài thi cấp độ cao hơn.');
  }

  return {
    totalQuestions: questions.length,
    correctCount,
    totalScore,
    percentage,
    passed,
    timeSpentSecs,
    results,
    weakTopics,
    recommendationsVi,
  };
}

/**
 * Adaptive Difficulty Adjuster
 * Increases level after 2 consecutive correct answers, decreases after 1 incorrect answer.
 */
export function getNextAdaptiveLevel(
  currentLevel: string,
  recentResults: boolean[],
  language: 'zh' | 'en'
): string {
  const levelsZh = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];
  const levelsEn = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const levels = language === 'zh' ? levelsZh : levelsEn;

  let idx = levels.indexOf(currentLevel.toUpperCase());
  if (idx === -1) idx = 0;

  const lastTwo = recentResults.slice(-2);
  if (lastTwo.length >= 2 && lastTwo.every((r) => r === true)) {
    return levels[Math.min(levels.length - 1, idx + 1)];
  }
  if (recentResults.length > 0 && recentResults[recentResults.length - 1] === false) {
    return levels[Math.max(0, idx - 1)];
  }

  return levels[idx];
}
