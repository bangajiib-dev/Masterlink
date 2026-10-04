import React from 'react';
import { 
  Link2, 
  Moon, 
  Sun, 
  Database, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  FileCode, 
  DownloadCloud,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSqlModal: () => void;
  onOpenAuthModal: () => void;
  onOpenExportModal: () => void;
  isDbConnected: boolean;
  totalLinks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenSqlModal,
  onOpenAuthModal,
  onOpenExportModal,
  isDbConnected,
  totalLinks
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center justify-center w-11 h-11 bg-slate-900 text-white dark:bg-slate-950 rounded-xl shadow-md">
                <Link2 className="w-6 h-6 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Master Link Bang Ajiib
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> Pro v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Pusat Penyimpanan Tautan, GitHub, Vercel, Supabase & Firebase
              </p>
            </div>
          </div>

          {/* Action Tools & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Supabase Status Indicator */}
            <button
              onClick={onOpenSqlModal}
              title="Klik untuk melihat status & Panduan SQL Editor Supabase"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isDbConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <Database className="w-3.5 h-3.5" />
              <span>{isDbConnected ? 'Supabase: Master_link Terhubung' : 'Setup Tabel Supabase'}</span>
            </button>

            {/* SQL Schema Guide Button */}
            <button
              onClick={onOpenSqlModal}
              title="Kode SQL Editor Supabase & Setup RLS"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4 text-purple-500" />
              <span className="hidden lg:inline">SQL Editor</span>
            </button>

            {/* Backup / Export */}
            <button
              onClick={onOpenExportModal}
              title="Backup & Restore (CSV / JSON)"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <DownloadCloud className="w-4 h-4 text-sky-500" />
              <span className="hidden lg:inline">Backup</span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
              aria-label="Toggle Theme"
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline">Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Gelap</span>
                </>
              )}
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                  title={user.email}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span className="max-w-[100px] sm:max-w-[140px] truncate">{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="Keluar dari Akun"
                  className="p-2 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk / Akun</span>
              </button>
            )}

            {/* Mobile Add button */}
            <button
              onClick={onOpenAddModal}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md"
            >
              +
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
