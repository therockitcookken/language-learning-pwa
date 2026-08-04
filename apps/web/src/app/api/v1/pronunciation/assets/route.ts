import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'zh';

    const assets = await db.pronunciationAsset.findMany({
      where: { language: lang },
    });

    return NextResponse.json({ data: assets });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'PRONUNCIATION_ASSETS_ERROR', message: 'Không thể tải tài nguyên phát âm.' } },
      { status: 500 }
    );
  }
}
