import React, { useState } from 'react';
import { AssessmentRow, CourseMatrixItem } from '../types.ts';
import {
  calculateWeightedAssessments,
  calculateTargetFeasibility,
  calculateLiveSgpa,
} from '../utils/academicMath.ts';
import { INITIAL_ASSESSMENT_ROWS, INITIAL_COURSE_MATRIX } from '../data/mockData.ts';

export const AcademicsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deepdive' | 'cgpa' | 'deadlines' | 'notes'>('deepdive');
  const [selectedSemester, setSelectedSemester] = useState('sem3');
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Deep dive assessment inputs
  const [assessments, setAssessments] = useState<AssessmentRow[]>(INITIAL_ASSESSMENT_ROWS);

  // Target SGPA slider for CGPA calculator
  const [targetCgpa, setTargetCgpa] = useState<number>(9.0);

  // Credit matrix for CGPA calculator
  const [courseMatrix, setCourseMatrix] = useState<CourseMatrixItem[]>(INITIAL_COURSE_MATRIX);

  // Add course modal
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);

  // Calculations
  const assessmentResult = calculateWeightedAssessments(
    assessments.map((a) => ({ score: a.score, max: a.max, weight: a.weight }))
  );

  const feasibilityResult = calculateTargetFeasibility(8.24, 44, targetCgpa, 44);

  const simulatedSgpa = calculateLiveSgpa(
    courseMatrix.map((c) => ({ credits: c.credits, gradePoint: c.gradePoint }))
  );

  const handleScoreChange = (id: string, newScore: number) => {
    setAssessments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score: Number(newScore) || 0 } : item))
    );
  };

  const handleGradePointChange = (id: string, newGp: number) => {
    setCourseMatrix((prev) =>
      prev.map((c) => (c.id === id ? { ...c, gradePoint: Number(newGp) } : c))
    );
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 600);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) return;
    const newCourse: CourseMatrixItem = {
      id: 'c-custom-' + Date.now(),
      code: newCourseCode.trim(),
      name: newCourseName.trim(),
      credits: Number(newCourseCredits) || 3,
      gradePoint: 9.0,
    };
    setCourseMatrix((prev) => [...prev, newCourse]);
    setShowAddCourseModal(false);
    setNewCourseCode('');
    setNewCourseName('');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-space-xl">
      {/* Atmospheric Glow Effect & Header Banner */}
      <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-low p-space-md sm:p-space-lg shadow-xl border border-surface-container-highest/20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-24 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />

        {/* Workspace Header Top Line */}
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase tracking-wider font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Academic Ops Terminal
              </span>
              <span className="text-on-surface-variant font-label-sm text-label-sm font-mono">• Engineering Faculty</span>
            </div>
            <div className="flex items-center gap-space-sm mt-0.5">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Academics Workspace</h1>
              <span className="px-2 py-0.5 rounded bg-primary-container/30 text-primary font-label-md text-label-md font-mono">
                Active Sync
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Deterministic syllabus tracking, grade forecasting algorithms, and attendance telemetry for STEM curriculum mastery.
            </p>
          </div>

          {/* Semester Selector & Progress */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md bg-surface-container-lowest/80 p-space-sm rounded-xl backdrop-blur-md shadow-inner border border-surface-container-highest/20">
            <div className="flex items-center gap-space-sm px-space-sm py-1.5 bg-surface-container-high rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_clock</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer pr-space-sm"
                id="semesterSelect"
                aria-label="Select Semester"
              >
                <option className="bg-surface-container-high text-on-surface" value="sem3">
                  Semester 3 (Fall 2024)
                </option>
                <option className="bg-surface-container-high text-on-surface" value="sem2">
                  Semester 2 (Spring 2024)
                </option>
                <option className="bg-surface-container-high text-on-surface" value="sem1">
                  Semester 1 (Fall 2023)
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1 px-space-sm min-w-[170px]">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant">Term Timeline</span>
                <span className="font-stat-numeric text-primary font-semibold font-mono">Week 9 of 16 (58%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-700"
                  style={{ width: '58%' }}
                />
              </div>
            </div>

            <button
              onClick={handleRecalculate}
              className="flex items-center justify-center gap-1 px-space-md py-2 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRecalculating ? 'animate-spin' : ''}`}>
                sync_alt
              </span>
              <span>{isRecalculating ? 'Recalculating...' : 'Recalculate'}</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Telemetry Bar */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mt-space-lg pt-space-md border-t border-surface-container-highest/20">
          {/* Metric 1 */}
          <div className="flex flex-col p-space-md rounded-xl bg-surface-container/70 shadow-md border border-surface-container-highest/20">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
              <span>Overall Syllabus</span>
              <span className="text-primary font-body-sm font-medium">Target 60%</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <span className="font-stat-numeric text-stat-numeric text-on-surface font-mono">64%</span>
              <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-0.5 font-mono">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +4% vs pacing
              </span>
            </div>
            <div className="w-full h-1 mt-2.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '64%' }} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col p-space-md rounded-xl bg-surface-container/70 shadow-md border border-surface-container-highest/20">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
              <span>Attendance Ratio</span>
              <span className="text-tertiary font-body-sm font-medium">Safe (&gt;75%)</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <span className="font-stat-numeric text-stat-numeric text-on-surface font-mono">88.4%</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-stat-numeric font-mono">38/43 Classes</span>
            </div>
            <div className="w-full h-1 mt-2.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-tertiary rounded-full" style={{ width: '88.4%' }} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col p-space-md rounded-xl bg-surface-container/70 shadow-md border border-surface-container-highest/20">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
              <span>Est. Semester SGPA</span>
              <span className="text-secondary font-body-sm font-medium font-mono">22 Credits</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <span className="font-stat-numeric text-stat-numeric text-secondary font-semibold font-mono">8.65</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Class Percentile ~91%</span>
            </div>
            <div className="w-full h-1 mt-2.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '86.5%' }} />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col p-space-md rounded-xl bg-surface-container/70 shadow-md border border-surface-container-highest/20">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
              <span>Pending Deliverables</span>
              <span className="text-error font-body-sm font-medium font-mono">Upcoming 14d</span>
            </div>
            <div className="flex items-baseline justify-between mt-space-xs">
              <span className="font-stat-numeric text-stat-numeric text-on-surface font-mono">5 Total</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">2 Midterms • 3 Assign.</span>
            </div>
            <div className="w-full h-1 mt-2.5 rounded-full bg-surface-container-highest overflow-hidden flex">
              <div className="h-full bg-error rounded-l-full" style={{ width: '40%' }} />
              <div className="h-full bg-primary-container" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Course Telemetry & Management Grid */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">grid_view</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Active Subject Registry</h2>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-stat-numeric font-mono">
              {courseMatrix.length} Courses Enrolled
            </span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error" /> Urgent Attention
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary" /> On Schedule
            </span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
          {/* Card 1: CS301 Mathematics III */}
          <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low shadow-lg relative group overflow-hidden border border-surface-container-highest/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error to-error-container" />
            <div>
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container/30 text-error font-semibold inline-flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" /> High Attention Required
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1.5">CS301: Mathematics III</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Advanced Calculus &amp; Transforms • Dr. Rajesh Sharma
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-stat-numeric font-mono">
                    4 Credits
                  </span>
                </div>
              </div>

              {/* Micro Metric Split */}
              <div className="grid grid-cols-2 gap-space-sm mt-space-md p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Syllabus Completion</span>
                  <span className="font-stat-numeric text-[20px] text-on-surface font-mono">45%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block">Mod 1-2 Done, Mod 3 Incompl.</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Attendance</span>
                  <span className="font-stat-numeric text-[20px] text-primary font-mono">82.1%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">23/28 Classes Attended</span>
                </div>
              </div>

              {/* Assessment Progression */}
              <div className="mt-space-md flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Assessment Recovery</span>
                  <span className="text-tertiary font-stat-numeric font-semibold font-mono">+50% pts (+200% rel)</span>
                </div>
                <div className="p-space-xs rounded bg-surface-container flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">
                    Test 1: <strong className="text-error font-stat-numeric font-mono">2.5/10 (25%)</strong>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-tertiary">arrow_forward</span>
                  <span className="text-on-surface-variant">
                    Test 2: <strong className="text-tertiary font-stat-numeric font-mono">15/20 (75%)</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
              <div className="flex items-center gap-1 font-body-sm text-body-sm text-error">
                <span className="material-symbols-outlined text-[16px]">alarm</span>
                <span>Midterm in 12 days</span>
              </div>
              <button
                onClick={() => setActiveTab('deepdive')}
                className="font-label-md text-label-md px-2.5 py-1 rounded bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-semibold cursor-pointer"
              >
                Deep Dive
              </button>
            </div>
          </div>

          {/* Card 2: CS302 Operating Systems */}
          <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low shadow-lg relative overflow-hidden border border-surface-container-highest/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div>
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-semibold font-mono">
                    Kernel &amp; Core Systems
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1.5">CS302: Operating Systems</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Kernel Architecture &amp; Memory • Prof. Vance Gray
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-stat-numeric font-mono">
                    4 Credits
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-sm mt-space-md p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Syllabus Completion</span>
                  <span className="font-stat-numeric text-[20px] text-on-surface font-mono">70%</span>
                  <span className="font-body-sm text-[11px] text-tertiary block font-mono">Paging &amp; Scheduling OK</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Attendance</span>
                  <span className="font-stat-numeric text-[20px] text-tertiary font-mono">92.0%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">Excellent Standing</span>
                </div>
              </div>
              <div className="mt-space-md flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Performance Velocity</span>
                  <span className="text-primary font-stat-numeric font-mono">Avg: 88%</span>
                </div>
                <div className="h-9 w-full bg-surface-container rounded flex items-center px-2">
                  <svg className="w-full h-6 text-primary" preserveAspectRatio="none" viewBox="0 0 100 24">
                    <path
                      d="M0,18 L20,15 L40,8 L60,12 L80,5 L100,2"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <circle cx="100" cy="2" fill="currentColor" r="3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
              <div className="flex items-center gap-1 font-body-sm text-body-sm text-secondary">
                <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                <span>Lab: Deadlock Sim. due Friday</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-on-surface font-stat-numeric font-mono">
                Stable
              </span>
            </div>
          </div>

          {/* Card 3: CS303 DBMS & SQL */}
          <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low shadow-lg relative overflow-hidden border border-surface-container-highest/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary" />
            <div>
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-semibold font-mono">
                    High Performance
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1.5">CS303: DBMS &amp; SQL</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Relational Algebra &amp; Storage • Dr. Aris Thorne
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-stat-numeric font-mono">
                    4 Credits
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-sm mt-space-md p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Syllabus Completion</span>
                  <span className="font-stat-numeric text-[20px] text-tertiary font-mono">80%</span>
                  <span className="font-body-sm text-[11px] text-tertiary block font-mono">B+ Trees In Progress</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Attendance</span>
                  <span className="font-stat-numeric text-[20px] text-tertiary font-mono">95.0%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">Top 5% in Cohort</span>
                </div>
              </div>
              <div className="mt-space-md flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Recent Evaluation</span>
                  <span className="text-tertiary font-stat-numeric font-mono">90% Score</span>
                </div>
                <div className="p-space-xs rounded bg-surface-container flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface">SQL Indexing Quiz</span>
                  <span className="font-stat-numeric text-tertiary font-semibold font-mono">18 / 20</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
              <div className="flex items-center gap-1 font-body-sm text-body-sm text-tertiary">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>All assignments clear</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-tertiary font-stat-numeric font-mono">
                Grade A+ (Est)
              </span>
            </div>
          </div>

          {/* Card 4: CS304 Computer Networks */}
          <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low shadow-lg relative overflow-hidden border border-surface-container-highest/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
            <div>
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold font-mono">
                    Network Stack
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1.5">CS304: Computer Networks</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    OSI &amp; TCP/IP Layering • Prof. Leila Zhang
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-stat-numeric font-mono">
                    3 Credits
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-sm mt-space-md p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Syllabus Completion</span>
                  <span className="font-stat-numeric text-[20px] text-on-surface font-mono">60%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">Transport Layer Active</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Attendance</span>
                  <span className="font-stat-numeric text-[20px] text-primary font-mono">84.0%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">Buffer: 3 misses left</span>
                </div>
              </div>
              <div className="mt-space-md flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Upcoming Gate</span>
                  <span className="text-primary font-stat-numeric font-mono">30% Weight</span>
                </div>
                <div className="p-space-xs rounded bg-surface-container flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface">Midterm Examination</span>
                  <span className="font-stat-numeric text-primary font-semibold font-mono">In 16 days</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
              <div className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">wifi_tethering</span>
                <span>Packet Tracer Lab #3</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-on-surface font-stat-numeric font-mono">
                Grade B+
              </span>
            </div>
          </div>

          {/* Card 5: CS305 Discrete Math */}
          <div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low shadow-lg relative overflow-hidden border border-surface-container-highest/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
            <div>
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary font-semibold font-mono">
                    Graph &amp; Combinatorics
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1.5">CS305: Discrete Math</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Structures &amp; Logic • Dr. Maya Patel
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-stat-numeric font-mono">
                    3 Credits
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-sm mt-space-md p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Syllabus Completion</span>
                  <span className="font-stat-numeric text-[20px] text-on-surface font-mono">55%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">Graph Theory Active</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Attendance</span>
                  <span className="font-stat-numeric text-[20px] text-primary font-mono">86.0%</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block font-mono">Safe threshold</span>
                </div>
              </div>
              <div className="mt-space-md flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Active Problem Set</span>
                  <span className="text-secondary font-stat-numeric font-mono">PSet 4</span>
                </div>
                <div className="p-space-xs rounded bg-surface-container flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface">Isomorphism Proofs</span>
                  <span className="font-stat-numeric text-secondary font-semibold font-mono">Due Sun 23:59</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
              <div className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Proof submission pending</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-highest text-on-surface font-stat-numeric font-mono">
                Grade A
              </span>
            </div>
          </div>

          {/* Quick Add / Course Utility Action Slot */}
          <div
            onClick={() => setShowAddCourseModal(true)}
            className="flex flex-col items-center justify-center p-space-lg rounded-xl bg-surface-container-lowest/60 text-center gap-space-sm shadow-inner hover:bg-surface-container-low transition-colors group cursor-pointer border border-dashed border-surface-container-highest"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">post_add</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Enroll Elective or Audit</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Import syllabus PDF or connect university portal
              </span>
            </div>
            <span className="font-label-sm text-label-sm px-3 py-1 rounded bg-surface-container-high text-primary font-medium mt-1 font-mono">
              + Add Course Unit
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Detailed Interactive Tabs Architecture */}
      <div className="flex flex-col gap-space-md mt-space-md">
        {/* Tab Controls Header */}
        <div className="flex items-center justify-between flex-wrap gap-space-sm border-b-0 pb-1">
          <div className="flex items-center gap-1 p-1 bg-surface-container-lowest rounded-xl shadow-inner border border-surface-container-highest/20 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('deepdive')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'deepdive'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Deep Dive: Mathematics III</span>
            </button>

            <button
              onClick={() => setActiveTab('cgpa')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'cgpa'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calculate</span>
              <span>CGPA &amp; Grade Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('deadlines')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'deadlines'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              <span>Deadlines &amp; Labs</span>
              <span className="px-1.5 py-0.2 rounded-full bg-error text-on-error font-stat-numeric text-[10px] font-mono">
                3
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">folder_open</span>
              <span>Study Notes &amp; Blueprints</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant font-mono">
            <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
            <span>Auto-saved to Local Vault • Encrypted</span>
          </div>
        </div>

        {/* TAB 1: Subject Deep Dive (Mathematics III) */}
        {activeTab === 'deepdive' && (
          <div className="flex flex-col gap-space-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Module Breakdown Column */}
              <div className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-low p-space-md sm:p-space-lg rounded-xl shadow-md border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Module Blueprint</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Curriculum unit status &amp; comprehension
                    </p>
                  </div>
                  <span className="font-stat-numeric text-primary text-body-md font-semibold font-mono">
                    2 / 4 Cleared
                  </span>
                </div>

                {/* Module Item 1 */}
                <div className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                      <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                        Module 1: Fourier Series
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-semibold font-mono">
                      Mastered
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Periodic functions, Dirichlet's condition, Half-range expansions.
                  </p>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-full" />
                  </div>
                </div>

                {/* Module Item 2 */}
                <div className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">history_edu</span>
                      <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                        Module 2: Fourier Transforms
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary/10 text-secondary font-semibold font-mono">
                      Revision Req.
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fourier integral theorem, complex form, convolution properties.
                  </p>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-3/4" />
                  </div>
                </div>

                {/* Module Item 3 */}
                <div className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">pending</span>
                      <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                        Module 3: Laplace Transforms
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold font-mono">
                      Learning (2 left)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Inverse transforms, unit step functions, differential eq solving.
                  </p>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/5" />
                  </div>
                </div>

                {/* Module Item 4 */}
                <div className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container-lowest opacity-75 border border-surface-container-highest/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        radio_button_unchecked
                      </span>
                      <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                        Module 4: Partial Differential Eq.
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-semibold font-mono">
                      Not Started
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Wave equations, heat equations, separation of variables method.
                  </p>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-surface-container-high w-0" />
                  </div>
                </div>

                {/* Attendance Advisory Card */}
                <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-space-sm border border-surface-container-highest/20">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Attendance Guardrail Telemetry
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                      Attended <strong className="text-on-surface font-stat-numeric">23 of 28</strong> classes (
                      <strong className="text-primary font-stat-numeric">82.1%</strong>). You can miss exactly{' '}
                      <strong className="text-tertiary font-semibold">2 more classes</strong> while maintaining the statutory
                      75% examination threshold.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Assessment Calculator Column */}
              <div className="lg:col-span-7 flex flex-col gap-space-md bg-surface-container-low p-space-md sm:p-space-lg rounded-xl shadow-md border border-surface-container-highest/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Assessment Log &amp; Deterministic Forecaster
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Adjust marks and weights to forecast internal contribution
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-surface-container-highest text-primary font-stat-numeric text-body-sm font-semibold font-mono">
                    Projected Total: <span className="text-primary">{assessmentResult.totalWeighted.toFixed(1)}</span> / 100
                  </div>
                </div>

                {/* Interactive Calculator Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
                      <tr>
                        <th className="p-space-sm rounded-l-lg">Assessment Component</th>
                        <th className="p-space-sm">Scored</th>
                        <th className="p-space-sm">Max</th>
                        <th className="p-space-sm">Weight</th>
                        <th className="p-space-sm rounded-r-lg text-right">Weighted %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0 text-on-surface">
                      {assessments.map((a, idx) => {
                        const weightedVal = assessmentResult.weightedPercentages[idx] || 0;
                        const isScoreCritical = (a.score / a.max) < 0.4;
                        return (
                          <tr key={a.id} className="hover:bg-surface-container-high/40 transition-colors">
                            <td className="p-space-sm font-medium">
                              <div className="flex items-center gap-1.5">
                                <span>{a.name}</span>
                                {a.isEstimate && (
                                  <span className="font-label-sm text-[9px] px-1.5 py-0.2 rounded bg-secondary/20 text-secondary font-mono">
                                    Est.
                                  </span>
                                )}
                                {a.isTarget && (
                                  <span className="font-label-sm text-[9px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-mono">
                                    Target
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-space-sm">
                              <input
                                type="number"
                                step="0.5"
                                value={a.score}
                                onChange={(e) => handleScoreChange(a.id, parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-surface-container-lowest text-on-surface font-stat-numeric rounded border border-surface-container-highest focus:ring-1 focus:ring-primary focus:outline-none font-mono text-[13px]"
                                aria-label={`Score for ${a.name}`}
                              />
                            </td>
                            <td className="p-space-sm font-stat-numeric text-on-surface-variant font-mono">{a.max}</td>
                            <td className="p-space-sm font-stat-numeric text-on-surface-variant font-mono">{a.weight}%</td>
                            <td
                              className={`p-space-sm text-right font-stat-numeric font-semibold font-mono ${
                                isScoreCritical ? 'text-error' : 'text-tertiary'
                              }`}
                            >
                              {weightedVal.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Formula & Feasibility Breakdown Note */}
                <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col gap-1 font-body-sm text-body-sm border border-surface-container-highest/20">
                  <div className="flex items-center justify-between text-on-surface-variant flex-wrap gap-1">
                    <span>
                      Formula: <code className="text-primary font-stat-numeric font-mono">Sum( (Mark/Max) * Weight )</code>
                    </span>
                    <span className="text-tertiary font-mono">
                      Forecasted Grade: <strong>{assessmentResult.forecastedGrade}</strong>
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">
                    To push this subject from <strong className="text-on-surface">B+</strong> to{' '}
                    <strong className="text-tertiary">A (9.0)</strong>, you must score at least <strong>88/100</strong> on the
                    final semester paper.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CGPA & Grade Calculator */}
        {activeTab === 'cgpa' && (
          <div className="flex flex-col gap-space-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Target Simulator Card */}
              <div className="lg:col-span-4 flex flex-col gap-space-md p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-md border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Target SGPA Simulator
                  </h3>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold font-mono">
                    Sem 3 Feasibility
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-highest/20">
                  <div className="flex items-baseline justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">
                      Current CGPA (Sem 1-2)
                    </span>
                    <span className="font-stat-numeric text-[22px] text-on-surface font-semibold font-mono">8.24</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">
                      Desired Milestone CGPA
                    </span>
                    <span className="font-stat-numeric text-[22px] text-tertiary font-bold font-mono">
                      {targetCgpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Interactive Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant">Adjust Graduation Target CGPA</span>
                    <span className="font-stat-numeric text-primary font-mono">{targetCgpa.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="8.30"
                    max="9.80"
                    step="0.05"
                    value={targetCgpa}
                    onChange={(e) => setTargetCgpa(parseFloat(e.target.value))}
                    className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container-highest rounded-lg"
                    aria-label="Target CGPA Slider"
                  />
                  <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
                    <span>8.30</span>
                    <span>9.00</span>
                    <span>9.80</span>
                  </div>
                </div>

                {/* Feasibility Engine Card */}
                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col gap-2 shadow-inner border border-surface-container-highest/20">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span className="font-headline-sm text-headline-sm font-semibold">Mathematical Feasibility Engine</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {feasibilityResult.verdict}
                  </p>
                  <div className="mt-1 flex items-center justify-between p-2 rounded bg-surface-container text-body-sm font-label-sm font-mono">
                    <span className="text-on-surface-variant">Max Attainable this Term:</span>
                    <span className="text-primary font-stat-numeric font-bold">
                      10.00 SGPA -&gt; {feasibilityResult.maxAttainable.toFixed(2)} Cum.
                    </span>
                  </div>
                </div>
              </div>

              {/* Grade Allocation Table */}
              <div className="lg:col-span-8 flex flex-col gap-space-md p-space-md sm:p-space-lg rounded-xl bg-surface-container-low shadow-md border border-surface-container-highest/20">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Semester 3 Credit Matrix &amp; Grade Points
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Simulate grade points per subject to compute live SGPA
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase font-mono">
                      Live Simulated SGPA
                    </span>
                    <span className="font-stat-numeric text-stat-numeric text-primary font-bold font-mono">
                      {simulatedSgpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-mono">
                      <tr>
                        <th className="p-space-sm rounded-l-lg">Course Code &amp; Name</th>
                        <th className="p-space-sm">Credits</th>
                        <th className="p-space-sm">Projected Grade</th>
                        <th className="p-space-sm">Grade Pt</th>
                        <th className="p-space-sm rounded-r-lg text-right">Credit x Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0 text-on-surface">
                      {courseMatrix.map((course) => {
                        return (
                          <tr key={course.id} className="hover:bg-surface-container-high/40 transition-colors">
                            <td className="p-space-sm font-medium">
                              {course.code}: {course.name}
                            </td>
                            <td className="p-space-sm font-stat-numeric font-mono">{course.credits}</td>
                            <td className="p-space-sm">
                              <select
                                value={course.gradePoint}
                                onChange={(e) => handleGradePointChange(course.id, parseFloat(e.target.value))}
                                className="bg-surface-container-lowest text-on-surface px-2 py-1 rounded font-label-sm border border-surface-container-highest focus:ring-1 focus:ring-primary focus:outline-none font-mono text-[12px] cursor-pointer"
                                aria-label={`Projected grade for ${course.name}`}
                              >
                                <option value="10">O (10.0)</option>
                                <option value="9">A+ (9.0)</option>
                                <option value="8">A (8.0)</option>
                                <option value="7">B+ (7.0)</option>
                                <option value="6">B (6.0)</option>
                              </select>
                            </td>
                            <td className="p-space-sm font-stat-numeric text-on-surface-variant font-mono">
                              {course.gradePoint.toFixed(1)}
                            </td>
                            <td className="p-space-sm text-right font-stat-numeric text-primary font-mono">
                              {(course.credits * course.gradePoint).toFixed(1)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Assignment & Lab Deadlines */}
        {activeTab === 'deadlines' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Urgent Column */}
            <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-md border border-surface-container-highest/20">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Immediate Action</h3>
                </div>
                <span className="font-stat-numeric text-error font-label-md font-mono">2 Tasks</span>
              </div>

              {/* Card 1 */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col gap-2 shadow-sm hover:-translate-y-0.5 transition-transform border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono">
                    CS302: OS
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container/40 text-error font-semibold font-mono">
                    Due in 2 days
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Deadlock Banker's Algorithm Sim
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Implement multi-threaded resource allocation with avoidance graph in C/C++.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">Progress: 60%</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col gap-2 shadow-sm hover:-translate-y-0.5 transition-transform border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono">
                    CS301: Math
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container/40 text-error font-semibold font-mono">
                    Due in 4 days
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Fourier Transform Problem Set
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Solve 12 non-periodic boundary problems from Kreyzig Chapter 11.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">Progress: 25%</span>
                  <span className="material-symbols-outlined text-secondary text-[18px]">calculate</span>
                </div>
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-md border border-surface-container-highest/20">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">In Active Sprint</h3>
                </div>
                <span className="font-stat-numeric text-primary font-label-md font-mono">2 Tasks</span>
              </div>

              {/* Card 1 */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col gap-2 shadow-sm hover:-translate-y-0.5 transition-transform border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono">
                    CS303: DBMS
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                    Due in 7 days
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Normalization &amp; BCNF Decomposition
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Lab sheet 5: Relational schema optimization with lossless join guarantee.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">Progress: 85%</span>
                  <span className="material-symbols-outlined text-tertiary text-[18px]">database</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col gap-2 shadow-sm hover:-translate-y-0.5 transition-transform border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono">
                    CS305: Discrete
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                    Due in 9 days
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Graph Theory Proof Portfolio
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Planar graph Euler characteristic derivations and chromatic numbers.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">Progress: 40%</span>
                  <span className="material-symbols-outlined text-secondary text-[18px]">hub</span>
                </div>
              </div>
            </div>

            {/* Upcoming & Queued */}
            <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-md border border-surface-container-highest/20">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Queued Milestones</h3>
                </div>
                <span className="font-stat-numeric text-on-surface-variant font-label-md font-mono">1 Task</span>
              </div>

              {/* Card 1 */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col gap-2 shadow-sm hover:-translate-y-0.5 transition-transform border border-surface-container-highest/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono">
                    CS304: Networks
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                    Due in 14 days
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Subnetting &amp; RIP Route Config
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  VLSM topology configuration with simulated router hop verification.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">Progress: Queued</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">lan</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Study Notes & Blueprints */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
            {/* Resource 1 */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between shadow-md border border-surface-container-highest/20">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
                    PDF • 4.2 MB
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Updated 2d ago</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Laplace Transforms Complete Formula Handbook
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Handwritten annotations, derivation shortcuts, Dirac delta table, and step-function mappings.
                </p>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
                <span className="font-label-sm text-label-sm text-tertiary font-mono">Verified by Prof. Sharma</span>
                <button
                  onClick={() => alert('Downloading Laplace Transforms Handbook (PDF)...')}
                  className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span> Download
                </button>
              </div>
            </div>

            {/* Resource 2 */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between shadow-md border border-surface-container-highest/20">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary/20 text-secondary font-mono">
                    Interactive • Web
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Live Blueprint</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  OS Virtual Memory &amp; Page Replacement Visualizer
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Interactive step debugger comparing FIFO, LRU, and Optimal Belady anomaly simulations.
                </p>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
                <span className="font-label-sm text-label-sm text-secondary font-mono">CS302 Core Module</span>
                <button
                  onClick={() => alert('Launching OS Virtual Memory Visualizer sandbox...')}
                  className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span> Launch Sim
                </button>
              </div>
            </div>

            {/* Resource 3 */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between shadow-md border border-surface-container-highest/20">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary/20 text-tertiary font-mono">
                    Cheat Sheet • Markdown
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Verified</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  SQL Joins, Subqueries &amp; Window Functions Blueprint
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  PostgreSQL-optimized cheat sheet including execution order, indexes, and CTE templates.
                </p>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-highest/20">
                <span className="font-label-sm text-label-sm text-tertiary font-mono">Semester 3 Syllabus</span>
                <button
                  onClick={() => alert('Opening SQL Blueprints and CTE Cheatsheet modal...')}
                  className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span> View Vault
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCourse}
            className="bg-surface-container-low max-w-md w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-highest"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest/30 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">post_add</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Enroll Course Unit</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-body-sm text-body-sm">
              <div>
                <label className="block text-on-surface-variant mb-1 font-mono">Course Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CS308"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1 font-mono">Course Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Distributed Cloud Systems"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1 font-mono">Credits</label>
                <select
                  value={newCourseCredits}
                  onChange={(e) => setNewCourseCredits(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface border border-surface-container-highest focus:ring-1 focus:ring-primary focus:outline-none font-mono cursor-pointer"
                >
                  <option value={1}>1 Credit (Lab / Seminar)</option>
                  <option value={2}>2 Credits (Practical)</option>
                  <option value={3}>3 Credits (Standard)</option>
                  <option value={4}>4 Credits (Core Heavy)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest/20">
              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-bright cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary-container cursor-pointer"
              >
                Enroll Course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
