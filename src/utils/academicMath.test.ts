import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWeightedAssessments,
  calculateTargetFeasibility,
  calculateLiveSgpa,
  calculateTimeBudgetMinutes,
  formatStopwatchTime
} from './academicMath.ts';

test('calculateWeightedAssessments calculates components accurately', () => {
  const components = [
    { score: 2.5, max: 10, weight: 10 },
    { score: 15, max: 20, weight: 15 },
    { score: 38, max: 50, weight: 25 },
    { score: 77.5, max: 100, weight: 50 }
  ];

  const result = calculateWeightedAssessments(components);
  // (2.5/10)*10 = 2.5
  // (15/20)*15 = 11.25
  // (38/50)*25 = 19.0
  // (77.5/100)*50 = 38.75
  // total = 2.5 + 11.25 + 19.0 + 38.75 = 71.5
  assert.equal(result.totalWeighted, 71.5);
  assert.equal(result.weightedPercentages[0], 2.5);
  assert.equal(result.weightedPercentages[1], 11.25);
  assert.equal(result.weightedPercentages[2], 19.0);
  assert.equal(result.weightedPercentages[3], 38.75);
  assert.equal(result.forecastedGrade, 'B+ (8.0 Points)');
});

test('calculateTargetFeasibility identifies realistic vs infeasible targets', () => {
  // 44 credits at 8.24, target 9.00 across 88 credits
  const feasible = calculateTargetFeasibility(8.24, 44, 9.00, 44);
  assert.equal(feasible.isFeasible, true);
  assert.equal(feasible.requiredSgpa, 9.76);
  assert.match(feasible.verdict, /High rigor/);

  // Infeasible target 9.80 with current 8.24
  const infeasible = calculateTargetFeasibility(8.24, 44, 9.80, 44);
  assert.equal(infeasible.isFeasible, false);
  assert.equal(infeasible.requiredSgpa > 10.0, true);
  assert.match(infeasible.verdict, /Mathematically Infeasible/);
});

test('calculateLiveSgpa weights credit matrix correctly', () => {
  const courses = [
    { credits: 4, gradePoint: 8.0 },
    { credits: 4, gradePoint: 9.0 },
    { credits: 4, gradePoint: 10.0 },
    { credits: 3, gradePoint: 8.0 },
    { credits: 3, gradePoint: 9.0 },
    { credits: 2, gradePoint: 8.0 },
    { credits: 2, gradePoint: 10.0 }
  ];
  // totalCredits = 22
  // points = 32 + 36 + 40 + 24 + 27 + 16 + 20 = 195
  // 195 / 22 = 8.8636... -> 8.86
  const sgpa = calculateLiveSgpa(courses);
  assert.equal(sgpa, 8.86);
});

test('calculateTimeBudgetMinutes breaks 7 hours into minutes', () => {
  const budget = calculateTimeBudgetMinutes(7, {
    academics: 45,
    dsa: 30,
    dev: 15,
    buffer: 10
  });

  // 7 hours = 420 minutes
  // 45% = 189 min
  // 30% = 126 min
  // 15% = 63 min
  // 10% = 42 min
  assert.equal(budget.academicsMin, 189);
  assert.equal(budget.dsaMin, 126);
  assert.equal(budget.devMin, 63);
  assert.equal(budget.bufferMin, 42);
});

test('formatStopwatchTime handles seconds correctly', () => {
  assert.equal(formatStopwatchTime(0), '00:00');
  assert.equal(formatStopwatchTime(65), '01:05');
  assert.equal(formatStopwatchTime(1458), '24:18');
});
