'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import { Volume2, Mic, CheckCircle2, AlertCircle, RefreshCw, Activity } from 'lucide-react';

export function PronunciationView() {
  const { t } = useI18n();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [recording, setRecording] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch(`/api/v1/pronunciation/assets?lang=${lang}`);
      const json = await res.json();
      if (json.data) {
        setAssets(json.data);
        if (json.data.length > 0) {
          setSelectedAsset(json.data[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [lang]);

  const handleSpeakSymbol = (symbol: string) => {
    audioEngine.speak(symbol, lang === 'zh' ? 'zh-CN' : 'en-US');
  };

  const handleStartRecording = () => {
    setRecording(true);
    setEvaluation(null);

    // Simulate voice recording & acoustic evaluation
    setTimeout(async () => {
      setRecording(false);
      const res = await fetch('/api/v1/pronunciation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetText: selectedAsset?.symbol || 'b',
          recognizedText: selectedAsset?.symbol || 'b',
          language: lang,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setEvaluation(json.data);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🗣️</span> {t.pronunciation}
          </h2>
          <p className="text-xs text-slate-400">
            Luyện phát âm chuẩn Pinyin tiếng Trung & IPA tiếng Anh với công cụ so sánh giọng nói & phản hồi tức thì.
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setLang('zh')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'zh'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇨🇳 Pinyin Tiếng Trung
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇺🇸 IPA Tiếng Anh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sound Matrix */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {lang === 'zh' ? 'Bảng Thanh Mẫu & Âm Tiết' : 'Bảng Nguyên Âm & Phụ Âm IPA'}
          </h3>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {assets.map((item) => {
              const isSelected = selectedAsset?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedAsset(item)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400 text-white shadow-lg scale-105 font-bold'
                      : 'bg-slate-800/80 border-slate-700/80 hover:border-orange-500/40 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl font-extrabold">{item.symbol}</span>
                  <span className="text-[10px] opacity-80 uppercase mt-0.5">{item.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detail & Speech Recorder */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-3xl font-extrabold text-white">{selectedAsset.symbol}</h3>
                  <span className="text-xs text-orange-400 font-semibold uppercase">
                    {selectedAsset.type}
                  </span>
                </div>
                <button
                  onClick={() => handleSpeakSymbol(selectedAsset.symbol)}
                  className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  title="Phát âm mẫu"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Description & Airflow Guide */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-1">Mô tả phát âm:</span>
                  <p className="text-slate-300">{selectedAsset.descriptionVi}</p>
                </div>
                {selectedAsset.airflowGuide && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">Hướng luồng hơi:</span>
                    <p className="text-amber-200">{selectedAsset.airflowGuide}</p>
                  </div>
                )}
                {selectedAsset.confusedWith && (
                  <div className="text-xs text-orange-400 font-medium">
                    ⚠️ Dễ nhầm lẫn với âm: <span className="font-bold text-white">[{selectedAsset.confusedWith}]</span>
                  </div>
                )}
              </div>

              {/* Voice Recorder Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartRecording}
                  disabled={recording}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    recording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  {recording ? 'Đang ghi âm giọng nói...' : 'Bấm để Ghi âm & Chấm điểm'}
                </button>
              </div>

              {/* Evaluation Feedback Panel */}
              {evaluation && (
                <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Kết quả chấm điểm:
                    </span>
                    <span className="text-lg font-black text-amber-400">
                      {evaluation.overallScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium">{evaluation.feedbackVi}</p>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-center font-semibold">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                      Thanh mẫu: {evaluation.initialScore}%
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                      Vận mẫu: {evaluation.finalScore}%
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                      Thanh điệu: {evaluation.toneScore}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
