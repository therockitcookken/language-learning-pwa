'use client';

import React, { useState } from 'react';
import { validateFlashcardImport, parseCSV, ValidationReport } from '@/lib/validation/flashcard-import-validator';
import { Upload, Download, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  cardsToExport: any[];
}

export function ImportExportModal({
  isOpen,
  onClose,
  onImportSuccess,
  cardsToExport,
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [rawText, setRawText] = useState('');
  const [fileFormat, setFileFormat] = useState<'json' | 'csv'>('csv');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      runValidation(content, file.name.endsWith('.json') ? 'json' : 'csv');
    };
    reader.readAsText(file);
  };

  const runValidation = (content: string, format: 'json' | 'csv') => {
    try {
      let parsed: any[] = [];
      if (format === 'json') {
        parsed = JSON.parse(content);
      } else {
        parsed = parseCSV(content);
      }
      const valReport = validateFlashcardImport(parsed);
      setReport(valReport);
    } catch {
      setReport({
        isValid: false,
        totalRows: 0,
        validCount: 0,
        errorCount: 1,
        errors: [{ row: 0, field: 'syntax', message: 'Tệp JSON hoặc CSV bị lỗi cú pháp định dạng.' }],
        validData: [],
      });
    }
  };

  const handleConfirmImport = async () => {
    if (!report || !report.isValid || report.validData.length === 0) return;
    setIsSubmitting(true);

    try {
      for (const card of report.validData) {
        await fetch('/api/v1/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(card),
        });
      }
      alert(`Đã nhập thành công ${report.validData.length} thẻ ghi nhớ mới!`);
      onImportSuccess();
      onClose();
    } catch {
      alert('Có lỗi xảy ra trong quá trình nạp dữ liệu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const csvHeader = 'Mặt trước,Mặt sau,Phiên âm,Chủ đề,Lĩnh vực\n';
    const csvRows = cardsToExport
      .map(
        (c) =>
          `"${c.frontText.replace(/"/g, '""')}","${c.backText.replace(/"/g, '""')}","${(
            c.pinyinOrIpa || ''
          ).replace(/"/g, '""')}","${c.topic}","${c.factoryDomain}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards_export_${Date.now()}.csv`;
    a.click();
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(cardsToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards_export_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'import' ? 'bg-orange-500 text-white' : 'text-slate-400'
              }`}
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" /> Nhập Dữ Liệu (Import)
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'export' ? 'bg-orange-500 text-white' : 'text-slate-400'
              }`}
            >
              <Download className="w-3.5 h-3.5 inline mr-1" /> Xuất Dữ Liệu (Export)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 1: Import */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 p-6 rounded-2xl text-center space-y-2 bg-slate-950/50 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".csv, .json"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-orange-400 mx-auto" />
              <p className="text-xs font-bold text-slate-200">
                Kéo thả hoặc bấm để chọn tệp <span className="text-orange-400">CSV</span> /{' '}
                <span className="text-orange-400">JSON</span>
              </p>
              <p className="text-[10px] text-slate-400">Hỗ trợ các cột: Mặt trước, Mặt sau, Phiên âm, Chủ đề</p>
            </div>

            {/* Validation Report Result */}
            {report && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-200 flex items-center gap-1.5">
                    {report.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    Báo cáo kiểm tra trước khi nhập (Pre-check)
                  </span>
                  <span className="text-slate-400">
                    Hợp lệ: <b className="text-emerald-400">{report.validCount}</b> / {report.totalRows}
                  </span>
                </div>

                {!report.isValid && (
                  <div className="max-h-32 overflow-y-auto space-y-1 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30 text-rose-300 font-mono text-[11px]">
                    {report.errors.map((err, idx) => (
                      <div key={idx}>
                        [Dòng {err.row}] {err.field}: {err.message}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleConfirmImport}
                  disabled={!report.isValid || isSubmitting}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-extrabold rounded-xl cursor-pointer transition-all shadow-lg"
                >
                  {isSubmitting ? 'Đang nạp...' : `Xác Nhận Nạp ${report.validCount} Thẻ`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Export */}
        {activeTab === 'export' && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-300">
              Xuất danh sách <b className="text-orange-400">{cardsToExport.length}</b> thẻ ghi nhớ đang được lọc theo định dạng CSV hoặc JSON:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="py-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl font-black text-xs flex flex-col items-center gap-2 cursor-pointer transition-all"
              >
                <FileText className="w-6 h-6 text-orange-400" />
                <span>Xuất Tệp CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="py-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl font-black text-xs flex flex-col items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-6 h-6 text-emerald-400" />
                <span>Xuất Tệp JSON</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
