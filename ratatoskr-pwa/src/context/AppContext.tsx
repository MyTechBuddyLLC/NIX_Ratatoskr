import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define the shape of the context data
interface AppContextType {
  julesApiKey: string;
  setJulesApiKey: (apiKey: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (apiKey: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  maxSimultaneousTasks: number;
  setMaxSimultaneousTasks: (maxTasks: number) => void;
  maxDailyTasks: number;
  setMaxDailyTasks: (maxTasks: number) => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [julesApiKey, setJulesApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [maxSimultaneousTasks, setMaxSimultaneousTasks] = useState(3);
  const [maxDailyTasks, setMaxDailyTasks] = useState(10);

  useEffect(() => {
    const root = window.document.documentElement;

    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        root.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    julesApiKey,
    setJulesApiKey,
    geminiApiKey,
    setGeminiApiKey,
    theme,
    setTheme,
    maxSimultaneousTasks,
    setMaxSimultaneousTasks,
    maxDailyTasks,
    setMaxDailyTasks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
