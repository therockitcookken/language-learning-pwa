'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Volume2,
  Activity,
  AlertCircle,
  CheckCircle2,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Factory,
  Layers,
} from 'lucide-react';
import { SHADOWING_DATASET, ShadowingRecord } from '@/lib/data/shadowing-dataset';
import { FactoryTopic } from '@/lib/data/minimal-pair-dataset';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

interface ShadowingRecorderProps {
  langCode?: 'zh-CN' | 'en-US' | 'en-GB';
}

export function ChineseShadowingRecorder({ langCode = 'zh-CN' }: ShadowingRecorderProps) {
  const [selectedTopic, setSelectedTopic] = useState<FactoryTopic | 'all'>('all');
  const [currentIdx, setCurrentIdx] = useState(0);

  const [permission, setPermission] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Filter dataset by language code & topic
  const filteredDataset = useMemo(() => {
    return SHADOWING_DATASET.filter((item) => {
      const matchLang = langCode.startsWith('zh') ? item.langCode.startsWith('zh') : item.langCode === langCode;
      const matchTopic = selectedTopic === 'all' || item.topic === selectedTopic;
      return matchLang && matchTopic;
    });
  }, [langCode, selectedTopic]);

  const activeRecord: ShadowingRecord | undefined = filteredDataset[currentIdx] || filteredDataset[0];

  const handleNext = () => {
    if (currentIdx < filteredDataset.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setRecordedUrl(null);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setRecordedUrl(null);
    }
  };

  // Microphone permission check
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission(true);
      stream.getTracks().forEach((track) => track.stop()); // close test stream
    } catch {
      setPermission(false);
    }
  };

  const handleStartShadowing = async () => {
    if (!permission) {
      await requestMicPermission();
    }

    setRecordedUrl(null);
    setCountdown(3);

    let count = 3;
    const cdInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(cdInterval);
        setCountdown(null);
        startActualRecording();
      }
    }, 1000);
  };

  const startActualRecording = async () => {
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
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
        stream.getTracks().forEach((track) => track.stop()); // release mic
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setPermission(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handlePlaySample = (speed = 1.0) => {
    if (!activeRecord) return;
    pronunciationAudioService.playSound({
      text: activeRecord.targetText,
      langCode: activeRecord.langCode,
      speed,
    });
  };

  const handlePlayUserRecord = () => {
    if (!recordedUrl) return;
    const audio = new Audio(recordedUrl);
    audio.play();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-pure-surface border border-whisper-border p-5 sm:p-7 rounded-[4px] space-y-6 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Mic className="w-5 h-5 text-safety-orange" /> 5. SHADOWING RECORDER & WAVEFORM COMPARISON STUDIO
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            Ghi âm giọng đọc qua Microphone, đối chiếu dạng sóng âm (waveform) với mẫu chuẩn. Không sinh điểm phần trăm giả.
          </p>
        </div>

        {/* Topic Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="w-4 h-4 text-safety-orange" />
          <select
            value={selectedTopic}
            aria-label="Chọn chủ đề công xưởng"
            onChange={(e) => {
              setSelectedTopic(e.target.value as any);
              setCurrentIdx(0);
              setRecordedUrl(null);
            }}
            className="bg-canvas-ink border border-whisper-border text-titanium-white rounded px-2 py-1 text-xs font-mono font-bold"
          >
            <option value="all">🌐 Tất cả câu Shadowing ({filteredDataset.length})</option>
            <option value="maintenance">🔧 Bảo trì (Maintenance)</option>
            <option value="safety">🛡️ An toàn (Safety)</option>
            <option value="quality">🔍 Chất lượng (Quality)</option>
            <option value="emergency">🚨 Khẩn cấp (Emergency)</option>
          </select>
        </div>
      </div>

      {!activeRecord ? (
        <div className="p-8 text-center text-xs font-mono text-muted-steel bg-canvas-ink border border-whisper-border rounded">
          Chưa có câu Shadowing cho chủ đề này. Xin vui lòng chọn chủ đề khác.
        </div>
      ) : (
        <>
          {/* Target Sentence Info Card */}
          <div className="bg-canvas-ink p-6 border border-whisper-border rounded space-y-4 text-center shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2.5 py-1 bg-safety-orange/20 border border-safety-orange/40 text-safety-orange font-bold rounded">
                CÂU {currentIdx + 1} / {filteredDataset.length} - [{activeRecord.topic.toUpperCase()}]
              </span>
              <span className="text-muted-steel flex items-center gap-1">
                <Factory className="w-3.5 h-3.5 text-emerald-400" /> {activeRecord.factoryContext}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-sans font-black text-titanium-white tracking-tight">
              {activeRecord.targetText}
            </div>
            <div className="text-sm font-mono font-bold text-safety-orange">{activeRecord.phonetic}</div>
            <div className="text-xs font-sans text-muted-steel max-w-xl mx-auto">{activeRecord.meaningVi}</div>

            {/* Audio Sample Playback Controls */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handlePlaySample(1.0)}
                className="px-4 py-2 bg-safety-orange hover:bg-orange-600 text-xs font-mono font-bold text-canvas-ink rounded inline-flex items-center gap-2 shadow"
              >
                <Volume2 className="w-4 h-4" /> NGHE GIỌNG MẪU CHUẨN (1.0x)
              </button>

              <button
                type="button"
                onClick={() => handlePlaySample(0.75)}
                className="px-3.5 py-2 bg-pure-surface border border-whisper-border hover:border-amber-500 text-xs font-mono text-amber-400 rounded inline-flex items-center gap-1.5"
              >
                🐢 CHẬM (0.75x)
              </button>
            </div>
          </div>

          {/* Key Vocabulary Breakdown Cards */}
          {activeRecord.keyVocabulary && activeRecord.keyVocabulary.length > 0 && (
            <div className="bg-canvas-ink/60 border border-whisper-border p-4 rounded space-y-2 text-xs font-mono">
              <div className="text-[11px] text-muted-steel font-bold uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> TỪ VỰNG TRỌNG TÂM TRONG CÂU
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeRecord.keyVocabulary.map((vocab, i) => (
                  <div key={i} className="p-2.5 bg-pure-surface border border-whisper-border rounded space-y-0.5">
                    <div className="font-bold text-safety-orange text-sm flex items-center justify-between">
                      <span>{vocab.word}</span>
                      <button
                        type="button"
                        onClick={() => pronunciationAudioService.playSound({ text: vocab.word, langCode: activeRecord.langCode })}
                        className="text-muted-steel hover:text-titanium-white"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-titanium-white">{vocab.phonetic}</div>
                    <div className="text-[10px] text-muted-steel">{vocab.meaningVi}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recording Stage Controls */}
          <div className="bg-canvas-ink border border-whisper-border p-6 rounded text-center space-y-4">
            {countdown !== null ? (
              <div className="space-y-2">
                <div className="text-6xl font-mono font-black text-safety-orange animate-ping">{countdown}</div>
                <div className="text-xs font-mono text-muted-steel">Đang đếm ngược... Chuẩn bị nói vào Micro!</div>
              </div>
            ) : recording ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-rose-950/40 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  ĐANG GHI ÂM... ({recordingDuration}s)
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-titanium-white text-xs font-mono font-bold rounded inline-flex items-center gap-2 shadow"
                  >
                    <Square className="w-4 h-4" /> DỪNG GHI ÂM
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleStartShadowing}
                  className="px-6 py-3 bg-safety-orange hover:bg-orange-600 active:translate-y-[1px] text-canvas-ink text-xs font-mono font-bold rounded inline-flex items-center gap-2 shadow-lg transition-all"
                >
                  <Mic className="w-4 h-4" /> BẮT ĐẦU GHI ÂM (START SHADOWING)
                </button>

                {permission === false && (
                  <div className="text-xs font-mono text-rose-400 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Chưa cấp quyền truy cập Microphone trong trình duyệt!
                  </div>
                )}
              </div>
            )}

            {/* Audio Recorded Output & Waveform Display */}
            {recordedUrl && (
              <div className="pt-4 border-t border-whisper-border space-y-3 animate-in fade-in">
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> ĐÃ GHI ÂM THÀNH CÔNG! (BẢN BĂNG GHI ÂM SẴN SÀNG)
                </div>

                {/* Simulated Waveform Visualizer */}
                <div className="bg-pure-surface border border-whisper-border p-3 rounded h-20 flex items-center justify-center gap-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-safety-orange rounded-full transition-all duration-300"
                      style={{ height: `${Math.max(15, Math.sin(i * 0.4) * 100)}%` }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePlayUserRecord}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-canvas-ink text-xs font-mono font-bold rounded flex items-center gap-1.5 shadow"
                  >
                    <Play className="w-4 h-4" /> NGHE LẠI BẢN GHI
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlaySample(1.0)}
                    className="px-4 py-2 bg-pure-surface border border-whisper-border hover:border-safety-orange text-xs font-mono text-titanium-white rounded flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4 text-safety-orange" /> NGHE MẪU ĐỐI CHIẾU
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-3.5 py-1.5 bg-pure-surface border border-whisper-border disabled:opacity-30 text-xs font-mono text-titanium-white rounded flex items-center gap-1 font-bold"
            >
              <ChevronLeft className="w-4 h-4" /> CÂU TRƯỚC
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIdx === filteredDataset.length - 1}
              className="px-3.5 py-1.5 bg-safety-orange hover:bg-orange-600 disabled:opacity-30 text-xs font-mono text-canvas-ink rounded flex items-center gap-1 font-bold shadow"
            >
              CÂU TIẾP theo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
