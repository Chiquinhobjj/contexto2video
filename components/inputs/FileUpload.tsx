import React, { useState, useCallback } from 'react';
import type { Source } from '../../types';
import { generateId } from '../../utils/id';

interface FileUploadProps {
  addSources: (source: Source[]) => void;
  disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const ACCEPTED_FILES = ".txt,.md,.pdf,audio/*";
const ACCEPTED_FILES_TEXT = "arquivos TXT, MD, PDF e áudio";

export const FileUpload: React.FC<FileUploadProps> = ({ addSources, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newSources: Source[] = Array.from(files).map(file => ({
        id: generateId(),
        type: 'file',
        name: file.name,
        status: 'pending',
        content: null,
        file: file,
    }));
    addSources(newSources);
  }, [addSources]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-slate-300 dark:border-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept={ACCEPTED_FILES}
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
      <label htmlFor="file-upload" className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
        <UploadIcon />
        <p className="mt-2 text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-sky-600 dark:text-sky-400">Clique para enviar</span> ou arraste e solte
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Suportado: {ACCEPTED_FILES_TEXT}
        </p>
      </label>
    </div>
  );
};