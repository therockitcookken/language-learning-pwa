'use client';

import React from 'react';
import { Award, ShieldCheck, Flame, Zap, Trophy, CheckCircle2, Lock } from 'lucide-react';

export function BadgeCollection() {
  const badges = [
    { id: 1, title: 'Chiến sĩ An toàn PCCC', icon: ShieldCheck, unlocked: true, desc: 'Hoàn thành Bài thi An toàn Lao động' },
    { id: 2, title: 'Kỹ thuật viên CNC', icon: Zap, unlocked: true, desc: 'Thuộc 50 thuật ngữ bảo trì cơ khí' },
    { id: 3, title: 'Bậc thầy Pinyin', icon: Flame, unlocked: true, desc: 'Đạt điểm tuyệt đối bài kiểm tra phát âm' },
    { id: 4, title: 'Chuyền trưởng Xuất sắc', icon: Trophy, unlocked: true, desc: 'Duy trì chuỗi Streak 5 ngày liên tiếp' },
    { id: 5, title: 'Quản lý Kho Logistics', icon: Award, unlocked: false, desc: 'Hoàn thành bài thi Kho hàng (Cần 300 XP)' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span>🏆</span> Bộ Huy Hiệu & Danh Hiệu Đạt Được
        </h3>
        <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
          4/5 Huy hiệu đã mở
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                b.unlocked
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/40 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800 opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl shadow-md ${
                  b.unlocked
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {b.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{b.title}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-2">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
