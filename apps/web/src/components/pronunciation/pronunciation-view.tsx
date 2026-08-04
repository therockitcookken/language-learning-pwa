'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { audioEngine } from '@/lib/audio/audio-engine';
import {
  Volume2,
  Mic,
  CheckCircle2,
  Activity,
  RotateCw,
  Sliders,
  Sparkles,
} from 'lucide-react';

export function PronunciationView() {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<'chinese' | 'english' | 'recorder'>('chinese');
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [recording, setRecording] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  // Helper 1: Playback Speed Control
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Helper 2: Audio Loop Count
  const [loopCount, setLoopCount] = useState(1);

  // Helper 3: Minimal Pair Distinction Test State
  const [pairScore, setPairScore] = useState<number | null>(null);

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
    for (let i = 0; i < loopCount; i++) {
      setTimeout(() => {
        audioEngine.speak(symbol, langCode, playbackSpeed);
      }, i * 1200);
    }
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
            Luyện phát âm chuẩn Pinyin & IPA với biểu đồ đồ thị cao độ thanh điệu 5 bậc & bài tập phân biệt âm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
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
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  {subTab === 'chinese' ? 'Bảng Thanh Mẫu & Vận Mẫu' : 'Bảng Ký Tự IPA'}
                </h3>

                {/* Helper 1: Speed & Loop Controls */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-slate-400">Tốc độ:</span>
                  {[0.75, 1.0, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        playbackSpeed === spd ? 'bg-orange-500 text-white' : 'text-slate-400'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                  <span className="text-slate-400 ml-2">Lặp:</span>
                  {[1, 2, 3].map((lp) => (
                    <button
                      key={lp}
                      onClick={() => setLoopCount(lp)}
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        loopCount === lp ? 'bg-amber-500 text-white' : 'text-slate-400'
                      }`}
                    >
                      {lp}x
                    </button>
                  ))}
                </div>
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

            {/* Helper 2: Pitch Contour Curve Visualizer (Thanh điệu 55, 35, 214, 51) */}
            {subTab === 'chinese' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Đồ Thị Cao Độ 4 Thanh Điệu Pinyin (Tone Pitch Curves)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Thanh 1 (55)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Cao - Bằng phẳng</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Thanh 2 (35)</span>
                    <span className="text-[10px] text-indigo-400 font-mono">Nâng giọng lên</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Thanh 3 (214)</span>
                    <span className="text-[10px] text-amber-400 font-mono">Hạ thấp rồi lên</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Thanh 4 (51)</span>
                    <span className="text-[10px] text-rose-400 font-mono">Giật giọng xuống</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sound Detail & Minimal Pair Drill */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
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
                    <span className="font-bold text-slate-300 block mb-1">Mô tả phát âm:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedAsset.descriptionVi}</p>
                  </div>
                </div>

                {/* Helper 3: Minimal Pair Distinction Test */}
                {selectedAsset.confusedWith && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 space-y-2 text-xs">
                    <span className="font-extrabold text-orange-400 block">
                      🎯 Bài tập phân biệt âm dễ nhầm: [{selectedAsset.symbol}] vs [{selectedAsset.confusedWith}]
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakSymbol(selectedAsset.symbol)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg font-bold"
                      >
                        Nghe [{selectedAsset.symbol}]
                      </button>
                      <button
                        onClick={() => handleSpeakSymbol(selectedAsset.confusedWith)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg font-bold"
                      >
                        Nghe [{selectedAsset.confusedWith}]
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
