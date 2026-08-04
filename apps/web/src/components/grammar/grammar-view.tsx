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
  ArrowLeftRight,
  Download,
  Bookmark,
  Share2,
} from 'lucide-react';

export function GrammarView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'zh_grammar' | 'en_grammar' | 'exercises'>('zh_grammar');
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  // Helper 1: Grammar Comparison Modal State
  const [showComparison, setShowComparison] = useState(false);

  // Helper 2: Sentence Scrambler Words State
  const [scrambledWords, setScrambledWords] = useState<string[]>([
    '车间',
    '必须',
    '进入',
    '佩戴',
    '安全帽',
  ]);
  const [userArranged, setUserArranged] = useState<string[]>([]);
  const [isScrambleCorrect, setIsScrambleCorrect] = useState<boolean | null>(null);

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

  // Helper 3: Export Grammar Cheat Sheet
  const handleExportGrammar = () => {
    const content =
      'data:text/csv;charset=utf-8,' +
      ['Tên bài học,Cấp độ,Công thức,Ví dụ đúng']
        .concat(
          lessons.map(
            (l) => `"${l.titleVi}","${l.level}","${l.formula}","${l.correctExample}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `factory_grammar_cheatsheet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWordClick = (word: string) => {
    if (userArranged.includes(word)) {
      setUserArranged(userArranged.filter((w) => w !== word));
    } else {
      setUserArranged([...userArranged, word]);
    }
  };

  const checkSentenceOrder = () => {
    const result = userArranged.join('') === '进入车间必须佩戴安全帽';
    setIsScrambleCorrect(result);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>📝</span> {t.grammar}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hệ thống cấu trúc ngữ pháp HSK & CEFR công nghiệp với công cụ so sánh & bài tập xếp câu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
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
        <div className="space-y-4">
          {/* Action Toolbar with Helper Buttons */}
          <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowComparison(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-orange-500 text-slate-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> So sánh 必须 vs 应该
              </button>
            </div>
            <button
              onClick={handleExportGrammar}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Xuất Sổ Tay Ngữ Pháp CSV
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lessons List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-[700px] overflow-y-auto shadow-xl">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2">
                Bài học ngữ pháp ({lessons.length})
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

            {/* Lesson Detail */}
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

          {/* Helper 4: Comparison Modal */}
          {showComparison && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white">
                    So sánh: 必须 (Nhất định phải) vs 应该 (Nên)
                  </h3>
                  <button onClick={() => setShowComparison(false)} className="text-slate-400 font-bold">
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-orange-500/30">
                    <span className="font-bold text-orange-400 block mb-1">必须 (bìxū)</span>
                    <p className="text-slate-300">Bắt buộc 100%, áp dụng cho quy định an toàn PCCC, PPE.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/30">
                    <span className="font-bold text-indigo-400 block mb-1">应该 (yīnggāi)</span>
                    <p className="text-slate-300">Lời khuyên nên làm, không bắt buộc vi phạm phạt tiền.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helper 5: Sentence Scrambler Practice */}
      {subTab === 'exercises' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-2xl">
          <h3 className="text-xl font-black text-white text-center">
            Bài Tập Sắp Xếp Từ Thành Câu Chuẩn Ngữ Pháp
          </h3>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-[60px] flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-bold w-full block">Câu đã chọn:</span>
            {userArranged.map((w, idx) => (
              <span
                key={idx}
                onClick={() => handleWordClick(w)}
                className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                {w}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {scrambledWords.map((w, idx) => (
              <button
                key={idx}
                onClick={() => handleWordClick(w)}
                disabled={userArranged.includes(w)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                {w}
              </button>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={checkSentenceOrder}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Kiểm Tra Kết Quả
            </button>
          </div>

          {isScrambleCorrect !== null && (
            <div
              className={`p-4 rounded-2xl border text-xs font-bold text-center ${
                isScrambleCorrect
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950 border-rose-500 text-rose-300'
              }`}
            >
              {isScrambleCorrect ? '🎉 Đúng rồi! 进入车间必须佩戴安全帽。' : '❌ Chưa chính xác, hãy thử lại!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
