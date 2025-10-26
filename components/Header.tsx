import React from 'react';
import { Theme } from '../App';
import { ThemeToggle } from './ThemeToggle';

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-sky-500 dark:text-sky-400">
        <path d="m22 8-6 4 6 4V8Z"></path>
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
    </svg>
);


interface HeaderProps {
    theme: Theme;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="text-center relative">
      <div className="absolute top-0 right-0">
         <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <VideoIcon/>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 text-transparent bg-clip-text">
          Contexto para Vídeo
        </h1>
      </div>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Forneça seu conteúdo bruto — artigos, anotações ou arquivos — e deixe a IA gerar um vídeo narrado com vozes personalizadas.
      </p>
    </header>
  );
};