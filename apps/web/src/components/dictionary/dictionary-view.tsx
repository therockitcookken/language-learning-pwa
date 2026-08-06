'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import { BookOpen, Layers, FolderHeart } from 'lucide-react';
import {
  LanguageWorkspace,
  ViewMode,
  SortOption,
  AdvancedFilterState,
  SearchHistoryItem,
  VocabularyItem,
} from './dictionary-types';

import { DictionaryStats } from './dictionary-stats';
import { LanguageWorkspaceSwitcher } from './language-workspace-switcher';
import { SearchCommandCenter } from './search-command-center';
import { QuickFilterBar } from './quick-filter-bar';
import { AdvancedFilterDrawer } from './advanced-filter-drawer';
import { ActiveFilterChips } from './active-filter-chips';
import { ResultsToolbar } from './results-toolbar';

import { ChineseVocabularyCard } from './chinese-vocabulary-card';
import { EnglishVocabularyCard } from './english-vocabulary-card';
import { BilingualVocabularyCard } from './bilingual-vocabulary-card';
import { VocabularyListRow } from './vocabulary-list-row';
import { VocabularyTable } from './vocabulary-table';

import { VocabularyPreviewDrawer } from './vocabulary-preview-drawer';
import { QuickStudyModal } from './quick-study-modal';
import { BulkActionBar } from './bulk-action-bar';
import { DictionarySkeleton } from './dictionary-skeleton';
import { DictionaryEmptyState } from './dictionary-empty-state';

export function DictionaryView() {
  const { t } = useI18n();

  // Core Workspace & View State
  const [activeWorkspace, setActiveWorkspace] = useState<LanguageWorkspace>('zh');
  const [subTab, setSubTab] = useState<'search' | 'handbook' | 'favorites'>('search');
  const [viewMode, setViewMode] = useState<ViewMode>('grid_spacious');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Filters State
  const [query, setQuery] = useState('');
  const [hsk, setHsk] = useState('');
  const [cefr, setCefr] = useState('');
  const [domain, setDomain] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedVoice, setSelectedVoice] = useState('google-zh-cn');

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    hskLevels: [],
    toeicLevels: [],
    factoryDomains: [],
    partOfSpeech: [],
    learningStatus: 'all',
    isSavedOnly: false,
    hasAudioOnly: false,
    hasExamplesOnly: false,
    isVerifiedOnly: false,
    accent: 'all',
  });

  const [isAdvancedDrawerOpen, setIsAdvancedDrawerOpen] = useState(false);

  // Data & API State
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<VocabularyItem[]>([]);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [paginationInfo, setPaginationInfo] = useState<{ total: number; totalPages: number }>({
    total: 0,
    totalPages: 1,
  });

  // UI Interactive Overlays State
  const [previewItem, setPreviewItem] = useState<VocabularyItem | null>(null);
  const [isQuickStudyOpen, setIsQuickStudyOpen] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  // Search History State
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
    { id: '1', query: '维修', language: 'zh', timestamp: Date.now() - 3600000, isPinned: true },
    { id: '2', query: 'maintenance', language: 'en', timestamp: Date.now() - 7200000 },
    { id: '3', query: '安全', language: 'zh', timestamp: Date.now() - 10800000 },
  ]);

  // Sync state with URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('language') as LanguageWorkspace;
      if (urlLang && ['zh', 'en', 'bilingual'].includes(urlLang)) {
        setActiveWorkspace(urlLang);
      }
      const urlQ = urlParams.get('q');
      if (urlQ) setQuery(urlQ);
    }
  }, []);

  // Fetch dictionary entries from API
  const fetchDictionary = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);

      if (activeWorkspace === 'zh') params.set('lang', 'zh');
      else if (activeWorkspace === 'en') params.set('lang', 'en');
      else params.set('lang', 'all');

      if (domain) params.set('domain', domain);
      if (hsk) params.set('hsk', hsk);
      if (cefr) params.set('cefr', cefr);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const res = await fetch(`/api/v1/dictionary/search?${params.toString()}`);
      const json = await res.json();
      if (json.data?.items) {
        setItems(json.data.items);
        if (json.data.pagination) {
          setPaginationInfo({
            total: json.data.pagination.total,
            totalPages: json.data.pagination.totalPages,
          });
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictionary();
  }, [activeWorkspace, domain, hsk, cefr, page, limit]);

  // Handle Search Submit
  const handleSearchSubmit = () => {
    setPage(1);
    fetchDictionary();

    if (query.trim()) {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: query.trim(),
        language: activeWorkspace,
        timestamp: Date.now(),
      };
      setSearchHistory((prev) => [newItem, ...prev.filter((h) => h.query !== query.trim())].slice(0, 15));
    }

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('language', activeWorkspace);
      if (query) url.searchParams.set('q', query);
      else url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Handle Audio Speech
  const handleSpeak = (text: string, lang: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' = 'zh-CN') => {
    audioEngine.speak(text, lang, 1.0, 1.0, selectedVoice);
  };

  // Handle Share / Copy
  const handleShareWord = (item: VocabularyItem) => {
    const text = `${item.simplified || item.word} (${item.pinyin || item.ipa}) - Nghĩa: ${item.meaningVi}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Bookmark / Favorite
  const handleToggleFavorite = async (item: VocabularyItem) => {
    if (savedIds[item.id]) {
      setFavorites((prev) => prev.filter((f) => f.id !== item.id));
      setSavedIds((prev) => ({ ...prev, [item.id]: false }));
    } else {
      setFavorites((prev) => [...prev, item]);
      setSavedIds((prev) => ({ ...prev, [item.id]: true }));
      try {
        await fetch('/api/v1/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frontText: item.simplified || item.word,
            backText: item.meaningVi,
            pinyinOrIpa: item.pinyin || item.ipa,
            topic: item.topic,
            factoryDomain: item.factoryDomain,
          }),
        });
      } catch (e) {}
    }
  };

  // Filter Reset Handler
  const handleResetAllFilters = () => {
    setQuery('');
    setHsk('');
    setCefr('');
    setDomain('');
    setPage(1);
    setAdvancedFilters({
      hskLevels: [],
      toeicLevels: [],
      factoryDomains: [],
      partOfSpeech: [],
      learningStatus: 'all',
      isSavedOnly: false,
      hasAudioOnly: false,
      hasExamplesOnly: false,
      isVerifiedOnly: false,
      accent: 'all',
    });
  };

  // Sorted and Filtered Items Client Side Refinement
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by Advanced Toggles
    if (advancedFilters.isSavedOnly) {
      result = result.filter((i) => savedIds[i.id]);
    }

    // Sort options
    if (sortOption === 'az') {
      result.sort((a, b) => (a.simplified || a.word).localeCompare(b.simplified || b.word));
    } else if (sortOption === 'za') {
      result.sort((a, b) => (b.simplified || b.word).localeCompare(a.simplified || a.word));
    } else if (sortOption === 'level_low_high') {
      result.sort((a, b) => (a.hskLevel || 'HSK0').localeCompare(b.hskLevel || 'HSK0'));
    } else if (sortOption === 'level_high_low') {
      result.sort((a, b) => (b.hskLevel || 'HSK0').localeCompare(a.hskLevel || 'HSK0'));
    }

    return result;
  }, [items, savedIds, sortOption, advancedFilters]);

  // Selected Count for Bulk Operations
  const selectedCount = useMemo(() => {
    return Object.values(selectedIds).filter(Boolean).length;
  }, [selectedIds]);

  // Preview Drawer Navigation
  const previewIndex = useMemo(() => {
    if (!previewItem) return -1;
    return filteredAndSortedItems.findIndex((i) => i.id === previewItem.id);
  }, [previewItem, filteredAndSortedItems]);

  const exportSelectedCSV = () => {
    const selectedItems = filteredAndSortedItems.filter((i) => selectedIds[i.id]);
    const listToExport = selectedItems.length > 0 ? selectedItems : filteredAndSortedItems;

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Từ vựng,Pinyin/IPA,Nghĩa Tiếng Việt,Nghĩa Tiếng Anh,Chủ đề']
        .concat(
          listToExport.map(
            (i) => `"${i.simplified || i.word}","${i.pinyin || i.ipa}","${i.meaningVi}","${i.meaningEn || ''}","${i.topic}"`
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

  return (
    <div className="space-y-6">
      {/* Module Title & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <span>{t.dictionary}</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-2.5">
            <span>Từ điển Thuật ngữ Công xưởng Chuyên ngành (Trung - Anh - Việt)</span>
            <span className="text-xs font-bold bg-orange-500/15 text-orange-300 border border-orange-500/25 px-3 py-0.5 rounded-full shadow-sm">
              {query || domain || hsk || cefr
                ? `${paginationInfo.total.toLocaleString()} Từ Vựng`
                : activeWorkspace === 'zh'
                ? '3,000 Từ Vựng Tiếng Trung'
                : activeWorkspace === 'en'
                ? '3,000 Từ Vựng Tiếng Anh'
                : '6,000 Từ Vựng Song Ngữ'}
            </span>
          </p>
        </div>

        {/* Subtab Toggle (Search / Favorites) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl backdrop-blur-xl shadow-md">
          <button
            type="button"
            onClick={() => { setSubTab('search'); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'search'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TRA CỨU
          </button>
          <button
            type="button"
            onClick={() => { setSubTab('favorites'); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'favorites'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderHeart className="w-4 h-4 text-orange-400" /> ĐÃ LƯU ({favorites.length})
          </button>
        </div>
      </div>

      {/* Dictionary Stats Bar */}
      <DictionaryStats
        total={
          query || domain || hsk || cefr
            ? paginationInfo.total
            : activeWorkspace === 'zh'
            ? Math.max(paginationInfo.total, 3000)
            : activeWorkspace === 'en'
            ? Math.max(paginationInfo.total, 3000)
            : Math.max(paginationInfo.total, 6000)
        }
        learnedCount={
          activeWorkspace === 'zh'
            ? 3500
            : activeWorkspace === 'en'
            ? 3500
            : 7000
        }
        reviewCount={12}
        savedCount={favorites.length}
        streakDays={5}
      />

      {/* 1. Language Workspace Switcher */}
      <LanguageWorkspaceSwitcher
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={(ws) => {
          setActiveWorkspace(ws);
          setPage(1);
          setHsk('');
          setCefr('');
        }}
        zhCount={3000}
        enCount={3000}
        bilingualCount={6000}
      />

      {/* 2. Search Command Center */}
      <SearchCommandCenter
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSearchSubmit}
        activeWorkspace={activeWorkspace}
        onExportCSV={exportSelectedCSV}
        searchHistory={searchHistory}
        onSelectHistory={(q) => { setQuery(q); handleSearchSubmit(); }}
        onClearHistory={() => setSearchHistory([])}
        onTogglePinHistory={(id) =>
          setSearchHistory((prev) =>
            prev.map((h) => (h.id === id ? { ...h, isPinned: !h.isPinned } : h))
          )
        }
        onRemoveHistoryItem={(id) => setSearchHistory((prev) => prev.filter((h) => h.id !== id))}
      />

      {/* 3. Quick Filter Bar */}
      <QuickFilterBar
        activeWorkspace={activeWorkspace}
        hsk={hsk}
        onHskChange={(val) => { setHsk(val); setPage(1); }}
        cefr={cefr}
        onCefrChange={(val) => { setCefr(val); setPage(1); }}
        domain={domain}
        onDomainChange={(val) => { setDomain(val); setPage(1); }}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        limit={limit}
        onLimitChange={(val) => { setLimit(val); setPage(1); }}
        onOpenAdvancedDrawer={() => setIsAdvancedDrawerOpen(true)}
      />

      {/* 4. Active Filter Chips Bar */}
      <ActiveFilterChips
        query={query}
        onClearQuery={() => setQuery('')}
        activeWorkspace={activeWorkspace}
        hsk={hsk}
        onClearHsk={() => setHsk('')}
        cefr={cefr}
        onClearCefr={() => setCefr('')}
        domain={domain}
        onClearDomain={() => setDomain('')}
        advancedFilters={advancedFilters}
        onRemoveAdvancedFilter={(field) =>
          setAdvancedFilters((prev) => ({ ...prev, [field]: Array.isArray(prev[field]) ? [] : false }))
        }
        onResetAll={handleResetAllFilters}
        totalResults={
          query || domain || hsk || cefr
            ? paginationInfo.total
            : activeWorkspace === 'zh'
            ? Math.max(paginationInfo.total, 3000)
            : activeWorkspace === 'en'
            ? Math.max(paginationInfo.total, 3000)
            : Math.max(paginationInfo.total, 6000)
        }
      />

      {/* 5. Results Toolbar (Sort & View Modes & Quick Study) */}
      <ResultsToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        isMultiSelect={isMultiSelect}
        onToggleMultiSelect={() => setIsMultiSelect(!isMultiSelect)}
        onOpenQuickStudy={() => setIsQuickStudyOpen(true)}
      />

      {/* 6. Vocabulary Results Workspace */}
      {loading ? (
        <DictionarySkeleton count={6} />
      ) : filteredAndSortedItems.length === 0 ? (
        <DictionaryEmptyState query={query} onResetFilters={handleResetAllFilters} />
      ) : (
        <>
          {/* Grid Spacious View */}
          {viewMode === 'grid_spacious' && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {filteredAndSortedItems.map((item) => {
                const isZh = item.language === 'zh';
                const isSaved = Boolean(savedIds[item.id]);
                const isSelected = Boolean(selectedIds[item.id]);

                if (activeWorkspace === 'bilingual') {
                  return (
                    <BilingualVocabularyCard
                      key={item.id}
                      item={item}
                      isSelected={isSelected}
                      onToggleSelect={() =>
                        setSelectedIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                      isSaved={isSaved}
                      onToggleFavorite={handleToggleFavorite}
                      onSpeak={handleSpeak}
                      onShare={handleShareWord}
                      onOpenPreview={setPreviewItem}
                      isCopied={copiedId === item.id}
                    />
                  );
                }

                if (isZh) {
                  return (
                    <ChineseVocabularyCard
                      key={item.id}
                      item={item}
                      isSelected={isSelected}
                      onToggleSelect={() =>
                        setSelectedIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                      isSaved={isSaved}
                      onToggleFavorite={handleToggleFavorite}
                      onSpeak={handleSpeak}
                      onShare={handleShareWord}
                      onOpenPreview={setPreviewItem}
                      isCopied={copiedId === item.id}
                    />
                  );
                }

                return (
                  <EnglishVocabularyCard
                    key={item.id}
                    item={item}
                    isSelected={isSelected}
                    onToggleSelect={() =>
                      setSelectedIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    isSaved={isSaved}
                    onToggleFavorite={handleToggleFavorite}
                    onSpeak={handleSpeak}
                    onShare={handleShareWord}
                    onOpenPreview={setPreviewItem}
                    isCopied={copiedId === item.id}
                  />
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredAndSortedItems.map((item) => (
                <VocabularyListRow
                  key={item.id}
                  item={item}
                  isSelected={Boolean(selectedIds[item.id])}
                  onToggleSelect={() =>
                    setSelectedIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  isSaved={Boolean(savedIds[item.id])}
                  onToggleFavorite={handleToggleFavorite}
                  onSpeak={handleSpeak}
                  onShare={handleShareWord}
                  onOpenPreview={setPreviewItem}
                  isCopied={copiedId === item.id}
                />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <VocabularyTable
              items={filteredAndSortedItems}
              selectedIds={selectedIds}
              onToggleSelect={(id) => setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }))}
              savedIds={savedIds}
              onToggleFavorite={handleToggleFavorite}
              onSpeak={handleSpeak}
              onOpenPreview={setPreviewItem}
            />
          )}

          {/* Pagination Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-pure-surface border border-whisper-border p-4 rounded-[4px] mt-6">
            <div className="text-xs font-mono text-muted-steel">
              TRANG <span className="text-titanium-white font-bold">{page}</span> /{' '}
              <span className="text-titanium-white font-bold">{paginationInfo.totalPages || 1}</span> (
              {paginationInfo.total.toLocaleString()} TỪ VỰNG)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(1)}
                className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel disabled:opacity-40 text-xs font-mono text-titanium-white rounded-[4px] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                « ĐẦU
              </button>

              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel disabled:opacity-40 text-xs font-mono text-titanium-white rounded-[4px] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                ‹ TRƯỚC
              </button>

              <div className="px-3 py-1.5 bg-safety-orange text-canvas-ink font-mono font-bold text-xs rounded-[4px]">
                {page}
              </div>

              <button
                type="button"
                disabled={page >= (paginationInfo.totalPages || 1)}
                onClick={() => setPage((p) => Math.min(paginationInfo.totalPages, p + 1))}
                className="px-4 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel disabled:opacity-40 text-xs font-mono text-titanium-white rounded-[4px] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                SAU ›
              </button>

              <button
                type="button"
                disabled={page >= (paginationInfo.totalPages || 1)}
                onClick={() => setPage(paginationInfo.totalPages)}
                className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel disabled:opacity-40 text-xs font-mono text-titanium-white rounded-[4px] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                CUỐI »
              </button>
            </div>
          </div>
        </>
      )}

      {/* 7. Interactive Overlays */}
      {/* Advanced Filter Drawer */}
      <AdvancedFilterDrawer
        isOpen={isAdvancedDrawerOpen}
        onClose={() => setIsAdvancedDrawerOpen(false)}
        filters={advancedFilters}
        onFilterChange={setAdvancedFilters}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={setActiveWorkspace}
        onResetAll={handleResetAllFilters}
      />

      {/* Detailed Vocabulary Preview Drawer */}
      <VocabularyPreviewDrawer
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onPrev={() => setPreviewItem(filteredAndSortedItems[previewIndex - 1] || null)}
        onNext={() => setPreviewItem(filteredAndSortedItems[previewIndex + 1] || null)}
        hasPrev={previewIndex > 0}
        hasNext={previewIndex >= 0 && previewIndex < filteredAndSortedItems.length - 1}
        isSaved={Boolean(previewItem && savedIds[previewItem.id])}
        onToggleFavorite={handleToggleFavorite}
        onSpeak={handleSpeak}
      />

      {/* Quick Study Modal Overlay */}
      <QuickStudyModal
        isOpen={isQuickStudyOpen}
        onClose={() => setIsQuickStudyOpen(false)}
        items={filteredAndSortedItems}
        onSpeak={handleSpeak}
      />

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        totalOnPage={filteredAndSortedItems.length}
        onSelectAll={() => {
          const ids: Record<string, boolean> = {};
          filteredAndSortedItems.forEach((i) => (ids[i.id] = true));
          setSelectedIds(ids);
        }}
        onDeselectAll={() => setSelectedIds({})}
        onBulkSave={() => {
          filteredAndSortedItems.forEach((i) => {
            if (selectedIds[i.id]) handleToggleFavorite(i);
          });
        }}
        onBulkExport={exportSelectedCSV}
        onBulkPlayAudio={() => {
          filteredAndSortedItems.forEach((item, idx) => {
            if (selectedIds[item.id]) {
              setTimeout(() => {
                handleSpeak(item.simplified || item.word, item.language === 'en' ? 'en-US' : 'zh-CN');
              }, idx * 2000);
            }
          });
        }}
        onClose={() => {
          setSelectedIds({});
          setIsMultiSelect(false);
        }}
      />
    </div>
  );
}
