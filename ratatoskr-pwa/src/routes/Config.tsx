import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function Config() {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const {
    julesApiKey,
    setJulesApiKey,
    geminiApiKey,
    setGeminiApiKey,
    theme,
    setTheme,
  } = context;

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration</h1>

      <div className="space-y-8">
        {/* API Keys Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <div className="flex flex-col space-y-4">
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Jules API Key</span>
              <input
                type="password"
                value={julesApiKey}
                onChange={(e) => setJulesApiKey(e.target.value)}
                className="p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your Jules API key"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Gemini API Key</span>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your Gemini API key"
              />
            </label>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <div>
            <span className="font-medium">Theme</span>
            <div className="mt-2 flex rounded-md border border-gray-300 dark:border-gray-600 w-min">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`px-4 py-2 text-sm font-medium transition-colors
                    ${
                      theme === option.value
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    ${
                      option.value === 'light'
                        ? 'rounded-l-md'
                        : option.value === 'system'
                        ? 'rounded-r-md'
                        : ''
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
