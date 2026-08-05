'use client';

import React from 'react';

interface AudioVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
}

export function AudioVisualizer({ isPlaying = true, barCount = 16 }: AudioVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-8 px-2">
      {bars.map((idx) => {
        const heightPercent = isPlaying ? 20 + Math.sin(idx * 0.8) * 70 + Math.random() * 20 : 15;
        return (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-150 ${
              isPlaying
                ? 'bg-gradient-to-t from-orange-500 via-amber-400 to-indigo-400 animate-pulse'
                : 'bg-slate-700'
            }`}
            style={{
              height: `${Math.max(15, Math.min(100, heightPercent))}%`,
            }}
          />
        );
      })}
    </div>
  );
}
