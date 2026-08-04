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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-orange-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
