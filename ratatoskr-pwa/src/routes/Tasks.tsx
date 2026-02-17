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
            className="w-4 h-4 text-blue-600 bg-secondary-light border-secondary-light rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-background-dark focus:ring-2 dark:bg-secondary-dark dark:border-secondary-dark"
          />
          <label htmlFor="showArchived" className="text-sm font-medium text-foreground-light dark:text-foreground-dark">
            Show Archived Tasks
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="activeOnly"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-secondary-light border-secondary-light rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-background-dark focus:ring-2 dark:bg-secondary-dark dark:border-secondary-dark"
          />
          <label htmlFor="activeOnly" className="text-sm font-medium text-foreground-light dark:text-foreground-dark">
            Active Only
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-light dark:divide-secondary-dark">
          <thead className="bg-background-light dark:bg-primary-dark">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Repo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Initial Prompt</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Latest Text</th>
            </tr>
          </thead>
          <tbody className="bg-primary-light dark:bg-background-dark divide-y divide-secondary-light dark:divide-secondary-dark">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleRowClick(task)}
                  className="hover:bg-secondary-light dark:hover:bg-primary-dark cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-secondary-light text-foreground-muted-light dark:bg-secondary-dark dark:text-foreground-muted-dark'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted-light dark:text-foreground-muted-dark">{task.repo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-light dark:text-foreground-dark">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted-light dark:text-foreground-muted-dark max-w-xs truncate">{task.initial_prompt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted-light dark:text-foreground-muted-dark max-w-xs truncate">{task.latest_text}</td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-foreground-muted-light dark:text-foreground-muted-dark">
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
