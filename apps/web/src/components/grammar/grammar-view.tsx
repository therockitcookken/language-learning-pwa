'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { FileCode, CheckCircle2, XCircle, AlertTriangle, BookOpen } from 'lucide-react';

export function GrammarView() {
  const { t } = useI18n();
  const [lang, setLang] = useState('all');
  const [level, setLevel] = useState('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams();
      if (lang !== 'all') params.set('lang', lang);
      if (level) params.set('level', level);

      const res = await fetch(`/api/v1/grammar/lessons?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setLessons(json.data);
        if (json.data.length > 0) setSelectedLesson(json.data[0]);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [lang, level]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>📝</span> {t.grammar}
          </h2>
          <p className="text-xs text-slate-400">
            Hệ thống cấu trúc ngữ pháp công nghiệp tiếng Trung HSK & tiếng Anh CEFR với tình huống nhà máy thực tế.
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setLang('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'all' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setLang('zh')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'zh' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            🇨🇳 Tiếng Trung
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            🇺🇸 Tiếng Anh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lesson Cards List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-[700px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Danh sách bài ngữ pháp ({lessons.length})
          </div>

          {lessons.map((lesson) => {
            const isSelected = selectedLesson?.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-orange-500 shadow-md text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-orange-400 border border-orange-500/20">
                    {lesson.level}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    {lesson.factoryDomain}
                  </span>
                </div>
                <h4 className="text-sm font-bold mt-1.5 line-clamp-2">{lesson.titleVi}</h4>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Lesson Content */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
          {selectedLesson ? (
            <div className="space-y-5">
              {/* Header Info */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                    {selectedLesson.level}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    Chủ đề: {selectedLesson.topic}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-2">{selectedLesson.titleVi}</h3>
                {selectedLesson.titleZh && (
                  <p className="text-sm text-orange-400 font-semibold mt-1">
                    {selectedLesson.titleZh}
                  </p>
                )}
              </div>

              {/* Formula Card */}
              <div className="bg-gradient-to-r from-amber-950/60 to-orange-950/60 border border-orange-500/40 p-4 rounded-xl space-y-1">
                <div className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                  🧪 Công thức cấu trúc:
                </div>
                <div className="text-base font-black text-white font-mono">
                  {selectedLesson.formula}
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-200">Giải thích cách dùng:</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  {selectedLesson.explanationVi}
                </p>
              </div>

              {/* Correct vs Wrong Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Ví dụ Dùng Đúng:
                  </div>
                  <p className="text-xs text-emerald-200 font-medium">
                    {selectedLesson.correctExample}
                  </p>
                </div>

                <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <XCircle className="w-4 h-4" /> Lỗi Thường Gặp (Sai):
                  </div>
                  <p className="text-xs text-rose-200 font-medium">
                    {selectedLesson.wrongExample}
                  </p>
                </div>
              </div>

              {/* Factory Scenario Context */}
              {selectedLesson.factoryScenario && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" /> Tình huống Nhà máy Thực tế:
                  </div>
                  <p className="text-xs text-slate-300">{selectedLesson.factoryScenario}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              Chọn bài ngữ pháp từ danh sách bên trái để học.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
