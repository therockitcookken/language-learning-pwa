import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Workplace Dialogues...');
  
  // Create a dialogue
  const dialogue = await prisma.workplaceDialogue.create({
    data: {
      titleVi: 'Giao tiếp cơ bản khi nhận việc',
      titleZh: '入职基本沟通',
      titleEn: 'Basic communication upon onboarding',
      category: 'Giao tiếp hàng ngày',
      factoryDomain: 'general',
      level: 'BEGINNER',
    },
  });

  console.log(`Created dialogue: ${dialogue.titleVi}`);

  // Add sentences
  const sentences = [
    { speaker: 'Quản lý', zh: '你好！欢迎来到我们工厂。', vi: 'Chào bạn! Chào mừng đến với nhà máy của chúng tôi.', py: 'nǐ hǎo! huān yíng lái dào wǒ men gōng chǎng.' },
    { speaker: 'Nhân viên', zh: '你好，经理！很高兴加入这里。', vi: 'Chào quản lý! Rất vui được gia nhập ở đây.', py: 'nǐ hǎo, jīng lǐ! hěn gāo xìng jiā rù zhè lǐ.' },
    { speaker: 'Quản lý', zh: '这是你的工牌和安全帽。', vi: 'Đây là thẻ nhân viên và mũ bảo hộ của bạn.', py: 'zhè shì nǐ de gōng pái hé ān quán mào.' },
    { speaker: 'Nhân viên', zh: '谢谢。请问我的工位在哪里？', vi: 'Cảm ơn. Xin hỏi vị trí làm việc của tôi ở đâu?', py: 'xiè xie. qǐng wèn wǒ de gōng wèi zài nǎ lǐ?' },
    { speaker: 'Quản lý', zh: '在A区流水线。跟我来。', vi: 'Ở dây chuyền khu A. Đi theo tôi.', py: 'zài A qū liú shuǐ xiàn. gēn wǒ lái.' },
  ];

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    await prisma.exampleSentence.create({
      data: {
        dialogueId: dialogue.id,
        speaker: s.speaker,
        orderIndex: i,
        sentenceZh: s.zh,
        sentenceVi: s.vi,
        pinyin: s.py,
      }
    });
  }
  
  console.log('Dialogue seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
