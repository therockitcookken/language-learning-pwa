import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function main() {
  console.log('Generating massive Quiz Question database...');

  // 1. Fetch all vocabulary
  const vocab = await prisma.vocabularyEntry.findMany();
  if (vocab.length === 0) {
    console.error('No vocabulary found. Please run seed-20k or seed-large first.');
    return;
  }

  // 2. Clear old quizzes
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();

  // 3. Create a massive number of Quiz Questions based on vocab
  const quizQuestions: any[] = [];
  const TOTAL_QUESTIONS_TARGET = 6000;

  let qCount = 0;

  // We will generate different types of questions for each vocab until we reach 6000
  while (qCount < TOTAL_QUESTIONS_TARGET) {
    for (const v of vocab) {
      if (qCount >= TOTAL_QUESTIONS_TARGET) break;

      const allMeanings = vocab.map(x => x.meaningVi).filter(x => x !== v.meaningVi);
      const allWords = vocab.map(x => x.word).filter(x => x !== v.word);

      const typeRnd = Math.random();
      
      let qType = 'select_meaning';
      let prompt = '';
      let correct = '';
      let options: string[] = [];
      let explanation = '';

      const wordDisplay = v.language === 'zh' ? `${v.simplified || v.word} (${v.pinyin || ''})` : v.word;

      if (typeRnd < 0.5) {
        // Type 1: Given word, select meaning
        prompt = `Từ "${wordDisplay}" có nghĩa là gì?`;
        correct = v.meaningVi;
        options = shuffle([correct, ...shuffle(allMeanings).slice(0, 3)]);
        explanation = `"${wordDisplay}" nghĩa là: ${correct}`;
      } else {
        // Type 2: Given meaning, select word
        prompt = `Từ nào dưới đây mang ý nghĩa là "${v.meaningVi}"?`;
        correct = wordDisplay;
        options = shuffle([correct, ...shuffle(allWords).slice(0, 3)]);
        explanation = `${correct} mang nghĩa là: ${v.meaningVi}`;
      }

      quizQuestions.push({
        questionType: qType,
        language: v.language,
        level: v.hskLevel || v.cefrLevel || 'Unknown',
        topic: v.topic,
        skill: 'vocabulary',
        prompt,
        optionsJson: JSON.stringify(options),
        correctAnswer: correct,
        explanationVi: explanation,
        points: 10,
        sourceData: 'Auto-generated 6K Bank'
      });

      qCount++;
    }
  }

  // Group into Quizzes of 50 questions each
  console.log(`Generated ${quizQuestions.length} questions in memory. Grouping into tests...`);
  const chunks = chunkArray(quizQuestions, 50);

  let quizCounter = 1;
  for (const chunk of chunks) {
    const lang = chunk[0].language;
    const testTitle = lang === 'zh' ? `Bài Thi HSK & Tiếng Trung Công Xưởng #${quizCounter}` : `Bài Thi Tiếng Anh Công nghiệp #${quizCounter}`;
    
    await prisma.quiz.create({
      data: {
        title: testTitle,
        description: `Bài kiểm tra toàn diện 50 câu về từ vựng công xưởng.`,
        language: lang,
        category: 'Vocabulary',
        difficulty: 'INTERMEDIATE',
        timeLimitSecs: 1800, // 30 minutes
        questions: {
          create: chunk
        }
      }
    });
    quizCounter++;
    if (quizCounter % 10 === 0) console.log(`Created ${quizCounter} quizzes...`);
  }

  console.log(`Successfully created ${quizCounter - 1} Quizzes with a total of ${quizQuestions.length} questions!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
