export interface MasterLink {
  id: string;
  nama_tautan: string;
  url_web: string;
  kategori: string;
  akun_github?: string | null;
  akun_vercel?: string | null;
  akun_supabase?: string | null;
  akun_firebase?: string | null;
  catatan?: string | null;
  is_favorite?: boolean;
  tags?: string[];
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type LinkFormData = Omit<MasterLink, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type ViewMode = 'grid' | 'table' | 'compact';

export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'favorite';

export interface FilterState {
  searchQuery: string;
  category: string;
  ecosystemFilter: {
    github: boolean;
    vercel: boolean;
    supabase: boolean;
    firebase: boolean;
  };
  onlyFavorites: boolean;
  sortBy: SortOption;
}
