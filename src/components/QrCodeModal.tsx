import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react';
import { MasterLink } from '../types';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: MasterLink | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  link,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !link) return null;

  const finalUrl = link.url_web.startsWith('http') ? link.url_web : `https://${link.url_web}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(finalUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Scan QR Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner inline-block my-2">
          <img 
            src={qrApiUrl} 
            alt={`QR Code untuk ${link.nama_tautan}`}
            className="w-48 h-48 mx-auto"
            loading="lazy"
          />
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {link.nama_tautan}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
            {finalUrl}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
          </button>

          <a
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Link</span>
          </a>
        </div>
      </div>
    </div>
  );
};
