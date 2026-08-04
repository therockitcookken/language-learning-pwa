'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import { Search, Volume2, Bookmark, Filter, ArrowRightLeft, Sparkles, Check } from 'lucide-react';

export function DictionaryView() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState('all');
  const [domain, setDomain] = useState('');
  const [hsk, setHsk] = useState('');
  const [cefr, setCefr] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const fetchDictionary = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (lang !== 'all') params.set('lang', lang);
      if (domain) params.set('domain', domain);
      if (hsk) params.set('hsk', hsk);
      if (cefr) params.set('cefr', cefr);

      const res = await fetch(`/api/v1/dictionary/search?${params.toString()}`);
      const json = await res.json();
      if (json.data?.items) {
        setItems(json.data.items);
      }
    } catch {
      // Fallback UI handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictionary();
  }, [lang, domain, hsk, cefr]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDictionary();
  };

  const handleSpeak = (text: string, language: 'zh-CN' | 'en-US') => {
    audioEngine.speak(text, language);
  };

  const handleAddToFlashcard = async (item: any) => {
    try {
      await fetch('/api/v1/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontText: item.simplified || item.word,
          backText: `${item.meaningVi}\n${item.meaningEn}`,
          pinyinOrIpa: item.pinyin || item.ipa,
          topic: item.topic,
          factoryDomain: item.factoryDomain,
        }),
      });
      setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    } catch {
      // Quiet fail
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>📖</span> {t.dictionary}
          </h2>
          <p className="text-xs text-slate-400">
            Tra cứu từ vựng 3 chiều: Việt – Trung – Anh – Nhật/Đài với Pinyin, IPA & ví dụ công xưởng thực tế.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-inner"
        />
        <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-2">
          <Filter className="w-4 h-4 text-orange-400" /> Lọc từ vựng:
        </div>

        {/* Language Filter */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all">Tất cả ngôn ngữ</option>
          <option value="zh">🇨🇳 Tiếng Trung (Mandarin)</option>
          <option value="en">🇺🇸 Tiếng Anh (English)</option>
        </select>

        {/* Factory Domain Filter */}
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả ngành công xưởng</option>
          <option value="an_toan">🛡️ An toàn lao động & PCCC</option>
          <option value="day_chuyen">⚡ Dây chuyền sản xuất</option>
          <option value="bao_tri">🔧 Bảo trì cơ khí & CNC</option>
          <option value="chat_luong">📦 Kiểm tra chất lượng (QC)</option>
          <option value="kho_hang">🚚 Kho hàng & Logistics</option>
        </select>

        {/* HSK Filter */}
        <select
          value={hsk}
          onChange={(e) => setHsk(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả HSK</option>
          <option value="HSK1">HSK 1</option>
          <option value="HSK2">HSK 2</option>
          <option value="HSK3">HSK 3</option>
          <option value="HSK4">HSK 4</option>
          <option value="HSK5">HSK 5</option>
        </select>

        {/* CEFR Filter */}
        <select
          value={cefr}
          onChange={(e) => setCefr(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả CEFR</option>
          <option value="A1">CEFR A1</option>
          <option value="A2">CEFR A2</option>
          <option value="B1">CEFR B1</option>
          <option value="B2">CEFR B2</option>
        </select>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="text-center py-12 text-slate-400 text-sm animate-pulse">
          Đang tải kết quả từ điển...
        </div>
      )}

      {/* Vocabulary Results Grid */}
      {!loading && items.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
          Không tìm thấy từ vựng phù hợp. Vui lòng thử từ khóa khác.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-5 shadow-lg space-y-3 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-white tracking-wide">
                      {item.simplified || item.word}
                    </h3>
                    {item.traditional && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {item.traditional}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-orange-400 mt-0.5">
                    {item.pinyin || item.ipa}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speech Audio Button */}
                  <button
                    onClick={() =>
                      handleSpeak(
                        item.simplified || item.word,
                        item.language === 'en' ? 'en-US' : 'zh-CN'
                      )
                    }
                    className="p-2 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  {/* Add to Flashcard Button */}
                  <button
                    onClick={() => handleAddToFlashcard(item)}
                    disabled={addedIds[item.id]}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      addedIds[item.id]
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-white'
                    }`}
                    title="Thêm vào bộ Flashcard"
                  >
                    {addedIds[item.id] ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <p className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="text-xs text-orange-400 font-mono">[VN]</span> {item.meaningVi}
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-xs text-indigo-400 font-mono">[EN]</span> {item.meaningEn}
                </p>
              </div>

              {/* Domain & Level Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.topic}
                </span>
                {item.hskLevel && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-500/30">
                    {item.hskLevel}
                  </span>
                )}
                {item.cefrLevel && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {item.cefrLevel}
                  </span>
                )}
              </div>

              {/* Examples */}
              {item.examples && item.examples.length > 0 && (
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <div className="font-semibold text-slate-300">Ví dụ công xưởng:</div>
                  <p className="text-amber-200 font-medium">{item.examples[0].sentenceZh || item.examples[0].sentenceEn}</p>
                  {item.examples[0].pinyin && (
                    <p className="text-orange-400/90 italic">{item.examples[0].pinyin}</p>
                  )}
                  <p className="text-slate-400">{item.examples[0].sentenceVi}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
