
import React, { useState } from 'react';

// Reusable component for code blocks with a copy button
const CodeBlock: React.FC<{ children: React.ReactNode; lang?: string }> = ({ children, lang = 'bash' }) => {
    const [copied, setCopied] = useState(false);
    
    // Convert children to a flat string for copying
    const textToCopy = React.Children.toArray(children).join('');

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text.');
        });
    };

    return (
        <div className="relative group my-4">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold py-1 px-3 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy code to clipboard"
            >
                {copied ? <><i className="fas fa-check mr-1"></i>Copied!</> : <><i className="fas fa-copy mr-1"></i>Copy</>}
            </button>
            <pre className={`bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm leading-relaxed`}>
                <code className={`language-${lang}`}>
                    {children}
                </code>
            </pre>
        </div>
    );
};

// Badge for HTTP Method
const MethodBadge: React.FC<{ method: 'POST' | 'GET' }> = ({ method }) => {
    const color = method === 'POST' ? 'bg-green-100 text-green-800' : 'bg-teal-100 text-teal-800';
    return <span className={`px-3 py-1 text-sm font-bold rounded-full ${color}`}>{method}</span>;
}

// Badge for HTTP Status Code
const StatusCodeBadge: React.FC<{ code: number, text: string }> = ({ code, text }) => {
    let colorClass = 'bg-gray-100 text-gray-800'; // Default
    if (code >= 200 && code < 300) {
        colorClass = 'bg-green-100 text-green-800';
    } else if (code >= 400 && code < 500) {
        if (code === 400 || code === 422) {
            colorClass = 'bg-yellow-100 text-yellow-800';
        } else {
            colorClass = 'bg-red-100 text-red-800';
        }
    } else if (code >= 500) {
        colorClass = 'bg-red-100 text-red-800';
    }

    return (
        <span className={`inline-block px-3 py-1 font-mono font-bold text-xs rounded-md ${colorClass}`}>
            {code} {text}
        </span>
    );
};

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
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">API Documentation</h1>
                    <p className="mt-4 text-lg text-secondary">
                        Programmatically convert bank statements with our simple and powerful API.
                    </p>
                </header>

                <div className="space-y-12">
                    
                    <section id="authentication" className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Authentication</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                <i className="fas fa-key text-yellow-500 mr-2"></i>
                                <strong>API Token Authentication</strong>
                            </p>
                            <p>All API requests must include an API token for authentication. Tokens can be generated in your account dashboard under the API Tokens section.</p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg my-4">
                                <p><strong className="font-bold">Important:</strong> Only premium users can generate and use API tokens.</p>
                            </div>
                            <p>Your API key carries many privileges, so be sure to keep it secret! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
                        </div>
                    </section>
                    
                    <section id="endpoints" className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">API Endpoints</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 pr-4 font-semibold text-gray-600">Endpoint</th>
                                        <th className="py-2 px-4 font-semibold text-gray-600">Method</th>
                                        <th className="py-2 pl-4 font-semibold text-gray-600">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b last:border-0">
                                        <td className="py-4 pr-4 font-mono text-purple-600">/api/proxy</td>
                                        <td className="py-4 px-4"><MethodBadge method="POST" /></td>
                                        <td className="py-4 pl-4 text-gray-600">Passes a request to the Google Gemini API to analyze a document and extract transactions.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="errors" className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Error Handling</h2>
                        <p className="text-gray-600 mb-4">The API uses standard HTTP status codes to indicate the success or failure of requests.</p>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 font-semibold text-gray-600">Status Code</th>
                                        <th className="py-2 pl-4 font-semibold text-gray-600">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b"><td className="py-3"><StatusCodeBadge code={200} text="OK" /></td><td className="pl-4 text-gray-600">The request was successful.</td></tr>
                                    <tr className="border-b"><td className="py-3"><StatusCodeBadge code={400} text="Bad Request" /></td><td className="pl-4 text-gray-600">The request was invalid or missing required parameters.</td></tr>
                                    <tr className="border-b"><td className="py-3"><StatusCodeBadge code={401} text="Unauthorized" /></td><td className="pl-4 text-gray-600">Authentication failed or token is invalid.</td></tr>
                                    <tr className="border-b"><td className="py-3"><StatusCodeBadge code={403} text="Forbidden" /></td><td className="pl-4 text-gray-600">The authenticated user doesn't have permission to access the resource.</td></tr>
                                    <tr className="border-b"><td className="py-3"><StatusCodeBadge code={500} text="Internal Server Error" /></td><td className="pl-4 text-gray-600">An unexpected error occurred on the server.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="example" className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                         <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Request & Response</h2>
                         <div className="space-y-4 text-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 pt-2">Request Body</h3>
                            <p>The request must be a <code>POST</code> request with a JSON body that is passed through to the Google Gemini API.</p>
                            <h4 className="text-lg font-bold text-gray-800">Key Properties</h4>
                            <ul className="list-disc list-outside space-y-2 pl-5">
                                <li><code>model</code>: (string) <strong className="font-semibold text-gray-900">Required.</strong> Must be <code>"gemini-2.5-flash"</code>.</li>
                                <li><code>contents</code>: (object) <strong className="font-semibold text-gray-900">Required.</strong> Contains the file data and the prompt.
                                    <ul className="list-disc list-outside space-y-2 pl-5 mt-2">
                                        <li><code>parts</code>: (array) <strong className="font-semibold text-gray-900">Required.</strong> An array with two objects: one for the file (<code>inlineData</code>) and one for the prompt (<code>text</code>). The file must be Base64 encoded.</li>
                                    </ul>
                                </li>
                                <li><code>config</code>: (object) <strong className="font-semibold text-gray-900">Required.</strong> Configuration for the AI model.
                                    <ul className="list-disc list-outside space-y-2 pl-5 mt-2">
                                        <li><code>responseMimeType</code>: <strong className="font-semibold text-gray-900">Required.</strong> Must be <code>"application/json"</code>.</li>
                                        <li><code>responseSchema</code>: <strong className="font-semibold text-gray-900">Required.</strong> A specific JSON schema that the AI output must conform to.</li>
                                    </ul>
                                </li>
                            </ul>
                            
                            <h3 className="text-xl font-bold text-gray-800 pt-4">Example Request (cURL)</h3>
                            <CodeBlock lang="bash">{curlExample}</CodeBlock>

                            <h3 className="text-xl font-bold text-gray-800 pt-4">Example Request (JavaScript)</h3>
                            <CodeBlock lang="javascript">{jsExample}</CodeBlock>
                            
                            <h3 className="text-xl font-bold text-gray-800 pt-4">Successful Response</h3>
                            <p>A successful response (<code>200 OK</code>) will return a JSON object from the proxy. The key field is <code>text</code>, which contains a <strong className="font-semibold text-gray-900">stringified JSON array</strong> of the extracted transactions. You must parse this string to get the final JSON object.</p>
                            <CodeBlock lang="json">{successResponseExample}</CodeBlock>
                         </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ApiDocs;
