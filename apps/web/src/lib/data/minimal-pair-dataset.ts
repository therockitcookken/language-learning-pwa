/**
 * Production Minimal Pair Dataset
 * Covers Chinese (zh-CN) and English (en-US / en-GB) factory Minimal Pairs
 * Spanning 15 factory topics and 5 target workplace roles with zero hard-code in UI components.
 */

export type LanguageCode = 'zh-CN' | 'en-US' | 'en-GB';
export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';
export type FactoryTopic =
  | 'general'
  | 'safety'
  | 'production'
  | 'warehouse'
  | 'quality'
  | 'maintenance'
  | 'machinery'
  | 'shift'
  | 'attendance'
  | 'packaging'
  | 'logistics'
  | 'electrical'
  | 'mechanical'
  | 'emergency'
  | 'management';

export type TargetRole = 'worker' | 'technician' | 'qa_inspector' | 'safety_officer' | 'shift_leader';

export interface MinimalPairRecord {
  id: string;
  langCode: LanguageCode;
  topic: FactoryTopic;
  difficulty: DifficultyLevel;
  targetRole: TargetRole;
  title: string;
  symbolA: string;
  symbolB: string;
  wordA: string;
  wordB: string;
  phoneticA: string;
  phoneticB: string;
  hanziA?: string;
  hanziB?: string;
  meaningViA: string;
  meaningViB: string;
  meaningEnA?: string;
  meaningEnB?: string;
  correctAnswer: 'A' | 'B';
  distinctionNote: string;
  factoryContext: string;
  audioUrlA?: string;
  audioUrlB?: string;
}

export const MINIMAL_PAIR_DATASET: MinimalPairRecord[] = [
  // CHINESE MINIMAL PAIRS (zh-CN)
  {
    id: 'mp-zh-01',
    langCode: 'zh-CN',
    topic: 'safety',
    difficulty: 'beginner',
    targetRole: 'worker',
    title: 'Bật hơi vs Không bật hơi: [b] vs [p]',
    symbolA: 'b',
    symbolB: 'p',
    wordA: 'bā (八)',
    wordB: 'pā (趴)',
    phoneticA: 'bā',
    phoneticB: 'pā',
    hanziA: '八',
    hanziB: '趴',
    meaningViA: 'Số 8 / Kíp 8 tiếng',
    meaningViB: 'Nằm sấp / Tạm dừng',
    correctAnswer: 'A',
    distinctionNote: 'Âm [p] bật hơi mạnh làm đẩy tờ giấy trước miệng, âm [b] là âm không bật hơi.',
    factoryContext: '八小时工作制 (Kíp làm 8 tiếng) vs 趴在桌上 (Nằm sấp nghỉ ca)',
  },
  {
    id: 'mp-zh-02',
    langCode: 'zh-CN',
    topic: 'maintenance',
    difficulty: 'elementary',
    targetRole: 'technician',
    title: 'Uốn lưỡi vs Đầu răng: [zh] vs [z]',
    symbolA: 'zh',
    symbolB: 'z',
    wordA: 'zhū (猪)',
    wordB: 'zū (租)',
    phoneticA: 'zhū',
    phoneticB: 'zū',
    hanziA: '猪',
    hanziB: '租',
    meaningViA: 'Con heo',
    meaningViB: 'Thuê nhà / Thuê thiết bị',
    correctAnswer: 'A',
    distinctionNote: '[zh] uốn đầu lưỡi chạm vòm ngạc cứng, [z] dẹt lưỡi chạm mặt sau răng cửa dưới.',
    factoryContext: '租用电网 (Thuê điện lưới) vs 猪皮防护 (Đồ da bảo hộ)',
  },
  {
    id: 'mp-zh-03',
    langCode: 'zh-CN',
    topic: 'machinery',
    difficulty: 'intermediate',
    targetRole: 'technician',
    title: 'Bật hơi uốn lưỡi vs Đầu răng: [ch] vs [c]',
    symbolA: 'ch',
    symbolB: 'c',
    wordA: 'chī (吃)',
    wordB: 'cī (疵)',
    phoneticA: 'chī',
    phoneticB: 'cī',
    hanziA: '吃',
    hanziB: '疵',
    meaningViA: 'Ăn ca / Tiêu thụ',
    meaningViB: 'Tì vết / Lỗi linh kiện',
    correctAnswer: 'B',
    distinctionNote: '[ch] uốn lưỡi bật hơi mạnh, [c] dẹt lưỡi bật hơi thẳng qua kẽ răng.',
    factoryContext: '瑕疵件 (Linh kiện có tì vết) vs 吃饭 (Ăn ca)',
  },
  {
    id: 'mp-zh-04',
    langCode: 'zh-CN',
    topic: 'quality',
    difficulty: 'intermediate',
    targetRole: 'qa_inspector',
    title: 'Uốn lưỡi vs Xát dẹt: [sh] vs [s]',
    symbolA: 'sh',
    symbolB: 's',
    wordA: 'shī (师)',
    wordB: 'sī (思)',
    phoneticA: 'shī',
    phoneticB: 'sī',
    hanziA: '师',
    hanziB: '思',
    meaningViA: 'Kỹ sư / Thầy',
    meaningViB: 'Tư duy / Suy nghĩ',
    correctAnswer: 'A',
    distinctionNote: '[sh] uốn lưỡi xát ngạc cứng, [s] dẹt lưỡi xát nhẹ kẽ răng.',
    factoryContext: '工程师 (Kỹ sư nhà máy) vs 思考 (Suy nghĩ giải pháp)',
  },
  {
    id: 'mp-zh-05',
    langCode: 'zh-CN',
    topic: 'production',
    difficulty: 'beginner',
    targetRole: 'worker',
    title: 'Âm cuống lưỡi: [g] vs [k]',
    symbolA: 'g',
    symbolB: 'k',
    wordA: 'gē (哥)',
    wordB: 'kē (科)',
    phoneticA: 'gē',
    phoneticB: 'kē',
    hanziA: '哥',
    hanziB: '科',
    meaningViA: 'Anh / Đồng nghiệp',
    meaningViB: 'Khoa / Bội kỹ thuật',
    correctAnswer: 'B',
    distinctionNote: '[k] bật hơi mạnh từ cuống lưỡi, [g] âm không bật hơi.',
    factoryContext: '技术科 (Khoa kỹ thuật) vs 哥们 (Đồng nghiệp)',
  },
  {
    id: 'mp-zh-06',
    langCode: 'zh-CN',
    topic: 'warehouse',
    difficulty: 'elementary',
    targetRole: 'worker',
    title: 'Âm mũi vs Âm bên: [n] vs [l]',
    symbolA: 'n',
    symbolB: 'l',
    wordA: 'ná (拿)',
    wordB: 'lá (拉)',
    phoneticA: 'ná',
    phoneticB: 'lá',
    hanziA: '拿',
    hanziB: '拉',
    meaningViA: 'Lấy / Cầm hàng',
    meaningViB: 'Kéo hàng / Băng tải',
    correctAnswer: 'A',
    distinctionNote: '[n] luồng hơi thoát ra qua mũi, [l] luồng hơi thoát ra hai bên cạnh lưỡi.',
    factoryContext: '拿工具 (Lấy dụng cụ) vs 拉快车 (Kéo xe hàng)',
  },

  // ENGLISH MINIMAL PAIRS (en-US / en-GB)
  {
    id: 'mp-en-01',
    langCode: 'en-US',
    topic: 'safety',
    difficulty: 'beginner',
    targetRole: 'worker',
    title: 'Dental Fricative vs Alveolar Sibilant: /θ/ vs /s/',
    symbolA: '/θ/',
    symbolB: '/s/',
    wordA: 'think',
    wordB: 'sink',
    phoneticA: '/θɪŋk/',
    phoneticB: '/sɪŋk/',
    meaningViA: 'Suy nghĩ / Đánh giá',
    meaningViB: 'Bồn rửa / Chìm xuống',
    correctAnswer: 'A',
    distinctionNote: '/θ/ đặt đầu lưỡi giữa hai hàng răng, /s/ khép hai hàng răng thổi hơi.',
    factoryContext: 'Think safety first (Nghĩ đến an toàn trước) vs Wash sink (Bồn rửa tay xưởng)',
  },
  {
    id: 'mp-en-02',
    langCode: 'en-US',
    topic: 'maintenance',
    difficulty: 'intermediate',
    targetRole: 'technician',
    title: 'Labiodental vs Bilabial Plosive: /v/ vs /b/',
    symbolA: '/v/',
    symbolB: '/b/',
    wordA: 'valve',
    wordB: 'bulb',
    phoneticA: '/vælv/',
    phoneticB: '/bʌlb/',
    meaningViA: 'Van xả áp / Van khí',
    meaningViB: 'Bóng đèn chỉ thị',
    correctAnswer: 'A',
    distinctionNote: '/v/ răng cửa trên chạm môi dưới rung dây thanh, /b/ khép hai môi bọt hơi.',
    factoryContext: 'Safety pressure valve (Van áp suất an toàn) vs Indicator bulb (Bóng đèn báo)',
  },
  {
    id: 'mp-en-03',
    langCode: 'en-US',
    topic: 'quality',
    difficulty: 'elementary',
    targetRole: 'qa_inspector',
    title: 'Long Vowel vs Short Vowel: /i:/ vs /ɪ/',
    symbolA: '/i:/',
    symbolB: '/ɪ/',
    wordA: 'sheet',
    wordB: 'ship',
    phoneticA: '/ʃiːt/',
    phoneticB: '/ʃɪp/',
    meaningViA: 'Tờ khai / Tấm kim loại',
    meaningViB: 'Vận chuyển hàng',
    correctAnswer: 'A',
    distinctionNote: '/i:/ kéo dài khóe miệng mỉm cười, /ɪ/ âm ngắn thả lỏng cơ miệng.',
    factoryContext: 'Specification sheet (Tờ thông số kỹ thuật) vs Ship order (Gửi đơn hàng)',
  },
  {
    id: 'mp-en-04',
    langCode: 'en-US',
    topic: 'machinery',
    difficulty: 'intermediate',
    targetRole: 'technician',
    title: 'Open Vowel vs Mid Vowel: /æ/ vs /e/',
    symbolA: '/æ/',
    symbolB: '/e/',
    wordA: 'band',
    wordB: 'bend',
    phoneticA: '/bænd/',
    phoneticB: '/bend/',
    meaningViA: 'Băng tải / Dây đai',
    meaningViB: 'Uốn cong linh kiện',
    correctAnswer: 'B',
    distinctionNote: '/æ/ mở rộng miệng theo chiều dọc lẫn ngang, /e/ mở miệng vừa phải.',
    factoryContext: 'Conveyor belt band (Dây đai băng tải) vs Bend pipe (Uốn ống kim loại)',
  },
];
