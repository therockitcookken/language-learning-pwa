import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') || '';
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));

    const where: any = {};
    if (domain) where.factoryDomain = domain;

    const cards = await db.flashcard.findMany({
      where,
      include: {
        vocabulary: true,
        grammar: true,
      },
      take: limit,
    });

    return NextResponse.json({ data: cards });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'FLASHCARDS_ERROR', message: 'Không thể tải bộ thẻ ghi nhớ.' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { frontText, backText, pinyinOrIpa, topic, factoryDomain } = body;

    if (!frontText || !backText) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Mặt trước và mặt sau không được bỏ trống.' } },
        { status: 400 }
      );
    }

    const card = await db.flashcard.create({
      data: {
        frontText,
        backText,
        pinyinOrIpa,
        topic: topic || 'Custom',
        factoryDomain: factoryDomain || 'general',
      },
    });

    return NextResponse.json({ data: card });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'CREATE_FLASHCARD_ERROR', message: 'Không thể tạo flashcard mới.' } },
      { status: 500 }
    );
  }
}
