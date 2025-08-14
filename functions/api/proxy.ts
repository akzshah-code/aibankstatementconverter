// functions/api/proxy.ts
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

interface Env {
  API_KEY: string;
}

export const onRequestPost = async (context: { request: Request; env: Env; }) => {
  try {
    if (!context.env.API_KEY) {
        return new Response(JSON.stringify({ error: "API_KEY environment variable not set." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const ai = new GoogleGenAI({ apiKey: context.env.API_KEY });
    const requestBody: GenerateContentParameters = await context.request.json();

    const { model, contents, config } = requestBody;

    if (!model || !contents) {
      return new Response(JSON.stringify({ error: 'Missing model or contents in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents,
      config,
    });
    
    // Construct a plain JSON object to ensure it's serializable.
    const responseData = {
        text: response.text,
        candidates: response.candidates,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in proxy function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: "Failed to process request in proxy.", details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
