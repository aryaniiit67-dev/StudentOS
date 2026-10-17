import React from 'react';
import { WorkspaceView } from '../types.ts';

interface SidebarProps {
  currentView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  mobileOpen,
  onCloseMobile,
}) => {
  const mainNavItems = [
    { id: 'command-center' as WorkspaceView, label: 'Command Center', icon: 'terminal', shortcut: '⌘1', colorDot: null },
    { id: 'academics' as WorkspaceView, label: 'Academics', icon: 'school', shortcut: null, colorDot: 'bg-primary' },
    { id: 'dsa-cp' as WorkspaceView, label: 'DSA & CP', icon: 'code_blocks', shortcut: null, colorDot: 'bg-secondary' },
    { id: 'development' as WorkspaceView, label: 'Development', icon: 'developer_mode', shortcut: null, colorDot: 'bg-tertiary' },
    { id: 'life-health' as WorkspaceView, label: 'Life & Health', icon: 'vital_signs', shortcut: null, colorDot: 'bg-primary-fixed' },
  ];

  const toolNavItems = [
    { id: 'ai-study-planner' as WorkspaceView, label: 'AI Study Planner', icon: 'auto_awesome', badge: 'AI', badgeColor: 'bg-secondary-container text-on-secondary-container' },
    { id: 'calendar-scheduler' as WorkspaceView, label: 'Calendar & Scheduler', icon: 'calendar_month', badge: null, badgeColor: '' },
    { id: 'tasks-deadlines' as WorkspaceView, label: 'Tasks & Deadlines', icon: 'checklist', badge: '4', badgeColor: 'bg-error-container text-on-error-container rounded-full' },
    { id: 'analytics-cgpa' as WorkspaceView, label: 'Analytics & CGPA', icon: 'monitoring', badge: null, badgeColor: '' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 border-r border-surface-container-highest/20 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-low shrink-0 border-b border-surface-container-highest/20">
            <div
              className="flex items-center gap-space-sm cursor-pointer"
              onClick={() => {
                onSelectView('command-center');
                onCloseMobile();
              }}
            >
              <img
                alt="StudentOS Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WWj-u2LAlZzmcgHcdJDx_akar_0_z6h14mx5WmxHCcpDUIaHV5jUfKeu2Fr2iAYFfGd0htdU5sYpXJBrDLk9Tp8LrjROBw8wRj1wycfc4Q47Lvu7UeUbFiUL2idodZrEPL7Tfvpne-2W5lG47l98brXbdP1wyMoGjBwjAhTeFg4_DoPwKhOGp1QJVRSOEzBqsSmLsrM-VMsNb-qh2ltR05fPQKLOxZxCVLyL_tNreoaUv166C8tCaQ"
              />
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">StudentOS</span>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-medium">
              v2.4 Pro
            </span>
          </div>

          {/* Main Navigation Group */}
          <div className="px-space-md pt-space-md pb-space-xs">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-semibold">
              Main Navigation
            </span>
          </div>
          <nav className="flex flex-col gap-1 px-space-sm">
            {mainNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all font-body-md text-body-md text-left w-full cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className={`font-label-sm text-label-sm ${isActive ? 'text-on-primary-container/80' : 'text-on-surface-variant'}`}>
                      {item.shortcut}
                    </span>
                  )}
                  {item.colorDot && !isActive && (
                    <span className={`w-2 h-2 rounded-full ${item.colorDot}`} />
                  )}
                  {isActive && !item.shortcut && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Intelligent Tools Group */}
          <div className="px-space-md pt-space-lg pb-space-xs">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-semibold">
              Intelligent Tools
            </span>
          </div>
          <nav className="flex flex-col gap-1 px-space-sm">
            {toolNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all font-body-md text-body-md text-left w-full cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded font-medium ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-space-sm bg-surface-container-low flex flex-col gap-space-sm border-t border-surface-container-highest/20 shrink-0">
          <div className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse shrink-0" />
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                Demo Mode Active - Mock Engine
              </span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant shrink-0">memory</span>
          </div>

          <div className="flex items-center justify-between px-space-sm py-1 rounded-lg hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-space-sm overflow-hidden">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-primary/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzIt8VEbn3NBnFwxLKoM4cSEAtJ-N1Rmg3LZGFB5yhJeBbkS_dg6EyDy7mXMNix_GmlqGraNqiUb8WGvzFeg0TRBWo437yt3nm1jNwYI6AszM9g9-1hjuGUQKGGe1UyfLzB20Jnqxyabop_Nyw-Sv7scLW13filUOKzO7V0ao4XhBX0cpAJJmxxywtW3lGekJMY5cCeGgEyXznDZV1hmsqBt_UQGwy5TnH67lLIXRsWibhDEG5ZzI"
              />
              <div className="flex flex-col truncate">
                <span className="font-body-md text-body-md text-on-surface font-medium truncate">Alex Chen</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">CS '26 • Sem 3</span>
              </div>
            </div>
            <button
              onClick={() => onSelectView('settings')}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
              title="Settings"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
