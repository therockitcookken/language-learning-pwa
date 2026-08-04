import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { evaluateQuizAttempt, UserAnswerInput } from '@/lib/domain/quiz-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizId, userId, answers } = body as {
      quizId: string;
      userId?: string;
      answers: UserAnswerInput[];
    };

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Thiếu thông tin nộp bài quiz.' } },
        { status: 400 }
      );
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: { code: 'QUIZ_NOT_FOUND', message: 'Không tìm thấy bài quiz.' } },
        { status: 404 }
      );
    }

    const formattedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      quizId: q.quizId,
      questionType: q.questionType as any,
      prompt: q.prompt,
      audioUrl: q.audioUrl || undefined,
      imageUrl: q.imageUrl || undefined,
      options: JSON.parse(q.optionsJson || '[]'),
      correctAnswer: q.correctAnswer,
      explanationVi: q.explanationVi,
      explanationEn: q.explanationEn || undefined,
      factoryContext: q.factoryContext || undefined,
    }));

    const result = evaluateQuizAttempt(formattedQuestions, answers);

    let uid = userId;
    if (!uid) {
      const guest = await db.user.findFirst({ where: { isGuest: true } });
      uid = guest?.id;
    }

    if (uid) {
      await db.quizAttempt.create({
        data: {
          userId: uid,
          quizId,
          score: result.totalScore,
          totalQuestions: result.totalQuestions,
          timeSpentSecs: result.timeSpentSecs,
          answersJson: JSON.stringify(answers),
        },
      });

      // Award XP
      await db.progressEvent.create({
        data: {
          userId: uid,
          eventType: 'quiz_passed',
          xpEarned: result.passed ? 50 : 10,
        },
      });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'SUBMIT_ERROR', message: 'Lỗi chấm điểm bài thi.' } },
      { status: 500 }
    );
  }
}
