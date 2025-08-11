import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI, Type } from '@google/genai';
import { PDFDocument } from 'pdf-lib';
import 'dotenv/config';

// --- Server Configuration ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Parse JSON request bodies
const upload = multer({ storage: multer.memoryStorage() }); // Store uploaded files in memory

// --- Gemini API Initialization ---
// IMPORTANT: Ensure the API_KEY is set in your environment variables.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- In-Memory User & Quota Simulation ---
// This is a simplified simulation to mimic the frontend's UserContext.
// In a real production app, this would be a database.
const PLANS = {
  'Anonymous': { pagesPerDay: 1 },
  'Free': { pagesPerDay: 5 },
  'Starter': { pagesPerMonth: 400 },
  'Professional': { pagesPerMonth: 1000 },
  'Business': { pagesPerMonth: 4000 },
};
const users = []; // In-memory user store
const anonymousUsage = new Map(); // Tracks usage by IP for anonymous users

const findOrCreateUser = (email) => {
    if (!email) return null;
    let user = users.find(u => u.email === email);
    if (!user) {
        user = {
            email,
            plan: 'Free', // Default to Free for new registrations
            usage: { count: 0, resetDate: new Date().toISOString().slice(0, 10) }
        };
        users.push(user);
    }
    return user;
};

const checkQuota = (user, ip, pages) => {
    const today = new Date().toISOString().slice(0, 10);
    if (user) { // Registered User
        const plan = PLANS[user.plan];
        if (user.usage.resetDate !== today) {
            user.usage = { count: 0, resetDate: today };
        }
        if (user.usage.count + pages > plan.pagesPerDay) {
            return false;
        }
    } else { // Anonymous User
        const usage = anonymousUsage.get(ip) || { count: 0, resetDate: '1970-01-01' };
        if (usage.resetDate !== today) {
            anonymousUsage.set(ip, { count: 0, resetDate: today });
        }
        if ((anonymousUsage.get(ip)?.count ?? 0) + pages > PLANS.Anonymous.pagesPerDay) {
            return false;
        }
    }
    return true;
};

const recordUsage = (user, ip, pages) => {
    if (user) {
        user.usage.count += pages;
    } else if (ip) {
        const usage = anonymousUsage.get(ip) || { count: 0, resetDate: new Date().toISOString().slice(0, 10) };
        usage.count += pages;
        anonymousUsage.set(ip, usage);
    }
};

// --- API Endpoints ---

/**
 * Handles file conversion requests.
 * 1. Checks user quota.
 * 2. Unlocks PDF if password is provided.
 * 3. Sends file to Gemini for data extraction.
 * 4. Returns structured JSON data.
 */
app.post('/api/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { password } = req.body;
    const userEmail = req.headers['x-user-email'] || '';
    const user = findOrCreateUser(userEmail);
    const userIp = req.ip;

    try {
        let fileBuffer = req.file.buffer;
        let pageCount = 1; // Default page count for non-PDFs or for quota check before counting

        // Handle PDF unlocking and page counting
        if (req.file.mimetype === 'application/pdf') {
            try {
                const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
                if (pdfDoc.isEncrypted) {
                    if (!password) {
                        // Frontend expects this specific detail to show the password prompt
                        return res.status(400).json({ error: 'PDF is password-protected.', detail: 'unlock_failed' });
                    }
                    // Try to decrypt with the provided password
                    const unlockedDoc = await PDFDocument.load(fileBuffer, { password });
                    pageCount = unlockedDoc.getPageCount();
                    fileBuffer = await unlockedDoc.save(); // Use the unlocked PDF buffer
                } else {
                    pageCount = pdfDoc.getPageCount();
                }
            } catch (err) {
                 // Incorrect password or other pdf-lib error
                 console.error("PDF processing error:", err.message);
                 return res.status(400).json({ error: 'Incorrect password or corrupted PDF.', detail: 'unlock_failed' });
            }
        }
        
        // Quota check
        if (!checkQuota(user, userIp, pageCount)) {
            return res.status(429).json({ error: 'You have exceeded your page quota for the day.', detail: 'quota_exceeded' });
        }

        // Define the expected JSON output structure for Gemini
        const transactionSchema = {
            type: Type.OBJECT,
            properties: {
                date: { type: Type.STRING, description: 'Transaction date in YYYY-MM-DD format.' },
                narration: { type: Type.STRING, description: 'The full transaction description or narration.' },
                refNo: { type: Type.STRING, description: 'Cheque or reference number, if available.', nullable: true },
                valueDate: { type: Type.STRING, description: 'Value date in YYYY-MM-DD format.', nullable: true },
                withdrawalAmt: { type: Type.NUMBER, description: 'Withdrawal amount as a number, or null.', nullable: true },
                depositAmt: { type: Type.NUMBER, description: 'Deposit amount as a number, or null.', nullable: true },
                closingBalance: { type: Type.NUMBER, description: 'The closing balance after the transaction.' },
            },
            required: ['date', 'narration', 'closingBalance']
        };

        const responseSchema = {
            type: Type.ARRAY,
            items: transactionSchema
        };
        
        const prompt = `
            You are an expert financial data extraction tool.
            Analyze the provided bank statement image or PDF page.
            Extract all transactional data row by row.
            Return the data as a JSON array that strictly adheres to the provided schema.
            - "date" and "valueDate" must be in YYYY-MM-DD format.
            - "withdrawalAmt" and "depositAmt" should be numbers. If a transaction is a withdrawal, depositAmt should be null, and vice-versa.
            - If a value for a nullable field (refNo, valueDate, withdrawalAmt, depositAmt) is not present, use null.
            - Do not include any introductory text, explanations, or markdown formatting. Only output the raw JSON array.
        `;
        
        // Call Gemini API
        const filePart = {
            inlineData: {
                mimeType: req.file.mimetype,
                data: fileBuffer.toString('base64'),
            },
        };
        
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [filePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        // The 'text' property directly contains the JSON string when a schema is used
        const extractedData = JSON.parse(result.text);

        // Record usage after successful conversion
        recordUsage(user, userIp, pageCount);

        res.json({
            data: extractedData,
            pageCount: pageCount
        });

    } catch (error) {
        console.error('Conversion API Error:', error);
        res.status(500).json({ error: 'An unexpected error occurred during conversion.', detail: error.message });
    }
});


/**
 * Handles chat requests about the extracted data.
 */
app.post('/api/chat', async (req, res) => {
    const { transactions, message } = req.body;

    if (!transactions || !message) {
        return res.status(400).json({ error: 'Missing transactions or message in request.' });
    }

    try {
        const systemInstruction = `You are a friendly and helpful financial assistant.
        The user has provided you with their bank transaction data in JSON format.
        Your task is to answer the user's questions based *only* on this data.
        Be concise, accurate, and helpful. Do not make up information.
        If the answer cannot be found in the provided data, say so clearly.`;
        
        const userPrompt = `
            Here is my transaction data:
            \`\`\`json
            ${JSON.stringify(transactions, null, 2)}
            \`\`\`

            My question is: "${message}"
        `;
        
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        res.json({ response: result.text });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to communicate with the AI model.' });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});