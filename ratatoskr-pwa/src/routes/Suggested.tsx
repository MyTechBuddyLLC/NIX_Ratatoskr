import { Link } from 'react-router-dom';

// Define the type for a single suggestion
interface Suggestion {
  id: string;
  title: string;
  description: string;
  source: string;
}

// Mock data for the suggestion list
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Improve component test coverage',
    description: 'The PasswordInput component is missing unit tests. Consider adding tests to cover various user interactions.',
    source: 'Jules API Analyzer',
  },
  {
    id: '2',
    title: 'Refactor App.tsx',
    description: 'The main App component is getting large. Consider breaking it down into smaller, more manageable components.',
    source: 'Code Quality Scanner',
  },
  {
    id: '3',
    title: 'Add a loading spinner',
    description: 'Improve user experience by displaying a loading spinner while data is being fetched from the API.',
    source: 'UX Best Practices',
  },
];

export function Suggested() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Suggestions</h1>
      <div className="space-y-4">
        {mockSuggestions.map((suggestion) => (
          <Link
            to={`/suggestions/${suggestion.id}`}
            key={suggestion.id}
            className="block p-4 bg-primary-light dark:bg-primary-dark rounded-lg shadow hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors"
          >
            <h3 className="font-semibold text-lg">{suggestion.title}</h3>
            <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-1">Source: {suggestion.source}</p>
            <p className="text-sm text-foreground-light dark:text-foreground-dark mt-2 truncate">{suggestion.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
