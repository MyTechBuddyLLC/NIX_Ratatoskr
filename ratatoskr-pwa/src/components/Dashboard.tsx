import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { ApiKeyBanner } from './ApiKeyBanner';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>;
  }

  const { julesApiKey, maxSimultaneousTasks, maxDailyTasks, tasks, isLoading, refreshTasks } = context;

  const availableTasks = julesApiKey ? tasks : [];
  const activeTasks = availableTasks.filter(task => task.status === 'In Progress' && !task.isArchived);
  const queuedTasks = availableTasks.filter(task => task.status === 'Pending' && !task.isArchived);
  const completedToday = availableTasks.filter(task => task.status === 'Completed' && !task.isArchived).length;

  const handleRowClick = (task: Task) => {
    navigate(`/tasks/${task.id}`, { state: { task } });
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}
        {!isLoading && julesApiKey && (
          <button
            onClick={() => refreshTasks()}
            className="text-foreground-muted-light dark:text-foreground-muted-dark hover:text-blue-600 transition-colors"
            title="Refresh Tasks"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          onClick={() => navigate('/tasks', { state: { filter: 'active' } })}
          className="bg-primary-light dark:bg-primary-dark p-6 rounded-lg shadow cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
        >
          <h2 className="text-lg font-semibold mb-2">Current Sessions</h2>
          <p className="text-3xl font-bold">{activeTasks.length} / {maxSimultaneousTasks}</p>
        </div>
        <div
          onClick={() => navigate('/tasks', { state: { filter: 'daily' } })}
          className="bg-primary-light dark:bg-primary-dark p-6 rounded-lg shadow cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
        >
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
          <table className="min-w-full divide-y divide-secondary-light dark:divide-secondary-dark">
            <thead className="bg-background-light dark:bg-primary-dark">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Repo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Latest Text</th>
              </tr>
            </thead>
            <tbody className="bg-primary-light dark:bg-background-dark divide-y divide-secondary-light dark:divide-secondary-dark">
              {activeTasks.length > 0 ? (
                activeTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => handleRowClick(task)}
                    className="hover:bg-secondary-light dark:hover:bg-primary-dark cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted-light dark:text-foreground-muted-dark">{task.repo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-light dark:text-foreground-dark">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted-light dark:text-foreground-muted-dark max-w-xs truncate">{task.latest_text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-foreground-muted-light dark:text-foreground-muted-dark">
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
