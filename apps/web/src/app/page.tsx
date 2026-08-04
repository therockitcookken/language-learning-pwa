'use client';

import React, { useState } from 'react';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { FactoryMap2D } from '@/components/dashboard/factory-map-2d';
import { DictionaryView } from '@/components/dictionary/dictionary-view';
import { PronunciationView } from '@/components/pronunciation/pronunciation-view';
import { GrammarView } from '@/components/grammar/grammar-view';
import { FlashcardView } from '@/components/flashcard/flashcard-view';
import { QuizView } from '@/components/quiz/quiz-view';
import { NotebookView } from '@/components/notebook/notebook-view';
import { AdminView } from '@/components/admin/admin-view';
import { BookOpen, Volume2, HelpCircle, Layers, Flame, Trophy, Award } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleSelectZoneFromMap = (zoneDomain: string) => {
    setSelectedDomain(zoneDomain);
    setActiveTab('dictionary');
  };

  return (
    <I18nProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        {/* Header */}
        <Header userRole="LEARNER" isGuest={true} xp={180} streak={5} />

        {/* Main Workspace Layout */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {/* Desktop Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl -z-0" />
                  <div className="relative z-10 space-y-3 max-w-2xl">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md">
                      Ứng dụng Học tiếng Trung & Tiếng Anh Công Xưởng
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                      Làm Chủ Ngôn Ngữ Nhà Máy – Nâng Cao Tay Nghề & Lương Thuởng!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Thiết kế tối ưu cho công nhân, kỹ thuật viên, quản lý chuyền & nhân viên bảo trì. Học giao tiếp an toàn, thao tác máy CNC, băng chuyền & báo cáo QC thực tế.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('dictionary')}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer transition-all flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" /> Tra Từ Điển Công Xưởng
                      </button>
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer transition-all flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" /> Làm Bài Kiểm Tra An Toàn
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive 2D Factory Map */}
                <FactoryMap2D onSelectZone={handleSelectZoneFromMap} />

                {/* Daily Learning Milestones & Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-amber-950/60 text-amber-400 rounded-xl border border-amber-500/30">
                      <Flame className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Chuỗi học Streak</span>
                      <span className="text-lg font-black text-white">5 Ngày Liên Tiếp</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-500/30">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Tổng điểm tích lũy</span>
                      <span className="text-lg font-black text-white">180 XP</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-500/30">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Từ vựng đã ghi nhớ</span>
                      <span className="text-lg font-black text-white">125 Từ vựng</span>
                    </div>
                  </div>
                </div>
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">📊 Thống kê Tiến độ Học tập</h2>
                <p className="text-xs text-slate-400">
                  Biểu đồ tỷ lệ ghi nhớ SM-2, kết quả bài thi quiz và thời gian học hằng ngày.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-3xl font-black text-emerald-400">92%</span>
                    <span className="text-xs text-slate-400 block mt-1">Độ chính xác Flashcard</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-3xl font-black text-orange-400">8/10</span>
                    <span className="text-xs text-slate-400 block mt-1">Bài Quiz đã hoàn thành</span>
                  </div>
                </div>
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
