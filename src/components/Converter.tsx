
import React, { useState, useCallback, useRef } from 'react';
import { Transaction } from '../lib/types';
import ChatInterface from './ChatInterface';
import { useUser } from '../contexts/UserContext';

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

  // State for integrated PDF unlocking
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showSecureWorkaround, setShowSecureWorkaround] = useState<boolean>(false);

  const { user, recordConversion, checkAnonymousUsage, recordAnonymousUsage } = useUser();

  const handleFileSelection = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      if (
        ['application/pdf', 'image/jpeg', 'image/png'].includes(selectedFile.type) &&
        selectedFile.size <= 10 * 1024 * 1024 // 10MB
      ) {
        resetConverter(); // Reset state for new file
        setFile(selectedFile);
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

  const handleConversionAttempt = async (fileToProcess: File, passwordToTry?: string) => {
    const startTime = Date.now();
    
    // Quota check simulation on frontend before sending to backend
    // In a real scenario with a secure backend, quota checks would happen there.
    // For this app, we'll assume a PDF costs 1 page credit to check initially.
    // The backend will return the true page count.
    const initialPageEstimate = 1; 
    if (!checkQuota(initialPageEstimate)) {
      return; // checkQuota sets the error and loading state.
    }
    
    const formData = new FormData();
    formData.append('file', fileToProcess);
    if (passwordToTry) {
        formData.append('password', passwordToTry);
    }
  
    try {
        const response = await fetch('http://localhost:3001/api/convert', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData.detail === 'unlock_failed') {
                 throw { detail: 'unlock_failed' };
            }
            throw new Error(errorData.error || 'A server error occurred.');
        }

        const result = await response.json();
        const endTime = Date.now();

        // Now that we have the real page count from the backend, record usage.
        if (user) recordConversion(file?.name || 'unknown', result.pageCount, 'Completed');
        else recordAnonymousUsage(); // Assumes 1 page for anon users
        
        setPageCount(result.pageCount);
        setExtractedData(result.data);
        setProcessingTime((endTime - startTime) / 1000);
        setShowPasswordPrompt(false);
        setShowSecureWorkaround(false);

    } catch (err) {
        throw err; // Re-throw to be handled by the calling function.
    }
  };

  const processStatement = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    
    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    setShowPasswordPrompt(false);
    setShowSecureWorkaround(false);
    
    try {
        await handleConversionAttempt(file);
    } catch (err: any) {
        if (err?.detail === 'unlock_failed') {
            setError('This PDF is password-protected. Please enter the password to proceed.');
            setShowPasswordPrompt(true);
        } else {
            console.error("Conversion failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during conversion.';
            setError(`Conversion Failed: ${errorMessage}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleUnlockAndConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !password) { setError("Please enter a password."); return; }
    
    setIsLoading(true);
    setError(null);

    try {
        await handleConversionAttempt(file, password);
    } catch (err: any) {
        if (err?.detail === 'unlock_failed') {
            setError('Incorrect password. Please try again or use the secure workaround.');
            setShowSecureWorkaround(true); // Ensure it stays visible.
        } else {
            console.error("Conversion failed on retry:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Conversion Failed: ${errorMessage}`);
            setShowPasswordPrompt(false); // Hide prompt on other errors
        }
    } finally {
        setIsLoading(false);
    }
  };

  const checkQuota = (pages: number): boolean => {
    if (user) {
        const remainingPages = user.subscription.pagesQuota - user.subscription.pagesUsed;
        if (pages > remainingPages) {
            setError(`You do not have enough page credits. This document requires at least ${pages} page(s), but you only have ${remainingPages} remaining.`);
            setIsLoading(false);
            return false;
        }
    } else {
        if (!checkAnonymousUsage()) {
            setError('You have reached your daily limit for anonymous conversions (1 page/day). Please register for a free account to convert more.');
            setIsLoading(false);
            return false;
        }
    }
    return true;
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
    setShowPasswordPrompt(false);
    setPassword('');
    setShowPassword(false);
    setShowSecureWorkaround(false);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderUploader = () => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-primary bg-indigo-50' : 'border-gray-300'}`}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
    >
      <input
        type="file" ref={fileInputRef} onChange={onFileChange} className="hidden"
        accept=".pdf,.jpg,.jpeg,.png" disabled={isLoading}
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

        {file && (
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
  );
  
  const renderPasswordPrompt = () => {
    const inputClassName = `w-full pl-12 pr-14 py-3 border rounded-md shadow-sm focus:outline-none ${
      error ? 'border-red-500 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary focus:border-primary'
    }`;
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl p-6 border border-gray-200 shadow-lg animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 text-left">Password Required</h3>
          {error && <p id="password-error" className="mt-2 text-sm font-medium text-red-600 text-left">{error}</p>}
          
          {showSecureWorkaround && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0"><i className="fas fa-info-circle text-blue-500 mt-0.5"></i></div>
                    <div className="ml-3">
                        <h4 className="text-sm font-bold text-blue-800">A Secure Workaround</h4>
                        <div className="text-sm text-blue-700 mt-2 space-y-2">
                          <p>If the password fails, some banks use advanced encryption. Here’s a simple, secure fix:</p>
                          <ol className="list-decimal list-inside space-y-1 pl-2">
                              <li>Open the PDF in your web browser (like Chrome) or Adobe Reader.</li>
                              <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac).</li>
                              <li>Change the 'Destination' or 'Printer' to <strong>"Save as PDF"</strong>.</li>
                              <li>Save the new, unlocked version and upload it here.</li>
                          </ol>
                        </div>
                    </div>
                </div>
            </div>
          )}

          <form onSubmit={handleUnlockAndConvert} className="space-y-4 mt-4">
              <div>
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4"><i className="fas fa-lock text-gray-400"></i></span>
                      <input
                          type={showPassword ? "text" : "password"} value={password}
                          onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
                          placeholder="Password" required className={inputClassName} aria-invalid={!!error}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="h-full px-4 text-gray-600 rounded-r-md hover:bg-gray-100 flex items-center justify-center focus:outline-none" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                      </div>
                  </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                  <button onClick={resetConverter} type="button" className="text-sm text-gray-600 hover:text-primary font-semibold">Cancel</button>
                  <button type="submit" disabled={isLoading} className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary-hover transition-colors shadow-md flex items-center gap-2 disabled:bg-gray-400">
                      {isLoading ? <><div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div> Unlocking...</> : <><i className="fas fa-unlock-alt"></i> Try Unlock & Convert</>}
                  </button>
              </div>
          </form>
      </div>
    );
  };
  
  const renderResults = () => (
     <div className="space-y-6 pt-4 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Conversion Complete!</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard value={extractedData?.length ?? 0} label="Transactions" />
          <StatCard value={pageCount ?? 'N/A'} label="Pages Processed" />
          <StatCard value={processingTime ? `${processingTime.toFixed(1)}s` : 'N/A'} label="Processing Time" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview of Extracted Data:</h3>
          <ResultsTable data={extractedData!} />
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

        {showChat && extractedData && (
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
  );

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full space-y-6 border border-gray-200">
      {error && !showPasswordPrompt && (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-bold text-red-700">Action Required</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button onClick={resetConverter} className="mt-4 bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary-hover transition-colors text-sm">
            Try Again
          </button>
        </div>
      )}

      {!error && extractedData ? renderResults() 
        : showPasswordPrompt ? renderPasswordPrompt() 
        : renderUploader()}
    </div>
  );
};

export default Converter;