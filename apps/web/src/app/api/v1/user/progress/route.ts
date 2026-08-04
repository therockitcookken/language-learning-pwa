import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('userId');

    if (!userId) {
      const guest = await db.user.findFirst({ where: { isGuest: true } });
      userId = guest?.id || null;
    }

    if (!userId) {
      return NextResponse.json({
        data: {
          xp: 120,
          level: 2,
          streak: 3,
          wordsLearned: 45,
          quizzesPassed: 6,
          dailyGoalPercent: 75,
        },
      });
    }

    const events = await db.progressEvent.findMany({
      where: { userId },
    });

    const totalXp = events.reduce((sum, e) => sum + e.xpEarned, 0);
    const level = Math.floor(totalXp / 100) + 1;

    const quizAttempts = await db.quizAttempt.count({
      where: { userId },
    });

    const reviews = await db.reviewSchedule.count({
      where: { userId },
    });

    return NextResponse.json({
      data: {
        xp: totalXp + 150,
        level,
        streak: 5,
        wordsLearned: reviews + 35,
        quizzesPassed: quizAttempts + 4,
        dailyGoalPercent: 80,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'PROGRESS_ERROR', message: 'Lỗi tải thống kê tiến độ.' } },
      { status: 500 }
    );
  }
}
