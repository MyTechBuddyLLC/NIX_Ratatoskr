import { useParams, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export function RepoDetail() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const context = useContext(AppContext);

  const isNew = repoId === 'new';
  const existingRepo = context?.repos.find(r => r.id === repoId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [cloudflareUrl, setCloudflareUrl] = useState('');
  const [isEditing, setIsEditing] = useState(isNew);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (existingRepo) {
      setName(existingRepo.name);
      setDescription(existingRepo.description);
      setGithubUrl(existingRepo.github_url || '');
      setCloudflareUrl(existingRepo.cloudflare_url || '');
    }
  }, [existingRepo]);

  if (!context) return <div>Loading...</div>;

  const repoTasks = context.tasks.filter(t => t.repo === name && (showArchived || !t.isArchived));

  const handleSave = () => {
    if (!name) {
      alert('Name is required');
      return;
    }
    const repoData = {
        name,
        description,
        github_url: githubUrl,
        cloudflare_url: cloudflareUrl,
        last_updated: new Date().toISOString(),
    };

    if (isNew) {
      context.addRepo(repoData);
    } else if (repoId) {
      context.updateRepo(repoId, repoData);
    }
    setIsEditing(false);
    navigate('/repos');
  };

  const handleNewTask = () => {
    // Navigate to new task and pre-select this repo
    navigate('/tasks/new', { state: { task: { repo: name } } });
  };

  const repo = existingRepo || {
    name: 'New Repository',
    description: '',
    github_url: '',
    cloudflare_url: '',
    last_updated: new Date().toISOString(),
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full dark:text-white"
            placeholder="Repository Name"
          />
        ) : (
          <h1 className="text-2xl font-bold">{repo.name}</h1>
        )}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <span className="font-semibold text-sm text-gray-500 dark:text-foreground-muted-dark">Description</span>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark focus:ring-1 focus:ring-blue-500 outline-none text-foreground-light dark:text-foreground-dark"
              placeholder="Repo description..."
            />
          ) : (
            <p className="text-sm">{repo.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-sm text-gray-500 dark:text-foreground-muted-dark">GitHub URL</span>
            {isEditing ? (
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark focus:ring-1 focus:ring-blue-500 outline-none text-foreground-light dark:text-foreground-dark"
                placeholder="https://github.com/..."
              />
            ) : (
                repo.github_url ? (
                    <a href={repo.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{repo.github_url}</a>
                ) : (
                    <span className="text-sm text-gray-500 dark:text-foreground-muted-dark italic">None provided</span>
                )
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-sm text-gray-500 dark:text-foreground-muted-dark">Cloudflare URL</span>
            {isEditing ? (
              <input
                value={cloudflareUrl}
                onChange={(e) => setCloudflareUrl(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark focus:ring-1 focus:ring-blue-500 outline-none text-foreground-light dark:text-foreground-dark"
                placeholder="https://dash.cloudflare.com/..."
              />
            ) : (
                repo.cloudflare_url ? (
                    <a href={repo.cloudflare_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{repo.cloudflare_url}</a>
                ) : (
                    <span className="text-sm text-gray-500 dark:text-foreground-muted-dark italic">None provided</span>
                )
            )}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isNew ? 'Create Repository' : 'Save Changes'}
              </button>
              <button
                onClick={() => isNew ? navigate('/repos') : setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-secondary-dark dark:hover:bg-primary-dark rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <a
                href={repo.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-primary-dark dark:hover:bg-secondary-dark rounded-md hover:bg-gray-900 ${!repo.github_url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
              >
                View on GitHub
              </a>
              <a
                href={repo.cloudflare_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 ${!repo.cloudflare_url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
              >
                View on Cloudflare
              </a>
            </div>
          )}
        </div>

        {!isNew && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Associated Tasks</h2>
              <button
                onClick={handleNewTask}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                New Task
              </button>
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="showArchivedRepo"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-secondary-dark dark:border-secondary-dark"
              />
              <label htmlFor="showArchivedRepo" className="text-sm font-medium text-gray-900 dark:text-foreground-dark">
                Show Archived Tasks
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-dark">
                <thead className="bg-gray-50 dark:bg-primary-dark">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-foreground-muted-dark uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-foreground-muted-dark uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-foreground-muted-dark uppercase tracking-wider">Latest Text</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-secondary-dark">
                  {repoTasks.length > 0 ? (
                    repoTasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => navigate(`/tasks/${task.id}`, { state: { task } })}
                        className="hover:bg-gray-100 dark:hover:bg-primary-dark cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-secondary-dark dark:text-foreground-muted-dark'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-foreground-dark">{task.name}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-foreground-muted-dark max-w-xs truncate">{task.latest_text}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-foreground-muted-dark">
                        No tasks for this repository.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
