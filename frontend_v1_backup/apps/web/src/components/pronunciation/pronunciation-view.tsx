'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Volume2, Mic, Activity, Sparkles, Sliders, Globe, Layers, GraduationCap } from 'lucide-react';
import { PronunciationStudioMode, ChineseSubFeature, EnglishSubFeature } from './pronunciation-types';
import { PINYIN_DATASET } from '@/lib/data/pinyin-dataset';
import { IPA_DATASET } from '@/lib/data/ipa-dataset';
import { PinyinRecord, IPARecord, QuizItem } from '@/lib/validation/pronunciation-schema';

import { ChineseVoicePanel } from './chinese-voice-panel';
import { EnglishVoicePanel } from './english-voice-panel';

import { ArticulationDiagram } from './articulation-diagram';
import { ChineseSyllableBuilder } from './chinese-syllable-builder';
import { TonePitchLab } from './tone-pitch-lab';
import { ChineseMinimalPairTrainer } from './chinese-minimal-pair-trainer';
import { ChineseShadowingRecorder } from './chinese-shadowing-recorder';

import { EnglishIPAChart } from './english-ipa-chart';
import { AccentComparator } from './accent-comparator';
import { EnglishMinimalPairTrainer } from './english-minimal-pair-trainer';
import { StressIntonationLab } from './stress-intonation-lab';

import { PhonemeDetailPanel } from './phoneme-detail-panel';
import { PronunciationQuizModal } from './pronunciation-quiz-modal';

export function PronunciationView() {
  const { t } = useI18n();

  // Studio Navigation State
  const [studioMode, setStudioMode] = useState<PronunciationStudioMode>('chinese_pinyin');
  const [chineseSubFeature, setChineseSubFeature] = useState<ChineseSubFeature>('articulation_studio');
  const [englishSubFeature, setEnglishSubFeature] = useState<EnglishSubFeature>('ipa_map');

  // Selected Phoneme State
  const [selectedPinyin, setSelectedPinyin] = useState<PinyinRecord | null>(PINYIN_DATASET[0] || null);
  const [selectedIPA, setSelectedIPA] = useState<IPARecord | null>(IPA_DATASET[0] || null);

  // Audio Playback Controls
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);
  const [activeAccent, setActiveAccent] = useState<'en-US' | 'en-GB'>('en-US');

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeQuizItems, setActiveQuizItems] = useState<QuizItem[]>([]);

  // Version 3 Data & Voice Cache Reset Effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('pronunciationAudioVersion');
      if (version !== '3') {
        localStorage.removeItem('pronunciation_cache');
        localStorage.setItem('pronunciationAudioVersion', '3');
      }

      const urlParams = new URLSearchParams(window.location.search);
      const urlStudio = urlParams.get('studio') as PronunciationStudioMode;
      if (urlStudio && ['chinese_pinyin', 'english_ipa', 'practice_recorder'].includes(urlStudio)) {
        setStudioMode(urlStudio);
      }
    }
  }, []);

  const handleStudioChange = (mode: PronunciationStudioMode) => {
    setStudioMode(mode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('studio', mode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleOpenQuiz = () => {
    const quizList: QuizItem[] = [];
    if (studioMode === 'chinese_pinyin') {
      PINYIN_DATASET.forEach((r) => {
        if (r.quizItems) quizList.push(...r.quizItems);
      });
    } else {
      IPA_DATASET.forEach((r) => {
        if (r.quizItems) quizList.push(...r.quizItems);
      });
    }
    setActiveQuizItems(quizList);
    setIsQuizOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Studio Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-md">
              <Volume2 className="w-6 h-6" />
            </div>
            <span>{t.pronunciation} STUDIO</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-2.5">
            <span>Phòng Luyện Phát Âm Chuyên Nghiệp (Pinyin & IPA)</span>
            <span className="text-xs font-bold bg-orange-500/15 text-orange-300 border border-orange-500/25 px-3 py-0.5 rounded-full shadow-sm">
              VOICE ENGINE V3.0
            </span>
          </p>
        </div>

        {/* Studio Segmented Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl backdrop-blur-xl shadow-md">
          <button
            type="button"
            onClick={() => handleStudioChange('chinese_pinyin')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              studioMode === 'chinese_pinyin'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇨🇳 中文 PINYIN STUDIO
          </button>
          <button
            type="button"
            onClick={() => handleStudioChange('english_ipa')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              studioMode === 'english_ipa'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇬🇧 ENGLISH IPA STUDIO
          </button>
          <button
            type="button"
            onClick={() => handleStudioChange('practice_recorder')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              studioMode === 'practice_recorder'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎙️ SHADOWING & RECORDER
          </button>
        </div>
      </div>

      {/* Main Studio Workspaces */}
      {studioMode === 'chinese_pinyin' && (
        <div className="space-y-6">
          {/* Dedicated Chinese Voice Panel */}
          <ChineseVoicePanel
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            loopCount={loopCount}
            onLoopChange={setLoopCount}
            isSlow={isSlowMode}
            onToggleSlow={setIsSlowMode}
          />

          {/* Sub-feature Navigation Bar for Chinese */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-2xl shadow-md">
            {[
              { id: 'articulation_studio' as ChineseSubFeature, label: '1. SƠ ĐỒ CẤU ÂM SVG' },
              { id: 'syllable_builder' as ChineseSubFeature, label: '2. PINYIN BUILDER' },
              { id: 'tone_pitch_lab' as ChineseSubFeature, label: '3. TONE PITCH LAB' },
              { id: 'minimal_pair_trainer' as ChineseSubFeature, label: '4. MINIMAL PAIR TRAINER' },
              { id: 'shadowing_recorder' as ChineseSubFeature, label: '5. SHADOWING RECORDER' },
            ].map((sf) => (
              <button
                key={sf.id}
                type="button"
                onClick={() => setChineseSubFeature(sf.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chineseSubFeature === sf.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {sf.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleOpenQuiz}
              className="ml-auto px-4 py-1.5 bg-slate-950/60 border border-slate-800 hover:border-orange-500/40 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <GraduationCap className="w-4 h-4 text-orange-400" /> BÀI TEST & QUIZ
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Learning Stage */}
            <div className="lg:col-span-2 space-y-6">
              {chineseSubFeature === 'articulation_studio' && (
                <>
                  <div className="bg-pure-surface border border-whisper-border p-4 rounded space-y-3">
                    <div className="text-xs font-mono text-muted-steel uppercase font-bold">CHỌN THANH MẪU CẦN XEM SƠ ĐỒ</div>
                    <div className="flex flex-wrap gap-2">
                      {PINYIN_DATASET.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedPinyin(r)}
                          className={`px-3 py-1.5 rounded font-mono text-sm font-bold border transition-all ${
                            selectedPinyin?.id === r.id
                              ? 'bg-safety-orange text-canvas-ink border-safety-orange'
                              : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                          }`}
                        >
                          {r.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPinyin && (
                    <ArticulationDiagram
                      symbol={selectedPinyin.symbol}
                      placeOfArticulation={selectedPinyin.articulation.place}
                      tonguePosition={selectedPinyin.articulation.tonguePosition}
                      lipPosition={selectedPinyin.articulation.lipPosition}
                      airflow={selectedPinyin.articulation.airflow}
                      isAspirated={selectedPinyin.articulation.aspiration?.includes('BẬT HƠI')}
                    />
                  )}
                </>
              )}

              {chineseSubFeature === 'syllable_builder' && <ChineseSyllableBuilder />}
              {chineseSubFeature === 'tone_pitch_lab' && <TonePitchLab />}
              {chineseSubFeature === 'minimal_pair_trainer' && <ChineseMinimalPairTrainer />}
              {chineseSubFeature === 'shadowing_recorder' && <ChineseShadowingRecorder langCode="zh-CN" />}
            </div>

            {/* Right Column Phoneme Detail Panel */}
            <div className="space-y-6">
              <PhonemeDetailPanel pinyinRecord={selectedPinyin} />
            </div>
          </div>
        </div>
      )}

      {studioMode === 'english_ipa' && (
        <div className="space-y-6">
          {/* Dedicated English Voice Panel */}
          <EnglishVoicePanel
            accent={activeAccent}
            onAccentChange={setActiveAccent}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            isSlow={isSlowMode}
            onToggleSlow={setIsSlowMode}
          />

          {/* Sub-feature Navigation Bar for English */}
          <div className="flex flex-wrap items-center gap-2 bg-canvas-ink border border-whisper-border p-1.5 rounded-[4px]">
            {[
              { id: 'ipa_map' as EnglishSubFeature, label: '1. IPA MAP INTERACTIVE' },
              { id: 'accent_comparator' as EnglishSubFeature, label: '2. US-UK COMPARATOR' },
              { id: 'minimal_pair_trainer' as EnglishSubFeature, label: '3. MINIMAL PAIR TRAINER' },
              { id: 'stress_intonation_lab' as EnglishSubFeature, label: '4. STRESS & INTONATION' },
              { id: 'shadowing_recorder' as EnglishSubFeature, label: '5. SHADOWING RECORDER' },
            ].map((sf) => (
              <button
                key={sf.id}
                type="button"
                onClick={() => setEnglishSubFeature(sf.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                  englishSubFeature === sf.id
                    ? 'bg-blue-500 text-canvas-ink'
                    : 'text-muted-steel hover:text-titanium-white'
                }`}
              >
                {sf.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleOpenQuiz}
              className="ml-auto px-3 py-1 bg-pure-surface border border-whisper-border hover:border-blue-400 text-titanium-white text-xs font-mono font-bold rounded flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" /> BÀI TEST & QUIZ
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {englishSubFeature === 'ipa_map' && (
                <EnglishIPAChart
                  records={IPA_DATASET}
                  selectedSymbol={selectedIPA?.symbol || ''}
                  onSelectSymbol={setSelectedIPA}
                />
              )}
              {englishSubFeature === 'accent_comparator' && <AccentComparator />}
              {englishSubFeature === 'minimal_pair_trainer' && <EnglishMinimalPairTrainer />}
              {englishSubFeature === 'stress_intonation_lab' && <StressIntonationLab />}
              {englishSubFeature === 'shadowing_recorder' && <ChineseShadowingRecorder langCode="en-US" />}
            </div>

            {/* Right Column Phoneme Detail Panel */}
            <div className="space-y-6">
              <PhonemeDetailPanel ipaRecord={selectedIPA} />
            </div>
          </div>
        </div>
      )}

      {studioMode === 'practice_recorder' && (
        <ChineseShadowingRecorder langCode="zh-CN" />
      )}

      {/* Quiz Modal */}
      <PronunciationQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} quizItems={activeQuizItems} />
    </div>
  );
}
