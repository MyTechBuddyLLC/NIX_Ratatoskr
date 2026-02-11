import React, { useState } from 'react';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-dark p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Enter Password</h2>
        <p className="text-sm text-gray-600 dark:text-foreground-muted-dark mb-4">
          Your saved settings are encrypted. Please enter your password to decrypt them.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-primary-light dark:bg-primary-dark border-secondary-light dark:border-secondary-dark"
            placeholder="Decryption Password"
            autoFocus
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-secondary-dark hover:bg-gray-300 dark:hover:bg-primary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Decrypt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
