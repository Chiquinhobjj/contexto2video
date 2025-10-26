import React from 'react';
import type { Source } from '../types';

const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const StatusIndicator: React.FC<{ status: Source['status'] }> = ({ status }) => {
    switch (status) {
        case 'processing': return <span className="text-xs text-yellow-600 dark:text-yellow-400">Processando...</span>;
        case 'ready': return <span className="text-xs text-green-600 dark:text-green-400">Pronto</span>;
        case 'error': return <span className="text-xs text-red-600 dark:text-red-400">Erro</span>;
        default: return null;
    }
}

const SourceIcon: React.FC<{ source: Source }> = ({ source }) => {
    if (source.type === 'file' && source.file?.type.startsWith('audio/')) {
        return <MicIcon />;
    }
    if (source.type === 'url') {
        return <LinkIcon />;
    }
    return <FileTextIcon />;
}

interface SourceListProps {
  sources: Source[];
  onRemove: (id: string) => void;
}

export const SourceList: React.FC<SourceListProps> = ({ sources, onRemove }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Fontes</h3>
      <div className="space-y-2">
        {sources.map(source => (
          <div key={source.id} className="flex items-center justify-between bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="text-slate-500 dark:text-slate-400"><SourceIcon source={source}/></div>
                <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">{source.name}</p>
                    {source.status !== 'pending' && <StatusIndicator status={source.status} />}
                    {source.status === 'error' && source.error && <p className="text-xs text-red-500 truncate">{source.error}</p>}
                </div>
            </div>
            <button 
                onClick={() => onRemove(source.id)} 
                className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={`Remover ${source.name}`}
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};