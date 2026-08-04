import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { normalizeQuery } from '@/lib/domain/search-normalizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const lang = searchParams.get('lang') || 'all'; // "zh", "en", "all"
    const factoryDomain = searchParams.get('domain') || '';
    const hsk = searchParams.get('hsk') || '';
    const cefr = searchParams.get('cefr') || '';
    const topic = searchParams.get('topic') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20', 10));
    const skip = (page - 1) * limit;

    const norm = normalizeQuery(query);

    const whereClause: any = {};

    if (lang !== 'all') {
      whereClause.language = lang;
    }

    if (factoryDomain) {
      whereClause.factoryDomain = factoryDomain;
    }

    if (hsk) {
      whereClause.hskLevel = hsk;
    }

    if (cefr) {
      whereClause.cefrLevel = cefr;
    }

    if (topic) {
      whereClause.topic = topic;
    }

    if (norm) {
      whereClause.OR = [
        { word: { contains: norm } },
        { simplified: { contains: norm } },
        { traditional: { contains: norm } },
        { pinyin: { contains: norm } },
        { pinyinNumeric: { contains: norm } },
        { ipa: { contains: norm } },
        { meaningVi: { contains: norm } },
        { meaningEn: { contains: norm } },
        { topic: { contains: norm } },
      ];
    }

    const [total, items] = await Promise.all([
      db.vocabularyEntry.count({ where: whereClause }),
      db.vocabularyEntry.findMany({
        where: whereClause,
        include: {
          examples: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'SEARCH_ERROR', message: 'Không thể tải danh sách từ điển.' } },
      { status: 500 }
    );
  }
}
