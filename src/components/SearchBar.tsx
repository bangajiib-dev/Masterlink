import React from 'react';
import { 
  Search, 
  X, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  List, 
  ArrowDownAZ, 
  ArrowUpAZ, 
  Clock, 
  Sparkles,
  Filter
} from 'lucide-react';
import { CATEGORIES } from '../lib/constants';
import { FilterState, ViewMode, SortOption } from '../types';

interface SearchBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const handleClearSearch = () => {
    onFilterChange({
      ...filters,
      searchQuery: '',
    });
  };

  const handleCategorySelect = (cat: string) => {
    onFilterChange({
      ...filters,
      category: cat,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as SortOption,
    });
  };

  const activeFiltersCount = 
    (filters.category !== 'Semua' ? 1 : 0) +
    (filters.onlyFavorites ? 1 : 0) +
    (filters.ecosystemFilter.github ? 1 : 0) +
    (filters.ecosystemFilter.vercel ? 1 : 0) +
    (filters.ecosystemFilter.supabase ? 1 : 0) +
    (filters.ecosystemFilter.firebase ? 1 : 0);

  const resetAllFilters = () => {
    onFilterChange({
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
  };

  return (
    <div className="space-y-4 mb-6">
      
      {/* Top Search Row with Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari tautan, URL, GitHub, Vercel, Supabase, Firebase, tag, catatan..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition shadow-xs text-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & View Mode Toolbar */}
        <div className="flex items-center gap-2 justify-between sm:justify-start">
          
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="appearance-none pl-3 pr-8 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer shadow-xs"
            >
              <option value="newest">🕒 Terbaru</option>
              <option value="oldest">⏳ Terlama</option>
              <option value="name_asc">🔤 Nama (A - Z)</option>
              <option value="name_desc">🔤 Nama (Z - A)</option>
              <option value="favorite">⭐ Favorit Teratas</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Tampilan Grid Kartu"
              className={`p-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Tampilan Tabel Lengkap"
              className={`p-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              title="Tampilan List Ringkas"
              className={`p-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'compact'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Tambah Link Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-98 transition shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Data Link</span>
          </button>
        </div>

      </div>

      {/* Horizontal Category Scroll Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Kategori:</span>
        </div>

        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {activeFiltersCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 whitespace-nowrap transition flex items-center gap-1 shrink-0 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filter ({activeFiltersCount})</span>
          </button>
        )}
      </div>

    </div>
  );
};
