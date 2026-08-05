/**
 * Production Shadowing Dataset
 * Covers Chinese (zh-CN) and English (en-US / en-GB) factory Shadowing sentences
 * Spanning 15 factory topics with key vocabulary breakdowns and zero hard-code in UI components.
 */

import { LanguageCode, DifficultyLevel, FactoryTopic, TargetRole } from './minimal-pair-dataset';

export interface KeyVocabItem {
  word: string;
  phonetic: string;
  meaningVi: string;
  meaningEn?: string;
}

export interface ShadowingRecord {
  id: string;
  langCode: LanguageCode;
  topic: FactoryTopic;
  difficulty: DifficultyLevel;
  targetRole: TargetRole;
  title: string;
  targetText: string;
  phonetic: string;
  meaningVi: string;
  meaningEn?: string;
  factoryContext: string;
  slowSpeed: number; // e.g. 0.75
  normalSpeed: number; // e.g. 1.0
  keyVocabulary: KeyVocabItem[];
}

export const SHADOWING_DATASET: ShadowingRecord[] = [
  // CHINESE SHADOWING SENTENCES (zh-CN)
  {
    id: 'sh-zh-01',
    langCode: 'zh-CN',
    topic: 'maintenance',
    difficulty: 'intermediate',
    targetRole: 'technician',
    title: 'Bảo trì máy móc theo định kỳ',
    targetText: '请定期检查机器配电箱。',
    phonetic: 'Qǐng dìngqī jiǎnchá jīqì pèidiànxiāng.',
    meaningVi: 'Xin hãy định kỳ kiểm tra hộp phối điện của máy móc.',
    meaningEn: 'Please inspect the machine power distribution box regularly.',
    factoryContext: 'Bảo trì máy móc & tủ điện nhà xưởng',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: '定期', phonetic: 'dìngqī', meaningVi: 'Định kỳ' },
      { word: '检查', phonetic: 'jiǎnchá', meaningVi: 'Kiểm tra' },
      { word: '配电箱', phonetic: 'pèidiànxiāng', meaningVi: 'Hộp phối điện' },
    ],
  },
  {
    id: 'sh-zh-02',
    langCode: 'zh-CN',
    topic: 'safety',
    difficulty: 'beginner',
    targetRole: 'worker',
    title: 'Quy tắc an toàn lao động bắt buộc',
    targetText: '进入车间必须佩戴安全帽。',
    phonetic: 'Jìnrù chējiān bìxū pèidài ānquánmào.',
    meaningVi: 'Vào xưởng sản xuất bắt buộc phải đội mũ bảo hộ.',
    meaningEn: 'Mandatory to wear a safety helmet when entering the workshop.',
    factoryContext: 'An toàn lao động tại xưởng sản xuất',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: '车间', phonetic: 'chējiān', meaningVi: 'Phân xưởng' },
      { word: '必须', phonetic: 'bìxū', meaningVi: 'Bắt buộc' },
      { word: '安全帽', phonetic: 'ānquánmào', meaningVi: 'Mũ bảo hộ' },
    ],
  },
  {
    id: 'sh-zh-03',
    langCode: 'zh-CN',
    topic: 'quality',
    difficulty: 'intermediate',
    targetRole: 'qa_inspector',
    title: 'Báo cáo linh kiện lỗi QC',
    targetText: '这批零件外观出现瑕疵，需要退回。',
    phonetic: 'Zhè pī língjiàn wàiguān chūxiàn xiácī, xūyào tuìhuí.',
    meaningVi: 'Lô linh kiện này bề ngoài xuất hiện tì vết lỗi, cần phải trả lại.',
    meaningEn: 'This batch of parts has cosmetic defects and needs to be returned.',
    factoryContext: 'Kiểm định chất lượng QC & trả hàng lỗi',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: '零件', phonetic: 'língjiàn', meaningVi: 'Linh kiện' },
      { word: '瑕疵', phonetic: 'xiácī', meaningVi: 'Tì vết / Lỗi' },
      { word: '退回', phonetic: 'tuìhuí', meaningVi: 'Trả về' },
    ],
  },
  {
    id: 'sh-zh-04',
    langCode: 'zh-CN',
    topic: 'emergency',
    difficulty: 'advanced',
    targetRole: 'shift_leader',
    title: 'Quy trình ngắt khẩn cấp khi sự cố',
    targetText: '发生紧急情况时，请按下红色急停按钮。',
    phonetic: 'Fāshēng jǐnjí qíngkuàng shí, qǐng ànxià hóngsè jítíng ànniǔ.',
    meaningVi: 'Khi xảy ra tình huống khẩn cấp, xin hãy nhấn nút dừng khẩn màu đỏ.',
    meaningEn: 'In case of emergency, please press the red emergency stop button.',
    factoryContext: 'Quy trình ngắt máy khẩn cấp an toàn',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: '紧急', phonetic: 'jǐnjí', meaningVi: 'Khẩn cấp' },
      { word: '急停', phonetic: 'jítíng', meaningVi: 'Dừng khẩn cấp' },
      { word: '按钮', phonetic: 'ànniǔ', meaningVi: 'Nút bấm' },
    ],
  },

  // ENGLISH SHADOWING SENTENCES (en-US / en-GB)
  {
    id: 'sh-en-01',
    langCode: 'en-US',
    topic: 'maintenance',
    difficulty: 'intermediate',
    targetRole: 'technician',
    title: 'Routine Power Distribution Box Inspection',
    targetText: 'Please inspect the power distribution box regularly.',
    phonetic: '/pliːz ɪnˈspekt ðə paʊər ˌdɪstrɪˈbjuːʃn bɑːks ˈreɡjələrli/',
    meaningVi: 'Xin hãy định kỳ kiểm tra hộp phối điện của máy móc.',
    meaningEn: 'Please inspect the machine power distribution box regularly.',
    factoryContext: 'Factory maintenance & electrical panel check',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: 'inspect', phonetic: '/ɪnˈspekt/', meaningVi: 'Kiểm tra kỹ' },
      { word: 'distribution box', phonetic: '/ˌdɪstrɪˈbjuːʃn bɑːks/', meaningVi: 'Hộp phối điện' },
      { word: 'regularly', phonetic: '/ˈreɡjələrli/', meaningVi: 'Định kỳ' },
    ],
  },
  {
    id: 'sh-en-02',
    langCode: 'en-US',
    topic: 'safety',
    difficulty: 'beginner',
    targetRole: 'worker',
    title: 'PPE Helmet Requirement in Assembly Area',
    targetText: 'Wearing a safety helmet is mandatory in the assembly line.',
    phonetic: '/ˈweərɪŋ ə ˈseɪfti ˈhelmɪt ɪz ˈmændətɔːri ɪn ðə əˈsembli laɪn/',
    meaningVi: 'Đội mũ bảo hộ là bắt buộc tại dây chuyền lắp ráp.',
    meaningEn: 'Wearing a safety helmet is mandatory in the assembly line.',
    factoryContext: 'Assembly line safety PPE compliance',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: 'safety helmet', phonetic: '/ˈseɪfti ˈhelmɪt/', meaningVi: 'Mũ bảo hộ' },
      { word: 'mandatory', phonetic: '/ˈmændətɔːri/', meaningVi: 'Bắt buộc' },
      { word: 'assembly line', phonetic: '/əˈsembli laɪn/', meaningVi: 'Dây chuyền lắp ráp' },
    ],
  },
  {
    id: 'sh-en-03',
    langCode: 'en-US',
    topic: 'emergency',
    difficulty: 'advanced',
    targetRole: 'shift_leader',
    title: 'Emergency Stop Button Operation',
    targetText: 'In case of emergency, press the red emergency stop button immediately.',
    phonetic: '/ɪn keɪs əv ɪˈmɜːrdʒənsi pres ðə red ɪˈmɜːrdʒənsi stɑːp ˈbʌtn ɪˈmiːdiətli/',
    meaningVi: 'Trong trường hợp khẩn cấp, hãy nhấn ngay nút dừng khẩn cấp màu đỏ.',
    meaningEn: 'In case of emergency, press the red emergency stop button immediately.',
    factoryContext: 'Emergency machine shutdown procedure',
    slowSpeed: 0.75,
    normalSpeed: 1.0,
    keyVocabulary: [
      { word: 'emergency', phonetic: '/ɪˈmɜːrdʒənsi/', meaningVi: 'Khẩn cấp' },
      { word: 'stop button', phonetic: '/stɑːp ˈbʌtn/', meaningVi: 'Nút dừng' },
      { word: 'immediately', phonetic: '/ɪˈmiːdiətli/', meaningVi: 'Lập tức' },
    ],
  },
];
