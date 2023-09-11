import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export type ParsedFileResult = {
    fileName: string;
    text: string;
};

/**
 * Extracts text content from a provided PDF Blob or File.
 * @param pdfFile The PDF file or blob.
 * @returns A promise that resolves with the extracted text content.
 */
const extractTextFromPDF = async (pdfFile: Blob | File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event: ProgressEvent<FileReader>) => {
            if (event.target?.result instanceof ArrayBuffer) {
                const pdfData = new Uint8Array(event.target.result);

                try {
                    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const textItems = textContent.items.map(item => item.str);
                        fullText += textItems.join(' ') + '\n';
                    }

                    resolve(fullText);
                } catch (err) {
                    reject(err);
                }
            } else {
                reject(new Error("Failed to read the PDF file as an ArrayBuffer."));
            }
        };

        reader.onerror = () => {
            reject(new Error("Error reading the PDF file."));
        };

        reader.readAsArrayBuffer(pdfFile);
    });
};

export const extractMultiPDFs = async (files: File[]) => {
    let parsedFiles: ParsedFileResult[] = [];

    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const text = await extractTextFromPDF(file);
                parsedFiles.push({
                    fileName: file.name,
                    text: text
                });
            } catch (error) {
                console.error(`Error extracting text from PDF (${file.name}):`, error);
            }
        }
    }

    // Do something with parsedFiles, e.g., display in the UI or send to a server
    return parsedFiles
}