import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function POST() {
  try {
    let guest = await db.user.findFirst({
      where: { isGuest: true },
    });

    if (!guest) {
      guest = await db.user.create({
        data: {
          username: `guest_${Date.now()}`,
          fullName: 'Khách Học Viên',
          role: 'GUEST',
          isGuest: true,
        },
      });
    }

    return NextResponse.json({
      data: {
        userId: guest.id,
        username: guest.username,
        role: guest.role,
        isGuest: true,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'GUEST_AUTH_ERROR', message: 'Không thể tạo phiên làm việc khách.' } },
      { status: 500 }
    );
  }
}
