'use client';

import React, { useState } from 'react';
import { Volume2, ArrowRightLeft, Sparkles, Globe } from 'lucide-react';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

export function AccentComparator() {
  const targetWords = [
    { text: 'part', usIpa: '/pɑːrt/', ukIpa: '/pɑːt/', meaningVi: 'Linh kiện / Phụ tùng', note: 'Giọng Mỹ (US) phát rõ âm cuộn lưỡi /r/. Giọng Anh (UK) không phát âm /r/ ở cuối từ.' },
    { text: 'schedule', usIpa: '/ˈskedʒ.uːl/', ukIpa: '/ˈʃed.juːl/', meaningVi: 'Lịch làm việc / Tiến độ', note: 'Mỹ đọc âm đầu /sk/. Anh đọc âm đầu /ʃ/ (giống "sh").' },
    { text: 'process', usIpa: '/ˈprɑː.ses/', ukIpa: '/ˈprəʊ.ses/', meaningVi: 'Quy trình sản xuất', accentDiff: 'Nguyên âm /ɑː/ Mỹ vs /əʊ/ Anh' },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeAccent, setActiveAccent] = useState<'en-US' | 'en-GB' | null>(null);

  const current = targetWords[currentIdx];

  const handlePlayAccent = (acc: 'en-US' | 'en-GB') => {
    setActiveAccent(acc);
    pronunciationAudioService.playSound({
      text: current.text,
      langCode: acc,
      speed: 1.0,
      onEnd: () => setActiveAccent(null),
    });
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-6 rounded-[4px] space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" /> 2. US–UK ACCENT COMPARATOR (SO SÁNH GIỌNG MỸ VS ANH)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            So sánh sự khác biệt ngữ âm IPA và âm thanh thực tế giữa giọng Anh-Mỹ (US) và Anh-Anh (UK).
          </p>
        </div>
      </div>

      <div className="bg-canvas-ink p-6 border border-whisper-border rounded text-center space-y-4">
        <div className="text-xs font-mono text-muted-steel uppercase">TỪ THỬ NGHIỆM ĐỐI CHIẾU ACCENT</div>
        <div className="text-4xl font-mono font-bold text-titanium-white">{current.text}</div>
        <div className="text-xs font-sans text-safety-orange font-bold">{current.meaningVi}</div>

        {/* Dual Accent Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {/* US Column */}
          <div className="bg-pure-surface p-4 border border-blue-500/40 rounded space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400 font-bold">🇺🇸 GIỌNG ANH - MỸ (US)</span>
              <button
                type="button"
                onClick={() => handlePlayAccent('en-US')}
                className="p-1.5 rounded bg-canvas-ink text-blue-400 hover:text-titanium-white border border-whisper-border"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-2xl font-mono font-bold text-titanium-white">{current.usIpa}</div>
            <button
              type="button"
              onClick={() => handlePlayAccent('en-US')}
              className={`w-full py-2 rounded text-xs font-mono font-bold transition-all ${
                activeAccent === 'en-US' ? 'bg-blue-500 text-canvas-ink' : 'bg-canvas-ink border border-whisper-border text-muted-steel hover:text-titanium-white'
              }`}
            >
              PHÁT ÂM US (MỸ)
            </button>
          </div>

          {/* UK Column */}
          <div className="bg-pure-surface p-4 border border-indigo-500/40 rounded space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-400 font-bold">🇬🇧 GIỌNG ANH - ANH (UK)</span>
              <button
                type="button"
                onClick={() => handlePlayAccent('en-GB')}
                className="p-1.5 rounded bg-canvas-ink text-indigo-400 hover:text-titanium-white border border-whisper-border"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-2xl font-mono font-bold text-titanium-white">{current.ukIpa}</div>
            <button
              type="button"
              onClick={() => handlePlayAccent('en-GB')}
              className={`w-full py-2 rounded text-xs font-mono font-bold transition-all ${
                activeAccent === 'en-GB' ? 'bg-indigo-500 text-canvas-ink' : 'bg-canvas-ink border border-whisper-border text-muted-steel hover:text-titanium-white'
              }`}
            >
              PHÁT ÂM UK (ANH)
            </button>
          </div>
        </div>

        {current.note && (
          <div className="p-3 bg-pure-surface border border-whisper-border rounded text-xs font-mono text-left text-muted-steel">
            <strong className="text-titanium-white">GHI CHÚ KHÁC BIỆT CẤU ÂM:</strong> {current.note}
          </div>
        )}
      </div>
    </div>
  );
}
