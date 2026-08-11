'use client';

import React from 'react';
import { LanguageWorkspace } from './dictionary-types';
import { SlidersHorizontal, ShieldCheck, Cpu, Wrench, PackageCheck, Truck, Building, Sparkles } from 'lucide-react';

interface QuickFilterBarProps {
  activeWorkspace: LanguageWorkspace;
  hsk: string;
  onHskChange: (hsk: string) => void;
  cefr: string;
  onCefrChange: (cefr: string) => void;
  domain: string;
  onDomainChange: (domain: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onOpenAdvancedDrawer: () => void;
}

export function QuickFilterBar({
  activeWorkspace,
  hsk,
  onHskChange,
  cefr,
  onCefrChange,
  domain,
  onDomainChange,
  selectedVoice,
  onVoiceChange,
  limit,
  onLimitChange,
  onOpenAdvancedDrawer,
}: QuickFilterBarProps) {
  const domains = [
    { id: '', label: 'TẤT CẢ CHỦ ĐỀ' },
    { id: 'bao_tri', label: 'BẢO TRÌ & CNC', icon: Wrench },
    { id: 'day_chuyen', label: 'SẢN XUẤT', icon: Cpu },
    { id: 'chat_luong', label: 'KIỂM ĐỊNH QC', icon: PackageCheck },
    { id: 'an_toan', label: 'AN TOÀN PPE', icon: ShieldCheck },
    { id: 'kho_hang', label: 'KHO & LOGISTICS', icon: Truck },
    { id: 'van_phong', label: 'VĂN PHÒNG', icon: Building },
  ];

  const hskColors: Record<string, { active: string; inactive: string }> = {
    HSK1: { active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/15', inactive: 'hover:border-emerald-500/30' },
    HSK2: { active: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-500/15', inactive: 'hover:border-teal-500/30' },
    HSK3: { active: 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/15', inactive: 'hover:border-sky-500/30' },
    HSK4: { active: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/15', inactive: 'hover:border-indigo-500/30' },
    HSK5: { active: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/15', inactive: 'hover:border-amber-500/30' },
    HSK6: { active: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/15', inactive: 'hover:border-rose-500/30' },
  };

  return (
    <div className="space-y-3.5">
      {/* Top controls row: Voice & Page Limit & Advanced Filter Drawer Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Advanced Filter Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenAdvancedDrawer}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-600/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500 hover:text-white rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md hover:shadow-orange-500/20 cursor-pointer backdrop-blur-md"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-400" /> BỘ LỌC NÂNG CAO
          </button>

          {/* Topic Dropdown Select for Chinese & English */}
          <div className="text-xs font-extrabold text-slate-300 flex items-center gap-2 bg-slate-900/70 backdrop-blur-2xl px-3.5 py-2 border border-slate-800/60 rounded-2xl shadow-lg">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-orange-400" /> CHỦ ĐỀ:
            </span>
            <select
              value={domain}
              onChange={(e) => onDomainChange(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="" className="bg-slate-950">🌐 TẤT CẢ CHỦ ĐỀ</option>
              <option value="Giao tiếp công xưởng" className="bg-slate-950">🏭 Giao tiếp công xưởng & Sản xuất</option>
              <option value="An toàn lao động" className="bg-slate-950">👝 An toàn lao động & PPE</option>
              <option value="Quản lý chất lượng" className="bg-slate-950">🔬 Quản lý chất lượng (QC/QA)</option>
              <option value="Bảo trì & Cơ điện" className="bg-slate-950">🔧 Bảo trì & Cơ điện (Maintenance)</option>
              <option value="Kho hàng & Vận chuyển" className="bg-slate-950">📦 Kho hàng & Logistics</option>
              <option value="Nhân sự & Tiền lương" className="bg-slate-950">💼 Nhân sự & Tiền lương (HR)</option>
              <option value="Giao tiếp đời sống" className="bg-slate-950">☕ Giao tiếp đời sống hàng ngày</option>
              <option value="Từ vựng chung" className="bg-slate-950">📚 Từ vựng tổng hợp chung</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Voice Selector */}
          <div className="text-xs font-extrabold text-slate-300 flex items-center gap-2 bg-slate-900/70 backdrop-blur-2xl px-3.5 py-2 border border-slate-800/60 rounded-2xl shadow-lg">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> GIỌNG:
            </span>
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="google-zh-cn" className="bg-slate-950">🇨🇳 Trung - Nữ Phổ Thông (Google HQ)</option>
              <option value="youdao-zh-cn" className="bg-slate-950">🇨🇳 Trung - Nam Phổ Thông (Youdao)</option>
              <option value="google-zh-tw" className="bg-slate-950">🇹🇼 Trung - Đài Loan (Google HQ)</option>
              <option value="google-en-us" className="bg-slate-950">🇺🇸 Anh - Mỹ (Standard US)</option>
              <option value="google-en-gb" className="bg-slate-950">🇬🇧 Anh - Anh (British UK)</option>
            </select>
          </div>

          {/* Page Limit Selector */}
          <div className="text-xs font-extrabold text-slate-300 flex items-center gap-2 bg-slate-900/70 backdrop-blur-2xl px-3.5 py-2 border border-slate-800/60 rounded-2xl shadow-lg">
            <span className="text-slate-400">HIỂN THỊ:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-slate-950 text-slate-200 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value={20} className="bg-slate-950">20 từ / trang</option>
              <option value={40} className="bg-slate-950">40 từ / trang</option>
              <option value={60} className="bg-slate-950">60 từ / trang</option>
              <option value={100} className="bg-slate-950">100 từ / trang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Level Badges Row tailored to workspace */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 backdrop-blur-2xl border border-slate-800/60 p-3.5 rounded-2xl shadow-lg">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
          {activeWorkspace === 'zh' ? 'CẤP ĐỘ HSK:' : activeWorkspace === 'en' ? 'CẤP ĐỘ TOEIC:' : 'CẤP ĐỘ CÔNG XƯỞNG:'}
        </span>

        {/* Chinese Workspace: Show HSK1-6 */}
        {(activeWorkspace === 'zh' || activeWorkspace === 'bilingual') &&
          ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map((level) => {
            const colors = hskColors[level] || { active: 'bg-amber-500/20 text-amber-300 border-amber-500/40', inactive: '' };
            const isActive = hsk === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onHskChange(hsk === level ? '' : level)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer border shadow-sm ${
                  isActive
                    ? `${colors.active} shadow-lg scale-105`
                    : `bg-slate-950/60 border-slate-800/60 text-slate-400 hover:text-slate-100 ${colors.inactive}`
                }`}
              >
                {level}
              </button>
            );
          })}

        {activeWorkspace === 'bilingual' && <div className="h-4 w-[1px] bg-slate-800/60 mx-1" />}

        {/* English Workspace: Show TOEIC Badges */}
        {(activeWorkspace === 'en' || activeWorkspace === 'bilingual') &&
          ['A2', 'B1', 'B2', 'C1'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onCefrChange(cefr === level ? '' : level)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer border shadow-sm ${
                cefr === level
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-500/15 scale-105'
                  : 'bg-slate-950/60 border-slate-800/60 text-slate-400 hover:text-slate-100 hover:border-slate-700/60'
              }`}
            >
              TOEIC {level}
            </button>
          ))}
      </div>
    </div>
  );
}

