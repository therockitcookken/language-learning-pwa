'use client';

import React, { useState } from 'react';
import { Volume2, Activity, Sparkles, Layers } from 'lucide-react';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

export function TonePitchLab() {
  const [selectedTone, setSelectedTone] = useState<number>(1);

  const tones = [
    { id: 1, name: 'Thanh 1 (阴平)', curve: '55', path: 'M 30 40 L 370 40', desc: 'Cao & Bằng phẳng (High level 55)', example: 'mā (妈 - Mẹ)' },
    { id: 2, name: 'Thanh 2 (阳平)', curve: '35', path: 'M 30 140 Q 200 90 370 40', desc: 'Nâng giọng từ trung bình lên vút cao (3-5)', example: 'má (麻 - Vải đay)' },
    { id: 3, name: 'Thanh 3 (上声)', curve: '214', path: 'M 30 110 Q 180 200 370 70', desc: 'Trầm xuống đáy rồi nảy nhẹ lên (2-1-4)', example: 'mǎ (马 - Con ngựa)' },
    { id: 4, name: 'Thanh 4 (去声)', curve: '51', path: 'M 30 40 L 370 200', desc: 'Giật giọng dứt khoát từ cao nhất xuống thấp (5-1)', example: 'mà (骂 - Mắng)' },
  ];

  const current = tones.find((t) => t.id === selectedTone) || tones[0];

  const handlePlayTone = (syllable: string) => {
    pronunciationAudioService.playSound({
      text: syllable,
      langCode: 'zh-CN',
      speed: 1.0,
    });
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-6 rounded-[4px] space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Activity className="w-5 h-5 text-safety-orange" /> 2. TONE PITCH LAB (ĐỒ THỊ CAO ĐỘ 5 BẬC THANH ĐIỆU)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            Biểu diễn đường cao độ âm thanh 5 bậc chuẩn ngữ âm học Hán ngữ.
          </p>
        </div>
      </div>

      {/* Tone Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tones.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSelectedTone(t.id);
              handlePlayTone(t.example.split(' ')[0]);
            }}
            className={`p-3 rounded border text-left transition-all ${
              selectedTone === t.id
                ? 'bg-safety-orange text-canvas-ink border-safety-orange font-bold shadow-lg'
                : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
            }`}
          >
            <div className="text-xs font-mono font-bold">{t.name}</div>
            <div className="text-[10px] opacity-80 mt-0.5">Cực {t.curve}</div>
          </button>
        ))}
      </div>

      {/* 5-Level Pitch Curve Interactive Graph */}
      <div className="bg-canvas-ink border border-whisper-border p-6 rounded-[4px] space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-titanium-white font-bold">{current.name} - Pitch Curve [{current.curve}]</span>
          <span className="text-safety-orange">{current.desc}</span>
        </div>

        <div className="relative bg-pure-surface border border-whisper-border rounded p-4 h-56 flex items-center justify-center">
          {/* 5-Level Y Grid Lines */}
          <div className="absolute inset-y-4 left-8 right-4 flex flex-col justify-between text-[9px] font-mono text-muted-steel border-l border-whisper-border pl-2 pointer-events-none">
            <span>5 - Tối cao (High)</span>
            <span>4 - Cao (Mid-High)</span>
            <span>3 - Trung bình (Mid)</span>
            <span>2 - Thấp (Mid-Low)</span>
            <span>1 - Tối thấp (Low)</span>
          </div>

          <svg viewBox="0 0 400 220" className="w-full h-full">
            {/* Horizontal Grid lines */}
            <line x1="40" y1="20" x2="380" y2="20" stroke="#27272a" strokeDasharray="4 4" />
            <line x1="40" y1="65" x2="380" y2="65" stroke="#27272a" strokeDasharray="4 4" />
            <line x1="40" y1="110" x2="380" y2="110" stroke="#27272a" strokeDasharray="4 4" />
            <line x1="40" y1="155" x2="380" y2="155" stroke="#27272a" strokeDasharray="4 4" />
            <line x1="40" y1="200" x2="380" y2="200" stroke="#27272a" strokeDasharray="4 4" />

            {/* Dynamic Pitch Curve */}
            <path d={current.path} fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" className="transition-all duration-500" />
          </svg>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-steel">Ví dụ: <strong className="text-titanium-white">{current.example}</strong></span>
          <button
            type="button"
            onClick={() => handlePlayTone(current.example.split(' ')[0])}
            className="px-4 py-2 bg-safety-orange text-canvas-ink font-mono text-xs font-bold rounded flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" /> NGHE PHÁT ÂM
          </button>
        </div>
      </div>
    </div>
  );
}
