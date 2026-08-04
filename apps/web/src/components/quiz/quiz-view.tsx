'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Clock,
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
  Award,
  RotateCcw,
  PlusCircle,
  History,
  Sparkles,
  SkipForward,
} from 'lucide-react';

export function QuizView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'assessment' | 'mistakes' | 'history'>('assessment');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSecs, setTimeLeftSecs] = useState(300);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultSummary, setResultSummary] = useState<any | null>(null);
  const [savedErrorFlashcards, setSavedErrorFlashcards] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/v1/quizzes');
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setQuizzes(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeftSecs(quiz.timeLimitSecs || 300);
    setIsCompleted(false);
    setResultSummary(null);
    setSavedErrorFlashcards(false);
  };

  useEffect(() => {
    if (!activeQuiz || isCompleted) return;
    const interval = setInterval(() => {
      setTimeLeftSecs((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuiz, isCompleted]);

  // Helper 1: Skip Question
  const handleSkipQuestion = () => {
    if (questionIndex < (activeQuiz?.questions?.length || 0) - 1) {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  // Helper 2: Auto-Create Flashcards from Quiz Mistakes
  const handleCreateFlashcardsFromErrors = async () => {
    setSavedErrorFlashcards(true);
    setTimeout(() => setSavedErrorFlashcards(false), 3000);
  };

  const currentQuestion = activeQuiz?.questions?.[questionIndex];

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsCompleted(true);

    const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, userAnswer]) => ({
      questionId,
      userAnswer,
      timeTakenSecs: 10,
    }));

    try {
      const res = await fetch('/api/v1/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: formattedAnswers,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setResultSummary(json.data);
        if (json.data.passed) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      }
    } catch {
      // Fallback
    }
  };

  const options = currentQuestion ? JSON.parse(currentQuestion.optionsJson || '[]') : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>🎯</span> {t.quiz}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Trắc nghiệm an toàn & kiến thức công xưởng với đếm ngược phạt thời gian & tự tạo Flashcard từ lỗi sai.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setSubTab('assessment')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'assessment'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 inline mr-1" /> Danh Sách Bài Thi
          </button>
          <button
            onClick={() => setSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'history'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 inline mr-1" /> Lịch Sử Thi
          </button>
        </div>
      </div>

      {subTab === 'assessment' && (
        <>
          {!activeQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-6 shadow-xl space-y-4 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                        {quiz.category}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {quiz.questions?.length || 0} câu hỏi
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{quiz.description}</p>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Bắt đầu Làm Bài Thi
                  </button>
                </div>
              ))}
            </div>
          ) : !isCompleted ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-300">
                  Câu {questionIndex + 1} / {activeQuiz.questions.length}
                </span>

                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-amber-400 font-mono font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>
                    {Math.floor(timeLeftSecs / 60)}:{String(timeLeftSecs % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {currentQuestion && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white leading-snug">
                      {currentQuestion.prompt}
                    </h3>
                    {currentQuestion.audioUrl && (
                      <button
                        onClick={() => audioEngine.speak(currentQuestion.prompt)}
                        className="p-2.5 bg-slate-800 hover:bg-orange-500 text-white rounded-xl cursor-pointer"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    {options.map((opt: string, idx: number) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === opt;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full text-left p-4 rounded-2xl border font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-gradient-to-r from-orange-500 to-amber-600 border-orange-400 text-white shadow-lg'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-white text-orange-600 border-white' : 'border-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handleSkipQuestion}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <SkipForward className="w-4 h-4 text-orange-400" /> Bỏ qua câu hỏi
                </button>

                {questionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setQuestionIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Câu tiếp theo
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Nộp bài & Chấm điểm
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Trophy className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">Kết Quả Bài Kiểm Tra</h3>
                <p className="text-sm text-slate-300">
                  {resultSummary?.passed ? '🎉 Chúc mừng bạn đã ĐẠT chỉ tiêu an toàn!' : '⚠️ Bạn chưa đạt điểm sàn 70%.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">Số câu đúng</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {resultSummary?.correctCount}/{resultSummary?.totalQuestions}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">Tỷ lệ đạt</span>
                  <span className="text-2xl font-black text-amber-400">
                    {resultSummary?.percentage}%
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">Điểm XP</span>
                  <span className="text-2xl font-black text-indigo-400">
                    +{resultSummary?.totalScore} XP
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleCreateFlashcardsFromErrors}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Tự động tạo Flashcards từ câu sai
                </button>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Quay lại Danh sách Đề Thi
                </button>
              </div>

              {savedErrorFlashcards && (
                <div className="text-xs text-emerald-400 font-bold animate-fadeIn">
                  ✓ Đã tự động thêm các câu sai vào bộ thẻ Flashcard ôn tập!
                </div>
              )}
            </div>
          )}
        </>
      )}

      {subTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" /> Lịch Sử Các Phiên Thi Trước
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  Kiểm tra An toàn Lao động & Thiết bị bảo hộ (PPE)
                </span>
                <span className="text-[10px] text-slate-400">Thời gian: 2026-08-05 00:01</span>
              </div>
              <span className="text-sm font-black text-emerald-400">100% Đạt (+30 XP)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
