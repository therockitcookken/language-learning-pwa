'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  BookOpen,
  Volume2,
  FileCode,
  Layers,
  HelpCircle,
  MapPin,
  BarChart3,
  Bookmark,
  Shield,
  Home,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useI18n();

  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ & Bản đồ 2D', icon: Home },
    { id: 'dictionary', label: t.dictionary, icon: BookOpen },
    { id: 'pronunciation', label: t.pronunciation, icon: Volume2 },
    { id: 'grammar', label: t.grammar, icon: FileCode },
    { id: 'flashcard', label: t.flashcard, icon: Layers },
    { id: 'quiz', label: t.quiz, icon: HelpCircle },
    { id: 'learningPath', label: t.learningPath, icon: MapPin },
    { id: 'notebook', label: t.notebook, icon: Bookmark },
    { id: 'progress', label: t.progress, icon: BarChart3 },
    { id: 'admin', label: t.admin, icon: Shield },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900/95 border-r border-slate-800 p-4 space-y-2 shrink-0">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
        Menu Chức năng
      </div>
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 border border-orange-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
