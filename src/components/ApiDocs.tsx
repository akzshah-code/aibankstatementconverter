import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode; lang?: string }> = ({ children, lang = 'bash' }) => (
    <pre className={`bg-gray-800 text-white p-4 rounded-lg my-4 overflow-x-auto text-sm`}>
        <code className={`language-${lang}`}>
            {children}
        </code>
    </pre>
);

const ApiDocs: React.FC = () => {
    const curlExample = `curl -X POST 'https://your-domain.com/api/proxy' \\
-H 'Content-Type: application/json' \\
-d '{
  "model": "gemini-2.5-flash",
  "contents": {
    "parts": [
      {
        "inlineData": {
          "data": "YOUR_BASE64_ENCODED_FILE_STRING",
          "mimeType": "application/pdf"
        }
      },
      {
        "text": "Analyze this bank statement and extract all transactions into a structured JSON..."
      }
    ]
  },
  "config": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "date": { "type": "STRING" },
          "narration": { "type": "STRING" },
          "refNo": { "type": "STRING" },
          "valueDate": { "type": "STRING" },
          "withdrawalAmt": { "type": "NUMBER" },
          "depositAmt": { "type": "NUMBER" },
          "closingBalance": { "type": "NUMBER" }
        },
        "required": ["date", "narration", "valueDate", "closingBalance"]
      }
    }
  }
}'`;

    const jsExample = `const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

async function convertStatement(file) {
    const base64Data = await fileToBase64(file);

    const requestBody = {
      model: 'gemini-2.5-flash',
      contents: { /* ... see full request structure ... */ },
      config: { /* ... see full schema config ... */ }
    };
    
    // Update contents with actual file data
    requestBody.contents.parts[0].inlineData.data = base64Data;
    requestBody.contents.parts[0].inlineData.mimeType = file.type;

    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    const transactions = JSON.parse(data.text);
    console.log(transactions);
}
`;

    const successResponseExample = `{
    "text": "[{\\"date\\":\\"2025-06-03\\",\\"narration\\":\\"ATW-405988...\\",...}]",
    "candidates": [
        {
            "content": { /* ... */ },
            "finishReason": "STOP",
            "index": 0,
            "safetyRatings": [ /* ... */ ]
        }
    ]
}`;

    return (
        <div className="bg-gray-50 py-12 md:py-20 animate-fade-in">
            <div className="container mx-auto px-6 max-w-5xl">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">API Documentation</h1>
                    <p className="mt-4 text-lg text-secondary">
                        Programmatically convert bank statements.
                    </p>
                </header>

                <article className="prose lg:prose-xl max-w-none bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <h2 id="introduction">Introduction</h2>
                    <p>Our API allows you to integrate bank statement conversion directly into your applications. By sending a file, you can receive structured JSON data containing all the extracted transactions. API usage is metered against your user account's subscription plan.</p>

                    <h2 id="endpoint">API Endpoint</h2>
                    <p>All API requests should be made to the following endpoint:</p>
                    <CodeBlock lang="http">
                        <span className="font-bold text-green-400">POST</span> https://your-domain.com/api/proxy
                    </CodeBlock>
                    <p>Note: When calling from the front-end of this application, you can use the relative path <code>/api/proxy</code>.</p>


                    <h2 id="request">Request Body</h2>
                    <p>The request must be a <code>POST</code> request with a JSON body. The body is a direct pass-through to the Google Gemini API.</p>
                    
                    <h3>Key Properties</h3>
                    <ul>
                        <li><code>model</code>: (string) Must be <code>"gemini-2.5-flash"</code>.</li>
                        <li><code>contents</code>: (object) Contains the file data and the prompt.
                            <ul>
                                <li><code>parts</code>: (array) An array containing two objects: one for the file (<code>inlineData</code>) and one for the prompt (<code>text</code>).</li>
                            </ul>
                        </li>
                        <li><code>config</code>: (object) Configuration for the AI model.
                             <ul>
                                <li><code>responseMimeType</code>: (string) Must be <code>"application/json"</code>.</li>
                                <li><code>responseSchema</code>: (object) A specific JSON schema that the AI output must conform to. See the example for the required structure.</li>
                            </ul>
                        </li>
                    </ul>

                    <h3>File Encoding</h3>
                    <p>The file (PDF, JPG, PNG) must be Base64 encoded and included in the <code>inlineData.data</code> field.</p>
                    
                    <h2 id="examples">Code Examples</h2>
                    
                    <h3>cURL Example</h3>
                    <CodeBlock lang="bash">{curlExample}</CodeBlock>

                    <h3>JavaScript (Fetch) Example</h3>
                    <CodeBlock lang="javascript">{jsExample}</CodeBlock>

                    <h2 id="response">Successful Response</h2>
                    <p>A successful response (<code>200 OK</code>) will return a JSON object containing the AI's raw output. The key field is <code>text</code>, which contains a stringified JSON array of the extracted transactions. You will need to parse this string to get the final JSON data.</p>
                    <CodeBlock lang="json">{successResponseExample}</CodeBlock>
                    
                    <h2 id="errors">Error Handling</h2>
                    <p>If an error occurs, the API will respond with an appropriate HTTP status code and a JSON body containing error details.</p>
                    <ul>
                        <li><code>400 Bad Request</code>: The request body is malformed or missing required fields.</li>
                        <li><code>500 Internal Server Error</code>: An error occurred on our server or while communicating with the Gemini API. The response body may contain more details.</li>
                    </ul>
                </article>
            </div>
        </div>
    );
};

export default ApiDocs;
