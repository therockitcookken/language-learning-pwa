import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyAnswer } from '@/lib/domain/quiz-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizId, answers, questionIds, autoCreateFlashcards } = body;

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Missing answers array.' } },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({ where: { email: 'factory.worker@example.com' } });
    if (!user) {
      return NextResponse.json({ error: { code: 'AUTH_ERROR', message: 'No default user found.' } }, { status: 401 });
    }

    let questions: any[] = [];
    if (quizId && quizId !== 'custom') {
      const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true },
      });
      if (quiz) questions = quiz.questions;
    }

    if (questions.length === 0 && Array.isArray(questionIds) && questionIds.length > 0) {
      questions = await db.quizQuestion.findMany({
        where: { id: { in: questionIds } },
      });
    }

    if (questions.length === 0 && answers.length > 0) {
      const ids = answers.map((a: any) => a.questionId);
      questions = await db.quizQuestion.findMany({
        where: { id: { in: ids } },
      });
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'No valid questions found for grading.' } }, { status: 404 });
    }

    let correctCount = 0;
    let totalTimeTaken = 0;
    const results: any[] = [];
    const wrongQuestions: any[] = [];

    for (const ans of answers) {
      const q = questions.find((x) => x.id === ans.questionId);
      if (!q) continue;

      const isCorrect = verifyAnswer(
        {
          id: q.id,
          quizId: q.quizId,
          questionType: q.questionType,
          prompt: q.prompt,
          options: typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson || '[]') : q.optionsJson,
          correctAnswer: q.correctAnswer,
          explanationVi: q.explanationVi,
        },
        ans.userAnswer || ''
      );

      if (isCorrect) {
        correctCount += 1;
      } else {
        wrongQuestions.push(q);
      }

      totalTimeTaken += ans.timeTakenSecs || 0;
      results.push({
        questionId: q.id,
        prompt: q.prompt,
        userAnswer: ans.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanationVi: q.explanationVi,
      });
    }

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;
    const totalScore = passed ? correctCount * 10 : correctCount * 5;

    // Save QuizAttempt
    const targetQuizId = quizId || questions[0]?.quizId || 'quiz-zh-hsk1';
    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: targetQuizId,
        score: totalScore,
        totalQuestions,
        timeSpentSecs: totalTimeTaken,
        answersJson: JSON.stringify(answers),
      },
    });

    // Gamification progress event
    await db.progressEvent.create({
      data: {
        userId: user.id,
        eventType: 'quiz_completed',
        xpEarned: totalScore,
        metadata: JSON.stringify({ quizId: targetQuizId, passed, percentage, correctCount, totalQuestions }),
      },
    });

    // Auto Create Flashcards from Mistakes if requested
    let createdFlashcardCount = 0;
    if (autoCreateFlashcards && wrongQuestions.length > 0) {
      for (const w of wrongQuestions) {
        try {
          await db.flashcard.create({
            data: {
              frontText: w.simplifiedOrWord || w.prompt,
              backText: `${w.explanationVi} (Đáp án: ${w.correctAnswer})`,
              pinyinOrIpa: w.pinyinOrIpa || '',
              topic: w.topic || 'Lỗi sai Quiz',
              factoryDomain: w.language === 'zh' ? 'quiz_mistake_zh' : 'quiz_mistake_en',
            },
          });
          createdFlashcardCount++;
        } catch {
          // Ignore duplicate flashcard creation
        }
      }
    }

    return NextResponse.json({
      data: {
        attemptId: attempt.id,
        correctCount,
        totalQuestions,
        percentage,
        passed,
        totalScore,
        timeSpentSecs: totalTimeTaken,
        results,
        createdFlashcardCount,
      },
    });
  } catch (error) {
    console.error('Quiz Submit Error:', error);
    return NextResponse.json(
      { error: { code: 'SUBMIT_ERROR', message: 'Không thể chấm điểm bài thi.' } },
      { status: 500 }
    );
  }
}
