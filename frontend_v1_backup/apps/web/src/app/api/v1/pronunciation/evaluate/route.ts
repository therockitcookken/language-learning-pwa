import { NextResponse } from 'next/server';
import {
  evaluateChinesePronunciation,
  evaluateEnglishPronunciation,
} from '@/lib/domain/pronunciation-scorer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetText, recognizedText, language } = body;

    if (!targetText) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Thiếu từ mẫu để kiểm tra phát âm.' } },
        { status: 400 }
      );
    }

    const result =
      language === 'en'
        ? evaluateEnglishPronunciation(targetText, recognizedText || '')
        : evaluateChinesePronunciation(targetText, recognizedText || '');

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'EVALUATE_ERROR', message: 'Không thể chấm điểm phát âm.' } },
      { status: 500 }
    );
  }
}
