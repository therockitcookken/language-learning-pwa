import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'all';

    const where: any = {};
    if (lang !== 'all') where.language = lang;

    const quizzes = await db.quiz.findMany({
      where,
      include: {
        questions: true,
      },
      take: 20,
    });

    return NextResponse.json({ data: quizzes });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'QUIZZES_ERROR', message: 'Không thể tải danh sách bài trắc nghiệm.' } },
      { status: 500 }
    );
  }
}
