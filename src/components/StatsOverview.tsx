import React from 'react';
import { 
  FolderKanban, 
  Star, 
  Github, 
  Flame, 
  Database, 
  Cloud, 
  ArrowUpRight 
} from 'lucide-react';
import { MasterLink } from '../types';

interface StatsOverviewProps {
  links: MasterLink[];
  onFilterEcosystem: (key: 'github' | 'vercel' | 'supabase' | 'firebase') => void;
  onFilterFavorites: () => void;
  activeEcosystem: {
    github: boolean;
    vercel: boolean;
    supabase: boolean;
    firebase: boolean;
  };
  onlyFavorites: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  links,
  onFilterEcosystem,
  onFilterFavorites,
  activeEcosystem,
  onlyFavorites,
}) => {
  const totalCount = links.length;
  const favCount = links.filter(l => l.is_favorite).length;
  const githubCount = links.filter(l => l.akun_github && l.akun_github.trim() !== '').length;
  const vercelCount = links.filter(l => l.akun_vercel && l.akun_vercel.trim() !== '').length;
  const supabaseCount = links.filter(l => l.akun_supabase && l.akun_supabase.trim() !== '').length;
  const firebaseCount = links.filter(l => l.akun_firebase && l.akun_firebase.trim() !== '').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* Total Card */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Total Link</span>
          <FolderKanban className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl font-black text-slate-900 dark:text-white">
          {totalCount}
        </div>
      </div>

      {/* Favorites Card */}
      <button
        onClick={onFilterFavorites}
        className={`p-3.5 text-left rounded-xl border shadow-xs transition ${
          onlyFavorites
            ? 'bg-amber-500/10 border-amber-500 dark:border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Favorit</span>
          <Star className={`w-4 h-4 ${favCount > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
        </div>
        <div className="text-xl font-black text-slate-900 dark:text-white">
          {favCount}
        </div>
      </button>

      {/* GitHub Card */}
      <button
        onClick={() => onFilterEcosystem('github')}
        className={`p-3.5 text-left rounded-xl border shadow-xs transition ${
          activeEcosystem.github
            ? 'bg-slate-900 text-white dark:bg-slate-800 border-slate-700 ring-2 ring-indigo-500/40'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">GitHub</span>
          <Github className="w-4 h-4 text-slate-800 dark:text-slate-200" />
        </div>
        <div className="text-xl font-black text-slate-900 dark:text-white">
          {githubCount}
        </div>
      </button>

      {/* Vercel Card */}
      <button
        onClick={() => onFilterEcosystem('vercel')}
        className={`p-3.5 text-left rounded-xl border shadow-xs transition ${
          activeEcosystem.vercel
            ? 'bg-black text-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/40'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Vercel</span>
          <span className="text-xs font-mono font-bold">▲</span>
        </div>
        <div className="text-xl font-black text-slate-900 dark:text-white">
          {vercelCount}
        </div>
      </button>

      {/* Supabase Card */}
      <button
        onClick={() => onFilterEcosystem('supabase')}
        className={`p-3.5 text-left rounded-xl border shadow-xs transition ${
          activeEcosystem.supabase
            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Supabase</span>
          <Database className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl font-black text-slate-900 dark:text-white">
          {supabaseCount}
        </div>
      </button>

      {/* Firebase Card */}
      <button
        onClick={() => onFilterEcosystem('firebase')}
        className={`p-3.5 text-left rounded-xl border shadow-xs transition ${
          activeEcosystem.firebase
            ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-xs font-semibold">Firebase</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-xl font-black text-slate-900 dark:text-white">
          {firebaseCount}
        </div>
      </button>

    </div>
  );
};
