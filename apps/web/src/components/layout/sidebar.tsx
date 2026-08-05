'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useI18n();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mainMenuItems = [
    { id: 'dashboard', label: 'Trang chủ & Bản đồ 2D', icon: Home, category: 'CHÍNH' },
    { id: 'dictionary', label: t.dictionary, icon: BookOpen, category: 'HỌC TỪ VỰNG' },
    { id: 'pronunciation', label: t.pronunciation, icon: Volume2, category: 'HỌC TỪ VỰNG' },
    { id: 'grammar', label: t.grammar, icon: FileCode, category: 'HỌC TỪ VỰNG' },
    { id: 'flashcard', label: t.flashcard, icon: Layers, category: 'LUYỆN TẬP' },
    { id: 'quiz', label: t.quiz, icon: HelpCircle, category: 'LUYỆN TẬP' },
  ];

  const settingsMenuItems = [
    { id: 'learningPath', label: t.learningPath, icon: MapPin },
    { id: 'notebook', label: t.notebook, icon: Bookmark },
    { id: 'progress', label: t.progress, icon: BarChart3 },
    { id: 'admin', label: t.admin, icon: Shield },
  ];

  const renderMenuItem = (item: any, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`relative w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer overflow-hidden group ${
          isSubItem ? 'ml-2 w-[calc(100%-8px)]' : ''
        } ${
          isActive
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-100'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeTabSidebar"
            className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border-2 border-orange-500/50 shadow-md shadow-orange-500/10 rounded-xl"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        
        {isActive && (
          <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-orange-500 rounded-r-full shadow-md shadow-orange-500 z-10" />
        )}
        
        <div
          className={`relative z-10 p-2 rounded-lg transition-colors duration-300 ${
            isActive
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-slate-800/40 text-slate-400 group-hover:text-amber-300 group-hover:bg-slate-800/80'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="relative z-10 truncate tracking-wide">{item.label}</span>
      </motion.button>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 my-4 ml-4 bg-slate-900/80 backdrop-blur-3xl border-2 border-slate-700/50 rounded-2xl p-4 space-y-3 shrink-0 shadow-2xl self-start overflow-y-auto max-h-[calc(100vh-2rem)]">
      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-3.5 pt-1.5 mb-1 flex items-center justify-between border-b-2 border-slate-700/50 pb-3">
        <span className="flex items-center gap-1.5 text-amber-300 font-extrabold">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" /> MENU CHỨC NĂNG
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
      </div>

      <nav className="space-y-1 flex-1">
        {mainMenuItems.map(item => renderMenuItem(item))}

        <div className="pt-2 mt-2 border-t-2 border-slate-700/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="relative w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer group text-slate-400 hover:text-slate-100"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-lg bg-slate-800/40 text-slate-400 group-hover:text-amber-300 group-hover:bg-slate-800/80 transition-colors">
                <Settings className={`w-4 h-4 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90 text-amber-300' : ''}`} />
              </div>
              <span className="tracking-wide truncate">Cài đặt & Tiện ích</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180 text-amber-300' : ''}`} />
          </motion.button>
          
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 space-y-1 border-l-2 border-slate-700/50 ml-4 pl-1 overflow-hidden"
              >
                {settingsMenuItems.map(item => renderMenuItem(item, true))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </aside>
  );
}
