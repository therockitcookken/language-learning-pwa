import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, fullName, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' } },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: { code: 'ALREADY_EXISTS', message: 'Tên đăng nhập hoặc email đã được sử dụng.' } },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        username,
        email,
        fullName: fullName || username,
        passwordHash: `$2a$10$demo_hash_${Date.now()}`,
        role: 'LEARNER',
        isGuest: false,
      },
    });

    return NextResponse.json({
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'REGISTER_ERROR', message: 'Không thể tạo tài khoản mới.' } },
      { status: 500 }
    );
  }
}
