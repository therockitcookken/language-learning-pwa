'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import {
  Search,
  Volume2,
  Bookmark,
  Filter,
  Check,
  BookOpen,
  FolderHeart,
  ShieldCheck,
  Cpu,
  Wrench,
  PackageCheck,
  Truck,
} from 'lucide-react';

export function DictionaryView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'search' | 'handbook' | 'favorites'>('search');
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState('all');
  const [domain, setDomain] = useState('');
  const [hsk, setHsk] = useState('');
  const [cefr, setCefr] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
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

  const handleToggleFavorite = (item: any) => {
    if (addedIds[item.id]) {
      setFavorites(favorites.filter((f) => f.id !== item.id));
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    } else {
      setFavorites([...favorites, item]);
      setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    }
  };

  const domainTabs = [
    { id: 'an_toan', title: 'An toàn lao động & PPE', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'day_chuyen', title: 'Dây chuyền sản xuất', icon: Cpu, color: 'text-blue-400' },
    { id: 'bao_tri', title: 'Bảo trì cơ khí & CNC', icon: Wrench, color: 'text-amber-400' },
    { id: 'chat_luong', title: 'Kiểm tra chất lượng QC', icon: PackageCheck, color: 'text-purple-400' },
    { id: 'kho_hang', title: 'Kho hàng & Logistics', icon: Truck, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>📖</span> {t.dictionary}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Từ điển công xưởng 3 chiều: Việt – Trung – Anh kèm Pinyin, IPA và ví dụ nhà máy thực tế.
          </p>
        </div>

        {/* Sub-tab Switcher Pill Bar */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setSubTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'search'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Tra cứu Từ điển
          </button>
          <button
            onClick={() => setSubTab('handbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'handbook'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Sổ tay Chuyên ngành
          </button>
          <button
            onClick={() => setSubTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'favorites'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" /> Từ yêu thích ({favorites.length})
          </button>
        </div>
      </div>

      {subTab === 'search' && (
        <div className="space-y-5">
          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-32 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-inner"
            />
            <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold px-2">
              <Filter className="w-4 h-4 text-orange-400" /> Bộ lọc:
            </div>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả ngôn ngữ</option>
              <option value="zh">🇨🇳 Tiếng Trung (Mandarin)</option>
              <option value="en">🇺🇸 Tiếng Anh (English)</option>
            </select>

            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả chuyên ngành</option>
              <option value="an_toan">🛡️ An toàn lao động & PPE</option>
              <option value="day_chuyen">⚡ Dây chuyền sản xuất</option>
              <option value="bao_tri">🔧 Bảo trì cơ khí & CNC</option>
              <option value="chat_luong">📦 Kiểm tra chất lượng (QC)</option>
              <option value="kho_hang">🚚 Kho hàng & Logistics</option>
            </select>

            <select
              value={hsk}
              onChange={(e) => setHsk(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">Trình độ HSK</option>
              <option value="HSK1">HSK 1</option>
              <option value="HSK2">HSK 2</option>
              <option value="HSK3">HSK 3</option>
              <option value="HSK4">HSK 4</option>
              <option value="HSK5">HSK 5</option>
            </select>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm animate-pulse">
              Đang tải dữ liệu từ điển...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-5 shadow-xl space-y-3 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-white tracking-wide">
                          {item.simplified || item.word}
                        </h3>
                        {item.traditional && (
                          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {item.traditional}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-extrabold text-orange-400 mt-0.5">
                        {item.pinyin || item.ipa}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleSpeak(
                            item.simplified || item.word,
                            item.language === 'en' ? 'en-US' : 'zh-CN'
                          )
                        }
                        className="p-2.5 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                        title="Nghe âm chuẩn"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleToggleFavorite(item)}
                        className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                          addedIds[item.id]
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-white'
                        }`}
                        title="Đánh dấu yêu thích"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <p className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className="text-xs text-orange-400 font-mono font-black">[VN]</span> {item.meaningVi}
                    </p>
                    <p className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-xs text-indigo-400 font-mono font-black">[EN]</span> {item.meaningEn}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.topic}
                    </span>
                    {item.hskLevel && (
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-500/30">
                        {item.hskLevel}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'handbook' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setDomain(tab.id);
                    setSubTab('search');
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-orange-500/40 p-5 rounded-2xl text-left space-y-3 transition-all cursor-pointer group"
                >
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 w-fit group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${tab.color}`} />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    {tab.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Bấm để lọc toàn bộ thuật ngữ chuyên ngành {tab.title}.
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {subTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
              Chưa có từ vựng yêu thích. Hãy bấm vào biểu tượng Bookmark trong từ điển để lưu!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xl font-bold text-white">{item.simplified || item.word}</h4>
                  <p className="text-xs text-orange-400 font-semibold">{item.pinyin || item.ipa}</p>
                  <p className="text-xs text-slate-200">{item.meaningVi}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
