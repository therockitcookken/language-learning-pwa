import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const card = await prisma.flashcard.findFirst({ where: { topic: 'Maintenance & Machinery' } });
  console.log('Card:', card);
}
main().catch(console.error).finally(() => prisma.$disconnect());
