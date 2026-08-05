/**
 * Mandarin Pinyin Combination Whitelist Matrix & Vocabulary Data
 * Comprehensive lookup map for verified Pinyin combinations, bidirectional compatibility filtering,
 * zero initial support (Ø), and verified Hanzi vocabulary with Vietnamese factory contexts.
 */

export interface VerifiedToneEntry {
  tone: number; // 1, 2, 3, 4, 0 (neutral)
  pinyin: string; // e.g. "bān", "bǎn", "bàn"
  hanzi: string; // e.g. "班", "板", "办"
  meaningVi: string; // e.g. "Ca làm việc", "Tấm bảng / Khối", "Làm / Giải quyết"
  meaningEn?: string;
  factoryContext?: string; // e.g. "白班 (báibān - Ca ngày nhà máy)"
  exampleSentenceZh?: string;
  exampleSentenceVi?: string;
}

export interface SyllableComboData {
  initial: string; // "" for zero initial
  final: string;
  baseSyllable: string;
  verifiedTones: VerifiedToneEntry[];
}

export interface InitialGroup {
  category: string;
  categoryVi: string;
  items: { id: string; label: string; pinyin: string }[];
}

export interface FinalGroup {
  category: string;
  categoryVi: string;
  items: string[];
}

// All 21 Initials + Zero Initial ('none')
export const ALL_INITIAL_IDS = [
  'none', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'
];

export const INITIAL_GROUPS: InitialGroup[] = [
  {
    category: 'Zero Initial',
    categoryVi: 'Không thanh mẫu (Âm tiết tự do)',
    items: [{ id: 'none', label: 'Ø (Không thanh mẫu)', pinyin: '' }],
  },
  {
    category: 'Bilabial',
    categoryVi: 'Âm môi (Môi-môi)',
    items: [
      { id: 'b', label: 'b', pinyin: 'b' },
      { id: 'p', label: 'p', pinyin: 'p' },
      { id: 'm', label: 'm', pinyin: 'm' },
    ],
  },
  {
    category: 'Labiodental',
    categoryVi: 'Âm răng môi',
    items: [{ id: 'f', label: 'f', pinyin: 'f' }],
  },
  {
    category: 'Alveolar',
    categoryVi: 'Âm đầu lưỡi (Đầu lưỡi-nướu)',
    items: [
      { id: 'd', label: 'd', pinyin: 'd' },
      { id: 't', label: 't', pinyin: 't' },
      { id: 'n', label: 'n', pinyin: 'n' },
      { id: 'l', label: 'l', pinyin: 'l' },
    ],
  },
  {
    category: 'Velar',
    categoryVi: 'Âm cuống lưỡi (Gốc lưỡi)',
    items: [
      { id: 'g', label: 'g', pinyin: 'g' },
      { id: 'k', label: 'k', pinyin: 'k' },
      { id: 'h', label: 'h', pinyin: 'h' },
    ],
  },
  {
    category: 'Palatal',
    categoryVi: 'Âm mặt lưỡi (Mặt lưỡi-ngạc)',
    items: [
      { id: 'j', label: 'j', pinyin: 'j' },
      { id: 'q', label: 'q', pinyin: 'q' },
      { id: 'x', label: 'x', pinyin: 'x' },
    ],
  },
  {
    category: 'Retroflex',
    categoryVi: 'Âm uốn lưỡi (Đầu lưỡi cuộn)',
    items: [
      { id: 'zh', label: 'zh', pinyin: 'zh' },
      { id: 'ch', label: 'ch', pinyin: 'ch' },
      { id: 'sh', label: 'sh', pinyin: 'sh' },
      { id: 'r', label: 'r', pinyin: 'r' },
    ],
  },
  {
    category: 'Dental Sibilant',
    categoryVi: 'Âm đầu lưỡi thẳng',
    items: [
      { id: 'z', label: 'z', pinyin: 'z' },
      { id: 'c', label: 'c', pinyin: 'c' },
      { id: 's', label: 's', pinyin: 's' },
    ],
  },
];

export const ALL_FINALS = [
  'a', 'o', 'e', 'i', 'u', 'ü',
  'ai', 'ei', 'ao', 'ou', 'ia', 'ie', 'ua', 'uo', 'üe',
  'an', 'en', 'in', 'un', 'ün', 'ian', 'uan', 'üan',
  'ang', 'eng', 'ing', 'ong', 'iang', 'iong', 'uang',
  'er'
];

export const FINAL_GROUPS: FinalGroup[] = [
  { category: 'Single Vowels', categoryVi: 'Vận mẫu đơn', items: ['a', 'o', 'e', 'i', 'u', 'ü'] },
  { category: 'Compound Vowels', categoryVi: 'Vận mẫu kép', items: ['ai', 'ei', 'ao', 'ou', 'ia', 'ie', 'ua', 'uo', 'üe'] },
  { category: 'Front-Nasal', categoryVi: 'Vận mẫu mũi trước (-n)', items: ['an', 'en', 'in', 'un', 'ün', 'ian', 'uan', 'üan'] },
  { category: 'Back-Nasal', categoryVi: 'Vận mẫu mũi sau (-ng)', items: ['ang', 'eng', 'ing', 'ong', 'iang', 'iong', 'uang'] },
  { category: 'Special Vowels', categoryVi: 'Vận mẫu đặc biệt', items: ['er'] },
];

// Master Verified Pinyin Combination Whitelist Matrix
// Format: `${initial}_${final}` -> SyllableComboData
export const PINYIN_MATRIX: Record<string, SyllableComboData> = {
  // Zero Initial Combinations ('none' / '')
  'none_a': {
    initial: '', final: 'a', baseSyllable: 'a',
    verifiedTones: [
      { tone: 1, pinyin: 'ā', hanzi: '阿', meaningVi: 'A / Kính ngữ', meaningEn: 'Prefix for names' },
      { tone: 2, pinyin: 'á', hanzi: '啊', meaningVi: 'Hả? / Thế à?', meaningEn: 'Interjection of surprise' },
      { tone: 4, pinyin: 'à', hanzi: '啊', meaningVi: 'Được rồi / Ồ', meaningEn: 'Interjection of agreement' },
    ],
  },
  'none_an': {
    initial: '', final: 'an', baseSyllable: 'an',
    verifiedTones: [
      { tone: 1, pinyin: 'ān', hanzi: '安', meaningVi: 'An toàn / Yên tĩnh', meaningEn: 'Safe / Peaceful', factoryContext: '安全第一 (An toàn là trên hết)' },
      { tone: 4, pinyin: 'àn', hanzi: '案', meaningVi: 'Phương án / Hồ sơ', meaningEn: 'Plan / File', factoryContext: '方案 (Phương án sản xuất)' },
    ],
  },
  'none_ang': {
    initial: '', final: 'ang', baseSyllable: 'ang',
    verifiedTones: [
      { tone: 2, pinyin: 'áng', hanzi: '昂', meaningVi: 'Ngẩng cao / Đắt đỏ', meaningEn: 'High / Expensive', factoryContext: '昂贵 (Đắt đỏ)' },
    ],
  },
  'none_en': {
    initial: '', final: 'en', baseSyllable: 'en',
    verifiedTones: [
      { tone: 1, pinyin: 'ēn', hanzi: '恩', meaningVi: 'Ân huệ / Ơn nghĩa', meaningEn: 'Grace / Favor', factoryContext: '感恩 (Biết ơn)' },
    ],
  },
  'none_er': {
    initial: '', final: 'er', baseSyllable: 'er',
    verifiedTones: [
      { tone: 2, pinyin: 'ér', hanzi: '儿', meaningVi: 'Con cái / Hậu tố', meaningEn: 'Child / Son', factoryContext: '儿童 (Trẻ em)' },
      { tone: 3, pinyin: 'ěr', hanzi: '耳', meaningVi: 'Tai / Tai nghe bảo hộ', meaningEn: 'Ear / Earplug', factoryContext: '耳塞 (Nút nhét tai chống ồn)' },
      { tone: 4, pinyin: 'èr', hanzi: '二', meaningVi: 'Số 2 / Ca hai', meaningEn: 'Two / Second', factoryContext: '二班 (Ca 2 nhà máy)' },
    ],
  },
  'none_ao': {
    initial: '', final: 'ao', baseSyllable: 'ao',
    verifiedTones: [
      { tone: 1, pinyin: 'āo', hanzi: '凹', meaningVi: 'Lõm / Hõm vào', meaningEn: 'Concave', factoryContext: '凹槽 (Rãnh lõm linh kiện)' },
      { tone: 2, pinyin: 'áo', hanzi: '熬', meaningVi: 'Nấu nhừ / Thức đêm', meaningEn: 'Boil / Endure', factoryContext: '熬夜 (Thức đêm làm ca)' },
      { tone: 4, pinyin: 'ào', hanzi: '奥', meaningVi: 'Bí ẩn / Áo (Áo Môn)', meaningEn: 'Profound / Austria', factoryContext: '奥秘 (Bí ẩn kỹ thuật)' },
    ],
  },
  'none_ou': {
    initial: '', final: 'ou', baseSyllable: 'ou',
    verifiedTones: [
      { tone: 1, pinyin: 'ōu', hanzi: '欧', meaningVi: 'Châu Âu / Tiêu chuẩn Euro', meaningEn: 'Europe / Euro', factoryContext: '欧美标准 (Tiêu chuẩn Âu Mỹ)' },
      { tone: 3, pinyin: 'ǒu', hanzi: '偶', meaningVi: 'Tình cờ / Ngẫu nhiên', meaningEn: 'Accidental / Pair', factoryContext: '偶然 (Ngẫu nhiên sự cố)' },
    ],
  },

  // B Combinations
  'b_a': {
    initial: 'b', final: 'a', baseSyllable: 'ba',
    verifiedTones: [
      { tone: 1, pinyin: 'bā', hanzi: '八', meaningVi: 'Số 8 / Tám', meaningEn: 'Eight', factoryContext: '八小时工作制 (Kíp làm 8 tiếng)' },
      { tone: 2, pinyin: 'bá', hanzi: '拔', meaningVi: 'Rút / Rút phích cắm', meaningEn: 'Pull out', factoryContext: '拔掉插头 (Rút phích cắm điện)' },
      { tone: 3, pinyin: 'bǎ', hanzi: '把', meaningVi: 'Tay cầm / Cầm nắm', meaningEn: 'Handle / Hold', factoryContext: '门把手 (Tay nắm cửa nhà xưởng)' },
      { tone: 4, pinyin: 'bà', hanzi: '爸', meaningVi: 'Bố / Cha', meaningEn: 'Father' },
    ],
  },
  'b_o': {
    initial: 'b', final: 'o', baseSyllable: 'bo',
    verifiedTones: [
      { tone: 1, pinyin: 'bō', hanzi: '波', meaningVi: 'Sóng âm / Tần số sóng', meaningEn: 'Wave', factoryContext: '声波 (Sóng âm siêu thanh)' },
      { tone: 2, pinyin: 'bó', hanzi: '博', meaningVi: 'Bác học / Tiến sĩ', meaningEn: 'Doctorate', factoryContext: '博士 (Tiến sĩ kỹ thuật)' },
      { tone: 3, pinyin: 'bǒ', hanzi: '跛', meaningVi: 'Đi khập khiễng', meaningEn: 'Lame', factoryContext: '安全第一 (Chú ý an toàn)' },
      { tone: 4, pinyin: 'bò', hanzi: '播', meaningVi: 'Phát thanh / Broadcast', meaningEn: 'Broadcast', factoryContext: '广播 (Phát thanh xưởng)' },
    ],
  },
  'b_an': {
    initial: 'b', final: 'an', baseSyllable: 'ban',
    verifiedTones: [
      { tone: 1, pinyin: 'bān', hanzi: '班', meaningVi: 'Ca làm việc / Kíp sản xuất', meaningEn: 'Shift / Class', factoryContext: '早班 (Ca sáng nhà máy)' },
      { tone: 2, pinyin: 'bán', hanzi: '阪', meaningVi: 'Độ dốc / Sườn núi', meaningEn: 'Slope' },
      { tone: 3, pinyin: 'bǎn', hanzi: '板', meaningVi: 'Tấm bảng / Bo mạch / Tấm kim loại', meaningEn: 'Board / Plate', factoryContext: '电路板 (Bo mạch điện tử)' },
      { tone: 4, pinyin: 'bàn', hanzi: '办', meaningVi: 'Làm / Giải quyết / Văn phòng', meaningEn: 'Do / Office', factoryContext: '办公室 (Văn phòng nhà máy)' },
    ],
  },
  'b_ai': {
    initial: 'b', final: 'ai', baseSyllable: 'bai',
    verifiedTones: [
      { tone: 1, pinyin: 'bāi', hanzi: '掰', meaningVi: 'Bẻ / Tách ra', meaningEn: 'Break off', factoryContext: '掰开 (Bẻ tách linh kiện)' },
      { tone: 2, pinyin: 'bái', hanzi: '白', meaningVi: 'Màu trắng / Ca ngày', meaningEn: 'White / Day shift', factoryContext: '白班 (Ca làm ban ngày)' },
      { tone: 3, pinyin: 'bǎi', hanzi: '百', meaningVi: 'Hàng trăm', meaningEn: 'Hundred', factoryContext: '百分百 (Một trăm phần trăm)' },
      { tone: 4, pinyin: 'bài', hanzi: '败', meaningVi: 'Thất bại / Hỏng hóc', meaningEn: 'Fail / Defeat', factoryContext: '失败 (Thất bại / Lỗi)' },
    ],
  },
  'b_en': {
    initial: 'b', final: 'en', baseSyllable: 'ben',
    verifiedTones: [
      { tone: 1, pinyin: 'bēn', hanzi: '奔', meaningVi: 'Chạy nhanh / Hướng đến', meaningEn: 'Run / Dash', factoryContext: '奔赴 (Chạy tới xưởng)' },
      { tone: 3, pinyin: 'běn', hanzi: '本', meaningVi: 'Vốn dĩ / Sách hướng dẫn', meaningEn: 'Manual / Origin', factoryContext: '手册 (Sách tay kỹ thuật)' },
      { tone: 4, pinyin: 'bèn', hanzi: '笨', meaningVi: 'Vụng về / Thô kỉnh', meaningEn: 'Clumsy', factoryContext: '笨重 (Nặng nề cồng kềnh)' },
    ],
  },
  'b_ang': {
    initial: 'b', final: 'ang', baseSyllable: 'bang',
    verifiedTones: [
      { tone: 1, pinyin: 'bāng', hanzi: '帮', meaningVi: 'Giúp đỡ / Hỗ trợ', meaningEn: 'Help / Assist', factoryContext: '帮忙 (Hỗ trợ đồng nghiệp)' },
      { tone: 3, pinyin: 'bǎng', hanzi: '榜', meaningVi: 'Bảng xếp hạng / Danh sách', meaningEn: 'List / Board', factoryContext: '榜单 (Bảng thi đua ca)' },
      { tone: 4, pinyin: 'bàng', hanzi: '棒', meaningVi: 'Gậy / Xuất sắc / Giỏi', meaningEn: 'Great / Stick', factoryContext: '真棒 (Tốt lắm / Đạt chuẩn)' },
    ],
  },
  'b_ing': {
    initial: 'b', final: 'ing', baseSyllable: 'bing',
    verifiedTones: [
      { tone: 1, pinyin: 'bīng', hanzi: '兵', meaningVi: 'Binh lính / Nhân viên', meaningEn: 'Soldier / Operator', factoryContext: '标兵 (Nhân viên xuất sắc)' },
      { tone: 3, pinyin: 'bǐng', hanzi: '饼', meaningVi: 'Bánh / Đĩa tròn', meaningEn: 'Cake / Disc', factoryContext: '饼干 (Bánh ăn ca)' },
      { tone: 4, pinyin: 'bìng', hanzi: '病', meaningVi: 'Bệnh / Lỗi sự cố', meaningEn: 'Disease / Defect', factoryContext: '故障 (Sự cố hư hỏng)' },
    ],
  },

  // P Combinations
  'p_a': {
    initial: 'p', final: 'a', baseSyllable: 'pa',
    verifiedTones: [
      { tone: 1, pinyin: 'pā', hanzi: '趴', meaningVi: 'Nằm sấp', meaningEn: 'Lie prostrate' },
      { tone: 2, pinyin: 'pá', hanzi: '爬', meaningVi: 'Leo trèo / Bò', meaningEn: 'Climb / Crawl', factoryContext: '爬梯 (Leo thang kiểm tra)' },
      { tone: 4, pinyin: 'pà', hanzi: '怕', meaningVi: 'Sợ hãi / Chú ý', meaningEn: 'Fear', factoryContext: '只怕 (Chỉ sợ sự cố)' },
    ],
  },
  'p_o': {
    initial: 'p', final: 'o', baseSyllable: 'po',
    verifiedTones: [
      { tone: 1, pinyin: 'pō', hanzi: '坡', meaningVi: 'Con dốc / Độ nghiêng', meaningEn: 'Slope', factoryContext: '斜坡 (Độ nghiêng băng tải)' },
      { tone: 2, pinyin: 'pó', hanzi: '婆', meaningVi: 'Bà lão', meaningEn: 'Old woman' },
      { tone: 4, pinyin: 'pò', hanzi: '破', meaningVi: 'Rách / Vỡ / Hỏng', meaningEn: 'Broken / Damaged', factoryContext: '破损 (Đồ vật hỏng vỡ)' },
    ],
  },
  'p_an': {
    initial: 'p', final: 'an', baseSyllable: 'pan',
    verifiedTones: [
      { tone: 1, pinyin: 'pān', hanzi: '攀', meaningVi: 'Leo lên / Trèo cao', meaningEn: 'Climb / Scale', factoryContext: '攀登 (Nỗ lực tăng năng suất)' },
      { tone: 2, pinyin: 'pán', hanzi: '盘', meaningVi: 'Đĩa / Khay linh kiện / Cuộn dây', meaningEn: 'Tray / Disc', factoryContext: '托盘 (Khay hàng pallet)' },
      { tone: 4, pinyin: 'pàn', hanzi: '判', meaningVi: 'Phán đoán / Đánh giá', meaningEn: 'Judge / Decide', factoryContext: '判定 (Đánh giá đạt QC)' },
    ],
  },

  // D Combinations
  'd_a': {
    initial: 'd', final: 'a', baseSyllable: 'da',
    verifiedTones: [
      { tone: 1, pinyin: 'dā', hanzi: '搭', meaningVi: 'Bắt cầu / Ghép nối', meaningEn: 'Match / Pair', factoryContext: '搭配 (Phối hợp linh kiện)' },
      { tone: 2, pinyin: 'dá', hanzi: '答', meaningVi: 'Trả lời / Giải đáp', meaningEn: 'Answer', factoryContext: '答复 (Giải đáp thắc mắc)' },
      { tone: 3, pinyin: 'dǎ', hanzi: '打', meaningVi: 'Đánh / Bấm máy / Đóng gói', meaningEn: 'Hit / Pack', factoryContext: '打包 (Đóng gói thành phẩm)' },
      { tone: 4, pinyin: 'dà', hanzi: '大', meaningVi: 'To / Lớn', meaningEn: 'Big / Large', factoryContext: '大件 (Hàng kích thước lớn)' },
    ],
  },
  'd_an': {
    initial: 'd', final: 'an', baseSyllable: 'dan',
    verifiedTones: [
      { tone: 1, pinyin: 'dān', hanzi: '单', meaningVi: 'Đơn hàng / Phiếu / Đơn chiếc', meaningEn: 'Order / Single', factoryContext: '订单 (Đơn đặt hàng sản xuất)' },
      { tone: 2, pinyin: 'dán', hanzi: '胆', meaningVi: 'Lòng can đảm / Dũng khí', meaningEn: 'Courage' },
      { tone: 3, pinyin: 'dǎn', hanzi: '胆', meaningVi: 'Dũng khí / Ruột bình', meaningEn: 'Gall / Courage', factoryContext: '胆量 (Lòng dũng cảm)' },
      { tone: 4, pinyin: 'dàn', hanzi: '蛋', meaningVi: 'Quả trứng / Đồ hình tròn', meaningEn: 'Egg / Round object' },
    ],
  },
  'd_ang': {
    initial: 'd', final: 'ang', baseSyllable: 'dang',
    verifiedTones: [
      { tone: 1, pinyin: 'dāng', hanzi: '当', meaningVi: 'Đảm nhận / Khi', meaningEn: 'Serve as / When', factoryContext: '当班 (Đang trong ca trực)' },
      { tone: 3, pinyin: 'dǎng', hanzi: '挡', meaningVi: 'Che chắn / Chắn gió / Cần số', meaningEn: 'Block / Shield', factoryContext: '挡板 (Tấm chắn bảo hộ)' },
      { tone: 4, pinyin: 'dàng', hanzi: '荡', meaningVi: 'Dao động / Sạch sẽ', meaningEn: 'Swing / Clean', factoryContext: '扫荡 (Dọn dẹp 5S)' },
    ],
  },

  // J, Q, X Combinations (Strictly compatible with i, ü, ian, iang, üe, ün)
  'j_i': {
    initial: 'j', final: 'i', baseSyllable: 'ji',
    verifiedTones: [
      { tone: 1, pinyin: 'jī', hanzi: '机', meaningVi: 'Máy móc / Thiết bị công xưởng', meaningEn: 'Machine', factoryContext: '机器 (Máy móc thiết bị)' },
      { tone: 2, pinyin: 'jí', hanzi: '急', meaningVi: 'Gấp / Cấp bách', meaningEn: 'Urgent', factoryContext: '紧急 (Khẩn cấp / Cấp báo)' },
      { tone: 3, pinyin: 'jǐ', hanzi: '己', meaningVi: 'Bản thân / Tự mình', meaningEn: 'Self', factoryContext: '自己 (Tự thân an toàn)' },
      { tone: 4, pinyin: 'jì', hanzi: '计', meaningVi: 'Kế hoạch / Đồng hồ đo', meaningEn: 'Plan / Meter', factoryContext: '计划 (Kế hoạch sản xuất)' },
    ],
  },
  'j_ian': {
    initial: 'j', final: 'ian', baseSyllable: 'jian',
    verifiedTones: [
      { tone: 1, pinyin: 'jiān', hanzi: '尖', meaningVi: 'Nhiệm vụ hàng đầu / Đầu nhọn', meaningEn: 'Point / Tip', factoryContext: '尖端 (Công nghệ tiên tiến)' },
      { tone: 3, pinyin: 'jiǎn', hanzi: '检', meaningVi: 'Kiểm tra / Kiểm định QC', meaningEn: 'Check / Inspect', factoryContext: '检查 (Kiểm tra chất lượng)' },
      { tone: 4, pinyin: 'jiàn', hanzi: '件', meaningVi: 'Linh kiện / Sản phẩm / Bộ', meaningEn: 'Piece / Component', factoryContext: '零件 (Linh kiện máy)' },
    ],
  },
  'j_ü': {
    initial: 'j', final: 'ü', baseSyllable: 'ju',
    verifiedTones: [
      { tone: 1, pinyin: 'jū', hanzi: '居', meaningVi: 'Cư trú / Nơi ở', meaningEn: 'Reside', factoryContext: '居住 (Nơi ở công nhân)' },
      { tone: 2, pinyin: 'jú', hanzi: '局', meaningVi: 'Cục / Cục diện / Văn phòng', meaningEn: 'Bureau', factoryContext: '局长 (Trưởng cục)' },
      { tone: 3, pinyin: 'jǔ', hanzi: '举', meaningVi: 'Nâng lên / Nâng cẩu', meaningEn: 'Lift / Raise', factoryContext: '举重 (Nâng hàng nặng)' },
      { tone: 4, pinyin: 'jù', hanzi: '具', meaningVi: 'Dụng cụ / Công cụ', meaningEn: 'Tool / Appliance', factoryContext: '工具 (Dụng cụ thao tác)' },
    ],
  },

  // ZH, CH, SH, R Combinations
  'zh_i': {
    initial: 'zh', final: 'i', baseSyllable: 'zhi',
    verifiedTones: [
      { tone: 1, pinyin: 'zhī', hanzi: '知', meaningVi: 'Tri thức / Biết', meaningEn: 'Know / Knowledge', factoryContext: '知识 (Kiến thức kỹ thuật)' },
      { tone: 2, pinyin: 'zhí', hanzi: '直', meaningVi: 'Trực tiếp / Thẳng', meaningEn: 'Direct / Straight', factoryContext: '直接 (Trực tiếp sản xuất)' },
      { tone: 3, pinyin: 'zhǐ', hanzi: '纸', meaningVi: 'Giấy / Tờ khai', meaningEn: 'Paper / Drawing', factoryContext: '图纸 (Bản vẽ kỹ thuật)' },
      { tone: 4, pinyin: 'zhì', hanzi: '制', meaningVi: 'Chế tạo / Quy chế', meaningEn: 'Manufacture / Rule', factoryContext: '制造 (Chế tạo nhà máy)' },
    ],
  },
  'ch_i': {
    initial: 'ch', final: 'i', baseSyllable: 'chi',
    verifiedTones: [
      { tone: 1, pinyin: 'chī', hanzi: '吃', meaningVi: 'Ăn / Tiêu thụ', meaningEn: 'Eat / Consume', factoryContext: '吃饭 (Ăn ca công nhân)' },
      { tone: 2, pinyin: 'chí', hanzi: '持', meaningVi: 'Duy trì / Giữ vững', meaningEn: 'Maintain / Hold', factoryContext: '保持 (Duy trì vệ sinh 5S)' },
      { tone: 3, pinyin: 'chǐ', hanzi: '尺', meaningVi: 'Thước đo / Quy thước', meaningEn: 'Ruler / Gauge', factoryContext: '卡尺 (Thước kẹp kĩ thuật)' },
      { tone: 4, pinyin: 'chì', hanzi: '赤', meaningVi: 'Đỏ / Nguyên chất', meaningEn: 'Red / Pure', factoryContext: '赤字 (Thâm hụt)' },
    ],
  },
  'sh_i': {
    initial: 'sh', final: 'i', baseSyllable: 'shi',
    verifiedTones: [
      { tone: 1, pinyin: 'shī', hanzi: '师', meaningVi: 'Thầy / Kỹ sư / Chuyên gia', meaningEn: 'Master / Engineer', factoryContext: '工程师 (Kỹ sư nhà máy)' },
      { tone: 2, pinyin: 'shí', hanzi: '十', meaningVi: 'Số 10 / Mười', meaningEn: 'Ten' },
      { tone: 3, pinyin: 'shǐ', hanzi: '始', meaningVi: 'Bắt đầu / Khởi đầu', meaningEn: 'Begin / Start', factoryContext: '开始 (Bắt đầu ca làm)' },
      { tone: 4, pinyin: 'shì', hanzi: '是', meaningVi: 'Phải / Đúng / Là', meaningEn: 'Yes / Be' },
    ],
  },
};

/**
 * Bidirectional Compatibility Lookups
 * If initial is null -> Return ALL finals
 * If final is null -> Return ALL initials
 */
export function getCompatibleFinals(initialId: string | null): string[] {
  if (initialId === null) {
    return ALL_FINALS;
  }

  const cleanInit = initialId === 'none' ? '' : initialId.trim().toLowerCase();
  const result = new Set<string>();

  Object.values(PINYIN_MATRIX).forEach((item) => {
    if (item.initial === cleanInit) {
      result.add(item.final);
    }
  });

  if (result.size === 0) {
    if (cleanInit === '') {
      return ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er'];
    }
    if (['j', 'q', 'x'].includes(cleanInit)) {
      return ['i', 'ü', 'ia', 'ie', 'ian', 'in', 'iang', 'ing', 'iong', 'üe', 'üan', 'ün'];
    }
    if (['b', 'p', 'm', 'f'].includes(cleanInit)) {
      return ['a', 'o', 'e', 'i', 'u', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ing'];
    }
    return ['a', 'e', 'i', 'u', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong'];
  }

  return Array.from(result);
}

export function getCompatibleInitials(final: string | null): string[] {
  if (final === null) {
    return ALL_INITIAL_IDS;
  }

  const cleanFin = final.trim().toLowerCase();
  const result = new Set<string>();

  Object.values(PINYIN_MATRIX).forEach((item) => {
    if (item.final === cleanFin) {
      result.add(item.initial === '' ? 'none' : item.initial);
    }
  });

  if (result.size === 0) {
    if (['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er'].includes(cleanFin)) {
      return ['none', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'];
    }
    if (['i', 'ian', 'iang', 'iao', 'ie', 'in', 'ing', 'iong'].includes(cleanFin)) {
      return ['b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x'];
    }
    if (['ü', 'üe', 'üan', 'ün'].includes(cleanFin)) {
      return ['n', 'l', 'j', 'q', 'x'];
    }
    return ALL_INITIAL_IDS;
  }

  return Array.from(result);
}

// Check if initial + final pair is valid
export function isValidPinyinPair(initialId: string | null, final: string | null): boolean {
  if (!initialId || !final) return false;
  const initId = initialId.toLowerCase();
  const init = initId === 'none' ? '' : initId;
  const fin = final.toLowerCase();
  const key1 = `${initId}_${fin}`;
  const key2 = `${init}_${fin}`;

  if (PINYIN_MATRIX[key1] || PINYIN_MATRIX[key2]) return true;

  // Zero initial rules
  if (init === '') {
    return ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er'].includes(fin);
  }

  // Phonotactic rules
  // Rule 1: f cannot combine with ü, i, or ong
  if (init === 'f' && (fin.includes('ü') || fin === 'ong' || fin === 'i')) return false;

  // Rule 2: j, q, x CANNOT combine with a, o, e, u, ai, ei, ao, ou, an, en, ang, eng, ong
  if (['j', 'q', 'x'].includes(init) && ['a', 'o', 'e', 'u', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong'].includes(fin)) {
    return false;
  }

  // Rule 3: ü can ONLY combine with n, l, j, q, x
  if (fin.includes('ü') && !['n', 'l', 'j', 'q', 'x'].includes(init)) {
    return false;
  }

  // Rule 4: er can ONLY be a zero-initial syllable
  if (fin === 'er' && init !== '') return false;

  return true;
}

// Retrieve verified syllable entry
export function getVerifiedSyllableCombo(initialId: string | null, final: string | null): SyllableComboData | null {
  if (!initialId || !final) return null;
  const initId = initialId.toLowerCase();
  const init = initId === 'none' ? '' : initId;
  const fin = final.toLowerCase();

  const key1 = `${initId}_${fin}`;
  const key2 = `${init}_${fin}`;

  return PINYIN_MATRIX[key1] || PINYIN_MATRIX[key2] || null;
}
