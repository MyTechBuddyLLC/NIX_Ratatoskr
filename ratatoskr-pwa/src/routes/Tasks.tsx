import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ApiKeyBanner } from '../components/ApiKeyBanner';

export function Tasks() {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showArchived, setShowArchived] = useState(false);
  const [activeOnly, setActiveOnly] = useState(false);

  useEffect(() => {
    if (location.state?.filter === 'active') {
      setActiveOnly(true);
      setShowArchived(false);
    } else if (location.state?.filter === 'daily') {
      setActiveOnly(false);
      setShowArchived(false);
    }
  }, [location.state]);

  if (!context) {
    return <div>Loading...</div>; // Or some other loading state
  }

  const { julesApiKey, tasks } = context;
  const availableTasks = julesApiKey ? tasks : [];

  const filteredTasks = availableTasks.filter(task => {
    if (activeOnly && task.status !== 'In Progress') return false;
    if (!showArchived && task.isArchived) return false;
    return true;
  });

  const handleRowClick = (task: Task) => {
    navigate(`/tasks/${task.id}`, { state: { task } });
  };

  const handleNewTask = () => {
    navigate('/tasks/new');
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={handleNewTask}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          New Task
        </button>
      </div>

      <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showArchived"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="showArchived" className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Show Archived Tasks
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="activeOnly"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="activeOnly" className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Active Only
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-dark">
          <thead className="bg-gray-50 dark:bg-primary-dark">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Initial Prompt</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latest Text</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-secondary-dark">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleRowClick(task)}
                  className="hover:bg-gray-100 dark:hover:bg-primary-dark cursor-pointer"
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
                    No tasks match the current filters.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
