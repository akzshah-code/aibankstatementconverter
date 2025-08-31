/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Type } from '@google/genai';
import { PDFDocument } from 'pdf-lib';

// Custom error for client-side issues (e.g., bad input) to return a 4xx status.
class ClientError extends Error {
    status: number;
    constructor(message: string, status: number = 400) {
        super(message);
        this.name = 'ClientError';
        this.status = status;
    }
}

// Helper to convert ArrayBuffer to Base64 in a browser/worker environment.
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const transactionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            date: { type: Type.STRING, description: "Transaction date (YYYY-MM-DD)." },
            valueDate: { type: Type.STRING, description: "Value date (YYYY-MM-DD). Use transaction date if not present." },
            description: { type: Type.STRING, description: "Full, clean transaction description/narration." },
            reference: { type: Type.STRING, description: "Cheque or Reference Number, if available." },
            debit: { type: Type.NUMBER, description: "Withdrawal amount (positive number)." },
            credit: { type: Type.NUMBER, description: "Deposit amount (positive number)." },
            balance: { type: Type.NUMBER, description: "Closing balance." },
            category: { type: Type.STRING, description: "A relevant financial category (e.g., 'Shopping', 'Salary')." }
        },
        required: ["date", "valueDate", "description", "balance"],
    }
};

const multimodalTransactionPrompt = `
You are an expert accountant specializing in data extraction. Perform OCR on the provided bank statement (image or PDF) and extract all transactions into the specified JSON format.
- Identify date, value date, description, withdrawal (debit), deposit (credit), and closing balance for every transaction.
- **Value Date is crucial: If a 'Value Date' column exists, use it. If not, 'valueDate' MUST be the same as the 'date'.**
- **Reference Number is crucial: Find any Cheque or Reference Number in the narration and extract it to the 'reference' field. If none exists, leave it null.**
- **Clean Narration: The 'description' must be clean. After extracting the reference number, REMOVE it from the 'description'.**
- Dates must be 'YYYY-MM-DD'.
- Amounts must be pure numbers.
- If no transactions are found, return an empty array [].
`;

const textTransactionPrompt = `
You are an efficient data extraction engine. Convert raw bank statement text into a structured JSON array of transactions. Follow these rules:
1.  **Extract Transactions Only:** A transaction must have a date, description, and amounts. Ignore other lines.
2.  **Dates:** Convert all dates to 'YYYY-MM-DD'. If no 'Value Date' is present, use the transaction date.
3.  **Numbers:** All amounts ('debit', 'credit', 'balance') must be pure numbers without currency symbols or commas.
4.  **Reference Number:** Extract any Cheque/Reference Number from the narration into the 'reference' field.
5.  **Clean Narration:** Remove the extracted reference number from the final 'description'.
6.  **Categorize:** Assign a relevant category (e.g., 'Shopping', 'Salary', 'Rent').
7.  **Empty Files:** If no transactions are found, return an empty JSON array: [].
`;

// This is the serverless function handler.
export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Allow': 'POST' } });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const password = formData.get('password') as string | null;

        if (!file) throw new ClientError('No file provided.');
        
        const MAX_FILE_SIZE_MB = 10;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new ClientError(`File is too large. Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.`);
        }

        if (!process.env.API_KEY) {
            throw new Error("Server configuration error: API_KEY is not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let contentsForApi: any;
        let systemInstruction: string;
        const fileType = file.type;
        const isImage = fileType.startsWith('image/');
        const isPdf = fileType === 'application/pdf';

        if (isImage || isPdf) {
            systemInstruction = multimodalTransactionPrompt;
            let arrayBuffer = await file.arrayBuffer();
            
            if (isPdf) {
                try {
                    const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password || undefined } as any);
                    const newPdfBytes = await pdfDoc.save();
                    arrayBuffer = newPdfBytes.buffer;
                } catch (e: any) {
                    const msg = e.message?.toLowerCase() || '';
                    if (e.name === 'InvalidPasswordError' || msg.includes('incorrect password')) {
                        throw new ClientError("Incorrect password.");
                    }
                    if (msg.includes('unsupported encryption')) {
                        throw new Error("Unsupported encryption. This PDF has a strong encryption that cannot be removed automatically. Please use an external tool like QPDF to decrypt the file first, then re-upload.");
                    }
                    if (!password && msg.includes('encrypted')) {
                        throw new ClientError("PDF is encrypted, but no password was provided.");
                    }
                    throw new Error("This PDF appears to be corrupted or uses an unsupported format. Solution: Open the file on your computer and use the 'Print to PDF' function to create a new, unlocked copy. Then, upload the new file.");
                }
            }
            const base64Data = arrayBufferToBase64(arrayBuffer);
            contentsForApi = { parts: [{ inlineData: { data: base64Data, mimeType: fileType } }] };
        } else if (fileType.startsWith('text/')) {
            systemInstruction = textTransactionPrompt;
            contentsForApi = await file.text();
        } else {
            throw new ClientError(`Unsupported file type: ${fileType}.`);
        }
    
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contentsForApi,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: transactionSchema,
                temperature: 0,
            },
        });

        const resultText = response.text?.trim();
        
        if (!resultText || !['[', '{'].includes(resultText.charAt(0))) {
            console.error("AI returned a non-JSON or empty response:", resultText);
            throw new Error("The AI returned an empty or invalid response. This may be due to an unsupported document format or a content policy violation.");
        }
        
        const transactions = JSON.parse(resultText);
        
        if (!Array.isArray(transactions)) {
            console.error("AI returned a non-array response:", transactions);
            throw new Error("The AI returned data in an unexpected format (expected an array).");
        }
        
        return new Response(JSON.stringify(transactions), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('API Error Details:', {
            message: e.message,
            name: e.name,
            status: e.status, // For ClientError
            stack: e.stack, // Include stack trace for better debugging
        });

        const status = e instanceof ClientError ? e.status : 500;
        const message = e.message || 'An internal server error occurred.';
        
        console.error(`Responding to client with status ${status} and message: "${message}"`);
        return new Response(JSON.stringify({ error: message }), { status });
    }
}