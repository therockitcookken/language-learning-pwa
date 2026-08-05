'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { chineseVoiceService, SelectedVoice } from '@/lib/services/chinese-voice-service';

interface ChineseVoicePanelProps {
  speed: number;
  onSpeedChange: (spd: number) => void;
  loopCount: number;
  onLoopChange: (lp: number) => void;
  isSlow: boolean;
  onToggleSlow: (slow: boolean) => void;
}

export function ChineseVoicePanel({
  speed,
  onSpeedChange,
  loopCount,
  onLoopChange,
  isSlow,
  onToggleSlow,
}: ChineseVoicePanelProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SelectedVoice | null>(null);
  const [lastStatus, setLastStatus] = useState<string>('');

  useEffect(() => {
    // 1. Fetch browser SpeechSynthesisVoices
    const vList = chineseVoiceService.getAvailableVoices();
    setVoices(vList);

    // 2. Read initial selected voice from Single Source of Truth
    setCurrentVoice(chineseVoiceService.getSelectedVoice());

    // 3. Subscribe to voice changes across the entire app
    const unsubscribe = chineseVoiceService.onVoiceChange((settings) => {
      setCurrentVoice(settings.selectedVoice);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleVoiceSelect = (val: string) => {
    if (val === 'google') {
      chineseVoiceService.setSelectedVoice({
        providerId: 'google',
        providerType: 'google-translate',
        voiceId: 'google-zh-cn',
        name: 'Google Translate TTS (Chuẩn Phổ Thông)',
        language: 'zh-CN',
      });
    } else if (val === 'youdao') {
      chineseVoiceService.setSelectedVoice({
        providerId: 'youdao',
        providerType: 'youdao',
        voiceId: 'youdao-zh',
        name: 'Youdao Audio API (Tiếng Trung Phổ Thông)',
        language: 'zh-CN',
      });
    } else if (val === 'baidu') {
      chineseVoiceService.setSelectedVoice({
        providerId: 'baidu',
        providerType: 'baidu',
        voiceId: 'baidu-zh',
        name: 'Baidu Voice TTS (Bắc Kinh Phổ Thông)',
        language: 'zh-CN',
      });
    } else {
      // Find matching browser voice
      const match = voices.find((v) => v.name === val || v.voiceURI === val);
      if (match) {
        chineseVoiceService.setSelectedVoice({
          providerId: 'browser',
          providerType: 'browser',
          voiceId: match.name,
          voiceURI: match.voiceURI,
          name: match.name,
          language: 'zh-CN',
          localService: match.localService,
        });
      }
    }
  };

  const handleTestVoice = async () => {
    setLastStatus('Đang phát thử audio tiếng Trung...');
    const res = await chineseVoiceService.speakChinese({
      text: '你好，欢迎来到中文发音学习中心。',
      speed,
      isSlow,
    });

    if (res.success) {
      setLastStatus(`✅ Đã phát thành công via ${res.provider || 'Chinese TTS Engine'}`);
    } else {
      setLastStatus(`⚠️ ${res.error || 'Lỗi phát âm'}`);
    }
  };

  // Determine current dropdown value
  const activeValue =
    currentVoice?.providerType === 'browser'
      ? currentVoice.voiceURI || currentVoice.name
      : currentVoice?.providerId || 'google';

  return (
    <div className="bg-pure-surface border border-whisper-border p-4 rounded-[4px] space-y-3 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-mono font-bold text-titanium-white uppercase flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-safety-orange" /> CHINESE VOICE ENGINE (NGUỒN GIỌNG PHÁT ÂM TIẾNG TRUNG)
        </span>
        <button
          type="button"
          onClick={handleTestVoice}
          className="px-3.5 py-1.5 bg-safety-orange hover:bg-orange-600 active:translate-y-[1px] text-canvas-ink text-xs font-mono font-bold rounded flex items-center gap-1.5 shadow transition-all"
        >
          <Volume2 className="w-3.5 h-3.5" /> TEST VOICE (NGHE THỬ GIỌNG TRUNG)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <span className="text-muted-steel block mb-1">NGUỒN VOICE TIẾNG TRUNG KẾT NỐI:</span>
          <select
            value={activeValue}
            aria-label="Chọn nguồn voice tiếng Trung kết nối"
            onChange={(e) => handleVoiceSelect(e.target.value)}
            className="w-full bg-canvas-ink border border-whisper-border text-titanium-white rounded p-1.5 text-xs font-mono font-bold"
          >
            <option value="google">🌐 Google Translate TTS (Khuyên dùng - Chuẩn Phổ Thông)</option>
            <option value="youdao">🇨🇳 Youdao Audio API (Tiếng Trung Phổ Thông)</option>
            <option value="baidu">🇨🇳 Baidu Voice TTS (Bắc Kinh Phổ Thông)</option>
            {voices.map((v) => (
              <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                🔊 {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-muted-steel block mb-1">TỐC ĐỘ PHÁT ÂM:</span>
          <div className="flex items-center gap-1">
            {[0.5, 0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-1 rounded border transition-all ${
                  speed === spd
                    ? 'bg-safety-orange text-canvas-ink border-safety-orange font-bold'
                    : 'bg-canvas-ink border-whisper-border text-muted-steel'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-muted-steel block mb-1">CHẾ ĐỘ TỐC ĐỘ CHẬM:</span>
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

      {currentVoice && (
        <div className="text-[11px] font-mono text-emerald-400 bg-canvas-ink p-2 border border-whisper-border rounded flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              ĐANG KÍCH HOẠT GIỌNG: <strong className="text-titanium-white">{currentVoice.name}</strong> ({currentVoice.providerType})
            </span>
          </div>
          <span className="text-muted-steel text-[10px]">ĐỒNG BỘ 100% MODULE</span>
        </div>
      )}

      {lastStatus && (
        <div className="text-[11px] font-mono text-amber-400 bg-canvas-ink p-2 border border-whisper-border rounded flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lastStatus}</span>
        </div>
      )}
    </div>
  );
}
