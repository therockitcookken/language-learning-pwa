import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// On Vercel, the SQLite database file needs to be accessed via an absolute path 
// relative to process.cwd() so the serverless function can locate it.
const dbPath = process.env.NODE_ENV === 'production'
  ? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
  : 'file:./dev.db';

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: dbPath,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
