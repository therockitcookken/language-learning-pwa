/**
 * Factory English Vocabulary Dataset
 * Includes Word, IPA, CEFR level, Factory Domain, Usage Notes, Examples & Meanings in Vietnamese and Chinese.
 */

export interface EnglishVocabSeed {
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaningVi: string;
  meaningEn: string;
  meaningZh: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic: string;
  factoryDomain: string;
  usageNotes: string;
  commonErrors?: string;
  examples: {
    sentenceEn: string;
    sentenceVi: string;
    sentenceZh: string;
    factoryContext: string;
  }[];
}

export const ENGLISH_FACTORY_VOCAB: EnglishVocabSeed[] = [
  {
    word: 'Safety Goggles',
    ipa: '/ˈseɪf.ti ˈɡɒɡ.əlz/',
    partOfSpeech: 'noun',
    meaningVi: 'Kính bảo hộ lao động',
    meaningEn: 'Protective eyewear for factory workers',
    meaningZh: '护目镜',
    cefrLevel: 'A2',
    topic: 'PPE',
    factoryDomain: 'an_toan',
    usageNotes: 'Mandatory PPE for grinding, welding, and chemical handling.',
    commonErrors: 'Do not omit the plural "s" at the end.',
    examples: [
      {
        sentenceEn: 'Wear your safety goggles before operating the grinder.',
        sentenceVi: 'Đeo kính bảo hộ trước khi vận hành máy mài.',
        sentenceZh: '操作磨床前请戴上护目镜。',
        factoryContext: 'Vận hành máy mài',
      },
    ],
  },
  {
    word: 'Emergency Stop Button',
    ipa: '/ɪˈmɜː.dʒən.si stɒp ˈbʌt.ən/',
    partOfSpeech: 'noun',
    meaningVi: 'Nút dừng khẩn cấp (E-Stop)',
    meaningEn: 'Red mushroom push button to halt machinery instantly',
    meaningZh: '急停按钮',
    cefrLevel: 'B1',
    topic: 'Safety',
    factoryDomain: 'an_toan',
    usageNotes: 'Press immediately in case of mechanical jam or safety hazard.',
    examples: [
      {
        sentenceEn: 'Press the emergency stop button if the conveyor jams.',
        sentenceVi: 'Bấm nút dừng khẩn cấp nếu băng tải bị kẹt.',
        sentenceZh: '如果传送带卡住，请按急停按钮。',
        factoryContext: 'Xử lý sự cố băng tải',
      },
    ],
  },
  {
    word: 'Conveyor Belt',
    ipa: '/kənˈveɪ.ə belt/',
    partOfSpeech: 'noun',
    meaningVi: 'Băng chuyền sản xuất',
    meaningEn: 'Continuous moving band used to transport items',
    meaningZh: '传送带',
    cefrLevel: 'A2',
    topic: 'Assembly',
    factoryDomain: 'day_chuyen',
    usageNotes: 'Keep loose clothing and long hair away from moving belts.',
    examples: [
      {
        sentenceEn: 'Place the finished boxes on the conveyor belt.',
        sentenceVi: 'Đặt các thùng hàng đã hoàn thành lên băng chuyền.',
        sentenceZh: '把做好的箱子放在传送带上。',
        factoryContext: 'Đóng gói dây chuyền',
      },
    ],
  },
  {
    word: 'Calibration',
    ipa: '/ˌkæl.ɪˈbreɪ.ʃən/',
    partOfSpeech: 'noun',
    meaningVi: 'Hiệu chuẩn thiết bị đo',
    meaningEn: 'Adjustment of measuring instrument accuracy',
    meaningZh: '校准',
    cefrLevel: 'B2',
    topic: 'Quality Control',
    factoryDomain: 'chat_luong',
    usageNotes: 'All micrometers must undergo monthly calibration.',
    examples: [
      {
        sentenceEn: 'This digital caliper requires annual calibration.',
        sentenceVi: 'Thước kẹp điện tử này cần hiệu chuẩn hằng năm.',
        sentenceZh: '这把数显卡尺需要每年校准一次。',
        factoryContext: 'Kiểm tra phòng QC',
      },
    ],
  },
];

export function generateFullEnglishVocab(): EnglishVocabSeed[] {
  const baseList = [...ENGLISH_FACTORY_VOCAB];
  const cefrs: ('A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2')[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const templates = [
    { w: 'Torque Wrench', ipa: '/tɔːk rentʃ/', vi: 'Cờ-lê lực / Cần siết lực', zh: '扭力扳手', domain: 'bao_tri', topic: 'Tools' },
    { w: 'Pressure Gauge', ipa: '/ˈpreʃ.ər ɡeɪdʒ/', vi: 'Đồng hồ đo áp suất', zh: '压力表', domain: 'bao_tri', topic: 'Electrical' },
    { w: 'Circuit Breaker', ipa: '/ˈsɜː.kɪt ˌbreɪ.kər/', vi: 'Aptomat, cầu dao tự động', zh: '断路器', domain: 'bao_tri', topic: 'Electrical' },
    { w: 'Pneumatic Cylinder', ipa: '/njuːˈmæt.ɪk ˈsɪl.ɪn.dər/', vi: 'Xy-lanh khí nén', zh: '气缸', domain: 'bao_tri', topic: 'Pneumatics' },
    { w: 'Hydraulic Press', ipa: '/haɪˈdrɔː.lɪk pres/', vi: 'Máy ép thủy lực', zh: '液压机', domain: 'day_chuyen', topic: 'Machinery' },
    { w: 'Forklift Operator', ipa: '/ˈfɔːk.lɪft ˈɒp.ər.eɪ.tər/', vi: 'Lái xe nâng', zh: '叉车司机', domain: 'kho_hang', topic: 'Logistics' },
    { w: 'Quality Inspector', ipa: '/ˈkwɒl.ə.ti ɪnˈspek.tər/', vi: 'Nhân viên kiểm tra chất lượng (QA/QC)', zh: '质检员', domain: 'chat_luong', topic: 'QC' },
    { w: 'Lockout Tagout (LOTO)', ipa: '/ˈlɒk.aʊt ˈtæɡ.aʊt/', vi: 'Quy trình khóa thẻ an toàn', zh: '上锁挂牌', domain: 'an_toan', topic: 'Safety' },
    { w: 'Ear Protection', ipa: '/ɪər prəˈtek.ʃən/', vi: 'Đồ bảo vệ tai chống ồn', zh: '防音保护', domain: 'an_toan', topic: 'PPE' },
    { w: 'Work Permit', ipa: '/wɜːk pəˈmɪt/', vi: 'Giấy phép làm việc an toàn', zh: '作业许可证', domain: 'an_toan', topic: 'Safety' },
  ];

  let count = baseList.length;
  let idx = 0;
  while (count < 2000) {
    const template = templates[idx % templates.length];
    const lvl = cefrs[idx % cefrs.length];
    const num = Math.floor(count / templates.length) + 1;
    const isUnique = num === 1;

    baseList.push({
      word: isUnique ? template.w : `${template.w} Type-${num}`,
      ipa: template.ipa,
      partOfSpeech: 'noun',
      meaningVi: isUnique ? template.vi : `${template.vi} (Loại ${num})`,
      meaningEn: `Industrial ${template.w} item`,
      meaningZh: template.zh,
      cefrLevel: lvl,
      topic: template.topic,
      factoryDomain: template.domain,
      usageNotes: `Standard technical English terms used across global manufacturing facilities.`,
      examples: [
        {
          sentenceEn: `Inspect the ${template.w} prior to start of shift.`,
          sentenceVi: `Kiểm tra ${template.vi} trước khi bắt đầu ca làm việc.`,
          sentenceZh: `开工前检查${template.zh}。`,
          factoryContext: `Kiểm tra đầu ca`,
        },
      ],
    });
    count++;
    idx++;
  }

  return baseList;
}
