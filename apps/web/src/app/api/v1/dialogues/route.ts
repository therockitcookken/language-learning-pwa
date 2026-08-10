import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'general';

    const dialogues = await prisma.workplaceDialogue.findMany({
      where: {
        factoryDomain: domain,
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        titleVi: true,
        titleZh: true,
        titleEn: true,
        category: true,
        level: true,
        audioUrl: true,
        _count: {
          select: { sentences: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: dialogues });
  } catch (error) {
    console.error('Failed to fetch dialogues', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
