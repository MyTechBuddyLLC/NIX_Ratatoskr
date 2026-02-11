import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import PromptHistoryItem from '../components/PromptHistoryItem';

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
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const location = useLocation();

  const isNew = taskId === 'new';
  const existingTask = context?.tasks.find(t => t.id === taskId) || location.state?.task;

  const [name, setName] = useState('');
  const [repo, setRepo] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(isNew);
  const [expandedIndex, setExpandedIndex] = useState(mockHistory.length - 1);

  useEffect(() => {
    if (existingTask) {
        setName(existingTask.name);
        setRepo(existingTask.repo);
        setInitialPrompt(existingTask.initial_prompt);
    }
  }, [existingTask]);

  if (!context) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    if (!name || !repo || !initialPrompt) {
        alert('Please fill in all fields.');
        return;
    }

    if (isNew) {
      context.addTask({
        name,
        repo,
        initial_prompt: initialPrompt,
        status: 'Pending',
        latest_text: 'Waiting to start...',
      });
    } else if (taskId) {
      context.updateTask(taskId, { name, repo, initial_prompt: initialPrompt });
    }
    setIsEditing(false);
    navigate('/tasks');
  };

  const handleArchive = () => {
    if (taskId && !isNew) {
      context.updateTask(taskId, { isArchived: true });
      navigate('/tasks');
    }
  };

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  const task = existingTask || {
    name: 'New Task',
    status: 'Pending',
    repo: '',
    initial_prompt: '',
    latest_text: '',
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full dark:text-white"
            placeholder="Task Name"
          />
        ) : (
          <h1 className="text-2xl font-bold">{task.name}</h1>
        )}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Edit Task
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-sm text-gray-500 dark:text-foreground-muted-dark">Status</span>
            {!isNew ? (
              <span className={`px-2 w-fit inline-flex text-xs leading-5 font-semibold rounded-full ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-gray-100 text-gray-800 dark:bg-secondary-dark dark:text-foreground-muted-dark'
              }`}>
                {task.status}
              </span>
            ) : (
                <span className="text-sm text-gray-600 dark:text-foreground-muted-dark">Pending (New)</span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-sm text-gray-500 dark:text-foreground-muted-dark">Repository</span>
            {isEditing ? (
              <select
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a repository</option>
                {context.repos.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            ) : (
              <span className="text-sm">{task.repo}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="font-semibold text-sm text-gray-500 dark:text-foreground-muted-dark">Initial Prompt</span>
          {isEditing ? (
            <textarea
              value={initialPrompt}
              onChange={(e) => setInitialPrompt(e.target.value)}
              className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark h-32 focus:ring-1 focus:ring-blue-500 outline-none text-foreground-light dark:text-foreground-dark"
              placeholder="Describe what needs to be done..."
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{task.initial_prompt}</p>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isNew ? 'Create Task' : 'Save Changes'}
              </button>
              <button
                onClick={() => isNew ? navigate('/tasks') : setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-secondary-dark dark:hover:bg-primary-dark rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Archive Task
              </button>
              <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium cursor-not-allowed" title="Coming Soon">Pause</button>
              <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium cursor-not-allowed" title="Coming Soon">Stop</button>
            </>
          )}
        </div>

        {!isNew && (
          <div>
            <h3 className="font-semibold text-lg mt-8 mb-4">Prompt History</h3>
            <div className="border rounded-md overflow-hidden dark:border-secondary-dark">
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
        )}
      </div>
    </div>
  );
}
