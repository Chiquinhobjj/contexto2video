export interface ScriptPart {
  speaker: 'A' | 'B' | 'Narrator';
  text: string;
}

export interface ScriptData {
  title: string;
  visual_summary_prompt: string;
  script: ScriptPart[];
}

export type SourceType = 'text' | 'file' | 'url';
export type SourceStatus = 'pending' | 'processing' | 'ready' | 'error';

export interface Source {
    id: string;
    type: SourceType;
    name: string;
    status: SourceStatus;
    content: string | null;
    file?: File;
    error?: string;
}

export const VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'] as const;
export type Voice = typeof VOICES[number];

export type VoiceStyle = 'single' | 'podcast';
export type OutputType = 'video' | 'audio';
export type OutputLanguage = 'pt-br' | 'en';