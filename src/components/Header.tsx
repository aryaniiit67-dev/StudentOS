import React, { useState, useRef, useEffect } from 'react';
import { WorkspaceView } from '../types.ts';

interface HeaderProps {
  currentView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: (type: string) => void;
  onOpenFocusModal: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenSearch,
  onOpenQuickAdd,
  onOpenFocusModal,
  onToggleMobileMenu,
}) => {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const viewTitles: Record<WorkspaceView, string> = {
    'command-center': 'Command Center',
    'academics': 'Academics Workspace',
    'dsa-cp': 'DSA & Competitive Programming',
    'development': 'Development Sprint Board',
    'life-health': 'Life & Health Bio Logger',
    'ai-study-planner': 'AI Study Planner',
    'calendar-scheduler': 'Calendar & Scheduler',
    'tasks-deadlines': 'Tasks & Deadlines',
    'analytics-cgpa': 'Analytics & CGPA',
    'settings': 'System Settings',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-md lg:px-space-lg border-b border-surface-container-highest/20">
      {/* Left: Mobile hamburger + Breadcrumbs + Search */}
      <div className="flex items-center gap-space-sm lg:gap-space-md flex-1 min-w-0 mr-2">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
          aria-label="Open sidebar navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant shrink-0">
          <span className="material-symbols-outlined text-[16px]">domain</span>
          <span>StudentOS</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-medium text-on-surface truncate max-w-[130px]">{viewTitles[currentView]}</span>
        </div>

        {/* Search Input triggering Command Palette */}
        <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          </div>
          <input
            onClick={onOpenSearch}
            readOnly
            className="w-full pl-9 pr-10 py-1.5 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_1px_8px_rgba(0,0,0,0.04)] cursor-pointer truncate"
            placeholder="Search subjects, DSA..."
            type="text"
            aria-label="Search StudentOS"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-medium">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Date chip */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm border border-surface-container-highest/20">
          <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
          <span>Tuesday, Oct 24 • Semester 3</span>
        </div>

        {/* Ask Copilot */}
        <button
          onClick={() => onSelectView('ai-study-planner')}
          className="hidden md:flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all font-body-sm text-body-sm cursor-pointer shadow-sm"
          title="Open AI Copilot"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span>
          <span className="hidden lg:inline">Ask StudentOS Copilot</span>
        </button>

        {/* Quick Add with dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_1px_8px_rgba(0,0,0,0.04)] cursor-pointer"
            aria-expanded={quickAddOpen}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Quick Add</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-high p-1.5 shadow-2xl border border-surface-container-highest z-50 flex flex-col gap-1 font-body-sm text-body-sm animate-fade-in">
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  onOpenFocusModal();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-highest text-left cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
                <div>
                  <div className="font-semibold text-on-surface">Deep Work Sprint</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">⌘P focus timer</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  onOpenQuickAdd('problem');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-highest text-left cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">code_blocks</span>
                <div>
                  <div className="font-semibold text-on-surface">Log Solved DSA Problem</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">LeetCode / CF record</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  onOpenQuickAdd('timeblock');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-highest text-left cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">calendar_clock</span>
                <div>
                  <div className="font-semibold text-on-surface">Inject Timeblock</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">Add study session</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setQuickAddOpen(false);
                  onOpenQuickAdd('memo');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-highest text-left cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary-fixed">edit_note</span>
                <div>
                  <div className="font-semibold text-on-surface">Quick Memo / Todo</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">Post to scratchpad</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-on-error font-label-sm text-[9px] flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-container-high p-space-sm shadow-2xl border border-surface-container-highest z-50 flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container-highest/50">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Notifications</span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-bold">3 Unread</span>
              </div>
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                <div className="p-2 rounded-lg bg-surface-container-lowest/80 hover:bg-surface-container-highest transition-colors flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-error text-[11px] uppercase">Urgent Midterm</span>
                    <span className="text-[10px] text-on-surface-variant">10m ago</span>
                  </div>
                  <p className="text-[12px] text-on-surface">Mathematics III Midterm Exam scheduled in 12 days (Nov 5).</p>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest/80 hover:bg-surface-container-highest transition-colors flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-secondary text-[11px] uppercase">DSA Spaced Repetition</span>
                    <span className="text-[10px] text-on-surface-variant">1h ago</span>
                  </div>
                  <p className="text-[12px] text-on-surface">Binary Tree Max Path Sum is due for Day 3 mental dry-run.</p>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-lowest/80 hover:bg-surface-container-highest transition-colors flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary text-[11px] uppercase">OS Lab Deadline</span>
                    <span className="text-[10px] text-on-surface-variant">3h ago</span>
                  </div>
                  <p className="text-[12px] text-on-surface">Deadlock Banker's Algorithm Sim due this Friday 23:59.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark mode indicator icon */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Dark Mode Active"
          aria-label="Theme mode"
        >
          <span className="material-symbols-outlined text-[20px]">dark_mode</span>
        </button>

        {/* User avatar */}
        <div
          onClick={() => onSelectView('settings')}
          className="shrink-0 cursor-pointer"
          title="Alex Chen (CS '26)"
        >
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40 hover:ring-primary transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzIt8VEbn3NBnFwxLKoM4cSEAtJ-N1Rmg3LZGFB5yhJeBbkS_dg6EyDy7mXMNix_GmlqGraNqiUb8WGvzFeg0TRBWo437yt3nm1jNwYI6AszM9g9-1hjuGUQKGGe1UyfLzB20Jnqxyabop_Nyw-Sv7scLW13filUOKzO7V0ao4XhBX0cpAJJmxxywtW3lGekJMY5cCeGgEyXznDZV1hmsqBt_UQGwy5TnH67lLIXRsWibhDEG5ZzI"
          />
        </div>
      </div>
    </header>
  );
};
