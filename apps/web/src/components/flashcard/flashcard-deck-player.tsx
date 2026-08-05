'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/audio/audio-engine';
import { uiSounds } from '@/lib/audio/ui-sounds';
import { SRSGrade } from '@/lib/domain/srs-engine';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
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
import { AnimatedButton } from '@/components/common/animations';

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
  const [isReverseMode, setIsReverseMode] = useState(false); 
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('flip');
  const [shuffledCards, setShuffledCards] = useState<FlashcardItem[]>(cards);
  const cardControls = useAnimation();

  // Undo Stack
  const [ratingHistory, setRatingHistory] = useState<
    Array<{ cardId: string; prevIndex: number }>
  >([]);

  // Interactive Practice State
  const [userTypedAnswer, setUserTypedAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    setShuffledCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const currentCard = shuffledCards[currentIndex];

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        uiSounds.playSwipe();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1') {
        handleRating('again');
      } else if (e.key === '2') {
        handleRating('hard');
      } else if (e.key === '3') {
        handleRating('good');
      } else if (e.key === '4') {
        handleRating('easy');
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

    if (rating === 'again' || rating === 'hard') {
      uiSounds.playErrorShake();
      cardControls.start({ x: [-15, 15, -10, 10, -5, 5, 0], transition: { duration: 0.4 } });
    } else if (rating === 'easy' || rating === 'good') {
      uiSounds.playSuccessPop();
      if (rating === 'easy') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        });
      }
    }

    setRatingHistory((prev) => [...prev, { cardId: currentCard.id, prevIndex: currentIndex }]);
    await onRateCard(currentCard.id, rating);
    
    // Add a tiny delay to let the animation/sound play before switching cards
    setTimeout(() => {
      nextCard();
    }, 400);
  };

  const handleUndoLastRating = () => {
    if (ratingHistory.length === 0) return;
    const last = ratingHistory[ratingHistory.length - 1];
    setRatingHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(last.prevIndex);
    setIsFlipped(false);
  };

  const handleCheckTypedAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard) return;
    const expected = (isReverseMode ? currentCard.frontText : currentCard.backText).trim().toLowerCase();
    const actual = userTypedAnswer.trim().toLowerCase();

    if (expected.includes(actual) || actual.includes(expected)) {
      setAnswerResult('correct');
      uiSounds.playSuccessPop();
      setIsFlipped(true);
    } else {
      setAnswerResult('incorrect');
      uiSounds.playErrorShake();
      cardControls.start({ x: [-15, 15, -10, 10, 0], transition: { duration: 0.4 } });
      setIsFlipped(true);
    }
  };

  if (!currentCard || shuffledCards.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
        <h3 className="text-xl font-black text-slate-100">Không tìm thấy thẻ ghi nhớ phù hợp</h3>
      </div>
    );
  }

  const levelBadge = currentCard.hskLevel || currentCard.cefrLevel || 'B1';
  const firstExample = currentCard.examples && currentCard.examples.length > 0 ? currentCard.examples[0] : null;

  return (
    <div className="space-y-5 max-w-3xl mx-auto" style={{ perspective: 1200 }}>
      {/* Player Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/70 border-2 border-slate-700/60 p-3 rounded-2xl text-xs backdrop-blur-2xl shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <AnimatedButton
            soundType="none"
            onClick={() => { uiSounds.playClick(); setPracticeMode('flip'); }}
            className={`px-3.5 py-2 rounded-xl font-black transition-colors ${
              practiceMode === 'flip' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
            }`}
          >
            Lật Thẻ
          </AnimatedButton>
          <AnimatedButton
            soundType="none"
            onClick={() => { uiSounds.playClick(); setPracticeMode('typing'); }}
            className={`px-3.5 py-2 rounded-xl font-black transition-colors ${
              practiceMode === 'typing' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
            }`}
          >
            Nhập Đáp Án
          </AnimatedButton>
        </div>

        <div className="flex items-center gap-2">
          {ratingHistory.length > 0 && (
            <AnimatedButton onClick={handleUndoLastRating} className="p-2 bg-slate-800/90 text-slate-200 rounded-xl">
              <Undo2 className="w-4 h-4 text-amber-400" />
            </AnimatedButton>
          )}
          <AnimatedButton onClick={handleShuffle} className="p-2 bg-slate-800/90 text-slate-200 rounded-xl">
            <Shuffle className="w-4 h-4 text-orange-400" />
          </AnimatedButton>
          <AnimatedButton onClick={() => setIsAutoPlay(!isAutoPlay)} className={`p-2 rounded-xl ${isAutoPlay ? 'bg-orange-500 text-white' : 'bg-slate-800/90 text-slate-300'}`}>
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </AnimatedButton>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold px-1">
        <span>Thẻ {currentIndex + 1} / {shuffledCards.length}</span>
        <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-3 py-1 rounded-full font-black">
          {currentCard.topic} • {levelBadge}
        </span>
      </div>

      {/* Main 3D Card Display Container */}
      <motion.div
        animate={cardControls}
        className="w-full relative min-h-[360px] cursor-pointer"
        onClick={() => {
          if (practiceMode === 'flip') {
            uiSounds.playSwipe();
            setIsFlipped(!isFlipped);
          }
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full absolute inset-0"
        >
          {/* FRONT FACE */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 w-full h-full bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-slate-800/90 text-orange-400 font-black text-xs rounded-xl border border-slate-700/80 shadow-inner">
                {levelBadge}
              </span>
              <AnimatedButton
                onClick={speakCurrentCard}
                className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl shadow-lg"
              >
                <Volume2 className="w-5 h-5" />
              </AnimatedButton>
            </div>
            
            <div className="text-center space-y-4">
              <span className="text-[10px] text-slate-400 font-black uppercase">Mặt trước</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white">{isReverseMode ? currentCard.backText : currentCard.frontText}</h2>
              {currentCard.pinyinOrIpa && !isReverseMode && (
                <p className="text-xl font-black text-orange-400">{currentCard.pinyinOrIpa}</p>
              )}
            </div>

            {practiceMode === 'typing' && (
              <form onSubmit={handleCheckTypedAnswer} className="mt-4 flex gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={userTypedAnswer}
                  onChange={(e) => setUserTypedAnswer(e.target.value)}
                  placeholder="Nhập đáp án tiếng Việt..."
                  className="flex-1 bg-slate-950 border-2 border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none"
                />
                <AnimatedButton type="submit" className="px-5 py-3 bg-orange-500 text-white font-black rounded-xl text-xs">
                  Kiểm Tra
                </AnimatedButton>
              </form>
            )}
            <div />
          </div>

          {/* BACK FACE */}
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            className="absolute inset-0 w-full h-full bg-slate-900/95 border-2 border-orange-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-slate-800/90 text-orange-400 font-black text-xs rounded-xl border border-slate-700/80 shadow-inner">
                Đáp án
              </span>
              <AnimatedButton
                onClick={speakCurrentCard}
                className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl shadow-lg"
              >
                <Volume2 className="w-5 h-5" />
              </AnimatedButton>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-3xl sm:text-4xl font-black text-emerald-300">
                {isReverseMode ? currentCard.frontText : currentCard.backText}
              </h3>
              {currentCard.pinyinOrIpa && (
                <p className="text-base font-black text-orange-400">{currentCard.pinyinOrIpa}</p>
              )}
            </div>

            {firstExample ? (
              <div className="bg-slate-950/90 p-4 rounded-2xl border-2 border-slate-800 shadow-inner">
                <p className="text-sm font-bold text-white mb-1">{firstExample.sentenceZh || firstExample.sentenceEn}</p>
                <p className="text-xs text-slate-400 italic">Dịch: {firstExample.sentenceVi}</p>
              </div>
            ) : <div />}
          </div>
        </motion.div>
      </motion.div>

      {/* 4 SRS Rating Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
        <AnimatedButton soundType="none" onClick={() => handleRating('again')} className="py-3.5 px-4 bg-rose-950/80 border-2 border-rose-500/50 text-rose-300 rounded-2xl font-black text-xs shadow-lg hover:border-rose-500 flex flex-col items-center">
          <span>1: Quên (Again)</span>
        </AnimatedButton>
        <AnimatedButton soundType="none" onClick={() => handleRating('hard')} className="py-3.5 px-4 bg-amber-950/80 border-2 border-amber-500/50 text-amber-300 rounded-2xl font-black text-xs shadow-lg hover:border-amber-500 flex flex-col items-center">
          <span>2: Khó (Hard)</span>
        </AnimatedButton>
        <AnimatedButton soundType="none" onClick={() => handleRating('good')} className="py-3.5 px-4 bg-blue-950/80 border-2 border-blue-500/50 text-blue-300 rounded-2xl font-black text-xs shadow-lg hover:border-blue-500 flex flex-col items-center">
          <span>3: Nhớ tốt (Good)</span>
        </AnimatedButton>
        <AnimatedButton soundType="none" onClick={() => handleRating('easy')} className="py-3.5 px-4 bg-emerald-950/80 border-2 border-emerald-500/50 text-emerald-300 rounded-2xl font-black text-xs shadow-lg hover:border-emerald-500 flex flex-col items-center">
          <span>4: Rất dễ (Easy)</span>
        </AnimatedButton>
      </div>
    </div>
  );
}
