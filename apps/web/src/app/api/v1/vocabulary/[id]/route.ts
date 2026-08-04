import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.vocabularyEntry.findUnique({
      where: { id },
      include: {
        senses: true,
        examples: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Không tìm thấy mục từ vựng này.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'VOCAB_DETAIL_ERROR', message: 'Lỗi truy vấn chi tiết mục từ.' } },
      { status: 500 }
    );
  }
}
