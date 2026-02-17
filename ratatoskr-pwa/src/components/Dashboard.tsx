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

  const { julesApiKey, maxSimultaneousTasks, maxDailyTasks, tasks } = context;

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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
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
