import React from 'react';

export interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Actions' | 'General';
}

export const SYSTEM_SHORTCUTS: ShortcutItem[] = [
  { keys: ['W', 'A', 'S', 'D'], description: 'Pan 2.5D City Map canvas', category: 'Navigation' },
  { keys: ['+', '-'], description: 'Zoom in / Zoom out of parcel grid', category: 'Navigation' },
  { keys: ['Space'], description: 'Center camera on player home parcel', category: 'Navigation' },
  { keys: ['H'], description: 'Toggle spatial density heatmap overlay', category: 'Actions' },
  { keys: ['M'], description: 'Mute / Unmute ambient sound effects', category: 'Actions' },
  { keys: ['P'], description: 'Toggle balance privacy blur mask', category: 'Actions' },
  { keys: ['Esc'], description: 'Close open dialogs and drawers', category: 'General' },
  { keys: ['?'], description: 'Open this keyboard shortcuts guide', category: 'General' },
];

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">⌨️</span>
            <h3 className="text-lg font-bold text-white tracking-tight">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {['Navigation', 'Actions', 'General'].map((category) => {
            const items = SYSTEM_SHORTCUTS.filter((s) => s.category === category);
            return (
              <div key={category} className="space-y-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                  {category}
                </h4>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.description}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60"
                    >
                      <span className="text-slate-300 font-sans">{item.description}</span>
                      <div className="flex gap-1">
                        {item.keys.map((k) => (
                          <kbd
                            key={k}
                            className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] shadow-sm font-semibold"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
