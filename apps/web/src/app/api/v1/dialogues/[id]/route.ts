import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ dynamic params handling
    const { id } = await params;
    const dialogue = await prisma.workplaceDialogue.findUnique({
      where: { id },
      include: {
        sentences: {
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    });

    if (!dialogue) {
      return NextResponse.json({ success: false, error: 'Dialogue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: dialogue });
  } catch (error) {
    console.error(`Failed to fetch dialogue`, error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
