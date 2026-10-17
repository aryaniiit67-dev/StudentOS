import React, { useState, useEffect } from 'react';
import { WorkspaceView, ScheduleEvent, ScratchMemo } from '../types.ts';

interface CommandCenterViewProps {
  onSelectView: (view: WorkspaceView) => void;
  onOpenFocusModal: (title?: string) => void;
  scheduleEvents: ScheduleEvent[];
  onToggleScheduleEvent: (id: string) => void;
  onAddScheduleEvent: (event: Partial<ScheduleEvent>) => void;
  memos: ScratchMemo[];
  onAddMemo: (text: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onSelectView,
  onOpenFocusModal,
  scheduleEvents,
  onToggleScheduleEvent,
  onAddScheduleEvent,
  memos,
  onAddMemo,
}) => {
  const [liveTime, setLiveTime] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'academic' | 'study'>('all');
  const [dsaSolvedState, setDsaSolvedState] = useState(false);
  const [aiAccepted, setAiAccepted] = useState(false);
  const [aiDismissed, setAiDismissed] = useState(false);
  const [scratchText, setScratchText] = useState('');
  const [ideModalOpen, setIdeModalOpen] = useState(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredSchedule = scheduleEvents.filter((ev) => {
    if (scheduleFilter === 'all') return true;
    if (scheduleFilter === 'academic') return ev.category === 'academic';
    if (scheduleFilter === 'study') return ev.category === 'study' || ev.category === 'dev';
    return true;
  });

  const handleScratchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scratchText.trim()) {
      onAddMemo(scratchText.trim());
      setScratchText('');
    }
  };

  const handleInjectPrompt = () => {
    const title = window.prompt(
      'Enter event title (e.g. Office Hours with Prof. Miller):',
      'Office Hours with Prof. Miller'
    );
    if (title && title.trim()) {
      onAddScheduleEvent({
        id: 'ev-custom-' + Date.now(),
        title: title.trim(),
        timeRange: '15:30 - 16:30',
        category: 'academic',
        tag: 'USER SYNC',
        tagColor: 'bg-primary/20 text-primary',
        subtitle: 'Ad-hoc scheduled academic block',
        locationOrMeta: 'Today',
        attended: false,
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-12">
      {/* Top Command HUD & Greeting Bar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md sm:p-space-lg shadow-xl border border-surface-container-highest/20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-64 -bottom-24 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                SYS: ONLINE
              </span>
              <span className="text-on-surface-variant font-mono">SEMESTER 3 • WEEK 8</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-medium">TARGET CGPA: 9.00</span>
              <span className="text-outline-variant">/</span>
              <span className="inline-flex items-center gap-1 text-error px-2 py-0.5 rounded bg-error-container/20">
                <span className="material-symbols-outlined text-[12px]">alarm</span>
                MIDTERMS IN 12 DAYS
              </span>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Good morning, Alex. Let's make today count.
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Priority telemetry is trending optimal. Focus session queued for Mathematics III &amp; Dynamic Programming before 17:00.
            </p>
          </div>

          {/* Action & Live Clock Cluster */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-surface-container-lowest/80 px-space-md py-2.5 rounded-lg shadow-sm border border-surface-container-highest/20">
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant">LOCAL TIME</span>
                <span className="font-stat-numeric text-headline-sm text-primary font-mono">{liveTime || '09:41:22 AM'}</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[22px]">schedule</span>
            </div>

            <button
              onClick={() => onOpenFocusModal('Adaptive Day Sprint Protocol')}
              className="group relative flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold transition-all shadow-[0_0_20px_rgba(147,204,255,0.3)] hover:bg-primary-container hover:text-on-primary-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">bolt</span>
              <span>Plan My Day</span>
              <span className="font-label-sm text-label-sm bg-on-primary/20 text-on-primary px-1.5 py-0.5 rounded ml-1 font-mono">
                ⌘P
              </span>
            </button>
          </div>
        </div>

        {/* Quick Gauge Telemetry Bar */}
        <div className="mt-space-lg grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-md bg-surface-container-lowest/60 p-space-sm rounded-lg border border-surface-container-highest/20">
          <div className="flex items-center gap-3 px-space-sm py-1">
            <div className="w-9 h-9 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">target</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">PRIORITY SCORE</span>
                <span className="font-stat-numeric text-body-md text-primary font-bold">87/100</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '87%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-space-sm py-1">
            <div className="w-9 h-9 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">STUDY BANDWIDTH</span>
                <span className="font-stat-numeric text-body-md text-tertiary font-bold">3h 45m left</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
                <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: '62%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-space-sm py-1">
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">DAILY TASKS</span>
                <span className="font-stat-numeric text-body-md text-secondary font-bold">4 of 9 (44%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1 overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: '44%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
        {/* Card 1: CGPA */}
        <div
          onClick={() => onSelectView('academics')}
          className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-200 rounded-lg p-space-md flex flex-col justify-between shadow-sm border border-surface-container-highest/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Est. CGPA</span>
            <span className="material-symbols-outlined text-primary text-[18px]">grade</span>
          </div>
          <div className="my-space-sm flex items-baseline justify-between">
            <span className="font-stat-numeric text-stat-numeric text-on-surface font-semibold tracking-tight">8.42</span>
            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+0.18
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
              <span>Target 9.00</span>
              <span>Sem 2: 8.24</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '84%' }} />
            </div>
          </div>
        </div>

        {/* Card 2: Midterms */}
        <div
          onClick={() => onSelectView('academics')}
          className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-200 rounded-lg p-space-md flex flex-col justify-between shadow-sm border border-surface-container-highest/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Midterms</span>
            <span className="material-symbols-outlined text-error text-[18px]">event_upcoming</span>
          </div>
          <div className="my-space-sm flex items-baseline justify-between">
            <span className="font-stat-numeric text-stat-numeric text-error font-semibold tracking-tight">12 Days</span>
            <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold">Critical</span>
          </div>
          <div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
              <span className="truncate">Math III Next</span>
              <span>Target 15/20</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-error" style={{ width: '72%' }} />
            </div>
          </div>
        </div>

        {/* Card 3: DSA Solved */}
        <div
          onClick={() => onSelectView('dsa-cp')}
          className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-200 rounded-lg p-space-md flex flex-col justify-between shadow-sm border border-surface-container-highest/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">DSA Solved</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">terminal</span>
          </div>
          <div className="my-space-sm flex items-baseline justify-between">
            <span className="font-stat-numeric text-stat-numeric text-on-surface font-semibold tracking-tight">
              184<span className="text-body-md text-on-surface-variant font-normal">/450</span>
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-mono">🔥 12d streak</span>
          </div>
          <div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
              <span>Striver A2Z</span>
              <span>+6 this wk</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: '41%' }} />
            </div>
          </div>
        </div>

        {/* Card 4: Dev Projects */}
        <div
          onClick={() => onSelectView('development')}
          className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-200 rounded-lg p-space-md flex flex-col justify-between shadow-sm border border-surface-container-highest/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Dev Projects</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">developer_board</span>
          </div>
          <div className="my-space-sm flex items-baseline justify-between">
            <span className="font-stat-numeric text-stat-numeric text-on-surface font-semibold tracking-tight">3 Active</span>
            <span className="font-label-sm text-label-sm text-tertiary">14 Commits</span>
          </div>
          <div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
              <span>LMS: 72%</span>
              <span>Auth: 90%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-tertiary" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        {/* Card 5: Weekly Study Hours */}
        <div
          onClick={() => onSelectView('ai-study-planner')}
          className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-200 rounded-lg p-space-md flex flex-col justify-between shadow-sm border border-surface-container-highest/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Study Log</span>
            <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
          </div>
          <div className="my-space-sm flex items-baseline justify-between">
            <span className="font-stat-numeric text-stat-numeric text-on-surface font-semibold tracking-tight">
              24.5<span className="text-body-md text-on-surface-variant font-normal">h</span>
            </span>
            <span className="font-label-sm text-label-sm text-primary font-mono">76% Pace</span>
          </div>
          <div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
              <span>Target: 32h</span>
              <span>7.5h left</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '76%' }} />
            </div>
          </div>
        </div>

        {/* Card 6: Wellness */}
        <div
          onClick={() => onSelectView('life-health')}
          className="bg-surface-container-low hover:bg-surface-container-high transition-all duration-200 rounded-lg p-space-md flex flex-col justify-between shadow-sm border border-surface-container-highest/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Wellness</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">favorite</span>
          </div>
          <div className="my-space-sm flex items-baseline justify-between">
            <span className="font-stat-numeric text-stat-numeric text-tertiary font-semibold tracking-tight">82%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">5/7 Gym</span>
          </div>
          <div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
              <span>Sleep: 7.2h</span>
              <span>2.4L Water</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-tertiary" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Focus Engine */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Priority Focus Engine</h2>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-container/30 text-primary">
              Weighted Algorithm v3.1
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Auto-sorted by Urgency x Credit Weight
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          {/* Priority Card 1: Academics */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md sm:p-space-lg flex flex-col justify-between shadow-md border border-surface-container-highest/20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold">
                    HIGH URGENCY
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-mono">ACADEMICS • 4 CREDITS</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
                  Mathematics III - Fourier &amp; Laplace
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Midterm exam in 12 days. Historical assessment baseline is weak (Quiz 1: 2.5/10).
                </p>
              </div>
              <span className="material-symbols-outlined text-error text-[22px]">warning</span>
            </div>

            <div className="my-space-md p-space-sm rounded-lg bg-surface-container-lowest/80 flex items-center justify-between border border-surface-container-highest/20">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">REQUIRED CUTOFF</span>
                <span className="font-stat-numeric text-body-lg text-primary font-bold">14.5 / 20.0</span>
              </div>
              <div className="h-6 w-px bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">TARGET SCORE</span>
                <span className="font-stat-numeric text-body-lg text-tertiary font-bold">15.0 / 20.0</span>
              </div>
              <div className="h-6 w-px bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">RECOMMENDED</span>
                <span className="font-body-sm text-body-sm text-on-surface font-mono">45m block</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onOpenFocusModal('Math III: Fourier Transforms')}
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-headline-sm text-headline-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">timer</span>
                <span>Start 45m Session</span>
              </button>
              <button
                onClick={() => onSelectView('academics')}
                className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-body-sm text-body-sm flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Syllabus</span>
              </button>
            </div>
          </div>

          {/* Priority Card 2: DSA */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md sm:p-space-lg flex flex-col justify-between shadow-md border border-surface-container-highest/20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">
                    DAILY STREAK
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-mono">DSA &amp; CP • REVISION</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
                  Binary Trees: Diameter &amp; Max Path Sum
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  LeetCode #543 &amp; #124 • Spaced revision due (Last solved 14 days ago).
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[22px]">code</span>
            </div>

            <div className="my-space-md p-space-sm rounded-lg bg-surface-container-lowest/80 flex items-center justify-between border border-surface-container-highest/20">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">DIFFICULTY</span>
                <span className="font-label-md text-label-md text-secondary font-bold">MEDIUM / HARD</span>
              </div>
              <div className="h-6 w-px bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">QUEUE STATUS</span>
                <span className="font-label-md text-label-md text-primary font-bold">DUE TODAY</span>
              </div>
              <div className="h-6 w-px bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ROADMAP</span>
                <span className="font-body-sm text-body-sm text-on-surface font-mono">Step 5.2</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIdeModalOpen(true)}
                className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-fixed hover:text-on-secondary-fixed font-headline-sm text-headline-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                <span>Launch IDE</span>
              </button>
              <button
                onClick={() => setDsaSolvedState(!dsaSolvedState)}
                className={`px-3 py-2 rounded-lg transition-all font-body-sm text-body-sm flex items-center gap-1 cursor-pointer ${
                  dsaSolvedState
                    ? 'bg-tertiary-container text-on-tertiary-container font-semibold'
                    : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {dsaSolvedState ? 'verified' : 'done_all'}
                </span>
                <span>{dsaSolvedState ? 'Solved (+1 Queue)' : 'Mark Solved'}</span>
              </button>
            </div>
          </div>

          {/* Priority Card 3: Development */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md sm:p-space-lg flex flex-col justify-between shadow-md border border-surface-container-highest/20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-tertiary-container text-on-tertiary-container font-semibold">
                    MILESTONE 4/6
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-mono">DEVELOPMENT • BACKEND</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
                  StudentOS Auth Module: JWT Refresh
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Implement rotating refresh tokens in Go service and Redis token blacklist.
                </p>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[22px]">hub</span>
            </div>

            <div className="my-space-md p-space-sm rounded-lg bg-surface-container-lowest/80 flex items-center justify-between border border-surface-container-highest/20">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">BRANCH</span>
                <span className="font-body-sm text-body-sm text-tertiary font-mono">feat/auth-v2</span>
              </div>
              <div className="h-6 w-px bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">TEST COVERAGE</span>
                <span className="font-label-md text-label-md text-on-surface font-bold">88.4%</span>
              </div>
              <div className="h-6 w-px bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">REVIEWS</span>
                <span className="font-body-sm text-body-sm text-on-surface font-mono">1 Pending</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectView('development')}
                className="flex-1 py-2 rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary-fixed hover:text-on-tertiary-fixed font-headline-sm text-headline-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">merge</span>
                <span>Open Pull Request</span>
              </button>
              <button
                onClick={() => onSelectView('development')}
                className="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all font-body-sm text-body-sm flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">checklist</span>
                <span>Checklist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Four Connected Workspace Quick Hub */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">grid_view</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Core Workspaces</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Synced with Central DataStore</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Hub 1: Academics */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Academics</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-mono">5 Active Subjects</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary/10 text-primary font-mono">Sem 3</span>
            </div>
            <div className="my-space-md flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Overall Attendance</span>
                <span className="text-tertiary font-mono font-medium">88.4% (Safe &gt; 75%)</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Next Assignment</span>
                <span className="text-error font-mono">OS Lab 3 (in 2d)</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Discrete Math</span>
                <span className="text-on-surface font-mono">Lecture Notes Synced</span>
              </div>
            </div>
            <button
              onClick={() => onSelectView('academics')}
              className="w-full py-1.5 rounded bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface transition-colors font-label-md text-label-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Go to Academic Ledger</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Hub 2: DSA & CP */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">code_blocks</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">DSA &amp; CP</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-mono">Competitive Suite</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary/10 text-secondary font-mono">Rating 1680</span>
            </div>
            <div className="my-space-md flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Striver A2Z Roadmap</span>
                <span className="text-secondary font-mono font-medium">41% Complete</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Spaced Revision</span>
                <span className="text-primary font-mono">12 problems pending</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>LeetCode Standing</span>
                <span className="text-on-surface font-mono">Top 18.2%</span>
              </div>
            </div>
            <button
              onClick={() => onSelectView('dsa-cp')}
              className="w-full py-1.5 rounded bg-surface-container-highest hover:bg-secondary hover:text-on-secondary text-on-surface transition-colors font-label-md text-label-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Go to Problem Engine</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Hub 3: Development */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Development</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-mono">3 Repositories</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-tertiary/10 text-tertiary font-mono">Git Sync</span>
            </div>
            <div className="my-space-md flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Primary Stack</span>
                <span className="text-on-surface font-mono">Next.js + Go + PG</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Recent Commits</span>
                <span className="text-tertiary font-mono">14 pushed this wk</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Portfolio Status</span>
                <span className="text-on-surface font-mono">1 project draft</span>
              </div>
            </div>
            <button
              onClick={() => onSelectView('development')}
              className="w-full py-1.5 rounded bg-surface-container-highest hover:bg-tertiary hover:text-on-tertiary text-on-surface transition-colors font-label-md text-label-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Go to Sprint Board</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Hub 4: Life & Health */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">vital_signs</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Life &amp; Health</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-mono">Biometrics &amp; Habits</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface font-mono">Optimal</span>
            </div>
            <div className="my-space-md flex flex-col gap-2 font-body-sm text-body-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Sleep Duration</span>
                <span className="text-tertiary font-mono">7h 15m (Good)</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Water Intake</span>
                <span className="text-primary font-mono">1.8L / 3.0L</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Monthly Expenses</span>
                <span className="text-on-surface font-mono">$340 / $500</span>
              </div>
            </div>
            <button
              onClick={() => onSelectView('life-health')}
              className="w-full py-1.5 rounded bg-surface-container-highest hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface transition-colors font-label-md text-label-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Go to Bio Logger</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual-Column Interactive Modules: Today Schedule & AI Contextual Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Interactive Today Schedule (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-md sm:p-space-lg shadow-md flex flex-col gap-space-md border border-surface-container-highest/20">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Today's Time-Blocked Protocol</h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setScheduleFilter('all')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm font-medium transition-all cursor-pointer ${
                  scheduleFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant'
                }`}
              >
                All ({scheduleEvents.length})
              </button>
              <button
                onClick={() => setScheduleFilter('academic')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm font-medium transition-all cursor-pointer ${
                  scheduleFilter === 'academic' ? 'bg-primary text-on-primary' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant'
                }`}
              >
                Classes
              </button>
              <button
                onClick={() => setScheduleFilter('study')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm font-medium transition-all cursor-pointer ${
                  scheduleFilter === 'study' ? 'bg-primary text-on-primary' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant'
                }`}
              >
                Deep Work
              </button>
            </div>
          </div>

          {/* Schedule Timeline Container */}
          <div className="flex flex-col gap-2.5">
            {filteredSchedule.map((ev) => {
              const isAdjustedMath = aiAccepted && ev.id === 'ev-3';
              const displayTime = isAdjustedMath ? '14:00 - 16:20' : ev.timeRange;
              const displayMeta = isAdjustedMath ? '140m Expanded Focus' : ev.locationOrMeta;

              return (
                <div
                  key={ev.id}
                  className={`flex items-center justify-between p-space-sm rounded-lg transition-all border ${
                    ev.attended
                      ? 'bg-surface-container/60 hover:bg-surface-container-high border-transparent'
                      : isAdjustedMath
                      ? 'bg-surface-container-high border-secondary shadow-sm ring-1 ring-secondary/50'
                      : 'bg-surface-container-high/70 hover:bg-surface-container-high border-surface-container-highest/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleScheduleEvent(ev.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-transform active:scale-90 shrink-0 cursor-pointer ${
                        ev.attended
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                      }`}
                      aria-label={`Toggle attendance for ${ev.title}`}
                    >
                      <span className={`material-symbols-outlined text-[14px] ${ev.attended ? 'opacity-100' : 'opacity-0 hover:opacity-40'}`}>
                        check
                      </span>
                    </button>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-stat-numeric text-body-sm font-mono ${ev.attended ? 'text-on-surface-variant' : 'text-primary font-bold'}`}>
                          {displayTime}
                        </span>
                        <span className={`font-label-sm text-label-sm px-1.5 rounded font-mono ${ev.tagColor}`}>
                          {ev.tag}
                        </span>
                        {!ev.attended && ev.isPriority && (
                          <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                        )}
                      </div>
                      <span
                        className={`font-headline-sm text-headline-sm text-on-surface font-medium truncate ${
                          ev.attended ? 'line-through opacity-70' : 'font-semibold'
                        }`}
                      >
                        {ev.title}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 font-mono pl-2">
                    {displayMeta}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Schedule Add Utility Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-container-highest/20">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Adjust daily blocks dynamically with drag-and-drop sync
            </span>
            <button
              onClick={handleInjectPrompt}
              className="font-body-sm text-body-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Inject Timeblock</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Assistant Contextual Insight & Adaptive Engine (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* AI Insight Card */}
          <div className="relative overflow-hidden bg-gradient-to-b from-surface-container-high to-surface-container-low rounded-xl p-space-md sm:p-space-lg shadow-md border border-surface-container-highest/20">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-secondary-container/20 blur-2xl" />
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1">
                  <span>Copilot Engine</span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono">
                    GPT-4o STEM
                  </span>
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
            </div>

            <div className="p-space-md rounded-lg bg-surface-container-lowest/90 mb-space-md border border-surface-container-highest/20">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                <strong className="text-primary font-semibold">Diagnostic:</strong> Mathematics III has 3 incomplete sub-modules and carries{' '}
                <span className="text-secondary font-mono">4 university credits</span>. Historical Quiz 1 was below threshold (2.5/10).
              </p>
              <div className="mt-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                💡 <strong>Prescription:</strong> Dedicating an additional <strong>50 minutes</strong> between 14:00 and 15:30 today recovers a{' '}
                <strong>14% confidence gap</strong> before the Midterm window in 12 days.
              </div>
            </div>

            {!aiAccepted && !aiDismissed && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setAiAccepted(true)}
                  className="w-full py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-fixed hover:text-on-secondary-fixed font-headline-sm text-headline-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                  <span>Accept Schedule Adjustment (+50m Math)</span>
                </button>
                <button
                  onClick={() => setAiDismissed(true)}
                  className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all font-body-sm text-body-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Keep current plan unchanged</span>
                </button>
              </div>
            )}

            {aiAccepted && (
              <div className="mt-2 p-3 rounded-lg bg-tertiary-container/30 text-tertiary font-body-sm text-body-sm flex items-center gap-2 border border-tertiary/20">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Schedule re-indexed! Math III block increased to 140m.</span>
              </div>
            )}

            {aiDismissed && (
              <div className="text-on-surface-variant font-label-sm text-label-sm italic py-2">
                Recommendation dismissed for today.
              </div>
            )}
          </div>

          {/* Quick Note / Focus Terminal Widget */}
          <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-3 border border-surface-container-highest/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">terminal</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Quick Scratchpad &amp; CLI</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">autosave: on</span>
            </div>

            <div className="bg-surface-container-lowest rounded-lg p-2.5 font-mono text-body-sm border border-surface-container-highest/20">
              <div className="text-on-surface-variant select-none">// StudentOS Shell v2.4 • Session: Math Revision</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary">&gt;</span>
                <input
                  value={scratchText}
                  onChange={(e) => setScratchText(e.target.value)}
                  onKeyDown={handleScratchSubmit}
                  className="w-full bg-transparent text-on-surface placeholder:text-outline-variant font-mono text-body-sm focus:outline-none"
                  placeholder="Type quick task or memo (e.g. todo: submit CN quiz)..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {memos.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-2 py-1 rounded bg-surface-container-high/60 text-body-sm">
                  <span className="text-on-surface font-mono truncate">{m.text}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 pl-2 font-mono">{m.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mock IDE modal */}
      {ideModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-low max-w-lg w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-highest">
            <div className="flex items-center justify-between border-b border-surface-container-highest/30 pb-2">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[22px]">code</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">StudentOS Sandbox IDE</h3>
              </div>
              <button
                onClick={() => setIdeModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-xl font-mono text-body-sm flex flex-col gap-2">
              <div className="text-secondary font-semibold">// LeetCode #124: Binary Tree Maximum Path Sum</div>
              <div className="text-tertiary">#include &lt;iostream&gt;</div>
              <div className="text-tertiary">#include &lt;algorithm&gt;</div>
              <div className="text-on-surface text-[12px] whitespace-pre font-mono">
{`int maxGain(TreeNode* node, int& maxSum) {
    if (!node) return 0;
    int leftGain = std::max(maxGain(node->left, maxSum), 0);
    int rightGain = std::max(maxGain(node->right, maxSum), 0);
    int priceNewpath = node->val + leftGain + rightGain;
    maxSum = std::max(maxSum, priceNewpath);
    return node->val + std::max(leftGain, rightGain);
}`}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-tertiary" /> Test Suite: 42/42 Tests Passing (O(N) 8ms)
              </span>
              <button
                onClick={() => {
                  setIdeModalOpen(false);
                  setDsaSolvedState(true);
                }}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-headline-sm text-headline-sm font-semibold hover:bg-secondary-fixed cursor-pointer"
              >
                Verify &amp; Mark Solved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
