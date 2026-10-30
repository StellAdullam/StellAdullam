import React, { useState } from "react";

export interface ExportCsvButtonProps {
  userAddress: string;
  apiBaseUrl?: string;
  label?: string;
}

export const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({
  userAddress,
  apiBaseUrl = "/api/v1",
  label = "Export Tax / Audit CSV",
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!userAddress || downloading) return;

    try {
      setDownloading(true);
      const url = `${apiBaseUrl}/export/transactions?address=${encodeURIComponent(userAddress)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Export request failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `stelladullam-audit-${userAddress.substring(0, 8)}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Error downloading CSV report:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs font-medium transition-colors shadow-sm"
      aria-label="Download CSV report"
    >
      <svg
        className="w-4 h-4 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      <span>{downloading ? "Generating CSV..." : label}</span>
    </button>
  );
};
