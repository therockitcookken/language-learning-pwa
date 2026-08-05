'use client';

import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

export function EnglishMinimalPairTrainer() {
  const pairs = [
    {
      id: 'emp1',
      title: 'Nguyên âm dài vs Ngắn: /i:/ vs /ɪ/',
      wordA: 'seat',
      wordB: 'sit',
      phoneticA: '/siːt/',
      phoneticB: '/sɪt/',
      meaningViA: 'Chỗ ngồi',
      meaningViB: 'Ngồi xuống',
      correct: 'A',
      note: '/i:/ dẹt môi kéo dài, /ɪ/ mở nhẹ miệng thả lỏng âm cực ngắn.',
    },
    {
      id: 'emp2',
      title: 'Phụ âm th thổi vs /t/: /θ/ vs /t/',
      wordA: 'think',
      wordB: 'tink',
      phoneticA: '/θɪŋk/',
      phoneticB: '/tɪŋk/',
      meaningViA: 'Suy nghĩ / Đánh giá',
      meaningViB: 'Tiếng lách cách',
      correct: 'A',
      note: '/θ/ đặt đầu lưỡi giữa 2 răng thổi hơi. /t/ chạm nướu trên giật dứt khoát.',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

  const current = pairs[currentIdx];

  const handlePlayAB = () => {
    pronunciationAudioService.compareMinimalPair(current.wordA, current.wordB, 'en-US', 1.0);
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-6 rounded-[4px] space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" /> 3. ENGLISH MINIMAL-PAIR TRAINER (CẶP ÂM DỄ NHẦM TIẾNG ANH)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            Luyện tập nghe phân biệt các cặp âm IPA dễ gây nhầm lẫn trong tiếng Anh công nghiệp.
          </p>
        </div>
      </div>

      <div className="bg-canvas-ink p-6 border border-whisper-border rounded space-y-4 text-center">
        <div className="text-xs font-mono text-blue-400 font-bold uppercase">{current.title}</div>

        <button
          type="button"
          onClick={handlePlayAB}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:translate-y-[1px] text-canvas-ink text-xs font-mono font-bold rounded inline-flex items-center gap-2 shadow"
        >
          <Volume2 className="w-4 h-4" /> NGHE ĐỐI CHIẾU A ➔ B
        </button>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            type="button"
            onClick={() => setSelectedAnswer('A')}
            className={`p-4 rounded border text-center transition-all ${
              selectedAnswer === 'A'
                ? current.correct === 'A'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-rose-950/40 border-rose-500 text-rose-400 font-bold'
                : 'bg-pure-surface border-whisper-border text-titanium-white hover:border-blue-400'
            }`}
          >
            <div className="text-xs font-mono text-muted-steel">LỰA CHỌN A</div>
            <div className="text-2xl font-mono font-bold mt-1">{current.wordA}</div>
            <div className="text-xs font-mono text-blue-400 mt-0.5">{current.phoneticA}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAnswer('B')}
            className={`p-4 rounded border text-center transition-all ${
              selectedAnswer === 'B'
                ? current.correct === 'B'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-rose-950/40 border-rose-500 text-rose-400 font-bold'
                : 'bg-pure-surface border-whisper-border text-titanium-white hover:border-blue-400'
            }`}
          >
            <div className="text-xs font-mono text-muted-steel">LỰA CHỌN B</div>
            <div className="text-2xl font-mono font-bold mt-1">{current.wordB}</div>
            <div className="text-xs font-mono text-blue-400 mt-0.5">{current.phoneticB}</div>
          </button>
        </div>

        {selectedAnswer && (
          <div className="p-3 bg-pure-surface border border-whisper-border rounded text-xs font-mono text-left space-y-1">
            <div className="font-bold text-titanium-white flex items-center gap-1.5">
              {selectedAnswer === current.correct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              {selectedAnswer === current.correct ? 'CHÍNH XÁC!' : 'CHƯA ĐÚNG!'}
            </div>
            <p className="text-muted-steel">{current.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
