import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ApiKeyBanner } from '../components/ApiKeyBanner';

// Define the type for a single repo
interface Repo {
  id: string;
  name: string;
  description: string;
  last_updated: string;
}

// Mock data for the repo list
const mockRepos: Repo[] = [
  {
    id: '1',
    name: 'ratatoskr-pwa',
    description: 'A PWA client for the Jules API.',
    last_updated: '2024-07-29T10:00:00Z',
  },
  {
    id: '2',
    name: 'jules-api',
    description: 'The backend API for the Jules agent.',
    last_updated: '2024-07-28T15:30:00Z',
  },
  {
    id: '3',
    name: 'another-repo/project-x',
    description: 'A top-secret project.',
    last_updated: '2024-07-25T12:00:00Z',
  },
];

export function Repos() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>; // Or some other loading state
  }

  const { julesApiKey } = context;
  const repos = julesApiKey ? mockRepos : [];

  const handleRowClick = (repoId: string) => {
    navigate(`/repos/${repoId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <h1 className="text-2xl font-bold mb-6">Repositories</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-dark">
          <thead className="bg-gray-50 dark:bg-primary-dark">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-background-dark divide-y divide-gray-200 dark:divide-secondary-dark">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <tr key={repo.id} onClick={() => handleRowClick(repo.id)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-primary-dark">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {repo.name}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400">
                    {repo.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(repo.last_updated).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No repositories to display.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
