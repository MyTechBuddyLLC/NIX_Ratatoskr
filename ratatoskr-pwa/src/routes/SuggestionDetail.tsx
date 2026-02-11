import { useParams } from 'react-router-dom';

// Mock data for a single suggestion
const mockSuggestion = {
  id: '1',
  title: 'Improve component test coverage',
  description: 'The PasswordInput component is missing unit tests. Consider adding tests to cover various user interactions, such as toggling visibility and handling empty inputs.',
  source: 'Jules API Analyzer',
};

export function SuggestionDetail() {
  const { suggestionId } = useParams<{ suggestionId: string }>();

  // In the future, we'll fetch the suggestion details based on the suggestionId
  // For now, we'll just display the mock data
  const suggestion = { ...mockSuggestion, id: suggestionId };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">{suggestion.title}</h1>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Source:</span> {suggestion.source}
        </div>
        <div className="p-4 border rounded bg-gray-50 dark:bg-primary-dark dark:border-secondary-dark">
          <p>{suggestion.description}</p>
        </div>
        <div className="mt-6">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => {
              // In the future, this will navigate to a new task page
              // pre-populated with data from the suggestion.
              alert('This will jump to a new task detail page in the future!');
            }}
          >
            Create Task from Suggestion
          </button>
        </div>
      </div>
    </div>
  );
}
