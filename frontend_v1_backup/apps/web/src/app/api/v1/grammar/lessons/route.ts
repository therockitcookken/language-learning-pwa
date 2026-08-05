import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getGrammarLessons, GRAMMAR_DATASET } from '@/lib/data/grammar-dataset';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'all';
    const level = searchParams.get('level') || '';
    const topic = searchParams.get('topic') || '';
    const query = searchParams.get('query') || '';

    // 1. Try DB first if records exist
    const where: any = {};
    if (lang !== 'all') where.language = lang;
    if (level) where.level = level;
    if (topic) where.topic = topic;

    let dbLessons: any[] = [];
    try {
      dbLessons = await db.grammarLesson.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    } catch {
      // DB fallback
    }

    // 2. If DB has records, return them. Otherwise fall back to production dataset.
    if (dbLessons && dbLessons.length > 0) {
      return NextResponse.json({ data: dbLessons });
    }

    const fallbackLessons = getGrammarLessons(lang as any, level, topic, query);
    return NextResponse.json({ data: fallbackLessons });
  } catch (error) {
    const fallbackLessons = GRAMMAR_DATASET;
    return NextResponse.json({ data: fallbackLessons });
  }
}
