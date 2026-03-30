// Utility functions for localStorage-based persistence

const KEYS = {
  USERS: 'cl_users',
  SESSION: 'cl_session',
  PROGRESS: 'cl_progress',
  ACTIVITY: 'cl_activity',
  LAST_STORY: 'cl_last_story',
};

export interface ActivityLog {
  id: string;
  type: 'story_opened' | 'story_completed' | 'quiz_attempted' | 'quiz_completed';
  message: string;
  storyId?: number;
  storyTitle?: string;
  timestamp: number;
}

// --- Activity Log ---

export function getActivityLog(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVITY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logActivity(entry: Omit<ActivityLog, 'id' | 'timestamp'>) {
  const log = getActivityLog();
  const newEntry: ActivityLog = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  // Keep the 20 most recent entries
  const updated = [newEntry, ...log].slice(0, 20);
  localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(updated));
}

// --- Last Story ---

export function saveLastStory(storyId: number, storyTitle: string) {
  localStorage.setItem(KEYS.LAST_STORY, JSON.stringify({ storyId, storyTitle }));
}

export function getLastStory(): { storyId: number; storyTitle: string } | null {
  try {
    const raw = localStorage.getItem(KEYS.LAST_STORY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// --- Progress ---

export interface StoryProgress {
  completed: boolean;
  score: number;
  total: number;
}

export function getAllProgress(): Record<string, StoryProgress> {
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
