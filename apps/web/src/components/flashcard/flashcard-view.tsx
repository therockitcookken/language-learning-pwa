'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { SRSGrade } from '@/lib/domain/srs-engine';
import {
  Layers,
  BarChart3,
  Upload,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

import { FlashcardFilterBar, FlashcardFilters } from './flashcard-filter-bar';
import { FlashcardDeckPlayer, FlashcardItem } from './flashcard-deck-player';
import { SRSStatsDashboard } from './srs-stats-dashboard';
import { ImportExportModal } from './import-export-modal';
import { AnimatedButton, PageTransition } from '@/components/common/animations';
import { uiSounds } from '@/lib/audio/ui-sounds';

export function FlashcardView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'srs_deck' | 'stats'>('srs_deck');

  const [filters, setFilters] = useState<FlashcardFilters>({
    lang: 'zh',
    level: '',
    topic: '',
    pos: '',
    status: 'all',
    specialMode: '',
  });

  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lang: filters.lang,
        limit: '100',
      });
      if (filters.level) params.set('level', filters.level);
      if (filters.topic) params.set('topic', filters.topic);
      if (filters.pos) params.set('pos', filters.pos);
      if (filters.status) params.set('status', filters.status);
      if (filters.specialMode) params.set('specialMode', filters.specialMode);

      const res = await fetch(`/api/v1/flashcards?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setCards(json.data);
        if (json.dueCount !== undefined) {
          setDueCount(json.dueCount);
        } else {
          setDueCount(json.data.length);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [filters]);

  const handleRateCard = async (cardId: string, rating: SRSGrade) => {
    try {
      await fetch('/api/v1/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcardId: cardId,
          rating,
        }),
      });
    } catch {
      // Quiet fallback
    }
  };

  const handleToggleFavorite = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Module Title & Subtabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-800/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-orange-500/10 border-2 border-orange-500/20 text-orange-400 shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <span>Thẻ Ghi Nhớ (SRS)</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-2">
            <span>Thuật toán Lặp lại ngắt quãng SM-2 chuyên sâu cho Thuật ngữ Công xưởng.</span>
            <span className="text-[11px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/25 px-2.5 py-0.5 rounded-full shadow-sm">
              {filters.lang === 'zh' ? '10,000 Thẻ Tiếng Trung' : '10,000 Thẻ Tiếng Anh'}
            </span>
          </p>
        </div>

        {/* Header Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <AnimatedButton
            soundType="click"
            onClick={() => setIsImportExportOpen(true)}
            className="px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Upload className="w-3.5 h-3.5 text-orange-400" /> Nhập/Xuất Thẻ
          </AnimatedButton>

          <div className="flex items-center gap-1 bg-slate-900/80 border-2 border-slate-800 p-1 rounded-xl backdrop-blur-xl shadow-md">
            <AnimatedButton
              soundType="click"
              onClick={() => setSubTab('srs_deck')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold ${
                subTab === 'srs_deck'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" /> Thẻ Lật Ôn Tập
            </AnimatedButton>

            <AnimatedButton
              soundType="click"
              onClick={() => setSubTab('stats')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold ${
                subTab === 'stats'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Thống Kê
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Language Workspace Switcher */}
      <div className="flex justify-center mb-2">
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border-2 border-slate-800 shadow-xl backdrop-blur-xl flex items-center gap-1">
          <AnimatedButton
            soundType="click"
            onClick={() => setFilters({ ...filters, lang: 'zh', level: '', topic: '', pos: '', status: 'all', specialMode: '' })}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black ${
              filters.lang === 'zh'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg border border-red-500/50'
                : 'text-slate-400 bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🇨🇳</span> Tiếng Trung (HSK)
          </AnimatedButton>
          
          <AnimatedButton
            soundType="click"
            onClick={() => setFilters({ ...filters, lang: 'en', level: '', topic: '', pos: '', status: 'all', specialMode: '' })}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black ${
              filters.lang === 'en'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border border-blue-500/50'
                : 'text-slate-400 bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🇬🇧</span> Tiếng Anh (CEFR)
          </AnimatedButton>
        </div>
      </div>

      <PageTransition key={subTab}>
        {subTab === 'srs_deck' && (
          <div className="space-y-6">
            <FlashcardFilterBar
              filters={filters}
              onFilterChange={setFilters}
              totalCardsCount={cards.length}
              dueCount={dueCount}
            />

            {loading ? (
              <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-extrabold">Đang tải thẻ ghi nhớ...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-extrabold text-white">Chưa có thẻ ghi nhớ nào</h3>
                <AnimatedButton
                  onClick={() => setFilters({ lang: filters.lang, level: '', topic: '', pos: '', status: 'all', specialMode: '' })}
                  className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl"
                >
                  Đặt Lại Bộ Lọc
                </AnimatedButton>
              </div>
            ) : (
              <FlashcardDeckPlayer
                cards={cards}
                lang={filters.lang}
                onRateCard={handleRateCard}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        )}

        {subTab === 'stats' && <SRSStatsDashboard lang={filters.lang} />}
      </PageTransition>

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportSuccess={fetchCards}
        cardsToExport={cards}
      />
    </div>
  );
}
