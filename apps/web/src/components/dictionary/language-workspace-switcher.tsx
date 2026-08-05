'use client';

import React from 'react';
import { LanguageWorkspace } from './dictionary-types';
import { Sparkles, Layers, CheckCircle2, ChevronRight } from 'lucide-react';

interface LanguageWorkspaceSwitcherProps {
  activeWorkspace: LanguageWorkspace;
  onWorkspaceChange: (workspace: LanguageWorkspace) => void;
  zhCount?: number;
  enCount?: number;
  bilingualCount?: number;
}

export function LanguageWorkspaceSwitcher({
  activeWorkspace,
  onWorkspaceChange,
  zhCount = 10000,
  enCount = 10000,
  bilingualCount = 20000,
}: LanguageWorkspaceSwitcherProps) {
  const workspaces = [
    {
      id: 'zh' as LanguageWorkspace,
      flag: '🇨🇳',
      title: '中文 TIẾNG TRUNG',
      subTitle: 'Hán ngữ Công xưởng & HSK',
      description: 'Chữ Hán, Pinyin có dấu, HSK1-6, Bộ thủ, Số nét & Thứ tự bút thuận',
      count: zhCount,
      accentGlow: 'from-emerald-500 via-teal-500 to-emerald-600',
      activeBorder: 'border-emerald-500/50 shadow-2xl shadow-emerald-500/15',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm',
      topStripe: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      activeText: 'text-emerald-400',
    },
    {
      id: 'en' as LanguageWorkspace,
      flag: '🇬🇧',
      title: 'ENGLISH TIẾNG ANH',
      subTitle: 'Industrial English & TOEIC',
      description: 'Phiên âm IPA US/UK, TOEIC A1-C1, Thuật ngữ kỹ thuật & Collocations',
      count: enCount,
      accentGlow: 'from-sky-500 via-blue-500 to-indigo-600',
      activeBorder: 'border-sky-500/50 shadow-2xl shadow-sky-500/15',
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sm',
      topStripe: 'bg-gradient-to-r from-sky-400 to-indigo-500',
      activeText: 'text-sky-400',
    },
    {
      id: 'bilingual' as LanguageWorkspace,
      flag: '🇨🇳🇬🇧',
      title: '中英 SONG NGỮ',
      subTitle: 'Đối Chiếu Thuật Ngữ Kép',
      description: 'Bảng tra cứu đối chiếu Trung - Việt - Anh theo chủ đề nhà máy',
      count: bilingualCount,
      accentGlow: 'from-purple-500 via-amber-500 to-orange-500',
      activeBorder: 'border-amber-500/50 shadow-2xl shadow-orange-500/15',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm',
      topStripe: 'bg-gradient-to-r from-purple-400 via-amber-500 to-orange-500',
      activeText: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {workspaces.map((ws) => {
        const isActive = activeWorkspace === ws.id;

        return (
          <div
            key={ws.id}
            onClick={() => onWorkspaceChange(ws.id)}
            className={`group cursor-pointer rounded-3xl p-5.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between backdrop-blur-2xl border ${
              isActive
                ? `bg-slate-900/90 ${ws.activeBorder} scale-[1.01]`
                : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/70 hover:-translate-y-1'
            }`}
          >
            {/* Top Accent Stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${isActive ? ws.topStripe : 'bg-slate-800/40 group-hover:bg-slate-700/60'}`} />

            {isActive && (
              <div className={`absolute top-0 right-0 bg-gradient-to-r ${ws.accentGlow} text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl shadow-lg flex items-center gap-1 backdrop-blur-md`}>
                <Sparkles className="w-3 h-3 text-amber-200" /> ACTIVE WORKSPACE
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl filter drop-shadow-md">{ws.flag}</span>
                  <h3 className="text-sm font-black tracking-tight text-white group-hover:text-amber-300 transition-colors font-sans">{ws.title}</h3>
                </div>
                <span className={`text-[10px] font-black px-3 py-0.5 rounded-full border ${ws.badgeColor}`}>
                  {ws.count.toLocaleString()} TỪ
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{ws.description}</p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-extrabold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-400" /> {ws.subTitle}
              </span>
              <span className={`flex items-center gap-1 transition-colors ${isActive ? `${ws.activeText} font-black` : 'text-slate-500 group-hover:text-slate-300'}`}>
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ĐANG CHỌN
                  </>
                ) : (
                  <>
                    CHỌN WORKSPACE <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


