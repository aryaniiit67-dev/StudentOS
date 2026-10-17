import React, { useState, useEffect } from 'react';
import { WorkspaceView } from '../types.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: WorkspaceView) => void;
  onOpenFocusModal: (title?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onOpenFocusModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled in parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { title: 'Command Center', category: 'Navigation', icon: 'terminal', action: () => onSelectView('command-center'), shortcut: '⌘1' },
    { title: 'Academics: Mathematics III & CGPA', category: 'Navigation', icon: 'school', action: () => onSelectView('academics'), shortcut: 'CS301' },
    { title: 'DSA & Competitive Programming Tracker', category: 'Navigation', icon: 'code_blocks', action: () => onSelectView('dsa-cp'), shortcut: 'Striver' },
    { title: 'AI Study Planner & Adaptive Schedule', category: 'Navigation', icon: 'auto_awesome', action: () => onSelectView('ai-study-planner'), shortcut: 'Bayes' },
    { title: 'Development Sprint Board', category: 'Navigation', icon: 'developer_mode', action: () => onSelectView('development'), shortcut: 'Git' },
    { title: 'Life, Wellness & Health Logger', category: 'Navigation', icon: 'vital_signs', action: () => onSelectView('life-health'), shortcut: 'Bio' },
    { title: 'Start 45m Deep Work Sprint', category: 'Action', icon: 'timer', action: () => onOpenFocusModal('Deep Work Sprint'), shortcut: '⌘P' },
    { title: 'CS302: Operating Systems (Virtual Memory)', category: 'Course', icon: 'memory', action: () => onSelectView('academics'), shortcut: '4 Credits' },
    { title: 'CS303: DBMS & SQL (B+ Trees & Joins)', category: 'Course', icon: 'database', action: () => onSelectView('academics'), shortcut: '4 Credits' },
    { title: 'LeetCode #124: Binary Tree Max Path Sum', category: 'DSA Problem', icon: 'account_tree', action: () => onSelectView('dsa-cp'), shortcut: 'Hard' },
    { title: 'LeetCode #322: Coin Change I (Unbounded Knapsack)', category: 'DSA Problem', icon: 'calculate', action: () => onSelectView('dsa-cp'), shortcut: 'Medium' },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.shortcut && item.shortcut.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-surface-container-low max-w-xl w-full rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden flex flex-col">
        <div className="flex items-center px-4 py-3 border-b border-surface-container-highest/30 bg-surface-container-lowest/60">
          <span className="material-symbols-outlined text-on-surface-variant text-[22px] mr-2">search</span>
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command, subject, or problem to search..."
            className="w-full bg-transparent text-on-surface placeholder:text-outline-variant font-body-md text-body-md focus:outline-none"
          />
          <kbd className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono">
            ESC
          </kbd>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1 font-body-sm text-body-sm">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-on-surface-variant font-mono">No matching records found.</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-medium text-on-surface">{item.title}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{item.category}</div>
                  </div>
                </div>
                {item.shortcut && (
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
