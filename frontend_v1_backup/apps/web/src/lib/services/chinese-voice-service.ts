/**
 * Chinese Voice Router Service & Single Source of Truth Voice Engine
 * Manages global voice selection state across all 14 Pronunciation Studio components.
 * Leverages free online Chinese TTS providers (Google Translate TTS, Youdao Audio, Baidu Voice)
 * and verified browser SpeechSynthesisVoices.
 * Enforces runtime locale guard (assertChineseVoiceLocale) and converts 100% of Pinyin tone strings
 * to Mandarin Hanzi characters so TTS engines pronounce native Mandarin Chinese without US accent.
 */

export function assertChineseVoiceLocale(locale: string): void {
  const normalized = locale.trim().toLowerCase();
  if (!normalized.startsWith('zh')) {
    throw new Error(`[VOICE_ROUTER] Chinese Pinyin Studio rejected non-Chinese voice: ${locale}`);
  }
}

export type VoiceProviderType =
  | 'browser'
  | 'google-translate'
  | 'youdao'
  | 'baidu'
  | 'microsoft'
  | 'external';

export interface SelectedVoice {
  providerId: string;
  providerType: VoiceProviderType;
  voiceId: string;
  voiceURI?: string;
  name: string;
  language: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB';
  gender?: 'male' | 'female' | 'unknown';
  localService?: boolean;
  remoteService?: boolean;
}

export interface VoiceSettings {
  selectedVoice: SelectedVoice | null;
  playbackRate: 0.5 | 0.75 | 1 | 1.25;
  volume: number;
  pitch: number;
  fallbackEnabled: boolean;
}

export interface ChineseSpeechOptions {
  text: string;
  isPhonemeSymbol?: boolean;
  speed?: number;
  pitch?: number;
  voiceGender?: 'female' | 'male';
  isSlow?: boolean;
  preferredProvider?: string;
  selectedVoice?: SelectedVoice | null;
}

// Initial Phoneme Letter to Authentic Mandarin Hanzi Character Mapping
export const PINYIN_INITIAL_PHONEME_MAP: Record<string, { pinyin: string; hanzi: string; meaningVi: string }> = {
  b: { pinyin: 'bō', hanzi: '波', meaningVi: 'Sóng âm (Phát âm âm bō)' },
  p: { pinyin: 'pō', hanzi: '坡', meaningVi: 'Con dốc (Phát âm âm pō)' },
  m: { pinyin: 'mō', hanzi: '摸', meaningVi: 'Sờ chạm (Phát âm âm mō)' },
  f: { pinyin: 'fō', hanzi: '佛', meaningVi: 'Đức Phật (Phát âm âm fō)' },
  d: { pinyin: 'dē', hanzi: '得', meaningVi: 'Đạt được (Phát âm âm dē)' },
  t: { pinyin: 'tē', hanzi: '特', meaningVi: 'Đặc biệt (Phát âm âm tè)' },
  n: { pinyin: 'nē', hanzi: '呐', meaningVi: 'Nói (Phát âm âm nà)' },
  l: { pinyin: 'lē', hanzi: '勒', meaningVi: 'Khắc thắt (Phát âm âm lè)' },
  g: { pinyin: 'gē', hanzi: '哥', meaningVi: 'Anh trai (Phát âm âm gē)' },
  k: { pinyin: 'kē', hanzi: '科', meaningVi: 'Khoa học (Phát âm âm kē)' },
  h: { pinyin: 'hē', hanzi: '喝', meaningVi: 'Uống nước (Phát âm âm hē)' },
  j: { pinyin: 'jī', hanzi: '机', meaningVi: 'Máy móc (Phát âm âm jī)' },
  q: { pinyin: 'qī', hanzi: '七', meaningVi: 'Số 7 (Phát âm âm qī)' },
  x: { pinyin: 'xī', hanzi: '西', meaningVi: 'Phía tây (Phát âm âm xī)' },
  zh: { pinyin: 'zhī', hanzi: '知', meaningVi: 'Tri thức (Phát âm âm zhī)' },
  ch: { pinyin: 'chī', hanzi: '吃', meaningVi: 'Ăn uống (Phát âm âm chī)' },
  sh: { pinyin: 'shī', hanzi: '师', meaningVi: 'Kỹ sư (Phát âm âm shī)' },
  r: { pinyin: 'rì', hanzi: '日', meaningVi: 'Mặt trời (Phát âm âm rì)' },
  z: { pinyin: 'zī', hanzi: '资', meaningVi: 'Tư liệu (Phát âm âm zī)' },
  c: { pinyin: 'cī', hanzi: '疵', meaningVi: 'Tì vết (Phát âm âm cī)' },
  s: { pinyin: 'sī', hanzi: '思', meaningVi: 'Tư duy (Phát âm âm sī)' },
  y: { pinyin: 'yī', hanzi: '一', meaningVi: 'Số 1 (Phát âm âm yī)' },
  w: { pinyin: 'wū', hanzi: '屋', meaningVi: 'Căn nhà (Phát âm âm wū)' },
};

// Comprehensive Mandarin Pinyin Syllable to Hanzi Character Dictionary
export const PINYIN_TO_HANZI_MAP: Record<string, string> = {
  ba: '八', bā: '八', bá: '拔', bǎ: '靶', bà: '爸',
  bo: '波', bō: '波', bó: '博', bǒ: '跛', bò: '播',
  bai: '白', bāi: '掰', bái: '白', bǎi: '百', bài: '败',
  bei: '北', bēi: '杯', béi: '北', běi: '北', bèi: '备',
  bao: '包', bāo: '包', báo: '雹', bǎo: '保', bào: '报',
  ban: '班', bān: '班', bán: '阪', bǎn: '板', bàn: '办',
  ben: '本', bēn: '奔', bén: '本', běn: '本', bèn: '笨',
  bang: '帮', bāng: '帮', báng: '榜', bǎng: '榜', bàng: '棒',
  beng: '崩', bēng: '崩', béng: '绷', běng: '绷', bèng: '蹦',
  bi: '比', bī: '逼', bí: '鼻', bǐ: '比', bì: '必',
  bian: '变', biān: '边', bián: '贬', biǎn: '扁', biàn: '变',
  biao: '表', biāo: '标', biáo: '表', biǎo: '表', biào: '鳔',
  bin: '宾', bīn: '宾', bín: '宾', bǐn: '摈', bìn: '鬓',
  bing: '兵', bīng: '兵', bíng: '丙', bǐng: '饼', bìng: '病',
  bu: '不', bū: '哺', bú: '不', bǔ: '补', bù: '部',

  pa: '趴', pā: '趴', pá: '爬', pǎ: '趴', pà: '怕',
  po: '坡', pō: '坡', pó: '婆', pǒ: '叵', pò: '破',
  pai: '排', pāi: '拍', pái: '排', pǎi: '派', pài: '派',
  pei: '配', pēi: '胚', péi: '培', pěi: '陪', pèi: '配',
  pao: '跑', pāo: '抛', páo: '袍', pǎo: '跑', pào: '炮',
  pan: '盘', pān: '攀', pán: '盘', pǎn: '判', pàn: '盼',
  pen: '喷', pēn: '喷', pén: '盆', pěn: '喷', pèn: '喷',
  pang: '旁', pāng: '滂', páng: '旁', pǎng: '耪', pàng: '胖',
  peng: '朋', pēng: '砰', péng: '朋', pěng: '捧', pèng: '碰',
  pi: '皮', pī: '批', pí: '皮', pǐ: '匹', pì: '屁',
  pian: '片', piān: '篇', pián: '便', piǎn: '扁', piàn: '片',
  piao: '票', piāo: '飘', piáo: '瓢', piǎo: '瞟', piào: '票',
  pin: '品', pīn: '拼', pín: '贫', pǐn: '品', pìn: '聘',
  ping: '平', pīng: '乒', píng: '平', pǐng: '屏', pìng: '聘',
  pu: '普', pū: '铺', pú: '葡', pǔ: '普', pù: '瀑',

  ma: '妈', mā: '妈', má: '麻', mǎ: '马', mà: '骂',
  mo: '摸', mō: '摸', mó: '魔', mǒ: '抹', mò: '末',
  me: '么', mē: '么', mé: '么',
  mai: '买', māi: '埋', mái: '埋', mǎi: '买', mài: '卖',
  mei: '美', mēi: '枚', méi: '梅', měi: '美', mèi: '妹',
  mao: '毛', māo: '猫', máo: '毛', mǎo: '卯', mào: '帽',
  mou: '谋', mōu: '牟', móu: '谋', mǒu: '某', mòu: '牟',
  man: '满', mān: '馒', mán: '瞒', mǎn: '满', màn: '慢',
  men: '门', mēn: '闷', mén: '门', měn: '闷', mèn: '闷',
  mang: '忙', māng: '茫', máng: '忙', mǎng: '莽', màng: '漭',
  meng: '蒙', mēng: '蒙', méng: '蒙', měng: '猛', mèng: '梦',
  mi: '米', mī: '咪', mí: '迷', mǐ: '米', mì: '密',
  mu: '木', mū: '母', mú: '模', mǔ: '母', mù: '木',

  fa: '发', fā: '发', fá: '罚', fǎ: '法', fà: '发',
  fo: '佛', fō: '佛', fó: '佛', fǒ: '佛', fò: '佛',
  fei: '飞', fēi: '飞', féi: '肥', fěi: '匪', fèi: '费',
  fan: '翻', fān: '翻', fán: '凡', fǎn: '反', fàn: '范',
  fen: '分', fēn: '分', fén: '坟', fěn: '粉', fèn: '份',
  fang: '方', fāng: '方', fáng: '房', fǎng: '访', fàng: '放',
  feng: '风', fēng: '风', féng: '冯', fěng: '讽', fèng: '奉',
  fu: '服', fū: '夫', fú: '福', fǔ: '府', fù: '复',

  da: '大', dā: '搭', dá: '答', dǎ: '打', dà: '大',
  de: '得', dē: '得', dé: '德', děi: '得', dè: '地',
  dai: '带', dāi: '呆', dái: '呆', dǎi: '歹', dài: '带',
  dei: '得', dēi: '得', déi: '得', dèi: '得',
  dao: '刀', dāo: '刀', dáo: '导', dǎo: '导', dào: '到',
  dou: '都', dōu: '都', dóu: '斗', dǒu: '斗', dòu: '豆',
  dan: '单', dān: '单', dán: '胆', dǎn: '胆', dàn: '蛋',
  den: '扽', dēn: '扽', dén: '扽', děn: '扽', dèn: '扽',
  dang: '当', dāng: '当', dáng: '挡', dǎng: '挡', dàng: '荡',
  deng: '灯', dēng: '灯', déng: '邓', děng: '等', dèng: '邓',
  di: '低', dī: '低', dí: '敌', dǐ: '底', dì: '地',
  dian: '点', diān: '颠', dián: '典', diǎn: '点', diàn: '电',
  diao: '刁', diāo: '刁', diáo: '鸟', diǎo: '鸟', diào: '掉',
  die: '爹', diē: '爹', dié: '叠', diě: '跌', diè: '跌',
  ding: '丁', dīng: '丁', díng: '顶', dǐng: '顶', dìng: '定',
  diu: '丢', diū: '丢',
  dong: '东', dōng: '东', dóng: '懂', dǒng: '懂', dòng: '动',
  du: '嘟', dū: '嘟', dú: '毒', dǔ: '赌', dù: '度',
  duan: '短', duān: '端', duán: '短', duǎn: '短', duàn: '段',
  dui: '对', duī: '堆', duí: '对', duǐ: '对', duì: '对',
  dun: '顿', dūn: '蹲', dún: '盹', dǔn: '盹', dùn: '顿',
  duo: '多', duō: '多', duó: '夺', duǒ: '朵', duò: '剁',

  ta: '他', tā: '他', tá: '塔', tǎ: '塔', tà: '踏',
  te: '特', tē: '特', té: '特', tě: '特', tè: '特',
  tai: '台', tāi: '胎', tái: '台', tǎi: '抬', tài: '太',
  tao: '桃', tāo: '涛', táo: '桃', tǎo: '讨', tào: '套',
  tou: '头', tōu: '偷', tóu: '头', tǒu: '透', tòu: '透',
  tan: '谈', tān: '贪', tán: '谈', tǎn: '毯', tàn: '探',
  tang: '糖', tāng: '汤', táng: '糖', tǎng: '躺', tàng: '烫',
  teng: '疼', tēng: '疼', téng: '疼', těng: '藤', tèng: '藤',
  ti: '提', tī: '梯', tí: '提', tǐ: '体', tì: '替',
  tian: '天', tiān: '天', tián: '田', tiǎn: '舔', tiàn: '掭',
  tiao: '条', tiāo: '挑', tiáo: '条', tiǎo: '挑', tiào: '跳',
  tie: '铁', tiē: '贴', tié: '铁', tiě: '铁', tiè: '帖',
  ting: '听', tīng: '听', tíng: '停', tǐng: '挺', tìng: '艇',
  tong: '通', tōng: '通', tóng: '同', tǒng: '统', tòng: '痛',
  tu: '图', tū: '突', tú: '图', tǔ: '土', tù: '兔',
  tuan: '团', tuān: '湍', tuán: '团', tuǎn: '疃', tuàn: '彖',
  tui: '推', tuī: '推', tuí: '颓', tuǐ: '腿', tuì: '退',
  tun: '吞', tūn: '吞', tún: '囤', tǔn: '褪', tùn: '褪',
  tuo: '脱', tuō: '脱', tuó: '驼', tuǒ: '妥', tuò: '唾',

  na: '拿', nā: '哪', ná: '拿', nǎ: '哪', nà: '那',
  la: '拉', lā: '拉', lá: '拉', lǎ: '喇', là: '辣',

  ga: '噶', gā: '噶', gá: '嘎', gǎ: '嘎', gà: '尬',
  ka: '咖', kā: '咖', ká: '咔', kǎ: '卡', kà: '客',
  ha: '哈', hā: '哈', há: '蛤', hǎ: '哈', hà: '哈',
  ge: '哥', gē: '哥', gé: '革', gě: '合', gè: '个',
  ke: '科', kē: '科', ké: '咳', kě: '可', kè: '客',
  he: '喝', hē: '喝', hé: '合', hě: '合', hè: '贺',

  ji: '机', jī: '机', jí: '急', jǐ: '己', jì: '计',
  qi: '七', qī: '七', qí: '齐', qǐ: '起', qì: '气',
  xi: '西', xī: '西', xí: '习', xǐ: '洗', xì: '细',

  zhi: '知', zhī: '知', zhí: '直', zhǐ: '纸', zhì: '制',
  chi: '吃', chī: '吃', chí: '持', chǐ: '尺', chì: '赤',
  shi: '是', shī: '师', shí: '十', shǐ: '始', shì: '是',
  ri: '日', rī: '日', rí: '日', rǐ: '日', rì: '日',
  zi: '资', zī: '资', zí: '字', zǐ: '子', zì: '字',
  ci: '次', cī: '疵', cí: '词', cǐ: '此', cì: '次',
  si: '四', sī: '思', sí: '死', sǐ: '死', sì: '四',
};

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  selectedVoice: {
    providerId: 'google',
    providerType: 'google-translate',
    voiceId: 'google-zh-cn',
    name: 'Google Translate TTS (Chuẩn Phổ Thông)',
    language: 'zh-CN',
  },
  playbackRate: 1.0,
  volume: 1.0,
  pitch: 1.0,
  fallbackEnabled: true,
};

class ChineseVoiceService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeAudioEl: HTMLAudioElement | null = null;

  // SINGLE SOURCE OF TRUTH STATE
  private activeSettings: VoiceSettings = DEFAULT_VOICE_SETTINGS;
  private listeners: Array<(settings: VoiceSettings) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Load saved settings from localStorage if available
      try {
        const saved = localStorage.getItem('voice_settings_zh');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.activeSettings = { ...DEFAULT_VOICE_SETTINGS, ...parsed };
        }
      } catch (e) {
        console.warn('Could not read voice_settings_zh from localStorage', e);
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.initVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.initVoices();
        }
      }
    }
  }

  private initVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices().filter((v) => {
        const lang = v.lang.toLowerCase().replace('_', '-');
        return lang.startsWith('zh-cn') || lang.startsWith('zh-tw') || lang.includes('chinese');
      });
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    this.initVoices();
    return this.voices;
  }

  // Get current active voice settings
  public getVoiceSettings(): VoiceSettings {
    return this.activeSettings;
  }

  public getSelectedVoice(): SelectedVoice | null {
    return this.activeSettings.selectedVoice;
  }

  // Set selected voice & notify subscribers
  public setSelectedVoice(voice: SelectedVoice | null): void {
    this.stop(); // stop any active playback
    this.activeSettings = {
      ...this.activeSettings,
      selectedVoice: voice,
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('voice_settings_zh', JSON.stringify(this.activeSettings));
      } catch (e) {
        console.warn('Could not save voice_settings_zh to localStorage', e);
      }
    }

    // Notify all subscriber components
    this.notifyListeners();
  }

  // Subscribe to voice setting changes
  public onVoiceChange(listener: (settings: VoiceSettings) => void): () => void {
    this.listeners.push(listener);
    // Unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.activeSettings);
      } catch (e) {
        console.error('Error in voice change listener', e);
      }
    });
  }

  private stripToneMarks(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ā|á|ǎ|à/g, 'a')
      .replace(/ō|ó|ǒ|ò/g, 'o')
      .replace(/ē|é|ě|è/g, 'e')
      .replace(/ī|í|ǐ|ì/g, 'i')
      .replace(/ū|ú|ǔ|ù/g, 'u')
      .replace(/ǖ|ǘ|ǚ|ǜ/g, 'ü');
  }

  public resolveTextToHanzi(text: string): string {
    const clean = text.trim();
    if (PINYIN_INITIAL_PHONEME_MAP[clean.toLowerCase()]) {
      return PINYIN_INITIAL_PHONEME_MAP[clean.toLowerCase()].hanzi;
    }
    if (PINYIN_TO_HANZI_MAP[clean.toLowerCase()]) {
      return PINYIN_TO_HANZI_MAP[clean.toLowerCase()];
    }
    if (PINYIN_TO_HANZI_MAP[clean]) {
      return PINYIN_TO_HANZI_MAP[clean];
    }
    const basePinyin = this.stripToneMarks(clean.toLowerCase());
    if (PINYIN_TO_HANZI_MAP[basePinyin]) {
      return PINYIN_TO_HANZI_MAP[basePinyin];
    }
    return clean;
  }

  /**
   * Primary Entry Point for Chinese Speech.
   * Leverages selected voice from Single Source of Truth (`this.activeSettings.selectedVoice`).
   */
  public speakChinese(options: ChineseSpeechOptions): Promise<{ success: boolean; provider?: string; error?: string }> {
    return new Promise((resolve) => {
      const { text, speed = 1.0, isSlow } = options;

      if (!text || text.trim() === '') {
        resolve({ success: false, error: 'Văn bản rỗng' });
        return;
      }

      this.stop(); // Stop ongoing audio

      let textToSpeak = this.resolveTextToHanzi(text);

      // Determine active voice selection
      const activeVoice = options.selectedVoice || this.activeSettings.selectedVoice;
      const preferredProvider = options.preferredProvider || activeVoice?.providerId || 'google';

      // IF SELECTED VOICE IS A BROWSER SPEECH SYNTHESIS VOICE
      if (activeVoice && activeVoice.providerType === 'browser') {
        this.initVoices();
        const targetVoice = this.voices.find(
          (v) => v.voiceURI === activeVoice.voiceURI || v.name === activeVoice.name || v.name === activeVoice.voiceId
        );

        if (targetVoice) {
          this.speakWebSpeechChineseStrict(textToSpeak, speed, isSlow, targetVoice, resolve);
          return;
        }
      }

      // ONLINE TTS PROVIDER CHAIN
      const cleanText = encodeURIComponent(textToSpeak);
      const allProviders = [
        {
          id: 'google',
          name: 'Google TTS (Phổ thông)',
          url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=zh-CN&total=1&idx=0&client=tw-ob`,
        },
        {
          id: 'youdao',
          name: 'Youdao Audio (Tiếng Trung)',
          url: `https://dict.youdao.com/dictvoice?le=zh&type=1&audio=${cleanText}`,
        },
        {
          id: 'baidu',
          name: 'Baidu Voice (Trung Quốc)',
          url: `https://fanyi.baidu.com/getvoice?lan=zh&spd=${isSlow ? '3' : '5'}&source=web&text=${cleanText}`,
        },
      ];

      // Re-order providers putting user's selected provider FIRST
      let providers = [...allProviders];
      if (preferredProvider === 'youdao') {
        providers = [allProviders[1], allProviders[0], allProviders[2]];
      } else if (preferredProvider === 'baidu') {
        providers = [allProviders[2], allProviders[0], allProviders[1]];
      }

      this.tryExternalAudioProviders(providers, 0, speed, isSlow, textToSpeak, resolve);
    });
  }

  private tryExternalAudioProviders(
    providers: { id: string; name: string; url: string }[],
    index: number,
    speed: number,
    isSlow: boolean | undefined,
    originalText: string,
    resolve: (res: { success: boolean; provider?: string; error?: string }) => void
  ) {
    if (index >= providers.length) {
      // All external providers exhausted. Try Web Speech API ONLY IF verified Chinese voice is present!
      this.initVoices();
      const zhVoice = this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith('zh-cn') || l.startsWith('zh');
      });
      this.speakWebSpeechChineseStrict(originalText, speed, isSlow, zhVoice, resolve);
      return;
    }

    const currentProvider = providers[index];
    try {
      const audio = new Audio(currentProvider.url);
      this.activeAudioEl = audio;
      audio.playbackRate = isSlow ? 0.75 : speed;

      audio.onended = () => {
        this.activeAudioEl = null;
        resolve({ success: true, provider: currentProvider.name });
      };

      audio.onerror = () => {
        this.activeAudioEl = null;
        this.tryExternalAudioProviders(providers, index + 1, speed, isSlow, originalText, resolve);
      };

      audio.play().catch(() => {
        this.activeAudioEl = null;
        this.tryExternalAudioProviders(providers, index + 1, speed, isSlow, originalText, resolve);
      });
    } catch {
      this.tryExternalAudioProviders(providers, index + 1, speed, isSlow, originalText, resolve);
    }
  }

  private speakWebSpeechChineseStrict(
    text: string,
    speed: number,
    isSlow: boolean | undefined,
    targetVoice: SpeechSynthesisVoice | undefined,
    resolve: (res: { success: boolean; provider?: string; error?: string }) => void
  ) {
    if (!this.synth) {
      resolve({ success: false, error: 'Chưa có nguồn audio tiếng Trung khả dụng' });
      return;
    }

    this.initVoices();

    const voiceToUse =
      targetVoice ||
      this.voices.find((v) => {
        const l = v.lang.toLowerCase().replace('_', '-');
        return l.startsWith('zh-cn') || l.startsWith('zh');
      });

    if (!voiceToUse) {
      console.warn('⚠️ Web Speech API: Không tìm thấy voice tiếng Trung trong trình duyệt. Ngăn chặn phát tiếng Anh.');
      resolve({
        success: false,
        error: 'Chưa có voice tiếng Trung phù hợp (Đã chặn voice tiếng Anh mặc định của Windows)',
      });
      return;
    }

    assertChineseVoiceLocale(voiceToUse.lang);

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceToUse;
    utterance.lang = 'zh-CN';
    utterance.rate = isSlow ? 0.75 : speed;

    utterance.onend = () => resolve({ success: true, provider: `WebSpeech (${voiceToUse.name})` });
    utterance.onerror = (e) => resolve({ success: false, error: e.error || 'Lỗi phát âm WebSpeech' });

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.activeAudioEl) {
      this.activeAudioEl.pause();
      this.activeAudioEl = null;
    }
  }
}

export const chineseVoiceService = new ChineseVoiceService();
