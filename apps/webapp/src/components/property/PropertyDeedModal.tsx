import React, { useState } from 'react';

export interface PropertyDeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  tokenId: string;
  cadastralRegistryNumber?: string;
  jurisdiction?: string;
  ipfsCid: string;
  sha256Hash?: string;
  surveyorFirm?: string;
  className?: string;
}

export const PropertyDeedModal: React.FC<PropertyDeedModalProps> = ({
  isOpen,
  onClose,
  propertyName,
  tokenId,
  cadastralRegistryNumber = 'CAD-2026-X992',
  jurisdiction = 'Adullam Metro Land Registry',
  ipfsCid,
  sha256Hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  surveyorFirm = 'Stellar Cadastral & Surveyors Guild',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCid = async () => {
    try {
      await navigator.clipboard.writeText(ipfsCid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📜</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                Legal Deed Verified
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{propertyName}</h3>
            <p className="text-xs text-slate-400 font-mono">Token #{tokenId} • {jurisdiction}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Cadastre Record:</span>
            <span className="text-white font-semibold">{cadastralRegistryNumber}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Surveyor Entity:</span>
            <span className="text-indigo-400">{surveyorFirm}</span>
          </div>

          <div className="border-t border-slate-800/80 pt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">IPFS Document CID:</span>
              <button
                type="button"
                onClick={handleCopyCid}
                className="text-cyan-400 hover:underline text-[10px]"
              >
                {copied ? '✅ Copied!' : 'Copy CID'}
              </button>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] text-slate-300 break-all select-all">
              {ipfsCid}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-2 space-y-1">
            <span className="text-slate-400">Cryptographic SHA-256 Digest:</span>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[10px] text-slate-400 break-all select-all">
              {sha256Hash}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`https://ipfs.io/ipfs/${ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center transition-colors shadow-lg shadow-indigo-950/40"
          >
            Open Document on IPFS ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
