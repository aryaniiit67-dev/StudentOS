import React, { useState } from 'react';
import { DsaProblem } from '../types.ts';

interface DsaCpViewProps {
  problems: DsaProblem[];
  onAddProblem: (problem: Partial<DsaProblem>) => void;
  stopwatchSeconds: number;
  isStopwatchRunning: boolean;
  onToggleStopwatch: () => void;
  onResetStopwatch: () => void;
  onToggleStopwatchModal: () => void;
  showStopwatchModal: boolean;
  formatStopwatchTime: (sec: number) => string;
}

export const DsaCpView: React.FC<DsaCpViewProps> = ({
  problems,
  onAddProblem,
  stopwatchSeconds,
  isStopwatchRunning,
  onToggleStopwatch,
  onResetStopwatch,
  onToggleStopwatchModal,
  showStopwatchModal,
  formatStopwatchTime,
}) => {
  const [topicFilter, setTopicFilter] = useState<'all' | 'weak'>('all');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showLogModal, setShowLogModal] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logPlatform, setLogPlatform] = useState<'LeetCode' | 'Codeforces' | 'GeeksforGeeks' | 'CodeChef'>('LeetCode');
  const [logDifficulty, setLogDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [logSolveMode, setLogSolveMode] = useState('Independent (< 30m)');
  const [logTimeMins, setLogTimeMins] = useState(25);
  const [logNotes, setLogNotes] = useState('');

  const [selectedNotesProblem, setSelectedNotesProblem] = useState<DsaProblem | null>(null);
  const [recoveryDrillGenerated, setRecoveryDrillGenerated] = useState(false);

  const filteredProblems = problems.filter((p) => {
    if (platformFilter !== 'All' && p.platform !== platformFilter) return false;
    if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
    if (statusFilter === 'Review Due Only' && !p.cadenceUrgent) return false;
    if (statusFilter === 'Weak Topic Flagged' && p.revisionCadence !== 'Weak Topic Flagged') return false;
    return true;
  });

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;
    onAddProblem({
      id: 'p-' + Date.now(),
      title: logTitle.trim(),
      codeId: `#LC-${Math.floor(100 + Math.random() * 900)}`,
      concept: 'Algorithmic Pattern',
      platform: logPlatform,
      topic: 'Data Structures',
      difficulty: logDifficulty,
      solveMode: logSolveMode,
      solveTimeMins: Number(logTimeMins) || 25,
      complexity: 'O(N) time • O(1) space',
      revisionCadence: 'Stage 1 (Day 3 Due)',
      cadenceUrgent: false,
      notes: logNotes.trim() || 'Key invariants documented.',
    });
    setShowLogModal(false);
    setLogTitle('');
    setLogNotes('');
  };

  const roadmapTopics = [
    { num: '01', title: 'Basics & Fundamentals', subtitle: 'Patterns, Basic Math, Basic Recursion, Standard Hashing', count: '25 / 25', percent: '100% Mastered', pctVal: 100, isDone: true, isWeak: false, isActive: false },
    { num: '02', title: 'Arrays & Hashing (Easy -> Hard)', subtitle: "Kadane's, Dutch National Flag, 4Sum, Merge Overlapping Intervals", count: '36 / 39', percent: '92%', pctVal: 92, isDone: false, isWeak: false, isActive: false },
    { num: '03', title: 'Binary Search & BS on Answer', subtitle: 'Rotated Sorted Arrays, Book Allocation, Median in Row-Wise Sorted', count: '22 / 26', percent: '85%', pctVal: 85, isDone: false, isWeak: false, isActive: false },
    { num: '04', title: 'Recursion & Backtracking', subtitle: 'Subsequences, N-Queens, Sudoku Solver, Palindrome Partitioning', count: '12 / 20', percent: '60%', pctVal: 60, isDone: false, isWeak: false, isActive: false },
    { num: '05', title: 'Linked Lists (1D, Doubly, Cyclic)', subtitle: 'Reverse in K-Groups, Flattening, LRU Cache, Copy Random Pointer', count: '14 / 18', percent: '78%', pctVal: 78, isDone: false, isWeak: false, isActive: false },
    { num: '06', title: 'Stacks & Monotonic Queues', subtitle: 'Next Greater Element, Trapping Rainwater, Largest Rectangle in Histogram', count: '14 / 20', percent: '70%', pctVal: 70, isDone: false, isWeak: false, isActive: false },
    { num: '07', title: 'Binary Trees & BST', subtitle: 'Views, Traversal serializations, Maximum Path Sum, LCA', count: '18 / 40', percent: 'ACTIVE SPRINT', pctVal: 45, isDone: false, isWeak: false, isActive: true },
    { num: '08', title: 'Dynamic Programming (1D, 2D, Grids, Trees)', subtitle: 'Knapsack variants, LCS, LIS, Partition DP, DP with Bitmask', count: '14 / 50', percent: 'WEAK TOPIC ALERT', pctVal: 28, isDone: false, isWeak: true, isActive: false },
    { num: '09', title: 'Graphs & Disjoint Set Union', subtitle: 'BFS/DFS, Topological Sort, Dijkstra, Bellman Ford, Kruskal MST', count: '12 / 40', percent: '30%', pctVal: 30, isDone: false, isWeak: false, isActive: false },
  ];

  const visibleRoadmap = roadmapTopics.filter((t) => (topicFilter === 'weak' ? t.isWeak : true));

  return (
    <div className="flex flex-col w-full pb-12">
      {/* TOP CONTEXT BAR: Breadcrumbs & Telemetry Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-lg gap-space-sm">
        <div className="flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
            WORKSPACE ENGINE v2.4
          </span>
          <span>/</span>
          <span className="text-on-surface font-semibold">DSA &amp; Competitive Programming</span>
          <span className="text-outline-variant">•</span>
          <span className="text-tertiary font-mono">Active Session #104</span>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={onToggleStopwatchModal}
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright font-label-md text-label-md transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
            <span>Problem Stopwatch</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-secondary font-stat-numeric text-label-sm font-bold font-mono">
              {formatStopwatchTime(stopwatchSeconds)}
            </span>
          </button>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-container transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>+ Log New Problem</span>
          </button>
        </div>
      </div>

      {/* HERO TELEMETRY MATRIX (Bento 5-Card Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-md mb-space-xl">
        {/* Card 1: Total Solved */}
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all border border-surface-container-highest/20">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Striver A2Z Track</span>
            <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-container/40 text-secondary font-semibold font-mono">
              40.8%
            </span>
          </div>
          <div className="my-space-sm">
            <div className="flex items-baseline gap-1.5">
              <span className="font-stat-numeric text-stat-numeric text-on-surface font-bold tracking-tight font-mono">
                184
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant font-mono">/ 450</span>
            </div>
            <p className="font-label-sm text-label-sm text-outline mt-0.5 font-mono">266 problems remaining</p>
          </div>
          <div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-full"
                style={{ width: '40.8%' }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-on-surface-variant font-label-sm text-label-sm font-mono">
              <span>Target: Dec 2024</span>
              <span className="text-secondary font-semibold">+6 this week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Difficulty Tiers */}
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-highest/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
              Difficulty Distribution
            </span>
            <span className="material-symbols-outlined text-outline text-[18px]">pie_chart</span>
          </div>
          <div className="space-y-1.5 my-space-xs font-mono">
            <div className="flex items-center justify-between font-label-md text-label-md">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-tertiary" />Easy
              </span>
              <span className="font-stat-numeric text-on-surface font-semibold">
                88 <span className="text-outline font-normal text-label-sm">(47%)</span>
              </span>
            </div>
            <div className="flex items-center justify-between font-label-md text-label-md">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-primary" />Medium
              </span>
              <span className="font-stat-numeric text-on-surface font-semibold">
                74 <span className="text-outline font-normal text-label-sm">(40%)</span>
              </span>
            </div>
            <div className="flex items-center justify-between font-label-md text-label-md">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-secondary" />Hard
              </span>
              <span className="font-stat-numeric text-secondary font-bold">
                22 <span className="text-outline font-normal text-label-sm">(12%)</span>
              </span>
            </div>
          </div>
          <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-surface-container-highest gap-0.5">
            <div className="h-full bg-tertiary" style={{ width: '47%' }} />
            <div className="h-full bg-primary" style={{ width: '40%' }} />
            <div className="h-full bg-secondary" style={{ width: '13%' }} />
          </div>
        </div>

        {/* Card 3: Active Streak */}
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-highest/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Active Code Streak</span>
            <span
              className="material-symbols-outlined text-[20px] text-tertiary animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div className="my-space-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-stat-numeric text-stat-numeric text-on-surface font-bold font-mono">12</span>
              <span className="font-headline-sm text-headline-sm text-tertiary font-semibold font-mono">Days Continuous</span>
            </div>
            <p className="font-label-sm text-label-sm text-outline mt-0.5 font-mono">Best record: 24 days (Aug 2024)</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.6)]" />
            <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.6)]" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-surface-container-highest" />
            <span className="w-2 h-2 rounded-full bg-surface-container-highest" />
          </div>
        </div>

        {/* Card 4: Revision Queue */}
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-highest/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Revision Queue</span>
            <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold font-mono">
              5 Urgent
            </span>
          </div>
          <div className="my-space-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-stat-numeric text-stat-numeric text-on-surface font-bold font-mono">14</span>
              <span className="font-body-md text-body-md text-on-surface-variant font-mono">Due this week</span>
            </div>
            <p className="font-label-sm text-label-sm text-outline mt-0.5 font-mono">Algorithm decay prevention</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-mono">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              <span>Next: Binary Trees</span>
            </div>
            <a href="#revision-ledger" className="font-label-sm text-label-sm text-primary hover:underline font-semibold font-mono">
              Review →
            </a>
          </div>
        </div>

        {/* Card 5: Contest Ratings */}
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-highest/20">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">Contest Ratings</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">trophy</span>
          </div>
          <div className="space-y-1.5 my-space-xs font-label-md text-label-md font-mono">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">LeetCode</span>
              <span className="font-stat-numeric text-secondary font-bold">
                1,682 <span className="text-tertiary text-label-sm font-normal">Top 18%</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Codeforces</span>
              <span className="font-stat-numeric text-on-surface font-semibold">
                1,340 <span className="text-outline text-label-sm font-normal">Pupil</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">CodeChef</span>
              <span className="font-stat-numeric text-on-surface font-semibold">
                1,710 <span className="text-primary text-label-sm font-normal">3★ Div 2</span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm text-outline font-mono">
            <span>Biweekly 139 in 3d</span>
            <span className="text-secondary font-semibold">Rating: +42 LC</span>
          </div>
        </div>
      </div>

      {/* WORKSPACE SPLIT: Striver A2Z Roadmap & Weak-Topic Intelligence Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        {/* LEFT: Striver A2Z Topic Roadmap Explorer (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container-low rounded-xl shadow-sm p-space-md sm:p-space-lg border border-surface-container-highest/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-sm border-b border-surface-container-highest/20">
            <div>
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">account_tree</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Striver A2Z DSA Roadmap Navigator</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Complete systematic trajectory covering 450 algorithmic paradigms
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-lg border border-surface-container-highest/20">
              <button
                onClick={() => setTopicFilter('all')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer font-mono ${
                  topicFilter === 'all'
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All Topics (9)
              </button>
              <button
                onClick={() => setTopicFilter('weak')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer font-mono ${
                  topicFilter === 'weak'
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Weak Only (1)
              </button>
            </div>
          </div>

          {/* Roadmap Groups Accordion */}
          <div className="space-y-space-sm mt-space-sm">
            {visibleRoadmap.map((t) => (
              <div
                key={t.num}
                className={`p-space-md rounded-lg transition-all border ${
                  t.isWeak
                    ? 'bg-error-container/20 border-error/30'
                    : t.isActive
                    ? 'bg-surface-container-high border-secondary/40 shadow-sm'
                    : 'bg-surface-container border-surface-container-highest/10 hover:border-surface-container-highest/40'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-space-md min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-stat-numeric text-label-sm font-bold shrink-0 font-mono ${
                        t.isDone
                          ? 'bg-tertiary-container/30 text-tertiary'
                          : t.isActive
                          ? 'bg-secondary text-on-secondary shadow-[0_0_8px_rgba(221,183,255,0.4)]'
                          : t.isWeak
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {t.num}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-headline-sm text-headline-sm text-on-surface ${t.isActive ? 'font-bold' : ''}`}>
                          {t.title}
                        </h4>
                        <span
                          className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm font-mono ${
                            t.isDone
                              ? 'bg-tertiary/10 text-tertiary font-semibold'
                              : t.isActive
                              ? 'bg-secondary-container text-on-secondary-container font-bold animate-pulse'
                              : t.isWeak
                              ? 'bg-error-container text-on-error-container font-bold'
                              : 'bg-primary/10 text-primary font-semibold'
                          }`}
                        >
                          {t.percent}
                        </span>
                      </div>
                      <p className={`font-body-sm text-body-sm truncate ${t.isActive ? 'text-secondary font-medium' : t.isWeak ? 'text-on-error-container/80' : 'text-outline'}`}>
                        {t.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-md shrink-0">
                    <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${
                          t.isDone ? 'bg-tertiary' : t.isWeak ? 'bg-error' : t.isActive ? 'bg-secondary' : 'bg-primary'
                        }`}
                        style={{ width: `${t.pctVal}%` }}
                      />
                    </div>
                    <span className={`font-stat-numeric text-body-md font-semibold font-mono ${t.isActive ? 'text-secondary font-bold' : t.isWeak ? 'text-error font-bold' : 'text-on-surface'}`}>
                      {t.count}
                    </span>
                    {t.isDone && <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Weak-Topic Intelligence Engine & Spaced Repetition (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Engine Diagnostic Card */}
          <div className="p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-surface-container-highest/20">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">smart_toy</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">AI Diagnosis</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold font-mono">
                  Anomaly Detected
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Dynamic Programming (1D &amp; 2D)</h3>
              <p className="font-body-sm text-body-sm text-outline mt-1">
                Stall detected in Subsequence Patterns. Critical weakness flagged by mock engine analytics.
              </p>

              <div className="grid grid-cols-2 gap-space-sm my-space-md font-mono">
                <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                  <span className="font-label-sm text-label-sm text-outline block">Independent Solve</span>
                  <span className="font-stat-numeric text-stat-numeric text-error font-bold">35%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mt-0.5">Cohort avg: 68%</span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                  <span className="font-label-sm text-label-sm text-outline block">Avg Time per Q</span>
                  <span className="font-stat-numeric text-stat-numeric text-error font-bold">48m</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mt-0.5">Threshold: 30m</span>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-secondary-container/20 text-on-surface mb-space-md border border-secondary/20">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">tips_and_updates</span>
                  <p className="font-body-sm text-body-sm leading-relaxed">
                    <span className="text-secondary font-semibold font-mono">Prescription:</span> Schedule 3 foundational unbounded knapsack problems before attempting hard DP on Trees to restore recurrence intuition.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setRecoveryDrillGenerated(true);
                setTimeout(() => setRecoveryDrillGenerated(false), 3000);
              }}
              className="w-full py-2 px-space-md rounded-lg bg-secondary text-on-secondary font-headline-sm text-headline-sm font-semibold hover:bg-secondary-fixed transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {recoveryDrillGenerated ? 'check_circle' : 'play_circle'}
              </span>
              <span>{recoveryDrillGenerated ? '3 Problems Queued!' : 'Generate Recovery Drill (3 Problems)'}</span>
            </button>
          </div>

          {/* Spaced Repetition Timeline Card */}
          <div className="p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col border border-surface-container-highest/20">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">update</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Spaced Repetition Protocol</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline font-mono">Ebbinghaus Curve</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-tertiary" />
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-semibold font-mono">
                    Day 1: Solve &amp; First Code
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold font-mono">Completed</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">Synthesized base structure &amp; complexity bounds</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-secondary" />
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-secondary font-bold font-mono">
                    Day 3: Review 1 (Mental Dry Run)
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-bold font-mono animate-pulse">
                    NOW DUE
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Trace edge cases without looking at code</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-surface-container-highest" />
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium font-mono">
                    Day 7: Review 2 (Speed Run)
                  </span>
                  <span className="font-label-sm text-label-sm text-outline font-mono">In 4 Days</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">Re-code from scratch within 20m benchmark</p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-surface-container-highest" />
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium font-mono">
                    Day 21: Final Check (Lock-in)
                  </span>
                  <span className="font-label-sm text-label-sm text-outline font-mono">In 18 Days</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">Verify retention in randomized contest environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE PROBLEM TRACKER & REVISION QUEUE */}
      <div className="p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-sm mb-space-xl flex flex-col border border-surface-container-highest/20" id="revision-ledger">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-md gap-space-md border-b border-surface-container-highest/20">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Interactive Problem Ledger &amp; Active Queue
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Filter, track independent solves, and schedule spaced repetition checkpoints
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg border border-surface-container-highest focus:outline-none cursor-pointer"
            >
              <option value="All">Platform: All (LeetCode, CF, GFG)</option>
              <option value="LeetCode">LeetCode</option>
              <option value="Codeforces">Codeforces</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg border border-surface-container-highest focus:outline-none cursor-pointer"
            >
              <option value="All">Difficulty: All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg border border-surface-container-highest focus:outline-none cursor-pointer"
            >
              <option value="All">Status: All Queue</option>
              <option value="Review Due Only">Review Due Only</option>
              <option value="Weak Topic Flagged">Weak Topic Flagged</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
                <th className="py-3 px-space-md">Problem / ID</th>
                <th className="py-3 px-space-md">Platform &amp; Topic</th>
                <th className="py-3 px-space-md">Difficulty</th>
                <th className="py-3 px-space-md">Solve Telemetry</th>
                <th className="py-3 px-space-md">Revision Cadence</th>
                <th className="py-3 px-space-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/20 font-body-md text-body-md">
              {filteredProblems.map((prob) => {
                const diffColor =
                  prob.difficulty === 'Hard'
                    ? 'bg-secondary-container/40 text-secondary'
                    : prob.difficulty === 'Medium'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-tertiary/20 text-tertiary';

                return (
                  <tr key={prob.id} className="hover:bg-surface-container transition-colors">
                    <td className="py-3 px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">terminal</span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {prob.title}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline pl-6 font-mono">
                        {prob.codeId} • {prob.concept}
                      </span>
                    </td>
                    <td className="py-3 px-space-md">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-medium font-mono">
                        {prob.platform}
                      </span>
                      <span className="ml-1 text-on-surface-variant font-label-sm text-label-sm">{prob.topic}</span>
                    </td>
                    <td className="py-3 px-space-md">
                      <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold font-mono ${diffColor}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-space-md">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-label-sm text-label-sm font-semibold font-mono ${
                            prob.solveMode.includes('Editorial') || prob.solveMode.includes('Repeat')
                              ? 'text-error'
                              : 'text-tertiary'
                          }`}
                        >
                          {prob.solveMode}
                        </span>
                        <span className="text-outline">•</span>
                        <span className="font-stat-numeric text-label-sm text-on-surface font-medium font-mono">
                          {prob.solveTimeMins} mins
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline font-mono">{prob.complexity}</span>
                    </td>
                    <td className="py-3 px-space-md">
                      <span
                        className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold font-mono ${
                          prob.cadenceUrgent
                            ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                            : 'bg-tertiary/10 text-tertiary'
                        }`}
                      >
                        {prob.revisionCadence}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedNotesProblem(prob)}
                          className="p-1 rounded hover:bg-surface-container-highest text-secondary cursor-pointer"
                          title="View Complexity Notes"
                        >
                          <span className="material-symbols-outlined text-[18px]">description</span>
                        </button>
                        <button
                          onClick={() => alert(`Launching Sandbox IDE container for ${prob.title}...`)}
                          className="p-1 rounded hover:bg-surface-container-highest text-primary cursor-pointer"
                          title="Launch Sandbox Code Editor"
                        >
                          <span className="material-symbols-outlined text-[18px]">code</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex items-center justify-between pt-space-md font-label-sm text-label-sm text-on-surface-variant font-mono flex-wrap gap-2 border-t border-surface-container-highest/20 mt-2">
          <span>Showing {filteredProblems.length} of 184 logged problems (14 queued for immediate revision)</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded bg-surface-container text-on-surface opacity-50 cursor-not-allowed">
              ← Previous
            </button>
            <span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface font-bold">Page 1 of 46</span>
            <button className="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-bright cursor-pointer">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* CONTEST HISTORY & PERFORMANCE ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-lg">
        {/* LeetCode Contest Rating Curve (8 Cols) */}
        <div className="lg:col-span-8 p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-surface-container-highest/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">show_chart</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  LeetCode Rating Trajectory (Last 10 Contests)
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Peak Rating: 1,682 • Guardian Target: 2,150 • Current Division: Top 18%
              </p>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm font-mono">
              <span className="flex items-center gap-1 text-secondary font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />Rating Curve
              </span>
              <span className="flex items-center gap-1 text-tertiary font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />Rank Velocity
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full my-space-md relative overflow-x-auto">
            <svg className="w-full h-48 min-w-[500px]" fill="none" viewBox="0 0 700 160">
              <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="700" y1="20" y2="20" />
              <text className="text-outline font-stat-numeric text-[10px]" fill="currentColor" x="5" y="16">1700</text>
              <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="700" y1="60" y2="60" />
              <text className="text-outline font-stat-numeric text-[10px]" fill="currentColor" x="5" y="56">1650</text>
              <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="700" y1="100" y2="100" />
              <text className="text-outline font-stat-numeric text-[10px]" fill="currentColor" x="5" y="96">1600</text>
              <line className="text-surface-container-highest" stroke="currentColor" strokeDasharray="3 3" x1="0" x2="700" y1="140" y2="140" />
              <text className="text-outline font-stat-numeric text-[10px]" fill="currentColor" x="5" y="136">1550</text>

              <defs>
                <linearGradient id="neonVioletGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 40 135 L 110 128 L 180 115 L 250 122 L 320 95 L 390 102 L 460 78 L 530 65 L 600 52 L 670 34 L 670 155 L 40 155 Z"
                fill="url(#neonVioletGrad)"
              />
              <path
                d="M 40 135 L 110 128 L 180 115 L 250 122 L 320 95 L 390 102 L 460 78 L 530 65 L 600 52 L 670 34"
                stroke="#C084FC"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />

              <circle cx="40" cy="135" fill="#C084FC" r="3.5" />
              <circle cx="110" cy="128" fill="#C084FC" r="3.5" />
              <circle cx="180" cy="115" fill="#C084FC" r="3.5" />
              <circle cx="250" cy="122" fill="#C084FC" r="3.5" />
              <circle cx="320" cy="95" fill="#C084FC" r="3.5" />
              <circle cx="390" cy="102" fill="#C084FC" r="3.5" />
              <circle cx="460" cy="78" fill="#C084FC" r="3.5" />
              <circle cx="530" cy="65" fill="#C084FC" r="3.5" />
              <circle cx="600" cy="52" fill="#C084FC" r="3.5" />
              <circle cx="670" cy="34" fill="#A855F7" fillOpacity="0.4" r="7" />
              <circle cx="670" cy="34" fill="#F8FAFC" r="4" stroke="#A855F7" strokeWidth="2" />
            </svg>

            <div className="flex justify-between font-label-sm text-label-sm text-outline px-4 pt-1 font-mono">
              <span>W372 (1,560)</span>
              <span>W374</span>
              <span>BW121</span>
              <span>W378</span>
              <span>W380 (1,610)</span>
              <span>BW125</span>
              <span>W384</span>
              <span>BW128</span>
              <span>W388</span>
              <span className="text-secondary font-bold">W392 (1,682)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-space-xs font-label-md text-label-md border-t border-surface-container-highest/30">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-on-surface-variant font-mono">Last Contest: <span className="text-on-surface font-semibold">Weekly 392</span></span>
              <span className="text-on-surface-variant font-mono">Rank: <span className="text-on-surface font-semibold">3,124 / 28,400</span></span>
              <span className="text-tertiary font-semibold font-mono">+38 Rating Gain</span>
            </div>
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noreferrer"
              className="text-secondary hover:underline flex items-center gap-1 font-label-sm text-label-sm font-mono"
            >
              <span>Verify On LeetCode</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Weekly Practice Volume & Accuracy (4 Cols) */}
        <div className="lg:col-span-4 p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between border border-surface-container-highest/20">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Weekly Problem Velocity</h3>
              <span className="font-stat-numeric text-stat-numeric text-secondary font-bold font-mono">28</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline mb-space-md font-mono">
              Solved across last 7 days (Target: 25)
            </p>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1 font-mono">
                  <span>Mon (Arrays / Recursion)</span>
                  <span className="font-stat-numeric text-on-surface font-semibold">5 problems</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1 font-mono">
                  <span>Tue (Binary Search)</span>
                  <span className="font-stat-numeric text-on-surface font-semibold">4 problems</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1 font-mono">
                  <span>Wed (Linked Lists)</span>
                  <span className="font-stat-numeric text-on-surface font-semibold">6 problems</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1 font-mono">
                  <span>Thu (Binary Trees)</span>
                  <span className="font-stat-numeric text-on-surface font-semibold">3 problems</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1 font-mono">
                  <span>Fri (DP Drill)</span>
                  <span className="font-stat-numeric text-on-surface font-semibold">4 problems</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1 font-mono">
                  <span>Sat &amp; Sun (Contest + Virtuals)</span>
                  <span className="font-stat-numeric text-secondary font-bold">6 problems</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-lowest mt-space-md flex items-center justify-between font-label-md text-label-md border border-surface-container-highest/20 font-mono">
            <span className="text-on-surface-variant">First-Submission AC Rate</span>
            <span className="font-stat-numeric text-tertiary font-bold">78.4%</span>
          </div>
        </div>
      </div>

      {/* Problem Notes Modal */}
      {selectedNotesProblem && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-low max-w-md w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-highest">
            <div className="flex items-center justify-between border-b border-surface-container-highest/30 pb-2">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Complexity Invariant</h3>
              </div>
              <button
                onClick={() => setSelectedNotesProblem(null)}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {selectedNotesProblem.title} ({selectedNotesProblem.codeId})
              </div>
              <div className="text-on-surface-variant font-label-sm text-label-sm font-mono mt-0.5">
                {selectedNotesProblem.platform} • {selectedNotesProblem.topic}
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl font-mono text-body-sm text-on-surface border border-surface-container-highest/20 leading-relaxed">
              {selectedNotesProblem.notes}
            </div>
            <div className="flex items-center justify-between font-mono font-label-sm text-label-sm text-outline">
              <span>Time: {selectedNotesProblem.complexity}</span>
              <span className="text-secondary font-semibold">{selectedNotesProblem.revisionCadence}</span>
            </div>
          </div>
        </div>
      )}

      {/* Log Problem Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleLogSubmit}
            className="w-full max-w-lg bg-surface-container-low rounded-xl shadow-2xl p-space-md sm:p-space-lg flex flex-col gap-space-md border border-surface-container-highest"
          >
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">playlist_add</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Log Solved DSA Problem</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-space-sm font-body-sm text-body-sm">
              <div>
                <label className="block font-label-sm text-label-sm uppercase text-outline mb-1 font-semibold font-mono">
                  Problem Title &amp; Identifier
                </label>
                <input
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none border border-surface-container-highest"
                  placeholder="e.g. Word Break II (#140)"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-outline mb-1 font-semibold font-mono">
                    Platform
                  </label>
                  <select
                    value={logPlatform}
                    onChange={(e) => setLogPlatform(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-container-highest cursor-pointer font-mono"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="CodeChef">CodeChef</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-outline mb-1 font-semibold font-mono">
                    Difficulty
                  </label>
                  <select
                    value={logDifficulty}
                    onChange={(e) => setLogDifficulty(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-container-highest cursor-pointer font-mono"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-outline mb-1 font-semibold font-mono">
                    Solve Mode
                  </label>
                  <select
                    value={logSolveMode}
                    onChange={(e) => setLogSolveMode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-container-highest cursor-pointer font-mono"
                  >
                    <option>Independent (&lt; 30m)</option>
                    <option>With Editorial / Hint</option>
                    <option>Repeat Review Attempt</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm uppercase text-outline mb-1 font-semibold font-mono">
                    Time Spent (Mins)
                  </label>
                  <input
                    value={logTimeMins}
                    onChange={(e) => setLogTimeMins(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none border border-surface-container-highest font-mono"
                    placeholder="25"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase text-outline mb-1 font-semibold font-mono">
                  Algorithmic Key Takeaways &amp; Invariants
                </label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none border border-surface-container-highest font-mono"
                  placeholder="Key recurrence: dp[i] = min(dp[i - coin] + 1). Notice edge cases when coin > target..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-highest/20">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-bright cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-container cursor-pointer"
              >
                Save Problem to Queue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Problem Stopwatch Drawer */}
      {showStopwatchModal && (
        <div className="fixed bottom-6 right-6 w-80 bg-surface-container-high/95 backdrop-blur-xl p-space-md rounded-xl shadow-2xl z-50 border border-surface-container-highest">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">timer</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Problem Timer</span>
            </div>
            <button onClick={onToggleStopwatchModal} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="text-center py-2 my-space-sm">
            <span className="font-stat-numeric text-[36px] leading-tight text-on-surface font-bold tracking-wider font-mono">
              {formatStopwatchTime(stopwatchSeconds)}
            </span>
            <span className="block font-label-sm text-label-sm text-outline mt-1 font-mono">
              Target benchmark: &lt; 35m
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleStopwatch}
              className="flex-1 py-1.5 rounded-lg bg-secondary text-on-secondary font-headline-sm text-headline-sm font-semibold hover:bg-secondary-fixed transition-all cursor-pointer"
            >
              {isStopwatchRunning ? 'Pause' : 'Start / Resume'}
            </button>
            <button
              onClick={onResetStopwatch}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-bright transition-all cursor-pointer font-mono"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
