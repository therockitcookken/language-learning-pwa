import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'zh'; // 'zh' or 'en'
    const level = searchParams.get('level') || '';
    const topic = searchParams.get('topic') || '';
    const domain = searchParams.get('domain') || '';
    const status = searchParams.get('status') || ''; // 'due', 'learned', 'new', 'hard', 'favorite'
    const limit = Math.min(500, parseInt(searchParams.get('limit') || '100', 10));
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const user = await db.user.findFirst({ where: { email: 'factory.worker@example.com' } });

    // Build Prisma query condition
    const where: any = {
      vocabulary: {
        language: lang,
      },
    };

    if (domain) where.factoryDomain = domain;
    if (topic) where.topic = topic;

    if (level) {
      if (lang === 'zh') {
        where.vocabulary.hskLevel = level;
      } else {
        where.vocabulary.cefrLevel = level;
      }
    }

    if (status === 'favorite' && user) {
      const favorites = await db.favorite.findMany({
        where: { userId: user.id },
        select: { vocabularyId: true },
      });
      const favVocabIds = favorites.map((f) => f.vocabularyId);
      where.vocabularyId = { in: favVocabIds };
    }

    const cards = await db.flashcard.findMany({
      where,
      include: {
        vocabulary: {
          include: {
            examples: true,
          },
        },
        reviewSchedules: user
          ? {
              where: { userId: user.id },
            }
          : false,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Enrich cards with parsed usageNotes (synonyms, antonyms, collocations, mnemonics)
    const enrichedCards = cards.map((c) => {
      let usageNotesObj: any = {};
      if (c.vocabulary?.usageNotes) {
        try {
          usageNotesObj = JSON.parse(c.vocabulary.usageNotes);
        } catch {
          usageNotesObj = {};
        }
      }

      const schedule = c.reviewSchedules && c.reviewSchedules.length > 0 ? c.reviewSchedules[0] : null;

      return {
        id: c.id,
        vocabularyId: c.vocabularyId,
        frontText: c.frontText,
        backText: c.backText,
        pinyinOrIpa: c.pinyinOrIpa,
        topic: c.topic,
        factoryDomain: c.factoryDomain,
        mnemonic: c.mnemonic || usageNotesObj.mnemonic || '',
        language: c.vocabulary?.language || lang,
        hskLevel: c.vocabulary?.hskLevel || null,
        cefrLevel: c.vocabulary?.cefrLevel || null,
        partOfSpeech: c.vocabulary?.partOfSpeech || 'noun',
        meaningEn: c.vocabulary?.meaningEn || '',
        examples: c.vocabulary?.examples || [],
        synonyms: usageNotesObj.synonyms || [],
        antonyms: usageNotesObj.antonyms || [],
        relatedWords: usageNotesObj.relatedWords || [],
        collocations: usageNotesObj.collocations || [],
        schedule: schedule
          ? {
              interval: schedule.interval,
              repetitions: schedule.repetitions,
              easeFactor: schedule.easeFactor,
              dueDate: schedule.dueDate,
              lastReviewed: schedule.lastReviewed,
            }
          : null,
      };
    });

    return NextResponse.json({
      data: enrichedCards,
      meta: {
        total: enrichedCards.length,
        language: lang,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Fetch Flashcards API error:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_FLASHCARDS_ERROR', message: 'Không thể tải bộ thẻ ghi nhớ.' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { frontText, backText, pinyinOrIpa, topic, factoryDomain, mnemonic, language } = body;

    if (!frontText || !backText) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Mặt trước và mặt sau không được bỏ trống.' } },
        { status: 400 }
      );
    }

    // Create custom vocabulary entry
    const vocab = await db.vocabularyEntry.create({
      data: {
        language: language || 'zh',
        word: frontText,
        simplified: frontText,
        meaningVi: backText,
        meaningEn: backText,
        pinyin: language === 'zh' ? pinyinOrIpa : undefined,
        ipa: language === 'en' ? pinyinOrIpa : undefined,
        partOfSpeech: 'noun',
        topic: topic || 'Custom',
        factoryDomain: factoryDomain || 'general',
      },
    });

    const card = await db.flashcard.create({
      data: {
        vocabularyId: vocab.id,
        frontText,
        backText,
        pinyinOrIpa: pinyinOrIpa || '',
        topic: topic || 'Custom',
        factoryDomain: factoryDomain || 'general',
        mnemonic: mnemonic || `Mẹo ghi nhớ: ${frontText}`,
      },
    });

    return NextResponse.json({ data: card });
  } catch (error) {
    console.error('Create Flashcard API error:', error);
    return NextResponse.json(
      { error: { code: 'CREATE_FLASHCARD_ERROR', message: 'Không thể tạo thẻ mới.' } },
      { status: 500 }
    );
  }
}
