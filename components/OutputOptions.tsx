import React from 'react';
import type { Voice, VoiceStyle, OutputType, OutputLanguage } from '../types';
import { VOICES } from '../types';

interface OutputOptionsProps {
    voiceStyle: VoiceStyle;
    setVoiceStyle: (style: VoiceStyle) => void;
    voice1: Voice;
    setVoice1: (voice: Voice) => void;
    voice2: Voice;
    setVoice2: (voice: Voice) => void;
    outputType: OutputType;
    setOutputType: (type: OutputType) => void;
    outputLanguage: OutputLanguage;
    setOutputLanguage: (lang: OutputLanguage) => void;
    disabled: boolean;
}

const RadioButton: React.FC<{ id: string; name?: string; value: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string; disabled: boolean; }> = ({ id, name, value, checked, onChange, label, disabled }) => (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
        <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    </label>
);

const Select: React.FC<{ id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; label: string; disabled: boolean; options: readonly string[] }> = ({ id, value, onChange, label, disabled, options }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
        <select id={id} value={value} onChange={onChange} disabled={disabled} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md disabled:opacity-50">
            {options.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
    </div>
);


export const OutputOptions: React.FC<OutputOptionsProps> = ({ voiceStyle, setVoiceStyle, voice1, setVoice1, voice2, setVoice2, outputType, setOutputType, outputLanguage, setOutputLanguage, disabled }) => {
    return (
        <div className="mt-6 p-4 border-t border-slate-200 dark:border-slate-700/50">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Configurações de Saída</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                
                {/* Output Type Selection */}
                <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Formato</p>
                    <div className="flex space-x-4">
                        <RadioButton id="type-video" name="outputType" value="video" checked={outputType === 'video'} onChange={() => setOutputType('video')} label="Vídeo + Áudio" disabled={disabled} />
                        <RadioButton id="type-audio" name="outputType" value="audio" checked={outputType === 'audio'} onChange={() => setOutputType('audio')} label="Apenas Áudio" disabled={disabled} />
                    </div>
                </div>

                 {/* Output Language Selection */}
                 <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Idioma de Saída</p>
                    <div className="flex space-x-4">
                        <RadioButton id="lang-pt" name="outputLang" value="pt-br" checked={outputLanguage === 'pt-br'} onChange={() => setOutputLanguage('pt-br')} label="Português (Brasil)" disabled={disabled} />
                        <RadioButton id="lang-en" name="outputLang" value="en" checked={outputLanguage === 'en'} onChange={() => setOutputLanguage('en')} label="Inglês" disabled={disabled} />
                    </div>
                </div>

                {/* Voice Style Selection */}
                <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Estilo do Áudio</p>
                    <div className="flex space-x-4">
                        <RadioButton id="style-single" name="voiceStyle" value="single" checked={voiceStyle === 'single'} onChange={() => setVoiceStyle('single')} label="Narrador Único" disabled={disabled} />
                        <RadioButton id="style-podcast" name="voiceStyle" value="podcast" checked={voiceStyle === 'podcast'} onChange={() => setVoiceStyle('podcast')} label="Dois Apresentadores" disabled={disabled} />
                    </div>
                </div>

                {/* Voice Selectors */}
                <div className={`md:col-span-2 grid gap-4 ${voiceStyle === 'podcast' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <Select id="voice1" label={voiceStyle === 'podcast' ? "Apresentador A" : "Voz do Narrador"} value={voice1} onChange={(e) => setVoice1(e.target.value as Voice)} disabled={disabled} options={VOICES} />
                    {voiceStyle === 'podcast' && (
                        <Select id="voice2" label="Apresentador B" value={voice2} onChange={(e) => setVoice2(e.target.value as Voice)} disabled={disabled} options={VOICES.filter(v => v !== voice1)} />
                    )}
                </div>
            </div>
        </div>
    );
};