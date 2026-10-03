export const SUPABASE_CONFIG = {
  URL: 'https://dcnofnehuqwgtvwrnobc.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjbm9mbmVodXF3Z3R2d3Jub2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4ODY0NTgsImV4cCI6MjEwNjQ2MjQ1OH0.4VpMHY4h_D1ctJ78HxiU0gU0YsmnU1Hz3hXdcfZNnSI',
  TABLE_NAME: 'Master_link',
  ALT_TABLE_NAME: 'master_link',
};

export const CATEGORIES = [
  'Semua',
  'Web App',
  'AI Tools',
  'Cloud Backend',
  'Database',
  'DevOps & Deploy',
  'E-Commerce',
  'Portofolio',
  'API & Microservice',
  'Mobile App',
  'Belajar & Riset',
  'Tools & Utilities',
  'Lainnya',
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; darkBg: string; darkText: string }> = {
  'Web App': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', darkBg: 'dark:bg-blue-950/40', darkText: 'dark:text-blue-300' },
  'AI Tools': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', darkBg: 'dark:bg-purple-950/40', darkText: 'dark:text-purple-300' },
  'Cloud Backend': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'dark:bg-emerald-950/40', darkText: 'dark:text-emerald-300' },
  'Database': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', darkBg: 'dark:bg-teal-950/40', darkText: 'dark:text-teal-300' },
  'DevOps & Deploy': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', darkBg: 'dark:bg-amber-950/40', darkText: 'dark:text-amber-300' },
  'E-Commerce': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', darkBg: 'dark:bg-rose-950/40', darkText: 'dark:text-rose-300' },
  'Portofolio': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', darkBg: 'dark:bg-indigo-950/40', darkText: 'dark:text-indigo-300' },
  'API & Microservice': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', darkBg: 'dark:bg-cyan-950/40', darkText: 'dark:text-cyan-300' },
  'Mobile App': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', darkBg: 'dark:bg-sky-950/40', darkText: 'dark:text-sky-300' },
  'Belajar & Riset': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', darkBg: 'dark:bg-lime-950/40', darkText: 'dark:text-lime-300' },
  'Tools & Utilities': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', darkBg: 'dark:bg-orange-950/40', darkText: 'dark:text-orange-300' },
  'Lainnya': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', darkBg: 'dark:bg-slate-800', darkText: 'dark:text-slate-300' },
};

export const SQL_SETUP_SCRIPT = `-- ==============================================================================
-- SQL SETUP SCRIPT MASTER LINK BANG AJIIB
-- Jalankan kode ini di Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buat Tabel "Master_link"
CREATE TABLE IF NOT EXISTS "Master_link" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_tautan TEXT NOT NULL,
  url_web TEXT NOT NULL,
  kategori TEXT DEFAULT 'Umum',
  akun_github TEXT,
  akun_vercel TEXT,
  akun_supabase TEXT,
  akun_firebase TEXT,
  catatan TEXT,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Buat juga view atau alias jika lowercase dibutuhkan
CREATE TABLE IF NOT EXISTS master_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_tautan TEXT NOT NULL,
  url_web TEXT NOT NULL,
  kategori TEXT DEFAULT 'Umum',
  akun_github TEXT,
  akun_vercel TEXT,
  akun_supabase TEXT,
  akun_firebase TEXT,
  catatan TEXT,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE "Master_link" ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_link ENABLE ROW LEVEL SECURITY;

-- 3. Hapus policy lama jika ada (untuk update bersih)
DROP POLICY IF EXISTS "Allow authenticated full access to Master_link" ON "Master_link";
DROP POLICY IF EXISTS "Allow anon public access to Master_link" ON "Master_link";
DROP POLICY IF EXISTS "Allow authenticated full access to master_link" ON master_link;
DROP POLICY IF EXISTS "Allow anon public access to master_link" ON master_link;

-- 4. Buat Kebijakan RLS (Policy) untuk User Terautentikasi & Publik/Anon
-- Policy untuk authenticated users (mengelola data milik sendiri atau umum)
CREATE POLICY "Allow authenticated full access to Master_link"
  ON "Master_link"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy untuk akses anonim/publik (dapat membaca dan menambahkan jika dibuka)
CREATE POLICY "Allow anon public access to Master_link"
  ON "Master_link"
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Lakukan hal yang sama untuk lowercase table jika dipakai
CREATE POLICY "Allow authenticated full access to master_link"
  ON master_link
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon public access to master_link"
  ON master_link
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Buat Indeks Pencarian Cepat
CREATE INDEX IF NOT EXISTS idx_master_link_nama ON "Master_link" (nama_tautan);
CREATE INDEX IF NOT EXISTS idx_master_link_kategori ON "Master_link" (kategori);
CREATE INDEX IF NOT EXISTS idx_master_link_created_at ON "Master_link" (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_master_link_user_id ON "Master_link" (user_id);

-- 6. Trigger Otomatis Update Timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_timestamp_master_link ON "Master_link";
CREATE TRIGGER set_timestamp_master_link
BEFORE UPDATE ON "Master_link"
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Selesai! Tabel Master_link siap digunakan secara optimal dan aman.
`;

export const INITIAL_DEMO_DATA = [
  {
    id: 'demo-1',
    nama_tautan: 'Bang Ajiib Super App Portal',
    url_web: 'https://bangajiib.dev',
    kategori: 'Web App',
    akun_github: 'https://github.com/bangajiib/super-app',
    akun_vercel: 'https://vercel.com/bangajiib-projects/portal',
    akun_supabase: 'dcnofnehuqwgtvwrnobc (Production)',
    akun_firebase: 'bangajiib-auth-prod',
    catatan: 'Portal utama monitoring dan dashboard manajemen layanan digital.',
    is_favorite: true,
    tags: ['Production', 'Portal', 'Fullstack'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'demo-2',
    nama_tautan: 'AI Generator & Vision Hub',
    url_web: 'https://ai-vision.bangajiib.com',
    kategori: 'AI Tools',
    akun_github: 'https://github.com/bangajiib/ai-vision-hub',
    akun_vercel: 'https://vercel.com/bangajiib-projects/ai-vision',
    akun_supabase: 'dcnofnehuqwgtvwrnobc (Vectors)',
    akun_firebase: 'ai-vision-storage',
    catatan: 'Aplikasi AI multimodal dengan Gemini API dan vector embeddings.',
    is_favorite: true,
    tags: ['AI', 'Gemini', 'NextJS'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'demo-3',
    nama_tautan: 'Supabase Cloud Database Manager',
    url_web: 'https://supabase.com/dashboard/project/dcnofnehuqwgtvwrnobc',
    kategori: 'Cloud Backend',
    akun_github: 'https://github.com/bangajiib/db-schema-migrations',
    akun_vercel: '',
    akun_supabase: 'dcnofnehuqwgtvwrnobc (PostgreSQL)',
    akun_firebase: '',
    catatan: 'Database utama PostgreSQL dengan RLS aktif dan realtime listener.',
    is_favorite: false,
    tags: ['Database', 'Postgres', 'RLS'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];
