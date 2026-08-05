'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Filter, Globe } from 'lucide-react';
import { IPARecord } from '@/lib/validation/pronunciation-schema';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

interface IPAChartProps {
  records: IPARecord[];
  selectedSymbol: string;
  onSelectSymbol: (record: IPARecord) => void;
}

export function EnglishIPAChart({ records, selectedSymbol, onSelectSymbol }: IPAChartProps) {
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [filterGroup, setFilterGroup] = useState<string>('all');

  const filteredRecords = records.filter((r) => {
    if (filterGroup === 'all') return true;
    return r.group === filterGroup;
  });

  const handlePlayAudio = (record: IPARecord) => {
    pronunciationAudioService.playSound({
      text: record.symbol,
      langCode: accent,
      speed: 1.0,
    });
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-6 rounded-[4px] space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> 1. IPA INTERACTIVE MAP (BẢN ĐỒ KÝ TỰ PHÁT ÂM QUỐC TẾ IPA)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            Bản đồ ký tự IPA chuẩn phân loại Phụ âm, Nguyên âm đơn và Nguyên âm đôi với hỗ trợ phát âm Anh-Mỹ & Anh-Anh.
          </p>
        </div>

        {/* Accent Selector Toggle */}
        <div className="flex items-center gap-1.5 bg-canvas-ink border border-whisper-border p-1 rounded-[4px]">
          <button
            type="button"
            onClick={() => setAccent('en-US')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              accent === 'en-US' ? 'bg-blue-500 text-canvas-ink' : 'text-muted-steel hover:text-titanium-white'
            }`}
          >
            🇺🇸 US (AMERICAN)
          </button>
          <button
            type="button"
            onClick={() => setAccent('en-GB')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              accent === 'en-GB' ? 'bg-indigo-500 text-canvas-ink' : 'text-muted-steel hover:text-titanium-white'
            }`}
          >
            🇬🇧 UK (BRITISH)
          </button>
        </div>
      </div>

      {/* Group Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'TẤT CẢ PHONEMES' },
          { id: 'consonant', label: 'PHỤ ÂM (CONSONANTS)' },
          { id: 'monophthong', label: 'NGUYÊN ÂM ĐƠN (MONOPHTHONGS)' },
          { id: 'diphthong', label: 'NGUYÊN ÂM ĐÔI (DIPHTHONGS)' },
        ].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setFilterGroup(g.id)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
              filterGroup === g.id
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* IPA Grid Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredRecords.map((r) => {
          const isSelected = selectedSymbol === r.symbol;
          return (
            <div
              key={r.id}
              onClick={() => {
                onSelectSymbol(r);
                handlePlayAudio(r);
              }}
              className={`p-4 rounded border text-center cursor-pointer transition-all relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/30 border-blue-500 text-blue-400 ring-1 ring-blue-500 shadow-lg'
                  : 'bg-canvas-ink border-whisper-border hover:border-muted-steel text-titanium-white'
              }`}
            >
              <div>
                <span className="text-[9px] font-mono text-muted-steel uppercase block mb-1">{r.group}</span>
                <div className="text-2xl font-mono font-bold text-titanium-white group-hover:text-blue-400 transition-colors">
                  {r.symbol}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-whisper-border/50 flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-steel truncate">{r.exampleWords?.[0]?.text || 'example'}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(r);
                  }}
                  className="p-1 rounded bg-pure-surface text-blue-400 hover:text-titanium-white"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
