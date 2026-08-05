import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { calculateSRS, SRSGrade, SRSState } from '@/lib/domain/srs-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { flashcardId, rating } = body as { flashcardId: string; rating: SRSGrade };

    if (!flashcardId || !rating) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Thiếu flashcardId hoặc đánh giá (rating).' } },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({ where: { email: 'factory.worker@example.com' } });
    if (!user) {
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: 'Không tìm thấy tài khoản học viên mặc định.' } },
        { status: 401 }
      );
    }

    // Find existing review schedule
    let schedule = await db.reviewSchedule.findUnique({
      where: {
        userId_flashcardId: {
          userId: user.id,
          flashcardId,
        },
      },
    });

    const currentState: SRSState = schedule
      ? {
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          easeFactor: schedule.easeFactor,
          leitnerBox: 1,
          lapses: 0,
        }
      : {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          leitnerBox: 1,
          lapses: 0,
        };

    const nextState = calculateSRS(currentState, rating);

    // Upsert schedule record
    schedule = await db.reviewSchedule.upsert({
      where: {
        userId_flashcardId: {
          userId: user.id,
          flashcardId,
        },
      },
      update: {
        interval: nextState.interval,
        repetitions: nextState.repetitions,
        easeFactor: nextState.easeFactor,
        dueDate: nextState.dueDate,
        lastReviewed: new Date(),
      },
      create: {
        userId: user.id,
        flashcardId,
        interval: nextState.interval,
        repetitions: nextState.repetitions,
        easeFactor: nextState.easeFactor,
        dueDate: nextState.dueDate,
        lastReviewed: new Date(),
      },
    });

    // Record XP progress event
    const xpEarned = rating === 'easy' ? 10 : rating === 'good' ? 5 : rating === 'hard' ? 3 : 1;
    await db.progressEvent.create({
      data: {
        userId: user.id,
        eventType: 'flashcard_reviewed',
        xpEarned,
        metadata: JSON.stringify({
          flashcardId,
          rating,
          nextInterval: nextState.interval,
          dueLabel: nextState.dueLabel,
        }),
      },
    });

    return NextResponse.json({
      data: {
        schedule,
        srsResult: nextState,
        xpEarned,
      },
    });
  } catch (error) {
    console.error('Review SRS API Error:', error);
    return NextResponse.json(
      { error: { code: 'REVIEW_ERROR', message: 'Không thể cập nhật tiến trình SRS.' } },
      { status: 500 }
    );
  }
}
