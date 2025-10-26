import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GenerateButton } from './components/GenerateButton';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { getScriptJson, transcribeAudio, generateSpeech, generateVideo, getVideosOperation } from './services/geminiService';
import { InputTabs } from './components/inputs/InputTabs';
import { SourceList } from './components/SourceList';
import type { Source, Voice, VoiceStyle, OutputType, ScriptData, OutputLanguage } from './types';
import { processFile } from './utils/fileUtils';
import { generateId } from './utils/id';
import { OutputOptions } from './components/OutputOptions';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ApiKeySelector } from './components/ApiKeySelector';


type AppStatus = 'idle' | 'loading' | 'error' | 'success';
export type Theme = 'light' | 'dark';

export default function App() {
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ videoUrl?: string; audioUrl?: string; script?: ScriptData, title: string } | null>(null);

  // --- Output Settings State ---
  const [outputType, setOutputType] = useState<OutputType>('video');
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('pt-br');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('single');
  const [voice1, setVoice1] = useState<Voice>('Kore');
  const [voice2, setVoice2] = useState<Voice>('Puck');

  // --- Theme State ---
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // --- VEO API Key State ---
  const [hasApiKey, setHasApiKey] = useState(false);
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        setHasApiKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
  }, []);


  const updateSource = useCallback((id: string, updates: Partial<Source>) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const processSources = useCallback(async (newSources: Source[]) => {
    for (const source of newSources) {
      if (source.type === 'file' && source.file) {
        updateSource(source.id, { status: 'processing' });
        try {
          const { content, isAudio } = await processFile(source.file);
          if (isAudio) {
            const transcription = await transcribeAudio(content, source.file.type);
            updateSource(source.id, { status: 'ready', content: transcription });
          } else {
            updateSource(source.id, { status: 'ready', content });
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Falha ao processar o arquivo.';
          updateSource(source.id, { status: 'error', error: message });
        }
      }
    }
  }, [updateSource]);

  const addSources = useCallback((newSources: Source[]) => {
    setSources(prev => [...prev, ...newSources]);
    processSources(newSources);
  }, [processSources]);

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleGenerate = useCallback(async () => {
    const readySources = sources.filter(s => s.status === 'ready' && s.content);
    if (readySources.length === 0) {
      setError('Por favor, adicione algum conteúdo primeiro.');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    setError(null);
    setResults(null);

    const combinedContext = readySources.map(s => `Fonte: ${s.name}\n\n${s.content}`).join('\n\n---\n\n');
    
    try {
      // Step 1: Get Script
      setLoadingMessage('Gerando roteiro...');
      const scriptData = await getScriptJson(combinedContext, voiceStyle, outputLanguage);

      // Step 2: Generate Audio
      setLoadingMessage('Sintetizando áudio...');
      const audioBase64 = await generateSpeech(scriptData.script, voiceStyle, voice1, voice2);
      const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (outputType === 'audio') {
        setResults({ audioUrl, script: scriptData, title: scriptData.title });
        setStatus('success');
        return;
      }

      // Step 3: Generate Video (Async)
      setLoadingMessage('Gerando vídeo... Isso pode levar vários minutos.');
      let operation = await generateVideo(scriptData.visual_summary_prompt);
      
      // Step 4: Poll for Video Result
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        operation = await getVideosOperation({ operation });
      }

      if (operation.error) {
        throw new Error(operation.error.message || 'A geração do vídeo falhou.');
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) {
        throw new Error('Não foi possível recuperar o link de download do vídeo.');
      }
      
      setLoadingMessage('Baixando vídeo...');
      const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!videoResponse.ok) {
        throw new Error('Falha ao baixar o vídeo gerado.');
      }
      const videoBlob = await videoResponse.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      
      setResults({ videoUrl, audioUrl, script: scriptData, title: scriptData.title });
      setStatus('success');

    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
      setError(`Falha ao gerar. ${errorMessage}`);
      setStatus('error');
    } finally {
        setLoadingMessage('');
    }
  }, [sources, voiceStyle, voice1, voice2, outputType, outputLanguage]);

  const isProcessingFiles = sources.some(s => s.status === 'processing');
  const hasReadySources = sources.some(s => s.status === 'ready');
  const showApiKeySelector = outputType === 'video' && !hasApiKey;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <main className="flex-grow flex flex-col mt-8">
            {status === 'success' && results ? (
                <ResultsDisplay results={results} onReset={() => { setStatus('idle'); setResults(null); }} />
            ) : (
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl shadow-2xl p-6 md:p-8 ring-1 ring-slate-200 dark:ring-white/10 flex-grow flex flex-col">
                    <InputTabs addSources={addSources} disabled={status === 'loading'} />
                    
                    <SourceList sources={sources} onRemove={removeSource} />
                    
                    <OutputOptions 
                        voiceStyle={voiceStyle} setVoiceStyle={setVoiceStyle}
                        voice1={voice1} setVoice1={setVoice1}
                        voice2={voice2} setVoice2={setVoice2}
                        outputType={outputType} setOutputType={setOutputType}
                        outputLanguage={outputLanguage} setOutputLanguage={setOutputLanguage}
                        disabled={status === 'loading'}
                    />

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {status === 'loading' || isProcessingFiles ? (
                          <Loader text={loadingMessage || "Processando arquivos..."} />
                        ) : (
                          <>
                            {showApiKeySelector ? (
                                <ApiKeySelector onKeySelected={() => setHasApiKey(true)}/>
                            ) : (
                                <GenerateButton 
                                    onClick={handleGenerate} 
                                    disabled={!hasReadySources || isProcessingFiles || showApiKeySelector}
                                    text={outputType === 'video' ? 'Gerar Vídeo' : 'Gerar Áudio'}
                                />
                            )}
                          </>
                        )}
                        {status === 'error' && error && <ErrorDisplay message={error} />}
                    </div>
                </div>
            )}
        </main>

        <footer className="text-center mt-8 text-slate-500 dark:text-slate-500 text-sm">
          <p>Desenvolvido com Gemini. IA para criatividade estruturada.</p>
        </footer>
      </div>
    </div>
  );
}