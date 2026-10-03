import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileCode, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SQL_SETUP_SCRIPT, SUPABASE_CONFIG } from '../lib/constants';
import { supabase } from '../lib/supabase';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const testSupabaseConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Menguji akses ke tabel "Master_link" di Supabase...');

    try {
      const { data, error } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAME)
        .select('id')
        .limit(1);

      if (!error) {
        setTestStatus('success');
        setTestMessage('✅ Luar biasa! Tabel "Master_link" ditemukan dan dapat diakses dengan aman.');
        onRefreshData();
      } else {
        // Try fallback table name
        const alt = await supabase
          .from(SUPABASE_CONFIG.ALT_TABLE_NAME)
          .select('id')
          .limit(1);

        if (!alt.error) {
          setTestStatus('success');
          setTestMessage('✅ Tabel "master_link" aktif dan terhubung!');
          onRefreshData();
        } else {
          setTestStatus('failed');
          setTestMessage(`⚠️ Tabel belum dibuat di Supabase: ${error.message}. Silakan salin SQL di bawah dan jalankan di SQL Editor Supabase.`);
        }
      }
    } catch (e: any) {
      setTestStatus('failed');
      setTestMessage('Koneksi gagal: ' + (e.message || 'Periksa koneksi internet'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>SQL Editor Supabase: Master_link</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  RLS Security
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup permanen database Supabase untuk Master Link Bang Ajiib.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Supabase Permanent Config Card */}
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Konfigurasi Database Supabase Terhubung:
              </span>
              <a
                href="https://supabase.com/dashboard/project/dcnofnehuqwgtvwrnobc/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Buka Supabase SQL Editor</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
              <div><strong className="text-slate-500">URL:</strong> {SUPABASE_CONFIG.URL}</div>
              <div><strong className="text-slate-500">Tabel:</strong> {SUPABASE_CONFIG.TABLE_NAME} (dengan fallback ke {SUPABASE_CONFIG.ALT_TABLE_NAME})</div>
            </div>
          </div>

          {/* Connection Test Section */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Uji Status Tabel Supabase:
              </span>
            </div>
            <button
              onClick={testSupabaseConnection}
              disabled={testStatus === 'testing'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>{testStatus === 'testing' ? 'Memeriksa...' : 'Cek Status Tabel'}</span>
            </button>
          </div>

          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              testStatus === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : testStatus === 'failed'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              ) : testStatus === 'failed' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              ) : (
                <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-indigo-500" />
              )}
              <span>{testMessage}</span>
            </div>
          )}

          {/* Step by step guide */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Cara Menjalankan Skrip di Supabase (Hanya 1x Saja):
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              <li>Klik tombol <strong>&ldquo;Salin Kode SQL&rdquo;</strong> di bawah ini.</li>
              <li>Buka <a href="https://supabase.com/dashboard/project/dcnofnehuqwgtvwrnobc/sql" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Supabase SQL Editor</a> pada project Anda.</li>
              <li>Buat <strong>New Query</strong>, tempel (Paste) seluruh script SQL, lalu klik tombol <strong>Run (Ctrl + Enter)</strong>.</li>
              <li>Tabel <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">Master_link</code> beserta keamanan RLS (Row Level Security) otomatis aktif permanen!</li>
            </ol>
          </div>

          {/* SQL Editor Code Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Kode SQL Lengkap (Tabel + RLS Policies + Triggers + Indexes):
                </span>
              </div>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[11px] text-slate-200">
              <pre className="p-4 max-h-72 overflow-y-auto leading-relaxed text-slate-300 selection:bg-indigo-600 selection:text-white">
                <code>{SQL_SETUP_SCRIPT}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>RLS (Row Level Security) Melindungi Integritas Data</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
