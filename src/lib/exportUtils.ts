import { MasterLink } from '../types';

export function exportToJson(links: MasterLink[], filename = 'master_link_bang_ajiib_backup.json') {
  const jsonStr = JSON.stringify(links, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv(links: MasterLink[], filename = 'master_link_bang_ajiib.csv') {
  const headers = [
    'Nama Tautan',
    'URL Web',
    'Kategori',
    'Akun GitHub',
    'Akun Vercel',
    'Akun Supabase',
    'Akun Firebase',
    'Catatan',
    'Favorit',
    'Tags',
    'Dibuat Pada'
  ];

  const rows = links.map(link => [
    `"${(link.nama_tautan || '').replace(/"/g, '""')}"`,
    `"${(link.url_web || '').replace(/"/g, '""')}"`,
    `"${(link.kategori || '').replace(/"/g, '""')}"`,
    `"${(link.akun_github || '').replace(/"/g, '""')}"`,
    `"${(link.akun_vercel || '').replace(/"/g, '""')}"`,
    `"${(link.akun_supabase || '').replace(/"/g, '""')}"`,
    `"${(link.akun_firebase || '').replace(/"/g, '""')}"`,
    `"${(link.catatan || '').replace(/"/g, '""')}"`,
    link.is_favorite ? 'Ya' : 'Tidak',
    `"${(link.tags?.join('; ') || '').replace(/"/g, '""')}"`,
    `"${link.created_at || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseJsonFile(file: File): Promise<MasterLink[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          resolve(parsed);
        } else {
          reject(new Error('Format file JSON harus berupa array data link'));
        }
      } catch (e: any) {
        reject(new Error('Gagal membaca file JSON: ' + e.message));
      }
    };
    reader.onerror = () => reject(new Error('Terjadi kesalahan membaca file'));
    reader.readAsText(file);
  });
}
