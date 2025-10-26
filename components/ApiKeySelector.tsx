import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
      <path d="m21.73 18.27-5.4-5.4C17.22 11.69 18 9.94 18 8a6 6 0 0 0-12 0c0 1.94.78 3.69 1.67 4.87l-5.4 5.4c-1.02 1.02-1.02 2.69 0 3.71l2.29 2.29c1.02 1.02 2.69 1.02 3.71 0l5.4-5.4 5.4 5.4c1.02 1.02 2.69 1.02 3.71 0l2.29-2.29c1.02-1.02 1.02-2.69 0-3.71z"></path><circle cx="8" cy="8" r="2"></circle>
    </svg>
);


export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    
    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            onKeySelected();
        }
    }

    return (
        <div className="flex-grow flex flex-col sm:flex-row items-center gap-4 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700 rounded-lg px-4 py-3 text-sm">
            <div className="text-left">
                <p className="font-bold">Chave de API Necessária para Vídeo</p>
                <p className="text-xs mt-1">
                    A geração de vídeo com Veo requer a seleção de uma chave de API. Este é um passo obrigatório.
                    Para mais informações, consulte a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-600 dark:hover:text-sky-400">documentação de faturamento</a>.
                </p>
            </div>
            <button
                onClick={handleSelectKey}
                className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-100 dark:focus:ring-offset-sky-900/50"
            >
                <KeyIcon />
                Selecionar Chave de API
            </button>
        </div>
    );
};