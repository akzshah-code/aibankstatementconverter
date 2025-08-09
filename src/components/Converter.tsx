import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PDFDocument } from 'pdf-lib';
import { Transaction } from '../lib/types';
import ChatInterface from './ChatInterface';
import { useUser } from '../contexts/UserContext';

interface RawTransactionFromAI {
  date: string;
  narration: string;
  refNo?: string | null;
  valueDate: string;
  withdrawalAmt?: string | null;
  depositAmt?: string | null;
  closingBalance: string;
}

// --- Sub-components ---

const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-200">
        <p className="text-3xl font-bold text-primary">{value}</p>
        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{label}</p>
    </div>
);

const ResultsTable: React.FC<{ data: Transaction[] }> = ({ data }) => {
    const previewData = data.slice(0, 10); // Show up to 10 rows in preview

    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Narration</th>
                      <th scope="col" className="px-4 py-3">Chq./Ref.No.</th>
                      <th scope="col" className="px-4 py-3">ValueDt</th>
                      <th scope="col" className="px-4 py-3 text-right">WithdrawalAmt</th>
                      <th scope="col" className="px-4 py-3 text-right">DepositAmt</th>
                      <th scope="col" className="px-4 py-3 text-right">ClosingBalance</th>
                  </tr>
              </thead>
              <tbody>
                  {previewData.map((tx, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50 last:border-b-0">
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{tx.date}</td>
                          <td className="px-4 py-3 max-w-sm truncate" title={tx.narration}>{tx.narration}</td>
                          <td className="px-4 py-3 max-w-[100px] truncate">{tx.refNo ?? ''}</td>
                          <td className="px-4 py-3">{tx.valueDate}</td>
                          <td className="px-4 py-3 text-right font-mono text-red-600">
                              {tx.withdrawalAmt != null ? tx.withdrawalAmt.toFixed(2) : '-'}
                          </td>
                           <td className="px-4 py-3 text-right font-mono text-green-600">
                              {tx.depositAmt != null ? tx.depositAmt.toFixed(2) : '-'}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-gray-800">
                              {tx.closingBalance != null ? tx.closingBalance.toFixed(2) : 'N/A'}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    );
};


// --- Utility Functions ---
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const jsonToCsv = (jsonData: Transaction[], headers: Record<keyof Transaction, string>): string => {
    if (!jsonData || jsonData.length === 0) return '';
    const objectKeys: (keyof Transaction)[] = [ 'date', 'narration', 'refNo', 'valueDate', 'withdrawalAmt', 'depositAmt', 'closingBalance' ];
    const headerRow = objectKeys.map(key => headers[key]).join(',');
    const dataRows = jsonData.map(row => 
        objectKeys.map(key => {
            const value = row[key] ?? '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
    );
    // Add BOM for better Excel compatibility
    return '\uFEFF' + [headerRow, ...dataRows].join('\n');
};

const downloadData = (data: string, filename: string, type: string) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


const Converter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Transaction[] | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, recordConversion, checkAnonymousUsage, recordAnonymousUsage } = useUser();

  const handleFileSelection = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      if (
        ['application/pdf', 'image/jpeg', 'image/png'].includes(selectedFile.type) &&
        selectedFile.size <= 10 * 1024 * 1024 // 10MB
      ) {
        setFile(selectedFile);
        setError(null);
        setExtractedData(null);
      } else {
        setFile(null);
        setError('Invalid file. Supported formats: PDF, JPG, PNG (max 10MB).');
      }
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  }, [isLoading]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isLoading) {
       const droppedFile = e.dataTransfer.files?.[0] || null;
       handleFileSelection(droppedFile);
    }
  }, [isLoading, handleFileSelection]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelection(selectedFile);
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processStatement = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    const startTime = Date.now();

    // Determine page count and check quota
    let docPageCount = 1;
    if (file.type === 'application/pdf') {
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
            docPageCount = pdfDoc.getPageCount();
        } catch (err: unknown) {
             setError('Could not parse the PDF. It may be corrupted. If it is password-protected, please use the "Unlock PDF" tool first.');
             setIsLoading(false);
             return;
        }
    }
    setPageCount(docPageCount);

    // Check user quota
    if (user) {
        const remainingPages = user.subscription.pagesQuota - user.subscription.pagesUsed;
        if (docPageCount > remainingPages) {
            setError(`You do not have enough page credits. This document has ${docPageCount} pages, but you only have ${remainingPages} remaining.`);
            setIsLoading(false);
            return;
        }
    } else {
        if (!checkAnonymousUsage()) {
            setError('You have reached your daily limit for anonymous conversions (1 page/day). Please register for a free account to convert more.');
            setIsLoading(false);
            return;
        }
    }

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please configure it in your deployment settings.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let finalContents: { parts: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[]; };
            
      const commonPromptRules = `
        For each transaction, you MUST extract the following fields according to the rules below:
        - 'date': The primary date of the transaction.
        - 'narration': The transaction description.
        - 'refNo': The cheque or reference number.
        - 'valueDate': The value date, if different from the transaction date.
        - 'withdrawalAmt': The withdrawal amount.
        - 'depositAmt': The deposit amount.
        - 'closingBalance': The closing balance after the transaction.

        **MANDATORY EXTRACTION RULES:**
        1.  **Reference Number Isolation:** Locate the primary reference number (like a Cheque, UPI, or NEFT ID) within the full description. Extract this number and place it *only* in the 'refNo' field.
        2.  **Narration Cleaning:** The 'narration' field must contain the transaction description *after* the reference number has been removed.
        3.  **Value Date Logic:** The 'date' field gets the main transaction date. If you find a separate date embedded within the narration (e.g., "...on 11-02-25..."), extract it into the 'valueDate' field. If no separate date is found, 'valueDate' MUST be identical to 'date'.
        4.  **Numeric Amounts:** 'withdrawalAmt', 'depositAmt', and 'closingBalance' must be strings containing only numbers and a decimal point, without any currency symbols or commas.
        5.  **Handling Missing Values:** If a field's value is not present for a transaction (e.g., no 'withdrawalAmt' for a deposit, or no 'refNo'), you MUST return an empty string "" for that specific field in the JSON output.
      `;
      
      // Always send the full file to Gemini Vision
      const base64Data = await fileToBase64(file);
      const filePart = { inlineData: { mimeType: file.type, data: base64Data } };
      
      const promptText = file.type === 'application/pdf'
        ? `Analyze the provided bank statement PDF and extract all transactions into a structured JSON array.\n${commonPromptRules}`
        : `Analyze the provided bank statement image and extract all transactions into a structured JSON array.\n${commonPromptRules}`;

      const textPart = { text: promptText };
      finalContents = { parts: [filePart, textPart] };
      
      const schema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: 'Transaction date (e.g., YYYY-MM-DD)' },
            narration: { type: Type.STRING, description: 'CLEANED description of the transaction' },
            refNo: { type: Type.STRING, description: 'Extracted Cheque or Reference Number. Can be null.' },
            valueDate: { type: Type.STRING, description: 'Value date of the transaction (extracted from narration if possible).' },
            withdrawalAmt: { type: Type.STRING, description: 'Withdrawal/Debit amount as a string. Null if not applicable.' },
            depositAmt: { type: Type.STRING, description: 'Deposit/Credit amount as a string. Null if not applicable.' },
            closingBalance: { type: Type.STRING, description: 'Running balance after the transaction, as a string.' },
          },
          required: ['date', 'narration', 'closingBalance', 'valueDate']
        }
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalContents,
        config: { 
          responseMimeType: "application/json", 
          responseSchema: schema,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      
      const jsonString = response.text.trim();
      if (!jsonString) throw new Error("The model returned an empty response. The document might be unreadable or empty.");

      const rawData = JSON.parse(jsonString);
      if (!Array.isArray(rawData)) throw new Error("The model did not return a valid array of transactions.");
      
      const data: Transaction[] = rawData.map((item: RawTransactionFromAI): Transaction => {
        const parseNumber = (value: any): number | null => {
            if (value === null || value === undefined || value === '') return null;
            const num = parseFloat(String(value).replace(/,/g, ''));
            return isNaN(num) ? null : num;
        };
        
        return {
          date: String(item.date || ''),
          narration: String(item.narration || ''),
          refNo: item.refNo || null,
          valueDate: String(item.valueDate || item.date || ''),
          withdrawalAmt: parseNumber(item.withdrawalAmt),
          depositAmt: parseNumber(item.depositAmt),
          closingBalance: parseNumber(item.closingBalance) ?? 0,
        };
      });

      const endTime = Date.now();
      setProcessingTime((endTime - startTime) / 1000);
      
      if (data.length === 0) {
        setError("No transactions could be extracted. Please check the document or try another file.");
        if(user) recordConversion(file.name, docPageCount, 'Failed');
      } else {
        setExtractedData(data);
        if (user) {
            recordConversion(file.name, docPageCount, 'Completed');
        } else {
            recordAnonymousUsage();
        }
      }
    } catch (err: unknown) {
      console.error("Conversion failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during conversion.';
      setError(`Conversion failed: ${errorMessage}`);
      if(user) recordConversion(file.name, docPageCount, 'Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: 'csv' | 'xls' | 'json') => {
    if (!extractedData) return;
    const baseFilename = file?.name.replace(/\.[^/.]+$/, "") || 'statement';

    const headers: Record<keyof Transaction, string> = {
        date: 'Date',
        narration: 'Narration',
        refNo: 'Chq./Ref.No.',
        valueDate: 'ValueDt',
        withdrawalAmt: 'WithdrawalAmt',
        depositAmt: 'DepositAmt',
        closingBalance: 'ClosingBalance'
    };
    
    if (format === 'json') {
      const transformedData = extractedData.map(tx => ({
        [headers.date]: tx.date,
        [headers.narration]: tx.narration,
        [headers.refNo]: tx.refNo,
        [headers.valueDate]: tx.valueDate,
        [headers.withdrawalAmt]: tx.withdrawalAmt,
        [headers.depositAmt]: tx.depositAmt,
        [headers.closingBalance]: tx.closingBalance,
      }));
      downloadData(JSON.stringify(transformedData, null, 2), `${baseFilename}.json`, 'application/json');
    } else {
      const csvData = jsonToCsv(extractedData, headers);
      const filename = format === 'csv' ? `${baseFilename}.csv` : `${baseFilename}.xls`;
      downloadData(csvData, filename, 'text/csv;charset=utf-8;');
    }
  };

  const resetConverter = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
    setIsLoading(false);
    setProcessingTime(null);
    setPageCount(null);
    setShowChat(false);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full space-y-6 border border-gray-200">
      
      {/* --- Uploader Section --- */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-primary bg-indigo-50' : 'border-gray-300'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file" ref={fileInputRef} onChange={onFileChange} className="hidden"
          accept=".pdf,.jpg,.jpeg,.png" disabled={isLoading || !!extractedData}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="text-primary text-4xl"><i className="fas fa-file-arrow-up"></i></div>
          <h3 className="text-xl font-bold text-gray-800">Upload Bank Statement</h3>
          <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG (max 10MB)</p>
          
          {!file && (
             <button onClick={onButtonClick} disabled={isLoading} className="mt-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-primary-hover transition-colors disabled:bg-gray-400">
                Choose File
             </button>
          )}

          {file && !extractedData && (
            <div className="w-full max-w-sm pt-4 text-center">
              <p className="text-sm text-gray-700 font-medium bg-gray-100 border border-gray-200 rounded-md p-2 truncate">
                <i className="fas fa-file-alt mr-2"></i>{file.name}
              </p>
              <button onClick={processStatement} disabled={isLoading} className="mt-4 w-full bg-primary text-white px-6 py-3 rounded-md font-bold text-lg hover:bg-primary-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (
                  <><div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div> Processing...</>
                ) : (
                  <><i className="fas fa-cogs"></i> Convert to Excel</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Status / Results Section --- */}
      {error && (
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-700">Action Required</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button onClick={resetConverter} className="mt-4 bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary-hover transition-colors text-sm">
              Try Again
            </button>
          </div>
      )}

      {extractedData && (
        <div className="space-y-6 pt-4 animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Conversion Complete!</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard value={extractedData.length} label="Transactions" />
            <StatCard value={pageCount ?? 'N/A'} label="Pages Processed" />
            <StatCard value={processingTime ? `${processingTime.toFixed(1)}s` : 'N/A'} label="Processing Time" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview of Extracted Data:</h3>
            <ResultsTable data={extractedData} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Download Full Statement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => handleDownload('xls')} className="bg-green-600 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"><i className="fas fa-file-excel"></i>Excel (.xls)</button>
              <button onClick={() => handleDownload('csv')} className="bg-gray-700 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"><i className="fas fa-file-csv"></i>CSV (.csv)</button>
              <button onClick={() => handleDownload('json')} className="bg-blue-600 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"><i className="fas fa-file-code"></i>JSON (.json)</button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Need more insights?</h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-primary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-sm"
                aria-expanded={showChat}
              >
                <i className={`fas ${showChat ? 'fa-times-circle' : 'fa-comments'}`}></i>
                {showChat ? 'Close Chat' : 'Chat with AI'}
              </button>
            </div>
          </div>

          {showChat && (
            <div className="mt-4 animate-fade-in">
              <ChatInterface transactions={extractedData} />
            </div>
          )}
          
          <div className="text-center pt-2">
            <button onClick={resetConverter} className="text-primary hover:underline font-semibold">
              Start a New Conversion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Converter;