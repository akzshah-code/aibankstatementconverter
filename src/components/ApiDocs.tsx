import React, { useState } from 'react';

// Reusable CodeBlock component for syntax highlighting
const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <pre className={`bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm ${className}`}>
        <code className="font-mono">
            {children}
        </code>
    </pre>
);

// Code examples
const codeExamples = {
    curl: `curl -X POST "https://api.aistatementconverter.com/v1/convert" \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: multipart/form-data" \\
     -F "file=@/path/to/your/statement.pdf"`,

    nodejs: `import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const API_KEY = 'YOUR_API_KEY';
const FILE_PATH = '/path/to/your/statement.pdf';

const form = new FormData();
form.append('file', fs.createReadStream(FILE_PATH));

const options = {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
  },
  body: form
};

fetch('https://api.aistatementconverter.com/v1/convert', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));`,

    python: `import requests

API_KEY = "YOUR_API_KEY"
FILE_PATH = "/path/to/your/statement.pdf"
API_URL = "https://api.aistatementconverter.com/v1/convert"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

with open(FILE_PATH, "rb") as f:
    files = {"file": (FILE_PATH, f, "application/pdf")}
    response = requests.post(API_URL, headers=headers, files=files)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}", response.text)`
};

type Language = 'curl' | 'nodejs' | 'python';

interface ApiDocsProps {
    onNavigateHome: () => void;
}

const ApiDocs: React.FC<ApiDocsProps> = ({ onNavigateHome }) => {
    const [activeLang, setActiveLang] = useState<Language>('curl');

    return (
        <div>
            <header className="bg-white shadow-md fixed top-0 w-full z-50">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-robot text-primary text-3xl"></i>
                        <span className="text-xl font-bold text-gray-800">API Documentation</span>
                    </div>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onNavigateHome(); }} 
                        className="px-6 py-2.5 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-colors duration-300"
                    >
                        Back to Main Site
                    </a>
                </nav>
            </header>

            <div className="bg-gray-50 pt-28 pb-12 md:pb-20 animate-fade-in">
                <div className="container mx-auto px-6 max-w-5xl">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">API Documentation</h1>
                        <p className="mt-4 text-lg text-secondary">
                            Integrate our powerful conversion engine directly into your applications.
                        </p>
                    </header>

                    <div className="space-y-12">
                        {/* Introduction */}
                        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our REST API allows you to programmatically convert bank statements. All API endpoints are relative to the base URL: <code className="bg-gray-100 text-sm p-1 rounded">https://api.aistatementconverter.com/v1/</code>. To use the API, you will need an API key, which is available to all users on a paid subscription plan.
                            </p>
                        </section>

                        {/* Authentication */}
                        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication</h2>
                            <p className="text-gray-700 leading-relaxed">
                                All API requests must be authenticated using a Bearer token. Include your API key in the <code className="bg-gray-100 text-sm p-1 rounded">Authorization</code> header of your request.
                            </p>
                            <CodeBlock className="mt-4">
                                Authorization: Bearer YOUR_API_KEY
                            </CodeBlock>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                You can find your API key in your account dashboard after subscribing to a plan. Keep your API key secret and do not expose it in client-side code.
                            </p>
                        </section>

                        {/* Endpoint: Convert */}
                        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Endpoint: Convert Statement</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                This endpoint processes a single bank statement file and returns the extracted transactions as JSON.
                            </p>
                            <div className="flex items-center space-x-3 mb-6">
                                <span className="text-sm font-bold bg-green-600 text-white px-3 py-1 rounded-md">POST</span>
                                <code className="bg-gray-100 text-sm p-2 rounded w-full">/convert</code>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Request Body</h3>
                            <p className="text-gray-700 mb-4">The request must be a <code className="bg-gray-100 text-sm p-1 rounded">multipart/form-data</code> POST request with the following field:</p>
                            
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-2">Parameter</th>
                                            <th className="px-4 py-2">Type</th>
                                            <th className="px-4 py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="px-4 py-2 font-mono">file</td>
                                            <td className="px-4 py-2 font-mono">File</td>
                                            <td className="px-4 py-2 text-gray-700">The bank statement file to process (PDF, JPG, PNG). Max 10MB.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        
                        {/* Code Examples */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Code Examples</h2>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                                <div className="flex border-b border-gray-200">
                                    {(['curl', 'nodejs', 'python'] as Language[]).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLang(lang)}
                                            className={`px-6 py-3 font-semibold text-sm focus:outline-none transition-colors duration-200 ${
                                                activeLang === lang ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'
                                            }`}
                                        >
                                            {lang === 'curl' ? 'cURL' : lang === 'nodejs' ? 'Node.js' : 'Python'}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4">
                                    <CodeBlock>
                                        {codeExamples[activeLang]}
                                    </CodeBlock>
                                </div>
                            </div>
                        </section>
                        
                        {/* Response Example */}
                        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Successful Response (200 OK)</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                On success, the API returns a JSON object containing the status and an array of extracted transaction objects.
                            </p>
                            <CodeBlock>
{`{
  "status": "success",
  "data": {
    "transactions": [
      {
        "date": "2025-06-03",
        "narration": "ATW-405988XXXXXX9458",
        "refNo": "P3ENNZ3C8760",
        "valueDate": "2025-06-03",
        "withdrawalAmt": "10000.00",
        "depositAmt": null,
        "closingBalance": "27062.09"
      },
      // ... more transactions
    ]
  }
}`}
                            </CodeBlock>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocs;
