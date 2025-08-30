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
        description: "Transaction date in 'Month Day, Year' format (e.g., 'Jul 1, 2024').",
      },
      description: {
        type: Type.STRING,
        description: "A brief description of the transaction.",
      },
      amount: {
        type: Type.NUMBER,
        description: "The transaction amount. Use positive values for credits/deposits and negative for debits/withdrawals.",
      },
      currency: {
        type: Type.STRING,
        description: "The 3-letter currency code (e.g., USD, INR).",
      },
      type: {
        type: Type.STRING,
        description: "The transaction type, must be either 'Credit' or 'Debit'.",
      },
    },
    // Make all fields required to ensure data quality.
    required: ["date", "description", "amount", "currency", "type"],
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
      text: `You are an expert financial data extractor. Analyze this bank statement image and extract all transactions into a structured JSON array. Each object in the array must strictly match the provided schema.

      - 'date': Format as 'Month Day, Year' (e.g., 'Jul 1, 2024').
      - 'description': Provide a clean, concise transaction description.
      - 'amount': Must be a number. Use negative values for debits/withdrawals and positive values for credits/deposits.
      - 'currency': The 3-letter currency code (e.g., USD, INR).
      - 'type': Must be the string 'Credit' for deposits or 'Debit' for withdrawals.
      
      Do not include any transactions that are summaries or running totals. Only extract individual line-item transactions.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const responseText = response.text;
    let transactions;

    // Defensively parse the JSON response from the AI.
    // This prevents crashes if the model returns a malformed or empty string.
    try {
      if (!responseText) {
        throw new Error("AI model returned an empty response.");
      }
      transactions = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response. Raw text:", responseText);
      throw new Error(`AI model returned invalid JSON. Details: ${parseError.message}`);
    }


    return new Response(JSON.stringify({ transactions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    
    // Attempt to extract the status code from the error object thrown by the Gemini API client.
    // The 'cause' property often holds the original fetch response error.
    const status = (error as any)?.cause?.status || 500;

    return new Response(JSON.stringify({ error: "Failed to process statement.", details: errorMessage }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};