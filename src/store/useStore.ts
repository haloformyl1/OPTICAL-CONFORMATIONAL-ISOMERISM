import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LanguageMode = 'en' | 'bn' | 'bilingual';
export type ThemeMode = 'dark';

interface AppState {
  language: LanguageMode;
  theme: ThemeMode;
  reducedMotion: boolean;
  completedModules: string[];
  solvedQuestions: Record<string, boolean>;
  score: number;
  bookmarkedExamples: string[];
  setLanguage: (lang: LanguageMode) => void;
  setTheme: (theme?: ThemeMode) => void;
  setReducedMotion: (reduced: boolean) => void;
  markModuleCompleted: (moduleId: string) => void;
  recordQuestionResult: (questionId: string, isCorrect: boolean) => void;
  toggleBookmark: (exampleId: string) => void;
  resetProgress: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'dark',
      reducedMotion: false,
      completedModules: [],
      solvedQuestions: {},
      score: 0,
      bookmarkedExamples: [],
      setLanguage: (lang) => set({ language: lang }),
      setTheme: () => {
        set({ theme: 'dark' });
        document.documentElement.classList.add('dark');
        document.documentElement.dataset.theme = 'dark';
      },
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      markModuleCompleted: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        })),
      recordQuestionResult: (questionId, isCorrect) =>
        set((state) => ({
          solvedQuestions: { ...state.solvedQuestions, [questionId]: isCorrect },
          score: isCorrect ? state.score + 1 : state.score,
        })),
      toggleBookmark: (exampleId) =>
        set((state) => ({
          bookmarkedExamples: state.bookmarkedExamples.includes(exampleId)
            ? state.bookmarkedExamples.filter((id) => id !== exampleId)
            : [...state.bookmarkedExamples, exampleId],
        })),
      resetProgress: () =>
        set({
          completedModules: [],
          solvedQuestions: {},
          score: 0,
          bookmarkedExamples: [],
        }),
    }),
    {
      name: 'optical-conformational-storage',
      merge: (persistedState: unknown, currentState: AppState): AppState => ({
        ...currentState,
        ...(typeof persistedState === 'object' && persistedState !== null ? (persistedState as Partial<AppState>) : {}),
        theme: 'dark',
      }),
    }
  )
);

