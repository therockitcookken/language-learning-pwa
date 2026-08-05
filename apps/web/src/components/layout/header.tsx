'use client';

import React, { useEffect, useState } from 'react';
import { useI18n, LanguageCode } from '@/lib/i18n/i18n-context';
import { useUserProgress } from '@/lib/contexts/user-progress-context';
import { ShieldCheck, Flame, Zap, UserCheck, Globe, Sparkles, Cpu } from 'lucide-react';
import { NumberCounter } from '@/components/common/animations';

export function Header() {
  const { language, setLanguage, t } = useI18n();
  const progress = useUserProgress();
  const [pulse, setPulse] = useState(false);

  // Trigger pulse animation when XP changes
  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [progress.xp]);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/75 backdrop-blur-2xl border-b border-slate-800/60 px-4 sm:px-8 py-3.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name Block */}
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-500 p-[1.5px] shadow-2xl shadow-orange-500/30 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center text-xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-indigo-500/20" />
              <Cpu className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 via-amber-500/40 to-indigo-500/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-shimmer text-lg tracking-tight drop-shadow-sm font-sans">
                {t.appName}
              </h1>
              <span className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-indigo-500/20 text-orange-300 border border-orange-500/30 shadow-md hidden sm:inline-flex items-center gap-1 backdrop-blur-md">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" /> PWA v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* User Stats & Language Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* XP Badge */}
          <div className={`flex items-center gap-1.5 bg-gradient-to-r from-indigo-950/80 via-slate-900/80 to-indigo-950/80 border px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-200 shadow-xl transition-all cursor-default backdrop-blur-md ${pulse ? 'border-indigo-400 scale-105 shadow-indigo-500/30' : 'border-indigo-500/30 hover:border-indigo-400/60 shadow-indigo-500/10 hover:scale-105'}`}>
            <Zap className={`w-4 h-4 text-amber-400 fill-amber-400 ${pulse ? 'animate-bounce' : 'animate-pulse'}`} />
            <span className="font-black tracking-wide">
              <NumberCounter value={progress.xp} format={(v) => `${v} XP`} duration={1.0} />
            </span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-950/80 via-slate-900/80 to-amber-950/80 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-200 shadow-xl shadow-orange-500/10 hover:border-orange-400/60 transition-all hover:scale-105 cursor-default backdrop-blur-md">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="font-black tracking-wide">{progress.streak} {t.streakDays}</span>
          </div>

          {/* User / Guest Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 shadow-lg backdrop-blur-md">
            {progress.isGuest ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <UserCheck className="w-4 h-4 text-amber-400" />
                {t.guestMode}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {progress.userRole}
              </span>
            )}
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative flex items-center bg-slate-900/80 border border-slate-700/70 rounded-full px-3 py-1 shadow-lg hover:border-orange-500/50 transition-all backdrop-blur-md">
            <Globe className="w-4 h-4 text-orange-400 ml-0.5 hidden xs:block" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer px-2 py-0.5 rounded-full"
            >
              <option value="vi" className="bg-slate-950 text-slate-200">🇻🇳 Tiếng Việt</option>
              <option value="zh-CN" className="bg-slate-950 text-slate-200">🇨🇳 简体中文</option>
              <option value="zh-TW" className="bg-slate-950 text-slate-200">🇹🇼 繁體中文</option>
              <option value="en" className="bg-slate-950 text-slate-200">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
