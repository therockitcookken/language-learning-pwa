'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Check,
  Sparkles,
} from 'lucide-react';

export function GrammarView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'zh_grammar' | 'en_grammar' | 'exercises'>('zh_grammar');
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  // Exercise quiz state
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchLessons = async (lang: string) => {
    try {
      const res = await fetch(`/api/v1/grammar/lessons?lang=${lang}`);
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
    if (subTab === 'zh_grammar') fetchLessons('zh');
    else if (subTab === 'en_grammar') fetchLessons('en');
  }, [subTab]);

  return (
    <div className="space-y-6">
      {/* Header & Sub-tab Pill Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>📝</span> {t.grammar}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hệ thống bài học ngữ pháp công nghiệp HSK & CEFR với ví dụ Đúng/Sai và tình huống nhà máy.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setSubTab('zh_grammar')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'zh_grammar'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇨🇳 Ngữ pháp Tiếng Trung
          </button>
          <button
            onClick={() => setSubTab('en_grammar')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'en_grammar'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇺🇸 Ngữ pháp Tiếng Anh
          </button>
          <button
            onClick={() => setSubTab('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'exercises'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✏️ Bài tập Luyện tập
          </button>
        </div>
      </div>

      {(subTab === 'zh_grammar' || subTab === 'en_grammar') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List Column */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-[700px] overflow-y-auto shadow-xl">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2">
              Danh sách bài học ({lessons.length})
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
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-900 text-orange-400 border border-orange-500/20">
                      {lesson.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {lesson.factoryDomain}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mt-1.5 line-clamp-2">{lesson.titleVi}</h4>
                </button>
              );
            })}
          </div>

          {/* Detailed Lesson Card */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            {selectedLesson && (
              <div className="space-y-5">
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
                </div>

                <div className="bg-gradient-to-r from-amber-950/60 to-orange-950/60 border border-orange-500/40 p-4 rounded-xl space-y-1">
                  <div className="text-xs font-extrabold text-orange-300 uppercase tracking-wider">
                    🧪 Công thức cấu trúc:
                  </div>
                  <div className="text-base font-black text-white font-mono">
                    {selectedLesson.formula}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-200">Giải thích cách dùng:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {selectedLesson.explanationVi}
                  </p>
                </div>

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
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'exercises' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-2xl">
          <h3 className="text-xl font-black text-white text-center">
            Bài Tập Luyện Cấu Trúc Ngữ Pháp Công Xưởng
          </h3>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs text-orange-400 font-bold uppercase">
              [Câu hỏi 1] Chọn câu đúng cho chỉ thị an toàn vào xưởng:
            </span>
            <p className="text-sm font-bold text-white leading-relaxed">
              Điền trợ từ/động từ đúng vào chỗ trống: 进入车间 ______ 佩戴安全帽。
            </p>
          </div>

          <div className="space-y-3">
            {['必须 (Nhất định phải)', '要必须', '把', '被'].map((opt, idx) => {
              const isCorrect = idx === 0;
              const isSelected = selectedAnswerIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAnswerIdx(idx);
                    setIsAnswered(true);
                  }}
                  className={`w-full text-left p-4 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isAnswered && isSelected
                      ? isCorrect
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span>{opt}</span>
                  {isAnswered && isSelected && (
                    isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
