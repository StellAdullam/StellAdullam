import React from "react";

export interface BookmarkedParcel {
  id: number;
  x: number;
  y: number;
  name: string;
  district: string;
  level: number;
}

export interface BookmarkedParcelsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkedParcel[];
  onSelectParcel: (x: number, y: number) => void;
  onRemoveBookmark: (id: number) => void;
  className?: string;
}

export const BookmarkedParcelsDrawer: React.FC<
  BookmarkedParcelsDrawerProps
> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectParcel,
  onRemoveBookmark,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col p-4 animate-slide-left ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <h3 className="font-bold text-white text-sm">
            Saved Parcels ({bookmarks.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {bookmarks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No saved parcels yet.
            <br />
            Click the star icon on any parcel to bookmark it!
          </div>
        ) : (
          bookmarks.map((p) => (
            <div
              key={p.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <h4 className="font-bold text-white text-xs">
                  {p.name || `Parcel #${p.id}`}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>
                    Coord: ({p.x}, {p.y})
                  </span>
                  <span>•</span>
                  <span className="text-indigo-400">Lv.{p.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectParcel(p.x, p.y);
                    onClose();
                  }}
                  className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-colors"
                  title="Jump camera to coordinates"
                >
                  Jump
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveBookmark(p.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 text-xs transition-colors"
                  title="Remove from bookmarks"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center font-mono">
        Parcels stored in local browser session
      </div>
    </div>
  );
};
