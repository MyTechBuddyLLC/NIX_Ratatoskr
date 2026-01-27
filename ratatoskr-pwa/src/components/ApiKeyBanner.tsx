import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export function ApiKeyBanner() {
  const context = useContext(AppContext);

  if (!context) {
    return null; // Or a loading state
  }

  const { julesApiKey } = context;

  if (julesApiKey) {
    return null;
  }

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
      <p className="font-bold">API Key Missing</p>
      <p>
        Please enter your Jules API key in the{' '}
        <Link to="/config" className="font-bold underline">
          Configuration
        </Link>{' '}
        page to enable all features.
      </p>
    </div>
  );
}
