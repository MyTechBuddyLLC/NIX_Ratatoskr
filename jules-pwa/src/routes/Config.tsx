interface ConfigProps {
  path?: string;
}

export function Config(_props: ConfigProps) {
  return (
    <div class="space-y-8 text-gray-900 dark:text-white">
      <h1 class="text-2xl font-bold">Configuration</h1>

      <div class="space-y-4">
        <h2 class="text-xl font-semibold">API Settings</h2>
        <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <label for="api-key" class="block mb-2 text-sm font-medium">Jules API Key</label>
          <input
            type="password"
            id="api-key"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter your API key"
          />
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Your key is stored securely in your browser's local storage.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Appearance</h2>
        <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <label for="theme" class="block mb-2 text-sm font-medium">Theme</label>
          <select
            id="theme"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="system">Follow System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Placeholder for future settings */}
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Integrations</h2>
         <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Future settings for notifications and deep linking preferences will appear here.
            </p>
        </div>
      </div>

    </div>
  );
}
