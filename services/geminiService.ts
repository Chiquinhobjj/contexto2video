import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ScriptData, ScriptPart, VoiceStyle, Voice, OutputLanguage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const ttsModel = 'gemini-2.5-flash-preview-tts';
const videoModel = 'veo-3.1-fast-generate-preview';


const scriptSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise and engaging title for the video, based on the context.",
        },
        visual_summary_prompt: {
            type: Type.STRING,
            description: "A rich, descriptive paragraph that can be used as a prompt to generate a single, representative video. Describe the key themes, objects, and mood of the content."
        },
        script: {
            type: Type.ARRAY,
            description: "An array of script parts, structuring the content for narration or dialogue.",
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: {
                        type: Type.STRING,
                        description: "The designated speaker for this line. Use 'Narrator' for a single speaker, or 'A' and 'B' for a two-person dialogue.",
                    },
                    text: {
                        type: Type.STRING,
                        description: "The spoken text for this part of the script.",
                    },
                },
                required: ["speaker", "text"],
            },
        },
    },
    required: ["title", "visual_summary_prompt", "script"],
};

export async function getScriptJson(context: string, voiceStyle: VoiceStyle, outputLanguage: OutputLanguage): Promise<ScriptData> {
    const languagePrompt = outputLanguage === 'pt-br' ? 'Brazilian Portuguese' : 'English';

    const persona = voiceStyle === 'single'
        ? "Você é um roteirista especialista em vídeos de estilo documentário."
        : "Você é um roteirista especialista que adapta conteúdo para um diálogo de podcast conversacional entre dois apresentadores, Apresentador A e Apresentador B.";

    const systemInstruction = `${persona} Analise o texto do usuário e gere um roteiro. O roteiro deve ser gerado no idioma: ${languagePrompt}. A saída deve ser **exclusivamente** um objeto JSON válido que adere ao esquema fornecido. Estruture a informação em um fluxo lógico para um vídeo curto ou clipe de áudio.`;
    
    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: `Analise o seguinte contexto e crie um roteiro a partir dele: \n\n---CONTEXTO---\n${context}\n---FIM DO CONTEXTO---`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: scriptSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const scriptData = JSON.parse(jsonText);
        
        // Basic validation
        if (!scriptData || !scriptData.title || !scriptData.script) {
            throw new Error("A IA retornou uma estrutura de roteiro inválida.");
        }

        return scriptData as ScriptData;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para geração de roteiro:", error);
        throw new Error("Não foi possível obter um roteiro válido da IA.");
    }
}

export async function generateSpeech(script: ScriptPart[], style: VoiceStyle, voice1: Voice, voice2: Voice): Promise<string> {
    const prompt = script.map(part => {
        if (style === 'single') return part.text;
        return `${part.speaker === 'A' ? 'Joe' : 'Jane'}: ${part.text}`;
    }).join('\n');

    let speechConfig: any = {};
    if (style === 'single') {
        speechConfig = { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice1 } } };
    } else {
        speechConfig = {
            multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                    { speaker: 'Joe', voiceConfig: { prebuiltVoiceConfig: { voiceName: voice1 } } },
                    { speaker: 'Jane', voiceConfig: { prebuiltVoiceConfig: { voiceName: voice2 } } }
                ]
            }
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: ttsModel,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig,
            },
        });
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) {
            throw new Error("Nenhum dado de áudio recebido da API.");
        }
        return audioData;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para TTS:", error);
        throw new Error("Falha ao gerar a fala.");
    }
}


export async function generateVideo(prompt: string): Promise<any> {
    try {
        const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const operation = await aiWithKey.models.generateVideos({
            model: videoModel,
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
        return operation;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para geração de vídeo:", error);
        if (error instanceof Error && error.message.includes("not found")) {
             throw new Error("A geração de vídeo falhou. Por favor, certifique-se de que a chave de API selecionada é válida e tem acesso ao modelo Veo. Pode ser necessário selecionar sua chave novamente.");
        }
        throw new Error("Falha ao iniciar a geração do vídeo.");
    }
}

export async function getVideosOperation(params: { operation: any }): Promise<any> {
    try {
        const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
        return await aiWithKey.operations.getVideosOperation(params);
    } catch (error) {
        console.error("Erro ao consultar a operação de vídeo:", error);
        throw new Error("Falha ao obter o status da geração do vídeo.");
    }
}


export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    try {
        const audioPart = { inlineData: { mimeType, data: base64Audio } };
        const textPart = { text: "Transcreva o arquivo de áudio fornecido. Responda apenas com o texto transcrito." };
        const response = await ai.models.generateContent({
            model: textModel,
            contents: { parts: [audioPart, textPart] },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para transcrição:", error);
        throw new Error("Falha ao transcrever o áudio.");
    }
}