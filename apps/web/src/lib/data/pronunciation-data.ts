/**
 * Chinese Pinyin & English IPA Pronunciation Data
 */

export interface PronunciationAssetSeed {
  language: 'zh' | 'en';
  symbol: string;
  type: 'initial' | 'final' | 'tone' | 'vowel' | 'consonant';
  descriptionVi: string;
  mouthShapeImg?: string;
  tonguePosImg?: string;
  airflowGuide?: string;
  sampleAudio?: string;
  confusedWith?: string;
}

export const CHINESE_INITIALS: PronunciationAssetSeed[] = [
  { language: 'zh', symbol: 'b', type: 'initial', descriptionVi: 'Âm môi-môi, không bật hơi (giống "b" tiếng Việt)', airflowGuide: 'Khép hai môi rồi mở nhẹ, luồng hơi thoát ra tự nhiên.', confusedWith: 'p' },
  { language: 'zh', symbol: 'p', type: 'initial', descriptionVi: 'Âm môi-môi, BẬT HƠI MẠNH (giống "p" bật hơi)', airflowGuide: 'Khép hai môi, tích hơi rồi bật mạnh ra ngoài.', confusedWith: 'b' },
  { language: 'zh', symbol: 'm', type: 'initial', descriptionVi: 'Âm mũi (giống "m" tiếng Việt)', airflowGuide: 'Hai môi khép, luồng hơi thoát qua đường mũi.', confusedWith: 'f' },
  { language: 'zh', symbol: 'f', type: 'initial', descriptionVi: 'Âm răng-môi (giống "ph" tiếng Việt)', airflowGuide: 'Răng cửa trên chạm nhẹ môi dưới, đẩy hơi ra.', confusedWith: 'h' },
  { language: 'zh', symbol: 'd', type: 'initial', descriptionVi: 'Âm đầu lưỡi, không bật hơi (đọc giống "t" tiếng Việt)', airflowGuide: 'Đầu lưỡi chạm nướu trên rồi nhả nhẹ.', confusedWith: 't' },
  { language: 'zh', symbol: 't', type: 'initial', descriptionVi: 'Âm đầu lưỡi, BẬT HƠI MẠNH (đọc giống "th" bật hơi)', airflowGuide: 'Đầu lưỡi chạm nướu trên, bật mạnh luồng hơi.', confusedWith: 'd' },
  { language: 'zh', symbol: 'n', type: 'initial', descriptionVi: 'Âm mũi đầu lưỡi (giống "n" tiếng Việt)', airflowGuide: 'Đầu lưỡi áp nướu trên, hơi thoát qua mũi.', confusedWith: 'l' },
  { language: 'zh', symbol: 'l', type: 'initial', descriptionVi: 'Âm bên (giống "l" tiếng Việt)', airflowGuide: 'Đầu lưỡi chạm nướu trên, hơi thoát hai bên lưỡi.', confusedWith: 'n' },
  { language: 'zh', symbol: 'g', type: 'initial', descriptionVi: 'Âm gốc lưỡi, không bật hơi (giống "k" tiếng Việt)', airflowGuide: 'Gốc lưỡi chạm ngạc mềm rồi mở ra.', confusedWith: 'k' },
  { language: 'zh', symbol: 'k', type: 'initial', descriptionVi: 'Âm gốc lưỡi, BẬT HƠI MẠNH (giống "kh" tiếng Việt)', airflowGuide: 'Gốc lưỡi chạm ngạc mềm, bật hơi mạnh.', confusedWith: 'g' },
  { language: 'zh', symbol: 'h', type: 'initial', descriptionVi: 'Âm gốc lưỡi (giống "h" tiếng Việt nhẹ)', airflowGuide: 'Gốc lưỡi gần ngạc mềm, hơi xát ra nhẹ nhàng.', confusedWith: 'f' },
  { language: 'zh', symbol: 'j', type: 'initial', descriptionVi: 'Âm mặt lưỡi (giống "ch" nhẹ)', airflowGuide: 'Mặt lưỡi áp ngạc cứng rồi nhả ra.', confusedWith: 'q' },
  { language: 'zh', symbol: 'q', type: 'initial', descriptionVi: 'Âm mặt lưỡi, BẬT HƠI MẠNH (giống "ch" bật hơi)', airflowGuide: 'Mặt lưỡi áp ngạc cứng, đẩy hơi mạnh ra.', confusedWith: 'j' },
  { language: 'zh', symbol: 'x', type: 'initial', descriptionVi: 'Âm mặt lưỡi (giống "x" tiếng Việt)', airflowGuide: 'Mặt lưỡi nâng gần ngạc cứng, hơi xát qua.', confusedWith: 'sh' },
  { language: 'zh', symbol: 'zh', type: 'initial', descriptionVi: 'Âm uốn lưỡi, không bật hơi (giống "tr" uốn lưỡi)', airflowGuide: 'Đầu lưỡi uốn lên ngạc cứng rồi nhả.', confusedWith: 'z' },
  { language: 'zh', symbol: 'ch', type: 'initial', descriptionVi: 'Âm uốn lưỡi, BẬT HƠI MẠNH (giống "tr" bật hơi)', airflowGuide: 'Đầu lưỡi uốn lên ngạc cứng, bật hơi mạnh.', confusedWith: 'c' },
  { language: 'zh', symbol: 'sh', type: 'initial', descriptionVi: 'Âm uốn lưỡi (giống "s" nặng uốn lưỡi)', airflowGuide: 'Đầu lưỡi uốn gần ngạc cứng, hơi xát ra.', confusedWith: 's' },
  { language: 'zh', symbol: 'r', type: 'initial', descriptionVi: 'Âm uốn lưỡi (giống "r" tiếng Việt)', airflowGuide: 'Đầu lưỡi uốn lên, dây thanh rung.', confusedWith: 'l' },
  { language: 'zh', symbol: 'z', type: 'initial', descriptionVi: 'Âm đầu răng, không bật hơi (giống "tr/ch" dẹp)', airflowGuide: 'Đầu lưỡi chạm răng dưới, hơi xát ra.', confusedWith: 'zh' },
  { language: 'zh', symbol: 'c', type: 'initial', descriptionVi: 'Âm đầu răng, BẬT HƠI MẠNH', airflowGuide: 'Đầu lưỡi chạm răng dưới, bật hơi mạnh.', confusedWith: 'ch' },
  { language: 'zh', symbol: 's', type: 'initial', descriptionVi: 'Âm đầu răng (giống "x" nhẹ)', airflowGuide: 'Đầu lưỡi gần răng dưới, hơi xát ra nhẹ.', confusedWith: 'sh' },
];

export const ENGLISH_IPA_ASSETS: PronunciationAssetSeed[] = [
  { language: 'en', symbol: '/i:/', type: 'vowel', descriptionVi: 'Nguyên âm dài (như trong "sheep", "machine")', airflowGuide: 'Khẩu hình dẹt như đang cười, kéo dài âm.', confusedWith: '/ɪ/' },
  { language: 'en', symbol: '/ɪ/', type: 'vowel', descriptionVi: 'Nguyên âm ngắn (như trong "ship", "fit")', airflowGuide: 'Khẩu hình mở nhẹ, phát âm thả lỏng ngắn.', confusedWith: '/i:/' },
  { language: 'en', symbol: '/æ/', type: 'vowel', descriptionVi: 'Nguyên âm bẹt A/E (như trong "cat", "safety")', airflowGuide: 'Mở rộng miệng cả chiều ngang lẫn chiều dọc.', confusedWith: '/e/' },
  { language: 'en', symbol: '/θ/', type: 'consonant', descriptionVi: 'Phụ âm th thổi hơi (như trong "think", "three")', airflowGuide: 'Đặt đầu lưỡi giữa hai hàm răng, thổi hơi ra nhẹ.', confusedWith: '/t/' },
  { language: 'en', symbol: '/ð/', type: 'consonant', descriptionVi: 'Phụ âm th hữu thanh (như trong "this", "that")', airflowGuide: 'Đặt đầu lưỡi giữa hai hàm răng, rung dây thanh.', confusedWith: '/d/' },
];
