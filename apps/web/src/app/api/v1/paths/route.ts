import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET() {
  try {
    const paths = await db.learningPath.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return NextResponse.json({ data: paths });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'PATHS_ERROR', message: 'Không thể tải lộ trình học.' } },
      { status: 500 }
    );
  }
}
