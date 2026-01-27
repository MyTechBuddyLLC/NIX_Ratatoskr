import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ApiKeyBanner } from '../components/ApiKeyBanner';

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

export function Tasks() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>; // Or some other loading state
  }

  const { julesApiKey } = context;
  const tasks = julesApiKey ? mockTasks : [];

  const handleRowClick = (task: Task) => {
    navigate(`/tasks/${encodeURIComponent(task.name)}`, { state: { task } });
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Prompt</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Text</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(task)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.repo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.name}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{task.initial_prompt}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{task.latest_text}</td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No tasks to display.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
