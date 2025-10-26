// This tells TypeScript that pdfjsLib will be available on the window object.
declare global {
    interface Window {
        pdfjsLib: any;
    }
}

async function readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsText(file);
    });
}

async function readPdfFile(file: File): Promise<string> {
    if (typeof window.pdfjsLib === 'undefined') {
        throw new Error('PDF.js library is not loaded.');
    }
    
    // The worker is needed to process the PDF.
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const pdf = await window.pdfjsLib.getDocument(event.target!.result).promise;
                let textContent = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    textContent += text.items.map((item: any) => item.str).join(' ');
                    textContent += '\n'; // Add newline after each page
                }
                resolve(textContent);
            } catch (error) {
                reject(new Error(`Failed to parse PDF: ${file.name}`));
            }
        };
        reader.onerror = () => reject(new Error(`Failed to read PDF file: ${file.name}`));
        reader.readAsArrayBuffer(file);
    });
}

async function readAudioFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // The result includes the "data:mime/type;base64," prefix, which we need to remove.
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = () => reject(new Error(`Failed to read audio file: ${file.name}`));
        reader.readAsDataURL(file);
    });
}


export async function processFile(file: File): Promise<{ content: string, isAudio: boolean }> {
    if (file.type.startsWith('audio/')) {
        const content = await readAudioFile(file);
        return { content, isAudio: true };
    }
    if (file.type === 'application/pdf') {
        const content = await readPdfFile(file);
        return { content, isAudio: false };
    }
    if (file.type === 'text/plain' || file.type === 'text/markdown') {
        const content = await readTextFile(file);
        return { content, isAudio: false };
    }
    throw new Error(`Unsupported file type: ${file.type}`);
}