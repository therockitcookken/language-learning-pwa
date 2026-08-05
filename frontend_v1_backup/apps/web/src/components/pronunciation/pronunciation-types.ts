import { PinyinRecord, IPARecord } from '@/lib/validation/pronunciation-schema';

export type PronunciationStudioMode = 'chinese_pinyin' | 'english_ipa' | 'practice_recorder';

export type ChineseSubFeature =
  | 'syllable_builder'
  | 'tone_pitch_lab'
  | 'minimal_pair_trainer'
  | 'articulation_studio'
  | 'shadowing_recorder';

export type EnglishSubFeature =
  | 'ipa_map'
  | 'accent_comparator'
  | 'minimal_pair_trainer'
  | 'stress_intonation_lab'
  | 'shadowing_recorder';

export type AccentType = 'en-US' | 'en-GB' | 'zh-CN' | 'zh-TW';

export interface AudioControlSettings {
  speed: number;
  loopCount: number;
  autoPlayNext: boolean;
  selectedVoice: string;
}

export interface RecordingState {
  isRecording: boolean;
  recordingTime: number;
  audioBlobUrl: string | null;
  audioBuffer: AudioBuffer | null;
}
