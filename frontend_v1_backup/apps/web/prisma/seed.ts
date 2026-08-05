import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with real Factory data...');

  // 1. Create a Default User
  const user = await prisma.user.upsert({
    where: { email: 'factory.worker@example.com' },
    update: {},
    create: {
      email: 'factory.worker@example.com',
      username: 'factory_worker_01',
      fullName: 'Nguyễn Văn A',
      role: 'LEARNER',
      isGuest: false,
      preference: {
        create: {
          interfaceLang: 'vi',
          targetLanguage: 'CHINESE',
          factoryDomain: 'general',
          dailyGoalMinutes: 30,
        },
      },
    },
  });

  console.log('User seeded:', user.username);

  // 2. Clear existing data (optional, but good for clean seeding)
  await prisma.vocabularyEntry.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.flashcard.deleteMany({});

  // 3. Seed Vocabulary Entries (Chinese & English Factory Terms)
  const vocabData = [
    {
      language: 'zh',
      simplified: '安全',
      traditional: '安全',
      word: 'ān quán',
      pinyin: 'ān quán',
      pinyinNumeric: 'an1 quan2',
      ipa: '',
      partOfSpeech: 'noun',
      meaningVi: 'An toàn',
      meaningEn: 'Safety',
      hskLevel: 'HSK1',
      difficulty: 'BEGINNER',
      topic: 'Safety',
      factoryDomain: 'an_toan',
      senses: {
        create: [
          {
            definitionVi: 'Trạng thái an toàn, không có nguy hiểm',
            definitionEn: 'State of being safe',
            context: 'Quy định nhà máy',
          },
        ],
      },
      examples: {
        create: [
          {
            sentenceZh: '安全第一',
            pinyin: 'ān quán dì yī',
            sentenceVi: 'An toàn là trên hết',
            sentenceEn: 'Safety first',
          },
        ],
      },
    },
    {
      language: 'zh',
      simplified: '质量',
      traditional: '質量',
      word: 'zhì liàng',
      pinyin: 'zhì liàng',
      pinyinNumeric: 'zhi4 liang4',
      ipa: '',
      partOfSpeech: 'noun',
      meaningVi: 'Chất lượng',
      meaningEn: 'Quality',
      hskLevel: 'HSK4',
      difficulty: 'INTERMEDIATE',
      topic: 'Quality Control',
      factoryDomain: 'chat_luong',
      examples: {
        create: [
          {
            sentenceZh: '检查产品质量',
            pinyin: 'jiǎn chá chǎn pǐn zhì liàng',
            sentenceVi: 'Kiểm tra chất lượng sản phẩm',
            sentenceEn: 'Check product quality',
          },
        ],
      },
    },
    {
      language: 'zh',
      simplified: '保养',
      traditional: '保養',
      word: 'bǎo yǎng',
      pinyin: 'bǎo yǎng',
      pinyinNumeric: 'bao3 yang3',
      ipa: '',
      partOfSpeech: 'verb',
      meaningVi: 'Bảo dưỡng / Bảo trì',
      meaningEn: 'Maintenance',
      hskLevel: 'HSK5',
      difficulty: 'INTERMEDIATE',
      topic: 'Maintenance',
      factoryDomain: 'bao_tri',
      examples: {
        create: [
          {
            sentenceZh: '机器需要定期保养。',
            pinyin: 'jī qì xū yào dìng qī bǎo yǎng.',
            sentenceVi: 'Máy móc cần được bảo dưỡng định kỳ.',
            sentenceEn: 'Machines need regular maintenance.',
          },
        ],
      },
    },
    {
      language: 'zh',
      simplified: '组装',
      traditional: '組裝',
      word: 'zǔ zhuāng',
      pinyin: 'zǔ zhuāng',
      pinyinNumeric: 'zu3 zhuang1',
      ipa: '',
      partOfSpeech: 'verb',
      meaningVi: 'Lắp ráp',
      meaningEn: 'Assembly',
      difficulty: 'BEGINNER',
      topic: 'Assembly Line',
      factoryDomain: 'day_chuyen',
      examples: {
        create: [
          {
            sentenceZh: '他在组装车间工作。',
            pinyin: 'tā zài zǔ zhuāng chē jiān gōng zuò.',
            sentenceVi: 'Anh ấy làm việc ở xưởng lắp ráp.',
            sentenceEn: 'He works in the assembly workshop.',
          },
        ],
      },
    },
    {
      language: 'en',
      simplified: null,
      traditional: null,
      word: 'Forklift',
      pinyin: null,
      pinyinNumeric: null,
      ipa: '/ˈfɔːrklɪft/',
      partOfSpeech: 'noun',
      meaningVi: 'Xe nâng',
      meaningEn: 'A vehicle with a pronged device in front for lifting and carrying heavy loads.',
      cefrLevel: 'B1',
      difficulty: 'INTERMEDIATE',
      topic: 'Warehouse',
      factoryDomain: 'kho_hang',
      examples: {
        create: [
          {
            sentenceZh: null,
            pinyin: null,
            sentenceVi: 'Người lái xe nâng đang cẩn thận di chuyển các pallet.',
            sentenceEn: 'The forklift driver is carefully moving the pallets.',
          },
        ],
      },
    },
  ];

  console.log('Seeding Vocabulary...');
  for (const vocab of vocabData) {
    await prisma.vocabularyEntry.create({
      data: vocab as any,
    });
  }

  // 4. Seed Quiz Data
  console.log('Seeding Quizzes...');
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Kiểm tra An toàn & Chất lượng Cơ bản',
      description: 'Bài kiểm tra 3 câu về các từ vựng cốt lõi trong nhà máy.',
      language: 'zh',
      category: 'Safety',
      difficulty: 'BEGINNER',
      timeLimitSecs: 300,
      questions: {
        create: [
          {
            questionType: 'select_meaning',
            prompt: 'Từ "安全" (ān quán) có nghĩa là gì?',
            optionsJson: JSON.stringify(['Chất lượng', 'An toàn', 'Bảo trì', 'Lắp ráp']),
            correctAnswer: 'An toàn',
            explanationVi: '安全 (ān quán) nghĩa là An toàn. Ví dụ: 安全第一 (An toàn là trên hết).',
            factoryContext: 'Luôn được nhắc đến trong các buổi họp đầu ca (Toolbox meeting).',
          },
          {
            questionType: 'select_meaning',
            prompt: 'Từ nào dưới đây mang ý nghĩa là "Bảo trì / Bảo dưỡng"?',
            optionsJson: JSON.stringify(['组装 (zǔ zhuāng)', '质量 (zhì liàng)', '保养 (bǎo yǎng)', '安全 (ān quán)']),
            correctAnswer: '保养 (bǎo yǎng)',
            explanationVi: '保养 (bǎo yǎng) là bảo trì, bảo dưỡng.',
          },
          {
            questionType: 'select_meaning',
            prompt: 'Trong câu "检查产品质量" (jiǎn chá chǎn pǐn zhì liàng), từ "质量" nghĩa là gì?',
            optionsJson: JSON.stringify(['Số lượng', 'Chất lượng', 'Kích thước', 'Trọng lượng']),
            correctAnswer: 'Chất lượng',
            explanationVi: '质量 (zhì liàng) là Chất lượng. Câu trên nghĩa là "Kiểm tra chất lượng sản phẩm".',
          }
        ],
      },
    },
  });

  // 5. Seed Flashcards
  console.log('Seeding Flashcards...');
  const allVocab = await prisma.vocabularyEntry.findMany();
  for (const v of allVocab) {
    await prisma.flashcard.create({
      data: {
        vocabularyId: v.id,
        frontText: v.language === 'zh' ? (v.simplified || v.word) : v.word,
        backText: v.meaningVi,
        pinyinOrIpa: v.language === 'zh' ? (v.pinyin || '') : (v.ipa || ''),
        topic: v.topic,
        factoryDomain: v.factoryDomain,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
