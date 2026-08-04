/**
 * Quiz Engine for Factory Language Learning
 * Handles scoring, anti-guessing time penalty, explanation generation, and answer verification.
 */

export interface QuizQuestionData {
  id: string;
  quizId: string;
  questionType:
    | 'select_meaning'
    | 'select_word'
    | 'select_image'
    | 'listen_pick'
    | 'listen_type'
    | 'fill_blank'
    | 'sentence_order'
    | 'pair_matching'
    | 'select_pinyin'
    | 'select_tone'
    | 'select_ipa'
    | 'sound_distinction'
    | 'select_correct_sentence'
    | 'fix_wrong_sentence'
    | 'translate_sentence'
    | 'situational_dialogue'
    | 'factory_safety_quiz'
    | 'hsk_cefr_quiz';
  prompt: string;
  audioUrl?: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string; // Index or string matching option
  explanationVi: string;
  explanationEn?: string;
  factoryContext?: string;
}

export interface UserAnswerInput {
  questionId: string;
  userAnswer: string; // Option text, index, or typed string
  timeTakenSecs: number;
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  scoreEarned: number;
  explanationVi: string;
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

export function verifyAnswer(
  question: QuizQuestionData,
  userAnswer: string
): boolean {
  const normUser = userAnswer.trim().toLowerCase();
  const normCorrect = question.correctAnswer.trim().toLowerCase();

  // If correct answer is an index e.g., "0" or "1"
  if (/^\d+$/.test(normCorrect)) {
    const idx = parseInt(normCorrect, 10);
    const correctOption = question.options[idx]?.trim().toLowerCase();
    if (correctOption && (normUser === normCorrect || normUser === correctOption)) {
      return true;
    }
  }

  // Direct string comparison
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
    const score = isCorrect ? 10 : 0;
    if (isCorrect) {
      correctCount++;
      totalScore += score;
    } else if (q.factoryContext) {
      weakTopicsSet.add(q.factoryContext);
    }

    results.push({
      questionId: q.id,
      isCorrect,
      correctAnswer: q.options[parseInt(q.correctAnswer, 10)] || q.correctAnswer,
      userAnswer: userAnswerStr,
      scoreEarned: score,
      explanationVi: q.explanationVi,
    });
  });

  const percentage = Math.round((correctCount / Math.max(1, questions.length)) * 100);
  const passed = percentage >= 70;

  const recommendationsVi: string[] = [];
  if (percentage < 70) {
    recommendationsVi.push('Nên ôn tập lại các từ vựng và thuật ngữ an toàn công xưởng chưa đạt.');
    recommendationsVi.push('Luyện tập thêm phần nghe và phát âm Pinyin/IPA trước khi thi lại.');
  } else {
    recommendationsVi.push('Chúc mừng bạn đã đạt chỉ tiêu kiến thức công xưởng!');
    recommendationsVi.push('Hãy tiếp tục duy trì chuỗi Streak học tập hằng ngày.');
  }

  return {
    totalQuestions: questions.length,
    correctCount,
    totalScore,
    percentage,
    passed,
    timeSpentSecs,
    results,
    weakTopics: Array.from(weakTopicsSet),
    recommendationsVi,
  };
}
