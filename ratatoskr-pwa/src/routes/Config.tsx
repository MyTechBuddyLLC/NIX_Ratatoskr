import { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { PasswordInput } from '../components/PasswordInput';
import { deriveKey } from '@stablelib/pbkdf2';
import { SHA256 } from '@stablelib/sha256';
import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { randomBytes } from '@stablelib/random';
import { fromString, toString } from 'uint8arrays';
import { createSqliteDb, parseSqliteDb } from '../utils/sqlite';
import { createEncryptedPackage, decryptPackage } from '../utils/encryption';
import type { EncryptionAlgorithm } from '../utils/encryption';

export function Config() {
  const context = useContext(AppContext);
  const [savePassword, setSavePassword] = useState('');
  const [autoloadEnabled, setAutoloadEnabled] = useState(localStorage.getItem('ratatoskr-autoload-password') !== null);
  const [loadPassword, setLoadPassword] = useState('');
  const [exportAlgorithm, setExportAlgorithm] = useState<EncryptionAlgorithm>('CHACHA20');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!context) {
    return <div>Loading...</div>;
  }

  const {
    julesApiKey,
    setJulesApiKey,
    geminiApiKey,
    setGeminiApiKey,
    githubApiKey,
    setGithubApiKey,
    cloudflareApiKey,
    setCloudflareApiKey,
    theme,
    setTheme,
    maxSimultaneousTasks,
    setMaxSimultaneousTasks,
    maxDailyTasks,
    setMaxDailyTasks,
    tasks,
    repos,
  } = context;

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const handleSaveSettings = async () => {
    if (!savePassword) {
      setError('A password is required to encrypt your settings.');
      setSuccess(null);
      return;
    }
    setError(null);

    const settingsObj = {
      julesApiKey,
      geminiApiKey,
      githubApiKey,
      cloudflareApiKey,
      theme,
      maxSimultaneousTasks,
      maxDailyTasks,
      tasks,
      repos,
    };
    const settingsJson = JSON.stringify(settingsObj);

    try {
      const salt = randomBytes(16);
      const nonce = randomBytes(12);
      const key = await deriveKey(SHA256, fromString(savePassword, 'utf8'), salt, 100000, 32);
      const cipher = new ChaCha20Poly1305(key);
      const encryptedSettings = cipher.seal(nonce, fromString(settingsJson, 'utf8'));

      const settingsToStore = {
        encrypted: toString(encryptedSettings, 'base64'),
        salt: toString(salt, 'base64'),
        nonce: toString(nonce, 'base64'),
      };

      localStorage.setItem('ratatoskr-settings', JSON.stringify(settingsToStore));

      if (autoloadEnabled) {
        localStorage.setItem('ratatoskr-autoload-password', savePassword);
      } else {
        localStorage.removeItem('ratatoskr-autoload-password');
      }

      // Clean up old unencrypted format if it exists
      localStorage.removeItem('ratatoskr-settings-unencrypted');

      setSuccess('Settings saved successfully to browser!');
    } catch (e) {
      setError('Failed to save settings. Please try again.');
      console.error(e);
    }
  };

  const handleExportSettings = async () => {
    if (!savePassword) {
      setError('A password is required to encrypt your settings for export.');
      setSuccess(null);
      return;
    }
    setError(null);

    const settingsObj = {
      julesApiKey,
      geminiApiKey,
      githubApiKey,
      cloudflareApiKey,
      theme,
      maxSimultaneousTasks,
      maxDailyTasks,
      tasks,
      repos,
    };

    try {
      const sqliteBinary = await createSqliteDb(settingsObj);
      const encryptedPackage = await createEncryptedPackage(sqliteBinary, savePassword, exportAlgorithm);

      // Use any cast to avoid TS incompatibility between Uint8Array<ArrayBufferLike> and BlobPart
      const blob = new Blob([encryptedPackage as any], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ratatoskr-settings-${exportAlgorithm.toLowerCase().replace('-gcm', '')}.rata`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess(`Settings exported using ${exportAlgorithm}!`);
      setError(null);
    } catch (e) {
      setError('Failed to export settings.');
      console.error(e);
    }
  };

  const handleLoadSettings = async (fileData?: Uint8Array) => {
    if (!loadPassword) {
      setError('A password is required to load settings.');
      setSuccess(null);
      return;
    }
    setError(null);

    try {
      let settingsObj: any;

      if (fileData) {
        // Try new package format first
        try {
          const sqliteBinary = await decryptPackage(fileData, loadPassword);
          settingsObj = await parseSqliteDb(sqliteBinary);
        } catch (e) {
          // Fallback to old format (JSON string in the file)
          const decoder = new TextDecoder();
          const jsonStr = decoder.decode(fileData);
          const { encrypted, salt, nonce } = JSON.parse(jsonStr);
          const key = await deriveKey(SHA256, fromString(loadPassword, 'utf8'), fromString(salt, 'base64'), 100000, 32);
          const cipher = new ChaCha20Poly1305(key);
          const decryptedSettings = cipher.open(fromString(nonce, 'base64'), fromString(encrypted, 'base64'));
          if (!decryptedSettings) throw new Error("Invalid password or format");
          settingsObj = JSON.parse(toString(decryptedSettings, 'utf8'));
        }
      } else {
        const storedSettings = localStorage.getItem('ratatoskr-settings');
        if (!storedSettings) {
          setError('No saved settings found in browser.');
          return;
        }
        const { encrypted, salt, nonce } = JSON.parse(storedSettings);
        const key = await deriveKey(SHA256, fromString(loadPassword, 'utf8'), fromString(salt, 'base64'), 100000, 32);
        const cipher = new ChaCha20Poly1305(key);
        const decryptedSettings = cipher.open(fromString(nonce, 'base64'), fromString(encrypted, 'base64'));
        if (!decryptedSettings) throw new Error("Invalid password");
        settingsObj = JSON.parse(toString(decryptedSettings, 'utf8'));
      }

      if (settingsObj) {
        setJulesApiKey(settingsObj.julesApiKey || '');
        setGeminiApiKey(settingsObj.geminiApiKey || '');
        setGithubApiKey(settingsObj.githubApiKey || '');
        setCloudflareApiKey(settingsObj.cloudflareApiKey || '');
        setTheme(settingsObj.theme || 'system');
        setMaxSimultaneousTasks(settingsObj.maxSimultaneousTasks ?? 3);
        setMaxDailyTasks(settingsObj.maxDailyTasks ?? 15);
        if (settingsObj.tasks) context.setTasks(settingsObj.tasks);
        if (settingsObj.repos) context.setRepos(settingsObj.repos);
        setSuccess('Settings loaded successfully!');
      }
    } catch (e) {
      setError('Failed to load settings. The data may be corrupt or the password incorrect.');
      console.error(e);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as ArrayBuffer;
        handleLoadSettings(new Uint8Array(content));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration</h1>

      <div className="space-y-8">
        {/* API Keys Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">API Keys</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Jules API Key</span>
              <PasswordInput
                value={julesApiKey}
                onChange={(e) => setJulesApiKey(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
                placeholder="Enter your Jules API key"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Gemini API Key</span>
              <PasswordInput
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
                placeholder="Enter your Gemini API key"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="font-medium">GitHub API Key</span>
              <PasswordInput
                value={githubApiKey}
                onChange={(e) => setGithubApiKey(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
                placeholder="Enter your GitHub API key"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Cloudflare API Key</span>
              <PasswordInput
                value={cloudflareApiKey}
                onChange={(e) => setCloudflareApiKey(e.target.value)}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
                placeholder="Enter your Cloudflare API key"
              />
            </label>
          </div>
        </div>

        {/* Task Settings Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Task Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Max Simultaneous Tasks</span>
              <input
                type="number"
                value={maxSimultaneousTasks}
                onChange={(e) => setMaxSimultaneousTasks(Number(e.target.value))}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark focus:ring-1 focus:ring-blue-500 outline-none hover:bg-background-light dark:hover:bg-secondary-dark transition-colors"
                placeholder="e.g., 3"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="font-medium">Max Daily Tasks</span>
              <input
                type="number"
                value={maxDailyTasks}
                onChange={(e) => setMaxDailyTasks(Number(e.target.value))}
                className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark focus:ring-1 focus:ring-blue-500 outline-none hover:bg-background-light dark:hover:bg-secondary-dark transition-colors"
                placeholder="e.g., 15"
              />
            </label>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <div>
            <span className="font-medium">Theme</span>
            <div className="mt-2 flex rounded-md border border-secondary-light dark:border-secondary-dark w-min overflow-hidden">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`px-4 py-2 text-sm font-medium transition-colors
                    ${
                      theme === option.value
                        ? 'bg-secondary-dark text-foreground-dark'
                        : 'hover:bg-secondary-light dark:hover:bg-secondary-dark'
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

        {/* Save & Export Section */}
        <div className="space-y-4 p-4 border rounded-md border-secondary-light dark:border-secondary-dark">
          <h2 className="text-lg font-semibold">Save & Export Settings</h2>
          <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Encrypt and save your settings to the browser or a secure SQLite package file.</p>

          <label className="flex flex-col space-y-1 mb-4">
            <span className="font-medium">Encryption Password</span>
            <PasswordInput
              value={savePassword}
              onChange={(e) => setSavePassword(e.target.value)}
              className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
              placeholder="Enter a password to encrypt"
            />
          </label>

          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="autoloadEnabled"
              checked={autoloadEnabled}
              onChange={(e) => setAutoloadEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-secondary-light border-secondary-light rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-background-dark focus:ring-2 dark:bg-secondary-dark dark:border-secondary-dark"
            />
            <label htmlFor="autoloadEnabled" className="text-sm font-medium text-foreground-light dark:text-foreground-dark">
              Easy automated approach (saves password for autoload)
            </label>
          </div>

          {autoloadEnabled && (
            <div className="p-3 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-primary-dark dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900" role="alert">
              <span className="font-medium">Warning!</span> This will store your encryption password in plain text in your browser's local storage. This allows for automatic loading but is less secure as anyone with access to your browser can see your encryption key and decrypt sensitive saved data such as API keys.
            </div>
          )}

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark border border-secondary-light dark:border-secondary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              Save to Browser
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportSettings}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Export Package
              </button>
              <select
                value={exportAlgorithm}
                onChange={(e) => setExportAlgorithm(e.target.value as EncryptionAlgorithm)}
                className="p-2 text-sm border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
              >
                <option value="CHACHA20">ChaCha20</option>
                <option value="AES-256-GCM">AES-256</option>
              </select>
            </div>
          </div>
        </div>

        {/* Load & Import Section */}
        <div className="space-y-4 p-4 border rounded-md border-secondary-light dark:border-secondary-dark">
          <h2 className="text-lg font-semibold">Load & Import Settings</h2>
          <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Load your encrypted settings from the browser or a file.</p>
          <label className="flex flex-col space-y-1">
            <span className="font-medium">Decryption Password</span>
            <PasswordInput
              value={loadPassword}
              onChange={(e) => setLoadPassword(e.target.value)}
              className="p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
              placeholder="Enter the password to decrypt"
              autoComplete="current-password"
            />
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleLoadSettings()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark border border-secondary-light dark:border-secondary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              Load from Browser
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary-light dark:bg-primary-dark border border-secondary-light dark:border-secondary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              Import from File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              className="hidden"
              accept=".rata,.json"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
      </div>
    </div>
  );
}
