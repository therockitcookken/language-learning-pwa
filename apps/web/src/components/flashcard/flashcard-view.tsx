'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import { Layers, RotateCw, Volume2, Download, Upload, CheckCircle2, Flame } from 'lucide-react';

export function FlashcardView() {
  const { t } = useI18n();
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/flashcards?limit=50');
      const json = await res.json();
      if (json.data) {
        setCards(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const currentCard = cards[currentIndex];

  const handleRating = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    try {
      await fetch('/api/v1/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcardId: currentCard.id,
          rating,
        }),
      });
      setReviewCount((prev) => prev + 1);
    } catch {
      // Quiet fail
    }

    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1') {
        handleRating('again');
      } else if (e.key === '2') {
        handleRating('hard');
      } else if (e.key === '3') {
        handleRating('good');
      } else if (e.key === '4') {
        handleRating('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentCard]);

  const handleSpeak = (text: string) => {
    audioEngine.speak(text);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🎴</span> {t.flashcard}
          </h2>
          <p className="text-xs text-slate-400">
            Ôn tập thông minh bằng Thuật toán Spaced Repetition (SM-2). Phím tắt: [Phím Cách]: Lật thẻ, [1-4]: Đánh giá ghi nhớ.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>Đã ôn tập: {reviewCount} thẻ</span>
        </div>
      </div>

      {/* 3D Flip Card Stage */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Đang tải bộ thẻ...</div>
      ) : currentCard ? (
        <div className="space-y-6">
          {/* Card Counter Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>
              Thẻ số {currentIndex + 1} / {cards.length}
            </span>
            <span className="uppercase text-orange-400 font-bold">{currentCard.topic}</span>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[300px] bg-slate-900 border-2 ${
              isFlipped ? 'border-orange-500 shadow-orange-500/20' : 'border-slate-800'
            } rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl transition-all duration-300 hover:border-orange-400 relative overflow-hidden`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(currentCard.frontText);
                }}
                className="p-2.5 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Nghe phát âm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {!isFlipped ? (
              /* Front of Card */
              <div className="space-y-3">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  [Mặt trước - Phím Cách để Lật]
                </span>
                <h3 className="text-4xl font-extrabold text-white">{currentCard.frontText}</h3>
                {currentCard.pinyinOrIpa && (
                  <p className="text-base font-semibold text-orange-400">
                    {currentCard.pinyinOrIpa}
                  </p>
                )}
              </div>
            ) : (
              /* Back of Card */
              <div className="space-y-4 animate-fadeIn">
                <span className="text-xs text-orange-400 font-bold uppercase tracking-widest">
                  [Mặt sau - Nghĩa & Đáp án]
                </span>
                <p className="text-2xl font-black text-emerald-300 whitespace-pre-line">
                  {currentCard.backText}
                </p>
              </div>
            )}
          </div>

          {/* SM-2 Rating Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => handleRating('again')}
              className="py-3 px-4 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              <span>Phím 1: Quên (Again)</span>
              <span className="text-[10px] text-rose-400 font-normal">Ôn lại ngay</span>
            </button>

            <button
              onClick={() => handleRating('hard')}
              className="py-3 px-4 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              <span>Phím 2: Khó (Hard)</span>
              <span className="text-[10px] text-amber-400 font-normal">Ôn sau 1 ngày</span>
            </button>

            <button
              onClick={() => handleRating('good')}
              className="py-3 px-4 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              <span>Phím 3: Nhớ tốt (Good)</span>
              <span className="text-[10px] text-blue-400 font-normal">Ôn sau 6 ngày</span>
            </button>

            <button
              onClick={() => handleRating('easy')}
              className="py-3 px-4 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              <span>Phím 4: Rất dễ (Easy)</span>
              <span className="text-[10px] text-emerald-400 font-normal">Ôn sau 12 ngày</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400">
          Chưa có thẻ ghi nhớ. Bạn có thể thêm thẻ từ Từ điển!
        </div>
      )}
    </div>
  );
}
