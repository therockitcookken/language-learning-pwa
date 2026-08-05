'use client';

import React from 'react';
import { DownloadCloud } from 'lucide-react';
import { AnimatedButton } from '@/components/common/animations';

export function PwaInstallButton() {
  return (
    <a href="/FactoryLang.apk" download="FactoryLang.apk" className="block">
      <AnimatedButton
        soundType="click"
        onClick={() => {}}
        className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-2.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all border border-emerald-400/30"
      >
        <DownloadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Tải App (APK)</span>
        <span className="sm:hidden">Tải APK</span>
      </AnimatedButton>
    </a>
  );
}
