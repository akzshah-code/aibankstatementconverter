
import React, { useState, useCallback, useRef } from 'react';
import { Transaction } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';
import { Type } from "@google/genai";
import { PDFDocument } from 'pdf-lib';

// --- Types & Interfaces ---
interface FileStatus {
    id: string;
    file: File;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'password_required';
    data: Transaction[] | null;
    error: string | null;
    pageCount: number;
}

// --- Utility Functions (from Converter.tsx) ---
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
});

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const jsonToCsv = (jsonData: Transaction[], headers: Record<keyof Transaction, string>): string => {
    if (!jsonData || jsonData.length === 0) return '';
    const objectKeys: (keyof Transaction)[] = [ 'date', 'narration', 'refNo', 'valueDate', 'withdrawalAmt', 'depositAmt', 'closingBalance' ];
    const headerRow = objectKeys.map(key => headers[key]).join(',');
    const dataRows = jsonData.map(row => 
        objectKeys.map(key => `"${(row[key] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    );
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

// --- Sub-Components ---
const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-200">
        <p className="text-3xl font-bold text-primary">{value}</p>
        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{label}</p>
    </div>
);

const ResultsTable: React.FC<{ data: Transaction[] }> = ({ data }) => {
    const previewData = data.slice(0, 15);
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[400px]">
          <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Narration</th>
                      <th scope="col" className="px-4 py-3 text-right">Withdrawal</th>
                      <th scope="col" className="px-4 py-3 text-right">Deposit</th>
                  </tr>
              </thead>
              <tbody>
                  {previewData.map((tx, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50 last:border-b-0">
                          <td className="px-4 py-3 font-medium">{tx.date}</td>
                          <td className="px-4 py-3 max-w-sm truncate" title={tx.narration}>{tx.narration}</td>
                          <td className="px-4 py-3 text-right font-mono text-red-600">{tx.withdrawalAmt != null ? tx.withdrawalAmt.toFixed(2) : '-'}</td>
                          <td className="px-4 py-3 text-right font-mono text-green-600">{tx.depositAmt != null ? tx.depositAmt.toFixed(2) : '-'}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    );
};

const StatusIcon: React.FC<{ status: FileStatus['status'] }> = ({ status }) => {
    switch (status) {
        case 'pending': return <i className="fas fa-clock text-gray-400" title="Pending"></i>;
        case 'processing': return <i className="fas fa-spinner fa-spin text-primary" title="Processing"></i>;
        case 'completed': return <i className="fas fa-check-circle text-green-500" title="Completed"></i>;
        case 'failed': return <i className="fas fa-times-circle text-red-500" title="Failed"></i>;
        case 'password_required': return <i className="fas fa-lock text-yellow-500" title="Password Required"></i>;
        default: return null;
    }
};


// --- Main Bulk Converter Component ---
const BulkConverter: React.FC = () => {
    const [filesStatus, setFilesStatus] = useState<FileStatus[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [combinedData, setCombinedData] = useState<Transaction[]>([]);
    const [resultsSummary, setResultsSummary] = useState({ total: 0, completed: 0, failed: 0 });
    const [view, setView] = useState<'uploader' | 'results'>('uploader');
    const [error, setError] = useState<string | null>(null);

    const [passwordFile, setPasswordFile] = useState<FileStatus | null>(null);
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, recordConversion } = useUser();

    const handleFileSelection = useCallback((selectedFiles: FileList | null) => {
        if (!selectedFiles) return;
        const newFiles: FileStatus[] = Array.from(selectedFiles)
            .filter(file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 10 * 1024 * 1024)
            .map(file => ({
                id: `${file.name}-${file.lastModified}`,
                file,
                status: 'pending',
                data: null,
                error: null,
                pageCount: 0,
            }));
        
        // Filter out duplicates
        setFilesStatus(prev => {
            const existingIds = new Set(prev.map(f => f.id));
            const uniqueNewFiles = newFiles.filter(f => !existingIds.has(f.id));
            return [...prev, ...uniqueNewFiles];
        });
    }, []);

    const removeFile = (id: string) => {
        setFilesStatus(prev => prev.filter(f => f.id !== id));
    };

    const processSingleFile = async (fileStatus: FileStatus): Promise<Omit<FileStatus, 'id' | 'file'>> => {
        let currentFile = fileStatus.file;

        if (currentFile.type === 'application/pdf') {
            try {
                let fileBuffer = await fileToArrayBuffer(currentFile);
                let pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
                if (pdfDoc.isEncrypted) {
                    // It's encrypted, we need a password. Pause processing for this file.
                    return new Promise((resolve) => {
                        setPasswordFile({ ...fileStatus, status: 'password_required' });
                        const interval = setInterval(async () => {
                            // Check if a password attempt has been made by checking if the state has changed
                            const updatedFileStatus = filesStatus.find(f => f.id === fileStatus.id);
                            if (updatedFileStatus && updatedFileStatus.status !== 'password_required') {
                                clearInterval(interval);
                                // The handlePasswordSubmit flow has resolved this file, continue.
                                resolve(updatedFileStatus);
                            }
                        }, 500);
                    });
                }
            } catch (err) {
                console.warn("Could not check PDF encryption, proceeding...", err);
            }
        }
        
        try {
            const base64Data = await fileToBase64(currentFile);
            const filePart = { inlineData: { data: base64Data, mimeType: currentFile.type } };

            const schema = {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        date: { type: Type.STRING, description: 'Transaction date (YYYY-MM-DD)' },
                        narration: { type: Type.STRING }, refNo: { type: Type.STRING }, valueDate: { type: Type.STRING },
                        withdrawalAmt: { type: Type.NUMBER }, depositAmt: { type: Type.NUMBER }, closingBalance: { type: Type.NUMBER },
                    }, required: ['date', 'narration', 'valueDate', 'closingBalance']
                }
            };

            const requestBody = {
                model: 'gemini-2.5-flash',
                contents: { parts: [filePart, { text: 'Analyze this bank statement and extract all transactions into a structured JSON according to the schema. Clean the narration field by removing redundant info.' }] },
                config: { responseMimeType: "application/json", responseSchema: schema }
            };

            const apiResponse = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
    
            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.details || `Request failed with status ${apiResponse.status}`);
            }

            const response = await apiResponse.json();
            const jsonData = JSON.parse(response.text);

            let numPages = 1;
            if (currentFile.type === 'application/pdf') {
                const pdfBytes = await fileToArrayBuffer(currentFile);
                const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                numPages = pdfDoc.getPageCount();
            }
            
            recordConversion(currentFile.name, numPages, 'Completed');
            return { status: 'completed', data: jsonData, error: null, pageCount: numPages };
        } catch (err: any) {
            recordConversion(currentFile.name, 0, 'Failed');
            return { status: 'failed', data: null, error: err.message || "Conversion failed.", pageCount: 0 };
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordFile || !password) return;
    
        const originalFileStatus = passwordFile;
        setPasswordFile(null); // Close modal
    
        try {
            const fileBuffer = await fileToArrayBuffer(originalFileStatus.file);
            const pdfDoc = await PDFDocument.load(fileBuffer, { password } as any);
            const unlockedPdfBytes = await pdfDoc.save();
            const unlockedFile = new File([unlockedPdfBytes], originalFileStatus.file.name, { type: 'application/pdf' });
    
            // Now re-run the process for this specific file with the unlocked version
            const result = await processSingleFile({ ...originalFileStatus, file: unlockedFile });
            setFilesStatus(prev => prev.map(fs => fs.id === originalFileStatus.id ? { ...fs, ...result, file: unlockedFile } : fs));
    
        } catch (err) {
            // Password was wrong or other error
            setFilesStatus(prev => prev.map(fs => fs.id === originalFileStatus.id ? { ...fs, status: 'failed', error: 'Incorrect password or unsupported encryption.' } : fs));
        } finally {
            setPassword('');
        }
    };
    
    const startBulkProcess = async () => {
        setIsProcessing(true);
        setError(null);
        setCombinedData([]);
        setResultsSummary({ total: filesStatus.length, completed: 0, failed: 0 });

        for (let i = 0; i < filesStatus.length; i++) {
            const currentFile = filesStatus[i];
            setFilesStatus(prev => prev.map(fs => fs.id === currentFile.id ? { ...fs, status: 'processing' } : fs));
            
            const result = await processSingleFile(currentFile);

            setFilesStatus(prev => prev.map(fs => fs.id === currentFile.id ? { ...fs, ...result } : fs));

            if (result.status === 'completed' && result.data) {
                setCombinedData(prev => [...prev, ...result.data!]);
                setResultsSummary(prev => ({ ...prev, completed: prev.completed + 1 }));
            } else if (result.status === 'failed') {
                setResultsSummary(prev => ({ ...prev, failed: prev.failed + 1 }));
            }
        }

        setIsProcessing(false);
        setView('results');
    };

    const handleDownload = (format: 'csv' | 'xls' | 'json') => {
        if (combinedData.length === 0) return;
        const headers: Record<keyof Transaction, string> = {
            date: 'Date', narration: 'Narration', refNo: 'Chq./Ref.No.', valueDate: 'ValueDt',
            withdrawalAmt: 'WithdrawalAmt', depositAmt: 'DepositAmt', closingBalance: 'ClosingBalance'
        };
        if (format === 'json') {
          downloadData(JSON.stringify(combinedData, null, 2), `bulk-statement.json`, 'application/json');
        } else {
          const csvData = jsonToCsv(combinedData, headers);
          downloadData(csvData, `bulk-statement.${format}`, 'text/csv;charset=utf-8;');
        }
    };
    
    const resetAll = () => {
        setFilesStatus([]);
        setIsProcessing(false);
        setCombinedData([]);
        setResultsSummary({ total: 0, completed: 0, failed: 0 });
        setView('uploader');
        setError(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };


    const renderUploader = () => (
        <div className="space-y-6">
            <div
                className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 border-gray-300 hover:border-primary hover:bg-indigo-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileSelection(e.dataTransfer.files); }}
            >
                <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelection(e.target.files)} multiple className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                <div className="flex flex-col items-center justify-center space-y-3">
                    <i className="fas fa-file-upload text-primary text-4xl"></i>
                    <h3 className="text-xl font-bold text-gray-800">Upload Multiple Statements</h3>
                    <p className="text-sm text-gray-500">Drag & drop files here or click to browse.</p>
                    <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="mt-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-primary-hover disabled:bg-gray-400">
                        Choose Files
                    </button>
                </div>
            </div>

            {filesStatus.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-800">File Queue ({filesStatus.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {filesStatus.map(fs => (
                            <div key={fs.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                <div className="flex items-center gap-3 truncate">
                                    <StatusIcon status={fs.status} />
                                    <p className="text-sm font-medium text-gray-700 truncate">{fs.file.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <p className="text-xs text-gray-500">{Math.round(fs.file.size / 1024)} KB</p>
                                     <button onClick={() => removeFile(fs.id)} disabled={isProcessing} className="text-red-500 hover:text-red-700 disabled:text-gray-400">
                                         <i className="fas fa-trash-alt"></i>
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={startBulkProcess} disabled={isProcessing || filesStatus.length === 0} className="w-full mt-4 bg-primary text-white px-6 py-3 rounded-md font-bold text-lg hover:bg-primary-hover disabled:bg-gray-400 flex items-center justify-center gap-2">
                        {isProcessing ? (
                            <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                        ) : (
                            <><i className="fas fa-cogs"></i> Start Bulk Conversion</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
    
    const renderResults = () => (
        <div className="space-y-6 pt-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Bulk Conversion Complete!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard value={resultsSummary.total} label="Files Processed" />
                <StatCard value={resultsSummary.completed} label="Successful" />
                <StatCard value={resultsSummary.failed} label="Failed" />
            </div>

            {combinedData.length > 0 && (
                <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview of Combined Data ({combinedData.length} transactions):</h3>
                    <ResultsTable data={combinedData} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                        <button onClick={() => handleDownload('xls')} className="bg-green-600 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-green-700"><i className="fas fa-file-excel mr-2"></i>Excel (.xls)</button>
                        <button onClick={() => handleDownload('csv')} className="bg-gray-700 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-gray-800"><i className="fas fa-file-csv mr-2"></i>CSV (.csv)</button>
                        <button onClick={() => handleDownload('json')} className="bg-blue-600 text-white px-4 py-2.5 rounded-md font-semibold hover:bg-blue-700"><i className="fas fa-file-code mr-2"></i>JSON (.json)</button>
                    </div>
                </>
            )}

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Details:</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {filesStatus.map(fs => (
                        <div key={fs.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <div className="flex items-center gap-3 truncate">
                                <StatusIcon status={fs.status} />
                                <div className="truncate">
                                    <p className="text-sm font-medium text-gray-700 truncate">{fs.file.name}</p>
                                    {fs.error && <p className="text-xs text-red-600 truncate" title={fs.error}>{fs.error}</p>}
                                </div>
                            </div>
                            {fs.status === 'completed' && <p className="text-sm text-gray-600">{fs.data?.length} rows</p>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pt-4 border-t">
                <button onClick={resetAll} className="text-primary hover:underline font-semibold">Start a New Bulk Conversion</button>
            </div>
      </div>
    );
    
    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
            <div className="container mx-auto px-6 space-y-8">
                 <header>
                    <h1 className="text-3xl font-bold text-gray-800">Bulk Statement Converter</h1>
                    <p className="text-gray-600">Process multiple files at once and download the combined result.</p>
                </header>
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full border border-gray-200">
                    {view === 'uploader' ? renderUploader() : renderResults()}
                </div>
            </div>

            {/* Password Modal */}
            {passwordFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-800">Password Required</h3>
                        <p className="mt-2 text-sm text-gray-600">File <span className="font-semibold">{passwordFile.file.name}</span> is encrypted.</p>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
                             <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter PDF Password" required className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 text-gray-600" aria-label="Toggle password visibility"><i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                             </div>
                            <div className="flex justify-end items-center gap-4 pt-2">
                                <button onClick={() => { setPasswordFile(null); setPassword(''); setFilesStatus(prev => prev.map(fs => fs.id === passwordFile.id ? { ...fs, status: 'failed', error: 'Password entry skipped.' } : fs)); }} type="button" className="text-sm text-gray-600 hover:text-primary font-semibold">Skip File</button>
                                <button type="submit" className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary-hover">Unlock & Continue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkConverter;