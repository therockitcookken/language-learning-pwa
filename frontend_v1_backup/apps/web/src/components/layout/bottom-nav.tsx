'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Home, BookOpen, Volume2, Layers, HelpCircle, Shield } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { t } = useI18n();

  const mobileItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'dictionary', label: 'Từ điển', icon: BookOpen },
    { id: 'pronunciation', label: 'Phát âm', icon: Volume2 },
    { id: 'flashcard', label: 'Flashcard', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl double-bezel">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 text-orange-400 font-bold border border-orange-500/30 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-orange-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-extrabold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

