import React, { useState } from 'react';

// Reusable components
const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <pre className={`bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm ${className}`}>
    <code className="font-mono">{children}</code>
  </pre>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-4">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    {children}
  </section>
);

const Table: React.FC = () => (
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
          <td className="px-4 py-2 text-gray-700">
            The bank statement file to process (PDF, JPG, PNG). Max 10MB.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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

fetch('https://api.aistatementconverter.com/v1/convert', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${API_KEY}\` },
  body: form
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));`,

  python: `import requests

API_KEY = "YOUR_API_KEY"
FILE_PATH = "/path/to/your/statement.pdf"

with open(FILE_PATH, "rb") as f:
    files = {"file": (FILE_PATH, f, "application/pdf")}
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.post("https://api.aistatementconverter.com/v1/convert", headers=headers, files=files)

if response.ok:
    print(response.json())
else:
    print("Error:", response.status_code, response.text)`
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
            className="px-6 py-2.5 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-colors"
          >
            Back to Main Site
          </a>
        </nav>
      </header>

      <main className="bg-gray-50 pt-28 pb-20 animate-fade-in">
        <div className="container mx-auto px-6 max-w-5xl space-y-12">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">API Documentation</h1>
            <p className="mt-4 text-lg text-secondary">
              Integrate our powerful conversion engine directly into your applications.
            </p>
          </header>

          <Section title="Getting Started">
            <p className="text-gray-700">
              Our REST API allows you to programmatically convert bank statements.
              All endpoints are relative to: <code className="bg-gray-100 p-1 rounded">https://api.aistatementconverter.com/v1/</code>.
              You’ll need an API key, available to paid subscribers.
            </p>
          </Section>

          <Section title="Authentication">
            <p className="text-gray-700">
              Send your API key using a Bearer token in the <code className="bg-gray-100 p-1 rounded">Authorization</code> header.
            </p>
            <CodeBlock>Authorization: Bearer YOUR_API_KEY</CodeBlock>
            <p className="text-gray-700">
              You’ll find your key in your dashboard. Keep it secret—don’t expose it in frontend code.
            </p>
          </Section>

          <Section title="Endpoint: Convert Statement">
            <p className="text-gray-700">
              This endpoint accepts a bank statement file and returns extracted transactions.
            </p>
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-md font-bold">POST</span>
              <code className="bg-gray-100 text-sm p-2 rounded">/convert</code>
            </div>
            <p className="text-gray-700">Make a <code className="bg-gray-100 p-1 rounded">multipart/form-data</code> POST with:</p>
            <Table />
          </Section>

          <Section title="Code Examples">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="flex border-b">
                {(['curl', 'nodejs', 'python'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-6 py-3 text-sm font-semibold transition-colors ${
                      activeLang === lang ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    {lang === 'curl' ? 'cURL' : lang === 'nodejs' ? 'Node.js' : 'Python'}
                  </button>
                ))}
              </div>
              <div className="p-4">
                <CodeBlock>{codeExamples[activeLang]}</CodeBlock>
              </div>
            </div>
          </Section>

          <Section title="Successful Response (200 OK)">
            <p className="text-gray-700">Returns JSON with status and transactions array:</p>
            <CodeBlock>{`{
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
      }
    ]
  }
}`}</CodeBlock>
          </Section>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;
