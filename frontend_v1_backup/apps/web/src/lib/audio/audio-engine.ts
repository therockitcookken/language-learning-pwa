/**
 * Universal High-Quality Audio & Voice Engine
 * Provides Web Speech API TTS with automatic voice preloading,
 * free online fallback TTS (Google & Youdao Audio),
 * and multi-voice selection for Chinese & English.
 */

export interface VoiceOption {
  name: string;
  lang: string;
  displayName: string;
  gender?: 'female' | 'male';
}

class AudioEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeAudioEl: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  // Get categorized voice choices for UI selector
  public getVoices(): VoiceOption[] {
    this.loadVoices();
    const options: VoiceOption[] = [
      { name: 'google-zh-cn', lang: 'zh-CN', displayName: '🇨🇳 Tiếng Trung (Nữ Phổ Thông - Google High Quality)' },
      { name: 'youdao-zh-cn', lang: 'zh-CN', displayName: '🇨🇳 Tiếng Trung (Nam Phổ Thông - Youdao Audio)' },
      { name: 'google-zh-tw', lang: 'zh-TW', displayName: '🇹🇼 Tiếng Trung (Đài Loan - Google HQ)' },
      { name: 'google-en-us', lang: 'en-US', displayName: '🇺🇸 Tiếng Anh (Mỹ - Standard US)' },
      { name: 'google-en-gb', lang: 'en-GB', displayName: '🇬🇧 Tiếng Anh (Anh - British UK)' },
    ];

    // Append system voices if available
    this.voices.forEach((v) => {
      if (v.lang.startsWith('zh') || v.lang.startsWith('en')) {
        options.push({
          name: v.name,
          lang: v.lang,
          displayName: `🔊 ${v.name} (${v.lang})`,
        });
      }
    });

    return options;
  }

  // Speak text using Web Speech API with fallback online TTS
  public speak(
    text: string,
    lang: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' = 'zh-CN',
    rate: number = 1.0,
    pitch: number = 1.0,
    preferredVoiceName?: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!text || text.trim() === '') {
        resolve(false);
        return;
      }

      this.stop(); // Stop ongoing audio

      // 1. Try Online Free High-Quality TTS Fallback if requested or default
      if (preferredVoiceName === 'google-zh-cn' || preferredVoiceName === 'google-zh-tw' || preferredVoiceName === 'youdao-zh-cn' || preferredVoiceName === 'google-en-us' || preferredVoiceName === 'google-en-gb') {
        this.playOnlineTTS(text, lang, preferredVoiceName)
          .then((success) => {
            if (success) {
              resolve(true);
              return;
            }
            this.speakWebSpeech(text, lang, rate, pitch, preferredVoiceName, resolve);
          })
          .catch(() => {
            this.speakWebSpeech(text, lang, rate, pitch, preferredVoiceName, resolve);
          });
        return;
      }

      this.speakWebSpeech(text, lang, rate, pitch, preferredVoiceName, resolve);
    });
  }

  // Web Speech API execution
  private speakWebSpeech(
    text: string,
    lang: string,
    rate: number,
    pitch: number,
    preferredVoiceName: string | undefined,
    resolve: (res: boolean) => void
  ) {
    if (!this.synth) {
      this.playOnlineTTS(text, lang, 'google-fallback').then(resolve);
      return;
    }

    this.loadVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.6, Math.min(1.8, rate));
    utterance.pitch = Math.max(0.6, Math.min(1.4, pitch));
    utterance.lang = lang;

    // Pick specified voice or best matching lang voice
    let matchedVoice: SpeechSynthesisVoice | undefined;
    if (preferredVoiceName && !preferredVoiceName.startsWith('google') && !preferredVoiceName.startsWith('youdao')) {
      matchedVoice = this.voices.find((v) => v.name === preferredVoiceName);
    }
    if (!matchedVoice) {
      matchedVoice = this.voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(lang.toLowerCase()));
    }
    if (!matchedVoice && lang.startsWith('zh')) {
      matchedVoice = this.voices.find((v) => v.lang.toLowerCase().includes('zh') || v.lang.toLowerCase().includes('chinese'));
    }

    // STRICT CHECK FOR CHINESE: If no Chinese voice installed in browser, DO NOT fallback to Windows default English voice!
    if (lang.startsWith('zh') && (!matchedVoice || (!matchedVoice.lang.toLowerCase().includes('zh') && !matchedVoice.lang.toLowerCase().includes('chinese')))) {
      this.playOnlineTTS(text, lang, 'google-fallback').then(resolve);
      return;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.onend = () => resolve(true);
      utterance.onerror = () => {
        this.playOnlineTTS(text, lang, 'google-fallback').then(resolve);
      };
      this.synth.speak(utterance);
    } else {
      // Fallback to online TTS directly if browser has no native voice installed
      this.playOnlineTTS(text, lang, 'google-fallback').then(resolve);
    }
  }

  // High-Quality Free Online TTS Endpoint (Google Translate TTS & Youdao Audio API)
  private playOnlineTTS(text: string, lang: string, voiceType: string): Promise<boolean> {
    return new Promise((resolve) => {
      let ttsUrl = '';
      const cleanText = encodeURIComponent(text.trim());

      if (voiceType === 'youdao-zh-cn' || (lang.startsWith('zh') && voiceType === 'youdao')) {
        ttsUrl = `https://dict.youdao.com/dictvoice?le=zh&type=1&audio=${cleanText}`;
      } else if (lang.startsWith('zh')) {
        const targetLang = lang === 'zh-TW' ? 'zh-TW' : 'zh-CN';
        ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=${targetLang}&total=1&idx=0&client=tw-ob`;
      } else {
        const targetLang = lang.startsWith('en-GB') ? 'en-GB' : 'en-US';
        ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=${targetLang}&client=tw-ob`;
      }

      try {
        if (this.activeAudioEl) {
          this.activeAudioEl.pause();
        }
        const audio = new Audio(ttsUrl);
        this.activeAudioEl = audio;

        audio.onended = () => resolve(true);
        audio.onerror = () => resolve(false);
        audio.play().catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  // Stop all active speech / audio playback
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

export const audioEngine = new AudioEngine();
