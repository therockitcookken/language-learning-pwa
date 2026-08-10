'use client';

import React from 'react';

interface DictionarySkeletonProps {
  count?: number;
}

export function DictionarySkeleton({ count = 6 }: DictionarySkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-pure-surface border border-whisper-border p-5 rounded-[4px] space-y-4 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-8 bg-canvas-ink w-1/3 rounded" />
              <div className="h-4 bg-canvas-ink w-1/4 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-canvas-ink rounded" />
              <div className="w-8 h-8 bg-canvas-ink rounded" />
              <div className="w-8 h-8 bg-canvas-ink rounded" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-whisper-border">
            <div className="h-4 bg-canvas-ink w-3/4 rounded" />
            <div className="h-3 bg-canvas-ink w-1/2 rounded" />
          </div>

          <div className="h-10 bg-canvas-ink rounded" />
        </div>
      ))}
    </div>
  );
}
