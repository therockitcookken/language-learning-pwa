'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Home, BookOpen, Volume2, Layers, HelpCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t-2 border-slate-700/80 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              whileTap={{ scale: 0.9 }}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors duration-300 z-10 ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBottomNav"
                  className="absolute inset-0 bg-orange-500 rounded-xl -z-10 shadow-lg shadow-orange-500/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-extrabold tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
