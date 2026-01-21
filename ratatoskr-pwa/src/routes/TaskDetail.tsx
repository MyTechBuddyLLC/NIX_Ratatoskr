import { useLocation, useParams } from 'react-router-dom';

// Define the type for a single task, matching the one in Tasks.tsx
interface Task {
  status: 'Completed' | 'In Progress' | 'Pending';
  repo: string;
  name: string;
  initial_prompt: string;
  latest_text: string;
  // Add optional fields from mock data
  step?: string;
  ai_time?: string;
}

export function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const location = useLocation();

  // Use the task from the location state, with a fallback for safety
  const task: Task = location.state?.task || {
    name: taskId || 'Task not found',
    status: 'Pending',
    repo: 'Unknown',
    initial_prompt: 'No details available.',
    latest_text: 'No details available.',
    step: 'N/A',
    ai_time: 'N/A',
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">{task.name}</h1>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Status:</span>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {task.status}
          </span>
        </div>
        <div>
          <span className="font-semibold">Repo:</span> {task.repo}
        </div>
        <div>
          <h3 className="font-semibold text-lg mt-4 mb-2">Prompts</h3>
          <div className="space-y-2">
            <p className="p-2 border rounded bg-gray-50 dark:bg-gray-800">
              <span className="font-semibold">Initial:</span> {task.initial_prompt}
            </p>
            <p className="p-2 border rounded bg-gray-50 dark:bg-gray-800">
              <span className="font-semibold">Latest:</span> {task.latest_text}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
            title="Feature not yet implemented"
          >
            Add to Queue
          </button>
        </div>
      </div>
    </div>
  );
}
