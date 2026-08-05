'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ArrowLeftRight,
  Download,
  Volume2,
  Filter,
  Search,
  Factory,
  RotateCcw,
  MessageSquare,
  Sparkles,
  SkipForward,
  Trophy,
  Flame,
  Globe,
  HelpCircle,
  RefreshCw,
  Check,
} from 'lucide-react';
import {
  GRAMMAR_DATASET,
  GrammarLessonRecord,
  getGrammarLessons,
  GRAMMAR_COMPARISONS,
  GRAMMAR_ERROR_LAB,
  GRAMMAR_DIALOGUES,
} from '@/lib/data/grammar-dataset';
import {
  GRAMMAR_1000_EXERCISES,
  getGrammarExercisesFiltered,
  GrammarExerciseItem,
} from '@/lib/data/grammar-exercise-generator';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

export function GrammarView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'zh_grammar' | 'en_grammar' | 'exercises' | 'comparison' | 'error_lab' | 'dialogues'>('zh_grammar');
  const [lessons, setLessons] = useState<GrammarLessonRecord[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<GrammarLessonRecord | null>(null);

  // Filters State for Theory Lessons
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // View Options State (Chinese Simplified vs Traditional)
  const [isTraditional, setIsTraditional] = useState<boolean>(false);

  // Sentence Scrambler Practice State (Lesson-based)
  const [userArranged, setUserArranged] = useState<string[]>([]);
  const [isScrambleCorrect, setIsScrambleCorrect] = useState<boolean | null>(null);

  // 1,000+ Exercise Suite State
  const [exLangFilter, setExLangFilter] = useState<'all' | 'zh' | 'en'>('all');
  const [exTypeFilter, setExTypeFilter] = useState<'all' | 'scramble' | 'fill_blank'>('all');
  const [exIndex, setExIndex] = useState<number>(0);
  const [exScore, setExScore] = useState<number>(0);
  const [exStreak, setExStreak] = useState<number>(0);
  const [exUserArranged, setExUserArranged] = useState<string[]>([]);
  const [exSelectedOption, setExSelectedOption] = useState<number | null>(null);
  const [exIsChecked, setExIsChecked] = useState<boolean>(false);
  const [exIsCorrect, setExIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Get active 1000-exercise subset (Memoized for high performance)
  const activeExercises = useMemo(
    () => getGrammarExercisesFiltered(exLangFilter, exTypeFilter),
    [exLangFilter, exTypeFilter]
  );
  const currentExItem: GrammarExerciseItem | undefined = activeExercises[exIndex % Math.max(1, activeExercises.length)];

  // Fetch / Filter Lessons for Theory Tabs
  useEffect(() => {
    const lang = subTab === 'zh_grammar' ? 'zh' : subTab === 'en_grammar' ? 'en' : 'all';
    const levelParam = selectedLevel === 'all' ? '' : selectedLevel;
    const topicParam = selectedTopic === 'all' ? '' : selectedTopic;

    const filtered = getGrammarLessons(lang, levelParam, topicParam, searchQuery);
    setLessons(filtered);

    if (filtered.length > 0) {
      if (!selectedLesson || !filtered.some((l) => l.id === selectedLesson.id)) {
        setSelectedLesson(filtered[0]);
      }
    } else {
      setSelectedLesson(null);
    }
  }, [subTab, selectedLevel, selectedTopic, searchQuery]);

  // Reset exercise state when selected lesson changes
  useEffect(() => {
    if (selectedLesson) {
      setUserArranged([]);
      setIsScrambleCorrect(null);
    }
  }, [selectedLesson]);

  // Audio Playback Handler
  const handlePlayAudio = (text: string, lang: 'zh-CN' | 'en-US') => {
    pronunciationAudioService.playSound({
      text,
      langCode: lang,
      speed: 1.0,
    });
  };

  // CSV Export Handler
  const handleExportGrammar = () => {
    const content =
      'data:text/csv;charset=utf-8,\uFEFF' +
      ['Tên bài học,Cấp độ,Chủ đề,Công thức,Ví dụ đúng,Giải thích']
        .concat(
          lessons.map(
            (l) =>
              `"${l.titleVi}","${l.level}","${l.topic}","${l.formula}","${l.correctExampleZh || l.correctExampleEn}","${l.explanationVi}"`
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

  // Lesson-based Scrambler Handlers
  const handleWordClick = (word: string) => {
    if (userArranged.includes(word)) {
      setUserArranged(userArranged.filter((w) => w !== word));
    } else {
      setUserArranged([...userArranged, word]);
    }
  };

  const handleResetScramble = () => {
    setUserArranged([]);
    setIsScrambleCorrect(null);
  };

  const checkSentenceOrder = () => {
    if (!selectedLesson) return;
    const targetOrder = selectedLesson.correctOrder.join(selectedLesson.language === 'zh' ? '' : ' ');
    const userOrder = userArranged.join(selectedLesson.language === 'zh' ? '' : ' ');
    setIsScrambleCorrect(userOrder === targetOrder);
  };

  // 1,000+ Exercise Suite Handlers
  const resetExState = () => {
    setExUserArranged([]);
    setExSelectedOption(null);
    setExIsChecked(false);
    setExIsCorrect(null);
    setShowHint(false);
  };

  const handleExNext = () => {
    resetExState();
    setExIndex((prev) => (prev + 1) % activeExercises.length);
  };

  const handleExWordClick = (word: string) => {
    if (exIsChecked) return;
    if (exUserArranged.includes(word)) {
      setExUserArranged(exUserArranged.filter((w) => w !== word));
    } else {
      setExUserArranged([...exUserArranged, word]);
    }
  };

  const handleExCheckAnswer = () => {
    if (!currentExItem || exIsChecked) return;

    let correct = false;
    if (currentExItem.type === 'scramble') {
      const joinChar = currentExItem.language === 'zh' ? '' : ' ';
      const userText = exUserArranged.join(joinChar).trim();
      const targetText = (currentExItem.correctOrder || []).join(joinChar).trim();
      correct = userText === targetText || userText === currentExItem.correctAnswerText.trim();
    } else if (currentExItem.type === 'fill_blank') {
      correct = exSelectedOption === (currentExItem.correctAnswerIndex ?? 0);
    }

    setExIsChecked(true);
    setExIsCorrect(correct);

    if (correct) {
      setExScore((s) => s + 10);
      setExStreak((st) => st + 1);
    } else {
      setExStreak(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-md">
              <FileCode className="w-6 h-6" />
            </div>
            <span>{t.grammar}</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1.5">
            Hệ thống 12 Thì Tiếng Anh & 17 Cấu Trúc Thời–Thể Tiếng Trung kèm Ngân hàng 1.000+ bài tập luyện tập.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl backdrop-blur-xl shadow-md">
          <button
            type="button"
            onClick={() => setSubTab('zh_grammar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'zh_grammar'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇨🇳</span> Tiếng Trung
          </button>
          <button
            type="button"
            onClick={() => setSubTab('en_grammar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'en_grammar'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇬🇧</span> Tiếng Anh
          </button>
          <button
            type="button"
            onClick={() => setSubTab('exercises')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'exercises'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✍️</span> Bài tập (1.000+)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('comparison')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'comparison'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔀</span> Đối chiếu Trung - Anh
          </button>
          <button
            type="button"
            onClick={() => setSubTab('error_lab')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'error_lab'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚠️</span> Sửa Lỗi Sai
          </button>
          <button
            type="button"
            onClick={() => setSubTab('dialogues')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'dialogues'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>💬</span> Hội thoại
          </button>
        </div>
      </div>

      {/* Sub Tabs 1 & 2: Grammar Theory Lessons (Chinese & English) */}
      {(subTab === 'zh_grammar' || subTab === 'en_grammar') && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm từ khóa, công thức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none placeholder:text-slate-500 w-44"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả cấp độ</option>
                  {subTab === 'zh_grammar' ? (
                    <>
                      <option value="HSK1">HSK 1</option>
                      <option value="HSK2">HSK 2</option>
                      <option value="HSK3">HSK 3</option>
                      <option value="HSK4">HSK 4</option>
                    </>
                  ) : (
                    <>
                      <option value="A1">A1 — Sơ cấp</option>
                      <option value="A2">A2 — Sơ trung cấp</option>
                      <option value="B1">B1 — Trung cấp</option>
                      <option value="B2">B2 — Trung cao cấp</option>
                      <option value="C1">C1 — Cao cấp</option>
                    </>
                  )}
                </select>
              </div>

              {subTab === 'zh_grammar' && (
                <button
                  type="button"
                  onClick={() => setIsTraditional(!isTraditional)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-xl font-mono text-amber-400 text-xs font-bold transition-all"
                >
                  {isTraditional ? '繁體 (Phồn thể)' : '简体 (Giản thể)'}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleExportGrammar}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Xuất Cheatsheet (CSV)
            </button>
          </div>

          {/* Lessons List & Detail Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar List */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 max-h-[700px] overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-2">
                <span>DANH SÁCH BÀI HỌC ({lessons.length})</span>
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>

              {lessons.length === 0 ? (
                <div className="text-center p-6 text-xs text-slate-500 font-mono">
                  Không tìm thấy bài học phù hợp.
                </div>
              ) : (
                lessons.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLesson(item)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer ${
                      selectedLesson?.id === item.id
                        ? subTab === 'zh_grammar'
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                          : 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.level}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.topic}
                      </span>
                    </div>
                    <div className="text-xs font-bold line-clamp-1">{item.titleVi}</div>
                  </button>
                ))
              )}
            </div>

            {/* Right Main Detail Workspace */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
              {!selectedLesson ? (
                <div className="text-center p-12 text-slate-500 font-mono text-xs">
                  Vui lòng chọn bài học từ danh sách bên trái để xem chi tiết.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Lesson Header */}
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {selectedLesson.level}
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase">
                          {selectedLesson.topic}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white">{selectedLesson.titleVi}</h3>
                      <p className="text-xs font-mono text-slate-400">{selectedLesson.titleEn}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSubTab('exercises')}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Luyện Bài Tập Câu Này
                    </button>
                  </div>

                  {/* Formula Box */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-4 h-4" /> Công Thức Ngữ Pháp:
                    </span>
                    <div className="text-sm font-mono font-bold text-emerald-400 bg-slate-900 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                      {selectedLesson.formula}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <div className="font-bold text-slate-200">📌 Cách Dùng & Giải Thích:</div>
                    <p className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      {selectedLesson.explanationVi}
                    </p>
                  </div>

                  {/* Examples Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Correct Example */}
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Ví Dụ Chuẩn Xác:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handlePlayAudio(
                              selectedLesson.correctExampleZh || selectedLesson.correctExampleEn || '',
                              selectedLesson.language === 'zh' ? 'zh-CN' : 'en-US'
                            )
                          }
                          className="p-1.5 bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-300 rounded-lg transition-all"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {selectedLesson.language === 'zh' ? (
                        <>
                          <div className="text-base font-bold text-white">{selectedLesson.correctExampleZh}</div>
                          <div className="text-xs font-mono text-amber-400">{selectedLesson.correctExamplePinyin}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-base font-bold text-white">{selectedLesson.correctExampleEn}</div>
                          <div className="text-xs font-mono text-blue-400">{selectedLesson.correctExampleIpa}</div>
                        </>
                      )}

                      <div className="text-xs text-slate-300 italic pt-1">
                        Dịch: {selectedLesson.correctExampleVi}
                      </div>
                    </div>

                    {/* Common Mistake & Wrong Example */}
                    <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Lỗi Thường Gặp & Chữa Sai:
                      </span>

                      {selectedLesson.wrongExampleZh && (
                        <div className="text-xs font-mono text-rose-300">
                          ❌ {selectedLesson.wrongExampleZh}
                        </div>
                      )}
                      {selectedLesson.wrongExampleEn && (
                        <div className="text-xs font-mono text-rose-300">
                          ❌ {selectedLesson.wrongExampleEn}
                        </div>
                      )}

                      <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        {selectedLesson.wrongExampleVi}
                      </div>
                    </div>
                  </div>

                  {/* Comparison Notes */}
                  {selectedLesson.comparisonNotesVi && (
                    <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-2xl space-y-1 text-xs">
                      <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                        <ArrowLeftRight className="w-4 h-4" /> Nốt Phân Biệt & So Sánh:
                      </span>
                      <p className="text-slate-300">{selectedLesson.comparisonNotesVi}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Comparison Studio View */}
      {subTab === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-indigo-400" /> BỘ SO SÁNH THỜI–THỂ & NGỮ PHÁP TIẾNG TRUNG
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Phân biệt 4 cặp trợ từ/phó từ cốt lõi: 不 vs 没有, 了 vs 过, 在/正在 vs 着, 要 vs 会.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GRAMMAR_COMPARISONS.map((comp) => (
              <div key={comp.id} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-amber-400">{comp.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {comp.category}
                  </span>
                </div>

                <div className="space-y-3">
                  {comp.structures.map((st, idx) => (
                    <div key={idx} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span className="text-emerald-400">{st.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{st.level}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{st.description}</p>
                      <div className="text-amber-300 font-mono bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                        💡 Ví dụ: {st.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 4: Error Lab View */}
      {subTab === 'error_lab' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> ERROR LAB (CHẨN ĐOÁN LỖI NGƯỜI VIỆT THƯỜNG GẶP)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Phân tích nguyên nhân thói quen dịch từ tiếng Việt và quy tắc sửa chuẩn xác.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GRAMMAR_ERROR_LAB.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Mẫu lỗi: {item.vietnameseMistakePattern}
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                    {item.ruleCategory}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl text-rose-200">
                    <span className="font-bold text-rose-400 block mb-0.5">❌ Câu dùng sai:</span>
                    <code>{item.incorrectSentence}</code>
                  </div>
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl text-emerald-200">
                    <span className="font-bold text-emerald-400 block mb-0.5">✅ Câu sửa đúng:</span>
                    <code>{item.correctSentence}</code>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl text-slate-300 leading-relaxed border border-slate-800">
                    <strong className="text-amber-400">💡 Giải thích nguyên nhân gốc:</strong> {item.explanationVi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 5: Dialogue Lab View */}
      {subTab === 'dialogues' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" /> DIALOGUE LAB (HỘI THOẠI GIAO TIẾP ĐỜI SỐNG)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Các bài hội thoại tình huống đời sống tích hợp trực tiếp điểm ngữ pháp đã học.
            </p>
          </div>

          <div className="space-y-6">
            {GRAMMAR_DIALOGUES.map((diag) => (
              <div key={diag.id} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-white">{diag.title}</h4>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-3 py-1 rounded-xl border border-indigo-500/30">
                    {diag.topic}
                  </span>
                </div>

                <div className="space-y-3">
                  {diag.turns.map((turn, idx) => (
                    <div key={idx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-300">
                        <span>{turn.speaker}</span>
                      </div>
                      {turn.zh && <div className="text-sm font-bold text-white">{turn.zh}</div>}
                      {turn.pinyin && <div className="text-xs font-mono text-amber-400">{turn.pinyin}</div>}
                      {turn.textEn && <div className="text-sm font-bold text-white">{turn.textEn}</div>}
                      {turn.ipa && <div className="text-xs font-mono text-blue-400">{turn.ipa}</div>}
                      <div className="text-xs text-slate-300 italic pt-1">{turn.translationVi}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab 6: 1,000+ Exercise Suite View with Chinese & English Separation & Qua Bài Feature */}
      {subTab === 'exercises' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 shadow-2xl">
          {/* Header & Title */}
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-300 font-mono text-xs px-3 py-1 rounded-full font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Ngân Hàng 1.000+ Bài Tập Ngữ Pháp
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              LUYỆN BÀI TẬP NGỮ PHÁP TIẾNG TRUNG & TIẾNG ANH
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Hệ thống chia tách rõ rệt bài tập HSK Tiếng Trung và 12 Thì Tiếng Anh kèm tính năng Qua Bài tiếp theo.
            </p>
          </div>

          {/* Top Control Bar 1: Language Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Ngôn ngữ:
              </span>
              <button
                type="button"
                onClick={() => {
                  setExLangFilter('all');
                  setExIndex(0);
                  resetExState();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exLangFilter === 'all'
                    ? 'bg-slate-700 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                🌐 Tất cả (1.000+)
              </button>
              <button
                type="button"
                onClick={() => {
                  setExLangFilter('zh');
                  setExIndex(0);
                  resetExState();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  exLangFilter === 'zh'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-amber-300 border border-slate-800'
                }`}
              >
                <span>🇨🇳</span> Tiếng Trung (HSK)
              </button>
              <button
                type="button"
                onClick={() => {
                  setExLangFilter('en');
                  setExIndex(0);
                  resetExState();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  exLangFilter === 'en'
                    ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-blue-300 border border-slate-800'
                }`}
              >
                <span>🇬🇧</span> Tiếng Anh (CEFR)
              </button>
            </div>

            {/* Score & Streak Badges */}
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <div className="flex items-center gap-1 bg-amber-950/40 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                <Trophy className="w-3.5 h-3.5" /> Score: {exScore}
              </div>
              <div className="flex items-center gap-1 bg-orange-950/40 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-xl">
                <Flame className="w-3.5 h-3.5" /> Streak: {exStreak}
              </div>
            </div>
          </div>

          {/* Top Control Bar 2: Exercise Type Filter Tabs & Skip Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Dạng bài tập:</span>
              <button
                type="button"
                onClick={() => {
                  setExTypeFilter('all');
                  setExIndex(0);
                  resetExState();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  exTypeFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả dạng
              </button>
              <button
                type="button"
                onClick={() => {
                  setExTypeFilter('scramble');
                  setExIndex(0);
                  resetExState();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  exTypeFilter === 'scramble' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🧩 Sắp xếp từ
              </button>
              <button
                type="button"
                onClick={() => {
                  setExTypeFilter('fill_blank');
                  setExIndex(0);
                  resetExState();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  exTypeFilter === 'fill_blank' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ✍️ Điền từ / Trợ từ
              </button>
            </div>

            {/* "Qua Bài" Button */}
            <button
              type="button"
              onClick={handleExNext}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <span>⏭️ Qua bài tiếp theo</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
              <span>Tiến độ luyện tập: Câu {(exIndex % Math.max(1, activeExercises.length)) + 1} / {activeExercises.length}</span>
              <span>{Math.round((((exIndex % Math.max(1, activeExercises.length)) + 1) / Math.max(1, activeExercises.length)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (((exIndex % Math.max(1, activeExercises.length)) + 1) / Math.max(1, activeExercises.length)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Active Exercise Display Card */}
          {!currentExItem ? (
            <div className="text-center p-8 text-xs text-slate-500 font-mono">
              Không có bài tập phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl relative">
              {/* Exercise Category & Hint Toggle Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                  {currentExItem.category} — {currentExItem.lessonTitle}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Ẩn Gợi Ý' : '💡 Xem Gợi Ý Cách Làm'}</span>
                  </button>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    {currentExItem.language === 'zh' ? '🇨🇳 Tiếng Trung' : '🇬🇧 Tiếng Anh'}
                  </span>
                </div>
              </div>

              {/* Toggleable Hint Guide Box */}
              {showHint && currentExItem.hintGuideVi && (
                <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-2xl text-amber-200 text-xs leading-relaxed animate-in fade-in flex items-start gap-2 shadow-lg">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="text-amber-400 block font-bold">💡 Gợi Ý Cách Làm / Mẹo Giải:</strong>
                    <p className="text-slate-200 font-normal">{currentExItem.hintGuideVi}</p>
                  </div>
                </div>
              )}

              {/* Exercise Prompt & Translation/Pinyin Info Banner */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="text-sm font-bold text-white leading-relaxed">
                  {currentExItem.promptVi}
                </div>

                {/* Vietnamese Meaning, Pinyin/IPA & Syntactic Component Breakdown Guidance */}
                <div className="flex flex-col gap-1.5 text-xs pt-2 border-t border-slate-800/80">
                  {currentExItem.translationVi && (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>🇻🇳 Nghĩa Tiếng Việt:</span>
                      <span className="text-slate-200 font-normal">{currentExItem.translationVi}</span>
                    </div>
                  )}
                  {currentExItem.language === 'zh' && currentExItem.pinyinSentence && (
                    <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px]">
                      <span>🔤 Phiên âm Pinyin:</span>
                      <span className="text-amber-300 font-bold">{currentExItem.pinyinSentence}</span>
                    </div>
                  )}
                  {currentExItem.language === 'en' && currentExItem.ipaSentence && (
                    <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px]">
                      <span>🗣️ Phiên âm IPA:</span>
                      <span className="text-blue-300 font-bold">{currentExItem.ipaSentence}</span>
                    </div>
                  )}

                  {/* Syntactic Component Role Breakdown */}
                  {currentExItem.wordDetails && currentExItem.wordDetails.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                        🔍 Thành Tố Trong Câu (Syntactic Components):
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {currentExItem.wordDetails.map((dt, dtIdx) => (
                          <span
                            key={dtIdx}
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-indigo-950/60 text-indigo-200 border border-indigo-500/30"
                          >
                            <span className="font-bold text-amber-300">{dt.word}</span>: {dt.roleVi}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mode A: Sentence Scrambler */}
              {currentExItem.type === 'scramble' && (
                <div className="space-y-4">
                  {/* User Arranged Words Bar */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 min-h-[85px] flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span>Câu bạn đã xếp:</span>
                      {exUserArranged.length > 0 && !exIsChecked && (
                        <button
                          type="button"
                          onClick={() => setExUserArranged([])}
                          className="text-rose-400 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Làm lại
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {exUserArranged.map((w, idx) => {
                        const detail = (currentExItem.wordDetails || []).find((d) => d.word === w);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleExWordClick(w)}
                            className="flex flex-col items-center px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer shadow transition-all"
                          >
                            <span className="text-xs font-bold">{w}</span>
                            {currentExItem.language === 'zh' && detail?.pinyin && (
                              <span className="text-[9px] font-mono text-orange-200">{detail.pinyin}</span>
                            )}
                            <span className="text-[9px] text-orange-100 font-normal">({detail?.meaningVi || w})</span>
                            {detail?.roleVi && (
                              <span className="text-[8px] font-mono text-orange-200 bg-orange-700/60 px-1 rounded mt-0.5">
                                {detail.roleVi}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scrambled Word Buttons with Pinyin, Meaning & Syntactic Role */}
                  <div className="space-y-1">
                    <div className="text-center text-[11px] font-mono text-slate-500">
                      Bấm các thẻ từ (kèm Pinyin, Nghĩa Tiếng Việt & Thành tố trong câu):
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                      {(currentExItem.scrambledWords || []).map((w, idx) => {
                        const detail = (currentExItem.wordDetails || []).find((d) => d.word === w);
                        const isSelected = exUserArranged.includes(w);

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleExWordClick(w)}
                            disabled={isSelected || exIsChecked}
                            className={`flex flex-col items-center px-4 py-2 rounded-2xl cursor-pointer transition-all border shadow ${
                              isSelected || exIsChecked
                                ? 'opacity-30 bg-slate-900 border-slate-800 text-slate-500'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 hover:border-amber-500/50 text-slate-200'
                            }`}
                          >
                            <span className="text-sm font-black text-amber-300">{w}</span>
                            {currentExItem.language === 'zh' && detail?.pinyin && (
                              <span className="text-[10px] font-mono text-amber-400/90">{detail.pinyin}</span>
                            )}
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({detail?.meaningVi || w})
                            </span>
                            {detail?.roleVi && (
                              <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30 mt-1">
                                {detail.roleVi}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode B: Fill in the Blank / Multiple Choice */}
              {currentExItem.type === 'fill_blank' && (
                <div className="space-y-4">
                  {/* Blank Sentence Display */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-base font-mono font-bold text-amber-300 text-center">
                    {currentExItem.blankSentence}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentExItem.options || []).map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => !exIsChecked && setExSelectedOption(optIdx)}
                        disabled={exIsChecked}
                        className={`p-3.5 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                          exSelectedOption === optIdx
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Check Answer Button & Qua Bài Action Row */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800/80">
                {!exIsChecked ? (
                  <button
                    type="button"
                    onClick={handleExCheckAnswer}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-all"
                  >
                    Kiểm Tra Kết Quả
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleExNext}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <span>⏭️ Qua Bài Tiếp Theo</span>
                    <SkipForward className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Feedback Alert & Explanation Box */}
              {exIsChecked && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-bold space-y-2 animate-in fade-in ${
                    exIsCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-black">
                    {exIsCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>🎉 Chính xác! (+10 XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>❌ Chưa chính xác!</span>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-300">Đáp án chuẩn: </span>
                    <span className="font-mono text-amber-300 font-bold">{currentExItem.correctAnswerText}</span>
                  </div>

                  <div className="text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed">
                    💡 <strong>Giải thích:</strong> {currentExItem.explanationVi}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
