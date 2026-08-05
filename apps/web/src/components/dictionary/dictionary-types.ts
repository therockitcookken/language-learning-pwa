export type LanguageWorkspace = 'zh' | 'en' | 'bilingual';

export type ViewMode = 'grid_spacious' | 'grid_compact' | 'list' | 'table' | 'study' | 'compare';

export type SortOption =
  | 'default'
  | 'az'
  | 'za'
  | 'level_low_high'
  | 'level_high_low'
  | 'newest'
  | 'most_used'
  | 'learning_status';

export interface AdvancedFilterState {
  hskLevels: string[];
  toeicLevels: string[];
  factoryDomains: string[];
  partOfSpeech: string[];
  learningStatus: 'all' | 'unlearned' | 'learned' | 'needs_review';
  isSavedOnly: boolean;
  hasAudioOnly: boolean;
  hasExamplesOnly: boolean;
  isVerifiedOnly: boolean;
  accent: 'all' | 'us' | 'uk' | 'zh_cn' | 'zh_tw';
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  language: LanguageWorkspace;
  timestamp: number;
  isPinned?: boolean;
}

export interface PresetFilter {
  id: string;
  title: string;
  description: string;
  language: LanguageWorkspace;
  filters: Partial<AdvancedFilterState>;
}

export interface VocabularyItem {
  id: string;
  language: 'zh' | 'en';
  word: string;
  simplified?: string;
  traditional?: string;
  pinyin?: string;
  pinyinNumeric?: string;
  ipa?: string;
  partOfSpeech?: string;
  meaningVi: string;
  meaningEn?: string;
  hskLevel?: string | null;
  cefrLevel?: string | null;
  difficulty?: string;
  topic?: string;
  factoryDomain?: string;
  usageNotes?: string;
  examples?: Array<{
    id: string;
    sentenceZh?: string;
    pinyin?: string;
    sentenceEn?: string;
    sentenceVi?: string;
  }>;
  verified?: boolean;
  needsReview?: boolean;
}
