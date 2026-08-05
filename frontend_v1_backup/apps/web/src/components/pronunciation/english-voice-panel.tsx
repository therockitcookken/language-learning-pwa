'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Sliders, Globe } from 'lucide-react';
import { englishVoiceService } from '@/lib/services/english-voice-service';

interface EnglishVoicePanelProps {
  accent: 'en-US' | 'en-GB';
  onAccentChange: (acc: 'en-US' | 'en-GB') => void;
  speed: number;
  onSpeedChange: (spd: number) => void;
  isSlow: boolean;
  onToggleSlow: (slow: boolean) => void;
}

export function EnglishVoicePanel({
  accent,
  onAccentChange,
  speed,
  onSpeedChange,
  isSlow,
  onToggleSlow,
}: EnglishVoicePanelProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const vList = englishVoiceService.getAvailableVoices(accent);
    setVoices(vList);
  }, [accent]);

  const handleTestVoice = () => {
    englishVoiceService.speakEnglish({
      text: 'Welcome to the Industrial English Pronunciation Studio.',
      accent,
      speed,
      isSlow,
    });
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-4 rounded-[4px] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-titanium-white uppercase flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-400" /> ENGLISH VOICE & ACCENT CONTROL
        </span>
        <button
          type="button"
          onClick={handleTestVoice}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-canvas-ink text-xs font-mono font-bold rounded flex items-center gap-1"
        >
          <Volume2 className="w-3.5 h-3.5" /> TEST VOICE ({accent === 'en-US' ? 'US' : 'UK'})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <span className="text-muted-steel block mb-1">CHỌN ACCENT MỤC TIÊU:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onAccentChange('en-US')}
              className={`flex-1 py-1.5 rounded border font-bold transition-all ${
                accent === 'en-US'
                  ? 'bg-blue-500 text-canvas-ink border-blue-500'
                  : 'bg-canvas-ink border-whisper-border text-muted-steel'
              }`}
            >
              🇺🇸 US (MỸ)
            </button>
            <button
              type="button"
              onClick={() => onAccentChange('en-GB')}
              className={`flex-1 py-1.5 rounded border font-bold transition-all ${
                accent === 'en-GB'
                  ? 'bg-indigo-500 text-canvas-ink border-indigo-500'
                  : 'bg-canvas-ink border-whisper-border text-muted-steel'
              }`}
            >
              🇬🇧 UK (ANH)
            </button>
          </div>
        </div>

        <div>
          <span className="text-muted-steel block mb-1">VOICE PROFILE KHẢ DỤNG:</span>
          <select className="w-full bg-canvas-ink border border-whisper-border text-titanium-white rounded p-1.5 text-xs font-mono">
            <option value="google-en-us">Google HQ ({accent})</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                🔊 {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-muted-steel block mb-1">TỐC ĐỘ PHÁT ÂM:</span>
          <button
            type="button"
            onClick={() => onToggleSlow(!isSlow)}
            className={`w-full py-1.5 rounded border font-bold transition-all ${
              isSlow
                ? 'bg-amber-500 text-canvas-ink border-amber-500'
                : 'bg-canvas-ink border-whisper-border text-muted-steel'
            }`}
          >
            {isSlow ? '🐢 GIỌNG CHẬM (SLOW 0.75x)' : '⚡ GIỌNG CHUẨN (STANDARD 1.0x)'}
          </button>
        </div>
      </div>
    </div>
  );
}
