import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ApiKeyBanner } from './ApiKeyBanner';

// Define the type for a single task
interface Task {
  status: 'Completed' | 'In Progress' | 'Pending';
  repo: string;
  name: string;
  initial_prompt: string;
  latest_text: string;
}

// Mock data for the task list
const mockTasks: Task[] = [
  {
    status: 'Completed',
    repo: 'ratatoskr-pwa',
    name: 'Initial UI setup',
    initial_prompt: 'Create the basic layout and navigation for the PWA.',
    latest_text: 'Finished setting up the bottom tabs and basic routing.',
  },
  {
    status: 'In Progress',
    repo: 'ratatoskr-pwa',
    name: 'Implement theme switching',
    initial_prompt: 'Add dark/light/system theme support.',
    latest_text: 'Enabled class-based dark mode in Tailwind.',
  },
  {
    status: 'Pending',
    repo: 'jules-api',
    name: 'Define task API endpoint',
    initial_prompt: 'Create a new API endpoint to fetch user tasks.',
    latest_text: 'Waiting on backend schema definition.',
  },
  {
    status: 'Completed',
    repo: 'another-repo/project-x',
    name: 'Fix login bug',
    initial_prompt: 'Users are unable to log in with special characters in their passwords.',
    latest_text: 'Patched the authentication controller to handle special characters.',
  },
];

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>;
  }

  const { julesApiKey, maxSimultaneousTasks, maxDailyTasks } = context;

  const tasks = julesApiKey ? mockTasks : [];
  const activeTasks = tasks.filter(task => task.status === 'In Progress');
  const queuedTasks = tasks.filter(task => task.status === 'Pending');
  const completedToday = tasks.filter(task => task.status === 'Completed').length;

  const handleRowClick = (task: Task) => {
    navigate(`/tasks/${encodeURIComponent(task.name)}`, { state: { task } });
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-primary-light dark:bg-primary-dark p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Sessions</h2>
          <p className="text-3xl font-bold">{activeTasks.length} / {maxSimultaneousTasks}</p>
        </div>
        <div className="bg-primary-light dark:bg-primary-dark p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Daily Sessions</h2>
          <p className="text-3xl font-bold">{completedToday} / {maxDailyTasks}</p>
        </div>
        <div className="bg-primary-light dark:bg-primary-dark p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Queue</h2>
          <p className="text-3xl font-bold">{queuedTasks.length}</p>
          <Link to="/queue" className="text-foreground-light dark:text-foreground-dark hover:underline">View Queue</Link>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Active Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-dark">
            <thead className="bg-gray-50 dark:bg-primary-dark">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latest Text</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-secondary-dark">
              {activeTasks.length > 0 ? (
                activeTasks.map((task, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(task)}
                    className="hover:bg-gray-100 dark:hover:bg-primary-dark cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.repo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.name}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{task.latest_text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No active tasks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
