/**
 * English Voice Router Service
 * Enforces strict en-US (American) vs en-GB (British) accent separation.
 * Maps raw IPA symbols to reference words to prevent TTS from reading Unicode symbol names.
 */

export interface EnglishSpeechOptions {
  text: string;
  accent: 'en-US' | 'en-GB';
  isIPASymbol?: boolean;
  speed?: number;
  pitch?: number;
  isSlow?: boolean;
}

export const IPA_SYMBOL_REFERENCE_MAP: Record<string, { word: string; ipaUS: string; meaningVi: string }> = {
  p: { word: 'pack', ipaUS: '/pæk/', meaningVi: 'Đóng gói' },
  '/p/': { word: 'pack', ipaUS: '/pæk/', meaningVi: 'Đóng gói' },
  b: { word: 'back', ipaUS: '/bæk/', meaningVi: 'Mặt sau' },
  '/b/': { word: 'back', ipaUS: '/bæk/', meaningVi: 'Mặt sau' },
  t: { word: 'tink', ipaUS: '/tɪŋk/', meaningVi: 'Tiếng lách cách' },
  '/t/': { word: 'tink', ipaUS: '/tɪŋk/', meaningVi: 'Tiếng lách cách' },
  d: { word: 'door', ipaUS: '/dɔːr/', meaningVi: 'Cửa xưởng' },
  '/d/': { word: 'door', ipaUS: '/dɔːr/', meaningVi: 'Cửa xưởng' },
  k: { word: 'key', ipaUS: '/kiː/', meaningVi: 'Chìa khóa' },
  '/k/': { word: 'key', ipaUS: '/kiː/', meaningVi: 'Chìa khóa' },
  g: { word: 'go', ipaUS: '/ɡəʊ/', meaningVi: 'Đi' },
  '/g/': { word: 'go', ipaUS: '/ɡəʊ/', meaningVi: 'Đi' },
  f: { word: 'fast', ipaUS: '/fæst/', meaningVi: 'Nhanh' },
  '/f/': { word: 'fast', ipaUS: '/fæst/', meaningVi: 'Nhanh' },
  v: { word: 'valve', ipaUS: '/vælv/', meaningVi: 'Van khí' },
  '/v/': { word: 'valve', ipaUS: '/vælv/', meaningVi: 'Van khí' },
  'θ': { word: 'think', ipaUS: '/θɪŋk/', meaningVi: 'Suy nghĩ' },
  '/θ/': { word: 'think', ipaUS: '/θɪŋk/', meaningVi: 'Suy nghĩ' },
  'ð': { word: 'this', ipaUS: '/ðɪs/', meaningVi: 'Cái này' },
  '/ð/': { word: 'this', ipaUS: '/ðɪs/', meaningVi: 'Cái này' },
  s: { word: 'seat', ipaUS: '/siːt/', meaningVi: 'Chỗ ngồi' },
  '/s/': { word: 'seat', ipaUS: '/siːt/', meaningVi: 'Chỗ ngồi' },
  z: { word: 'zip', ipaUS: '/zɪp/', meaningVi: 'Khóa kéo' },
  '/z/': { word: 'zip', ipaUS: '/zɪp/', meaningVi: 'Khóa kéo' },
  'ʃ': { word: 'sheet', ipaUS: '/ʃiːt/', meaningVi: 'Tấm kim loại' },
  '/ʃ/': { word: 'sheet', ipaUS: '/ʃiːt/', meaningVi: 'Tấm kim loại' },
  'ʒ': { word: 'measure', ipaUS: '/ˈmeʒ.ər/', meaningVi: 'Đo lường' },
  '/ʒ/': { word: 'measure', ipaUS: '/ˈmeʒ.ər/', meaningVi: 'Đo lường' },
  h: { word: 'heat', ipaUS: '/hiːt/', meaningVi: 'Nhiệt lượng' },
  '/h/': { word: 'heat', ipaUS: '/hiːt/', meaningVi: 'Nhiệt lượng' },
  m: { word: 'map', ipaUS: '/mæp/', meaningVi: 'Bản đồ' },
  '/m/': { word: 'map', ipaUS: '/mæp/', meaningVi: 'Bản đồ' },
  n: { word: 'net', ipaUS: '/net/', meaningVi: 'Lưới' },
  '/n/': { word: 'net', ipaUS: '/net/', meaningVi: 'Lưới' },
  'ŋ': { word: 'sing', ipaUS: '/sɪŋ/', meaningVi: 'Hát' },
  '/ŋ/': { word: 'sing', ipaUS: '/sɪŋ/', meaningVi: 'Hát' },
  l: { word: 'lead', ipaUS: '/liːd/', meaningVi: 'Dẫn đầu' },
  '/l/': { word: 'lead', ipaUS: '/liːd/', meaningVi: 'Dẫn đầu' },
  r: { word: 'run', ipaUS: '/rʌn/', meaningVi: 'Chạy máy' },
  '/r/': { word: 'run', ipaUS: '/rʌn/', meaningVi: 'Chạy máy' },
  w: { word: 'win', ipaUS: '/wɪn/', meaningVi: 'Thắng' },
  '/w/': { word: 'win', ipaUS: '/wɪn/', meaningVi: 'Thắng' },
  j: { word: 'yes', ipaUS: '/jes/', meaningVi: 'Đồng ý' },
  '/j/': { word: 'yes', ipaUS: '/jes/', meaningVi: 'Đồng ý' },
  'i:': { word: 'sheet', ipaUS: '/ʃiːt/', meaningVi: 'Tấm kim loại' },
  'iː': { word: 'sheet', ipaUS: '/ʃiːt/', meaningVi: 'Tấm kim loại' },
  '/i:/': { word: 'sheet', ipaUS: '/ʃiːt/', meaningVi: 'Tấm kim loại' },
  '/iː/': { word: 'sheet', ipaUS: '/ʃiːt/', meaningVi: 'Tấm kim loại' },
  'ɪ': { word: 'ship', ipaUS: '/ʃɪp/', meaningVi: 'Tàu hàng' },
  '/ɪ/': { word: 'ship', ipaUS: '/ʃɪp/', meaningVi: 'Tàu hàng' },
  e: { word: 'set', ipaUS: '/set/', meaningVi: 'Cài đặt' },
  '/e/': { word: 'set', ipaUS: '/set/', meaningVi: 'Cài đặt' },
  'æ': { word: 'cat', ipaUS: '/kæt/', meaningVi: 'Con mèo' },
  '/æ/': { word: 'cat', ipaUS: '/kæt/', meaningVi: 'Con mèo' },
  'ɑ:': { word: 'part', ipaUS: '/pɑːrt/', meaningVi: 'Linh kiện' },
  'ɑː': { word: 'part', ipaUS: '/pɑːrt/', meaningVi: 'Linh kiện' },
  '/ɑ:/': { word: 'part', ipaUS: '/pɑːrt/', meaningVi: 'Linh kiện' },
  '/ɑː/': { word: 'part', ipaUS: '/pɑːrt/', meaningVi: 'Linh kiện' },
  'ɒ': { word: 'box', ipaUS: '/bɑːks/', meaningVi: 'Hộp hàng' },
  '/ɒ/': { word: 'box', ipaUS: '/bɑːks/', meaningVi: 'Hộp hàng' },
  'ɔ:': { word: 'saw', ipaUS: '/sɔː/', meaningVi: 'Lưỡi cưa' },
  'ɔː': { word: 'saw', ipaUS: '/sɔː/', meaningVi: 'Lưỡi cưa' },
  '/ɔ:/': { word: 'saw', ipaUS: '/sɔː/', meaningVi: 'Lưỡi cưa' },
  '/ɔː/': { word: 'saw', ipaUS: '/sɔː/', meaningVi: 'Lưỡi cưa' },
  'ʊ': { word: 'put', ipaUS: '/pʊt/', meaningVi: 'Đặt vào' },
  '/ʊ/': { word: 'put', ipaUS: '/pʊt/', meaningVi: 'Đặt vào' },
  'u:': { word: 'boot', ipaUS: '/buːt/', meaningVi: 'Giày an toàn' },
  'uː': { word: 'boot', ipaUS: '/buːt/', meaningVi: 'Giày an toàn' },
  '/u:/': { word: 'boot', ipaUS: '/buːt/', meaningVi: 'Giày an toàn' },
  '/uː/': { word: 'boot', ipaUS: '/buːt/', meaningVi: 'Giày an toàn' },
  'ʌ': { word: 'cut', ipaUS: '/kʌt/', meaningVi: 'Cắt gọt' },
  '/ʌ/': { word: 'cut', ipaUS: '/kʌt/', meaningVi: 'Cắt gọt' },
  'ɜ:': { word: 'bird', ipaUS: '/bɜːrd/', meaningVi: 'Con chim' },
  'ɜː': { word: 'bird', ipaUS: '/bɜːrd/', meaningVi: 'Con chim' },
  '/ɜ:/': { word: 'bird', ipaUS: '/bɜːrd/', meaningVi: 'Con chim' },
  '/ɜː/': { word: 'bird', ipaUS: '/bɜːrd/', meaningVi: 'Con chim' },
  'ə': { word: 'about', ipaUS: '/əˈbaʊt/', meaningVi: 'Về việc' },
  '/ə/': { word: 'about', ipaUS: '/əˈbaʊt/', meaningVi: 'Về việc' },
};

class EnglishVoiceService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices().filter((v) => {
        const lang = v.lang.toLowerCase().replace('_', '-');
        return lang.startsWith('en');
      });
    }
  }

  public getAvailableVoices(accent: 'en-US' | 'en-GB'): SpeechSynthesisVoice[] {
    this.initVoices();
    return this.voices.filter((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return accent === 'en-US' ? l.startsWith('en-us') : l.startsWith('en-gb');
    });
  }

  public speakEnglish(options: EnglishSpeechOptions): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const { text, accent, isIPASymbol, speed = 1.0, pitch = 1.0, isSlow } = options;

      if (!text || text.trim() === '') {
        resolve({ success: false, error: 'Văn bản rỗng' });
        return;
      }

      // Convert raw IPA symbol (e.g., "/θ/") to reference word ("think")
      let textToSpeak = text.trim();
      if (isIPASymbol || IPA_SYMBOL_REFERENCE_MAP[textToSpeak]) {
        const mapped = IPA_SYMBOL_REFERENCE_MAP[textToSpeak];
        if (mapped) {
          textToSpeak = mapped.word;
        }
      }

      // Google Translate Online Audio Endpoint with target accent
      const cleanText = encodeURIComponent(textToSpeak);
      const onlineUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=${accent}&client=tw-ob`;

      try {
        const audio = new Audio(onlineUrl);
        audio.playbackRate = isSlow ? 0.75 : speed;
        audio.onended = () => resolve({ success: true });
        audio.onerror = () => {
          this.speakWebSpeechEnglish(textToSpeak, accent, speed, pitch, isSlow, resolve);
        };
        audio.play().catch(() => {
          this.speakWebSpeechEnglish(textToSpeak, accent, speed, pitch, isSlow, resolve);
        });
      } catch {
        this.speakWebSpeechEnglish(textToSpeak, accent, speed, pitch, isSlow, resolve);
      }
    });
  }

  private speakWebSpeechEnglish(
    text: string,
    accent: 'en-US' | 'en-GB',
    speed: number,
    pitch: number,
    isSlow: boolean | undefined,
    resolve: (res: { success: boolean; error?: string }) => void
  ) {
    if (!this.synth) {
      resolve({ success: false, error: 'Chưa hỗ trợ SpeechSynthesis trong trình duyệt' });
      return;
    }

    this.initVoices();
    const targetVoice = this.voices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return accent === 'en-US' ? l.startsWith('en-us') : l.startsWith('en-gb');
    });

    if (!targetVoice) {
      // Do NOT fallback across accents silently without notification
      resolve({ success: false, error: `Chưa có voice ${accent} phù hợp trong hệ thống` });
      return;
    }

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = targetVoice;
    utterance.lang = accent;
    utterance.rate = isSlow ? 0.75 : speed;
    utterance.pitch = pitch;

    utterance.onend = () => resolve({ success: true });
    utterance.onerror = (e) => resolve({ success: false, error: e.error || 'Lỗi phát âm' });

    this.synth.speak(utterance);
  }
}

export const englishVoiceService = new EnglishVoiceService();
