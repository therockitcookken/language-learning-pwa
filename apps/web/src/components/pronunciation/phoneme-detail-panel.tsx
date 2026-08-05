'use client';

import React from 'react';
import { Volume2, BookOpen, AlertTriangle, Lightbulb, CheckCircle2, Sparkles, X } from 'lucide-react';
import { PinyinRecord, IPARecord } from '@/lib/validation/pronunciation-schema';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

interface PhonemeDetailPanelProps {
  pinyinRecord?: PinyinRecord | null;
  ipaRecord?: IPARecord | null;
  onClose?: () => void;
}

export function PhonemeDetailPanel({ pinyinRecord, ipaRecord, onClose }: PhonemeDetailPanelProps) {
  const isPinyin = Boolean(pinyinRecord);
  const record = pinyinRecord || ipaRecord;

  if (!record) {
    return (
      <div className="bg-pure-surface border border-whisper-border p-6 rounded-[4px] text-center text-xs font-mono text-muted-steel space-y-2">
        <BookOpen className="w-8 h-8 text-safety-orange mx-auto opacity-60" />
        <p>Chọn một âm Pinyin hoặc IPA từ bảng bên trái để xem hướng dẫn khẩu hình chi tiết.</p>
      </div>
    );
  }

  const symbol = record.symbol;
  const langCode = isPinyin ? 'zh-CN' : 'en-US';

  const handlePlayAudio = (text: string) => {
    pronunciationAudioService.playSound({ text, langCode, speed: 1.0 });
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-5 rounded-[4px] space-y-5 shadow-2xl relative animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-whisper-border pb-3">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-steel">
          <BookOpen className="w-4 h-4 text-safety-orange" />
          <span>CHI TIẾT ÂM [{symbol}]</span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 text-muted-steel hover:text-safety-orange">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Symbol Banner */}
      <div className="bg-canvas-ink p-5 border border-whisper-border rounded flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-mono font-black text-titanium-white">{symbol}</h2>
          <span className="text-xs font-mono text-safety-orange font-bold mt-1 block">{record.category}</span>
        </div>
        <button
          type="button"
          onClick={() => handlePlayAudio(symbol)}
          className="p-3 bg-safety-orange text-canvas-ink rounded-full hover:bg-orange-600 transition-transform active:scale-95 shadow"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <div className="space-y-2 text-xs font-sans">
        <div className="font-mono text-[10px] text-muted-steel uppercase font-bold">MÔ TẢ CẤU ÂM</div>
        <p className="text-titanium-white leading-relaxed">{record.descriptionVi}</p>
        <div className="p-2.5 bg-canvas-ink border-l-2 border-safety-orange text-muted-steel rounded-r text-[11px] font-mono">
          <strong>So sánh tiếng Việt:</strong> {record.articulation.vietnameseComparison}
        </div>
      </div>

      {/* Common Mistakes & Correction Tips */}
      <div className="space-y-3 pt-2 border-t border-whisper-border text-xs font-mono">
        <div className="space-y-1.5">
          <div className="text-rose-400 font-bold flex items-center gap-1.5 text-[10px] uppercase">
            <AlertTriangle className="w-3.5 h-3.5" /> LỖI NGƯỜI VIỆT THƯỜNG GẶP
          </div>
          <ul className="space-y-1 text-muted-steel list-disc pl-4 text-[11px]">
            {record.commonMistakes?.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[10px] uppercase">
            <Lightbulb className="w-3.5 h-3.5" /> MẸO SỬA PHÁT ÂM CHUẨN
          </div>
          <ul className="space-y-1 text-muted-steel list-disc pl-4 text-[11px]">
            {record.correctionTips?.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Example Words */}
      {record.exampleWords && record.exampleWords.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-whisper-border text-xs font-mono">
          <div className="text-muted-steel uppercase font-bold text-[10px]">TỪ VỰNG THỰC TẾ VÍ DỤ</div>
          <div className="space-y-2">
            {record.exampleWords.map((w) => (
              <div key={w.id} className="p-2.5 bg-canvas-ink border border-whisper-border rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-titanium-white text-sm">{w.text}</div>
                  <div className="text-safety-orange text-xs">{w.phonetic}</div>
                  <div className="text-muted-steel text-[11px] font-sans">{w.meaningVi}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(w.text)}
                  className="p-1.5 rounded bg-pure-surface border border-whisper-border text-safety-orange hover:text-titanium-white"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
