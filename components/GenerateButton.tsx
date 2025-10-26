import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  text?: string;
}

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
        <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z"></path>
        <path d="M3 21L4 17"></path>
        <path d="M19 21L20 17"></path>
    </svg>
);


export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled, text = 'Gerar' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all duration-300 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
        <SparkleIcon />
        {text}
    </button>
  );
};