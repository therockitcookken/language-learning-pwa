export interface WorkplaceDialogueItem {
  id: string;
  title: string;
  topic: string;
  language: 'zh' | 'en';
  turns: {
    speaker: string;
    zh?: string;
    pinyin?: string;
    textEn?: string;
    ipa?: string;
    translationVi: string;
  }[];
}

export const GRAMMAR_DIALOGUES_CATALOG: WorkplaceDialogueItem[] = [
  {
    id: 'diag-zh-01',
    title: 'Hội thoại gọi món tại nhà hàng (Ordering Food at a Restaurant)',
    topic: 'dining',
    language: 'zh',
    turns: [
      {
        speaker: "Phục vụ",
        zh: "您好，请问两位想吃点儿什么？",
        pinyin: "Nín hǎo, qǐngwèn liǎng wèi xiǎng chī diǎnr shénme?",
        translationVi: "Xin chào, xin hỏi hai vị muốn dùng món gì ạ?"
      },
      {
        speaker: "Thực khách",
        zh: "请把菜单拿过来，我们要一份北京烤鸭和两碗米饭。",
        pinyin: "Qǐng bǎ càidān ná guòlái, wǒmen yào yí fèn Běijīng kǎoyā hé liǎng wǎn mǐfàn.",
        translationVi: "Xin hãy mang thực đơn lại đây, chúng tôi muốn một phần vịt quay Bắc Kinh và hai bát cơm."
      },
      {
        speaker: "Phục vụ",
        zh: "好的，请稍等，菜马上就来。",
        pinyin: "Hǎo de, qǐng shāo děng, cài mǎshàng jiù lái.",
        translationVi: "Vâng ạ, xin đợi một chút, món ăn sẽ lên ngay."
      }
    ]
  },
  {
    id: 'diag-en-01',
    title: 'Checking into a Hotel in London',
    topic: 'travel',
    language: 'en',
    turns: [
      {
        speaker: "Receptionist",
        textEn: "Good afternoon! Welcome to the Grand Hotel. How can I help you?",
        ipa: "/ɡʊd ˌæftərˈnuːn ˈwelkəm tuː ðə ɡrænd hoʊˈtel haʊ kæn aɪ help juː/",
        translationVi: "Xin chào buổi chiều! Chào mừng quý khách đến với Grand Hotel. Tôi có thể giúp gì cho quý khách?"
      },
      {
        speaker: "Guest",
        textEn: "Hi! I have booked a double room for three nights under the name Smith.",
        ipa: "/haɪ aɪ hæv bʊkt ə ˈdʌbl ruːm fɔːr θriː naɪts ˈʌndər ðə neɪm smɪθ/",
        translationVi: "Chào bạn! Tôi đã đặt một phòng đôi trong ba đêm dưới tên Smith."
      },
      {
        speaker: "Receptionist",
        textEn: "Perfect. Your room has been prepared on the fifth floor.",
        ipa: "/ˈpɜːrfɪkt jʊər ruːm hæz biːn prɪˈperd ɑːn ðə fɪfθ flɔːr/",
        translationVi: "Tuyệt vời. Phòng của quý khách đã được chuẩn bị sẵn ở tầng 5."
      }
    ]
  }
];
