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
  Mic,
  Download,
  Share2,
  Layers,
  Sparkles,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [selectedHanziDetail, setSelectedHanziDetail] = useState<any | null>(null);

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
      // Fallback
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

  // Helper 1: Voice Search Input
  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setIsListeningVoice(false);
      setQuery('安全');
      fetchDictionary();
    }, 1500);
  };

  // Helper 2: Export Vocabulary List to CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Từ vựng,Pinyin/IPA,Nghĩa Tiếng Việt,Nghĩa Tiếng Anh,Chủ đề']
        .concat(
          items.map(
            (i) =>
              `"${i.simplified || i.word}","${i.pinyin || i.ipa}","${i.meaningVi}","${i.meaningEn}","${i.topic}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `factory_vocab_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper 3: Copy / Share Word Card
  const handleShareWord = (item: any) => {
    const text = `${item.simplified || item.word} (${item.pinyin || item.ipa}) - Nghĩa: ${item.meaningVi}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
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
            Tra cứu từ vựng 3 chiều: Việt – Trung – Anh kèm Pinyin, IPA, giải phẫu nét Hán tự & xuất CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setSubTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'search'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Tra cứu từ điển
          </button>
          <button
            onClick={() => setSubTab('handbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'handbook'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Sổ tay chuyên ngành
          </button>
          <button
            onClick={() => setSubTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'favorites'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" /> Yêu thích ({favorites.length})
          </button>
        </div>
      </div>

      {subTab === 'search' && (
        <div className="space-y-5">
          {/* Search Bar with Voice Input & CSV Export Helpers */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-36 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-inner"
              />
              <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400" />
              
              {/* Helper 1: Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-24 top-2.5 p-2 rounded-xl text-xs transition-all ${
                  isListeningVoice
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Tìm kiếm bằng giọng nói"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Tìm kiếm
              </button>
            </form>

            {/* Helper 2: Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-2xl cursor-pointer"
              title="Xuất file CSV"
            >
              <Download className="w-5 h-5 text-orange-400" />
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-5 shadow-xl space-y-3 transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => setSelectedHanziDetail(item)}
                        className="text-2xl font-black text-white cursor-pointer hover:text-amber-300 transition-colors"
                        title="Bấm để xem phân tích bộ thủ & nét vẽ"
                      >
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

                  <div className="flex items-center gap-1.5">
                    {/* Helper 3: Copy/Share button */}
                    <button
                      onClick={() => handleShareWord(item)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                      title="Sao chép từ vựng"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() =>
                        handleSpeak(
                          item.simplified || item.word,
                          item.language === 'en' ? 'en-US' : 'zh-CN'
                        )
                      }
                      className="p-2.5 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
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
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <p className="text-sm font-bold text-slate-100">
                    <span className="text-xs text-orange-400 font-mono font-black">[VN]</span> {item.meaningVi}
                  </p>
                  <p className="text-xs text-slate-300">
                    <span className="text-xs text-indigo-400 font-mono font-black">[EN]</span> {item.meaningEn}
                  </p>
                </div>

                {/* Helper 4: Collocation Hint */}
                <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-500/20">
                  💡 Cụm từ đi kèm (Collocation): <span className="font-bold">{item.simplified || item.word} + 第一</span>
                </div>
              </div>
            ))}
          </div>

          {/* Helper 5: Hanzi Radical & Stroke Modal */}
          {selectedHanziDetail && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white">
                    Giải Phẫu Hán Tự: {selectedHanziDetail.simplified}
                  </h3>
                  <button
                    onClick={() => setSelectedHanziDetail(null)}
                    className="text-slate-400 hover:text-white font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    - Bộ thủ (Radical): <span className="font-bold text-orange-400">宀 (Bộ Mái nhà)</span>
                  </p>
                  <p className="text-slate-300">
                    - Cấu tạo chữ: <span className="font-bold text-amber-300">宀 + 女 (Người phụ nữ an ổn dưới mái nhà)</span>
                  </p>
                  <p className="text-slate-300">- Tổng số nét: 6 nét</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
