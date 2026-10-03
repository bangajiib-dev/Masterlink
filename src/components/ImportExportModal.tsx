import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Database
} from 'lucide-react';
import { MasterLink } from '../types';
import { exportToCsv, exportToJson, parseJsonFile } from '../lib/exportUtils';
import { insertLinkToSupabase } from '../lib/supabase';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: MasterLink[];
  onLinksImported: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  links,
  onLinksImported,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleExportJson = () => {
    exportToJson(links);
  };

  const handleExportCsv = () => {
    exportToCsv(links);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('importing');
    setStatusMsg('Membaca file dan mengimpor data...');

    try {
      const importedData = await parseJsonFile(file);
      let count = 0;
      for (const item of importedData) {
        if (item.nama_tautan && item.url_web) {
          await insertLinkToSupabase({
            nama_tautan: item.nama_tautan,
            url_web: item.url_web,
            kategori: item.kategori || 'Umum',
            akun_github: item.akun_github,
            akun_vercel: item.akun_vercel,
            akun_supabase: item.akun_supabase,
            akun_firebase: item.akun_firebase,
            catatan: item.catatan,
            is_favorite: item.is_favorite,
            tags: item.tags || [],
          });
          count++;
        }
      }

      setImportStatus('success');
      setStatusMsg(`Berhasil mengimpor ${count} data tautan ke Master Link!`);
      onLinksImported();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setImportStatus('error');
      setStatusMsg(err.message || 'Gagal mengimpor data.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Backup & Restore Data Link
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ekspor atau pulihkan koleksi tautan Master Link Bang Ajiib.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Ekspor Data ({links.length} Tautan)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportJson}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
            >
              <FileJson className="w-4 h-4 text-amber-500" />
              <span>Ekspor JSON (Lengkap)</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Ekspor CSV / Excel</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Impor Cadangan JSON
          </h4>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importStatus === 'importing'}
            className="w-full flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/40 text-center transition cursor-pointer"
          >
            <Upload className="w-6 h-6 text-indigo-500 mb-1.5" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Pilih file cadangan (.json)
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Data yang diimpor akan otomatis disimpan ke Supabase
            </span>
          </button>

          {importStatus !== 'idle' && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              importStatus === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                : importStatus === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {importStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {importStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
