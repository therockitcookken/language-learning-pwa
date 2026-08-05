'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/audio/audio-engine';
import { SRSGrade } from '@/lib/domain/srs-engine';
import {
  Volume2,
  Shuffle,
  Play,
  Pause,
  RotateCw,
  Undo2,
  Mic,
  MicOff,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Edit3,
  Headphones,
  FileText,
  Star,
} from 'lucide-react';

export interface FlashcardItem {
  id: string;
  vocabularyId?: string;
  frontText: string;
  backText: string;
  pinyinOrIpa?: string;
  topic: string;
  factoryDomain: string;
  mnemonic?: string;
  language: 'zh' | 'en';
  isStarred?: boolean;
  hskLevel?: string;
  cefrLevel?: string;
  partOfSpeech?: string;
  meaningEn?: string;
  examples?: Array<{
    sentenceZh?: string;
    sentenceEn?: string;
    sentenceVi?: string;
    pinyin?: string;
  }>;
  synonyms?: Array<{ word: string; pinyin?: string; meaningVi?: string }>;
  antonyms?: Array<{ word: string; pinyin?: string; meaningVi?: string }>;
  relatedWords?: Array<{ word: string; pinyin?: string; meaningVi?: string }>;
  collocations?: Array<{ phrase: string; meaningVi?: string }>;
  schedule?: {
    interval: number;
    repetitions: number;
    easeFactor: number;
    dueDate?: string;
  } | null;
}

export type PracticeMode = 'flip' | 'typing' | 'listen_guess' | 'mc' | 'cloze' | 'voice_recorder';

interface DeckPlayerProps {
  cards: FlashcardItem[];
  lang: 'zh' | 'en';
  onRateCard: (cardId: string, rating: SRSGrade) => Promise<void>;
  onToggleFavorite?: (cardId: string) => void;
}

export function FlashcardDeckPlayer({
  cards,
  lang,
  onRateCard,
  onToggleFavorite,
}: DeckPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isReverseMode, setIsReverseMode] = useState(false); // Question <-> Answer reverse
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('flip');
  const [shuffledCards, setShuffledCards] = useState<FlashcardItem[]>(cards);

  // Undo Stack
  const [ratingHistory, setRatingHistory] = useState<
    Array<{ cardId: string; prevIndex: number }>
  >([]);

  // Interactive Practice State
  const [userTypedAnswer, setUserTypedAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedMcOption, setSelectedMcOption] = useState<string | null>(null);

  // Audio Voice Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setShuffledCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const currentCard = shuffledCards[currentIndex];

  // Virtualization window slice (Only slice the active card + 1 buffer to keep DOM lightweight)
  const activeCardSlice = currentCard ? [currentCard] : [];

  // Auto-play interval loop
  useEffect(() => {
    if (!isAutoPlay || shuffledCards.length === 0) return;
    const timer = setInterval(() => {
      setIsFlipped((prev) => !prev);
      if (isFlipped) {
        setCurrentIndex((prev) => (prev + 1) % shuffledCards.length);
      }
    }, 2800);
    return () => clearInterval(timer);
  }, [isAutoPlay, isFlipped, shuffledCards]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing inside inputs
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1') {
        handleRating('again');
      } else if (e.key === '2') {
        handleRating('hard');
      } else if (e.key === '3') {
        handleRating('good');
      } else if (e.key === '4') {
        handleRating('easy');
      } else if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shuffledCards, isFlipped]);

  const speakCurrentCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    const textToSpeak = isReverseMode ? currentCard.backText : currentCard.frontText;
    const voiceLang = lang === 'zh' ? 'zh-CN' : 'en-US';
    audioEngine.speak(textToSpeak, voiceLang);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setUserTypedAnswer('');
    setAnswerResult(null);
    setSelectedMcOption(null);
    setRecordedAudioUrl(null);
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    setUserTypedAnswer('');
    setAnswerResult(null);
    setSelectedMcOption(null);
    setRecordedAudioUrl(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(shuffledCards.length - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRating = async (rating: SRSGrade) => {
    if (!currentCard) return;
    setRatingHistory((prev) => [...prev, { cardId: currentCard.id, prevIndex: currentIndex }]);
    await onRateCard(currentCard.id, rating);
    nextCard();
  };

  const handleUndoLastRating = () => {
    if (ratingHistory.length === 0) return;
    const last = ratingHistory[ratingHistory.length - 1];
    setRatingHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(last.prevIndex);
    setIsFlipped(false);
  };

  // Check typed answer mode
  const handleCheckTypedAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard) return;
    const expected = (isReverseMode ? currentCard.frontText : currentCard.backText).trim().toLowerCase();
    const actual = userTypedAnswer.trim().toLowerCase();

    if (expected.includes(actual) || actual.includes(expected)) {
      setAnswerResult('correct');
      setIsFlipped(true);
    } else {
      setAnswerResult('incorrect');
      setIsFlipped(true);
    }
  };

  // Voice recording handlers
  const startRecording = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert('Không thể truy cập Micro để ghi âm.');
    }
  };

  const stopRecording = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!currentCard || shuffledCards.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-3xl">
          🎴
        </div>
        <h3 className="text-xl font-black text-slate-100">Không tìm thấy thẻ ghi nhớ phù hợp</h3>
        <p className="text-xs text-slate-400">
          Hãy thay đổi bộ lọc cấp độ, chủ đề hoặc thêm thẻ mới vào hệ thống.
        </p>
      </div>
    );
  }

  // MC distractors generation
  const mcDistractors = [
    currentCard.backText,
    'Sự cố thiết bị nhà máy',
    'Quy trình vận hành chuẩn',
    'Kiểm định chất lượng sản phẩm',
  ].sort(() => Math.random() - 0.5);

  const levelBadge = currentCard.hskLevel || currentCard.cefrLevel || 'B1';
  const firstExample = currentCard.examples && currentCard.examples.length > 0 ? currentCard.examples[0] : null;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Player Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/70 border border-slate-800/60 p-3 rounded-3xl text-xs backdrop-blur-2xl shadow-xl">
        {/* Practice Mode Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setPracticeMode('flip')}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm ${
              practiceMode === 'flip' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/25 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Lật Thẻ
          </button>

          <button
            onClick={() => setPracticeMode('typing')}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm ${
              practiceMode === 'typing' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/25 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Nhập Đáp Án
          </button>

          <button
            onClick={() => setPracticeMode('listen_guess')}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm ${
              practiceMode === 'listen_guess' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/25 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Nghe & Đoán
          </button>

          <button
            onClick={() => setPracticeMode('mc')}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm ${
              practiceMode === 'mc' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/25 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Trắc Nghiệm
          </button>

          <button
            onClick={() => setPracticeMode('voice_recorder')}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm ${
              practiceMode === 'voice_recorder' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/25 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Ghi Âm
          </button>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-2">
          {ratingHistory.length > 0 && (
            <button
              onClick={handleUndoLastRating}
              className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl font-extrabold cursor-pointer flex items-center gap-1 shadow-md border border-slate-700/60"
              title="Hoàn tác đánh giá gần nhất"
            >
              <Undo2 className="w-3.5 h-3.5 text-amber-400" /> Hoàn tác
            </button>
          )}

          <button
            onClick={handleShuffle}
            className="p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl cursor-pointer shadow-md border border-slate-700/60"
            title="Tráo đổi ngẫu nhiên"
          >
            <Shuffle className="w-3.5 h-3.5 text-orange-400" />
          </button>

          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`p-2 rounded-2xl cursor-pointer transition-all shadow-md border border-slate-700/60 ${
              isAutoPlay ? 'bg-orange-500 text-white' : 'bg-slate-800/90 text-slate-300'
            }`}
            title="Tự động trình chiếu"
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsReverseMode(!isReverseMode)}
            className={`p-2 rounded-2xl cursor-pointer transition-all shadow-md border border-slate-700/60 ${
              isReverseMode ? 'bg-indigo-600 text-white' : 'bg-slate-800/90 text-slate-300'
            }`}
            title="Đảo chiều câu hỏi (Đáp <-> Hỏi)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Index */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold px-1">
        <span>
          Thẻ {currentIndex + 1} / {shuffledCards.length}
        </span>
        <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-3 py-1 rounded-full shadow-sm font-black">
          {currentCard.topic} • {levelBadge}
        </span>
      </div>

      {/* Main 3D Card Display Container */}
      <div
        onClick={() => {
          if (practiceMode === 'flip') setIsFlipped(!isFlipped);
        }}
        className={`w-full min-h-[360px] bg-slate-900/95 border-2 ${
          isFlipped ? 'border-orange-500 shadow-2xl shadow-orange-500/25 double-bezel-glow' : 'border-slate-800/90 hover:border-slate-700 double-bezel'
        } rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer shadow-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-3xl`}
      >
        {/* Ambient Top Glow Spheres */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges & Audio Trigger */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800/90 text-orange-400 font-black text-xs rounded-xl border border-slate-700/80 shadow-inner">
              {levelBadge}
            </span>
            <span className="px-3 py-1 bg-slate-800/90 text-slate-300 font-bold text-xs rounded-xl border border-slate-700/80 shadow-inner">
              {currentCard.partOfSpeech}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={speakCurrentCard}
              className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl cursor-pointer transition-all shadow-xl shadow-orange-500/25 active:scale-95"
              title="Nghe phát âm chuẩn"
            >
              <Volume2 className="w-5 h-5 text-amber-200" />
            </button>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="my-6 text-center space-y-4 relative z-10">
          {!isFlipped ? (
            /* FRONT FACE */
            <div className="space-y-3 animate-fadeIn">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block font-sans">
                [Mặt trước - Phím Cách hoặc Chạm để Lật]
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
                {isReverseMode ? currentCard.backText : currentCard.frontText}
              </h2>
              {currentCard.pinyinOrIpa && !isReverseMode && (
                <p className="text-xl font-black text-orange-400">{currentCard.pinyinOrIpa}</p>
              )}
            </div>
          ) : (
            /* BACK FACE */
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="text-center">
                <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest block font-sans">
                  [Mặt sau - Đáp án & Giải nghĩa đầy đủ]
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-emerald-300 mt-1 font-sans">
                  {isReverseMode ? currentCard.frontText : currentCard.backText}
                </h3>
                {currentCard.pinyinOrIpa && (
                  <p className="text-base font-black text-orange-400 mt-1">{currentCard.pinyinOrIpa}</p>
                )}
              </div>

              {/* Examples Section */}
              {firstExample && (
                <div className="bg-slate-950/90 p-4.5 rounded-2xl border border-slate-800 space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-sans">
                      💬 Câu ví dụ nhà máy / giao tiếp:
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const sentenceToSpeak = firstExample.sentenceZh || firstExample.sentenceEn || '';
                        audioEngine.speak(sentenceToSpeak, lang === 'zh' ? 'zh-CN' : 'en-US');
                      }}
                      className="px-3 py-1 bg-slate-800/90 hover:bg-orange-500 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
                      title="Đọc câu ví dụ"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Đọc câu</span>
                    </button>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {firstExample.sentenceZh || firstExample.sentenceEn}
                  </p>
                  {firstExample.pinyin && (
                    <p className="text-xs text-orange-400 font-semibold">{firstExample.pinyin}</p>
                  )}
                  <p className="text-xs text-slate-400 italic">Dịch: {firstExample.sentenceVi}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Practice Mode Interactive Overlays */}
        {practiceMode === 'typing' && !isFlipped && (
          <form onSubmit={handleCheckTypedAnswer} className="mt-4 flex gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={userTypedAnswer}
              onChange={(e) => setUserTypedAnswer(e.target.value)}
              placeholder="Nhập đáp án tiếng Việt..."
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-inner font-bold"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl cursor-pointer text-xs shadow-lg"
            >
              Kiểm Tra
            </button>
          </form>
        )}
      </div>

      {/* 4 SRS Rating Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
        <button
          onClick={() => handleRating('again')}
          className="py-3.5 px-4 bg-rose-950/80 hover:bg-rose-900/90 border border-rose-500/50 text-rose-300 rounded-2xl font-black text-xs flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xl hover:scale-[1.02] active:scale-95 shadow-rose-500/10"
        >
          <span>Phím 1: Quên (Again)</span>
          <span className="text-[10px] text-rose-400 font-semibold">Ôn lại sau 10 phút</span>
        </button>

        <button
          onClick={() => handleRating('hard')}
          className="py-3.5 px-4 bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/50 text-amber-300 rounded-2xl font-black text-xs flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xl hover:scale-[1.02] active:scale-95 shadow-amber-500/10"
        >
          <span>Phím 2: Khó (Hard)</span>
          <span className="text-[10px] text-amber-400 font-semibold">Ôn sau 1 ngày</span>
        </button>

        <button
          onClick={() => handleRating('good')}
          className="py-3.5 px-4 bg-blue-950/80 hover:bg-blue-900/90 border border-blue-500/50 text-blue-300 rounded-2xl font-black text-xs flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xl hover:scale-[1.02] active:scale-95 shadow-blue-500/10"
        >
          <span>Phím 3: Nhớ tốt (Good)</span>
          <span className="text-[10px] text-blue-400 font-semibold">Ôn sau 4 ngày</span>
        </button>

        <button
          onClick={() => handleRating('easy')}
          className="py-3.5 px-4 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/50 text-emerald-300 rounded-2xl font-black text-xs flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xl hover:scale-[1.02] active:scale-95 shadow-emerald-500/10"
        >
          <span>Phím 4: Rất dễ (Easy)</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Ôn sau 10 ngày</span>
        </button>
      </div>
    </div>
  );
}



