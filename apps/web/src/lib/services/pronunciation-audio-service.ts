import { chineseVoiceService } from './chinese-voice-service';
import { englishVoiceService } from './english-voice-service';
import { audioCacheService } from './audio-cache-service';

export interface AudioPlayOptions {
  text: string;
  langCode: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB';
  isPhonemeSymbol?: boolean;
  speed?: number;
  loopCount?: number;
  isSlow?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class PronunciationAudioService {
  private isPlaying: boolean = false;
  private currentTimeout: any = null;

  public playSound(options: AudioPlayOptions): Promise<boolean> {
    this.stop();

    const { text, langCode, isPhonemeSymbol, speed = 1.0, loopCount = 1, isSlow, onStart, onEnd } = options;
    this.isPlaying = true;
    if (onStart) onStart();

    return new Promise((resolve) => {
      let count = 0;
      const playNext = async () => {
        if (!this.isPlaying || count >= loopCount) {
          this.isPlaying = false;
          if (onEnd) onEnd();
          resolve(true);
          return;
        }

        if (langCode.startsWith('zh')) {
          await chineseVoiceService.speakChinese({
            text,
            isPhonemeSymbol,
            speed,
            isSlow,
          });
        } else {
          await englishVoiceService.speakEnglish({
            text,
            accent: langCode as 'en-US' | 'en-GB',
            isIPASymbol: isPhonemeSymbol,
            speed,
            isSlow,
          });
        }

        count++;

        if (count < loopCount) {
          const delay = Math.max(800, (text.length * 300) / speed);
          this.currentTimeout = setTimeout(playNext, delay);
        } else {
          const finishDelay = Math.max(500, (text.length * 200) / speed);
          this.currentTimeout = setTimeout(() => {
            this.isPlaying = false;
            if (onEnd) onEnd();
            resolve(true);
          }, finishDelay);
        }
      };

      playNext();
    });
  }

  public compareMinimalPair(
    textA: string,
    textB: string,
    langCode: 'zh-CN' | 'en-US' | 'en-GB',
    speed: number = 1.0,
    onStepChange?: (step: 'A' | 'B' | 'DONE') => void
  ): void {
    this.stop();
    this.isPlaying = true;

    if (onStepChange) onStepChange('A');
    this.playSound({ text: textA, langCode, speed, isPhonemeSymbol: false }).then(() => {
      if (!this.isPlaying) return;
      this.currentTimeout = setTimeout(() => {
        if (!this.isPlaying) return;
        if (onStepChange) onStepChange('B');
        this.playSound({ text: textB, langCode, speed, isPhonemeSymbol: false }).then(() => {
          this.isPlaying = false;
          if (onStepChange) onStepChange('DONE');
        });
      }, 1000);
    });
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
}

export const pronunciationAudioService = new PronunciationAudioService();
