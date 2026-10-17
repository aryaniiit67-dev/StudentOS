import React, { useState } from 'react';
import { WorkspaceView } from '../types.ts';

export const DevelopmentView: React.FC<{ onOpenFocusModal: () => void }> = ({ onOpenFocusModal }) => {
  const [activeTab, setActiveTab] = useState<'sprints' | 'repos' | 'cicd'>('sprints');

  return (
    <div className="flex flex-col gap-space-lg pb-12 w-full">
      <div className="rounded-xl bg-surface-container-low p-space-lg shadow-xl border border-surface-container-highest/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-label-sm text-tertiary">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
            <span>GIT SYNC ACTIVE • 14 COMMITS THIS WEEK</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">Development Sprint Board</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Active repositories, CI/CD automated test telemetry, Docker environments, and software architecture sprints.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFocusModal}
            className="px-space-md py-2 rounded-lg bg-tertiary text-on-tertiary font-headline-sm text-headline-sm font-semibold hover:bg-tertiary-fixed transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span>Start Coding Sprint</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="text-on-surface-variant font-label-sm uppercase font-mono">StudentOS Core</div>
          <div className="font-stat-numeric text-stat-numeric text-tertiary font-bold my-1">feat/auth-v2</div>
          <div className="text-body-sm text-on-surface-variant">88.4% Unit Test Cov • 1 PR Open</div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="text-on-surface-variant font-label-sm uppercase font-mono">Distributed LMS</div>
          <div className="font-stat-numeric text-stat-numeric text-primary font-bold my-1">72% Milestone</div>
          <div className="text-body-sm text-on-surface-variant">Go Microservices + Redis Cluster</div>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="text-on-surface-variant font-label-sm uppercase font-mono">Compiler AST Lab</div>
          <div className="font-stat-numeric text-stat-numeric text-secondary font-bold my-1">Ready for PR</div>
          <div className="text-body-sm text-on-surface-variant">Lexer + Parser in Rust • 100% Passing</div>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-low p-space-lg border border-surface-container-highest/20 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/20">
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Active Pull Requests &amp; CI/CD</h3>
          <span className="font-mono text-label-sm text-tertiary px-2 py-0.5 rounded bg-tertiary/10 font-bold">All Workflows Passing</span>
        </div>
        <div className="divide-y divide-surface-container-highest/20 font-body-sm">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">merge_type</span>
              <div>
                <div className="font-semibold text-on-surface">#42: Add Redis Blacklist for Revoked JWTs</div>
                <div className="font-mono text-outline text-[11px]">studentos-backend • by alexchen (2h ago)</div>
              </div>
            </div>
            <span className="font-mono text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-tertiary">CI Passed (1m 20s)</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">commit</span>
              <div>
                <div className="font-semibold text-on-surface">#41: Optimize Deadlock Graph Cycle Detection</div>
                <div className="font-mono text-outline text-[11px]">os-kernel-sim • merged yesterday</div>
              </div>
            </div>
            <span className="font-mono text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">Merged</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LifeHealthView: React.FC = () => {
  const [waterCups, setWaterCups] = useState(6); // 6 * 250ml = 1.5L
  const [workoutDone, setWorkoutDone] = useState(true);

  return (
    <div className="flex flex-col gap-space-lg pb-12 w-full">
      <div className="rounded-xl bg-surface-container-low p-space-lg shadow-xl border border-surface-container-highest/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-label-sm text-primary-fixed">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
            <span>BIOMETRICS &amp; HABIT ENGINE</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">Life, Wellness &amp; Bio Logger</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Sustaining engineering cognitive velocity through strictly non-negotiable circadian rest, hydration, and gym stamina.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-surface-container-highest/20 text-center">
            <div className="text-[10px] text-on-surface-variant">SLEEP SCORE</div>
            <div className="text-headline-sm text-tertiary font-bold">89 / 100</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-label-sm text-on-surface-variant">Sleep Duration</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">bedtime</span>
          </div>
          <div className="font-stat-numeric text-stat-numeric text-tertiary font-bold my-1 font-mono">7h 15m</div>
          <div className="text-body-sm text-on-surface-variant font-mono">Deep: 1h 48m • Restful</div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-label-sm text-on-surface-variant">Water Intake</span>
            <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
          </div>
          <div className="font-stat-numeric text-stat-numeric text-primary font-bold my-1 font-mono">
            {(waterCups * 0.25).toFixed(1)}L / 3.0L
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setWaterCups(Math.min(12, waterCups + 1))}
              className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[11px] font-mono font-bold cursor-pointer"
            >
              +250ml
            </button>
            <span className="text-[11px] text-on-surface-variant font-mono">{waterCups}/12 glasses</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-label-sm text-on-surface-variant">Workout Streak</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">fitness_center</span>
          </div>
          <div className="font-stat-numeric text-stat-numeric text-secondary font-bold my-1 font-mono">Day 6</div>
          <div className="text-body-sm text-on-surface-variant font-mono">Push Day: Bench &amp; Overhead</div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-label-sm text-on-surface-variant">Monthly Burn</span>
            <span className="material-symbols-outlined text-on-surface text-[18px]">payments</span>
          </div>
          <div className="font-stat-numeric text-stat-numeric text-on-surface font-bold my-1 font-mono">$340</div>
          <div className="text-body-sm text-tertiary font-mono">$160 under $500 cap</div>
        </div>
      </div>
    </div>
  );
};

export const TasksDeadlinesView: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Deadlock avoidance graph implementation', course: 'CS302', due: 'In 2 days', urgent: true, done: false },
    { id: 2, title: 'Fourier boundary problem set 3.2', course: 'CS301', due: 'In 4 days', urgent: true, done: false },
    { id: 3, title: 'Relational algebra BCNF lab sheet', course: 'CS303', due: 'In 7 days', urgent: false, done: false },
    { id: 4, title: 'Planar graph Euler characteristic proof', course: 'CS305', due: 'In 9 days', urgent: false, done: false },
    { id: 5, title: 'Packet Tracer subnet routing lab', course: 'CS304', due: 'In 14 days', urgent: false, done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="flex flex-col gap-space-lg pb-12 w-full">
      <div className="rounded-xl bg-surface-container-low p-space-lg shadow-xl border border-surface-container-highest/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-label-sm text-error">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span>CRITICAL MILESTONES • SEMESTER 3</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">Unified Tasks &amp; Deadlines</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Cross-subject milestone synchronization ensuring zero missed assignments and timely midterm preparedness.
          </p>
        </div>
      </div>

      <div className="p-space-md sm:p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/20 shadow-md">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-space-sm rounded-lg flex items-center justify-between transition-all cursor-pointer border ${
                task.done
                  ? 'bg-surface-container/40 border-transparent opacity-60'
                  : 'bg-surface-container-high border-surface-container-highest/20 hover:border-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[13px] ${
                    task.done ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {task.done ? '✓' : ''}
                </div>
                <div>
                  <div className={`font-semibold ${task.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                    {task.title}
                  </div>
                  <div className="text-label-sm text-on-surface-variant font-mono">
                    {task.course} • <span className={task.urgent ? 'text-error font-bold' : ''}>{task.due}</span>
                  </div>
                </div>
              </div>
              <span className={`font-mono text-label-sm px-2 py-0.5 rounded ${task.urgent ? 'bg-error-container text-on-error-container font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
                {task.done ? 'Completed' : task.urgent ? 'Urgent' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AnalyticsCgpaView: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-lg pb-12 w-full">
      <div className="rounded-xl bg-surface-container-low p-space-lg shadow-xl border border-surface-container-highest/20">
        <div className="flex items-center gap-2 font-mono text-label-sm text-primary">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>STATISTICAL COHORT STANDING</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">Analytics &amp; CGPA Engine</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
          Historical grade progression, percentile standing, credit weighting distribution, and graduation target forecasting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20 font-mono">
          <span className="text-label-sm text-on-surface-variant block uppercase">Cumulative CGPA</span>
          <span className="text-stat-numeric text-stat-numeric text-primary font-bold">8.42</span>
          <span className="text-label-sm text-tertiary block mt-1">+0.18 vs Semester 2</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20 font-mono">
          <span className="text-label-sm text-on-surface-variant block uppercase">Cohort Percentile</span>
          <span className="text-stat-numeric text-stat-numeric text-secondary font-bold">Top 8.8%</span>
          <span className="text-label-sm text-on-surface-variant block mt-1">Engineering Rank: 18 / 205</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-highest/20 font-mono">
          <span className="text-label-sm text-on-surface-variant block uppercase">Total Credits Cleared</span>
          <span className="text-stat-numeric text-stat-numeric text-tertiary font-bold">44 / 160</span>
          <span className="text-label-sm text-on-surface-variant block mt-1">22 in progress this term</span>
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-lg pb-12 w-full">
      <div className="rounded-xl bg-surface-container-low p-space-lg shadow-xl border border-surface-container-highest/20">
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">StudentOS System Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Local data encrypted vault, notification preferences, university API connectors, and theme configurations.
        </p>
      </div>

      <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-highest/20 flex flex-col gap-4 font-body-sm">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/20">
          <div>
            <div className="font-semibold text-on-surface">Offline-First Encrypted Vault</div>
            <div className="text-on-surface-variant text-[11px] font-mono">Synchronized with local storage and Web Crypto sandbox</div>
          </div>
          <span className="px-2 py-1 rounded bg-tertiary-container/30 text-tertiary font-mono text-label-sm font-bold">
            SECURE: ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/20">
          <div>
            <div className="font-semibold text-on-surface">Circadian Sleep Guardrail (7h 30m)</div>
            <div className="text-on-surface-variant text-[11px] font-mono">Prevents AI schedule engine from scheduling past sleep boundary</div>
          </div>
          <span className="px-2 py-1 rounded bg-primary-container/30 text-primary font-mono text-label-sm font-bold">
            ENFORCED
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-on-surface">Export Telemetry &amp; Syllabus JSON</div>
            <div className="text-on-surface-variant text-[11px] font-mono">Backup your problem solves, assessments, and study logs</div>
          </div>
          <button
            onClick={() => alert('StudentOS database snapshot exported to JSON.')}
            className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-mono font-semibold cursor-pointer"
          >
            Export Backup
          </button>
        </div>
      </div>
    </div>
  );
};
