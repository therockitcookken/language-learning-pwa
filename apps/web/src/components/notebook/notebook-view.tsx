'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Bookmark, Tag, Plus, Trash2, Edit } from 'lucide-react';

export function NotebookView() {
  const { t } = useI18n();
  const [notes, setNotes] = useState<any[]>([
    {
      id: '1',
      title: 'Chú ý an toàn khi vận hành máy ép nhựa (注塑机)',
      content: 'Nhớ nhấn nút E-Stop ngay khi thấy áp suất vượt ngưỡng 150 bar. Không thò tay vào khuôn khi máy đang chạy.',
      tag: 'An toàn lao động',
      createdAt: '2026-08-04',
    },
    {
      id: '2',
      title: 'Mẹo nhớ Pinyin "安" (ān) và "按" (àn)',
      content: '"安" trong 安全 (ān quán - an toàn) mang thanh 1 ngang cao. "按" trong 按钮 (àn niǔ - nút bấm) mang thanh 4 giật mạnh.',
      tag: 'Phát âm Pinyin',
      createdAt: '2026-08-04',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Ghi chú chung');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setNotes([
      {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        tag: newTag,
        createdAt: new Date().toISOString().split('T')[0],
      },
      ...notes,
    ]);

    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>📓</span> {t.notebook}
          </h2>
          <p className="text-xs text-slate-400">
            Sổ tay ghi chú cá nhân & gắn thẻ từ vựng lưu trữ trên thiết bị.
          </p>
        </div>
      </div>

      {/* Add New Note Form */}
      <form onSubmit={handleAddNote} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200">Tạo ghi chú học tập mới</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tiêu đề ghi chú..."
            className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Thẻ / Chủ đề..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Nội dung chi tiết..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
        >
          Lưu Ghi Chú
        </button>
      </form>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                {note.tag}
              </span>
              <span className="text-[10px] text-slate-500">{note.createdAt}</span>
            </div>
            <h4 className="text-sm font-bold text-white">{note.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
