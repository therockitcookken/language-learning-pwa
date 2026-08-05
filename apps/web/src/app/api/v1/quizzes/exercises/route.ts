import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'all';
    const level = searchParams.get('level') || 'all';
    const topic = searchParams.get('topic') || 'all';
    const skill = searchParams.get('skill') || 'all';
    const type = searchParams.get('type') || 'all';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    const where: any = {};
    if (lang !== 'all') where.language = lang;
    if (level !== 'all') where.level = level;
    if (topic !== 'all') where.topic = { contains: topic };
    if (skill !== 'all') where.skill = skill;
    if (type !== 'all') where.questionType = type;
    if (search) {
      where.OR = [
        { prompt: { contains: search } },
        { simplifiedOrWord: { contains: search } },
        { explanationVi: { contains: search } },
      ];
    }

    const [exercises, total] = await Promise.all([
      db.quizQuestion.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      db.quizQuestion.count({ where }),
    ]);

    // Get distinct values for filters
    const [topics, levels, skills, types] = await Promise.all([
      db.quizQuestion.findMany({ where: lang !== 'all' ? { language: lang } : {}, select: { topic: true }, distinct: ['topic'] }),
      db.quizQuestion.findMany({ where: lang !== 'all' ? { language: lang } : {}, select: { level: true }, distinct: ['level'] }),
      db.quizQuestion.findMany({ where: lang !== 'all' ? { language: lang } : {}, select: { skill: true }, distinct: ['skill'] }),
      db.quizQuestion.findMany({ where: lang !== 'all' ? { language: lang } : {}, select: { questionType: true }, distinct: ['questionType'] }),
    ]);

    return NextResponse.json({
      data: exercises,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        topics: topics.map((t: any) => t.topic),
        levels: levels.map((l: any) => l.level),
        skills: skills.map((s: any) => s.skill),
        types: types.map((t: any) => t.questionType),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'EXERCISES_ERROR', message: 'Không thể tải danh sách bài tập.' } },
      { status: 500 }
    );
  }
}
