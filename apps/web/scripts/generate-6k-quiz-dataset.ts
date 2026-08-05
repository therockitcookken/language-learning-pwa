import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VocabEntry {
  language: 'zh' | 'en';
  word: string;
  simplified?: string;
  traditional?: string;
  pinyin?: string;
  ipa?: string;
  partOfSpeech?: string;
  meaningVi: string;
  meaningEn?: string;
  hskLevel?: string;
  cefrLevel?: string;
  topic?: string;
  factoryDomain?: string;
  examples?: Array<{
    sentenceZh?: string;
    sentenceEn?: string;
    sentenceVi?: string;
    pinyin?: string;
  }>;
  synonyms?: Array<{ word: string; pinyin?: string; meaningVi?: string }>;
  antonyms?: Array<{ word: string; pinyin?: string; meaningVi?: string }>;
}

export interface QuizQuestionItem {
  id: string;
  quizId: string;
  language: 'zh' | 'en';
  level: string;
  topic: string;
  skill: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'pronunciation' | 'translation' | 'writing';
  questionType:
    | 'single_choice'
    | 'multiple_choice'
    | 'true_false'
    | 'fill_blank'
    | 'pair_matching'
    | 'sentence_order'
    | 'dialogue_order'
    | 'listen_pick'
    | 'listen_type'
    | 'pronunciation_pick'
    | 'error_identification'
    | 'sentence_correction'
    | 'verb_tense'
    | 'zh_particles'
    | 'translation'
    | 'reading_comprehension'
    | 'multi_skill';
  prompt: string;
  pinyinOrIpa?: string;
  simplifiedOrWord?: string;
  audioUrl?: string;
  imageUrl?: string;
  optionsJson: string;
  correctAnswer: string;
  explanationVi: string;
  explanationEn?: string;
  hintVi?: string;
  factoryContext?: string;
  recommendedTimeSecs: number;
  points: number;
  sourceData: string;
}

const EXERCISE_TYPES_ZH = [
  'single_choice',
  'multiple_choice',
  'true_false',
  'fill_blank',
  'pair_matching',
  'sentence_order',
  'dialogue_order',
  'listen_pick',
  'listen_type',
  'pronunciation_pick',
  'error_identification',
  'sentence_correction',
  'zh_particles',
  'translation',
  'reading_comprehension',
  'multi_skill',
] as const;

const EXERCISE_TYPES_EN = [
  'single_choice',
  'multiple_choice',
  'true_false',
  'fill_blank',
  'pair_matching',
  'sentence_order',
  'dialogue_order',
  'listen_pick',
  'listen_type',
  'pronunciation_pick',
  'error_identification',
  'sentence_correction',
  'verb_tense',
  'translation',
  'reading_comprehension',
  'multi_skill',
] as const;

const ZH_PARTICLES = ['了', '过', '着', '在', '正在', '不', '没'];

function getDistractors(allEntries: VocabEntry[], currentIndex: number, field: 'meaningVi' | 'word' | 'pinyin' | 'ipa', count = 3): string[] {
  const distractors: string[] = [];
  const total = allEntries.length;
  let offset = 1;
  while (distractors.length < count && offset < total) {
    const candidateIdx = (currentIndex + offset * 37) % total;
    const item = allEntries[candidateIdx];
    const val = field === 'word' ? (item.simplified || item.word) : (item[field] || item.meaningVi);
    if (val && !distractors.includes(val) && val !== (field === 'word' ? (allEntries[currentIndex].simplified || allEntries[currentIndex].word) : allEntries[currentIndex][field])) {
      distractors.push(val);
    }
    offset++;
  }
  return distractors;
}

function generateZhExercise(entry: VocabEntry, index: number, allEntries: VocabEntry[]): QuizQuestionItem {
  const type = EXERCISE_TYPES_ZH[index % EXERCISE_TYPES_ZH.length];
  const wordStr = entry.simplified || entry.word;
  const pinyinStr = entry.pinyin || '';
  const level = entry.hskLevel || `HSK${(index % 6) + 1}`;
  const topic = entry.topic || 'An toàn & Công xưởng';
  const id = `zh-quiz-${String(index + 1).padStart(4, '0')}`;
  const quizId = `quiz-zh-${level.toLowerCase()}`;

  let skill: QuizQuestionItem['skill'] = 'vocabulary';
  let prompt = '';
  let options: string[] = [];
  let correctAnswer = '';
  let explanationVi = '';
  let hintVi = '';

  switch (type) {
    case 'single_choice':
      skill = 'vocabulary';
      prompt = `[Bài #${index + 1}] Từ tiếng Trung "${wordStr}" (${pinyinStr}) có nghĩa là gì trong ngữ cảnh nhà máy?`;
      correctAnswer = entry.meaningVi;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'meaningVi', 3)].sort();
      explanationVi = `"${wordStr}" (${pinyinStr}) nghĩa là "${entry.meaningVi}". Thường xuất hiện trong chủ đề ${topic}.`;
      hintVi = `💡 Gợi ý cách làm: Quan sát Hán tự "${wordStr}" và Pinyin (${pinyinStr}). Đối chiếu nghĩa tiếng Việt liên quan đến chủ đề ${topic}.`;
      break;

    case 'multiple_choice':
      skill = 'vocabulary';
      prompt = `[Bài #${index + 1}] Chọn TẤT CẢ các mô tả / nghĩa đúng đối với thuật ngữ "${wordStr}" (${pinyinStr}):`;
      const wrong1 = getDistractors(allEntries, index, 'meaningVi', 1)[0];
      const wrong2 = getDistractors(allEntries, index + 5, 'meaningVi', 1)[0];
      options = [
        `Nghĩa đúng: ${entry.meaningVi}`,
        `Thuộc cấp độ ${level}`,
        `Ý nghĩa sai: ${wrong1}`,
        `Ý nghĩa sai: ${wrong2}`,
      ];
      correctAnswer = JSON.stringify([`Nghĩa đúng: ${entry.meaningVi}`, `Thuộc cấp độ ${level}`]);
      explanationVi = `"${wordStr}" mang nghĩa "${entry.meaningVi}" và nằm ở trình độ ${level}.`;
      hintVi = `💡 Gợi ý cách làm: Đọc kỹ 4 phương án. Tích chọn TẤT CẢ các thông tin khớp với từ "${wordStr}" (Nghĩa chính xác & Cấp độ ${level}).`;
      break;

    case 'true_false':
      skill = 'reading';
      const isTrue = index % 2 === 0;
      const statementMeaning = isTrue ? entry.meaningVi : getDistractors(allEntries, index, 'meaningVi', 1)[0];
      prompt = `[Bài #${index + 1}] Khẳng định sau đây Đúng hay Sai: Từ "${wordStr}" (${pinyinStr}) có nghĩa là "${statementMeaning}".`;
      options = ['Đúng', 'Sai'];
      correctAnswer = isTrue ? 'Đúng' : 'Sai';
      explanationVi = isTrue
        ? `Đúng! "${wordStr}" (${pinyinStr}) chuẩn xác là "${entry.meaningVi}".`
        : `Sai! Nghĩa chính xác của "${wordStr}" là "${entry.meaningVi}", không phải "${statementMeaning}".`;
      hintVi = `💡 Gợi ý cách làm: So sánh nghĩa được phát biểu ("${statementMeaning}") với nghĩa chuẩn của từ "${wordStr}" (${entry.meaningVi}).`;
      break;

    case 'fill_blank':
      skill = 'grammar';
      const ex = entry.examples?.[0];
      if (ex && ex.sentenceZh && ex.sentenceZh.includes(wordStr)) {
        prompt = `[Bài #${index + 1}] Điền từ thích hợp vào chỗ trống: "${ex.sentenceZh.replace(wordStr, '____')}" (${ex.sentenceVi || entry.meaningVi})`;
      } else {
        prompt = `[Bài #${index + 1}] Điền từ thích hợp vào vị trí khuyết: "在车间, 工人必须注意 ____ (${wordStr})。" (Nghĩa: ${entry.meaningVi})`;
      }
      correctAnswer = wordStr;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'word', 3)].sort();
      explanationVi = `Vị trí trống cần từ "${wordStr}" (${pinyinStr}) để tạo thành câu hoàn chỉnh.`;
      hintVi = `💡 Gợi ý cách làm: Đọc hiểu bản dịch tiếng Việt bên cạnh để tìm từ tiếng Trung mang nghĩa "${entry.meaningVi}".`;
      break;

    case 'pair_matching':
      skill = 'vocabulary';
      prompt = `[Bài #${index + 1}] Ghép từ "${wordStr}" và các từ liên quan với nghĩa tiếng Việt tương ứng:`;
      const pair2 = allEntries[(index + 1) % allEntries.length];
      const pair3 = allEntries[(index + 2) % allEntries.length];
      const pair4 = allEntries[(index + 3) % allEntries.length];
      const pairs = [
        { left: wordStr, right: entry.meaningVi },
        { left: pair2.simplified || pair2.word, right: pair2.meaningVi },
        { left: pair3.simplified || pair3.word, right: pair3.meaningVi },
        { left: pair4.simplified || pair4.word, right: pair4.meaningVi },
      ];
      options = pairs.map((p) => `${p.left} ↔ ${p.right}`);
      correctAnswer = JSON.stringify(pairs);
      explanationVi = `Cặp ghép chuẩn: ${pairs.map((p) => `${p.left}: ${p.right}`).join('; ')}.`;
      hintVi = `💡 Gợi ý cách làm: Nối lần lượt từng từ Hán tự bên trái với nghĩa tiếng Việt chính xác bên phải.`;
      break;

    case 'sentence_order':
      skill = 'grammar';
      const sZh = entry.examples?.[0]?.sentenceZh || `在 工厂 必须 注意 ${wordStr} 。`;
      const cleanTokens = sZh.replace(/[。！？]/g, '').split(' ').filter(Boolean);
      const shuffled = [...cleanTokens].sort(() => 0.5 - Math.random());
      prompt = `[Bài #${index + 1}] Sắp xếp các từ sau thành câu tiếng Trung chứa "${wordStr}": [ ${shuffled.join(' / ')} ]`;
      correctAnswer = cleanTokens.join(' ');
      options = [correctAnswer];
      explanationVi = `Trật tự câu chuẩn tiếng Trung: "${cleanTokens.join('')}".`;
      hintVi = `💡 Quy tắc sắp xếp câu: [Chủ ngữ] + [Trạng ngữ thời gian/địa điểm] + [Phó từ] + [Động từ] + [Tân ngữ chứa '${wordStr}'].`;
      break;

    case 'dialogue_order':
      skill = 'reading';
      prompt = `[Bài #${index + 1}] Sắp xếp thứ tự các câu thoại hội thoại công xưởng liên quan đến "${wordStr}":`;
      const d1 = `A: 请问，${wordStr} 在哪里？ (Cho hỏi, ${entry.meaningVi} ở đâu?)`;
      const d2 = `B: 在二楼车间右侧。 (Ở bên phải xưởng tầng 2.)`;
      const d3 = `A: 好的，谢谢！ (Vâng, cảm ơn!)`;
      options = [d1, d2, d3];
      correctAnswer = JSON.stringify([d1, d2, d3]);
      explanationVi = `Thứ tự hội thoại tự nhiên: Hỏi vị trí (${wordStr}) -> Trả lời địa điểm -> Cảm ơn.`;
      hintVi = `💡 Gợi ý cách làm: Sắp xếp theo mạch hội thoại: Hỏi địa điểm/vị trí -> Trả lời vị trí xưởng -> Cảm ơn.`;
      break;

    case 'listen_pick':
      skill = 'listening';
      prompt = `[Bài #${index + 1}] Nghe đoạn âm thanh cho từ "${wordStr}" (${pinyinStr}) và chọn nghĩa đúng:`;
      correctAnswer = entry.meaningVi;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'meaningVi', 3)].sort();
      explanationVi = `Âm thanh phát từ "${wordStr}" (${pinyinStr}) có nghĩa là "${entry.meaningVi}".`;
      hintVi = `💡 Gợi ý nghe: Nhấp vào nút Loa 🔊 để nghe phát âm của "${wordStr}" (${pinyinStr}) rồi chọn nghĩa tương ứng.`;
      break;

    case 'listen_type':
      skill = 'listening';
      prompt = `[Bài #${index + 1}] Nghe âm thanh từ "${wordStr}" và gõ lại Pinyin chuẩn:`;
      correctAnswer = pinyinStr;
      options = [correctAnswer];
      explanationVi = `Pinyin chuẩn của "${wordStr}" là "${pinyinStr}".`;
      hintVi = `💡 Gợi ý gõ: Nghe âm thanh và gõ phiên âm Pinyin kèm dấu (Ví dụ: ${pinyinStr}).`;
      break;

    case 'pronunciation_pick':
      skill = 'pronunciation';
      prompt = `[Bài #${index + 1}] Chọn phiên âm Pinyin đúng cho từ Hán tự "${wordStr}":`;
      correctAnswer = pinyinStr;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'pinyin', 3)].sort();
      explanationVi = `Hán tự "${wordStr}" đọc là "${pinyinStr}".`;
      hintVi = `💡 Gợi ý phát âm: Hán tự "${wordStr}" đọc chuẩn là "${pinyinStr}". Chú ý phân biệt dấu thanh điệu 1, 2, 3, 4.`;
      break;

    case 'error_identification':
      skill = 'grammar';
      prompt = `[Bài #${index + 1}] Xác định vị trí từ dùng sai trong câu chứa "${wordStr}": "我 (A) 昨天 (B) 检查 (C) ${wordStr} (D) 正在。"`;
      correctAnswer = 'D';
      options = ['A', 'B', 'C', 'D'];
      explanationVi = `Phó từ "正在" (D) không bao giờ đứng ở cuối câu; nó phải đứng trước động từ "检查".`;
      hintVi = `💡 Gợi ý tìm lỗi sai: Trong tiếng Trung, phó từ tiến hành '正在' luôn đứng trước động từ, không được đứng ở cuối câu.`;
      break;

    case 'sentence_correction':
      skill = 'grammar';
      prompt = `[Bài #${index + 1}] Chọn câu tiếng Trung sửa lỗi đúng cho câu: "他 正在 已经 检查 ${wordStr}。"`;
      correctAnswer = `他 已经 正在 检查 ${wordStr}。`;
      const errOpt1 = `他 正在 已经 检查 ${wordStr}。`;
      const errOpt2 = `他 检查 已经 正在 ${wordStr}。`;
      const errOpt3 = `正在 他 已经 检查 ${wordStr}。`;
      options = [correctAnswer, errOpt1, errOpt2, errOpt3].sort();
      explanationVi = `Phó từ thời gian "已经" đứng trước phó từ trạng thái "正在".`;
      hintVi = `💡 Mẹo ngữ pháp: Khi xuất hiện cả '已经' và '正在', phó từ thời gian '已经' (đã) đứng trước '正在' (đang).`;
      break;

    case 'zh_particles':
      skill = 'grammar';
      const particle = ZH_PARTICLES[index % ZH_PARTICLES.length];
      prompt = `[Bài #${index + 1}] Chọn trợ từ ngữ pháp phù hợp điền vào câu chứa "${wordStr}": "他 刚才 检查 ____ ${wordStr}。"`;
      correctAnswer = particle;
      options = ['了', '过', '着', '在', '正在', '不', '没'].slice(0, 4);
      if (!options.includes(particle)) options[0] = particle;
      explanationVi = `Trợ từ "${particle}" dùng để biểu thị ngữ khí / động thái thích hợp trong câu.`;
      hintVi = `💡 Mẹo trợ từ: '了' (đã hoàn thành), '过' (đã từng có kinh nghiệm), '着' (trạng thái tiếp diễn duy trì).`;
      break;

    case 'translation':
      skill = 'translation';
      const isViToZh = index % 2 === 0;
      if (isViToZh) {
        prompt = `[Bài #${index + 1}] Dịch câu sau sang tiếng Trung: "Anh ấy đang kiểm tra ${entry.meaningVi.toLowerCase()}."`;
        correctAnswer = `他正在检查${wordStr}。`;
        options = [
          correctAnswer,
          `他已经检查${wordStr}。`,
          `他没检查${wordStr}。`,
          `他去过${wordStr}。`,
        ].sort();
        explanationVi = `"Kiểm tra ${entry.meaningVi}" dịch sang tiếng Trung là "检查${wordStr}".`;
        hintVi = `💡 Gợi ý dịch: Cấu trúc câu 'Đang làm gì': [Chủ ngữ 他] + [正在] + [Động từ 检查] + [Tân ngữ ${wordStr}].`;
      } else {
        prompt = `[Bài #${index + 1}] Dịch câu tiếng Trung sau sang tiếng Việt: "请 strictly 遵守${wordStr}。"`;
        correctAnswer = `Xin hãy tuân thủ nghiêm ngặt ${entry.meaningVi.toLowerCase()}.`;
        options = [
          correctAnswer,
          `Xin hãy thay thế ${entry.meaningVi.toLowerCase()}.`,
          `Xin hãy bảo dưỡng ${entry.meaningVi.toLowerCase()}.`,
          `Xin hãy bỏ qua ${entry.meaningVi.toLowerCase()}.`,
        ].sort();
        explanationVi = `Câu "请 strictly 遵守${wordStr}" nghĩa là "Xin hãy tuân thủ nghiêm ngặt ${entry.meaningVi.toLowerCase()}".`;
        hintVi = `💡 Gợi ý dịch: '遵守' nghĩa là tuân thủ/chấp hành; '${wordStr}' nghĩa là ${entry.meaningVi}.`;
      }
      break;

    case 'reading_comprehension':
      skill = 'reading';
      prompt = `[Bài #${index + 1}] Đọc đoạn văn xưởng và trả lời câu hỏi:
"车间里, 安全第一。所有工人入场前必须检查 ${wordStr} (${pinyinStr})。如果发现异常, 应当立即 Gem 报告主管。"
Câu hỏi: 工人在入场前 family 必须检查什么？ (Công nhân trước khi vào xưởng phải kiểm tra gì?)`;
      correctAnswer = wordStr;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'word', 3)].sort();
      explanationVi = `Đoạn văn ghi rõ: "所有工人入场前必须检查 ${wordStr}" (Tất cả công nhân trước khi vào xưởng phải kiểm tra ${entry.meaningVi}).`;
      hintVi = `💡 Gợi ý đọc hiểu: Tìm cụm từ '必须检查' (phải kiểm tra) trong đoạn văn để xác định tân ngữ đi kèm là '${wordStr}'.`;
      break;

    case 'multi_skill':
    default:
      skill = 'writing';
      prompt = `[Bài #${index + 1}] Bài tập tổng hợp: Tạo câu tiếng Trung chuẩn có chứa từ "${wordStr}" (${pinyinStr}) (${entry.meaningVi}):`;
      correctAnswer = `我在工厂使用${wordStr}。`;
      options = [
        `我在工厂使用${wordStr}。`,
        `这台机器不需要${wordStr}。`,
        `请注意${wordStr}。`,
        ` tomorrow 检查${wordStr}。`,
      ];
      explanationVi = `Mẫu câu chuẩn: "我在工厂 sử dụng ${wordStr}。" (Tôi sử dụng ${entry.meaningVi} trong nhà máy).`;
      hintVi = `💡 Gợi ý bài tập kết hợp: Chọn mẫu câu ngữ pháp tự nhiên nhất có chứa từ '${wordStr}' hoặc thực hành ghi âm.`;
      break;
  }

  return {
    id,
    quizId,
    language: 'zh',
    level,
    topic,
    skill,
    questionType: type,
    prompt,
    pinyinOrIpa: pinyinStr,
    simplifiedOrWord: wordStr,
    audioUrl: `/audio/zh/${encodeURIComponent(wordStr)}.mp3`,
    optionsJson: JSON.stringify(options),
    correctAnswer,
    explanationVi,
    hintVi,
    recommendedTimeSecs: 30,
    points: 10,
    sourceData: 'Standard HSK 1-6 Industrial Lexicon',
  };
}

function generateEnExercise(entry: VocabEntry, index: number, allEntries: VocabEntry[]): QuizQuestionItem {
  const type = EXERCISE_TYPES_EN[index % EXERCISE_TYPES_EN.length];
  const wordStr = entry.word;
  const ipaStr = entry.ipa || '';
  const level = entry.cefrLevel || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][index % 6];
  const topic = entry.topic || 'Workplace Safety & Operations';
  const id = `en-quiz-${String(index + 1).padStart(4, '0')}`;
  const quizId = `quiz-en-${level.toLowerCase()}`;

  let skill: QuizQuestionItem['skill'] = 'vocabulary';
  let prompt = '';
  let options: string[] = [];
  let correctAnswer = '';
  let explanationVi = '';
  let hintVi = '';

  switch (type) {
    case 'single_choice':
      skill = 'vocabulary';
      prompt = `[Task #${index + 1}] Thuật ngữ tiếng Anh "${wordStr}" ${ipaStr ? `(${ipaStr})` : ''} có nghĩa là gì?`;
      correctAnswer = entry.meaningVi;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'meaningVi', 3)].sort();
      explanationVi = `"${wordStr}" ${ipaStr ? `(${ipaStr})` : ''} dịch sang tiếng Việt là "${entry.meaningVi}".`;
      hintVi = `💡 Gợi ý cách làm: Xem phát âm IPA ${ipaStr} và đối chiếu từ "${wordStr}" với thuật ngữ chuyên ngành ${topic}.`;
      break;

    case 'multiple_choice':
      skill = 'vocabulary';
      prompt = `[Task #${index + 1}] Select ALL correct attributes of the English term "${wordStr}":`;
      const wrong1 = getDistractors(allEntries, index, 'meaningVi', 1)[0];
      options = [
        `Nghĩa Việt: ${entry.meaningVi}`,
        `Cấp độ CEFR: ${level}`,
        `Nghĩa sai: ${wrong1}`,
        `Loại từ không khớp`,
      ];
      correctAnswer = JSON.stringify([`Nghĩa Việt: ${entry.meaningVi}`, `Cấp độ CEFR: ${level}`]);
      explanationVi = `"${wordStr}" mang nghĩa "${entry.meaningVi}" thuộc khung trình độ CEFR ${level}.`;
      hintVi = `💡 Gợi ý cách làm: Tích chọn TẤT CẢ các đáp án mô tả đúng nghĩa Việt và khung trình độ CEFR ${level}.`;
      break;

    case 'true_false':
      skill = 'reading';
      const isTrue = index % 2 === 0;
      const statementMeaning = isTrue ? entry.meaningVi : getDistractors(allEntries, index, 'meaningVi', 1)[0];
      prompt = `[Task #${index + 1}] True or False: The English term "${wordStr}" means "${statementMeaning}".`;
      options = ['True', 'False'];
      correctAnswer = isTrue ? 'True' : 'False';
      explanationVi = isTrue
        ? `True! "${wordStr}" strictly translates to "${entry.meaningVi}".`
        : `False! "${wordStr}" means "${entry.meaningVi}", not "${statementMeaning}".`;
      hintVi = `💡 Gợi ý cách làm: So sánh nghĩa được phát biểu trong đề bài với định nghĩa chính xác của từ "${wordStr}" (${entry.meaningVi}).`;
      break;

    case 'fill_blank':
      skill = 'grammar';
      const ex = entry.examples?.[0];
      if (ex && ex.sentenceEn && ex.sentenceEn.toLowerCase().includes(wordStr.toLowerCase())) {
        const regex = new RegExp(wordStr, 'gi');
        prompt = `[Task #${index + 1}] Fill in the blank: "${ex.sentenceEn.replace(regex, '____')}" (${ex.sentenceVi || entry.meaningVi})`;
      } else {
        prompt = `[Task #${index + 1}] Fill in the blank: "All operators must check the ____ (${wordStr}) before starting." (Meaning: ${entry.meaningVi})`;
      }
      correctAnswer = wordStr;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'word', 3)].sort();
      explanationVi = `The missing term is "${wordStr}" (${entry.meaningVi}).`;
      hintVi = `💡 Gợi ý cách làm: Dựa vào ý nghĩa câu tiếng Việt trong ngoặc đơn để điền từ tiếng Anh '${wordStr}' thích hợp.`;
      break;

    case 'pair_matching':
      skill = 'vocabulary';
      prompt = `[Task #${index + 1}] Match "${wordStr}" and related industrial terms with their Vietnamese definitions:`;
      const p2 = allEntries[(index + 1) % allEntries.length];
      const p3 = allEntries[(index + 2) % allEntries.length];
      const p4 = allEntries[(index + 3) % allEntries.length];
      const pairs = [
        { left: wordStr, right: entry.meaningVi },
        { left: p2.word, right: p2.meaningVi },
        { left: p3.word, right: p3.meaningVi },
        { left: p4.word, right: p4.meaningVi },
      ];
      options = pairs.map((p) => `${p.left} ↔ ${p.right}`);
      correctAnswer = JSON.stringify(pairs);
      explanationVi = `Correct matching pairs: ${pairs.map((p) => `${p.left} = ${p.right}`).join('; ')}.`;
      hintVi = `💡 Gợi ý ghép cặp: Nối từ tiếng Anh bên trái với nghĩa tiếng Việt tương ứng ở bên phải.`;
      break;

    case 'sentence_order':
      skill = 'grammar';
      const sEn = entry.examples?.[0]?.sentenceEn || `Always inspect the ${wordStr} carefully.`;
      const cleanTokens = sEn.replace(/[.!?]/g, '').split(' ').filter(Boolean);
      const shuffled = [...cleanTokens].sort(() => 0.5 - Math.random());
      prompt = `[Task #${index + 1}] Reorder the words to form a correct English sentence containing "${wordStr}": [ ${shuffled.join(' / ')} ]`;
      correctAnswer = cleanTokens.join(' ');
      options = [correctAnswer];
      explanationVi = `Correct sentence structure: "${cleanTokens.join(' ')}."`;
      hintVi = `💡 Quy tắc sắp xếp câu Tiếng Anh: [Subject] + [Verb] + [Object containing '${wordStr}'] + [Adverb].`;
      break;

    case 'dialogue_order':
      skill = 'reading';
      prompt = `[Task #${index + 1}] Reorder the conversation turns regarding "${wordStr}" logically:`;
      const d1 = `A: Where can I find the ${wordStr}?`;
      const d2 = `B: It is stored in Cabinet B near the assembly line.`;
      const d3 = `A: Thank you, I will check it right away.`;
      options = [d1, d2, d3];
      correctAnswer = JSON.stringify([d1, d2, d3]);
      explanationVi = `Logical conversation flow: Inquiry about ${wordStr} -> Direct location answer -> Acknowledgment.`;
      hintVi = `💡 Gợi ý sắp xếp hội thoại: 1. Câu hỏi vị trí '${wordStr}' -> 2. Câu trả lời chỉ vị trí -> 3. Cảm ơn & xác nhận.`;
      break;

    case 'listen_pick':
      skill = 'listening';
      prompt = `[Task #${index + 1}] Listen to the audio pronunciation of "${wordStr}" ${ipaStr ? `(${ipaStr})` : ''} and pick the correct meaning:`;
      correctAnswer = entry.meaningVi;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'meaningVi', 3)].sort();
      explanationVi = `The audio pronounces "${wordStr}" ${ipaStr ? `(${ipaStr})` : ''}, which means "${entry.meaningVi}".`;
      hintVi = `💡 Gợi ý nghe: Bấm nút Loa 🔊 để nghe phát âm tiếng Anh Anh/Mỹ của '${wordStr}' và chọn đáp án nghĩa Việt.`;
      break;

    case 'listen_type':
      skill = 'listening';
      prompt = `[Task #${index + 1}] Listen to the audio prompt for "${wordStr}" and type the exact English word:`;
      correctAnswer = wordStr;
      options = [correctAnswer];
      explanationVi = `The audio word is "${wordStr}".`;
      hintVi = `💡 Gợi ý gõ từ: Nghe âm thanh từ vựng tiếng Anh và gõ lại đúng chính tả từ '${wordStr}'.`;
      break;

    case 'pronunciation_pick':
      skill = 'pronunciation';
      prompt = `[Task #${index + 1}] Select the correct International Phonetic Alphabet (IPA) transcription for "${wordStr}":`;
      correctAnswer = ipaStr || `/${wordStr.toLowerCase()}/`;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'ipa', 3)].sort();
      explanationVi = `The phonetic IPA transcription for "${wordStr}" is ${correctAnswer}.`;
      hintVi = `💡 Gợi ý phát âm IPA: Từ '${wordStr}' có phiên âm IPA chuẩn là ${correctAnswer}. Chú ý trọng âm chính (').`;
      break;

    case 'error_identification':
      skill = 'grammar';
      prompt = `[Task #${index + 1}] Identify the grammatically incorrect section in the sentence for "${wordStr}": "The technician (A) have (B) inspected the (C) ${wordStr} (D)."`;
      correctAnswer = 'B';
      options = ['A', 'B', 'C', 'D'];
      explanationVi = `"The technician" is singular third-person, so option (B) should be "has inspected", not "have inspected".`;
      hintVi = `💡 Gợi ý tìm lỗi sai: Chủ ngữ số ít 'The technician' phải đi với trợ động từ 'has', không dùng 'have'.`;
      break;

    case 'sentence_correction':
      skill = 'grammar';
      prompt = `[Task #${index + 1}] Choose the correct revised sentence for: "He don't maintain the ${wordStr} regularly."`;
      correctAnswer = `He doesn't maintain the ${wordStr} regularly.`;
      options = [
        correctAnswer,
        `He don't maintain the ${wordStr} regularly.`,
        `He isn't maintain the ${wordStr} regularly.`,
        `He not maintain the ${wordStr} regularly.`,
      ].sort();
      explanationVi = `Subject "He" requires the auxiliary verb "doesn't" for negative present simple tense.`;
      hintVi = `💡 Mẹo sửa câu: Chủ ngữ 'He' ở thì hiện tại đơn phủ định dùng trợ động từ 'doesn't'.`;
      break;

    case 'verb_tense':
      skill = 'grammar';
      prompt = `[Task #${index + 1}] Select the correct verb tense form for "${wordStr}": "Yesterday, the maintenance team ____ the ${wordStr}."`;
      correctAnswer = 'inspected';
      options = ['inspected', 'inspects', 'is inspecting', 'will inspect'];
      explanationVi = `"Yesterday" indicates past simple tense ("inspected").`;
      hintVi = `💡 Mẹo chọn thì động từ: Trạng từ thời gian 'Yesterday' (hôm qua) chỉ thì Quá khứ đơn (Động từ thêm -ed).`;
      break;

    case 'translation':
      skill = 'translation';
      const isViToEn = index % 2 === 0;
      if (isViToEn) {
        prompt = `[Task #${index + 1}] Dịch câu sau sang tiếng Anh: "Kỹ thuật viên đang kiểm tra ${entry.meaningVi.toLowerCase()}."`;
        correctAnswer = `The technician is inspecting the ${wordStr}.`;
        options = [
          correctAnswer,
          `The technician inspect the ${wordStr}.`,
          `The technician was inspect ${wordStr}.`,
          `The technician will inspecting ${wordStr}.`,
        ].sort();
        explanationVi = `"Kỹ thuật viên đang kiểm tra ${entry.meaningVi}" dịch sang tiếng Anh là "The technician is inspecting the ${wordStr}."`;
        hintVi = `💡 Gợi ý dịch: Thì hiện tại tiếp diễn [Subject] + [is/am/are] + [V-ing] + [Object ${wordStr}].`;
      } else {
        prompt = `[Task #${index + 1}] Translate to Vietnamese: "Always check the ${wordStr} before starting the machine."`;
        correctAnswer = `Luôn kiểm tra ${entry.meaningVi.toLowerCase()} trước khi khởi động máy.`;
        options = [
          correctAnswer,
          `Bỏ qua ${entry.meaningVi.toLowerCase()} khi khởi động máy.`,
          `Sửa chữa ${entry.meaningVi.toLowerCase()} sau ca làm việc.`,
          `Vận chuyển ${entry.meaningVi.toLowerCase()} về kho.`,
        ].sort();
        explanationVi = `Câu tiếng Anh dịch nghĩa chuẩn là "Luôn kiểm tra ${entry.meaningVi.toLowerCase()} trước khi khởi động máy."`;
        hintVi = `💡 Gợi ý dịch: 'Always check' = Luôn kiểm tra; '${wordStr}' = ${entry.meaningVi}.`;
      }
      break;

    case 'reading_comprehension':
      skill = 'reading';
      prompt = `[Task #${index + 1}] Read the passage and answer the question:
"Safety Protocol 4.2: Before entering the cleanroom, every operator must verify the status of the ${wordStr} (${ipaStr}). Any detected defect must be logged in the maintenance portal immediately."
Question: What must every operator verify before entering the cleanroom?`;
      correctAnswer = wordStr;
      options = [correctAnswer, ...getDistractors(allEntries, index, 'word', 3)].sort();
      explanationVi = `The passage specifies: "every operator must verify the status of the ${wordStr}" (${entry.meaningVi}).`;
      hintVi = `💡 Gợi ý đọc hiểu: Đọc câu đầu tiên của đoạn văn và tìm từ đi sau cụm 'verify the status of the...'.`;
      break;

    case 'multi_skill':
    default:
      skill = 'writing';
      prompt = `[Task #${index + 1}] Combined Skill Exercise: Write or choose a professional workplace sentence using "${wordStr}" (${entry.meaningVi}):`;
      correctAnswer = `We must strictly follow the ${wordStr} guidelines.`;
      options = [
        `We must strictly follow the ${wordStr} guidelines.`,
        `The ${wordStr} are not important here.`,
        `He skip ${wordStr} yesterday.`,
        `Always ignore ${wordStr} warnings.`,
      ];
      explanationVi = `Standard workplace sentence: "We must strictly follow the ${wordStr} guidelines."`;
      hintVi = `💡 Gợi ý bài tập kết hợp: Chọn câu tiếng Anh chuẩn có chứa từ '${wordStr}' hoặc bấm nút Ghi Âm để kiểm tra phát âm.`;
      break;
  }

  return {
    id,
    quizId,
    language: 'en',
    level,
    topic,
    skill,
    questionType: type,
    prompt,
    pinyinOrIpa: ipaStr,
    simplifiedOrWord: wordStr,
    audioUrl: `/audio/en/${encodeURIComponent(wordStr)}.mp3`,
    optionsJson: JSON.stringify(options),
    correctAnswer,
    explanationVi,
    hintVi,
    recommendedTimeSecs: 30,
    points: 10,
    sourceData: 'CEFR Workplace Framework',
  };
}

async function main() {
  console.log('Generating 6,000 Real Unique Quiz Exercises with Step-by-Step Hints...');

  const rootDir = path.resolve(__dirname, '..');
  const zhPath = path.join(rootDir, 'src/lib/data/datasets/zh-3k.json');
  const enPath = path.join(rootDir, 'src/lib/data/datasets/en-3k.json');

  const zhRaw = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));
  const enRaw = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  const zhVocab: VocabEntry[] = zhRaw.data;
  const enVocab: VocabEntry[] = enRaw.data;

  console.log(`Loaded ${zhVocab.length} Chinese vocab items & ${enVocab.length} English vocab items.`);

  const zhExercises: QuizQuestionItem[] = [];
  for (let i = 0; i < 3000; i++) {
    const entry = zhVocab[i % zhVocab.length];
    zhExercises.push(generateZhExercise(entry, i, zhVocab));
  }

  const enExercises: QuizQuestionItem[] = [];
  for (let i = 0; i < 3000; i++) {
    const entry = enVocab[i % enVocab.length];
    enExercises.push(generateEnExercise(entry, i, enVocab));
  }

  console.log(`Generated ${zhExercises.length} Chinese exercises and ${enExercises.length} English exercises with hints.`);

  // Write static JSON datasets
  const zhOutPath = path.join(rootDir, 'src/lib/data/datasets/zh-exercises-3k.json');
  const enOutPath = path.join(rootDir, 'src/lib/data/datasets/en-exercises-3k.json');

  fs.writeFileSync(zhOutPath, JSON.stringify({ metadata: { language: 'zh', count: zhExercises.length }, data: zhExercises }, null, 2));
  fs.writeFileSync(enOutPath, JSON.stringify({ metadata: { language: 'en', count: enExercises.length }, data: enExercises }, null, 2));

  // Seed into SQLite / Prisma
  console.log('Seeding SQLite database via Prisma...');
  await prisma.quizQuestion.deleteMany({});
  await prisma.quiz.deleteMany({});

  const levelsZh = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];
  const levelsEn = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  for (const lvl of levelsZh) {
    await prisma.quiz.create({
      data: {
        id: `quiz-zh-${lvl.toLowerCase()}`,
        title: `Kiểm tra Tiếng Trung ${lvl}`,
        description: `Bộ 500 bài luyện tập và kiểm tra tiêu chuẩn ${lvl} công xưởng.`,
        language: 'zh',
        category: 'Workplace & Technical',
        difficulty: lvl.startsWith('HSK1') || lvl.startsWith('HSK2') ? 'BEGINNER' : lvl.startsWith('HSK3') || lvl.startsWith('HSK4') ? 'INTERMEDIATE' : 'ADVANCED',
        timeLimitSecs: 600,
      },
    });
  }

  for (const lvl of levelsEn) {
    await prisma.quiz.create({
      data: {
        id: `quiz-en-${lvl.toLowerCase()}`,
        title: `English Quiz Level ${lvl}`,
        description: `Comprehensive 500 exercises for workplace English CEFR ${lvl}.`,
        language: 'en',
        category: 'Industrial English',
        difficulty: lvl === 'A1' || lvl === 'A2' ? 'BEGINNER' : lvl === 'B1' || lvl === 'B2' ? 'INTERMEDIATE' : 'ADVANCED',
        timeLimitSecs: 600,
      },
    });
  }

  const allExercises = [...zhExercises, ...enExercises];
  const BATCH_SIZE = 250;
  for (let i = 0; i < allExercises.length; i += BATCH_SIZE) {
    const batch = allExercises.slice(i, i + BATCH_SIZE);
    await prisma.quizQuestion.createMany({
      data: batch.map((item) => ({
        id: item.id,
        quizId: item.quizId,
        questionType: item.questionType,
        language: item.language,
        level: item.level,
        topic: item.topic,
        skill: item.skill,
        prompt: item.prompt,
        pinyinOrIpa: item.pinyinOrIpa,
        simplifiedOrWord: item.simplifiedOrWord,
        audioUrl: item.audioUrl,
        optionsJson: item.optionsJson,
        correctAnswer: item.correctAnswer,
        explanationVi: item.explanationVi,
        hintVi: item.hintVi,
        recommendedTimeSecs: item.recommendedTimeSecs,
        points: item.points,
        sourceData: item.sourceData,
      })),
    });
    console.log(`Seeded batch ${i / BATCH_SIZE + 1} / ${Math.ceil(allExercises.length / BATCH_SIZE)} (${i + batch.length} items)`);
  }

  console.log('Successfully generated & seeded 6,000 exercises with hints into SQLite database!');
}

main()
  .catch((e) => {
    console.error('Error seeding quiz exercises:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
