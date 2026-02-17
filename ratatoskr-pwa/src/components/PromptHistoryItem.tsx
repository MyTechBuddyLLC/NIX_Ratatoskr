import React from 'react';
import type { HistoryEntry } from '../context/AppContext';

interface PromptHistoryItemProps {
  item: HistoryEntry;
  isExpanded: boolean;
  onClick: () => void;
}

const BranchIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 100-4 2 2 0 000 4zm0 10a2 2 0 100 4 2 2 0 000-4zm8-10a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const GithubIcon = () => (
    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);

const PromptHistoryItem: React.FC<PromptHistoryItemProps> = ({ item, isExpanded, onClick }) => {
  const isReadyForReview = item.status === 'Ready for review';

  if (isReadyForReview && isExpanded) {
    return (
      <div className="border border-secondary-dark border-l-4 border-l-purple-500 rounded-lg overflow-hidden mb-4 bg-background-dark shadow-lg">
        <div className="p-4 bg-primary-dark border-b border-secondary-dark flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-white flex items-center">
                Ready for review <span className="ml-2">🎉</span>
            </h3>
          </div>
          <div className="flex space-x-2">
            {item.additions !== undefined && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-900/40 text-green-400 border border-green-800">
                +{item.additions}
              </span>
            )}
            {item.deletions !== undefined && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-900/40 text-red-400 border border-red-800">
                -{item.deletions}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {item.branchName && (
            <div className="flex items-center p-3 bg-secondary-dark rounded border border-primary-dark font-mono text-sm text-foreground-dark overflow-x-auto">
              <BranchIcon />
              {item.branchName}
            </div>
          )}

          <div className="text-foreground-dark whitespace-pre-wrap text-sm bg-primary-dark p-3 rounded">
            {item.output.replace('Ready for review 🎉\n\n', '')}
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-4">
               <button className="text-foreground-muted-dark hover:text-foreground-dark flex items-center text-sm transition-colors">
                  How'd Jules do?
               </button>
               <div className="flex space-x-2">
                  <button className="p-1 hover:bg-secondary-dark rounded transition-colors text-foreground-muted-dark">👍</button>
                  <button className="p-1 hover:bg-secondary-dark rounded transition-colors text-foreground-muted-dark">👎</button>
               </div>
            </div>

            <div className="flex items-center space-x-4">
              {item.duration_mins && (
                <span className="text-sm text-foreground-muted-dark">
                  Time: {item.duration_mins} mins
                </span>
              )}
              {item.prUrl && (
                <div className="inline-flex rounded-md shadow-sm">
                    <a
                        href={item.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-secondary-dark border border-primary-dark rounded-l-md hover:bg-primary-dark transition-colors"
                    >
                        View PR <GithubIcon />
                    </a>
                    <button className="px-2 py-2 text-sm font-medium text-white bg-secondary-dark border-y border-r border-primary-dark rounded-r-md hover:bg-primary-dark transition-colors" title="Select different PR/Branch">
                        ▼
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-secondary-light dark:border-secondary-dark">
      <button
        onClick={onClick}
        className="w-full text-left p-4 bg-background-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark focus:outline-none transition-colors"
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-foreground-light dark:text-foreground-dark">{item.prompt}</span>
          <span className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">
            {new Date(item.timestamp).toLocaleString()}
          </span>
        </div>
      </button>
      {isExpanded && (
        <div className="p-4 bg-primary-light dark:bg-background-dark border-t border-secondary-light dark:border-secondary-dark">
          <div className="text-foreground-light dark:text-foreground-dark whitespace-pre-wrap">
            {item.output}
          </div>
          {item.duration_mins && (
             <div className="mt-2 text-xs text-foreground-muted-light dark:text-foreground-muted-dark text-right">
                Duration: {item.duration_mins} mins
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptHistoryItem;
