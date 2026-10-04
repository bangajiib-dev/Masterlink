import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  Edit3, 
  Trash2, 
  Github, 
  Flame, 
  Database, 
  QrCode, 
  FileText,
  Tag,
  Globe
} from 'lucide-react';
import { MasterLink } from '../types';
import { CATEGORY_COLORS } from '../lib/constants';

interface LinkCardProps {
  link: MasterLink;
  onEdit: (link: MasterLink) => void;
  onDelete: (id: string, name: string) => void;
  onToggleFavorite: (link: MasterLink) => void;
  onOpenQr: (link: MasterLink) => void;
  compact?: boolean;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenQr,
  compact = false,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  const defaultColor = { 
    bg: 'bg-indigo-50', 
    text: 'text-indigo-700', 
    border: 'border-indigo-200', 
    darkBg: 'dark:bg-indigo-950/50', 
    darkText: 'dark:text-indigo-300' 
  };
  const catColor = CATEGORY_COLORS[link.kategori] || (link.kategori === 'Web App Kerjaan' ? CATEGORY_COLORS['Web App Kerjaan'] : defaultColor);

  // Normalize URLs for opening
  const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  if (compact) {
    return (
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-xs flex items-center justify-between gap-3 group">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onToggleFavorite(link)}
            className="text-slate-300 hover:text-amber-400 dark:hover:text-amber-400 transition shrink-0"
          >
            <Star className={`w-4 h-4 ${link.is_favorite ? 'text-amber-400 fill-amber-400' : ''}`} />
          </button>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {link.nama_tautan}
              </h3>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${catColor.bg} ${catColor.text} ${catColor.border} ${catColor.darkBg} ${catColor.darkText}`}>
                {link.kategori}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {link.url_web}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => copyToClipboard(link.url_web, 'url', e)}
            title="Salin URL"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href={formatUrl(link.url_web)}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Website"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onEdit(link)}
            title="Edit Tautan"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(link.id, link.nama_tautan)}
            title="Hapus Tautan"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600/80 transition-all duration-200 overflow-hidden group">
      
      {/* Top Header */}
      <div className="p-5 pb-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          
          {/* Category Badge */}
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${catColor.bg} ${catColor.text} ${catColor.border} ${catColor.darkBg} ${catColor.darkText}`}>
            {link.kategori}
          </span>

          {/* Top Right Badges: Favorite & QR */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenQr(link)}
              title="Tampilkan QR Code"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(link)}
              title={link.is_favorite ? 'Hapus dari Favorit' : 'Tandai sebagai Favorit'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 dark:hover:text-amber-400 transition"
            >
              <Star className={`w-4 h-4 transition-transform group-hover:scale-110 ${link.is_favorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Link Name & Web URL */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {link.nama_tautan}
          </h3>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 min-w-0 flex-1">
              <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-mono truncate">{link.url_web}</span>
            </div>
            <button
              onClick={(e) => copyToClipboard(link.url_web, 'url', e)}
              title="Salin URL Web"
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition shrink-0"
            >
              {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Connected Cloud Accounts (GitHub, Vercel, Supabase, Firebase) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Akun & Layanan Cloud
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            
            {/* GitHub Account */}
            <div className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
              link.akun_github 
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200' 
                : 'bg-slate-50/40 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <Github className="w-3.5 h-3.5 shrink-0 text-slate-700 dark:text-slate-300" />
                <span className="font-medium text-[11px] text-slate-400">GH:</span>
                <span className="truncate font-mono text-[11px]">
                  {link.akun_github ? link.akun_github.replace('https://github.com/', '') : '-'}
                </span>
              </div>
              {link.akun_github && (
                <button
                  onClick={(e) => copyToClipboard(link.akun_github!, 'gh', e)}
                  title="Salin Akun/Link GitHub"
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5"
                >
                  {copiedKey === 'gh' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Vercel Account */}
            <div className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
              link.akun_vercel 
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200' 
                : 'bg-slate-50/40 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-bold font-mono shrink-0">▲</span>
                <span className="font-medium text-[11px] text-slate-400">Vercel:</span>
                <span className="truncate font-mono text-[11px]">
                  {link.akun_vercel || '-'}
                </span>
              </div>
              {link.akun_vercel && (
                <button
                  onClick={(e) => copyToClipboard(link.akun_vercel!, 'vc', e)}
                  title="Salin Akun/Link Vercel"
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5"
                >
                  {copiedKey === 'vc' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Supabase Account */}
            <div className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
              link.akun_supabase 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300' 
                : 'bg-slate-50/40 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <Database className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                <span className="font-medium text-[11px] text-slate-400">Supa:</span>
                <span className="truncate font-mono text-[11px]">
                  {link.akun_supabase || '-'}
                </span>
              </div>
              {link.akun_supabase && (
                <button
                  onClick={(e) => copyToClipboard(link.akun_supabase!, 'sb', e)}
                  title="Salin Akun/Project Supabase"
                  className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 p-0.5"
                >
                  {copiedKey === 'sb' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Firebase Account */}
            <div className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
              link.akun_firebase 
                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300' 
                : 'bg-slate-50/40 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span className="font-medium text-[11px] text-slate-400">Fire:</span>
                <span className="truncate font-mono text-[11px]">
                  {link.akun_firebase || '-'}
                </span>
              </div>
              {link.akun_firebase && (
                <button
                  onClick={(e) => copyToClipboard(link.akun_firebase!, 'fb', e)}
                  title="Salin Akun/Project Firebase"
                  className="text-amber-600 hover:text-amber-700 dark:hover:text-amber-300 p-0.5"
                >
                  {copiedKey === 'fb' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Notes (Catatan) */}
        {link.catatan && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p className="line-clamp-2 text-[11px] leading-relaxed">{link.catatan}</p>
          </div>
        )}

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {link.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
              >
                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Open Web Button */}
        <a
          href={formatUrl(link.url_web)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Buka Web</span>
        </a>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(link)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            title="Edit Data Link"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(link.id, link.nama_tautan)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/40 transition"
            title="Hapus Data Link"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>

      </div>

    </div>
  );
};
