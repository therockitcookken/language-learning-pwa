'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/i18n-context';
import {
  Bookmark,
  Tag,
  Plus,
  Trash2,
  Download,
  Search,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';

export function NotebookView() {
  const { t } = useI18n();
  const [notes, setNotes] = useState<any[]>([
    {
      id: '1',
      title: 'Chú ý an toàn khi vận hành máy ép nhựa (注塑机)',
      content: 'Nhớ nhấn nút E-Stop ngay khi thấy áp suất vượt ngưỡng 150 bar. Không thò tay vào khuôn khi máy đang chạy.',
      tag: 'An toàn lao động',
      color: 'rose',
      createdAt: '2026-08-04',
    },
    {
      id: '2',
      title: 'Mẹo nhớ Pinyin "安" (ān) và "按" (àn)',
      content: '"安" trong 安全 (ān quán - an toàn) mang thanh 1 ngang cao. "按" trong 按钮 (àn niǔ - nút bấm) mang thanh 4 giật mạnh.',
      tag: 'Phát âm Pinyin',
      color: 'amber',
      createdAt: '2026-08-04',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('An toàn lao động');
  const [newColor, setNewColor] = useState('amber');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper 1: Export Notebook to Markdown File
  const handleExportMarkdown = () => {
    const mdContent =
      'data:text/markdown;charset=utf-8,' +
      encodeURIComponent(
        '# Sổ Tay Ghi Chú Cá Nhân Công Xưởng\n\n' +
          notes
            .map(
              (n) => `## ${n.title}\n- **Thẻ**: ${n.tag}\n- **Ngày**: ${n.createdAt}\n\n${n.content}\n\n---`
            )
            .join('\n\n')
      );
    const link = document.createElement('a');
    link.setAttribute('href', mdContent);
    link.setAttribute('download', `notebook_export_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper 2: Copy Note Content
  const handleCopyNote = (note: any) => {
    navigator.clipboard.writeText(`${note.title}\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setNotes([
      {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        tag: newTag,
        color: newColor,
        createdAt: new Date().toISOString().split('T')[0],
      },
      ...notes,
    ]);

    setNewTitle('');
    setNewContent('');
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || n.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Export Helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>📓</span> {t.notebook}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sổ tay ghi chú cá nhân, gắn mã màu ưu tiên & xuất file Markdown.
          </p>
        </div>

        <button
          onClick={handleExportMarkdown}
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-orange-400 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Xuất Sổ Tay Markdown (.md)
        </button>
      </div>

      {/* Add Note Form with Color Picker */}
      <form onSubmit={handleAddNote} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200">Tạo ghi chú công xưởng mới</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tiêu đề ghi chú..."
            className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            required
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
          placeholder="Nội dung ghi chú chi tiết..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
          required
        />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Mã màu ưu tiên:</span>
            {['rose', 'amber', 'emerald', 'indigo'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full border cursor-pointer ${
                  c === 'rose'
                    ? 'bg-rose-500'
                    : c === 'amber'
                    ? 'bg-amber-500'
                    : c === 'emerald'
                    ? 'bg-emerald-500'
                    : 'bg-indigo-500'
                } ${newColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Lưu Ghi Chú
          </button>
        </div>
      </form>

      {/* Helper Search & Tag Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm trong ghi chú..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`bg-slate-900 border ${
              note.color === 'rose'
                ? 'border-rose-500/40'
                : note.color === 'emerald'
                ? 'border-emerald-500/40'
                : 'border-slate-800'
            } rounded-2xl p-5 space-y-2 shadow-lg relative`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                {note.tag}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{note.createdAt}</span>
                <button
                  onClick={() => handleCopyNote(note)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title="Sao chép ghi chú"
                >
                  {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white">{note.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
