'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Download, History, X, Pin, Trash2, Sparkles, Command } from 'lucide-react';
import { LanguageWorkspace, SearchHistoryItem } from './dictionary-types';

interface SearchCommandCenterProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: () => void;
  activeWorkspace: LanguageWorkspace;
  onExportCSV: () => void;
  searchHistory: SearchHistoryItem[];
  onSelectHistory: (q: string) => void;
  onClearHistory: () => void;
  onTogglePinHistory: (id: string) => void;
  onRemoveHistoryItem: (id: string) => void;
}

export function SearchCommandCenter({
  query,
  onQueryChange,
  onSubmit,
  activeWorkspace,
  onExportCSV,
  searchHistory,
  onSelectHistory,
  onClearHistory,
  onTogglePinHistory,
  onRemoveHistoryItem,
}: SearchCommandCenterProps) {
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showHistoryPopover, setShowHistoryPopover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setIsListeningVoice(false);
      const voiceTerm = activeWorkspace === 'zh' ? '维修' : activeWorkspace === 'en' ? 'maintenance' : 'bảo trì';
      onQueryChange(voiceTerm);
      onSubmit();
    }, 1500);
  };

  const getPlaceholder = () => {
    switch (activeWorkspace) {
      case 'zh':
        return 'Nhập chữ Hán, Pinyin có dấu, bộ thủ, nghĩa tiếng Việt...';
      case 'en':
        return 'Nhập từ tiếng Anh, IPA, nghĩa tiếng Việt, collocation...';
      case 'bilingual':
        return 'Nhập thuật ngữ công xưởng, Pinyin, IPA hoặc nghĩa song ngữ...';
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
            setShowHistoryPopover(false);
          }}
          className="relative flex-1"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setShowHistoryPopover(true)}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full bg-slate-900/80 border border-slate-800/80 rounded-3xl pl-12 pr-44 py-4 text-sm font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-xl backdrop-blur-2xl"
          />
          <Search className="absolute left-4.5 top-4.5 w-5 h-5 text-orange-400" />

          {/* Ctrl + K Shortcut Badge */}
          {!query && (
            <div className="absolute right-44 top-4 hidden md:flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/50 pointer-events-none backdrop-blur-md">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          )}

          {query && (
            <button
              type="button"
              onClick={() => {
                onQueryChange('');
                inputRef.current?.focus();
              }}
              className="absolute right-44 top-4.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="absolute right-3 top-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Tìm kiếm bằng giọng nói"
              className={`p-2 px-3.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                isListeningVoice
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isListeningVoice ? 'animate-bounce text-rose-400' : 'text-orange-400'}`} />
              <span className="hidden md:inline">{isListeningVoice ? 'Đang nghe...' : 'Voice'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Tra cứu
            </button>
          </div>
        </form>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCSV}
          className="px-4 py-3.5 bg-slate-900/80 border border-slate-800/80 hover:border-orange-500/50 text-slate-300 hover:text-white rounded-3xl transition-all shadow-lg flex items-center justify-center gap-2 font-extrabold text-xs cursor-pointer hover:scale-105 backdrop-blur-2xl"
          title="Xuất dữ liệu CSV"
        >
          <Download className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Xuất CSV</span>
        </button>
      </div>

      {/* History & Suggestion Popover */}
      {showHistoryPopover && searchHistory.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-slate-800/90 rounded-3xl p-4.5 shadow-2xl z-30 space-y-3 backdrop-blur-3xl double-bezel animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-2 font-sans">
              <History className="w-4 h-4 text-orange-400" /> LỊCH SỬ TÌM KIẾM GẦN ĐÂY
            </div>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[11px] font-black text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa toàn bộ
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pt-1">
            {searchHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl hover:border-orange-500/50 text-xs font-bold transition-all group shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectHistory(item.query);
                    setShowHistoryPopover(false);
                  }}
                  className="truncate text-left text-slate-200 group-hover:text-orange-400 transition-colors flex-1"
                >
                  {item.query}
                </button>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onTogglePinHistory(item.id)}
                    className={`p-1 rounded-lg hover:bg-slate-800 ${item.isPinned ? 'text-amber-400' : 'text-slate-500'}`}
                    title={item.isPinned ? 'Bỏ ghim' : 'Ghim'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveHistoryItem(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                    title="Xóa mục này"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


