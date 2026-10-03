import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Globe, 
  Github, 
  Flame, 
  Database, 
  Star, 
  Tag, 
  FileText, 
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MasterLink, LinkFormData } from '../types';
import { CATEGORIES } from '../lib/constants';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LinkFormData) => Promise<void>;
  editLink?: MasterLink | null;
  isLoading?: boolean;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editLink,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LinkFormData>({
    nama_tautan: '',
    url_web: '',
    kategori: 'Web App',
    akun_github: '',
    akun_vercel: '',
    akun_supabase: '',
    akun_firebase: '',
    catatan: '',
    is_favorite: false,
    tags: [],
  });

  const [customCategory, setCustomCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editLink) {
      setFormData({
        id: editLink.id,
        nama_tautan: editLink.nama_tautan || '',
        url_web: editLink.url_web || '',
        kategori: editLink.kategori || 'Web App',
        akun_github: editLink.akun_github || '',
        akun_vercel: editLink.akun_vercel || '',
        akun_supabase: editLink.akun_supabase || '',
        akun_firebase: editLink.akun_firebase || '',
        catatan: editLink.catatan || '',
        is_favorite: editLink.is_favorite ?? false,
        tags: editLink.tags || [],
      });
      if (!CATEGORIES.includes(editLink.kategori as any) && editLink.kategori !== 'Semua') {
        setCustomCategory(editLink.kategori);
      }
    } else {
      setFormData({
        nama_tautan: '',
        url_web: '',
        kategori: 'Web App',
        akun_github: '',
        akun_vercel: '',
        akun_supabase: '',
        akun_firebase: '',
        catatan: '',
        is_favorite: false,
        tags: [],
      });
      setCustomCategory('');
    }
    setErrorMsg('');
    setTagInput('');
  }, [editLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nama_tautan.trim()) {
      setErrorMsg('Nama tautan wajib diisi.');
      return;
    }

    if (!formData.url_web.trim()) {
      setErrorMsg('URL Web wajib diisi.');
      return;
    }

    let finalCategory = formData.kategori;
    if (formData.kategori === 'Lainnya' && customCategory.trim()) {
      finalCategory = customCategory.trim();
    }

    let finalUrl = formData.url_web.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const payload: LinkFormData = {
      ...formData,
      nama_tautan: formData.nama_tautan.trim(),
      url_web: finalUrl,
      kategori: finalCategory,
      akun_github: formData.akun_github?.trim() || null,
      akun_vercel: formData.akun_vercel?.trim() || null,
      akun_supabase: formData.akun_supabase?.trim() || null,
      akun_firebase: formData.akun_firebase?.trim() || null,
      catatan: formData.catatan?.trim() || null,
    };

    await onSave(payload);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const val = tagInput.trim().replace(/^,|,$/g, '');
    if (val && !formData.tags?.includes(val)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), val],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tagToRemove) || [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editLink ? 'Edit Data Link Bang Ajiib' : 'Tambah Data Link Baru'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lengkapi URL dan akun development untuk disimpan di Supabase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              1. Informasi Tautan Utama
            </h3>

            {/* Nama Tautan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Tautan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama_tautan}
                onChange={(e) => setFormData({ ...formData, nama_tautan: e.target.value })}
                placeholder="Contoh: Portal Monitoring Bang Ajiib"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>

            {/* URL Web */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  URL Web <span className="text-rose-500">*</span>
                </label>
                {formData.url_web && (
                  <a
                    href={formData.url_web.startsWith('http') ? formData.url_web : `https://${formData.url_web}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Uji Buka URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.url_web}
                  onChange={(e) => setFormData({ ...formData, url_web: e.target.value })}
                  placeholder="https://domain-anda.com atau subdomain.app"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Kategori & Favorit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition cursor-pointer"
                >
                  {CATEGORIES.filter(c => c !== 'Semua').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Favorit Checkbox */}
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 w-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <input
                    type="checkbox"
                    checked={formData.is_favorite}
                    onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Star className={`w-3.5 h-3.5 ${formData.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                    <span>Jadikan Tautan Favorit</span>
                  </div>
                </label>
              </div>
            </div>

            {formData.kategori === 'Lainnya' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Kategori Khusus
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ketik kategori khusus..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
              </div>
            )}

          </div>

          {/* Section 2: Akun Development Cloud */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              2. Akun & Layanan Cloud Development
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Akun GitHub */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                  <span>Akun / Repository GitHub</span>
                </label>
                <input
                  type="text"
                  value={formData.akun_github || ''}
                  onChange={(e) => setFormData({ ...formData, akun_github: e.target.value })}
                  placeholder="bangajiib/project-repo atau username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
              </div>

              {/* Akun Vercel */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="font-mono font-bold text-[11px]">▲</span>
                  <span>Akun / Deployment Vercel</span>
                </label>
                <input
                  type="text"
                  value={formData.akun_vercel || ''}
                  onChange={(e) => setFormData({ ...formData, akun_vercel: e.target.value })}
                  placeholder="bangajiib-app.vercel.app / org"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
              </div>

              {/* Akun Supabase */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Akun / Project Supabase</span>
                </label>
                <input
                  type="text"
                  value={formData.akun_supabase || ''}
                  onChange={(e) => setFormData({ ...formData, akun_supabase: e.target.value })}
                  placeholder="Project ID / DB Ref (misal: dcnofnehuqwgtvwrnobc)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>

              {/* Akun Firebase */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Akun / Project Firebase</span>
                </label>
                <input
                  type="text"
                  value={formData.akun_firebase || ''}
                  onChange={(e) => setFormData({ ...formData, akun_firebase: e.target.value })}
                  placeholder="Project ID / Firebase App ID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </div>

            </div>
          </div>

          {/* Section 3: Catatan & Tags */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              3. Catatan & Tagging
            </h3>

            {/* Catatan Tambahan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Catatan Tambahan
              </label>
              <textarea
                rows={2}
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Keterangan server, credentials, branch git, atau dokumentasi..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tags (Tekan Enter atau Koma untuk menambahkan)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Misal: Production, React, API"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  Tambah Tag
                </button>
              </div>

              {/* Tag Badges */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Menyimpan ke Supabase...' : editLink ? 'Simpan Perubahan' : 'Simpan Data Link'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
