'use client';

import React from 'react';
import { Volume2, Sparkles, Wind, Eye } from 'lucide-react';

interface ArticulationDiagramProps {
  symbol: string;
  placeOfArticulation: string;
  tonguePosition: string;
  lipPosition: string;
  airflow: string;
  isAspirated?: boolean;
}

export function ArticulationDiagram({
  symbol,
  placeOfArticulation,
  tonguePosition,
  lipPosition,
  airflow,
  isAspirated,
}: ArticulationDiagramProps) {
  return (
    <div className="bg-canvas-ink/90 border border-whisper-border p-5 rounded-[4px] space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-whisper-border pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-safety-orange" />
          <h4 className="text-xs font-mono font-bold text-titanium-white uppercase tracking-wider">
            SƠ ĐỒ CẤU ÂM INTERACTIVE (MOUTH & TONGUE CROSS-SECTION)
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-safety-orange/20 text-safety-orange border border-safety-orange/40">
          SYMBOL: [{symbol}]
        </span>
      </div>

      {/* SVG Anatomical Mouth & Tongue Interactive Diagram */}
      <div className="relative bg-pure-surface border border-whisper-border rounded-[4px] p-6 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
        <svg viewBox="0 0 400 240" className="w-full h-48 max-w-sm">
          {/* Upper Jaw & Hard Palate */}
          <path
            d="M 60 70 C 140 30, 260 30, 320 90 L 340 100"
            fill="none"
            stroke="#52525b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Teeth (Upper & Lower) */}
          <rect x="110" y="85" width="12" height="18" rx="2" fill="#fafafa" stroke="#27272a" />
          <rect x="110" y="145" width="12" height="18" rx="2" fill="#fafafa" stroke="#27272a" />

          {/* Lips (Upper & Lower) */}
          <path d="M 90 75 Q 110 85 105 100" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
          <path d="M 90 170 Q 110 160 105 145" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />

          {/* Tongue Position */}
          <path
            d={
              isAspirated
                ? "M 130 155 Q 190 120 280 160 Q 220 180 130 155 Z" // Raised tongue tip
                : "M 130 160 Q 200 145 280 160 Q 220 185 130 160 Z" // Relaxed tongue
            }
            fill="#ea580c"
            fillOpacity="0.4"
            stroke="#f97316"
            strokeWidth="4"
            className="transition-all duration-500"
          />

          {/* Airflow Direction Vector Arrow */}
          <path
            d="M 270 125 C 210 115, 150 115, 80 115"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          <polygon points="75,115 88,110 88,120" fill="#38bdf8" />
        </svg>

        {isAspirated && (
          <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-1 rounded flex items-center gap-1">
            <Wind className="w-3.5 h-3.5" /> LUỒNG HƠI BẬT MẠNH (ASPIRATED)
          </div>
        )}
      </div>

      {/* Articulation Breakdown Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-pure-surface p-3 border border-whisper-border rounded space-y-1">
          <span className="text-muted-steel text-[10px] uppercase">VỊ TRÍ CẤU ÂM (PLACE)</span>
          <div className="font-bold text-titanium-white">{placeOfArticulation}</div>
        </div>

        <div className="bg-pure-surface p-3 border border-whisper-border rounded space-y-1">
          <span className="text-muted-steel text-[10px] uppercase">VỊ TRÍ LƯỠI (TONGUE)</span>
          <div className="font-bold text-safety-orange">{tonguePosition}</div>
        </div>

        <div className="bg-pure-surface p-3 border border-whisper-border rounded space-y-1">
          <span className="text-muted-steel text-[10px] uppercase">HÌNH DẠNG MÔI (LIPS)</span>
          <div className="font-bold text-titanium-white">{lipPosition}</div>
        </div>

        <div className="bg-pure-surface p-3 border border-whisper-border rounded space-y-1">
          <span className="text-muted-steel text-[10px] uppercase">LUỒNG HƠI THỔI (AIRFLOW)</span>
          <div className="font-bold text-sky-400">{airflow}</div>
        </div>
      </div>
    </div>
  );
}
