'use client';

import React from 'react';
import { Volume2, CheckCircle2, XCircle, HelpCircle, Bookmark, AlertCircle, X } from 'lucide-react';
import { audioEngine } from '@/lib/audio/audio-engine';

export interface QuizReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: Array<{
    questionId: string;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanationVi: string;
    pinyinOrIpa?: string;
    language?: 'zh' | 'en';
  }>;
  onBookmark?: (questionId: string) => void;
}

export function QuizReviewModal({ isOpen, onClose, results, onBookmark }: QuizReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>📋</span> Xem Lại Chi Tiết Bài Làm ({results.length} câu)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kiểm tra từng đáp án, giải thích tiếng Việt và phát âm chuẩn.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {results.map((res, idx) => (
            <div
              key={res.questionId || idx}
              className={`p-5 rounded-2xl border space-y-3 transition-all ${
                res.isCorrect ? 'bg-slate-950/70 border-emerald-500/30' : 'bg-slate-950/90 border-rose-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      res.isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    {res.isCorrect ? 'Đúng' : 'Sai'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      audioEngine.speak(res.prompt, res.language === 'zh' ? 'zh-CN' : 'en-US')
                    }
                    className="p-2 bg-slate-800 hover:bg-orange-500 text-white rounded-xl cursor-pointer transition-colors"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {onBookmark && (
                    <button
                      onClick={() => onBookmark(res.questionId)}
                      className="p-2 bg-slate-800 hover:bg-amber-500 text-white rounded-xl cursor-pointer transition-colors"
                      title="Đánh dấu câu hỏi"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">{res.prompt}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-semibold mb-0.5">Đáp án của bạn:</span>
                  <span className={res.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {res.userAnswer || '(Bỏ trống / Chưa chọn)'}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-semibold mb-0.5">Đáp án đúng chuẩn:</span>
                  <span className="text-emerald-400 font-bold">{res.correctAnswer}</span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Giải thích chi tiết:
                </span>
                <p className="leading-relaxed">{res.explanationVi}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
          >
            Đóng Giao Diện Xem Lại
          </button>
        </div>
      </div>
    </div>
  );
}
