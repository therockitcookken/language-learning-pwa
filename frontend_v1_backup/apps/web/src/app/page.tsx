'use client';

import React, { useState } from 'react';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt';
import { FactoryMap2D } from '@/components/dashboard/factory-map-2d';
import { DictionaryView } from '@/components/dictionary/dictionary-view';
import { PronunciationView } from '@/components/pronunciation/pronunciation-view';
import { GrammarView } from '@/components/grammar/grammar-view';
import { FlashcardView } from '@/components/flashcard/flashcard-view';
import { QuizView } from '@/components/quiz/quiz-view';
import { NotebookView } from '@/components/notebook/notebook-view';
import { AdminView } from '@/components/admin/admin-view';
import { BadgeCollection } from '@/components/common/badge-collection';
import { BookOpen, HelpCircle, Sparkles, TrendingUp, Award, Layers } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleSelectZoneFromMap = (zoneDomain: string) => {
    setSelectedDomain(zoneDomain);
    setActiveTab('dictionary');
  };

  return (
    <I18nProvider>
      <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
        {/* Ambient Background Glow Spheres */}
        <div className="glow-sphere fixed top-12 left-1/4 -z-10 animate-pulseGlow" />
        <div className="glow-sphere-2 fixed bottom-12 right-1/4 -z-10 animate-pulseGlow" style={{ animationDelay: '2s' }} />

        {/* PWA Mobile App Install Banner & Offline Status */}
        <PWAInstallPrompt />

        {/* Header */}
        <Header userRole="LEARNER" isGuest={true} xp={180} streak={5} />

        {/* Main Workspace Layout */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {/* Desktop Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Hero Brand Block Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />
                  <div className="relative z-10 space-y-4.5 max-w-2xl">
                    <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-indigo-500/15 text-orange-300 border border-orange-500/30 shadow-md backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Ứng dụng PWA Học tiếng Trung & Tiếng Anh Công Xưởng
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md font-sans">
                      Làm Chủ Ngôn Ngữ Nhà Máy – Nâng Cao Tay Nghề & Lương Thưởng!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      Thiết kế tối ưu cho công nhân, kỹ thuật viên, quản lý chuyền & nhân viên bảo trì. Học giao tiếp an toàn, thao tác máy CNC, băng chuyền & báo cáo QC thực tế.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('dictionary')}
                        className="px-6.5 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-orange-500/25 cursor-pointer transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                      >
                        <BookOpen className="w-4 h-4 text-amber-200" /> Tra Từ Điển Công Xưởng
                      </button>
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 font-extrabold text-xs rounded-2xl border border-slate-700/60 cursor-pointer transition-all flex items-center gap-2 backdrop-blur-xl shadow-md hover:border-orange-500/40 hover:scale-105 active:scale-95"
                      >
                        <HelpCircle className="w-4 h-4 text-orange-400" /> Làm Bài Kiểm Tra An Toàn
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive 2D Factory Map */}
                <FactoryMap2D onSelectZone={handleSelectZoneFromMap} />

                {/* Badge Achievements Drawer */}
                <BadgeCollection />
              </div>
            )}

            {activeTab === 'dictionary' && <DictionaryView />}
            {activeTab === 'pronunciation' && <PronunciationView />}
            {activeTab === 'grammar' && <GrammarView />}
            {activeTab === 'flashcard' && <FlashcardView />}
            {activeTab === 'quiz' && <QuizView />}
            {activeTab === 'learningPath' && <FactoryMap2D onSelectZone={handleSelectZoneFromMap} />}
            {activeTab === 'notebook' && <NotebookView />}
            {activeTab === 'progress' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-900/70 border border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-2xl shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2 font-sans">
                      <TrendingUp className="w-5 h-5 text-orange-400" /> Thống kê Tiến độ Học tập
                    </h2>
                    <span className="text-xs font-bold text-slate-400 bg-slate-800/60 px-3.5 py-1 rounded-full border border-slate-700/50 shadow-sm">
                      Cập nhật thời gian thực
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-emerald-500/30 text-center shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                        <Award className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-emerald-400 block font-sans">92%</span>
                      <span className="text-xs font-extrabold text-slate-300 block mt-1">Độ chính xác Flashcard</span>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-orange-500/30 text-center shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 text-orange-500/20 group-hover:text-orange-500/40 transition-colors">
                        <HelpCircle className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-orange-400 block font-sans">8/10</span>
                      <span className="text-xs font-extrabold text-slate-300 block mt-1">Bài Quiz đã hoàn thành</span>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-indigo-500/30 text-center shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-indigo-400 block font-sans">1.050</span>
                      <span className="text-xs font-extrabold text-slate-300 block mt-1">Từ vựng đã thuộc</span>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-amber-500/30 text-center shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
                        <Layers className="w-8 h-8" />
                      </div>
                      <span className="text-3xl font-black text-amber-400 block font-sans">5 Ngày</span>
                      <span className="text-xs font-extrabold text-slate-300 block mt-1">Chuỗi ngày học liên tục</span>
                    </div>
                  </div>
                </div>
                <BadgeCollection />
              </div>
            )}
            {activeTab === 'admin' && <AdminView />}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </I18nProvider>
  );
}


