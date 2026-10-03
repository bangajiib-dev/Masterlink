import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Database, 
  Layers, 
  ExternalLink, 
  FileCode, 
  Sparkles, 
  Github, 
  Flame, 
  FolderPlus,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { SearchBar } from './components/SearchBar';
import { LinkCard } from './components/LinkCard';
import { LinkTable } from './components/LinkTable';
import { LinkModal } from './components/LinkModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { AuthModal } from './components/AuthModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ImportExportModal } from './components/ImportExportModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  fetchLinksFromSupabase, 
  insertLinkToSupabase, 
  updateLinkInSupabase, 
  deleteLinkFromSupabase 
} from './lib/supabase';
import { MasterLink, FilterState, ViewMode, LinkFormData } from './types';
import confetti from 'canvas-confetti';

function MainApp() {
  const { user } = useAuth();
  
  // Data state
  const [links, setLinks] = useState<MasterLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [dbNotice, setDbNotice] = useState<string | null>(null);

  // Filter & View state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'Semua',
    ecosystemFilter: {
      github: false,
      vercel: false,
      supabase: false,
      firebase: false,
    },
    onlyFavorites: false,
    sortBy: 'newest',
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('master_link_view_mode') as ViewMode) || 'grid';
  });

  // Modal states
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editLink, setEditLink] = useState<MasterLink | null>(null);
  
  const [deleteData, setDeleteData] = useState<{ id: string; name: string } | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [qrLink, setQrLink] = useState<MasterLink | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load links on mount
  const loadLinks = async () => {
    setIsLoading(true);
    const result = await fetchLinksFromSupabase();
    setLinks(result.data);
    setIsDbConnected(result.isFromDatabase);
    if (!result.isFromDatabase && result.error) {
      setDbNotice(result.error);
    } else {
      setDbNotice(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, [user]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('master_link_view_mode', mode);
  };

  // Toggle quick platform ecosystem filters
  const handleToggleEcosystem = (key: 'github' | 'vercel' | 'supabase' | 'firebase') => {
    setFilters(prev => ({
      ...prev,
      ecosystemFilter: {
        ...prev.ecosystemFilter,
        [key]: !prev.ecosystemFilter[key],
      },
    }));
  };

  const handleToggleFavoritesFilter = () => {
    setFilters(prev => ({
      ...prev,
      onlyFavorites: !prev.onlyFavorites,
    }));
  };

  // CRUD Operations
  const handleOpenAdd = () => {
    setEditLink(null);
    setIsLinkModalOpen(true);
  };

  const handleOpenEdit = (link: MasterLink) => {
    setEditLink(link);
    setIsLinkModalOpen(true);
  };

  const handleOpenDelete = (id: string, name: string) => {
    setDeleteData({ id, name });
  };

  const handleSaveLink = async (formData: LinkFormData) => {
    setIsSaving(true);
    try {
      if (editLink) {
        // Update existing link
        const res = await updateLinkInSupabase(editLink.id, formData);
        if (res.success) {
          setLinks(prev => prev.map(l => (l.id === editLink.id ? { ...l, ...formData, updated_at: new Date().toISOString() } : l)));
          setIsLinkModalOpen(false);
          setEditLink(null);
          addToast('Tautan berhasil diperbarui!', 'success');
          confetti({ particleCount: 40, spread: 50 });
        } else {
          addToast(res.error || 'Gagal memperbarui tautan', 'error');
        }
      } else {
        // Insert new link
        const res = await insertLinkToSupabase(formData, user?.id);
        if (res.data) {
          setLinks(prev => [res.data!, ...prev]);
          setIsLinkModalOpen(false);
          addToast('Tautan baru berhasil disimpan ke database!', 'success');
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        } else {
          addToast(res.error || 'Gagal menambahkan tautan', 'error');
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Terjadi kesalahan saat menyimpan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteData) return;
    setIsDeleting(true);
    try {
      const res = await deleteLinkFromSupabase(deleteData.id);
      if (res.success) {
        setLinks(prev => prev.filter(l => l.id !== deleteData.id));
        setDeleteData(null);
        addToast('Tautan berhasil dihapus!', 'info');
      } else {
        addToast(res.error || 'Gagal menghapus tautan', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Terjadi kesalahan saat menghapus', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async (link: MasterLink) => {
    const updatedFav = !link.is_favorite;
    // Optimistic UI
    setLinks(prev => prev.map(l => (l.id === link.id ? { ...l, is_favorite: updatedFav } : l)));
    try {
      await updateLinkInSupabase(link.id, { is_favorite: updatedFav });
      if (updatedFav) {
        addToast(`"${link.nama_tautan}" ditambahkan ke Favorit ⭐`, 'success');
      }
    } catch (err) {
      console.error('Failed toggling favorite', err);
    }
  };

  // Filter and Sort Engine
  const filteredAndSortedLinks = useMemo(() => {
    return links.filter(link => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchName = link.nama_tautan.toLowerCase().includes(q);
        const matchUrl = link.url_web.toLowerCase().includes(q);
        const matchCategory = link.kategori.toLowerCase().includes(q);
        const matchGithub = link.akun_github?.toLowerCase().includes(q);
        const matchVercel = link.akun_vercel?.toLowerCase().includes(q);
        const matchSupabase = link.akun_supabase?.toLowerCase().includes(q);
        const matchFirebase = link.akun_firebase?.toLowerCase().includes(q);
        const matchNotes = link.catatan?.toLowerCase().includes(q);
        const matchTags = link.tags?.some(t => t.toLowerCase().includes(q));

        if (!matchName && !matchUrl && !matchCategory && !matchGithub && !matchVercel && !matchSupabase && !matchFirebase && !matchNotes && !matchTags) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category !== 'Semua' && link.kategori !== filters.category) {
        return false;
      }

      // 3. Ecosystem Filters
      if (filters.ecosystemFilter.github && (!link.akun_github || link.akun_github.trim() === '')) {
        return false;
      }
      if (filters.ecosystemFilter.vercel && (!link.akun_vercel || link.akun_vercel.trim() === '')) {
        return false;
      }
      if (filters.ecosystemFilter.supabase && (!link.akun_supabase || link.akun_supabase.trim() === '')) {
        return false;
      }
      if (filters.ecosystemFilter.firebase && (!link.akun_firebase || link.akun_firebase.trim() === '')) {
        return false;
      }

      // 4. Favorites Filter
      if (filters.onlyFavorites && !link.is_favorite) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      }
      if (filters.sortBy === 'oldest') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateA - dateB;
      }
      if (filters.sortBy === 'name_asc') {
        return a.nama_tautan.localeCompare(b.nama_tautan);
      }
      if (filters.sortBy === 'name_desc') {
        return b.nama_tautan.localeCompare(a.nama_tautan);
      }
      if (filters.sortBy === 'favorite') {
        if (a.is_favorite === b.is_favorite) {
          return a.nama_tautan.localeCompare(b.nama_tautan);
        }
        return a.is_favorite ? -1 : 1;
      }
      return 0;
    });
  }, [links, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Navigation Header */}
      <Navbar
        onOpenAddModal={handleOpenAdd}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isDbConnected={isDbConnected}
        totalLinks={links.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Banner notification if Supabase table is not yet created */}
        {!isDbConnected && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  Setup Tabel "Master_link" di Supabase
                </h4>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                  Untuk menyimpan data secara permanen di cloud Supabase Anda, jalankan skrip SQL yang telah disiapkan.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4" />
              <span>Buka SQL Editor Guide</span>
            </button>
          </div>
        )}

        {/* Analytics & Platform Summary */}
        <StatsOverview
          links={links}
          onFilterEcosystem={handleToggleEcosystem}
          onFilterFavorites={handleToggleFavoritesFilter}
          activeEcosystem={filters.ecosystemFilter}
          onlyFavorites={filters.onlyFavorites}
        />

        {/* Search, Filter Pills & View Controls */}
        <SearchBar
          filters={filters}
          onFilterChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onOpenAddModal={handleOpenAdd}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Memuat data koleksi tautan Bang Ajiib...
            </p>
          </div>
        ) : filteredAndSortedLinks.length === 0 ? (
          
          /* Empty Search or No Data State */
          <div className="py-16 px-4 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 max-w-lg mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tidak Ada Tautan Ditemukan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {filters.searchQuery || filters.category !== 'Semua' || filters.onlyFavorites
                ? 'Tidak ada data tautan yang cocok dengan kriteria pencarian dan filter aktif.'
                : 'Koleksi tautan Anda masih kosong. Mulai tambahkan tautan proyek atau website pertama Anda!'}
            </p>
            
            <div className="mt-5 flex items-center justify-center gap-3">
              {filters.searchQuery || filters.category !== 'Semua' || filters.onlyFavorites ? (
                <button
                  onClick={() => setFilters({
                    searchQuery: '',
                    category: 'Semua',
                    ecosystemFilter: { github: false, vercel: false, supabase: false, firebase: false },
                    onlyFavorites: false,
                    sortBy: 'newest'
                  })}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Reset Semua Filter
                </button>
              ) : null}

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tautan Baru</span>
              </button>
            </div>
          </div>

        ) : viewMode === 'table' ? (
          
          /* Table View */
          <LinkTable
            links={filteredAndSortedLinks}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onToggleFavorite={handleToggleFavorite}
            onOpenQr={(link) => setQrLink(link)}
          />

        ) : viewMode === 'compact' ? (
          
          /* Compact List View */
          <div className="space-y-2">
            {filteredAndSortedLinks.map(link => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onToggleFavorite={handleToggleFavorite}
                onOpenQr={(l) => setQrLink(l)}
                compact={true}
              />
            ))}
          </div>

        ) : (
          
          /* Grid Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredAndSortedLinks.map(link => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onToggleFavorite={handleToggleFavorite}
                onOpenQr={(l) => setQrLink(l)}
              />
            ))}
          </div>

        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 py-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Master Link Bang Ajiib</span>
            <span>•</span>
            <span>Database Supabase Permanen</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline underline-offset-4"
            >
              SQL Editor & Schema RLS
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition underline underline-offset-4"
            >
              Backup & Ekspor
            </button>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={handleOpenAdd}
        aria-label="Tambah Data Link Baru"
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/40 active:scale-95 transition"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Modals */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => { setIsLinkModalOpen(false); setEditLink(null); }}
        onSave={handleSaveLink}
        editLink={editLink}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleConfirmDelete}
        linkName={deleteData?.name || ''}
        isLoading={isDeleting}
      />

      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        onRefreshData={loadLinks}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <QrCodeModal
        isOpen={!!qrLink}
        onClose={() => setQrLink(null)}
        link={qrLink}
      />

      <ImportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        links={links}
        onLinksImported={loadLinks}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
