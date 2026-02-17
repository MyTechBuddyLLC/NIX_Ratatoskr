import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ApiKeyBanner } from '../components/ApiKeyBanner';

export function Repos() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Loading...</div>; // Or some other loading state
  }

  const { julesApiKey, repos } = context;
  const availableRepos = julesApiKey ? repos : [];

  const handleRowClick = (repoId: string) => {
    navigate(`/repos/${repoId}`);
  };

  const handleNewRepo = () => {
    navigate('/repos/new');
  };

  return (
    <div className="p-4 md:p-6">
      <ApiKeyBanner />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repositories</h1>
        <button
          onClick={handleNewRepo}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          New Repository
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-light dark:divide-secondary-dark">
          <thead className="bg-background-light dark:bg-primary-dark">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground-muted-light dark:text-foreground-muted-dark uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-primary-light dark:bg-background-dark divide-y divide-secondary-light dark:divide-secondary-dark">
            {availableRepos.length > 0 ? (
              availableRepos.map((repo) => (
                <tr key={repo.id} onClick={() => handleRowClick(repo.id)} className="cursor-pointer hover:bg-secondary-light dark:hover:bg-primary-dark transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground-light dark:text-foreground-dark">
                    {repo.name}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-foreground-muted-light dark:text-foreground-muted-dark">
                    {repo.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted-light dark:text-foreground-muted-dark">
                    {new Date(repo.last_updated).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={3} className="text-center py-10 text-foreground-muted-light dark:text-foreground-muted-dark">
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
