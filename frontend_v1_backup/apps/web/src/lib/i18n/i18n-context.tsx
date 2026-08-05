'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'vi' | 'zh-CN' | 'zh-TW' | 'en';

interface Translations {
  appName: string;
  tagline: string;
  dictionary: string;
  pronunciation: string;
  grammar: string;
  flashcard: string;
  quiz: string;
  learningPath: string;
  progress: string;
  admin: string;
  notebook: string;
  searchPlaceholder: string;
  safety: string;
  assembly: string;
  maintenance: string;
  quality: string;
  warehouse: string;
  login: string;
  guestMode: string;
  logout: string;
  streakDays: string;
  xpTotal: string;
  level: string;
  factoryMap: string;
}

const dictionaryTranslations: Record<LanguageCode, Translations> = {
  vi: {
    appName: 'Học Tiếng Trung & Tiếng Anh Công Xưởng',
    tagline: 'Ứng dụng học ngôn ngữ chuyên sâu cho kỹ thuật viên & công nhân nhà máy',
    dictionary: 'Từ điển Công xưởng',
    pronunciation: 'Luyện Phát âm',
    grammar: 'Ngữ pháp Nhà máy',
    flashcard: 'Thẻ ghi nhớ (SRS)',
    quiz: 'Kiểm tra & Quiz',
    learningPath: 'Lộ trình Học tập',
    progress: 'Thống kê Tiến độ',
    admin: 'Quản trị Admin',
    notebook: 'Sổ tay Cá nhân',
    searchPlaceholder: 'Nhập từ vựng, Pinyin, IPA hoặc nghĩa tiếng Việt...',
    safety: 'An toàn lao động',
    assembly: 'Dây chuyền sản xuất',
    maintenance: 'Bảo trì kỹ thuật',
    quality: 'Quản lý chất lượng (QC)',
    warehouse: 'Kho & Logistics',
    login: 'Đăng nhập',
    guestMode: 'Chế độ Khách',
    logout: 'Đăng xuất',
    streakDays: 'ngày liên tiếp',
    xpTotal: 'Điểm XP',
    level: 'Cấp độ',
    factoryMap: 'Bản đồ Nhà máy 2D',
  },
  'zh-CN': {
    appName: '工厂中英文学习 App',
    tagline: '面向工厂技术员与生产工人的专业语言学习平台',
    dictionary: '工厂词典',
    pronunciation: '发音练习',
    grammar: '工厂语法',
    flashcard: '记忆卡片',
    quiz: '测验与考核',
    learningPath: '学习路线',
    progress: '进度统计',
    admin: '后台管理',
    notebook: '个人笔记',
    searchPlaceholder: '输入词汇、拼音、IPA或越南语含义...',
    safety: '安全生产',
    assembly: '流水线生产',
    maintenance: '设备检修',
    quality: '质量管理 (QC)',
    warehouse: '仓库物流',
    login: '登录',
    guestMode: '游客模式',
    logout: '退出登录',
    streakDays: '天连续学习',
    xpTotal: '经验值 XP',
    level: '等级',
    factoryMap: '2D 工厂地图',
  },
  'zh-TW': {
    appName: '工廠中英文學習 App',
    tagline: '面向工廠技術員與生產工人的專業語言學習平台',
    dictionary: '工廠詞典',
    pronunciation: '發音練習',
    grammar: '工廠語法',
    flashcard: '記憶卡片',
    quiz: '測驗與考核',
    learningPath: '學習路線',
    progress: '進度統計',
    admin: '後台管理',
    notebook: '個人筆記',
    searchPlaceholder: '輸入詞彙、拼音、IPA或越南語含義...',
    safety: '安全生產',
    assembly: '流水線生產',
    maintenance: '設備檢修',
    quality: '質量管理 (QC)',
    warehouse: '倉庫物流',
    login: '登錄',
    guestMode: '遊客模式',
    logout: '退出登錄',
    streakDays: '天連續學習',
    xpTotal: '經驗值 XP',
    level: '等級',
    factoryMap: '2D 工廠地圖',
  },
  en: {
    appName: 'Industrial Mandarin & English Learning',
    tagline: 'Language learning platform engineered for factory technicians & operators',
    dictionary: 'Factory Dictionary',
    pronunciation: 'Pronunciation Drill',
    grammar: 'Industrial Grammar',
    flashcard: 'Flashcards (SRS)',
    quiz: 'Quizzes & Assessment',
    learningPath: 'Learning Path',
    progress: 'Progress & Stats',
    admin: 'Admin Console',
    notebook: 'Personal Notebook',
    searchPlaceholder: 'Search vocabulary, Pinyin, IPA or Vietnamese meaning...',
    safety: 'Workplace Safety',
    assembly: 'Assembly Line',
    maintenance: 'Equipment Maintenance',
    quality: 'Quality Control (QC)',
    warehouse: 'Warehouse & Logistics',
    login: 'Log In',
    guestMode: 'Guest Mode',
    logout: 'Log Out',
    streakDays: 'Day Streak',
    xpTotal: 'XP Points',
    level: 'Level',
    factoryMap: '2D Factory Map',
  },
};

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as LanguageCode;
    if (saved && ['vi', 'zh-CN', 'zh-TW', 'en'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = dictionaryTranslations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
