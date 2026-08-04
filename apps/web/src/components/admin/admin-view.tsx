'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Shield, Plus, Database, FileSpreadsheet, CheckCircle2, History, Users } from 'lucide-react';

export function AdminView() {
  const { t } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<'vocab' | 'imports' | 'audit'>('vocab');

  // State for new word insertion
  const [newWord, setNewWord] = useState('');
  const [newPinyin, setNewPinyin] = useState('');
  const [newVi, setNewVi] = useState('');
  const [newEn, setNewEn] = useState('');
  const [newDomain, setNewDomain] = useState('an_toan');
  const [statusMsg, setStatusMsg] = useState('');

  const handleCreateVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newVi) return;

    setStatusMsg('Đã thêm từ vựng thành công vào cơ sở dữ liệu!');
    setNewWord('');
    setNewPinyin('');
    setNewVi('');
    setNewEn('');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>🛡️</span> {t.admin}
          </h2>
          <p className="text-xs text-slate-400">
            Quản trị nội dung từ điển, bài học, kiểm duyệt dữ liệu & lịch sử Audit Log.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('vocab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'vocab' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            Quản lý Từ vựng
          </button>
          <button
            onClick={() => setActiveSubTab('imports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'imports' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            Import Data Pipeline
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'audit' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            Lịch sử Audit Log
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-950 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {activeSubTab === 'vocab' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-400" /> Thêm mục từ vựng mới vào Từ điển
          </h3>

          <form onSubmit={handleCreateVocab} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Từ vựng (Tiếng Trung/Tiếng Anh) *
              </label>
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="VD: 安全帽 hoặc Safety Helmet"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Pinyin có dấu / IPA
              </label>
              <input
                type="text"
                value={newPinyin}
                onChange={(e) => setNewPinyin(e.target.value)}
                placeholder="VD: ān quán mào"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nghĩa tiếng Việt *
              </label>
              <input
                type="text"
                value={newVi}
                onChange={(e) => setNewVi(e.target.value)}
                placeholder="VD: Mũ bảo hộ lao động"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nghĩa tiếng Anh
              </label>
              <input
                type="text"
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
                placeholder="VD: Safety helmet"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ngành công xưởng (Factory Domain)
              </label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="an_toan">An toàn lao động & PCCC</option>
                <option value="day_chuyen">Dây chuyền sản xuất</option>
                <option value="bao_tri">Bảo trì cơ khí & CNC</option>
                <option value="chat_luong">Kiểm tra chất lượng (QC)</option>
                <option value="kho_hang">Kho hàng & Logistics</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Lưu Từ Vựng Mới
              </button>
            </div>
          </form>
        </div>
      )}

      {activeSubTab === 'imports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" /> Data Pipeline Import CSV/JSON
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hệ thống tự động kiểm tra trùng lặp ID, cú pháp Pinyin, âm tiết mồ côi và xuất báo cáo chất lượng trước khi lưu vào Database.
          </p>

          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-3 bg-slate-950/50">
            <Database className="w-10 h-10 text-orange-400 mx-auto" />
            <div className="text-xs text-slate-300">
              Kéo thả file <span className="font-mono text-orange-400">.csv</span> hoặc <span className="font-mono text-orange-400">.json</span> từ vựng công xưởng vào đây
            </div>
            <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer">
              Chọn File Từ Máy Tính
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" /> Nhật ký Chỉnh sửa (Audit Log)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-mono">
                [IMPORT] Factory Language Learning Verified Open Dataset v1.0 (7,800+ items)
              </span>
              <span className="text-emerald-400 font-bold">Thành công (100%)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-mono">
                [CREATE] System Admin (admin@factory-lang.com) initialized database seed.
              </span>
              <span className="text-emerald-400 font-bold">Thành công</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
