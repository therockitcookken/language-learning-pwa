'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, WifiOff, X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if running as PWA (safely checking matchMedia for JSDOM / SSR)
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsStandalone(true);
      }
    }

    // Register Service Worker
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (isOffline) {
    return (
      <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-300 text-xs px-4 py-2 flex items-center justify-center gap-2 font-bold animate-fadeIn">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span>Chế độ Ngoại tuyến (Offline Mode) – Dữ liệu học tập & Flashcards vẫn khả dụng!</span>
      </div>
    );
  }

  if (isStandalone || !deferredPrompt || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-600 border-b border-orange-400/40 text-white text-xs px-4 py-2.5 shadow-lg flex items-center justify-between animate-fadeIn">
      <div className="flex items-center gap-2 font-extrabold">
        <Smartphone className="w-4 h-4 animate-bounce" />
        <span>Cài đặt ứng dụng FactoryLang lên màn hình chính điện thoại để học mượt hơn!</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1 bg-white text-orange-600 font-extrabold rounded-lg shadow cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Cài đặt App
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
