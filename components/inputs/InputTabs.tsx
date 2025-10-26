import React, { useState } from 'react';
import { TextInputArea } from '../TextInputArea';
import { FileUpload } from './FileUpload';
import { UrlInput } from './UrlInput';
import type { Source } from '../../types';

interface InputTabsProps {
  addSources: (sources: Source[]) => void;
  disabled: boolean;
}

type Tab = 'text' | 'upload' | 'url';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
            active 
                ? 'bg-white dark:bg-slate-900/80 text-sky-600 dark:text-sky-400 border-b-2 border-sky-500' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
    >
        {children}
    </button>
);

export const InputTabs: React.FC<InputTabsProps> = ({ addSources, disabled }) => {
    const [activeTab, setActiveTab] = useState<Tab>('text');

    return (
        <div>
            <div className="border-b border-slate-300 dark:border-slate-700 mb-4">
                <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')}>Colar Texto</TabButton>
                <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>Enviar Arquivos</TabButton>
                <TabButton active={activeTab === 'url'} onClick={() => setActiveTab('url')}>A partir de URL</TabButton>
            </div>
            <div>
                {activeTab === 'text' && <TextInputArea addSources={addSources} disabled={disabled} />}
                {activeTab === 'upload' && <FileUpload addSources={addSources} disabled={disabled} />}
                {activeTab === 'url' && <UrlInput addSources={addSources} disabled={disabled} />}
            </div>
        </div>
    );
};