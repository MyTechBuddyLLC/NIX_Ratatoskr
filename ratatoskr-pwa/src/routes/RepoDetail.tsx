import { useParams } from 'react-router-dom';

// Mock data for a single repo
const mockRepo = {
  id: '1',
  name: 'ratatoskr-pwa',
  description: 'A PWA client for the Jules API.',
  last_updated: '2024-07-29T10:00:00Z',
  github_url: 'https://github.com/user/ratatoskr-pwa',
  cloudflare_url: 'https://dash.cloudflare.com/?to=/:account/pages/view/ratatoskr-pwa',
};

export function RepoDetail() {
  const { repoId } = useParams<{ repoId: string }>();

  // In the future, we'll fetch the repo details based on the repoId
  // For now, we'll just display the mock data
  const repo = { ...mockRepo, id: repoId };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">{repo.name}</h1>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Description:</span> {repo.description}
        </div>
        <div>
          <span className="font-semibold">Last Updated:</span> {new Date(repo.last_updated).toLocaleString()}
        </div>
        <div className="mt-6 flex space-x-4">
          <a
            href={repo.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900"
          >
            View on GitHub
          </a>
          <a
            href={repo.cloudflare_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
          >
            View on Cloudflare
          </a>
        </div>
      </div>
    </div>
  );
}
