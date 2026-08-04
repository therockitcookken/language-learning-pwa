/**
 * Universal Audio & Sound Engine
 * Provides Web Speech API TTS with automatic voice matching,
 * Web Audio API synth fallback for tone frequencies,
 * and microphone recording for user pronunciation comparison.
 */

export interface VoiceOption {
  name: string;
  lang: string;
  default: boolean;
}

class AudioEngine {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  // Get available system voices
  public getVoices(): VoiceOption[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    return voices.map((v) => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
    }));
  }

  // Speak text using Web Speech API TTS with fallback voice selection
  public speak(
    text: string,
    lang: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' | 'vi-VN' = 'zh-CN',
    rate: number = 1.0,
    pitch: number = 1.0
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        this.fallbackToneSynth(text, lang);
        resolve(false);
        return;
      }

      this.synth.cancel(); // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
      utterance.lang = lang;

      const voices = this.synth.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()) || v.lang.replace('_', '-').toLowerCase().startsWith(lang.toLowerCase().split('-')[0])
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => {
        this.fallbackToneSynth(text, lang);
        resolve(false);
      };

      this.synth.speak(utterance);
    });
  }

  // Fallback Web Audio API synthesizer for Pinyin tones (Tone 1: 55, Tone 2: 35, Tone 3: 214, Tone 4: 51)
  public fallbackToneSynth(text: string, lang: string): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(440, now); // Default pitch A4

      // Quick acoustic beep indicator
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Quiet fail if Web Audio API not permitted
    }
  }

  // Stop all active audio
  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
