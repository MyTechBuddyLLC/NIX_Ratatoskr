import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { PasswordModal } from '../components/PasswordModal';
import { listSessions, listActivities, listSources } from '../utils/julesApi';
import type { JulesSession, JulesActivity } from '../utils/julesApi';
import { deriveKey } from '@stablelib/pbkdf2';
import { SHA256 } from '@stablelib/sha256';
import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { fromString, toString } from 'uint8arrays';

export interface HistoryEntry {
  prompt: string;
  output: string;
  timestamp: string;
  duration_mins?: number;
  status?: 'Ready for review' | 'Ready for submission' | 'Working';
  branchName?: string;
  prUrl?: string;
  additions?: number;
  deletions?: number;
}

export interface Task {
  id: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  repo: string;
  name: string;
  initial_prompt: string;
  latest_text: string;
  isArchived?: boolean;
  history: HistoryEntry[];
}

export interface Repo {
  id: string;
  name: string;
  description: string;
  last_updated: string;
  github_url?: string;
  cloudflare_url?: string;
}

// Define the shape of the settings object for persistence
interface AppSettings {
  julesApiKey: string;
  geminiApiKey: string;
  githubApiKey: string;
  cloudflareApiKey: string;
  theme: string;
  maxSimultaneousTasks: number;
  maxDailyTasks: number;
  tasks: Task[];
  repos: Repo[];
}

// Define the shape of the context data
interface AppContextType extends AppSettings {
  isLoading: boolean;
  setJulesApiKey: (apiKey: string) => void;
  setGeminiApiKey: (apiKey: string) => void;
  setGithubApiKey: (apiKey: string) => void;
  setCloudflareApiKey: (apiKey: string) => void;
  setTheme: (theme: string) => void;
  setMaxSimultaneousTasks: (maxTasks: number) => void;
  setMaxDailyTasks: (maxTasks: number) => void;
  setTasks: (tasks: Task[]) => void;
  setRepos: (repos: Repo[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  refreshTasks: () => Promise<void>;
  addRepo: (repo: Omit<Repo, 'id'>) => void;
  updateRepo: (id: string, updates: Partial<Repo>) => void;
}

// Create the context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
const mockTasks: Task[] = [
  {
    id: '1',
    status: 'Completed',
    repo: 'ratatoskr-pwa',
    name: 'Initial UI setup',
    initial_prompt: 'Create the basic layout and navigation for the PWA.',
    latest_text: 'Finished setting up the bottom tabs and basic routing.',
    history: [
      {
        prompt: 'Create the basic layout and navigation for the PWA.',
        output: 'I have set up the basic layout with a sidebar for desktop and bottom tabs for mobile. I used React Router for navigation.',
        timestamp: '2024-07-29T10:00:00Z',
        duration_mins: 15,
      },
      {
        prompt: 'Add some mock data for tasks and repos.',
        output: 'Ready for review 🎉\n\nI have added mock data to the AppContext to demonstrate the UI features.',
        timestamp: '2024-07-29T10:30:00Z',
        duration_mins: 20,
        status: 'Ready for review',
        branchName: 'feat-mock-data-12345',
        prUrl: 'https://github.com/example/ratatoskr-pwa/pull/1',
        additions: 120,
        deletions: 5,
      }
    ],
  },
  {
    id: '2',
    status: 'In Progress',
    repo: 'ratatoskr-pwa',
    name: 'Implement theme switching',
    initial_prompt: 'Add dark/light/system theme support.',
    latest_text: 'Enabled class-based dark mode in Tailwind.',
    history: [
      {
        prompt: 'Add dark/light/system theme support.',
        output: 'I am working on adding theme support using Tailwind CSS and React Context.',
        timestamp: '2024-07-30T09:00:00Z',
        duration_mins: 10,
        status: 'Working',
      },
      {
        prompt: 'Please add a "Ready for review" status to the history.',
        output: 'Ready for review 🎉\n\nI have implemented the theme switching logic and verified it works in dark mode.',
        timestamp: '2024-07-30T10:00:00Z',
        duration_mins: 37,
        status: 'Ready for review',
        branchName: 'fix-table-blue-tint-dark-mode-13234993608605035778',
        prUrl: 'https://github.com/example/ratatoskr-pwa/pull/2',
        additions: 61,
        deletions: 15,
      }
    ],
  },
  {
    id: '3',
    status: 'Pending',
    repo: 'jules-api',
    name: 'Define task API endpoint',
    initial_prompt: 'Create a new API endpoint to fetch user tasks.',
    latest_text: 'Waiting on backend schema definition.',
    history: [],
  },
  {
    id: '4',
    status: 'Completed',
    repo: 'another-repo/project-x',
    name: 'Fix login bug',
    initial_prompt: 'Users are unable to log in with special characters in their passwords.',
    latest_text: 'Patched the authentication controller to handle special characters.',
    history: [
       {
        prompt: 'Users are unable to log in with special characters in their passwords.',
        output: 'Ready for review 🎉\n\nI have fixed the issue by properly encoding the password before sending it to the server.',
        timestamp: '2024-07-25T12:00:00Z',
        duration_mins: 45,
        status: 'Ready for review',
        branchName: 'fix-login-bug',
        prUrl: 'https://github.com/example/project-x/pull/42',
        additions: 15,
        deletions: 2,
      }
    ],
  },
];

const mockRepos: Repo[] = [
  {
    id: '1',
    name: 'ratatoskr-pwa',
    description: 'A PWA client for the Jules API.',
    last_updated: '2024-07-29T10:00:00Z',
  },
  {
    id: '2',
    name: 'jules-api',
    description: 'The backend API for the Jules agent.',
    last_updated: '2024-07-28T15:30:00Z',
  },
  {
    id: '3',
    name: 'another-repo/project-x',
    description: 'A top-secret project.',
    last_updated: '2024-07-25T12:00:00Z',
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [julesApiKey, setJulesApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [githubApiKey, setGithubApiKey] = useState('');
  const [cloudflareApiKey, setCloudflareApiKey] = useState('');
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [maxSimultaneousTasks, setMaxSimultaneousTasks] = useState(3);
  const [maxDailyTasks, setMaxDailyTasks] = useState(15);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [repos, setRepos] = useState<Repo[]>(mockRepos);
  const [isLoading, setIsLoading] = useState(false);
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
          tasks,
          repos,
        } = JSON.parse(toString(decryptedSettings, 'utf8'));
        setJulesApiKey(julesApiKey);
        setGeminiApiKey(geminiApiKey);
        setGithubApiKey(githubApiKey || '');
        setCloudflareApiKey(cloudflareApiKey || '');
        setTheme(theme);
        setMaxSimultaneousTasks(maxSimultaneousTasks ?? 3);
        setMaxDailyTasks(maxDailyTasks ?? 15);
        setTasks(tasks || []);
        setRepos(repos || []);
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
    const autoloadPassword = localStorage.getItem('ratatoskr-autoload-password');
    const storedSettings = localStorage.getItem('ratatoskr-settings');

    if (autoloadPassword && storedSettings) {
      loadSettings(autoloadPassword);
    } else if (storedSettings) {
      setShowPasswordModal(true);
    } else {
      // Fallback for old unencrypted format if it still exists
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
          if (tasks) setTasks(tasks);
          if (repos) setRepos(repos);
        } catch (e) {
          console.error('Failed to load unencrypted settings:', e);
        }
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

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: crypto.randomUUID() };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const addRepo = (repo: Omit<Repo, 'id'>) => {
    const newRepo = { ...repo, id: crypto.randomUUID() };
    setRepos([...repos, newRepo]);
  };

  const updateRepo = (id: string, updates: Partial<Repo>) => {
    setRepos(repos.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const mapJulesStatus = (state: JulesSession['state']): Task['status'] => {
    switch (state) {
      case 'QUEUED':
      case 'PLANNING':
        return 'Pending';
      case 'IN_PROGRESS':
      case 'AWAITING_PLAN_APPROVAL':
      case 'AWAITING_USER_FEEDBACK':
        return 'In Progress';
      case 'COMPLETED':
      case 'FAILED':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const refreshTasks = async () => {
    if (!julesApiKey) return;
    setIsLoading(true);
    try {
      const sessions = await listSessions(julesApiKey);
      const sources = await listSources(julesApiKey);

      // Update repos based on sources
      const fetchedRepos: Repo[] = sources.map(source => ({
          id: source.id,
          name: source.githubSourceContext?.repo || source.name,
          description: `Jules Source: ${source.name}`,
          last_updated: new Date().toISOString(), // Sources don't have updateTime in the alpha?
          github_url: source.githubSourceContext ? `https://github.com/${source.githubSourceContext.owner}/${source.githubSourceContext.repo}` : undefined,
      }));
      if (fetchedRepos.length > 0) {
          // Merge with existing repos or replace? For now replace mock with real if any.
          setRepos(fetchedRepos);
      }

      const fetchedTasks: Task[] = await Promise.all(sessions.map(async (session) => {
        const activities: JulesActivity[] = await listActivities(julesApiKey, session.id);
        const history: HistoryEntry[] = activities
          .filter(a => a.agentMessaged || a.userMessaged)
          .map(a => {
            const output = a.agentMessaged?.text || a.userMessaged?.text || '';
            const isReady = output.includes('Ready for review') || output.includes('Ready for submission');
            const durationMatch = output.match(/Time:\s*(\d+)\s*mins/i);
            const additionsMatch = output.match(/\+(\d+)/);
            const deletionsMatch = output.match(/-(\d+)/);

            return {
              prompt: a.originator === 'user' ? output : (a.description || 'Agent Action'),
              output: output,
              timestamp: a.createTime,
              duration_mins: durationMatch ? parseInt(durationMatch[1], 10) : undefined,
              additions: additionsMatch ? parseInt(additionsMatch[1], 10) : undefined,
              deletions: deletionsMatch ? parseInt(deletionsMatch[1], 10) : undefined,
              status: isReady ? 'Ready for review' : (a.originator === 'agent' ? 'Working' : undefined),
            };
          });

        return {
          id: session.id,
          name: session.title || 'Untitled Task',
          status: mapJulesStatus(session.state),
          repo: session.sourceContext?.source.split('/').pop() || 'Unknown Repo',
          initial_prompt: session.prompt,
          latest_text: history.length > 0 ? history[history.length - 1].output : 'No activity yet',
          history: history,
        };
      }));

      setTasks(fetchedTasks);
    } catch (e) {
      console.error('Failed to refresh tasks:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (julesApiKey) {
      refreshTasks();
    }
  }, [julesApiKey]);

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
    tasks,
    setTasks,
    repos,
    setRepos,
    isLoading,
    addTask,
    updateTask,
    refreshTasks,
    addRepo,
    updateRepo,
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
