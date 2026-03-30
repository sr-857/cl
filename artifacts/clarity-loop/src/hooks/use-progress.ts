import { useState, useEffect } from 'react';

export interface StoryProgress {
  completed: boolean;
  score: number;
  total: number;
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, StoryProgress>>({});

  useEffect(() => {
    const stored = localStorage.getItem('cl_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const saveProgress = (storyId: number | string, score: number, total: number) => {
    const newProgress = {
      ...progress,
      [storyId.toString()]: {
        completed: true,
        score,
        total
      }
    };
    setProgress(newProgress);
    localStorage.setItem('cl_progress', JSON.stringify(newProgress));
    
    // Trigger custom event for other components (like dashboard) to update if needed
    window.dispatchEvent(new Event('cl_progress_updated'));
  };

  const getProgress = (storyId: number | string): StoryProgress | null => {
    return progress[storyId.toString()] || null;
  };

  return { progress, saveProgress, getProgress };
}
