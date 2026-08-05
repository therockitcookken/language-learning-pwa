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
import { BookOpen, HelpCircle, Sparkles, TrendingUp, Award, Layers, Zap } from 'lucide-react';
import { HeroScene } from '@/components/3d/HeroScene';
import { AppBackground3D } from '@/components/3d/AppBackground3D';
import { AnimatedButton, NumberCounter, PageTransition } from '@/components/common/animations';
import { UserProgressProvider, useUserProgress } from '@/lib/contexts/user-progress-context';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleSelectZoneFromMap = (zoneDomain: string) => {
    setSelectedDomain(zoneDomain);
    setActiveTab('dictionary');
  };

  return (
    <I18nProvider>
      <UserProgressProvider>
        <HomePageContent />
      </UserProgressProvider>
    </I18nProvider>
  );
}

function HomePageContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const progress = useUserProgress();

  const handleSelectZoneFromMap = (zoneDomain: string) => {
    setSelectedDomain(zoneDomain);
    setActiveTab('dictionary');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
        {/* Theme 3D Background */}
        <AppBackground3D />

        {/* PWA Mobile App Install Banner & Offline Status */}
        <PWAInstallPrompt />

        {/* Header */}
        <Header />

        {/* Main Workspace Layout (Fluid Responsive) */}
        <div className="flex-1 flex w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 pb-24 md:pb-6 pt-4 gap-4">
          {/* Desktop Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 space-y-4 overflow-x-hidden p-2 sm:p-4 lg:p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border-2 border-slate-800/40 shadow-xl">
            <PageTransition key={activeTab}>
              {activeTab === 'dashboard' && (
                <div className="space-y-4">
                  {/* Hero Brand Block Banner */}
                  <div className="relative overflow-hidden bg-slate-950/60 border-2 border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl min-h-[350px] flex items-center">
                    <HeroScene />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />
                    <div className="relative z-10 space-y-4 max-w-2xl pointer-events-auto">
                      <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-indigo-500/15 text-orange-300 border border-orange-500/50 shadow-md backdrop-blur-md">
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
                        <AnimatedButton
                          soundType="click"
                          onClick={() => setActiveTab('dictionary')}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4 text-amber-200" /> Tra Từ Điển
                        </AnimatedButton>
                        <AnimatedButton
                          soundType="click"
                          onClick={() => setActiveTab('quiz')}
                          className="px-6 py-3 bg-slate-800/80 text-slate-200 font-extrabold text-xs rounded-xl border-2 border-slate-600/60 flex items-center gap-2 backdrop-blur-xl shadow-md hover:border-orange-500/60"
                        >
                          <HelpCircle className="w-4 h-4 text-orange-400" /> Kiểm Tra An Toàn
                        </AnimatedButton>
                        
                        {/* Dev XP Add Button */}
                        <AnimatedButton
                          soundType="click"
                          onClick={() => progress.addXp(50)}
                          className="px-4 py-3 bg-indigo-900/60 text-indigo-300 font-extrabold text-xs rounded-xl border-2 border-indigo-500/40 flex items-center gap-2 backdrop-blur-xl shadow-md hover:border-indigo-400"
                        >
                          <Zap className="w-4 h-4" /> Nhận 50 XP (Test)
                        </AnimatedButton>
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
                <div className="space-y-4">
                  <div className="bg-slate-900/70 border-2 border-slate-700/60 rounded-2xl p-6 space-y-5 backdrop-blur-2xl shadow-xl">
                    <div className="flex items-center justify-between border-b-2 border-slate-700/50 pb-3">
                      <h2 className="text-lg font-black text-white flex items-center gap-2 font-sans">
                        <TrendingUp className="w-5 h-5 text-orange-400" /> Thống kê Tiến độ Học tập
                      </h2>
                      <span className="text-xs font-bold text-slate-400 bg-slate-800/60 px-3.5 py-1 rounded-full border border-slate-700/50 shadow-sm">
                        Thời gian thực
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-950/60 p-4 rounded-xl border-2 border-emerald-500/40 text-center shadow-lg relative overflow-hidden group hover:border-emerald-500/80 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-emerald-500/20 group-hover:text-emerald-500/50 transition-colors">
                          <Award className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-emerald-400 block font-sans">
                          <NumberCounter value={92} format={(v) => `${v}%`} />
                        </span>
                        <span className="text-xs font-extrabold text-slate-300 block mt-1">Chính xác Flashcard</span>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border-2 border-orange-500/40 text-center shadow-lg relative overflow-hidden group hover:border-orange-500/80 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-orange-500/20 group-hover:text-orange-500/50 transition-colors">
                          <HelpCircle className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-orange-400 block font-sans">
                          <NumberCounter value={8} format={(v) => `${v}/10`} />
                        </span>
                        <span className="text-xs font-extrabold text-slate-300 block mt-1">Bài Quiz hoàn thành</span>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border-2 border-indigo-500/40 text-center shadow-lg relative overflow-hidden group hover:border-indigo-500/80 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-indigo-500/20 group-hover:text-indigo-500/50 transition-colors">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-indigo-400 block font-sans">
                          <NumberCounter value={1050} format={(v) => v.toLocaleString()} />
                        </span>
                        <span className="text-xs font-extrabold text-slate-300 block mt-1">Từ vựng đã thuộc</span>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border-2 border-amber-500/40 text-center shadow-lg relative overflow-hidden group hover:border-amber-500/80 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-amber-500/20 group-hover:text-amber-500/50 transition-colors">
                          <Layers className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-amber-400 block font-sans">
                          <NumberCounter value={5} format={(v) => `${v} Ngày`} />
                        </span>
                        <span className="text-xs font-extrabold text-slate-300 block mt-1">Chuỗi ngày học liên tục</span>
                      </div>
                    </div>
                  </div>
                  <BadgeCollection />
                </div>
              )}
              {activeTab === 'admin' && <AdminView />}
            </PageTransition>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
  );
}
