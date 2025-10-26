import React from 'react';
import type { ScriptData } from '../types';
import { createScriptFile } from '../utils/subtitleUtils';

interface ResultsDisplayProps {
    results: {
        videoUrl?: string;
        audioUrl?: string;
        script?: ScriptData;
        title: string;
    };
    onReset: () => void;
}

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l-3 2.7"/></svg>;


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset }) => {
    
    const handleDownloadScript = () => {
        if (!results.script) return;
        const fileContent = createScriptFile(results.script);
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${results.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_roteiro.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const DownloadButton: React.FC<{ href?: string, downloadName: string, onClick?: () => void, children: React.ReactNode }> = ({ href, downloadName, onClick, children }) => (
        <a 
            href={href} 
            download={downloadName}
            onClick={onClick}
            className="flex-1 min-w-[120px] text-center inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-500 disabled:bg-slate-500"
        >
            {children}
        </a>
    );


    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl shadow-2xl p-6 md:p-8 ring-1 ring-slate-200 dark:ring-white/10 flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{results.title}</h2>
            
            <div className="flex-grow w-full space-y-6">
                {results.videoUrl && (
                    <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Vídeo (Silencioso)</p>
                        <video controls src={results.videoUrl} className="w-full rounded-lg bg-black" />
                    </div>
                )}
                {results.audioUrl && (
                     <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Áudio Gerado</p>
                        <audio controls src={results.audioUrl} className="w-full" />
                    </div>
                )}
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Downloads</h3>
                <div className="flex flex-wrap items-center gap-3">
                    {results.videoUrl && <DownloadButton href={results.videoUrl} downloadName={`${results.title}.mp4`}><DownloadIcon/>Vídeo (MP4)</DownloadButton>}
                    {results.audioUrl && <DownloadButton href={results.audioUrl} downloadName={`${results.title}.mp3`}><DownloadIcon/>Áudio (MP3)</DownloadButton>}
                    {results.script && <DownloadButton onClick={handleDownloadScript} downloadName={`${results.title}_roteiro.txt`}><DownloadIcon/>Roteiro (TXT)</DownloadButton>}
                </div>
            </div>

            <div className="mt-8 text-center">
                 <button 
                    onClick={onReset} 
                    className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                    <RedoIcon/>
                    Começar de Novo
                </button>
            </div>
        </div>
    );
};