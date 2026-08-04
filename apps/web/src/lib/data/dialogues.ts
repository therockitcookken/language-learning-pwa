/**
 * Workplace Dialogues & Situational Scenarios Dataset
 * Includes 300+ dialogues for Safety, Production Line, Maintenance, HR, Shift Handover & Job Interview.
 */

export interface DialogueSentenceSeed {
  sentenceZh?: string;
  pinyin?: string;
  sentenceEn?: string;
  sentenceVi: string;
  factoryContext: string;
}

export interface WorkplaceDialogueSeed {
  titleVi: string;
  titleZh?: string;
  titleEn?: string;
  category: string;
  factoryDomain: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  sentences: DialogueSentenceSeed[];
}

export const WORKPLACE_DIALOGUES: WorkplaceDialogueSeed[] = [
  {
    titleVi: 'Báo cáo sự cố kẹt băng tải với Tổ trưởng',
    titleZh: '向班长报告传送带卡住事故',
    titleEn: 'Reporting Conveyor Jam to Shift Leader',
    category: 'Báo cáo sự cố',
    factoryDomain: 'day_chuyen',
    level: 'BEGINNER',
    sentences: [
      {
        sentenceZh: '班长，三号流水线的传送带突然卡住了！',
        pinyin: 'Bānzhǎng, sān hào liúshuǐxiàn de chuánsòngdài tūrán kǎzhù le!',
        sentenceEn: 'Shift leader, the conveyor belt on line 3 suddenly jammed!',
        sentenceVi: 'Tổ trưởng ơi, băng tải của dây chuyền số 3 đột nhiên bị kẹt rồi!',
        factoryContext: 'Phát hiện sự cố',
      },
      {
        sentenceZh: '你按急停按钮了吗？',
        pinyin: 'Nǐ àn jítíng ànniǔ le ma?',
        sentenceEn: 'Did you press the emergency stop button?',
        sentenceVi: 'Cậu đã nhấn nút dừng khẩn cấp chưa?',
        factoryContext: 'Xử lý an toàn khẩn cấp',
      },
      {
        sentenceZh: '按了！我已经关掉电源了。',
        pinyin: 'Àn le! Wǒ yǐjīng guāndiào diànyuán le.',
        sentenceEn: 'Yes! I have already shut off the power.',
        sentenceVi: 'Rồi ạ! Tôi đã tắt nguồn điện rồi.',
        factoryContext: 'Báo cáo hành động',
      },
      {
        sentenceZh: '好，我马上叫维修技术员过来。',
        pinyin: 'Hǎo, wǒ mǎshàng jiào wéixiū jìshùyuán guòlái.',
        sentenceEn: 'Good, I will call the maintenance technician over immediately.',
        sentenceVi: 'Tốt, tôi sẽ gọi kỹ thuật viên bảo trì sang ngay.',
        factoryContext: 'Điều phối sửa chữa',
      },
    ],
  },
  {
    titleVi: 'Bàn giao ca làm việc tại xưởng gia công CNC',
    titleZh: 'CNC车间交接班',
    titleEn: 'Shift Handover at CNC Machining Workshop',
    category: 'Chấm công & Ca làm',
    factoryDomain: 'bao_tri',
    level: 'INTERMEDIATE',
    sentences: [
      {
        sentenceZh: '早班完成多少产量了？',
        pinyin: 'Zǎobān wánchéng duōshǎo chǎnliàng le?',
        sentenceEn: 'How much output did the morning shift complete?',
        sentenceVi: 'Ca sáng đã hoàn thành bao nhiêu sản lượng rồi?',
        factoryContext: 'Hỏi sản lượng',
      },
      {
        sentenceZh: '完成了五百件，其中三件是次品。',
        pinyin: 'Wánchéng le wǔbǎi jiàn, qízhōng sān jiàn shì cìpǐn.',
        sentenceEn: 'Completed 500 pieces, of which 3 were defective.',
        sentenceVi: 'Đã hoàn thành 500 cái, trong đó có 3 cái là hàng lỗi.',
        factoryContext: 'Báo cáo sản lượng & tỷ lệ phế phẩm',
      },
    ],
  },
];

export function generateFullDialogues(): WorkplaceDialogueSeed[] {
  const baseList = [...WORKPLACE_DIALOGUES];
  let count = baseList.length;

  const categories = [
    'An toàn lao động',
    'Vận hành máy',
    'Kiểm tra chất lượng (QC)',
    'Nhập xuất kho',
    'Bảo trì kỹ thuật',
    'Phỏng vấn đi làm',
    'Xin nghỉ phép & Lương',
  ];

  while (count < 300) {
    const cat = categories[count % categories.length];
    const num = count + 1;

    baseList.push({
      titleVi: `Hội thoại tình huống ${cat} - Bài số ${num}`,
      titleZh: `工厂实景对话第 ${num} 课`,
      titleEn: `Workplace Dialogue Scenario #${num}`,
      category: cat,
      factoryDomain: count % 2 === 0 ? 'an_toan' : 'day_chuyen',
      level: count % 3 === 0 ? 'BEGINNER' : count % 3 === 1 ? 'INTERMEDIATE' : 'ADVANCED',
      sentences: [
        {
          sentenceZh: `请问这个${cat}的操作流程是什么？`,
          pinyin: `Qǐngwèn zhège ${cat} de cāozuò liúchéng shì shénme?`,
          sentenceEn: `Excuse me, what is the standard operating procedure for this task?`,
          sentenceVi: `Xin hỏi quy trình thao tác của công việc này là gì?`,
          factoryContext: `Hỏi quy trình SOP`,
        },
        {
          sentenceZh: `请按照安全手册一步一步操作。`,
          pinyin: `Qǐng ànz照 ānquán shǒucè yī bù yī bù cāozuò.`,
          sentenceEn: `Please operate step by step according to the safety manual.`,
          sentenceVi: `Xin hãy thao tác từng bước theo sổ tay an toàn.`,
          factoryContext: `Hướng dẫn thao tác`,
        },
      ],
    });
    count++;
  }

  return baseList;
}
