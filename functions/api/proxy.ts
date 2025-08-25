import { GoogleGenAI, Type } from "@google/genai";

// This is a serverless function that acts as a proxy to the Google AI API.
// It's designed to be deployed on a platform like Cloudflare Pages/Workers, Vercel, or Netlify.

// Define the expected JSON structure for the AI's response.
const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: {
        type: Type.STRING,
        description: "Transaction date in YYYY-MM-DD format.",
      },
      description: {
        type: Type.STRING,
        description: "A brief description of the transaction.",
      },
      debit: {
        type: Type.NUMBER,
        description: "The withdrawal or debit amount as a number. Use null if not applicable.",
      },
      credit: {
        type: Type.NUMBER,
        description: "The deposit or credit amount as a number. Use null if not applicable.",
      },
      balance: {
        type: Type.NUMBER,
        description: "The remaining balance after the transaction as a number.",
      },
    },
    required: ["date", "description", "balance"],
  },
};

export const onRequestPost = async ({ request, env }) => {
  try {
    // IMPORTANT: Set your API_KEY in your deployment environment's secrets.
    // In Cloudflare, it's accessed via the `env` object in the function context.
    const API_KEY = env.API_KEY;

    if (!API_KEY) {
      throw new Error("API_KEY environment variable is not set in Cloudflare secrets.");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const { image, mimeType } = await request.json();

    if (!image || !mimeType) {
      return new Response(JSON.stringify({ error: "Missing image data or mimeType." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `You are an expert financial data extractor. Analyze this bank statement and extract all transactions into a structured JSON array. Each object in the array must match the provided schema. The values for 'debit', 'credit', and 'balance' should be numbers. If a value is not present for a given transaction (e.g., no debit), use null. Ensure the date is in 'YYYY-MM-DD' format.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    // The response.text from a schema-enforced call is a JSON string.
    const transactions = JSON.parse(response.text);

    return new Response(JSON.stringify({ transactions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: "Failed to process statement.", details: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};