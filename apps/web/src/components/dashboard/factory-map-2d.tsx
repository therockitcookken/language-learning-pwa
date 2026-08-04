'use client';

import React from 'react';
import { ShieldCheck, Cpu, Wrench, PackageCheck, Truck, CheckCircle2, Lock } from 'lucide-react';

interface FactoryMap2DProps {
  onSelectZone: (zoneDomain: string) => void;
}

export function FactoryMap2D({ onSelectZone }: FactoryMap2DProps) {
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
      x: '10%',
      y: '15%',
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
      x: '55%',
      y: '15%',
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
      x: '10%',
      y: '55%',
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
      x: '55%',
      y: '55%',
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
      x: '32.5%',
      y: '80%',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>🗺️</span> Bản đồ Nhà máy 2D (Factory Interactive Map)
          </h2>
          <p className="text-xs text-slate-400">
            Bấm vào các khu vực trong nhà máy để xem từ vựng, ngữ pháp và bài quiz chuyên ngành.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium">
          <CheckCircle2 className="w-4 h-4" /> 5/5 Khu vực đã mở khóa
        </div>
      </div>

      {/* Grid of Interactive Factory Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {zones.map((zone) => {
          const Icon = zone.icon;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={`group relative overflow-hidden bg-gradient-to-br ${zone.color} border ${zone.borderColor} rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-emerald-300 border border-emerald-500/30">
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
  );
}
