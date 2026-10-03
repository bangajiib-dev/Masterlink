import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, INITIAL_DEMO_DATA } from './constants';
import { MasterLink, LinkFormData } from '../types';

export const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const LOCAL_STORAGE_KEY = 'master_link_bang_ajiib_local_cache';

// Helper to get local cache
export const getLocalCache = (): MasterLink[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading local storage cache', e);
  }
  return INITIAL_DEMO_DATA;
};

// Helper to save local cache
export const saveLocalCache = (links: MasterLink[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
  } catch (e) {
    console.error('Failed saving local storage cache', e);
  }
};

/**
 * Fetch links from Supabase with fallback to alternative table name or local cache
 */
export async function fetchLinksFromSupabase(): Promise<{ data: MasterLink[]; isFromDatabase: boolean; error?: string }> {
  try {
    // Attempt with "Master_link"
    let response = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (response.error && (response.error.code === 'PGRST116' || response.error.code === '42P01' || response.error.message.includes('relation'))) {
      // Try lowercase "master_link"
      response = await supabase
        .from(SUPABASE_CONFIG.ALT_TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
    }

    if (!response.error && response.data) {
      // If db table is empty and we have local demo data, return empty or populate
      saveLocalCache(response.data as MasterLink[]);
      return {
        data: response.data as MasterLink[],
        isFromDatabase: true,
      };
    }

    if (response.error) {
      console.warn('Supabase query notice:', response.error.message);
      const localData = getLocalCache();
      return {
        data: localData,
        isFromDatabase: false,
        error: response.error.message,
      };
    }
  } catch (err: any) {
    console.warn('Supabase connection caught error:', err);
    return {
      data: getLocalCache(),
      isFromDatabase: false,
      error: err.message || 'Gagal terhubung ke Supabase',
    };
  }

  return {
    data: getLocalCache(),
    isFromDatabase: false,
  };
}

/**
 * Insert link to Supabase
 */
export async function insertLinkToSupabase(formData: LinkFormData, userId?: string | null): Promise<{ data?: MasterLink; error?: string; isLocal?: boolean }> {
  const newLink: MasterLink = {
    id: formData.id || crypto.randomUUID(),
    nama_tautan: formData.nama_tautan,
    url_web: formData.url_web,
    kategori: formData.kategori || 'Umum',
    akun_github: formData.akun_github || null,
    akun_vercel: formData.akun_vercel || null,
    akun_supabase: formData.akun_supabase || null,
    akun_firebase: formData.akun_firebase || null,
    catatan: formData.catatan || null,
    is_favorite: formData.is_favorite ?? false,
    tags: formData.tags || [],
    user_id: userId || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    // Attempt insert to "Master_link"
    let { data, error } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .insert([newLink])
      .select()
      .single();

    if (error && (error.code === '42P01' || error.message.includes('relation'))) {
      const altResult = await supabase
        .from(SUPABASE_CONFIG.ALT_TABLE_NAME)
        .insert([newLink])
        .select()
        .single();
      data = altResult.data;
      error = altResult.error;
    }

    if (error) {
      console.warn('Supabase insert notice (fallback to local):', error.message);
      const localLinks = getLocalCache();
      const updated = [newLink, ...localLinks.filter(l => l.id !== newLink.id)];
      saveLocalCache(updated);
      return { data: newLink, isLocal: true, error: error.message };
    }

    return { data: (data as MasterLink) || newLink, isLocal: false };
  } catch (err: any) {
    const localLinks = getLocalCache();
    const updated = [newLink, ...localLinks.filter(l => l.id !== newLink.id)];
    saveLocalCache(updated);
    return { data: newLink, isLocal: true, error: err.message };
  }
}

/**
 * Update link in Supabase
 */
export async function updateLinkInSupabase(id: string, formData: Partial<LinkFormData>): Promise<{ success: boolean; error?: string; isLocal?: boolean }> {
  const updatePayload = {
    ...formData,
    updated_at: new Date().toISOString(),
  };

  try {
    let { error } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .update(updatePayload)
      .eq('id', id);

    if (error && (error.code === '42P01' || error.message.includes('relation'))) {
      const altResult = await supabase
        .from(SUPABASE_CONFIG.ALT_TABLE_NAME)
        .update(updatePayload)
        .eq('id', id);
      error = altResult.error;
    }

    if (error) {
      console.warn('Supabase update notice (fallback to local):', error.message);
      const localLinks = getLocalCache();
      const updated = localLinks.map(l => (l.id === id ? { ...l, ...updatePayload } : l));
      saveLocalCache(updated);
      return { success: true, isLocal: true, error: error.message };
    }

    return { success: true, isLocal: false };
  } catch (err: any) {
    const localLinks = getLocalCache();
    const updated = localLinks.map(l => (l.id === id ? { ...l, ...updatePayload } : l));
    saveLocalCache(updated);
    return { success: true, isLocal: true, error: err.message };
  }
}

/**
 * Delete link from Supabase
 */
export async function deleteLinkFromSupabase(id: string): Promise<{ success: boolean; error?: string; isLocal?: boolean }> {
  try {
    let { error } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error && (error.code === '42P01' || error.message.includes('relation'))) {
      const altResult = await supabase
        .from(SUPABASE_CONFIG.ALT_TABLE_NAME)
        .delete()
        .eq('id', id);
      error = altResult.error;
    }

    if (error) {
      console.warn('Supabase delete notice (fallback to local):', error.message);
      const localLinks = getLocalCache();
      const updated = localLinks.filter(l => l.id !== id);
      saveLocalCache(updated);
      return { success: true, isLocal: true, error: error.message };
    }

    // Also sync local cache
    const localLinks = getLocalCache();
    saveLocalCache(localLinks.filter(l => l.id !== id));
    return { success: true, isLocal: false };
  } catch (err: any) {
    const localLinks = getLocalCache();
    saveLocalCache(localLinks.filter(l => l.id !== id));
    return { success: true, isLocal: true, error: err.message };
  }
}
