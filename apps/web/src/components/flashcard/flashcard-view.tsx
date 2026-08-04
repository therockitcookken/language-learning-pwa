'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import {
  Layers,
  Volume2,
  Flame,
  BarChart3,
  Shuffle,
  Play,
  Pause,
  Download,
  Upload,
  Sparkles,
} from 'lucide-react';

export function FlashcardView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'srs_deck' | 'custom_decks' | 'stats'>('srs_deck');
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  // Helper 1: Auto-Play Slideshow Mode
  const [isAutoPlay, setIsAutoPlay] = useState(false);

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

  // Helper 2: Auto-Play Loop
  useEffect(() => {
    if (!isAutoPlay || cards.length === 0) return;
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
      if (isFlipped) {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isAutoPlay, isFlipped, cards]);

  // Helper 3: Shuffle Deck
  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Helper 4: Export Flashcards CSV
  const handleExportFlashcards = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Mặt trước,Mặt sau,Phiên âm,Chủ đề']
        .concat(
          cards.map(
            (c) => `"${c.frontText}","${c.backText}","${c.pinyinOrIpa}","${c.topic}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flashcards_deck_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>🎴</span> {t.flashcard}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ôn tập lặp lại ngắt quãng (SM-2). Phím tắt: [Phím Cách] Lật thẻ, [1-4] Đánh giá.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setSubTab('srs_deck')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'srs_deck'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" /> Thẻ Lật Ôn Tập
          </button>
          <button
            onClick={() => setSubTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'stats'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1" /> Thống Kê Ghi Nhớ
          </button>
        </div>
      </div>

      {subTab === 'srs_deck' && (
        <div className="space-y-4">
          {/* Action Helper Toolbar */}
          <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-orange-400" /> Tráo Đổi Ngẫu Nhiên
              </button>

              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAutoPlay ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoPlay ? 'Tắt Tự Động' : 'Tự Động Trình Chạy'}
              </button>
            </div>

            <button
              onClick={handleExportFlashcards}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" /> Xuất Bộ Thẻ CSV
            </button>
          </div>

          {currentCard && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`w-full min-h-[320px] bg-slate-900 border-2 ${
                isFlipped ? 'border-orange-500 shadow-orange-500/20' : 'border-slate-800'
              } rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl transition-all duration-300 hover:border-orange-400 relative overflow-hidden`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioEngine.speak(currentCard.frontText);
                }}
                className="absolute top-4 right-4 p-3 bg-slate-800 hover:bg-orange-500 text-white rounded-2xl cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-xs text-slate-500 font-extrabold uppercase tracking-widest">
                    [Mặt trước - Phím Cách để Lật]
                  </span>
                  <h3 className="text-4xl font-black text-white">{currentCard.frontText}</h3>
                  {currentCard.pinyinOrIpa && (
                    <p className="text-base font-bold text-orange-400">{currentCard.pinyinOrIpa}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <span className="text-xs text-orange-400 font-extrabold uppercase tracking-widest">
                    [Mặt sau - Nghĩa & Đáp án]
                  </span>
                  <p className="text-2xl font-black text-emerald-300 whitespace-pre-line">
                    {currentCard.backText}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => handleRating('again')}
              className="py-3 px-4 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded-2xl font-extrabold text-xs flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>Phím 1: Quên (Again)</span>
              <span className="text-[10px] text-rose-400 font-normal">Ôn lại ngay</span>
            </button>

            <button
              onClick={() => handleRating('hard')}
              className="py-3 px-4 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 rounded-2xl font-extrabold text-xs flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>Phím 2: Khó (Hard)</span>
              <span className="text-[10px] text-amber-400 font-normal">Ôn sau 1 ngày</span>
            </button>

            <button
              onClick={() => handleRating('good')}
              className="py-3 px-4 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 rounded-2xl font-extrabold text-xs flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>Phím 3: Nhớ tốt (Good)</span>
              <span className="text-[10px] text-blue-400 font-normal">Ôn sau 6 ngày</span>
            </button>

            <button
              onClick={() => handleRating('easy')}
              className="py-3 px-4 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-2xl font-extrabold text-xs flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>Phím 4: Rất dễ (Easy)</span>
              <span className="text-[10px] text-emerald-400 font-normal">Ôn sau 12 ngày</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
