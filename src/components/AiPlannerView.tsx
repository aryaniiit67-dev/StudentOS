import React, { useState } from 'react';
import { calculateTimeBudgetMinutes } from '../utils/academicMath.ts';

interface AiPlannerViewProps {
  onOpenFocusModal: (title?: string) => void;
}

export const AiPlannerView: React.FC<AiPlannerViewProps> = ({ onOpenFocusModal }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [rescheduleApproved, setRescheduleApproved] = useState(false);
  const [rescheduleDismissed, setRescheduleDismissed] = useState(false);
  const [timetableMode, setTimetableMode] = useState<'daily' | 'macro'>('daily');

  // Priority Dial slider percentages
  const [acadSlider, setAcadSlider] = useState(45);
  const [dsaSlider, setDsaSlider] = useState(30);
  const [devSlider, setDevSlider] = useState(15);
  const [bufSlider, setBufSlider] = useState(10);

  // Copilot console state
  const [copilotQuery, setCopilotQuery] = useState(
    'Analyze my Test 1 vs Midterm improvement and tell me what grade boundary I am on track for in Math III.'
  );
  const [activePromptType, setActivePromptType] = useState<'improvement' | '2h' | 'exam_moved' | 'custom'>('improvement');
  const [customInput, setCustomInput] = useState('');

  const timeBudget = calculateTimeBudgetMinutes(7, {
    academics: acadSlider,
    dsa: dsaSlider,
    dev: devSlider,
    buffer: bufSlider,
  });

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 900);
  };

  const handleQuickPrompt = (type: '2h' | 'exam_moved' | 'improvement') => {
    setActivePromptType(type);
    if (type === '2h') {
      setCopilotQuery('I have only 2 hours tonight. What should I study?');
    } else if (type === 'exam_moved') {
      setCopilotQuery('My Math exam moved 3 days earlier. Reorganize my plan.');
    } else {
      setCopilotQuery('Analyze my Test 1 vs Midterm improvement and tell me what grade boundary I am on track for in Math III.');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setCopilotQuery(customInput.trim());
    setActivePromptType('custom');
    setCustomInput('');
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Planner Header & System Telemetry */}
      <header className="relative w-full rounded-xl p-space-md sm:p-space-lg bg-surface-container-low shadow-xl overflow-hidden mb-space-lg border border-surface-container-highest/20">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-primary-container/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-space-xs flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider font-mono">
                <span className="material-symbols-outlined text-[13px] animate-pulse">neurology</span>
                Adaptive Schedule Engine v3.1
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold font-mono">
                <span className="material-symbols-outlined text-[12px]">bolt</span>
                Academic Midterm Blitz (Oct 24 - Nov 5)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                Telemetry Synced
              </span>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              AI Study Planner &amp; Adaptive Schedule Engine
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Dynamic workload optimization based on real academic conditions, exam proximities, and DSA goals. Built on Bayesian priority scoring and non-negotiable circadian health baselines.
            </p>
          </div>

          {/* Health Readout & Primary Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md shrink-0">
            <div className="flex items-center gap-space-md p-space-sm rounded-lg bg-surface-container-lowest shadow-md border border-surface-container-highest/20">
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-tertiary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute font-stat-numeric text-[11px] text-tertiary font-bold font-mono">88%</span>
              </div>
              <div className="flex flex-col pr-space-xs font-mono">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Schedule Health</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Optimal</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">6.5h study • 7.5h sleep protected</span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                onClick={handleSynthesize}
                className="flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[18px] ${isSynthesizing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Plan'}</span>
              </button>
              <button
                onClick={() => alert('Schedule Engine settings: Bayesian priors = STEM v4.0, Target GPA = 9.00')}
                className="p-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors cursor-pointer"
                title="Engine Settings"
                aria-label="Engine settings"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Step Navigation & Pipeline Indicator */}
      <section className="w-full rounded-xl bg-surface-container p-space-md mb-space-lg shadow-md overflow-x-auto border border-surface-container-highest/20">
        <div className="flex items-center justify-between min-w-[960px] relative font-mono">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-surface-container-highest z-0" />
          <div className="absolute left-6 w-[56%] top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-500" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-stat-numeric text-[11px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">1. Profile</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-stat-numeric text-[11px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">2. Academic Cond.</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-stat-numeric text-[11px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">3. Baselines</span>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-stat-numeric text-[11px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">4. Priority Engine</span>
          </div>

          {/* Step 5 (Active) */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-8 h-8 -my-0.5 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-stat-numeric text-[12px] font-bold ring-4 ring-secondary/20 shadow-lg">
              5
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold">5. Time Alloc.</span>
          </div>

          {/* Step 6 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-stat-numeric text-[11px] font-medium">
              6
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">6. Timetable</span>
          </div>

          {/* Step 7 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-stat-numeric text-[11px] font-medium">
              7
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">7. Adaptive Replanning</span>
          </div>

          {/* Step 8 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-stat-numeric text-[11px] font-medium">
              8
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">8. Feedback Loop</span>
          </div>

          {/* Step 9 */}
          <div className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-stat-numeric text-[11px] font-medium">
              9
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">9. Copilot Dock</span>
          </div>
        </div>
      </section>

      {/* Adaptive Reschedule Notice (Urgent Alert Bar) */}
      {!rescheduleDismissed && (
        <div className="w-full rounded-xl p-space-md bg-surface-container-low shadow-md mb-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border border-surface-container-highest/20">
          <div className="flex items-start sm:items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Adaptive Reschedule Recommendation
                </span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold font-mono">
                  1 Missed Block
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                You missed yesterday's <span className="text-on-surface font-semibold">45m OS Kernel</span> session. Would you like to redistribute it into tomorrow's free buffer block (14:30 - 15:15)?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 self-end lg:self-auto">
            {rescheduleApproved ? (
              <span className="px-space-md py-1.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-body-sm text-body-sm font-semibold flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[16px]">verified</span> Rescheduled to 14:30!
              </span>
            ) : (
              <>
                <button
                  onClick={() => setRescheduleDismissed(true)}
                  className="px-space-md py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-colors font-body-sm text-body-sm font-semibold cursor-pointer"
                >
                  Keep Custom
                </button>
                <button
                  onClick={() => setRescheduleApproved(true)}
                  className="px-space-md py-1.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-fixed-dim transition-all shadow-sm font-body-sm text-body-sm font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Approve Revision
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Core Grid: Priority Engine & Time Allocation Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-space-lg">
        {/* Core Feature 1: The Transparent Priority Engine (7 cols) */}
        <div className="xl:col-span-7 flex flex-col rounded-xl bg-surface-container p-space-md sm:p-space-lg shadow-lg border border-surface-container-highest/20">
          <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-highest/20">
            <div className="flex items-center gap-space-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">balance</span>
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Transparent Priority Engine</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                  Explanations of automated Bayesian urgency scoring
                </p>
              </div>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-primary font-medium font-mono">
              Model: STEM-Bayes v4
            </span>
          </div>

          <div className="flex flex-col gap-space-sm">
            {/* Subject Card #1 */}
            <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors shadow-sm flex flex-col gap-2 border border-surface-container-highest/20">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-lg bg-error-container text-on-error-container font-stat-numeric text-[13px] font-bold flex items-center justify-center shrink-0 font-mono">
                    #1
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Mathematics III</span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono">
                        4 Credits
                      </span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container/60 text-on-error-container font-mono">
                        Urgent
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Fourier Series, Complex Variables, Vector Calculus
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end font-mono">
                    <span className="font-stat-numeric text-stat-numeric text-error font-bold">94</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/100</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-error font-mono">Critical Delta</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: '94%' }} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-space-sm rounded-lg border border-surface-container-highest/20">
                <strong className="text-on-surface">Urgency Attribution:</strong> Midterm in 12 days, 3 unmastered modules, historical baseline was 25% (improved to 75% in Test 2, but needs 15/20 to secure A grade). Weightage: 4 Credits.
              </p>
            </div>

            {/* Subject Card #2 */}
            <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors shadow-sm flex flex-col gap-2 border border-surface-container-highest/20">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container font-stat-numeric text-[13px] font-bold flex items-center justify-center shrink-0 font-mono">
                    #2
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Binary Trees &amp; DP (DSA)</span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-secondary-container/40 text-secondary font-mono">
                        Tech Prep
                      </span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-tertiary font-mono">
                        12d Streak
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      LeetCode Hard Spaced Repetition Queue
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end font-mono">
                    <span className="font-stat-numeric text-stat-numeric text-secondary font-bold">82</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/100</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-mono">High Retention Need</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '82%' }} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-space-sm rounded-lg border border-surface-container-highest/20">
                <strong className="text-on-surface">Urgency Attribution:</strong> Spaced revision queue has 5 overdue hard problems; coding streak is 12 days. Forgetting curve threshold reached for Dynamic Programming on Trees.
              </p>
            </div>

            {/* Subject Card #3 */}
            <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors shadow-sm flex flex-col gap-2 border border-surface-container-highest/20">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-lg bg-primary-container text-on-primary-container font-stat-numeric text-[13px] font-bold flex items-center justify-center shrink-0 font-mono">
                    #3
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Operating Systems</span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono">
                        3 Credits
                      </span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-error-container/40 text-on-error font-mono">
                        Lab Due 48h
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Concurrency, Deadlock Detection, Paging
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end font-mono">
                    <span className="font-stat-numeric text-stat-numeric text-primary font-bold">74</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/100</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-mono">Deadline Bound</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '74%' }} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-space-sm rounded-lg border border-surface-container-highest/20">
                <strong className="text-on-surface">Urgency Attribution:</strong> Deadlock lab due in 48 hours; attendance at 92% (stable, low attendance penalty risk).
              </p>
            </div>

            {/* Subject Card #4 */}
            <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors shadow-sm flex flex-col gap-2 border border-surface-container-highest/20">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-lg bg-tertiary-container text-on-tertiary-container font-stat-numeric text-[13px] font-bold flex items-center justify-center shrink-0 font-mono">
                    #4
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Database Systems</span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-tertiary font-mono">
                        3 Credits
                      </span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-mono">
                        Stable
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      SQL, Normalization (BCNF), B+ Trees
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1 justify-end font-mono">
                    <span className="font-stat-numeric text-stat-numeric text-tertiary font-bold">58</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/100</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-mono">Low Immediate Risk</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '58%' }} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-space-sm rounded-lg border border-surface-container-highest/20">
                <strong className="text-on-surface">Urgency Attribution:</strong> Syllabus 80% complete; quiz score 18/20; low immediate risk. Retain weekly spaced pass only.
              </p>
            </div>
          </div>
        </div>

        {/* Core Feature 2: Realistic Time Allocation Matrix (5 cols) */}
        <div className="xl:col-span-5 flex flex-col rounded-xl bg-surface-container p-space-md sm:p-space-lg shadow-lg justify-between border border-surface-container-highest/20">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-highest/20">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pie_chart</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Realistic Time Allocation</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">Total Day: 24h • Circadian Safe</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-tertiary font-medium font-mono">
                Auto-Protected
              </span>
            </div>

            {/* Deduction Ledger */}
            <div className="rounded-xl bg-surface-container-lowest p-space-md mb-space-md shadow-sm border border-surface-container-highest/20 font-mono">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold">
                  Non-Negotiable Commitments
                </span>
                <span className="font-stat-numeric text-[13px] text-error font-bold">17h 00m</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-on-surface-variant font-body-sm text-body-sm mb-space-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">bedtime</span>
                  <span>Sleep: <strong className="text-on-surface">7h 30m</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-on-surface">school</span>
                  <span>Lectures: <strong className="text-on-surface">5h 00m</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-on-surface-variant">commute</span>
                  <span>Commute: <strong className="text-on-surface">1h 00m</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-on-surface-variant">restaurant</span>
                  <span>Meals &amp; Buffer: <strong className="text-on-surface">2h 30m</strong></span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="material-symbols-outlined text-[15px] text-tertiary">fitness_center</span>
                  <span>Exercise: <strong className="text-on-surface">1h 00m</strong></span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex">
                <div className="bg-primary h-full w-[31%]" title="Sleep 7.5h" />
                <div className="bg-outline-variant h-full w-[21%]" title="Lectures 5h" />
                <div className="bg-surface-bright h-full w-[19%]" title="Other commits 4.5h" />
                <div className="bg-tertiary h-full w-[29%]" title="Study budget 7h" />
              </div>
            </div>

            {/* Available Study Budget Display */}
            <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex items-center justify-between mb-space-md border border-surface-container-highest/20">
              <div className="flex flex-col font-mono">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Available Productive Budget</span>
                <span className="font-stat-numeric text-stat-numeric text-tertiary font-bold">7h 00m</span>
                <span className="font-body-sm text-body-sm text-tertiary-fixed-dim">Strictly guarded from sleep compression</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">timelapse</span>
              </div>
            </div>

            {/* Interactive Priority Allocation Dial Sliders */}
            <div className="flex flex-col gap-3 font-mono">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold tracking-wider">
                Student Priority Dial (Adjustable)
              </span>

              {/* Academics Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface font-medium flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Academics
                  </span>
                  <span className="font-stat-numeric text-primary font-semibold">
                    {acadSlider}% → {Math.floor(timeBudget.academicsMin / 60)}h {timeBudget.academicsMin % 60}m
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={acadSlider}
                  onChange={(e) => setAcadSlider(parseInt(e.target.value) || 0)}
                  className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
                  aria-label="Academics time allocation"
                />
              </div>

              {/* DSA Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface font-medium flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> DSA &amp; Coding
                  </span>
                  <span className="font-stat-numeric text-secondary font-semibold">
                    {dsaSlider}% → {Math.floor(timeBudget.dsaMin / 60)}h {timeBudget.dsaMin % 60}m
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={dsaSlider}
                  onChange={(e) => setDsaSlider(parseInt(e.target.value) || 0)}
                  className="w-full accent-secondary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
                  aria-label="DSA time allocation"
                />
              </div>

              {/* Development Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface font-medium flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-tertiary" /> Projects / Dev
                  </span>
                  <span className="font-stat-numeric text-tertiary font-semibold">
                    {devSlider}% → {Math.floor(timeBudget.devMin / 60)}h {timeBudget.devMin % 60}m
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={devSlider}
                  onChange={(e) => setDevSlider(parseInt(e.target.value) || 0)}
                  className="w-full accent-tertiary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
                  aria-label="Development time allocation"
                />
              </div>

              {/* Buffer / Spaced Review */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface font-medium flex items-center gap-1 font-sans">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed" /> Buffer &amp; Spaced Review
                  </span>
                  <span className="font-stat-numeric text-primary-fixed font-semibold">
                    {bufSlider}% → {Math.floor(timeBudget.bufferMin / 60)}h {timeBudget.bufferMin % 60}m
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={bufSlider}
                  onChange={(e) => setBufSlider(parseInt(e.target.value) || 0)}
                  className="w-full accent-primary-fixed h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
                  aria-label="Buffer time allocation"
                />
              </div>
            </div>
          </div>

          <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-lowest flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm border border-surface-container-highest/20 font-mono">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <span>Guardrail Enforced: Sleep allocation locked at 7h 30m minimum.</span>
          </div>
        </div>
      </div>

      {/* Core Feature 3: Generated Adaptive 7-Day & Daily Timetable */}
      <section className="w-full rounded-xl bg-surface-container p-space-md sm:p-space-lg shadow-lg mb-space-lg border border-surface-container-highest/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-sm mb-space-md border-b border-surface-container-highest/20">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Generated Adaptive Daily Timetable</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                Synchronized with priority weights • Tuesday, Oct 24
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-xs flex-wrap font-mono">
            <div className="flex items-center p-1 rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
              <button
                onClick={() => setTimetableMode('daily')}
                className={`px-space-sm py-1 rounded font-label-md text-label-md font-semibold cursor-pointer transition-all ${
                  timetableMode === 'daily' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Daily Schedule
              </button>
              <button
                onClick={() => setTimetableMode('macro')}
                className={`px-space-sm py-1 rounded font-label-md text-label-md font-medium cursor-pointer transition-all ${
                  timetableMode === 'macro' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                7-Day Macro Matrix
              </button>
            </div>
            <button
              onClick={handleSynthesize}
              className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors font-body-sm text-body-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Regenerate Slots</span>
            </button>
          </div>
        </div>

        {/* Time Block Feed */}
        <div className="grid grid-cols-1 gap-space-sm">
          {/* Timeblock 1 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all shadow-sm gap-space-sm border border-surface-container-highest/20">
            <div className="flex items-start md:items-center gap-space-md">
              <div className="flex flex-col shrink-0 min-w-[120px] font-mono">
                <span className="font-stat-numeric text-headline-sm text-primary font-bold">16:30 – 17:45</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">75 mins • High Focus</span>
              </div>
              <div className="w-1.5 h-10 rounded-full bg-primary shrink-0 hidden md:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                    Academics • Math III
                  </span>
                  <span className="font-label-sm text-label-sm text-error font-medium">Midterm Focus</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  Fourier Inversion Theorem &amp; Practice Set 2
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Target: Complete problem sheet 3.2 (#1-#8), verify Euler coefficients
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-mono">
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-tertiary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Ready
              </span>
              <button
                onClick={() => onOpenFocusModal('Math III: Fourier Inversion Theorem')}
                className="px-space-sm py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span> Start Session
              </button>
            </div>
          </div>

          {/* Timeblock 2 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all shadow-sm gap-space-sm border border-surface-container-highest/20">
            <div className="flex items-start md:items-center gap-space-md">
              <div className="flex flex-col shrink-0 min-w-[120px] font-mono">
                <span className="font-stat-numeric text-headline-sm text-secondary font-bold">18:00 – 19:15</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">75 mins • Coding</span>
              </div>
              <div className="w-1.5 h-10 rounded-full bg-secondary shrink-0 hidden md:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold">
                    DSA &amp; CP
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Streak Protection</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  LeetCode #124 Binary Tree Max Path Sum &amp; #236 LCA
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Target: Post-order DFS traversal patterns + memoized recursion in C++
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-mono">
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant">
                Queued
              </span>
              <button
                onClick={() => alert('Opening LeetCode Traversal sandbox IDE...')}
                className="px-space-sm py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-secondary hover:text-on-secondary transition-colors font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">code</span> Open IDE
              </button>
            </div>
          </div>

          {/* Timeblock 3: Buffer / Dinner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-space-sm px-space-md rounded-xl bg-surface-container-lowest shadow-sm gap-space-sm opacity-80 border border-surface-container-highest/20">
            <div className="flex items-center gap-space-md">
              <div className="flex flex-col shrink-0 min-w-[120px] font-mono">
                <span className="font-stat-numeric text-headline-sm text-on-surface-variant font-bold">19:30 – 20:30</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">60 mins • Health</span>
              </div>
              <div className="w-1.5 h-8 rounded-full bg-surface-container-highest shrink-0 hidden md:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                    Protected Buffer
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Dinner &amp; Outdoor Walk</span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant self-end md:self-auto flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[15px]">shield</span> Non-Work Window
            </span>
          </div>

          {/* Timeblock 4 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all shadow-sm gap-space-sm border border-surface-container-highest/20">
            <div className="flex items-start md:items-center gap-space-md">
              <div className="flex flex-col shrink-0 min-w-[120px] font-mono">
                <span className="font-stat-numeric text-headline-sm text-tertiary font-bold">20:30 – 21:45</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">75 mins • Build</span>
              </div>
              <div className="w-1.5 h-10 rounded-full bg-tertiary shrink-0 hidden md:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-semibold">
                    Development • StudentOS
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-medium">Milestone Sprint</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  JWT Token Refresh &amp; API Tests
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Target: Implement sliding expiration auth middleware with automated Vitest test suite
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-mono">
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant">
                Upcoming
              </span>
              <button
                onClick={() => alert('Checking out branch feat/auth-v2 and running Vitest...')}
                className="px-space-sm py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-tertiary hover:text-on-tertiary transition-colors font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">terminal</span> Branch git
              </button>
            </div>
          </div>

          {/* Timeblock 5 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all shadow-sm gap-space-sm border border-surface-container-highest/20">
            <div className="flex items-start md:items-center gap-space-md">
              <div className="flex flex-col shrink-0 min-w-[120px] font-mono">
                <span className="font-stat-numeric text-headline-sm text-primary-fixed-dim font-bold">22:00 – 22:30</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">30 mins • Review</span>
              </div>
              <div className="w-1.5 h-10 rounded-full bg-primary-fixed shrink-0 hidden md:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-primary-fixed font-semibold">
                    Spaced Review &amp; Feedback Loop
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Daily Closeout</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  Anki Flashcard Deck &amp; Daily Journal Log
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Target: Rate difficulty of today's Math III problems &amp; update Spaced Retest weights
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-mono">
              <button
                onClick={() => alert('Day log saved to Central DataStore. Streak updated to Day 13.')}
                className="px-space-sm py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">rate_review</span> Log Day
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature 4: Persistent AI Copilot Interactive Console */}
      <section className="w-full rounded-xl bg-surface-container-low p-space-md sm:p-space-lg shadow-xl mb-space-lg border border-surface-container-highest/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm mb-space-md gap-space-xs border-b border-surface-container-highest/20">
          <div className="flex items-center gap-space-xs">
            <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] animate-pulse">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">Copilot Adaptive Console</h2>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold font-mono">
                  Active Engine
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                Live Bayesian query reasoning &amp; schedule re-synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary" /> In-Memory Academic Context Active
            </span>
          </div>
        </div>

        {/* Quick Prompts Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-space-xs mb-space-md font-mono">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant shrink-0 font-semibold">
            Quick Prompts:
          </span>
          <button
            onClick={() => handleQuickPrompt('2h')}
            className={`px-space-sm py-1 rounded-lg transition-all font-body-sm text-body-sm shrink-0 shadow-sm flex items-center gap-1 cursor-pointer ${
              activePromptType === '2h' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
            "I have only 2 hours tonight. What should I study?"
          </button>
          <button
            onClick={() => handleQuickPrompt('exam_moved')}
            className={`px-space-sm py-1 rounded-lg transition-all font-body-sm text-body-sm shrink-0 shadow-sm flex items-center gap-1 cursor-pointer ${
              activePromptType === 'exam_moved' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-error">event_busy</span>
            "My Math exam moved 3 days earlier. Reorganize my plan."
          </button>
          <button
            onClick={() => handleQuickPrompt('improvement')}
            className={`px-space-sm py-1 rounded-lg transition-all font-body-sm text-body-sm shrink-0 shadow-sm flex items-center gap-1 cursor-pointer ${
              activePromptType === 'improvement' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-tertiary">trending_up</span>
            "Analyze my Test 1 vs Midterm improvement."
          </button>
        </div>

        {/* Live Copilot Conversation Box */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-inner flex flex-col gap-space-md border border-surface-container-highest/20">
          {/* User Query Simulation */}
          <div className="flex items-start gap-space-sm max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] text-on-surface">person</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Alex Chen • CS '26</span>
              <div className="mt-1 p-space-sm rounded-lg bg-surface-container font-body-md text-body-md text-on-surface shadow-sm border border-surface-container-highest/20">
                {copilotQuery}
              </div>
            </div>
          </div>

          {/* AI Response Box with Strict Math Derivations */}
          <div className="flex items-start gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2 font-mono">
                <span className="font-label-sm text-label-sm text-secondary font-bold">StudentOS Intelligence Engine</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">• Computed in 42ms</span>
              </div>

              <div className="mt-1.5 p-space-md rounded-xl bg-surface-container font-body-md text-body-md text-on-surface shadow-md flex flex-col gap-space-sm border border-surface-container-highest/20">
                {activePromptType === 'improvement' && (
                  <>
                    <p>
                      Here is your mathematical progression analysis across historical milestones for{' '}
                      <strong className="text-primary font-semibold">Mathematics III</strong>:
                    </p>

                    <div className="p-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm flex flex-col gap-1.5 border border-surface-container-highest/20 font-mono">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-on-surface-variant font-medium">Trajectory Derivation Model:</span>
                        <span className="font-stat-numeric text-tertiary font-bold">+50.0% Normalized Gain</span>
                      </div>
                      <div className="font-stat-numeric text-[12px] text-on-surface space-y-1">
                        <div>• <strong className="text-error">Test 1 Baseline:</strong> 2.5 / 10 = 25.0% (Risk Tier: Critical Fail)</div>
                        <div>• <strong className="text-tertiary">Test 2 Recovery:</strong> 15.0 / 20 = 75.0% (Risk Tier: Normalized Pass)</div>
                        <div>• <strong className="text-primary">Net Delta:</strong> 75.0% - 25.0% = <span className="text-tertiary font-bold">+50.0% pts improvement</span></div>
                        <div>• <strong className="text-secondary">Midterm Projection:</strong> Required score on Nov 5: <span className="text-secondary font-bold">≥ 15.0 / 20</span> to secure cumulative <strong>A Grade (85%+)</strong> with 4.0 credit weighting.</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-1 font-mono">
                      <div className="p-2 rounded-lg bg-surface-container-low text-center border border-surface-container-highest/20">
                        <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Test 1 Score</span>
                        <span className="font-stat-numeric text-stat-numeric text-error font-bold">25%</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-container-low text-center border border-surface-container-highest/20">
                        <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Test 2 Score</span>
                        <span className="font-stat-numeric text-stat-numeric text-primary font-bold">75%</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-container-low text-center border border-surface-container-highest/20">
                        <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Target Midterm</span>
                        <span className="font-stat-numeric text-stat-numeric text-tertiary font-bold">≥75%</span>
                      </div>
                    </div>

                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">Prescription:</strong> To ensure retention through exam day in 12 days, maintain the current 75-minute daily block allocated to Fourier series and vector differentiation. No sleep deduction is needed.
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => alert('Fourier practice task appended to tomorrow timetable (16:30).')}
                        className="px-space-sm py-1 rounded bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary-fixed-dim transition-colors flex items-center gap-1 cursor-pointer font-mono"
                      >
                        <span className="material-symbols-outlined text-[15px]">add_task</span>
                        Append Fourier Practice to Tomorrow
                      </button>
                      <button
                        onClick={() => alert('Mathematical Progression Computation Report exported as PDF.')}
                        className="px-space-sm py-1 rounded bg-surface-container-highest text-on-surface font-body-sm text-body-sm hover:bg-surface-bright transition-colors cursor-pointer font-mono"
                      >
                        Export Computation Report
                      </button>
                    </div>
                  </>
                )}

                {activePromptType === '2h' && (
                  <>
                    <p>
                      <strong className="text-error font-semibold font-mono">Triage Protocol Activated:</strong> Budget compressed from 7h 00m to 2h 00m. Prioritizing highest exam vulnerability and coding streak integrity.
                    </p>

                    <div className="p-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm flex flex-col gap-1.5 border border-surface-container-highest/20 font-mono">
                      <div className="text-on-surface font-stat-numeric space-y-1">
                        <div>• <strong className="text-primary font-bold">Block 1 (70m):</strong> Math III - Fourier Inversion Theorem (Midterm in 12 days, highest weightage 4.0 credits).</div>
                        <div>• <strong className="text-secondary font-bold">Block 2 (35m):</strong> DSA - Overdue LeetCode #124 to protect 12-day coding streak.</div>
                        <div>• <strong className="text-tertiary font-bold">Block 3 (15m):</strong> Spaced Repetition flashcard pass.</div>
                        <div className="text-on-surface-variant">• Deferred: OS Deadlock lab pushed to tomorrow morning buffer slot (09:00).</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => alert('2-Hour Compressed Schedule Applied!')}
                        className="px-space-sm py-1 rounded bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary-fixed-dim transition-colors cursor-pointer font-mono"
                      >
                        Apply 2-Hour Plan
                      </button>
                    </div>
                  </>
                )}

                {activePromptType === 'exam_moved' && (
                  <>
                    <p>
                      <strong className="text-error font-semibold font-mono">Bayesian Urgency Recomputed:</strong> Math III days-to-exam compressed from 12 days to 9 days. Priority Score elevated:{' '}
                      <strong className="text-error font-bold font-mono">94 → 99/100</strong>.
                    </p>

                    <div className="p-space-sm rounded-lg bg-surface-container-low font-body-sm text-body-sm flex flex-col gap-1.5 border border-surface-container-highest/20 font-mono">
                      <div className="text-on-surface font-stat-numeric space-y-1">
                        <div>• Math III study allocation increased: <span className="text-tertiary font-bold">+45 mins/day</span>.</div>
                        <div>• Development (StudentOS) temporarily curtailed to maintenance mode (30m).</div>
                        <div>• Protected Sleep Baseline: <strong className="text-tertiary">7h 30m remains untouched</strong>.</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => alert('Shift confirmed. Math III allocation boosted by 45 minutes!')}
                        className="px-space-sm py-1 rounded bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary-fixed-dim transition-colors cursor-pointer font-mono"
                      >
                        Confirm Shift &amp; Update Timetable
                      </button>
                    </div>
                  </>
                )}

                {activePromptType === 'custom' && (
                  <>
                    <p>
                      <strong className="text-secondary font-semibold font-mono">Custom Constraint Received:</strong> Processing dynamic schedule adjustment for "{copilotQuery}"...
                    </p>
                    <p className="text-on-surface-variant font-body-sm text-body-sm font-mono">
                      All non-negotiable sleep commitments (7h 30m) protected. Prioritizing Mathematics III (Urgency 94) and binary tree algorithms.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Copilot Input Field */}
          <form onSubmit={handleCustomSubmit} className="relative w-full mt-space-xs">
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full pl-space-md pr-24 py-2.5 bg-surface-container text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md rounded-lg focus:outline-none border border-surface-container-highest/30 shadow-md"
              placeholder="Ask Copilot to re-weight subjects, compress blocks, or analyze syllabus..."
              type="text"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-space-md bg-secondary text-on-secondary rounded font-label-md text-label-md font-semibold hover:bg-secondary-fixed-dim transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
