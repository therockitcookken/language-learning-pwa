'use client';

import React from 'react';
import { useI18n, LanguageCode } from '@/lib/i18n/i18n-context';
import { ShieldCheck, Flame, Zap, UserCheck, Globe, Factory } from 'lucide-react';

interface HeaderProps {
  userRole?: string;
  isGuest?: boolean;
  xp?: number;
  streak?: number;
}

export function Header({ userRole = 'GUEST', isGuest = true, xp = 180, streak = 5 }: HeaderProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-[1px] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-xl">
              ⚙️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-indigo-300 text-lg tracking-tight">
                {t.appName}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 hidden sm:inline-block">
                PWA v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* User Stats & Language Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* XP Badge */}
          <div className="flex items-center gap-1.5 bg-indigo-950/70 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 shadow-inner">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{xp} XP</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 bg-orange-950/70 border border-orange-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-300 shadow-inner">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>{streak} {t.streakDays}</span>
          </div>

          {/* User / Guest Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
            {isGuest ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <UserCheck className="w-4 h-4 text-amber-400" />
                {t.guestMode}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {userRole}
              </span>
            )}
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 shadow-md hover:border-orange-500/40 transition-colors">
            <Globe className="w-4 h-4 text-orange-400 ml-1.5 hidden xs:block" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer px-2 py-1"
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
