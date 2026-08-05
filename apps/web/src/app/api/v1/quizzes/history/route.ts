import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'all';

    const user = await db.user.findFirst({ where: { email: 'factory.worker@example.com' } });
    if (!user) {
      return NextResponse.json({ data: [], stats: { totalAttempts: 0, highestScore: 0, passRate: 0 } });
    }

    const attempts = await db.quizAttempt.findMany({
      where: { userId: user.id },
      include: { quiz: true },
      orderBy: { completedAt: 'desc' },
      take: 50,
    });

    const filtered = attempts.filter((att: any) => {
      if (lang === 'all') return true;
      return att.quiz?.language === lang || att.quizId.includes(`-${lang}-`);
    });

    const totalAttempts = filtered.length;
    let highestScore = 0;
    let passedCount = 0;
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswered = 0;

    filtered.forEach((att: any) => {
      if (att.score > highestScore) highestScore = att.score;
      const pct = Math.round((att.score / Math.max(1, att.totalQuestions * 10)) * 100);
      if (pct >= 70) passedCount++;
      totalQuestionsAnswered += att.totalQuestions;
      totalCorrectAnswered += Math.round((att.score / 10));
    });

    const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

    return NextResponse.json({
      data: filtered.map((att: any) => ({
        id: att.id,
        quizId: att.quizId,
        quizTitle: att.quiz?.title || (att.quizId.includes('zh') ? 'Bài kiểm tra tiếng Trung' : 'English Quiz'),
        language: att.quiz?.language || (att.quizId.includes('zh') ? 'zh' : 'en'),
        score: att.score,
        totalQuestions: att.totalQuestions,
        timeSpentSecs: att.timeSpentSecs,
        completedAt: att.completedAt,
        percentage: Math.round((att.score / Math.max(1, att.totalQuestions * 10)) * 100),
        passed: Math.round((att.score / Math.max(1, att.totalQuestions * 10)) * 100) >= 70,
      })),
      stats: {
        totalAttempts,
        highestScore,
        passRate,
        totalQuestionsAnswered,
        totalCorrectAnswered,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'HISTORY_ERROR', message: 'Không thể tải lịch sử bài thi.' } },
      { status: 500 }
    );
  }
}
