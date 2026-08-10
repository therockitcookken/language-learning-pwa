'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AiChatView() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/v1/chat',
    initialMessages: [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: 'Chào bạn! Tôi là trợ lý AI thông minh tại xưởng. Bạn có câu hỏi gì về từ vựng, ngữ pháp hay cách giao tiếp thực tế trong nhà máy hôm nay không?',
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tự động scroll xuống tin nhắn mới nhất
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col bg-slate-900/40 rounded-2xl border-2 border-slate-700/50 shadow-xl overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-6 border-b-2 border-slate-700/50 bg-slate-800/80 backdrop-blur-xl shrink-0">
        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl relative">
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Trợ lý AI <Sparkles className="w-4 h-4 text-amber-400" />
          </h2>
          <p className="text-sm text-slate-400">Giải đáp mọi thắc mắc học ngôn ngữ</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/50">
        <AnimatePresence>
          {messages.map((m) => {
            const isAi = m.role !== 'user';
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isAi ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30' : 'bg-orange-600/30 text-orange-400 border border-orange-500/30'
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                <div className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap ${
                  isAi 
                    ? 'bg-slate-800/80 border-2 border-slate-700/80 text-slate-200 rounded-tl-sm' 
                    : 'bg-indigo-600/30 border-2 border-indigo-500/30 text-slate-100 rounded-tr-sm text-right'
                }`}>
                  {m.content}
                </div>
              </motion.div>
            );
          })}
          
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 text-slate-400 rounded-tl-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg justify-center text-sm">
              <AlertCircle className="w-4 h-4" /> Lỗi kết nối đến AI. Vui lòng thử lại.
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t-2 border-slate-700/50 shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <textarea
            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-indigo-500/50 rounded-xl p-3 sm:p-4 text-slate-100 placeholder-slate-500 outline-none resize-none min-h-[50px] max-h-[120px] transition-colors font-sans text-sm sm:text-base pr-12"
            value={input}
            onChange={handleInputChange}
            placeholder="Hỏi AI về từ vựng, ngữ pháp..."
            rows={input.split('\\n').length > 1 ? Math.min(input.split('\\n').length, 4) : 1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // @ts-ignore
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2 p-2 sm:p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2 font-medium">
          AI có thể mắc sai lầm. Hãy kiểm tra lại những thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}
