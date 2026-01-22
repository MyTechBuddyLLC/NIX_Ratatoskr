import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import PromptHistoryItem from '../components/PromptHistoryItem';

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

const mockHistory = [
    {
      prompt: 'Initial prompt',
      output: 'This is the first output from the AI.',
      timestamp: '2024-01-01T12:00:00Z',
    },
    {
      prompt: 'Second prompt',
      output: 'This is the second output, refining the first.',
      timestamp: '2024-01-01T12:05:00Z',
    },
    {
      prompt: 'Latest prompt',
      output: 'This is the most recent output.',
      timestamp: '2024-01-01T12:10:00Z',
    },
  ];

export function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const location = useLocation();
  const [expandedIndex, setExpandedIndex] = useState(mockHistory.length - 1);

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

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{task.name}</h1>
        <button disabled className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title="Coming Soon">Rename</button>
      </div>
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
        <div className="mt-6 flex space-x-2">
            <button
                disabled
                className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
                title="Coming Soon"
            >
                Pause
            </button>
            <button
                disabled
                className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
                title="Coming Soon"
            >
                Stop
            </button>
            <button
                disabled
                className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
                title="Coming Soon"
            >
                Archive
            </button>
        </div>
        <div>
          <h3 className="font-semibold text-lg mt-4 mb-2">Prompt History</h3>
          <div className="border rounded-md overflow-hidden dark:border-gray-700">
            {mockHistory.map((item, index) => (
              <PromptHistoryItem
                key={index}
                item={item}
                isExpanded={index === expandedIndex}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
