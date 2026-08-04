import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'all';
    const level = searchParams.get('level') || '';
    const domain = searchParams.get('domain') || '';

    const where: any = {};
    if (lang !== 'all') where.language = lang;
    if (level) where.level = level;
    if (domain) where.factoryDomain = domain;

    const lessons = await db.grammarLesson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ data: lessons });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'GRAMMAR_ERROR', message: 'Không thể tải danh sách bài ngữ pháp.' } },
      { status: 500 }
    );
  }
}
