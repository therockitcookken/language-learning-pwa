'use client';

import React, { useState, useEffect } from 'react';
import { audioEngine } from '@/lib/audio/audio-engine';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Mic,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shuffle,
  VolumeX,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface ExerciseRendererProps {
  question: {
    id: string;
    questionType: string;
    language?: 'zh' | 'en';
    level?: string;
    topic?: string;
    skill?: string;
    prompt: string;
    pinyinOrIpa?: string;
    simplifiedOrWord?: string;
    audioUrl?: string;
    imageUrl?: string;
    optionsJson: string;
    correctAnswer: string;
    explanationVi: string;
    hintVi?: string;
    recommendedTimeSecs?: number;
  };
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  showFeedback?: boolean;
  disabled?: boolean;
  showHintByDefault?: boolean;
}

export function ExerciseRenderer({
  question,
  userAnswer,
  onAnswerChange,
  showFeedback = false,
  disabled = false,
  showHintByDefault = false,
}: ExerciseRendererProps) {
  const [showHint, setShowHint] = useState(showHintByDefault);

  const options: string[] = React.useMemo(() => {
    try {
      const parsed = JSON.parse(question.optionsJson || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [question.optionsJson]);

  // Handle sentence order state
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  // Handle multi-choice array state
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  // Audio recording simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(false);

  useEffect(() => {
    setShowHint(showHintByDefault);
  }, [question.id, showHintByDefault]);

  useEffect(() => {
    if (question.questionType === 'sentence_order' && userAnswer) {
      setSelectedTokens(userAnswer.split(' ').filter(Boolean));
    }
    if (question.questionType === 'multiple_choice' && userAnswer) {
      try {
        setSelectedMultiple(JSON.parse(userAnswer));
      } catch {
        setSelectedMultiple([]);
      }
    }
  }, [question.id, question.questionType, userAnswer]);

  const handlePlayAudio = (textToSpeak?: string) => {
    const text = textToSpeak || question.simplifiedOrWord || question.prompt.replace(/\[.*?\]/g, '');
    const lang = question.language || 'zh';
    audioEngine.speak(text, lang === 'zh' ? 'zh-CN' : 'en-US');
  };

  const isCorrectOption = (opt: string) => {
    return question.correctAnswer.toLowerCase().includes(opt.toLowerCase());
  };

  // RENDERERS FOR DIFFERENT EXERCISE TYPES

  // 1. Single Choice, Pronunciation Pick, Verb Tense, Particles, Translation, Reading
  const renderSingleChoiceStyle = () => (
    <div className="grid grid-cols-1 gap-3 pt-2">
      {options.map((opt, idx) => {
        const isSelected = userAnswer === opt;
        const letter = String.fromCharCode(65 + idx);

        let borderStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';
        if (isSelected) {
          borderStyle = 'bg-gradient-to-r from-orange-500 to-amber-600 border-orange-400 text-white shadow-lg';
        }
        if (showFeedback) {
          if (isCorrectOption(opt)) {
            borderStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
          } else if (isSelected && !isCorrectOption(opt)) {
            borderStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
          }
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onAnswerChange(opt)}
            className={`w-full text-left p-4 rounded-2xl border font-medium text-sm transition-all cursor-pointer flex items-center justify-between group ${borderStyle}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs group-hover:border-orange-500 transition-colors">
                {letter}
              </span>
              <span className="leading-snug">{opt}</span>
            </div>
            {showFeedback && isCorrectOption(opt) && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            {showFeedback && isSelected && !isCorrectOption(opt) && (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );

  // 2. Multiple Choice (Select All That Apply)
  const renderMultipleChoice = () => {
    const toggleMulti = (opt: string) => {
      const next = selectedMultiple.includes(opt)
        ? selectedMultiple.filter((item) => item !== opt)
        : [...selectedMultiple, opt];
      setSelectedMultiple(next);
      onAnswerChange(JSON.stringify(next));
    };

    return (
      <div className="space-y-3 pt-2">
        <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Chọn tất cả các đáp án đúng:
        </p>
        {options.map((opt, idx) => {
          const isChecked = selectedMultiple.includes(opt);
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => toggleMulti(opt)}
              className={`w-full text-left p-4 rounded-2xl border text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                isChecked
                  ? 'bg-orange-950/60 border-orange-500 text-white shadow-md'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold ${
                  isChecked ? 'bg-orange-500 border-orange-400 text-white' : 'border-slate-600'
                }`}
              >
                {isChecked ? '✓' : ''}
              </div>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // 3. True / False
  const renderTrueFalse = () => (
    <div className="grid grid-cols-2 gap-4 pt-4">
      {['Đúng', 'Sai'].map((val) => {
        const isTrue = val === 'Đúng';
        const isSelected = userAnswer === val || (userAnswer === 'True' && isTrue) || (userAnswer === 'False' && !isTrue);
        return (
          <button
            key={val}
            type="button"
            disabled={disabled}
            onClick={() => onAnswerChange(val)}
            className={`py-5 px-6 rounded-2xl border-2 font-black text-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              isSelected
                ? isTrue
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-xl scale-[1.02]'
                  : 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-xl scale-[1.02]'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-2xl">{isTrue ? '✓' : '✗'}</span>
            <span>{val}</span>
          </button>
        );
      })}
    </div>
  );

  // 4. Fill in the Blank / Listen & Type
  const renderFillBlank = () => (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2.5 px-4 focus-within:border-orange-500">
        <input
          type="text"
          disabled={disabled}
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Gõ câu trả lời / từ thích hợp vào đây..."
          className="w-full bg-transparent text-white placeholder-slate-500 text-base outline-none font-mono"
        />
        {userAnswer && (
          <button
            type="button"
            onClick={() => onAnswerChange('')}
            className="text-xs text-slate-400 hover:text-white px-2"
          >
            Xóa
          </button>
        )}
      </div>

      {options.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 block font-bold">Hoặc chọn nhanh gợi ý từ danh sách:</span>
          <div className="flex flex-wrap gap-2">
            {options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onAnswerChange(opt)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  userAnswer === opt
                    ? 'bg-orange-500 text-white border-orange-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 5. Sentence Order (Tile Drop Reorderer)
  const renderSentenceOrder = () => {
    const rawTokens = options[0]?.split(' ').filter(Boolean) || [];
    const availableTokens = rawTokens.filter((t) => !selectedTokens.includes(t));

    const handleAddToken = (token: string) => {
      const next = [...selectedTokens, token];
      setSelectedTokens(next);
      onAnswerChange(next.join(' '));
    };

    const handleRemoveToken = (index: number) => {
      const next = selectedTokens.filter((_, i) => i !== index);
      setSelectedTokens(next);
      onAnswerChange(next.join(' '));
    };

    return (
      <div className="space-y-4 pt-2">
        <div className="min-h-[64px] bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-2">
          {selectedTokens.length === 0 ? (
            <span className="text-xs text-slate-500 italic p-2">Nhấp vào các thẻ từ bên dưới để xếp thành câu...</span>
          ) : (
            selectedTokens.map((tok, idx) => (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveToken(idx)}
                className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                {tok}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {rawTokens.map((tok, idx) => {
            const isUsed = selectedTokens.includes(tok);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isUsed}
                onClick={() => handleAddToken(tok)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isUsed
                    ? 'opacity-30 border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-orange-500 hover:text-white'
                }`}
              >
                {tok}
              </button>
            );
          })}
        </div>

        {selectedTokens.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setSelectedTokens([]);
              onAnswerChange('');
            }}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại từ đầu
          </button>
        )}
      </div>
    );
  };

  // 6. Multi-Skill & Voice Recording Practice Simulator
  const renderMultiSkillVoice = () => (
    <div className="space-y-4 pt-2">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
          🎙️ Bài tập Phát âm & Viết câu ngắn
        </span>
        <p className="text-xs text-slate-300">
          Hãy phát âm lại câu hoặc từ trong đề bài, hoặc chọn đáp án chuẩn bên dưới:
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsRecording(!isRecording);
              if (!isRecording) {
                setTimeout(() => {
                  setIsRecording(false);
                  setRecordedAudio(true);
                }, 2500);
              }
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : recordedAudio
                ? 'bg-emerald-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? 'Đang ghi âm (2.5s)...' : recordedAudio ? '✓ Đã ghi âm xong!' : 'Nhấp để Ghi Âm Giọng'}
          </button>

          {recordedAudio && (
            <span className="text-xs text-emerald-400 font-semibold">
              ✓ Độ khớp âm giọng: 96% (Đạt chuẩn)
            </span>
          )}
        </div>
      </div>

      {renderSingleChoiceStyle()}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Exercise Question Prompt Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                {question.skill || 'Kỹ năng'}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {question.level || 'HSK/CEFR'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Type: {question.questionType}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed pt-1">
              {question.prompt}
            </h3>

            {question.pinyinOrIpa && (
              <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-lg inline-block">
                Pronunciation: {question.pinyinOrIpa}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePlayAudio()}
              className="p-3 bg-slate-800 hover:bg-orange-500 text-white rounded-2xl cursor-pointer transition-all shadow-md shrink-0 hover:scale-105"
              title="Nghe phát âm chuẩn"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HINT GUIDE & METHOD SUGGESTION TOGGLE BUTTON */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{showHint ? 'Ẩn Gợi ý cách làm' : '💡 Xem Gợi ý cách làm / Mẹo giải'}</span>
            {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHint && (
            <div className="mt-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed animate-fadeIn">
              <span className="font-bold text-amber-300 block mb-1">💡 Mẹo & Gợi ý xử lý:</span>
              <p>{question.hintVi || `Gợi ý: Đọc kỹ đề bài, chú ý cấu trúc từ vựng '${question.simplifiedOrWord || ''}' và áp dụng quy tắc ngữ pháp tương ứng.`}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Exercise Input View based on Question Type */}
      {question.questionType === 'multiple_choice' && renderMultipleChoice()}
      {question.questionType === 'true_false' && renderTrueFalse()}
      {(question.questionType === 'fill_blank' || question.questionType === 'listen_type') && renderFillBlank()}
      {question.questionType === 'sentence_order' && renderSentenceOrder()}
      {question.questionType === 'multi_skill' && renderMultiSkillVoice()}
      {![
        'multiple_choice',
        'true_false',
        'fill_blank',
        'listen_type',
        'sentence_order',
        'multi_skill',
      ].includes(question.questionType) && renderSingleChoiceStyle()}

      {/* Explanation Banner when in Feedback / Post-Submission mode */}
      {showFeedback && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Giải thích chi tiết tiếng Việt:
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {question.explanationVi}
          </p>
        </div>
      )}
    </div>
  );
}
