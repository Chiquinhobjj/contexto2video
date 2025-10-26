import React, { useState } from 'react';
import type { Source } from '../types';
import { generateId } from '../utils/id';

interface TextInputAreaProps {
  addSources: (sources: Source[]) => void;
  disabled: boolean;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({ addSources, disabled }) => {
    const [text, setText] = useState('');

    const handleAddText = () => {
        if (!text.trim()) return;
        const newSource: Source = {
            id: generateId(),
            type: 'text',
            name: `Texto Colado`,
            status: 'ready',
            content: text,
        };
        addSources([newSource]);
        setText('');
    };

  return (
    <div className="flex-grow flex flex-col">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Comece colando seu conteúdo aqui..."
        className="w-full h-48 bg-white dark:bg-slate-900/70 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        onClick={handleAddText} 
        disabled={disabled || !text.trim()}
        className="mt-4 self-end px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
      >
        Adicionar Texto como Fonte
      </button>
    </div>
  );
};