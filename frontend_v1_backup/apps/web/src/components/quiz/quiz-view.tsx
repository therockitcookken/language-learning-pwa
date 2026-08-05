'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useI18n } from '@/lib/i18n/i18n-context';
import { ExerciseRenderer } from './exercise-renderer';
import { QuizStatsDashboard } from './quiz-stats-dashboard';
import { QuizReviewModal } from './quiz-review-modal';
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
  Filter,
  Search,
  BookMarked,
  Pause,
  Play,
  CheckSquare,
  AlertTriangle,
  Download,
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers,
  Lightbulb,
  Zap,
  Mic,
  X,
  FileText,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'agy_quiz_state_v2';

export function QuizView() {
  const { t } = useI18n();

  // 1. Dual Main Language Tabs & Subtabs ('assessment' | 'practice' | 'history' | 'stats' | 'test_session')
  const [mainTab, setMainTab] = useState<'zh' | 'en'>('zh');
  const [subTab, setSubTab] = useState<'assessment' | 'practice' | 'history' | 'stats' | 'test_session'>('assessment');

  // 2. Multi-Filters State for Exercises & Quick Practice
  const [filters, setFilters] = useState({
    level: 'all',
    topic: 'all',
    skill: 'all',
    type: 'all',
    search: '',
    difficulty: 'all',
    questionCount: 10,
    timeLimitSecs: 300,
    status: 'all',
    autoPlayVoice: true,
    showHintByDefault: true,
  });

  // 3. Exercise Data & Pagination State
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 4. Test Session State
  const [activeSession, setActiveSession] = useState<{
    mode: 'unlimited' | 'quick' | 'exam' | 'adaptive' | 'retry_wrong' | 'bookmarked';
    title: string;
    questions: any[];
    currentIndex: number;
    userAnswers: Record<string, string>;
    isPaused: boolean;
    timeLeftSecs: number;
    isCompleted: boolean;
    adaptiveLevel: string;
    bookmarkedIds: string[];
    showHintByDefault?: boolean;
  } | null>(null);

  // 5. Results & Review Modal State
  const [resultSummary, setResultSummary] = useState<any | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [historyStats, setHistoryStats] = useState<any>({
    totalAttempts: 0,
    highestScore: 0,
    passRate: 0,
    totalQuestionsAnswered: 0,
  });

  // 6. UI Toasts & Bookmarks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Restore State from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mainTab) setMainTab(parsed.mainTab);
        if (parsed.filters) setFilters((prev) => ({ ...prev, ...parsed.filters }));
        if (parsed.bookmarkedQuestionIds) setBookmarkedQuestionIds(parsed.bookmarkedQuestionIds);
        if (parsed.activeSession && !parsed.activeSession.isCompleted) {
          setActiveSession(parsed.activeSession);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  // Save State to LocalStorage (Optimized to avoid JSON serialization every second)
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          mainTab,
          filters,
          bookmarkedQuestionIds,
          activeSession: activeSession
            ? {
                title: activeSession.title,
                mode: activeSession.mode,
                isCompleted: activeSession.isCompleted,
                isPaused: activeSession.isPaused,
                userAnswers: activeSession.userAnswers,
              }
            : null,
        })
      );
    } catch {
      // Fallback
    }
  }, [mainTab, filters, bookmarkedQuestionIds, activeSession?.title, activeSession?.isCompleted, activeSession?.isPaused, Object.keys(activeSession?.userAnswers || {}).length]);

  // Fetch Exercises API with Pagination & Multi-Filters
  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        lang: mainTab,
        level: filters.level,
        topic: filters.topic,
        skill: filters.skill,
        type: filters.type,
        search: filters.search,
        page: page.toString(),
        limit: '15',
      });

      const res = await fetch(`/api/v1/quizzes/exercises?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setExercises(json.data);
        setTotalPages(json.pagination.totalPages || 1);
        setTotalCount(json.pagination.total || 0);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch History API
  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/v1/quizzes/history?lang=${mainTab}`);
      const json = await res.json();
      if (json.data) setHistoryItems(json.data);
      if (json.stats) setHistoryStats(json.stats);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchExercises();
    fetchHistory();
  }, [mainTab, filters, page]);

  // Timer Interval for Active Test Session (Optimized timer loop without teardown overhead)
  useEffect(() => {
    if (!activeSession || activeSession.isCompleted || activeSession.isPaused || activeSession.timeLeftSecs === -1) return;

    const timer = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.isCompleted || prev.isPaused) return prev;
        if (prev.timeLeftSecs <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeftSecs: 0, isCompleted: true };
        }
        return { ...prev, timeLeftSecs: prev.timeLeftSecs - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.title, activeSession?.isPaused, activeSession?.isCompleted]);

  // Keyboard Shortcuts Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeSession || activeSession.isCompleted || subTab !== 'test_session') return;

      const currentQ = activeSession.questions[activeSession.currentIndex];
      if (!currentQ) return;

      let opts: string[] = [];
      try {
        opts = JSON.parse(currentQ.optionsJson || '[]');
      } catch {
        opts = [];
      }

      if (['1', '2', '3', '4'].includes(e.key) && opts[parseInt(e.key) - 1]) {
        handleSelectAnswer(opts[parseInt(e.key) - 1]);
      }
      if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const idx = e.key.toLowerCase().charCodeAt(0) - 97;
        if (opts[idx]) handleSelectAnswer(opts[idx]);
      }

      if (e.key === 'Enter') {
        if (activeSession.currentIndex < activeSession.questions.length - 1) {
          handleNextQuestion();
        } else {
          handleSubmitTest();
        }
      }

      if (e.key === 'Escape') {
        togglePauseSession();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSession, subTab]);

  // Start Test Session Helper
  const handleStartTestSession = (
    mode: 'unlimited' | 'quick' | 'exam' | 'adaptive' | 'retry_wrong' | 'bookmarked',
    customQuestions?: any[]
  ) => {
    let pool = customQuestions || exercises;
    if (pool.length === 0) {
      showToast('⚠️ Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.');
      return;
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = mode === 'quick' ? filters.questionCount : Math.min(filters.questionCount, shuffled.length);
    const selectedQuestions = shuffled.slice(0, Math.max(1, count));

    const timeLimit = mode === 'unlimited' ? -1 : filters.timeLimitSecs;

    setActiveSession({
      mode,
      title:
        mode === 'quick'
          ? `Luyện Tập Nhanh (${selectedQuestions.length} câu - ${mainTab === 'zh' ? 'Tiếng Trung' : 'Tiếng Anh'})`
          : mode === 'exam'
          ? `Thi Cấp Độ ${mainTab === 'zh' ? 'HSK' : 'CEFR'} (${selectedQuestions.length} câu)`
          : mode === 'adaptive'
          ? `Thi Thích Ứng (Adaptive Mode)`
          : mode === 'retry_wrong'
          ? `Luyện Thẻ Lỗi Sai (${selectedQuestions.length} câu)`
          : `Bài Luyện Tập Tự Do (${selectedQuestions.length} câu)`,
      questions: selectedQuestions,
      currentIndex: 0,
      userAnswers: {},
      isPaused: false,
      timeLeftSecs: timeLimit,
      isCompleted: false,
      adaptiveLevel: mainTab === 'zh' ? 'HSK1' : 'A1',
      bookmarkedIds: [],
      showHintByDefault: filters.showHintByDefault,
    });

    setSubTab('test_session');
    setResultSummary(null);
    showToast(`🚀 Bắt đầu ${mode === 'quick' ? 'Luyện tập nhanh' : 'bài thi'}!`);
  };

  const handleSelectAnswer = (answer: string) => {
    if (!activeSession || activeSession.isCompleted) return;
    const currentQ = activeSession.questions[activeSession.currentIndex];
    if (!currentQ) return;

    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [currentQ.id]: answer,
        },
      };
    });
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    if (activeSession.currentIndex < activeSession.questions.length - 1) {
      setActiveSession((prev) => (prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null));
    }
  };

  const handlePrevQuestion = () => {
    if (!activeSession) return;
    if (activeSession.currentIndex > 0) {
      setActiveSession((prev) => (prev ? { ...prev, currentIndex: prev.currentIndex - 1 } : null));
    }
  };

  const togglePauseSession = () => {
    setActiveSession((prev) => (prev ? { ...prev, isPaused: !prev.isPaused } : null));
  };

  const cancelSession = () => {
    setActiveSession(null);
    setSubTab('assessment');
    showToast('Đã hủy phiên làm bài.');
  };

  const toggleBookmarkCurrentQuestion = () => {
    if (!activeSession) return;
    const currentQ = activeSession.questions[activeSession.currentIndex];
    if (!currentQ) return;

    setBookmarkedQuestionIds((prev) => {
      const exists = prev.includes(currentQ.id);
      const next = exists ? prev.filter((id) => id !== currentQ.id) : [...prev, currentQ.id];
      showToast(exists ? 'Đã bỏ đánh dấu câu hỏi' : '⭐ Đã lưu câu hỏi vào danh sách đánh dấu');
      return next;
    });
  };

  // Submit Test and Process Results
  const handleSubmitTest = async () => {
    if (!activeSession) return;

    const formattedAnswers = activeSession.questions.map((q) => ({
      questionId: q.id,
      userAnswer: activeSession.userAnswers[q.id] || '',
      timeTakenSecs: 15,
    }));

    try {
      const res = await fetch('/api/v1/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: `quiz-${mainTab}-${filters.level}`,
          questionIds: activeSession.questions.map((q) => q.id),
          answers: formattedAnswers,
          autoCreateFlashcards: true,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setResultSummary(json.data);
        setActiveSession((prev) => (prev ? { ...prev, isCompleted: true } : null));
        if (json.data.passed) {
          confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
        }
        fetchHistory();
      }
    } catch {
      showToast('❌ Đã xảy ra lỗi khi gửi bài làm.');
    }
  };

  const subTabOptions = [
    { id: 'assessment', label: 'Danh Sách Bài Thi', icon: HelpCircle },
    { id: 'practice', label: '⚡ Luyện Tập Nhanh', icon: Zap },
    { id: 'stats', label: 'Dashboard Thống Kê', icon: Trophy },
    { id: 'history', label: 'Lịch Sử Các Phiên Thi', icon: History },
  ];

  if (activeSession) {
    subTabOptions.unshift({
      id: 'test_session',
      label: activeSession.isCompleted ? '🏆 Kết Quả Bài Làm' : '📝 Phiên Bài Thi (Đang chạy)',
      icon: FileText,
    });
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-orange-500 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" /> {toastMessage}
        </div>
      )}

      {/* Main Header & Dual Primary Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span>Kiểm tra & Quiz (6.000 Bài Tập Thật)</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1.5">
            Trắc nghiệm an toàn & kiến thức công xưởng với 17+ dạng bài, đếm ngược phạt thời gian & tự động tạo Flashcards SRS.
          </p>
        </div>

        {/* DUAL PRIMARY LANGUAGE TABS */}
        <div className="flex items-center bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl backdrop-blur-xl shadow-md">
          <button
            onClick={() => {
              setMainTab('zh');
              setPage(1);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === 'zh'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇨🇳</span> 中文测试 – Tiếng Trung
          </button>

          <button
            onClick={() => {
              setMainTab('en');
              setPage(1);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === 'en'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇬🇧</span> English Quiz – Tiếng Anh
          </button>
        </div>
      </div>

      {/* Active Session Alert Banner (if user navigated to another subtab while session is running) */}
      {activeSession && !activeSession.isCompleted && subTab !== 'test_session' && (
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Clock className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              Bạn đang có một bài thi/luyện tập dở: <strong>{activeSession.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubTab('test_session')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer"
            >
              Tiếp tục làm bài
            </button>

            <button
              onClick={cancelSession}
              className="px-3 py-2 bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 rounded-xl cursor-pointer"
            >
              Hủy bài thi
            </button>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subTabOptions.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-orange-400 border border-orange-500/40 shadow-md scale-[1.02]'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 5: ACTIVE TEST SESSION WORKSPACE */}
      {subTab === 'test_session' && activeSession && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          {/* HUD Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl">
                Câu {activeSession.currentIndex + 1} / {activeSession.questions.length}
              </span>
              <span className="text-xs font-bold text-amber-400 hidden sm:inline-block">
                {activeSession.title}
              </span>
            </div>

            {/* Live Timer, Bookmark & Exit Session Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {activeSession.timeLeftSecs !== -1 && (
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-xs border ${
                    activeSession.timeLeftSecs <= 60
                      ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-amber-400'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(activeSession.timeLeftSecs / 60)}:
                    {String(activeSession.timeLeftSecs % 60).padStart(2, '0')}
                  </span>
                </div>
              )}

              <button
                onClick={togglePauseSession}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer text-xs font-bold flex items-center gap-1"
              >
                {activeSession.isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                <span className="hidden sm:inline">{activeSession.isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
              </button>

              <button
                onClick={toggleBookmarkCurrentQuestion}
                className="p-2 bg-slate-800 hover:bg-amber-500 text-amber-300 hover:text-white rounded-xl cursor-pointer"
                title="Đánh dấu câu hỏi"
              >
                <BookMarked className="w-4 h-4" />
              </button>

              <button
                onClick={cancelSession}
                className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                title="Thoát phiên bài thi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{
                width: `${((activeSession.currentIndex + 1) / activeSession.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Paused Overlay */}
          {activeSession.isPaused && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-8 text-center space-y-4 my-6">
              <Pause className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">Đã Tạm Dừng Bài Luyện Tập</h3>
              <p className="text-xs text-slate-400">Tiến độ bài thi của bạn đã được tự động lưu lại.</p>
              <button
                onClick={togglePauseSession}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tiếp tục Làm Bài
              </button>
            </div>
          )}

          {/* Active Question Render */}
          {!activeSession.isPaused && !activeSession.isCompleted && (
            <ExerciseRenderer
              question={activeSession.questions[activeSession.currentIndex]}
              userAnswer={activeSession.userAnswers[activeSession.questions[activeSession.currentIndex]?.id] || ''}
              onAnswerChange={handleSelectAnswer}
              showHintByDefault={activeSession.showHintByDefault}
            />
          )}

          {/* Post-Submission Result View */}
          {activeSession.isCompleted && resultSummary && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Trophy className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">Kết Quả Bài Luyện Tập</h3>
                <p className="text-sm text-slate-300">
                  {resultSummary.passed
                    ? '🎉 Chúc mừng bạn đã hoàn thành bài luyện tập đạt điểm xuất sắc!'
                    : '⚠️ Bạn chưa đạt điểm sàn 70%. Hãy xem giải thích và luyện lại.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">Số câu đúng</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {resultSummary.correctCount}/{resultSummary.totalQuestions}
                  </span>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">Tỷ lệ đạt</span>
                  <span className="text-2xl font-black text-amber-400">
                    {resultSummary.percentage}%
                  </span>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">Điểm XP</span>
                  <span className="text-2xl font-black text-indigo-400">
                    +{resultSummary.totalScore} XP
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckSquare className="w-4 h-4" /> Xem Chi Tiết Đáp Án & Giải Thích
                </button>
                <button
                  onClick={() => {
                    setActiveSession(null);
                    setSubTab('assessment');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Quay Lại Danh Sách Luyện Tập
                </button>
              </div>
            </div>
          )}

          {/* Test Footer Controls */}
          {!activeSession.isCompleted && !activeSession.isPaused && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={handlePrevQuestion}
                disabled={activeSession.currentIndex === 0}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Câu trước
              </button>

              {activeSession.currentIndex < activeSession.questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Câu tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Nộp Bài & Chấm Điểm
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LUYỆN TẬP NHANH (QUICK PRACTICE WITH MULTI-FILTERS & HINTS) */}
      {subTab === 'practice' && (
        <div className="space-y-6">
          {/* Multi-filter Panel Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Bộ Lọc Luyện Tập Nhanh ({mainTab === 'zh' ? 'Tiếng Trung 3.000 Bài' : 'Tiếng Anh 3.000 Bài'})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tùy chỉnh cấp độ, chủ đề công xưởng, dạng bài, hỗ trợ Voice phát âm & Gợi ý cách làm.
                </p>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    level: 'all',
                    topic: 'all',
                    skill: 'all',
                    type: 'all',
                    questionCount: 10,
                  })
                }
                className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Đặt lại bộ lọc
              </button>
            </div>

            {/* Multi-filter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
              {/* Cấp độ */}
              <div>
                <label className="text-slate-400 block font-semibold mb-1">Cấp độ bài tập</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value="all">Tất cả Cấp độ</option>
                  {(mainTab === 'zh' ? ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] : ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kỹ năng */}
              <div>
                <label className="text-slate-400 block font-semibold mb-1">Kỹ năng học</label>
                <select
                  value={filters.skill}
                  onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value="all">Tất cả Kỹ năng</option>
                  <option value="vocabulary">Từ vựng (Vocabulary)</option>
                  <option value="grammar">Ngữ pháp (Grammar)</option>
                  <option value="listening">Nghe hiểu (Listening)</option>
                  <option value="reading">Đọc hiểu (Reading)</option>
                  <option value="pronunciation">Phát âm (Pronunciation)</option>
                  <option value="translation">Dịch thuật (Translation)</option>
                </select>
              </div>

              {/* Dạng bài */}
              <div>
                <label className="text-slate-400 block font-semibold mb-1">Dạng bài tập (17 types)</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value="all">Tất cả 17 Dạng bài</option>
                  <option value="single_choice">Chọn 1 đáp án</option>
                  <option value="multiple_choice">Chọn nhiều đáp án</option>
                  <option value="true_false">Đúng / Sai</option>
                  <option value="fill_blank">Điền từ khuyết</option>
                  <option value="pair_matching">Ghép cặp từ - nghĩa</option>
                  <option value="sentence_order">Sắp xếp câu</option>
                  <option value="listen_pick">Nghe chọn đáp án</option>
                  <option value="pronunciation_pick">Chọn Pinyin / IPA</option>
                  <option value="zh_particles">Trợ từ (了/过/着)</option>
                  <option value="verb_tense">Thì động từ Tiếng Anh</option>
                  <option value="translation">Dịch thuật 4 chiều</option>
                </select>
              </div>

              {/* Số lượng câu */}
              <div>
                <label className="text-slate-400 block font-semibold mb-1">Số câu mỗi đợt</label>
                <select
                  value={filters.questionCount}
                  onChange={(e) => setFilters({ ...filters, questionCount: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value={5}>⚡ 5 câu (Nhanh 2 phút)</option>
                  <option value={10}>🎯 10 câu (Tiêu chuẩn)</option>
                  <option value={20}>🔥 20 câu (Chuyên sâu)</option>
                  <option value={30}>🏆 30 câu (Cấp độ HSK/CEFR)</option>
                </select>
              </div>

              {/* Toggle Options */}
              <div className="flex flex-col justify-center gap-1.5 col-span-2 sm:col-span-1">
                <label className="text-slate-400 block font-semibold">Tùy chọn Hỗ trợ</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showHintByDefault}
                      onChange={(e) => setFilters({ ...filters, showHintByDefault: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950"
                    />
                    <span>💡 Mở sẵn Gợi ý</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Action Start Button */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => handleStartTestSession('quick')}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-2xl shadow-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" /> Bắt Đầu Luyện Tập Nhanh Theo Bộ Lọc ({filters.questionCount} câu)
              </button>

              <button
                onClick={() => handleStartTestSession('retry_wrong')}
                className="px-5 py-3.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-2xl cursor-pointer transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Luyện Lại Các Câu Sai Trong Lịch Sử
              </button>
            </div>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-lg">
              <div className="p-3 rounded-2xl bg-orange-950/50 border border-orange-500/30 text-orange-400 w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Luyện Tập Tự Do không giới hạn</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Luyện tập liên tục với phản hồi đáp án, phát âm Voice và mẹo giải chi tiết từng câu.
              </p>
              <button
                onClick={() => handleStartTestSession('unlimited')}
                className="w-full py-2.5 bg-slate-950 hover:bg-orange-500 hover:text-white border border-slate-800 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Vào Luyện Tự Do
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-lg">
              <div className="p-3 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-amber-400 w-fit">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Luyện Phát Âm & Voice Speech</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Luyện tập các câu nghe hiểu, chọn Pinyin/IPA và kiểm tra phát âm qua bộ nhận diện giọng nói.
              </p>
              <button
                onClick={() => {
                  setFilters({ ...filters, skill: 'pronunciation' });
                  handleStartTestSession('quick');
                }}
                className="w-full py-2.5 bg-slate-950 hover:bg-amber-500 hover:text-white border border-slate-800 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Luyện Phát Âm Ngay
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-lg">
              <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-400 w-fit">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Luyện Ngữ Pháp & Mẹo Cú Pháp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Luyện trợ từ tiếng Trung, thì động từ tiếng Anh và nhận diện vị trí lỗi sai trong câu.
              </p>
              <button
                onClick={() => {
                  setFilters({ ...filters, skill: 'grammar' });
                  handleStartTestSession('quick');
                }}
                className="w-full py-2.5 bg-slate-950 hover:bg-indigo-500 hover:text-white border border-slate-800 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Luyện Ngữ Pháp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: ASSESSMENT CARDS & LIST */}
      {subTab === 'assessment' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-400" /> Bộ Lọc Đa Chiều ({totalCount} Bài Tập {mainTab.toUpperCase()})
              </span>

              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    level: 'all',
                    topic: 'all',
                    skill: 'all',
                    type: 'all',
                    search: '',
                  })
                }
                className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Đặt lại bộ lọc
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block font-semibold mb-1">Cấp độ</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value="all">Tất cả Cấp độ</option>
                  {(mainTab === 'zh' ? ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] : ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block font-semibold mb-1">Kỹ năng</label>
                <select
                  value={filters.skill}
                  onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value="all">Tất cả Kỹ năng</option>
                  <option value="vocabulary">Từ vựng (Vocabulary)</option>
                  <option value="grammar">Ngữ pháp (Grammar)</option>
                  <option value="listening">Nghe hiểu (Listening)</option>
                  <option value="reading">Đọc hiểu (Reading)</option>
                  <option value="pronunciation">Phát âm (Pronunciation)</option>
                  <option value="translation">Dịch thuật (Translation)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block font-semibold mb-1">Dạng bài (17 types)</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value="all">Tất cả Dạng bài</option>
                  <option value="single_choice">Chọn 1 đáp án</option>
                  <option value="multiple_choice">Chọn nhiều đáp án</option>
                  <option value="true_false">Đúng / Sai</option>
                  <option value="fill_blank">Điền từ khuyết</option>
                  <option value="pair_matching">Ghép cặp từ - nghĩa</option>
                  <option value="sentence_order">Sắp xếp câu</option>
                  <option value="listen_pick">Nghe chọn đáp án</option>
                  <option value="pronunciation_pick">Chọn Pinyin / IPA</option>
                  <option value="zh_particles">Trợ từ (了/过/着)</option>
                  <option value="verb_tense">Thì động từ Tiếng Anh</option>
                  <option value="translation">Dịch Việt-Trung-Anh</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block font-semibold mb-1">Số câu thi</label>
                <select
                  value={filters.questionCount}
                  onChange={(e) => setFilters({ ...filters, questionCount: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-orange-500"
                >
                  <option value={5}>5 câu (Thi nhanh)</option>
                  <option value={10}>10 câu (Tiêu chuẩn)</option>
                  <option value={20}>20 câu (Mở rộng)</option>
                  <option value={30}>30 câu (Cấp độ HSK/CEFR)</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-slate-400 block font-semibold mb-1">Tìm kiếm câu hỏi</label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-orange-500">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Gõ từ khóa..."
                    className="w-full bg-transparent text-white placeholder-slate-500 outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                {mainTab === 'zh' ? 'CHINESE HSK 1–6 CORE' : 'ENGLISH CEFR A1–C2 CORE'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {mainTab === 'zh'
                  ? 'Kiểm Tra Tiếng Trung Công Xưởng HSK'
                  : 'Workplace Industrial English Quiz'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống tự động khởi tạo đề thi chuẩn hóa {filters.questionCount} câu dựa trên các bộ lọc đã chọn.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStartTestSession('exam')}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-2xl shadow-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" /> Bắt Đầu Bài Thi Tiêu Chuẩn
              </button>

              <button
                onClick={() => handleStartTestSession('adaptive')}
                className="px-5 py-3.5 bg-slate-950 hover:bg-slate-950 border border-slate-700 text-amber-400 font-bold text-xs rounded-2xl cursor-pointer transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> Thi Thích Ứng (Adaptive)
              </button>
            </div>
          </div>

          {/* Grid of Exercises with Pagination */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse p-6" />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Không tìm thấy bài tập phù hợp</h4>
              <p className="text-xs text-slate-400">Vui lòng điều chỉnh lại bộ lọc cấp độ hoặc dạng bài.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                        {ex.level || 'HSK'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ex.skill}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {ex.prompt}
                    </h4>

                    {ex.pinyinOrIpa && (
                      <span className="text-[11px] font-mono text-amber-400 block">
                        {ex.pinyinOrIpa}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartTestSession('quick', [ex])}
                    className="w-full py-2.5 bg-slate-950 hover:bg-orange-500 hover:text-white border border-slate-800 text-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    Làm riêng câu này <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">
                Trang {page} / {totalPages} (Tổng {totalCount} bài tập)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-30 text-white font-bold rounded-xl cursor-pointer"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-30 text-white font-bold rounded-xl cursor-pointer"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: STATS DASHBOARD */}
      {subTab === 'stats' && (
        <QuizStatsDashboard language={mainTab} historyStats={historyStats} />
      )}

      {/* SUBTAB 4: HISTORY */}
      {subTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" /> Lịch Sử Các Phiên Thi Của Bạn
          </h3>

          {historyItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">Chưa có lịch sử phiên thi nào.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{item.quizTitle}</span>
                    <span className="text-[10px] text-slate-400">
                      Thời gian: {new Date(item.completedAt).toLocaleString()} | Số câu: {item.totalQuestions}
                    </span>
                  </div>
                  <span className={`text-sm font-black ${item.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.percentage}% ({item.passed ? 'Đạt' : 'Chưa đạt'}) (+{item.score} XP)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Modal for Detailed Post-Exam Breakdown */}
      {resultSummary && (
        <QuizReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          results={resultSummary.results || []}
        />
      )}
    </div>
  );
}
