/**
 * Academic & Telemetry Mathematical Functions for StudentOS
 * Pure logic decoupled from React rendering for deterministic accuracy.
 */

export interface AssessmentItem {
  score: number;
  max: number;
  weight: number;
}

export interface AssessmentResult {
  weightedPercentages: number[];
  totalWeighted: number;
  forecastedGrade: string;
}

export function calculateWeightedAssessments(components: AssessmentItem[]): AssessmentResult {
  const weightedPercentages = components.map(c => {
    if (c.max <= 0) return 0;
    return (c.score / c.max) * c.weight;
  });

  const totalWeighted = Math.round(weightedPercentages.reduce((acc, curr) => acc + curr, 0) * 100) / 100;

  let forecastedGrade = 'F';
  if (totalWeighted >= 85) forecastedGrade = 'A+ (10.0 Points)';
  else if (totalWeighted >= 75) forecastedGrade = 'A (9.0 Points)';
  else if (totalWeighted >= 65) forecastedGrade = 'B+ (8.0 Points)';
  else if (totalWeighted >= 55) forecastedGrade = 'B (7.0 Points)';
  else if (totalWeighted >= 45) forecastedGrade = 'C (6.0 Points)';

  return {
    weightedPercentages,
    totalWeighted,
    forecastedGrade,
  };
}

export interface FeasibilityResult {
  requiredSgpa: number;
  isFeasible: boolean;
  maxAttainable: number;
  verdict: string;
}

export function calculateTargetFeasibility(
  currentCgpa: number,
  completedCredits: number,
  targetCgpa: number,
  futureCredits: number
): FeasibilityResult {
  const totalCredits = completedCredits + futureCredits;
  const currentTotalPoints = currentCgpa * completedCredits;
  const targetTotalPoints = targetCgpa * totalCredits;
  const requiredPoints = targetTotalPoints - currentTotalPoints;
  const requiredSgpa = Math.round((requiredPoints / futureCredits) * 100) / 100;

  const maxPointsPossible = currentTotalPoints + (10.0 * futureCredits);
  const maxAttainable = Math.round((maxPointsPossible / totalCredits) * 100) / 100;

  const isFeasible = requiredSgpa <= 10.0;
  let verdict = '';

  if (!isFeasible) {
    verdict = `Mathematically Infeasible: Target would require ${requiredSgpa.toFixed(2)} SGPA in Sem 3 & 4 (exceeds theoretical 10.0 cap). Max attainable CGPA is ${maxAttainable.toFixed(2)} with straight 10.0s.`;
  } else if (requiredSgpa > 9.3) {
    verdict = `To achieve an overall ${targetCgpa.toFixed(2)} CGPA, you require an average ${requiredSgpa.toFixed(2)} SGPA in Semester 3 & 4 (High rigor: Grade O/A+ across all ${futureCredits} credits).`;
  } else {
    verdict = `To achieve an overall ${targetCgpa.toFixed(2)} CGPA, you need a comfortable average ${requiredSgpa.toFixed(2)} SGPA in Semester 3 & 4 (Standard workload pace).`;
  }

  return {
    requiredSgpa,
    isFeasible,
    maxAttainable,
    verdict,
  };
}

export function calculateLiveSgpa(courses: { credits: number; gradePoint: number }[]): number {
  let totalCredits = 0;
  let totalPoints = 0;

  for (const c of courses) {
    totalCredits += c.credits;
    totalPoints += c.credits * c.gradePoint;
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

export function calculateTimeBudgetMinutes(
  totalHours: number,
  allocations: { academics: number; dsa: number; dev: number; buffer: number }
) {
  const totalMinutes = totalHours * 60;
  const academicsMin = Math.round((allocations.academics / 100) * totalMinutes);
  const dsaMin = Math.round((allocations.dsa / 100) * totalMinutes);
  const devMin = Math.round((allocations.dev / 100) * totalMinutes);
  const bufferMin = Math.round((allocations.buffer / 100) * totalMinutes);

  return {
    academicsMin,
    dsaMin,
    devMin,
    bufferMin,
  };
}

export function formatStopwatchTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
