
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex-grow text-left bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-lg px-4 py-2 text-sm" role="alert">
      <p><span className="font-bold">Erro:</span> {message}</p>
    </div>
  );
};