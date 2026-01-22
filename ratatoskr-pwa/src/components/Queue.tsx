import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Queue.css';

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
  {
    status: 'Pending',
    repo: 'ratatoskr-pwa',
    name: 'Add API call logic',
    initial_prompt: 'Replace mock data with actual calls to the Jules API.',
    latest_text: 'Researching fetch libraries.',
  },
];


const Queue: React.FC = () => {
    const navigate = useNavigate();
    const queuedTasks = mockTasks.filter(task => task.status === 'Pending');

    const handleRowClick = (task: Task) => {
        navigate(`/tasks/${encodeURIComponent(task.name)}`, { state: { task } });
    };

  return (
    <div className="queue-container p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Queue</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">Tasks that are waiting to be processed.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Prompt</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {queuedTasks.map((task, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(task)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.repo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.name}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{task.initial_prompt}</td>
              </tr>
            ))}
            {queuedTasks.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  The queue is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queue;
