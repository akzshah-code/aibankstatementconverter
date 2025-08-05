import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl bg-white p-8 md:p-12 rounded-lg shadow-md">
                <article className="prose lg:prose-xl max-w-none text-gray-700">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

                    <p>
                        Welcome to AI Bank Statement Converter. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8">1. Information We Collect</h2>
                    <p>
                        We collect the following types of information:
                    </p>
                    <ul>
                        <li>
                            <strong>Files You Upload:</strong> We process the bank statement files (PDF, JPG, PNG) you upload to our service for the sole purpose of data extraction.
                        </li>
                        <li>
                            <strong>Extracted Data:</strong> We handle the transactional data extracted from your files, such as dates, narrations, amounts, and balances.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8">2. How We Use Your Information</h2>
                    <p>
                        The primary purpose of collecting your data is to provide and improve our service. Specifically:
                    </p>
                    <ul>
                        <li>
                            <strong>To Convert Your Statements:</strong> Your uploaded files and the data within them are sent to a third-party AI service, the Google Gemini API, for processing. The API analyzes the document, extracts the transactional data, and returns it in a structured format (JSON).
                        </li>
                        <li>
                            <strong>To Enable Chat Functionality:</strong> If you use the "Chat with AI" feature, the extracted transaction data is used to establish a context for the AI to answer your questions accurately.
                        </li>
                    </ul>

                     <h2 className="text-2xl font-bold text-gray-800 mt-8">3. Data Sharing and Third Parties</h2>
                    <p>
                        <strong>We do not sell or permanently store your files or the financial data contained within them.</strong>
                    </p>
                    <p>
                       Your data is shared with Google as part of the Gemini API call necessary to perform the conversion. We do not have control over Google's data handling practices. We recommend you review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>.
                    </p>
                     <p>
                        The PDF unlocking feature is performed entirely within your browser and your file is never sent to our servers or any third party.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8">4. Data Security</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. Communication with our service and with the Google Gemini API is encrypted using HTTPS/TLS. However, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8">5. Data Retention</h2>
                    <p>
                        We do not retain your uploaded files or the extracted financial data on our servers after the conversion process is complete and the session ends.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8">6. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8">7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@example.com (please replace with a real contact email).
                    </p>
                </article>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
