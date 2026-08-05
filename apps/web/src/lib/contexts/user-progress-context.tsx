'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProgressData {
  xp: number;
  level: number;
  streak: number;
  wordsLearned: number;
  quizzesPassed: number;
  dailyGoalMinutes: number;
  completedMinutes: number;
  userRole: string;
  isGuest: boolean;
}

interface UserProgressContextType extends UserProgressData {
  addXp: (amount: number) => Promise<void>;
  addCompletedMinutes: (minutes: number) => void;
  refreshProgress: () => Promise<void>;
}

const defaultData: UserProgressData = {
  xp: 0,
  level: 1,
  streak: 0,
  wordsLearned: 0,
  quizzesPassed: 0,
  dailyGoalMinutes: 15,
  completedMinutes: 0,
  userRole: 'GUEST',
  isGuest: true,
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<UserProgressData>(defaultData);
  const [initialized, setInitialized] = useState(false);

  // Sync with API / LocalStorage on mount
  const refreshProgress = async () => {
    try {
      const res = await fetch('/api/v1/user/progress');
      if (res.ok) {
        const json = await res.json();
        const serverData = json.data;
        
        // Merge with local storage if guest
        const localXp = parseInt(localStorage.getItem('guest_xp') || '0', 10);
        const localQuizzes = parseInt(localStorage.getItem('guest_quizzes') || '0', 10);
        
        setData((prev) => ({
          ...prev,
          ...serverData,
          xp: serverData.isGuest ? serverData.xp + localXp : serverData.xp,
          quizzesPassed: serverData.isGuest ? serverData.quizzesPassed + localQuizzes : serverData.quizzesPassed,
          level: Math.floor((serverData.xp + localXp) / 100) + 1,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch user progress', err);
    } finally {
      setInitialized(true);
    }
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const addXp = async (amount: number) => {
    // Optimistic UI update
    setData((prev) => {
      const newXp = prev.xp + amount;
      return {
        ...prev,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
      };
    });

    if (data.isGuest) {
      const current = parseInt(localStorage.getItem('guest_xp') || '0', 10);
      localStorage.setItem('guest_xp', (current + amount).toString());
    }

    try {
      await fetch('/api/v1/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_XP', amount }),
      });
    } catch {
      // Background sync failed, local state is already updated
    }
  };

  const addCompletedMinutes = (minutes: number) => {
    setData((prev) => ({
      ...prev,
      completedMinutes: Math.min(prev.completedMinutes + minutes, prev.dailyGoalMinutes),
    }));
  };

  if (!initialized) {
    // Return null or a subtle loader to avoid hydration mismatch, but it's safe to just render with default data initially
  }

  return (
    <UserProgressContext.Provider value={{ ...data, addXp, addCompletedMinutes, refreshProgress }}>
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
}
