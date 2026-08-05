export interface ErrorLabItem {
  id: string;
  language: 'zh' | 'en';
  incorrectSentence: string;
  correctSentence: string;
  explanationVi: string;
  vietnameseMistakePattern: string;
  ruleCategory: string;
}

export const GRAMMAR_ERROR_LAB_CATALOG: ErrorLabItem[] = [
  {
    id: 'err-zh-01',
    language: 'zh',
    incorrectSentence: '我过马路要必须看红绿灯。',
    correctSentence: '我过马路必须看红绿灯。',
    explanationVi: 'Không chèn thừa từ "要" đứng trước "必须". 必须 (bìxū) đã bao hàm ý nghĩa bắt buộc theo luật giao thông.',
    vietnameseMistakePattern: 'Ghép từ lặp lèo do ảnh hưởng thói quen dịch tiếng Việt ("cần phải bắt buộc").',
    ruleCategory: 'Modal Adverbs (Phó từ năng nguyện)'
  },
  {
    id: 'err-zh-02',
    language: 'zh',
    incorrectSentence: '今天热比昨天。',
    correctSentence: '今天比昨天热。',
    explanationVi: 'Trong câu so sánh "比", cấu trúc bắt buộc phải là A + 比 + B + Tính từ (今天 + 比 + 昨天 + 热).',
    vietnameseMistakePattern: 'Đặt tính từ trước từ 比 theo phản xạ tiếng Việt ("Hôm nay nóng hơn hôm qua").',
    ruleCategory: 'Comparisons (Câu so sánh 比)'
  },
  {
    id: 'err-en-01',
    language: 'en',
    incorrectSentence: 'I have visited Tokyo last year.',
    correctSentence: 'I visited Tokyo last year.',
    explanationVi: 'Khi câu có thời gian quá khứ xác định rõ ràng như "last year", bắt buộc dùng Thì Quá khứ đơn (Past Simple), không dùng Present Perfect.',
    vietnameseMistakePattern: 'Dùng Present Perfect khi đã có mốc thời gian quá khứ xác định.',
    ruleCategory: 'Tense Confusion (Nhầm lẫn Thì tiếng Anh)'
  },
  {
    id: 'err-en-02',
    language: 'en',
    incorrectSentence: 'Turning left at the traffic light to find the bank.',
    correctSentence: 'Turn left at the traffic light to find the bank.',
    explanationVi: 'Câu hướng dẫn chỉ đường / mệnh lệnh trực tiếp phải bắt đầu bằng động từ nguyên mẫu (Base Verb), không dùng V-ing.',
    vietnameseMistakePattern: 'Dùng danh động từ V-ing ở đầu câu chỉ đường.',
    ruleCategory: 'Imperatives (Câu mệnh lệnh)'
  }
];
