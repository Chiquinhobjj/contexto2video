import React from 'react';

interface UrlInputProps {
  addSources: (source: any) => void;
  disabled: boolean;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 flex-shrink-0">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);


export const UrlInput: React.FC<UrlInputProps> = ({ addSources, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="url"
          placeholder="https://example.com ou https://youtube.com/..."
          disabled={true} // Feature is disabled due to technical limitations
          className="w-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-500 dark:text-slate-500 placeholder-slate-400 dark:placeholder-slate-500 cursor-not-allowed"
        />
      </div>
      <div className="flex items-start bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700/50 rounded-lg p-3">
        <InfoIcon />
        <div>
            <p className="font-semibold text-sm">Aviso de Funcionalidade</p>
            <p className="text-xs mt-1">
                A busca de conteúdo diretamente de páginas web ou do YouTube não é possível neste aplicativo baseado no navegador devido a restrições de segurança da web (CORS). Esta funcionalidade exigiria um componente do lado do servidor para funcionar de forma confiável.
            </p>
            <p className="text-xs mt-2">
                Por enquanto, por favor, copie o texto do site ou use o envio de arquivos para PDFs e outros documentos.
            </p>
        </div>
      </div>
    </div>
  );
};