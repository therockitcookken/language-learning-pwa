'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Wrench,
  PackageCheck,
  Truck,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
  Volume2,
  RefreshCw,
  Target,
  Bot,
  Lightbulb,
} from 'lucide-react';
import { audioEngine } from '@/lib/audio/audio-engine';

interface FactoryMap2DProps {
  onSelectZone: (zoneDomain: string) => void;
}

export function FactoryMap2D({ onSelectZone }: FactoryMap2DProps) {
  // 1. Daily Goal & Streak Saver State
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [completedMinutes, setCompletedMinutes] = useState(12);

  // 2. Quick 5-Word Random Review Widget State
  const [quickWordIdx, setQuickWordIdx] = useState(0);
  const quickWords = [
    { s: '安全第一', p: 'ān quán dì yī', vi: 'An toàn là trên hết (Safety First)' },
    { s: '紧急按钮', p: 'jǐn jí àn niǔ', vi: 'Nút dừng khẩn cấp E-Stop' },
    { s: '卡尺', p: 'kǎ chǐ', vi: 'Thước kẹp du xích (Vernier Caliper)' },
    { s: '检修', p: 'jiǎn xiū', vi: 'Bảo trì thiết bị (Maintenance)' },
    { s: '次品率', p: 'cì pǐn lǜ', vi: 'Tỷ lệ phế phẩm (Defect Rate)' },
  ];

  // 3. Proverb of the Day
  const proverbs = [
    { zh: '安全出于警惕，事故出于麻痹。', p: 'Ānquán chū yú jǐngtì, shìgù chū yú mábì.', vi: 'An toàn đến từ sự cảnh giác, tai nạn đến từ sự lơ là.' },
    { zh: '工欲善其事，必先利其器。', p: 'Gōng yù shàn qí shì, bì xiān lì qí qì.', vi: 'Muốn làm tốt công việc, trước hết phải chuẩn bị tốt công cụ.' },
  ];
  const [proverbIdx, setProverbIdx] = useState(0);

  const zones = [
    {
      id: 'an_toan',
      title: 'Khu An toàn Lao động & PCCC',
      titleZh: '安全与消防区',
      desc: 'Mũ bảo hộ, kính, nút tai & quy tắc an toàn',
      status: 'UNLOCKED',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-800',
      borderColor: 'border-emerald-500/40',
    },
    {
      id: 'day_chuyen',
      title: 'Dây chuyền Sản xuất Điện tử',
      titleZh: '电子生产流水线',
      desc: 'Thao tác băng chuyền, đóng gói & tốc độ chuyền',
      status: 'UNLOCKED',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-800',
      borderColor: 'border-blue-500/40',
    },
    {
      id: 'bao_tri',
      title: 'Trạm Bảo trì Cơ khí & CNC',
      titleZh: '数控与机械维修站',
      desc: 'Bảo trì máy tiện, máy ép nhựa & tủ điện',
      status: 'UNLOCKED',
      icon: Wrench,
      color: 'from-amber-600 to-orange-800',
      borderColor: 'border-amber-500/40',
    },
    {
      id: 'chat_luong',
      title: 'Phòng Kiểm tra Chất lượng (QC)',
      titleZh: '品管与检测室 (QC)',
      desc: 'Thước kẹp, hàng lỗi cìpǐn & tiêu chuẩn ISO',
      status: 'UNLOCKED',
      icon: PackageCheck,
      color: 'from-purple-600 to-pink-800',
      borderColor: 'border-purple-500/40',
    },
    {
      id: 'kho_hang',
      title: 'Kho Hàng & Xe nâng (Logistics)',
      titleZh: '仓库与物流中心',
      desc: 'Xuất nhập kho, pallet & vận hành xe nâng',
      status: 'UNLOCKED',
      icon: Truck,
      color: 'from-cyan-600 to-blue-900',
      borderColor: 'border-cyan-500/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 Essential Helper Feature Cards on Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Helper 1: Daily Goal Tracker & Streak Saver */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-orange-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Chỉ tiêu hôm nay
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {completedMinutes}/{dailyGoalMinutes} phút
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedMinutes / dailyGoalMinutes) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Học thêm {Math.max(0, dailyGoalMinutes - completedMinutes)} phút để bảo vệ chuỗi Streak!
          </p>
        </div>

        {/* Helper 2: Quick 5-Word Random Review Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Ôn từ nhanh (10s)
            </span>
            <button
              onClick={() => setQuickWordIdx((prev) => (prev + 1) % quickWords.length)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-black text-white">{quickWords[quickWordIdx].s}</div>
              <div className="text-[10px] font-bold text-orange-400">{quickWords[quickWordIdx].p}</div>
            </div>
            <button
              onClick={() => audioEngine.speak(quickWords[quickWordIdx].s)}
              className="p-2 bg-slate-800 hover:bg-orange-500 text-white rounded-xl text-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-300 line-clamp-1">{quickWords[quickWordIdx].vi}</p>
        </div>

        {/* Helper 3: Proverb / Factory Motto of the Day */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Khẩu hiệu ngày
            </span>
          </div>
          <p className="text-xs font-bold text-amber-200">{proverbs[proverbIdx].zh}</p>
          <p className="text-[10px] text-slate-400 italic">{proverbs[proverbIdx].vi}</p>
        </div>

        {/* Helper 4: Guided Mascot "Chú Bác Thợ Kim" */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl shrink-0">
            🤖
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Trợ lý Thợ Kim:</span>
            <p className="text-[10px] text-slate-300 leading-snug">
              "Hãy bắt đầu với Lộ trình An toàn Lao động trước khi vận hành máy CNC nhé!"
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 2D Factory Map */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <span>🗺️</span> Bản đồ Nhà máy 2D (Factory Interactive Floor)
            </h2>
            <p className="text-xs text-slate-400">
              Bấm chọn từng khu vực để mở từ vựng, bài tập phát âm & trắc nghiệm chuyên ngành.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
            <CheckCircle2 className="w-4 h-4" /> 5/5 Khu vực đã mở
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className={`group relative overflow-hidden bg-gradient-to-br ${zone.color} border ${zone.borderColor} rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-emerald-300 border border-emerald-500/30">
                    {zone.titleZh}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    {zone.title}
                  </h3>
                  <p className="text-xs text-slate-200/80 mt-1 line-clamp-2">
                    {zone.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
