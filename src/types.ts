export type WorkspaceView =
  | 'command-center'
  | 'academics'
  | 'dsa-cp'
  | 'development'
  | 'life-health'
  | 'ai-study-planner'
  | 'calendar-scheduler'
  | 'tasks-deadlines'
  | 'analytics-cgpa'
  | 'settings';

export interface ScheduleEvent {
  id: string;
  timeRange: string;
  category: 'academic' | 'study' | 'wellness' | 'dev';
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  locationOrMeta: string;
  attended: boolean;
  isPriority?: boolean;
}

export interface DsaProblem {
  id: string;
  title: string;
  codeId: string;
  concept: string;
  platform: 'LeetCode' | 'Codeforces' | 'GeeksforGeeks' | 'CodeChef';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solveMode: string;
  solveTimeMins: number;
  complexity: string;
  revisionCadence: string;
  cadenceUrgent?: boolean;
  notes?: string;
}

export interface ScratchMemo {
  id: string;
  text: string;
  time: string;
}

export interface AssessmentRow {
  id: string;
  name: string;
  score: number;
  max: number;
  weight: number;
  isEstimate?: boolean;
  isTarget?: boolean;
}

export interface CourseMatrixItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  gradePoint: number;
}
