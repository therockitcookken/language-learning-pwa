'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Volume2, Globe, Clock, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Sentence {
  id: string;
  speaker: string | null;
  sentenceZh: string | null;
  sentenceVi: string;
  pinyin: string | null;
  audioUrl: string | null;
}

interface Dialogue {
  id: string;
  titleVi: string;
  titleZh: string | null;
  titleEn: string | null;
  category: string;
  level: string;
  _count: { sentences: number };
}

interface DialogueDetail extends Dialogue {
  sentences: Sentence[];
}

export function DialogueView() {
  const { t } = useI18n();
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [selectedDialogue, setSelectedDialogue] = useState<DialogueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVi, setShowVi] = useState(true);

  useEffect(() => {
    fetch('/api/v1/dialogues')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDialogues(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectDialogue = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/v1/dialogues/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedDialogue(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/40 rounded-2xl border-2 border-slate-700/50 shadow-xl overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!selectedDialogue ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Hội thoại thực tế</h2>
                <p className="text-sm text-slate-400">Giao tiếp công xưởng theo tình huống</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dialogues.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectDialogue(item.id)}
                  className="bg-slate-800/60 hover:bg-slate-800 border-2 border-slate-700/50 hover:border-orange-500/50 rounded-xl p-4 text-left transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors text-base">
                      {item.titleVi}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">
                      {item.titleZh}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {item._count.sentences} câu</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-700/50 rounded text-slate-300">
                        {item.level}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-orange-400 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full absolute inset-0 bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-slate-700/50 bg-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDialogue(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{selectedDialogue.titleVi}</h3>
                  <p className="text-xs text-slate-400">{selectedDialogue.titleZh}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowPinyin(!showPinyin)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors ${showPinyin ? 'border-orange-500/50 bg-orange-500/20 text-orange-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                >
                  Pinyin
                </button>
                <button 
                  onClick={() => setShowVi(!showVi)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors flex items-center gap-1 ${showVi ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                >
                  <Globe className="w-3 h-3" /> VI
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/50">
              {loadingDetail ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                selectedDialogue.sentences.map((s, idx) => {
                  // Determine side based on even/odd or actual speaker logic. We'll use even/odd if only 2 speakers, or map by speaker name.
                  const uniqueSpeakers = Array.from(new Set(selectedDialogue.sentences.map(s => s.speaker)));
                  const isRight = uniqueSpeakers.indexOf(s.speaker) === 1;

                  return (
                    <div key={s.id} className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} gap-1`}>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">{s.speaker || 'Person'}</span>
                      <div className={`relative max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl group ${
                        isRight 
                          ? 'bg-indigo-600/30 border-2 border-indigo-500/30 text-right rounded-tr-sm' 
                          : 'bg-slate-800/80 border-2 border-slate-700/80 text-left rounded-tl-sm'
                      }`}>
                        {showPinyin && s.pinyin && (
                          <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide">
                            {s.pinyin}
                          </div>
                        )}
                        <div className="text-lg sm:text-xl font-bold text-slate-100 font-sans mb-1">
                          {s.sentenceZh}
                        </div>
                        {showVi && (
                          <div className={`text-sm ${isRight ? 'text-indigo-200' : 'text-slate-300'}`}>
                            {s.sentenceVi}
                          </div>
                        )}
                        
                        {/* Play button overlay */}
                        <button 
                          onClick={() => speak(s.sentenceZh || '')}
                          className={`absolute ${isRight ? '-left-10' : '-right-10'} top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/80 hover:bg-orange-500 hover:text-white border border-slate-700 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
