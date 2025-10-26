import type { ScriptData } from '../types';

export function createScriptFile(data: ScriptData): string {
    let content = `Título: ${data.title}\n\n`;
    content += `--- ROTEIRO ---\n\n`;

    data.script.forEach(part => {
        const speakerLabel = part.speaker === 'Narrator' ? 'NARRADOR' : `APRESENTADOR ${part.speaker}`;
        content += `${speakerLabel}:\n${part.text}\n\n`;
    });

    return content;
}