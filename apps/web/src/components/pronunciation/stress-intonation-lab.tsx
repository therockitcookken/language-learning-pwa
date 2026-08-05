'use client';

import React, { useState } from 'react';
import { Volume2, Activity, Layers, Sparkles } from 'lucide-react';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

export function StressIntonationLab() {
  const factorySentences = [
    {
      id: 'st1',
      sentence: 'CHECK the SPINDLE SPEED and OIL SEAL.',
      phonetic: '/tʃek ðə ˈspɪn.dəl spiːd ænd ɔɪl siːl/',
      translationVi: 'Kiểm tra tốc độ trục chính và phớt dầu.',
      contentWords: ['CHECK', 'SPINDLE', 'SPEED', 'OIL', 'SEAL'],
      functionWords: ['the', 'and'],
      intonation: 'Falling Intonation (Câu mệnh lệnh khẩn cấp)',
    },
    {
      id: 'st2',
      sentence: 'Is the SAFETY VALVE OPEN?',
      phonetic: '/ɪz ðə ˈseɪf.ti vælv ˈəʊ.pən/',
      translationVi: 'Van an toàn đã được mở chưa?',
      contentWords: ['SAFETY', 'VALVE', 'OPEN'],
      functionWords: ['Is', 'the'],
      intonation: 'Rising Intonation (Câu hỏi Yes/No nâng giọng ở cuối)',
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = factorySentences[selectedIdx];

  const handlePlaySentence = () => {
    pronunciationAudioService.playSound({
      text: current.sentence,
      langCode: 'en-US',
      speed: 1.0,
    });
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-6 rounded-[4px] space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" /> 4. STRESS, RHYTHM & INTONATION LAB (TRỌNG ÂM & NGỮ ĐIỆU CÔNG XƯỞNG)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            Phân biệt từ chứa thông tin (Content Words) & Từ chức năng (Function Words), giảm âm Schwa /ə/ và nhịp điệu ngữ điệu.
          </p>
        </div>
      </div>

      <div className="bg-canvas-ink p-6 border border-whisper-border rounded space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-steel">CÂU MẪU CÔNG XƯỞNG</span>
          <span className="text-blue-400 font-bold">{current.intonation}</span>
        </div>

        {/* Highlighted Sentence Display */}
        <div className="text-2xl font-mono font-bold text-titanium-white bg-pure-surface p-4 border border-whisper-border rounded leading-relaxed">
          {current.sentence.split(' ').map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
            const isContent = current.contentWords.includes(cleanWord);
            return (
              <span
                key={i}
                className={`inline-block mr-2 px-1.5 py-0.5 rounded ${
                  isContent ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-black' : 'text-muted-steel font-normal'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>

        <div className="text-sm font-mono text-safety-orange font-bold">{current.phonetic}</div>
        <div className="text-xs font-sans text-muted-steel">{current.translationVi}</div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handlePlaySentence}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 active:translate-y-[1px] text-canvas-ink text-xs font-mono font-bold rounded inline-flex items-center gap-2 shadow"
          >
            <Volume2 className="w-4 h-4" /> PHÁT ÂM THEO NHỊP ĐIỆU
          </button>
        </div>
      </div>
    </div>
  );
}
