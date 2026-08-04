'use client';

import React from 'react';
import { useI18n, LanguageCode } from '@/lib/i18n/i18n-context';
import { ShieldCheck, Flame, Zap, UserCheck, Globe } from 'lucide-react';

interface HeaderProps {
  userRole?: string;
  isGuest?: boolean;
  xp?: number;
  streak?: number;
}

export function Header({ userRole = 'GUEST', isGuest = true, xp = 150, streak = 5 }: HeaderProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-bold text-xl border border-orange-400/30">
            🏭
          </div>
          <div>
            <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-300 text-lg leading-snug">
              {t.appName}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* User Stats & Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* XP Badge */}
          <div className="flex items-center gap-1.5 bg-indigo-950/70 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{xp} XP</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 bg-orange-950/70 border border-orange-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold text-orange-300">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>{streak} {t.streakDays}</span>
          </div>

          {/* User / Guest Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-300">
            {isGuest ? (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <UserCheck className="w-3.5 h-3.5" />
                {t.guestMode}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {userRole}
              </span>
            )}
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-lg p-1">
            <Globe className="w-4 h-4 text-slate-400 ml-1 hidden xs:block" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="vi" className="bg-slate-900 text-slate-200">🇻🇳 Tiếng Việt</option>
              <option value="zh-CN" className="bg-slate-900 text-slate-200">🇨🇳 简体中文</option>
              <option value="zh-TW" className="bg-slate-900 text-slate-200">🇹🇼 繁體中文</option>
              <option value="en" className="bg-slate-900 text-slate-200">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
