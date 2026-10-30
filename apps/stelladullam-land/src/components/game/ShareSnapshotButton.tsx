import React, { useState } from "react";

export interface ShareSnapshotButtonProps {
  canvasElementId?: string;
  parcelCoords?: [number, number];
  className?: string;
}

export const ShareSnapshotButton: React.FC<ShareSnapshotButtonProps> = ({
  canvasElementId = "city-map-canvas",
  parcelCoords,
  className = "",
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleExport = () => {
    try {
      setIsExporting(true);
      const canvas = document.getElementById(
        canvasElementId,
      ) as HTMLCanvasElement | null;
      if (!canvas) {
        // Fallback: search for any visible canvas in the document
        const anyCanvas = document.querySelector("canvas");
        if (!anyCanvas) {
          alert("No map canvas found to snapshot.");
          setIsExporting(false);
          return;
        }
        triggerDownload(anyCanvas);
        return;
      }
      triggerDownload(canvas);
    } catch (err) {
      console.error("Failed to export map snapshot:", err);
      setIsExporting(false);
    }
  };

  const triggerDownload = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const coordSuffix = parcelCoords
      ? `_(${parcelCoords[0]},${parcelCoords[1]})`
      : "";
    link.download = `stelladullam_city${coordSuffix}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    setSuccess(true);
    setIsExporting(false);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md transition-all ${
        success
          ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
          : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800"
      } ${className}`}
      title="Save PNG image snapshot of the current 20x20 city canvas"
    >
      <span className="text-sm">{success ? "✅" : "📷"}</span>
      <span>
        {success ? "Saved PNG!" : isExporting ? "Capturing..." : "Snapshot"}
      </span>
    </button>
  );
};
