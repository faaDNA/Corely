export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId?: string;
  tags?: string[];
  completedAt?: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  deadline?: string;
  technologies?: string[];
  repoUrl?: string;
  deployUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  pinned?: boolean;
  archived?: boolean;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  tags?: string[];
  favorite?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  frequency: string;
  streak: number;
  longestStreak: number;
  completedToday?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  type: 'personal' | 'task' | 'project' | 'habit';
}
