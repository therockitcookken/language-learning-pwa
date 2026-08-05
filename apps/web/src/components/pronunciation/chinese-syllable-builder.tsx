'use client';

import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  RotateCcw,
  Zap,
  BookOpen,
  Sliders,
  Check,
  Ban,
  ShieldCheck,
  Factory,
  HelpCircle,
} from 'lucide-react';
import {
  ALL_INITIAL_IDS,
  INITIAL_GROUPS,
  FINAL_GROUPS,
  getCompatibleFinals,
  getCompatibleInitials,
  isValidPinyinPair,
  getVerifiedSyllableCombo,
  VerifiedToneEntry,
} from '@/lib/data/pinyin-matrix';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

interface SyllableBuilderProps {
  onSpeak?: (text: string) => void;
}

export function ChineseSyllableBuilder({ onSpeak }: SyllableBuilderProps) {
  // State 1: Initial (null = unselected, 'none' = Zero Initial, 'b'..'s' = initials)
  const [initial, setInitial] = useState<string | null>(null);
  // State 2: Final (null = unselected, 'a'..'er' = finals)
  const [final, setFinal] = useState<string | null>(null);
  // State 3: Tone (null = unselected, 1..4 = tone)
  const [selectedTone, setSelectedTone] = useState<number | null>(null);

  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);

  // 1. Reset Handler (Clears all state back to DEFAULT mode instantly)
  const handleReset = () => {
    setInitial(null);
    setFinal(null);
    setSelectedTone(null);
    pronunciationAudioService.stop();
  };

  // 2. Determine Selection Mode
  const isDefaultMode = initial === null && final === null;
  const isCompletedMode = initial !== null && final !== null;

  // 3. Compute Compatible Finals for current Initial
  const compatibleFinals = useMemo(() => {
    return getCompatibleFinals(initial);
  }, [initial]);

  // 4. Compute Compatible Initials for current Final
  const compatibleInitials = useMemo(() => {
    return getCompatibleInitials(final);
  }, [final]);

  // 5. Validity Check
  const isComboValid = useMemo(() => {
    if (!initial || !final) return false;
    return isValidPinyinPair(initial, final);
  }, [initial, final]);

  // 6. Retrieve Verified Syllable Data & Tone Entries
  const verifiedSyllableData = useMemo(() => {
    if (!initial || !final) return null;
    return getVerifiedSyllableCombo(initial, final);
  }, [initial, final]);

  const verifiedTones = useMemo(() => {
    return verifiedSyllableData?.verifiedTones || [];
  }, [verifiedSyllableData]);

  const availableToneNumbers = useMemo(() => {
    return verifiedTones.map((t) => t.tone);
  }, [verifiedTones]);

  // Effective Tone Entry
  const activeToneEntry = useMemo<VerifiedToneEntry | null>(() => {
    if (!isComboValid || !verifiedTones.length) return null;
    const effectiveTone = selectedTone !== null ? selectedTone : verifiedTones[0]?.tone || 1;
    const match = verifiedTones.find((t) => t.tone === effectiveTone);
    return match || verifiedTones[0] || null;
  }, [isComboValid, verifiedTones, selectedTone]);

  // Handle Initial Click
  const handleSelectInitial = (iniId: string) => {
    if (initial === iniId) {
      // Toggle off if clicking selected
      setInitial(null);
      return;
    }

    setInitial(iniId);

    // If final is already selected, check if it's compatible
    if (final) {
      const validFinals = getCompatibleFinals(iniId);
      if (!validFinals.includes(final)) {
        // Reset incompatible final
        setFinal(null);
        setSelectedTone(null);
      }
    }
  };

  // Handle Final Click
  const handleSelectFinal = (finId: string) => {
    if (final === finId) {
      // Toggle off if clicking selected
      setFinal(null);
      return;
    }

    setFinal(finId);

    // If initial is already selected, check if it's compatible
    if (initial) {
      const validInitials = getCompatibleInitials(finId);
      if (!validInitials.includes(initial)) {
        // Reset incompatible initial
        setInitial(null);
        setSelectedTone(null);
      }
    }
  };

  // Helper Pinyin Formatter with Tone Marks
  const formatPinyinWithTone = (iniId: string | null, finId: string | null, toneNum: number | null): string => {
    if (!iniId || !finId || !isValidPinyinPair(iniId, finId)) return '---';
    const initPinyin = iniId === 'none' ? '' : iniId;
    const toneMap: Record<string, string[]> = {
      a: ['a', 'ā', 'á', 'ǎ', 'à'],
      o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
      e: ['e', 'ē', 'é', 'ě', 'è'],
      i: ['i', 'ī', 'í', 'ǐ', 'ì'],
      u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
      ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
    };

    let targetChar = 'a';
    if (finId.includes('a')) targetChar = 'a';
    else if (finId.includes('o')) targetChar = 'o';
    else if (finId.includes('e')) targetChar = 'e';
    else if (finId.includes('i')) targetChar = 'i';
    else if (finId.includes('u')) targetChar = 'u';
    else if (finId.includes('ü')) targetChar = 'ü';

    const tIndex = toneNum !== null ? toneNum : 1;
    const toned = toneMap[targetChar]?.[tIndex] || targetChar;
    const resultFinal = finId.replace(targetChar, toned);
    return `${initPinyin}${resultFinal}`;
  };

  const currentFormattedPinyin = activeToneEntry
    ? activeToneEntry.pinyin
    : formatPinyinWithTone(initial, final, selectedTone);

  // Play Native Chinese Audio Trigger
  const handlePlayAudio = (overrideText?: string) => {
    if (!isComboValid) return;
    const textToSpeak = overrideText || (activeToneEntry ? activeToneEntry.hanzi : currentFormattedPinyin);

    pronunciationAudioService.playSound({
      text: textToSpeak,
      langCode: 'zh-CN',
      speed: isSlowMode ? 0.75 : 1.0,
    });

    if (onSpeak) {
      onSpeak(textToSpeak);
    }
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-5 sm:p-7 rounded-[4px] space-y-6 shadow-2xl">
      {/* 1. Header & Reset Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-safety-orange" /> 1. PINYIN SYLLABLE BUILDER (BỘ GHÉP ÂM TƯƠNG TÁC)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-0.5">
            {isDefaultMode
              ? 'Hãy chọn Thanh mẫu hoặc Vận mẫu bất kỳ bên dưới để bắt đầu ghép âm Pinyin chuẩn.'
              : 'Hệ thống tự động hiển thị âm hợp lệ và làm mờ các tổ hợp không tồn tại.'}
          </p>
        </div>

        {/* Progress Tracker & Reset Button */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {!isDefaultMode && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Đặt lại bộ ghép âm"
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/50 rounded font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ĐẶT LẠI (RESET)
            </button>
          )}

          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-1 border rounded font-bold ${
                initial !== null
                  ? 'bg-safety-orange/20 border-safety-orange/50 text-safety-orange'
                  : 'bg-canvas-ink border-whisper-border text-muted-steel'
              }`}
            >
              1. THANH: [{initial === 'none' ? 'Ø' : initial || '?'}]
            </span>
            <span className="text-muted-steel">➔</span>
            <span
              className={`px-2 py-1 border rounded font-bold ${
                final !== null
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-canvas-ink border-whisper-border text-muted-steel'
              }`}
            >
              2. VẬN: [{final || '?'}]
            </span>
            <span className="text-muted-steel">➔</span>
            <span
              className={`px-2 py-1 border rounded font-bold ${
                selectedTone !== null
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-canvas-ink border-whisper-border text-muted-steel'
              }`}
            >
              3. THANH {selectedTone || '?'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Syllable Result Stage & Verified Word Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Result Stage (5 cols) */}
        <div
          className={`md:col-span-5 p-6 border rounded-[4px] text-center flex flex-col justify-between space-y-4 transition-all shadow-inner ${
            !isCompletedMode
              ? 'bg-canvas-ink/40 border-whisper-border text-muted-steel'
              : !isComboValid
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-400'
              : 'bg-canvas-ink border-safety-orange text-titanium-white'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> XÁC MINH HÁN NGỮ 100%
            </span>
            {isCompletedMode && (
              <button
                type="button"
                onClick={() => setIsSlowMode(!isSlowMode)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  isSlowMode ? 'bg-amber-500 text-canvas-ink font-bold border-amber-500' : 'bg-canvas-ink border-whisper-border text-muted-steel'
                }`}
              >
                {isSlowMode ? '🐢 GIỌNG CHẬM (0.75x)' : '⚡ GIỌNG CHUẨN (1.0x)'}
              </button>
            )}
          </div>

          <div className="space-y-1 my-2 min-h-[100px] flex flex-col justify-center items-center">
            {isDefaultMode ? (
              <div className="text-xs font-mono text-muted-steel p-4 space-y-2">
                <HelpCircle className="w-8 h-8 text-safety-orange mx-auto opacity-70" />
                <div className="font-bold text-titanium-white">HÃY CHỌN THANH MẪU HOẶC VẬN MẪU ĐỂ BẮT ĐẦU</div>
                <div className="text-[11px] text-muted-steel">
                  Bấm vào bất kỳ nút Thanh mẫu hoặc Vận mẫu nào bên dưới. Hệ thống sẽ làm nổi bật các âm có thể ghép hợp lệ.
                </div>
              </div>
            ) : !isCompletedMode ? (
              <div className="text-xs font-mono text-amber-400 p-4 space-y-2">
                <div className="text-3xl font-black font-sans text-safety-orange">
                  {initial === 'none' ? '' : initial || ''}{final || ''}
                </div>
                <div className="text-[11px]">
                  {initial ? `Đã chọn Thanh mẫu [${initial === 'none' ? 'Ø' : initial}]. Hãy chọn Vận mẫu.` : `Đã chọn Vận mẫu [${final}]. Hãy chọn Thanh mẫu.`}
                </div>
              </div>
            ) : (
              <>
                <div className="text-6xl font-sans font-black text-safety-orange tracking-tight">
                  {currentFormattedPinyin}
                </div>
                {activeToneEntry && (
                  <div className="text-3xl font-sans font-bold text-titanium-white">
                    {activeToneEntry.hanzi}
                  </div>
                )}
              </>
            )}
          </div>

          {!isCompletedMode ? (
            <div className="text-xs font-mono text-muted-steel/60 p-2 border border-whisper-border rounded">
              Trạng thái ghép âm chưa hoàn tất
            </div>
          ) : !isComboValid ? (
            <div className="text-xs font-mono text-rose-400 flex items-center justify-center gap-1.5 font-bold p-2 bg-rose-950/40 border border-rose-500/30 rounded">
              <AlertCircle className="w-4 h-4 shrink-0" /> TỔ HỢP KHÔNG TỒN TẠI TRONG TIẾNG TRUNG!
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handlePlayAudio()}
              className="w-full py-3 bg-safety-orange hover:bg-orange-600 active:translate-y-[1px] text-canvas-ink text-xs font-mono font-bold rounded inline-flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Volume2 className="w-4.5 h-4.5" /> PHÁT ÂM CHUẨN PHỔ THÔNG (zh-CN)
            </button>
          )}
        </div>

        {/* Right: Verified Word Examples & Factory Context (7 cols) */}
        <div className="md:col-span-7 bg-pure-surface border border-whisper-border p-5 rounded-[4px] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-whisper-border pb-2.5">
            <span className="text-xs font-mono font-bold text-titanium-white uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" /> VÍ DỤ THỰC TẾ & BỐI CẢNH NHÀ MÁY
            </span>
            {activeToneEntry && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/30 rounded font-bold">
                XÁC MINH CÓ CHỮ HÁN THẬT
              </span>
            )}
          </div>

          {activeToneEntry ? (
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-start gap-3 p-3 bg-canvas-ink border border-whisper-border rounded">
                <span className="text-2xl font-black text-safety-orange">{activeToneEntry.hanzi}</span>
                <div className="space-y-0.5">
                  <div className="text-titanium-white font-bold text-sm">
                    {activeToneEntry.pinyin} - {activeToneEntry.meaningVi}
                  </div>
                  {activeToneEntry.meaningEn && (
                    <div className="text-muted-steel text-[11px]">
                      EN: {activeToneEntry.meaningEn}
                    </div>
                  )}
                  {activeToneEntry.factoryContext && (
                    <div className="text-muted-steel text-[11px] flex items-center gap-1.5 mt-1 text-emerald-400 font-bold">
                      <Factory className="w-3.5 h-3.5" /> {activeToneEntry.factoryContext}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-muted-steel p-6 text-center border border-dashed border-whisper-border rounded flex flex-col items-center justify-center space-y-1">
              <Info className="w-5 h-5 text-safety-orange opacity-70" />
              <span>
                {isDefaultMode
                  ? 'Hãy chọn Thanh mẫu hoặc Vận mẫu để xem hướng dẫn ghép âm và từ vựng xác minh.'
                  : 'Chọn đủ Thanh mẫu + Vận mẫu + Thanh điệu để hiển thị chữ Hán và bối cảnh công xưởng.'}
              </span>
            </div>
          )}

          {/* Dynamic Compatibility Tips */}
          <div className="text-[11px] font-mono text-muted-steel bg-canvas-ink/40 p-2.5 border border-whisper-border rounded flex items-center gap-2">
            <Info className="w-4 h-4 text-safety-orange shrink-0" />
            <span>
              {initial === 'j' || initial === 'q' || initial === 'x'
                ? 'Âm mặt lưỡi [j, q, x] chỉ kết hợp được với Vận mẫu bắt đầu bằng i và ü.'
                : initial === 'b' || initial === 'p' || initial === 'm' || initial === 'f'
                ? 'Âm môi [b, p, m, f] không kết hợp với Vận mẫu ü.'
                : initial === 'none'
                ? 'Âm tiết không có Thanh mẫu (Ø) kết hợp với các vận mẫu tự do (a, o, e, ai, an, er...).'
                : 'Hệ thống hiển thị đầy đủ tất cả các âm và làm mờ 100% các tổ hợp không tương thích.'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. STEP 1: INITIAL SELECTOR (All initials visible, un-disabled in DEFAULT mode) */}
      <div className="space-y-3 text-xs font-mono border-t border-whisper-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-titanium-white font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-safety-orange inline-block"></span> BƯỚC 1: CHỌN THANH MẪU (INITIAL)
          </span>
          <span className="text-muted-steel text-[11px]">
            {initial !== null ? (
              <>
                Đang chọn: <strong className="text-safety-orange">[{initial === 'none' ? 'Ø' : initial}]</strong> ({getCompatibleFinals(initial).length} Vận mẫu hợp lệ)
              </>
            ) : (
              'Hiển thị tất cả Thanh mẫu (Bấm để chọn)'
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {INITIAL_GROUPS.map((grp) => (
            <div key={grp.category} className="bg-canvas-ink/50 border border-whisper-border p-2.5 rounded space-y-1.5">
              <div className="text-[10px] text-muted-steel font-bold uppercase tracking-wider">{grp.categoryVi}</div>
              <div className="flex flex-wrap gap-1">
                {grp.items.map((ini) => {
                  const isSelected = initial === ini.id;
                  const isCompatible = isDefaultMode || compatibleInitials.includes(ini.id);

                  return (
                    <button
                      key={ini.id}
                      type="button"
                      disabled={!isCompatible}
                      onClick={() => handleSelectInitial(ini.id)}
                      aria-label={`Chọn thanh mẫu ${ini.label}`}
                      title={
                        !isCompatible && final
                          ? `Không thể ghép với Vận mẫu [${final}] đang chọn theo quy tắc Pinyin chuẩn`
                          : `Thanh mẫu ${ini.label}`
                      }
                      className={`px-3 py-1.5 rounded font-bold transition-all border text-xs flex items-center gap-1 ${
                        isSelected
                          ? 'bg-safety-orange text-canvas-ink border-safety-orange shadow-md scale-105'
                          : isCompatible
                          ? 'bg-canvas-ink border-emerald-500/40 text-titanium-white hover:border-emerald-500'
                          : 'bg-canvas-ink/40 border-whisper-border text-muted-steel/40 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {ini.label}
                      {isSelected && <Check className="w-3 h-3 text-canvas-ink stroke-[3]" />}
                      {!isCompatible && <Ban className="w-3 h-3 text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. STEP 2: FINAL SELECTOR (All finals visible, un-disabled in DEFAULT mode) */}
      <div className="space-y-3 text-xs font-mono border-t border-whisper-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-titanium-white font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> BƯỚC 2: CHỌN VẬN MẪU (FINAL)
          </span>
          <span className="text-muted-steel text-[11px]">
            {final !== null ? (
              <>
                Đang chọn: <strong className="text-emerald-400">[{final}]</strong> ({getCompatibleInitials(final).length} Thanh mẫu hợp lệ)
              </>
            ) : (
              'Hiển thị tất cả Vận mẫu (Bấm để chọn)'
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {FINAL_GROUPS.map((grp) => (
            <div key={grp.category} className="bg-canvas-ink/50 border border-whisper-border p-2.5 rounded space-y-1.5">
              <div className="text-[10px] text-muted-steel font-bold uppercase tracking-wider">{grp.categoryVi}</div>
              <div className="flex flex-wrap gap-1">
                {grp.items.map((fin) => {
                  const isSelected = final === fin;
                  const isCompatible = isDefaultMode || compatibleFinals.includes(fin);

                  return (
                    <button
                      key={fin}
                      type="button"
                      disabled={!isCompatible}
                      onClick={() => handleSelectFinal(fin)}
                      aria-label={`Chọn vận mẫu ${fin}`}
                      title={
                        !isCompatible && initial
                          ? `Không thể ghép với Thanh mẫu [${initial === 'none' ? 'Ø' : initial}] đang chọn theo quy tắc Pinyin chuẩn`
                          : `Vận mẫu ${fin}`
                      }
                      className={`px-2.5 py-1.5 rounded font-bold transition-all border text-xs flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-500 text-canvas-ink border-emerald-500 shadow-md scale-105'
                          : isCompatible
                          ? 'bg-canvas-ink border-emerald-500/40 text-titanium-white hover:border-emerald-500'
                          : 'bg-rose-950/20 border-rose-500/20 text-rose-400/40 opacity-30 cursor-not-allowed'
                      }`}
                    >
                      {fin}
                      {isSelected && <Check className="w-3 h-3 text-canvas-ink stroke-[3]" />}
                      {!isCompatible && <Ban className="w-3 h-3 text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. STEP 3: TONE SELECTOR (Shows when both initial & final selected) */}
      <div className="space-y-3 text-xs font-mono border-t border-whisper-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-titanium-white font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> BƯỚC 3: CHỌN THANH ĐIỆU CÓ CHỮ HÁN XÁC MINH
          </span>
          <span className="text-muted-steel text-[11px]">
            {isCompletedMode ? (
              <>
                Tổ hợp <strong className="text-safety-orange">[{initial === 'none' ? '' : initial}{final}]</strong> có {verifiedTones.length} thanh điệu thực tế
              </>
            ) : (
              'Chọn đủ Thanh mẫu & Vận mẫu để xem thanh điệu'
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { t: 1, label: 'Thanh 1 (ˉ 55)', symbol: 'ˉ' },
            { t: 2, label: 'Thanh 2 (ˊ 35)', symbol: 'ˊ' },
            { t: 3, label: 'Thanh 3 (ˇ 214)', symbol: 'ˇ' },
            { t: 4, label: 'Thanh 4 (ˋ 51)', symbol: 'ˋ' },
          ].map((tn) => {
            const isSelected = selectedTone === tn.t || (!selectedTone && isCompletedMode && verifiedTones[0]?.tone === tn.t);
            const isAvailable = isCompletedMode && availableToneNumbers.includes(tn.t);
            const entry = isCompletedMode ? verifiedTones.find((vt) => vt.tone === tn.t) : null;

            return (
              <button
                key={tn.t}
                type="button"
                disabled={!isCompletedMode || !isAvailable}
                onClick={() => setSelectedTone(tn.t)}
                aria-label={`Chọn thanh điệu ${tn.t}`}
                className={`p-3 rounded-[4px] font-bold transition-all border text-left flex flex-col justify-between space-y-1 ${
                  !isCompletedMode
                    ? 'bg-canvas-ink/40 border-whisper-border text-muted-steel/40 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-amber-500 text-canvas-ink border-amber-500 shadow-md scale-[1.02]'
                    : isAvailable
                    ? 'bg-canvas-ink border-whisper-border text-titanium-white hover:border-amber-500'
                    : 'bg-canvas-ink/40 border-whisper-border text-muted-steel/40 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs">{tn.label}</span>
                  {entry && <span className="text-sm font-black">{entry.hanzi}</span>}
                </div>
                {entry ? (
                  <div className={`text-[10px] truncate ${isSelected ? 'text-canvas-ink font-semibold' : 'text-muted-steel'}`}>
                    {entry.pinyin} - {entry.meaningVi}
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-steel/60 italic">
                    {isCompletedMode ? 'Chưa có bản ghi' : '---'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
