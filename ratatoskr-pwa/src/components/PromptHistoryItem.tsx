import React, { useState } from 'react';

interface PromptHistory {
  prompt: string;
  output: string;
  timestamp: string;
}

interface PromptHistoryItemProps {
  item: PromptHistory;
  isExpanded: boolean;
  onClick: () => void;
}

const PromptHistoryItem: React.FC<PromptHistoryItemProps> = ({ item, isExpanded, onClick }) => {
  return (
    <div className="border-b dark:border-gray-700">
      <button
        onClick={onClick}
        className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold">{item.prompt}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(item.timestamp).toLocaleString()}
          </span>
        </div>
      </button>
      {isExpanded && (
        <div className="p-4 bg-white dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300">{item.output}</p>
        </div>
      )}
    </div>
  );
};

export default PromptHistoryItem;
