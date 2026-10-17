import React, { useState, useEffect } from 'react';
import { WorkspaceView, ScheduleEvent, DsaProblem, ScratchMemo } from './types.ts';
import {
  INITIAL_SCHEDULE_EVENTS,
  INITIAL_MEMOS,
  INITIAL_DSA_PROBLEMS,
} from './data/mockData.ts';
import { formatStopwatchTime } from './utils/academicMath.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { CommandCenterView } from './components/CommandCenterView.tsx';
import { AcademicsView } from './components/AcademicsView.tsx';
import { DsaCpView } from './components/DsaCpView.tsx';
import { AiPlannerView } from './components/AiPlannerView.tsx';
import {
  DevelopmentView,
  LifeHealthView,
  TasksDeadlinesView,
  AnalyticsCgpaView,
  SettingsView,
} from './components/OtherViews.tsx';
import { FocusModal } from './components/FocusModal.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<WorkspaceView>('command-center');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Deep work focus modal
  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [focusTargetTitle, setFocusTargetTitle] = useState('Adaptive Day Sprint Protocol');

  // Command palette search
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // App-wide state: Schedule items
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE_EVENTS);

  // App-wide state: Scratchpad memos
  const [memos, setMemos] = useState<ScratchMemo[]>(INITIAL_MEMOS);

  // App-wide state: DSA problems
  const [dsaProblems, setDsaProblems] = useState<DsaProblem[]>(INITIAL_DSA_PROBLEMS);

  // Stopwatch state
  const [stopwatchSeconds, setStopwatchSeconds] = useState(1458); // 24m 18s initial
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [showStopwatchModal, setShowStopwatchModal] = useState(false);

  // Global stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Global Keyboard shortcuts: Cmd+1, Cmd+K, Cmd+P
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setCurrentView('command-center');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setFocusTargetTitle('Adaptive Day Sprint Protocol');
        setFocusModalOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSchedule = (id: string) => {
    setScheduleEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, attended: !ev.attended } : ev))
    );
  };

  const handleAddScheduleEvent = (newEvent: Partial<ScheduleEvent>) => {
    const fullEvent: ScheduleEvent = {
      id: newEvent.id || 'ev-' + Date.now(),
      timeRange: newEvent.timeRange || '15:00 - 16:00',
      category: newEvent.category || 'study',
      tag: newEvent.tag || 'USER SYNC',
      tagColor: newEvent.tagColor || 'bg-primary/20 text-primary',
      title: newEvent.title || 'Custom Study Session',
      subtitle: newEvent.subtitle || 'Scheduled block',
      locationOrMeta: newEvent.locationOrMeta || 'Today',
      attended: false,
    };
    setScheduleEvents((prev) => [...prev, fullEvent]);
  };

  const handleAddMemo = (text: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMemos((prev) => [{ id: 'm-' + Date.now(), text, time: timeString }, ...prev]);
  };

  const handleAddDsaProblem = (prob: Partial<DsaProblem>) => {
    const fullProblem: DsaProblem = {
      id: prob.id || 'p-' + Date.now(),
      title: prob.title || 'Untitled Problem',
      codeId: prob.codeId || '#LC-Custom',
      concept: prob.concept || 'Algorithmic Invariant',
      platform: prob.platform || 'LeetCode',
      topic: prob.topic || 'General Algorithms',
      difficulty: prob.difficulty || 'Medium',
      solveMode: prob.solveMode || 'Independent (< 30m)',
      solveTimeMins: prob.solveTimeMins || 25,
      complexity: prob.complexity || 'O(N) time • O(1) space',
      revisionCadence: prob.revisionCadence || 'Stage 1 (Day 3 Due)',
      cadenceUrgent: prob.cadenceUrgent || false,
      notes: prob.notes || 'Documented.',
    };
    setDsaProblems((prev) => [fullProblem, ...prev]);
  };

  const openFocusModalWithTitle = (title?: string) => {
    if (title) setFocusTargetTitle(title);
    setFocusModalOpen(true);
  };

  const handleQuickAdd = (type: string) => {
    if (type === 'timeblock') {
      const title = window.prompt('Enter timeblock title:', 'Algorithm Review Session');
      if (title && title.trim()) {
        handleAddScheduleEvent({ title: title.trim() });
      }
    } else if (type === 'problem') {
      setCurrentView('dsa-cp');
    } else if (type === 'memo') {
      const text = window.prompt('Enter quick scratchpad memo:');
      if (text && text.trim()) {
        handleAddMemo(text.trim());
      }
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-sans selection:bg-primary/30 selection:text-primary">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Canvas */}
      <div className="w-full lg:pl-64 flex flex-col min-h-screen">
        {/* Fixed Top Bar */}
        <Header
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onOpenQuickAdd={handleQuickAdd}
          onOpenFocusModal={() => openFocusModalWithTitle()}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Workspace Canvas */}
        <main className="relative pt-16 min-h-screen w-full px-space-md sm:px-space-lg py-space-lg bg-[radial-gradient(#2f3445_1px,transparent_1px)] [background-size:24px_24px] bg-surface">
          {currentView === 'command-center' && (
            <CommandCenterView
              onSelectView={setCurrentView}
              onOpenFocusModal={openFocusModalWithTitle}
              scheduleEvents={scheduleEvents}
              onToggleScheduleEvent={handleToggleSchedule}
              onAddScheduleEvent={handleAddScheduleEvent}
              memos={memos}
              onAddMemo={handleAddMemo}
            />
          )}

          {currentView === 'academics' && <AcademicsView />}

          {currentView === 'dsa-cp' && (
            <DsaCpView
              problems={dsaProblems}
              onAddProblem={handleAddDsaProblem}
              stopwatchSeconds={stopwatchSeconds}
              isStopwatchRunning={isStopwatchRunning}
              onToggleStopwatch={() => setIsStopwatchRunning(!isStopwatchRunning)}
              onResetStopwatch={() => {
                setIsStopwatchRunning(false);
                setStopwatchSeconds(0);
              }}
              onToggleStopwatchModal={() => setShowStopwatchModal(!showStopwatchModal)}
              showStopwatchModal={showStopwatchModal}
              formatStopwatchTime={formatStopwatchTime}
            />
          )}

          {currentView === 'ai-study-planner' && (
            <AiPlannerView onOpenFocusModal={openFocusModalWithTitle} />
          )}

          {currentView === 'development' && (
            <DevelopmentView onOpenFocusModal={() => openFocusModalWithTitle('Development Sprint: Go Backend')} />
          )}

          {currentView === 'life-health' && <LifeHealthView />}

          {currentView === 'tasks-deadlines' && <TasksDeadlinesView />}

          {currentView === 'analytics-cgpa' && <AnalyticsCgpaView />}

          {currentView === 'calendar-scheduler' && (
            <div className="flex flex-col gap-4">
              <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/20 shadow-md">
                <div className="flex items-center gap-2 font-mono text-label-sm text-primary">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>TIME-BLOCK CALENDAR MATRIX</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">Calendar &amp; Scheduler</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Deterministic university schedule integrated with personalized deep work sprint allocations.
                </p>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
                <div className="grid grid-cols-7 gap-2 text-center font-mono text-label-sm">
                  {['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'].map((day, i) => (
                    <div
                      key={day}
                      className={`p-3 rounded-lg border ${
                        i === 1 ? 'bg-primary-container/20 border-primary text-primary font-bold' : 'bg-surface-container border-surface-container-highest/20 text-on-surface'
                      }`}
                    >
                      <div>{day}</div>
                      <div className="text-[11px] text-on-surface-variant mt-2 font-mono">
                        {i === 1 ? '6 Timeblocks' : `${4 + (i % 3)} Timeblocks`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating Glassmorphic Quick-Action Dock (Specified in Design System) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setCurrentView('command-center')}
          className={`p-2 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'command-center' ? 'text-primary bg-surface-container-highest' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Command Center (⌘1)"
        >
          <span className="material-symbols-outlined text-[20px]">terminal</span>
          {currentView === 'command-center' && <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full" />}
        </button>

        <button
          onClick={() => setCurrentView('academics')}
          className={`p-2 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'academics' ? 'text-primary bg-surface-container-highest' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="Academics"
        >
          <span className="material-symbols-outlined text-[20px]">school</span>
          {currentView === 'academics' && <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full" />}
        </button>

        <button
          onClick={() => setCurrentView('dsa-cp')}
          className={`p-2 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'dsa-cp' ? 'text-secondary bg-surface-container-highest' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="DSA & CP"
        >
          <span className="material-symbols-outlined text-[20px]">code_blocks</span>
          {currentView === 'dsa-cp' && <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-secondary rounded-full" />}
        </button>

        <button
          onClick={() => setCurrentView('ai-study-planner')}
          className={`p-2 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'ai-study-planner' ? 'text-secondary bg-surface-container-highest' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          title="AI Study Planner"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          {currentView === 'ai-study-planner' && <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-secondary rounded-full" />}
        </button>

        <div className="h-5 w-px bg-surface-container-highest mx-1" />

        <button
          onClick={() => openFocusModalWithTitle()}
          className="p-2 rounded-xl text-primary hover:bg-surface-container-highest transition-all cursor-pointer"
          title="Deep Work Sprint (⌘P)"
        >
          <span className="material-symbols-outlined text-[20px]">timer</span>
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer"
          title="Command Palette (⌘K)"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>

      {/* Focus Timer Modal */}
      <FocusModal
        isOpen={focusModalOpen}
        onClose={() => setFocusModalOpen(false)}
        targetTitle={focusTargetTitle}
      />

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectView={setCurrentView}
        onOpenFocusModal={openFocusModalWithTitle}
      />
    </div>
  );
}
