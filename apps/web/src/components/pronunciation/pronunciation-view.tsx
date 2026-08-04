'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import {
  Volume2,
  Mic,
  CheckCircle2,
  VolumeX,
  Sparkles,
  Info,
  Layers,
  Activity,
} from 'lucide-react';

export function PronunciationView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'chinese' | 'english' | 'recorder'>('chinese');
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [recording, setRecording] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const fetchAssets = async (language: string) => {
    try {
      const res = await fetch(`/api/v1/pronunciation/assets?lang=${language}`);
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
    if (subTab === 'chinese') fetchAssets('zh');
    else if (subTab === 'english') fetchAssets('en');
  }, [subTab]);

  const handleSpeakSymbol = (symbol: string, langCode: 'zh-CN' | 'en-US' = 'zh-CN') => {
    audioEngine.speak(symbol, langCode);
  };

  const handleStartRecording = () => {
    setRecording(true);
    setEvaluation(null);

    setTimeout(async () => {
      setRecording(false);
      const res = await fetch('/api/v1/pronunciation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetText: selectedAsset?.symbol || 'b',
          recognizedText: selectedAsset?.symbol || 'b',
          language: subTab === 'english' ? 'en' : 'zh',
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
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>🗣️</span> {t.pronunciation}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Luyện phát âm chuẩn Pinyin tiếng Trung & IPA tiếng Anh với quy tắc biến điệu và chấm điểm bằng giọng nói.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setSubTab('chinese')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'chinese'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇨🇳 Pinyin Tiếng Trung
          </button>
          <button
            onClick={() => setSubTab('english')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'english'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇺🇸 IPA Tiếng Anh
          </button>
          <button
            onClick={() => setSubTab('recorder')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'recorder'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 inline mr-1" /> Phòng Ghi Âm & Chấm Điểm
          </button>
        </div>
      </div>

      {(subTab === 'chinese' || subTab === 'english') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sound Matrix Grid */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                {subTab === 'chinese' ? 'Bảng Thanh Mẫu (Initials)' : 'Bảng Ký Tự Âm Tiết IPA'}
              </h3>
              <span className="text-[10px] text-orange-400 font-bold bg-orange-950/60 px-2.5 py-0.5 rounded border border-orange-500/30">
                Bấm vào âm tiết để nghe phát âm
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {assets.map((item) => {
                const isSelected = selectedAsset?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAsset(item)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-400 text-white shadow-lg scale-105 font-bold'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-orange-500/40 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl font-black">{item.symbol}</span>
                    <span className="text-[10px] opacity-80 uppercase mt-0.5">{item.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Sound Detail & Guide */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xl">
            {selectedAsset && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-4xl font-black text-white">{selectedAsset.symbol}</h3>
                    <span className="text-xs text-orange-400 font-extrabold uppercase">
                      {selectedAsset.type}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleSpeakSymbol(
                        selectedAsset.symbol,
                        subTab === 'english' ? 'en-US' : 'zh-CN'
                      )
                    }
                    className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">Khẩu hình & Mô tả:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedAsset.descriptionVi}</p>
                  </div>

                  {selectedAsset.airflowGuide && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-amber-300 block mb-1">Hướng luồng hơi:</span>
                      <p className="text-amber-200">{selectedAsset.airflowGuide}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'recorder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto space-y-6 shadow-2xl text-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Phòng Luyện Ghi Âm & So Sánh Giọng Nói</h3>
            <p className="text-xs text-slate-400">
              Phát âm từ mẫu, ghi âm giọng nói của bạn và nhận phản hồi chi tiết về thanh điệu và luồng hơi.
            </p>
          </div>

          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs text-slate-500 font-bold uppercase">Mẫu từ phát âm:</span>
            <div className="text-4xl font-black text-white">安全 (ān quán)</div>
            <button
              onClick={() => handleSpeakSymbol('安全', 'zh-CN')}
              className="px-4 py-2 bg-slate-800 hover:bg-orange-500 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              🔊 Nghe giọng chuẩn mẫu
            </button>
          </div>

          <button
            onClick={handleStartRecording}
            disabled={recording}
            className={`w-full py-4 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
              recording
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/30'
                : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/20'
            }`}
          >
            {recording ? '🎙️ Đang ghi âm... Nhấn để hoàn thành' : '🎙️ Bắt đầu Ghi âm & Chấm điểm'}
          </button>

          {evaluation && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Điểm số phát âm của bạn:
                </span>
                <span className="text-2xl font-black text-amber-400">{evaluation.overallScore}/100</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{evaluation.feedbackVi}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
