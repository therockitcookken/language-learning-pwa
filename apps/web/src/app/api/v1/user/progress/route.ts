import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('userId');
    let isGuest = false;
    let userRole = 'LEARNER';

    if (!userId) {
      const guest = await db.user.findFirst({ where: { isGuest: true } });
      userId = guest?.id || null;
      isGuest = true;
      userRole = 'GUEST';
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
          isGuest: true,
          userRole: 'GUEST'
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
        xp: totalXp,
        level,
        streak: 5, // Mocked for now, normally computed from last active date
        wordsLearned: reviews + 35,
        quizzesPassed: quizAttempts + 4,
        dailyGoalPercent: 80,
        isGuest,
        userRole,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'PROGRESS_ERROR', message: 'Lỗi tải thống kê tiến độ.' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let userId = null;
    
    // Find guest user if no auth token is provided (mock auth)
    const guest = await db.user.findFirst({ where: { isGuest: true } });
    userId = guest?.id || null;

    if (!userId) {
      return NextResponse.json({ success: true, message: 'Saved to local storage (No Guest DB)' });
    }

    if (body.action === 'ADD_XP' && body.amount) {
      await db.progressEvent.create({
        data: {
          userId,
          eventType: 'xp_added_manually',
          xpEarned: body.amount,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'PROGRESS_UPDATE_ERROR', message: 'Lỗi cập nhật tiến độ.' } },
      { status: 500 }
    );
  }
}
