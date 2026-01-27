import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { PasswordModal } from '../components/PasswordModal';
import { deriveKey } from '@stablelib/pbkdf2';
import { SHA256 } from '@stablelib/sha256';
import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { fromString, toString } from 'uint8arrays';

// Define the shape of the settings object for persistence
interface AppSettings {
  julesApiKey: string;
  geminiApiKey: string;
  githubApiKey: string;
  cloudflareApiKey: string;
  theme: string;
  maxSimultaneousTasks: number;
  maxDailyTasks: number;
}

// Define the shape of the context data
interface AppContextType extends AppSettings {
  setJulesApiKey: (apiKey: string) => void;
  setGeminiApiKey: (apiKey: string) => void;
  setGithubApiKey: (apiKey: string) => void;
  setCloudflareApiKey: (apiKey: string) => void;
  setTheme: (theme: string) => void;
  setMaxSimultaneousTasks: (maxTasks: number) => void;
  setMaxDailyTasks: (maxTasks: number) => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [julesApiKey, setJulesApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [githubApiKey, setGithubApiKey] = useState('');
  const [cloudflareApiKey, setCloudflareApiKey] = useState('');
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [maxSimultaneousTasks, setMaxSimultaneousTasks] = useState(3);
  const [maxDailyTasks, setMaxDailyTasks] = useState(15);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const loadSettings = async (password: string) => {
    const storedSettings = localStorage.getItem('ratatoskr-settings');
    if (!storedSettings) {
      return;
    }

    try {
      const { encrypted, salt, nonce } = JSON.parse(storedSettings);
      const key = await deriveKey(SHA256, fromString(password, 'utf8'), fromString(salt, 'base64'), 100000, 32);
      const cipher = new ChaCha20Poly1305(key);
      const decryptedSettings = cipher.open(fromString(nonce, 'base64'), fromString(encrypted, 'base64'));

      if (decryptedSettings) {
        const {
          julesApiKey,
          geminiApiKey,
          githubApiKey,
          cloudflareApiKey,
          theme,
          maxSimultaneousTasks,
          maxDailyTasks,
        } = JSON.parse(toString(decryptedSettings, 'utf8'));
        setJulesApiKey(julesApiKey);
        setGeminiApiKey(geminiApiKey);
        setGithubApiKey(githubApiKey || '');
        setCloudflareApiKey(cloudflareApiKey || '');
        setTheme(theme);
        setMaxSimultaneousTasks(maxSimultaneousTasks ?? 3);
        setMaxDailyTasks(maxDailyTasks ?? 15);
        setShowPasswordModal(false);
      } else {
        alert('Failed to decrypt settings. Please check your password.');
      }
    } catch (e) {
      alert('Failed to load settings. The data may be corrupt or the password incorrect.');
      console.error(e);
    }
  };

  useEffect(() => {
    const unencrypted = localStorage.getItem('ratatoskr-settings-unencrypted');
    if (unencrypted) {
      try {
        const {
          julesApiKey,
          geminiApiKey,
          githubApiKey,
          cloudflareApiKey,
          theme,
          maxSimultaneousTasks,
          maxDailyTasks,
        } = JSON.parse(unencrypted);
        setJulesApiKey(julesApiKey);
        setGeminiApiKey(geminiApiKey);
        setGithubApiKey(githubApiKey || '');
        setCloudflareApiKey(cloudflareApiKey || '');
        setTheme(theme);
        setMaxSimultaneousTasks(maxSimultaneousTasks ?? 3);
        setMaxDailyTasks(maxDailyTasks ?? 15);
      } catch (e) {
        console.error('Failed to load unencrypted settings:', e);
      }
    } else {
      const storedSettings = localStorage.getItem('ratatoskr-settings');
      if (storedSettings) {
        setShowPasswordModal(true);
      }
    }
  }, []);

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
    githubApiKey,
    setGithubApiKey,
    cloudflareApiKey,
    setCloudflareApiKey,
    theme,
    setTheme,
    maxSimultaneousTasks,
    setMaxSimultaneousTasks,
    maxDailyTasks,
    setMaxDailyTasks,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={loadSettings}
        />
      )}
    </AppContext.Provider>
  );
};
