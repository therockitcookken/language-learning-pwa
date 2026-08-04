import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { calculateSM2, SM2Rating } from '@/lib/domain/sm2';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, flashcardId, rating } = body as {
      userId?: string;
      flashcardId: string;
      rating: SM2Rating;
    };

    if (!flashcardId || !rating) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Thiếu mã flashcard hoặc mức đánh giá.' } },
        { status: 400 }
      );
    }

    const uid = userId || 'guest_demo';

    let schedule = await db.reviewSchedule.findUnique({
      where: {
        userId_flashcardId: {
          userId: uid,
          flashcardId,
        },
      },
    });

    const currentState = schedule
      ? {
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          easeFactor: schedule.easeFactor,
        }
      : { interval: 1, repetitions: 0, easeFactor: 2.5 };

    const newResult = calculateSM2(currentState, rating);

    if (schedule) {
      schedule = await db.reviewSchedule.update({
        where: { id: schedule.id },
        data: {
          interval: newResult.interval,
          repetitions: newResult.repetitions,
          easeFactor: newResult.easeFactor,
          dueDate: newResult.dueDate,
          lastReviewed: new Date(),
        },
      });
    } else {
      // Find guest/user or fallback
      let userObj = await db.user.findUnique({ where: { id: uid } });
      if (!userObj) {
        userObj = await db.user.findFirst({ where: { isGuest: true } });
      }

      if (userObj) {
        schedule = await db.reviewSchedule.create({
          data: {
            userId: userObj.id,
            flashcardId,
            interval: newResult.interval,
            repetitions: newResult.repetitions,
            easeFactor: newResult.easeFactor,
            dueDate: newResult.dueDate,
            lastReviewed: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ data: newResult });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'REVIEW_ERROR', message: 'Lỗi cập nhật tiến độ ôn tập SM-2.' } },
      { status: 500 }
    );
  }
}
