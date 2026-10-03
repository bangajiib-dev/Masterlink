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
  QrCode
} from 'lucide-react';
import { MasterLink } from '../types';
import { CATEGORY_COLORS } from '../lib/constants';

interface LinkTableProps {
  links: MasterLink[];
  onEdit: (link: MasterLink) => void;
  onDelete: (id: string, name: string) => void;
  onToggleFavorite: (link: MasterLink) => void;
  onOpenQr: (link: MasterLink) => void;
}

export const LinkTable: React.FC<LinkTableProps> = ({
  links,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenQr,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider">
          <tr>
            <th className="py-3.5 px-4 w-10">⭐</th>
            <th className="py-3.5 px-4">Nama Tautan & URL</th>
            <th className="py-3.5 px-4">Kategori</th>
            <th className="py-3.5 px-4">GitHub</th>
            <th className="py-3.5 px-4">Vercel</th>
            <th className="py-3.5 px-4">Supabase</th>
            <th className="py-3.5 px-4">Firebase</th>
            <th className="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {links.map((link) => {
            const catColor = CATEGORY_COLORS[link.kategori] || CATEGORY_COLORS['Lainnya'];
            return (
              <tr 
                key={link.id} 
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Favorite Star */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => onToggleFavorite(link)}
                    className="text-slate-300 hover:text-amber-400 dark:hover:text-amber-400 transition"
                  >
                    <Star className={`w-4 h-4 ${link.is_favorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </td>

                {/* Link Name & URL */}
                <td className="py-3 px-4 min-w-[220px]">
                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    {link.nama_tautan}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-mono text-[11px] truncate max-w-[200px]">{link.url_web}</span>
                    <button
                      onClick={() => copyToClipboard(link.url_web, `url-${link.id}`)}
                      title="Salin URL"
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {copiedKey === `url-${link.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <a
                      href={formatUrl(link.url_web)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </td>

                {/* Kategori */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${catColor.bg} ${catColor.text} ${catColor.border} ${catColor.darkBg} ${catColor.darkText}`}>
                    {link.kategori}
                  </span>
                </td>

                {/* GitHub */}
                <td className="py-3 px-4 max-w-[130px]">
                  {link.akun_github ? (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <Github className="w-3 h-3 text-slate-700 dark:text-slate-300 shrink-0" />
                      <span className="truncate">{link.akun_github.replace('https://github.com/', '')}</span>
                      <button
                        onClick={() => copyToClipboard(link.akun_github!, `gh-${link.id}`)}
                        className="text-slate-400 hover:text-indigo-600 shrink-0"
                      >
                        {copiedKey === `gh-${link.id}` ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </td>

                {/* Vercel */}
                <td className="py-3 px-4 max-w-[130px]">
                  {link.akun_vercel ? (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="text-[10px] font-bold">▲</span>
                      <span className="truncate">{link.akun_vercel}</span>
                      <button
                        onClick={() => copyToClipboard(link.akun_vercel!, `vc-${link.id}`)}
                        className="text-slate-400 hover:text-indigo-600 shrink-0"
                      >
                        {copiedKey === `vc-${link.id}` ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </td>

                {/* Supabase */}
                <td className="py-3 px-4 max-w-[130px]">
                  {link.akun_supabase ? (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      <Database className="w-3 h-3 shrink-0" />
                      <span className="truncate">{link.akun_supabase}</span>
                      <button
                        onClick={() => copyToClipboard(link.akun_supabase!, `sb-${link.id}`)}
                        className="text-slate-400 hover:text-emerald-500 shrink-0"
                      >
                        {copiedKey === `sb-${link.id}` ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </td>

                {/* Firebase */}
                <td className="py-3 px-4 max-w-[130px]">
                  {link.akun_firebase ? (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                      <Flame className="w-3 h-3 shrink-0" />
                      <span className="truncate">{link.akun_firebase}</span>
                      <button
                        onClick={() => copyToClipboard(link.akun_firebase!, `fb-${link.id}`)}
                        className="text-slate-400 hover:text-amber-500 shrink-0"
                      >
                        {copiedKey === `fb-${link.id}` ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onOpenQr(link)}
                      title="QR Code"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(link)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(link.id, link.nama_tautan)}
                      title="Hapus"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
