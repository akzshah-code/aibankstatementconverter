import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { ExtractedTransaction } from '../lib/types';
import ResultsView from './ResultsView';
import UnlockPdf from './UnlockPdf';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for pdfjs-dist from the CDN. This is crucial for performance.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.worker.mjs`;


// Helper function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

const Converter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [lockedPdf, setLockedPdf] = useState<File | null>(null);
  const [isCheckingPdf, setIsCheckingPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractedTransaction[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ processed: number; total: number }>({ processed: 0, total: 0 });

  const resetState = () => {
    setFile(null);
    setLockedPdf(null);
    setError(null);
    setIsLoading(false);
    setIsCheckingPdf(false);
    setResult(null);
    setProgress({ processed: 0, total: 0 });
  };

  const processSelectedFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    resetState();

    if (selectedFile.type !== 'application/pdf') {
      setFile(selectedFile);
      return;
    }
    
    setIsCheckingPdf(true);
    try {
        const fileBuffer = await selectedFile.arrayBuffer();
        // Use pdfjs-dist to check for encryption, which is more robust.
        await pdfjsLib.getDocument({ data: fileBuffer, password: '' }).promise.catch(err => {
            if (err.name === 'PasswordException') {
                throw err; // Re-throw to be caught by the password handler
            }
            // For other errors, throw a generic parsing error.
            throw new Error("Could not parse the PDF document.");
        });
        setFile(selectedFile);
    } catch (err) {
      if (err instanceof Error && (err.name === 'PasswordException' || err.message.toLowerCase().includes('password'))) {
        setLockedPdf(selectedFile);
      } else {
        setError("Unsupported PDF Format: This PDF is corrupted or uses an unsupported format/encryption. Solution: Please open this file on your computer and use the 'Print to PDF' function to create a new, unlocked copy. Then, upload the new file.");
      }
    } finally {
      setIsCheckingPdf(false);
    }
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    processSelectedFile(selectedFile || null);
    if (event.target) {
        event.target.value = '';
    }
  };
  
  const preventDefaults = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    preventDefaults(event);
    if (isLoading) return;
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    processSelectedFile(droppedFile || null);
  };

  const openFileDialog = () => {
    if (!isLoading) fileInputRef.current?.click();
  };
  
  const handleUnlockSuccess = (unlockedFile: File) => {
    setLockedPdf(null);
    setFile(unlockedFile);
  };

  const callApiForPageImage = async (base64Data: string, mimeType: string): Promise<ExtractedTransaction[]> => {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, mimeType }),
    });

    if (!response.ok) {
        // Try to parse error JSON, but fall back to status text if that fails.
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.details || `Server returned an unexpected response (Status: ${response.status}).`);
        } catch (e) {
            throw new Error(`Server returned an unexpected response (Status: ${response.status}).`);
        }
    }
    
    const responseData = await response.json();
    return responseData.transactions || [];
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress({ processed: 0, total: 0 });

    try {
      let allTransactions: ExtractedTransaction[] = [];

      if (file.type === 'application/pdf') {
        const fileBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        const pageCount = pdfDoc.numPages;
        
        setProgress({ processed: 0, total: pageCount });

        const pagePromises = [];
        for (let i = 1; i <= pageCount; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better OCR quality
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                // FIX: The project's TypeScript definitions for `pdfjs-dist` appear to be incorrect,
                // requiring a `canvas` property that is not part of the standard API. Adding it here
                // to satisfy the compiler. The library uses `canvasContext` at runtime.
                await page.render({ canvas, canvasContext: context, viewport }).promise;
                
                // FIX: Use JPEG compression to reduce the size of the image data sent to the API.
                // This prevents request body limits from being exceeded, which can cause JSON parsing errors.
                const mimeType = 'image/jpeg';
                const dataUrl = canvas.toDataURL(mimeType, 0.8); // 80% quality
                const base64Data = dataUrl.split(',')[1];
                
                const promise = callApiForPageImage(base64Data, mimeType).then(transactions => {
                    setProgress(prev => ({ ...prev, processed: prev.processed + 1 }));
                    return transactions;
                });
                pagePromises.push(promise);
            }
        }

        const resultsByPage = await Promise.all(pagePromises);
        allTransactions = resultsByPage.flat();

      } else { // Handle images
        setProgress({ processed: 0, total: 1 });
        // FIX: Correctly pass the mime type of the uploaded image to the API.
        const { data: base64Data, mimeType } = await fileToBase64(file);
        allTransactions = await callApiForPageImage(base64Data, mimeType);
        setProgress({ processed: 1, total: 1 });
      }

      setResult(allTransactions);

    } catch (err) {
        const baseMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      
        // Default error message
        let detailedError = baseMessage.replace('Solution:', '<br/><strong class="mt-2 inline-block">Solution:</strong>');

        // Provide specific, actionable advice for common API key errors.
        if (baseMessage.includes('403')) {
            detailedError = `
                The server returned a '403 Forbidden' error. This usually means there's an issue with the API Key.
                <br/><br/>
                <strong class="mt-2 inline-block">Please check the following:</strong>
                <ul class="list-disc list-inside mt-2 text-left">
                    <li>The <strong>API_KEY</strong> in your <code>.dev.vars</code> file is correct.</li>
                    <li>The API key is active and has not expired.</li>
                    <li>Billing is enabled for the associated Google Cloud project.</li>
                </ul>
            `;
        } else if (baseMessage.toLowerCase().includes('api key not valid')) {
            detailedError = `
                The provided API key is not valid.
                <br/><br/>
                <strong class="mt-2 inline-block">Please check the following:</strong>
                <ul class="list-disc list-inside mt-2 text-left">
                    <li>The <strong>API_KEY</strong> in your <code>.dev.vars</code> file is correct and has no typos.</li>
                    <li>You have copied the entire key from the Google AI Studio or Cloud Console.</li>
                </ul>
            `;
        }
        setError(detailedError);
    } finally {
      setIsLoading(false);
    }
  };

  const dropzoneBaseClasses = "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 flex flex-col items-center justify-center space-y-4 h-64";
  const dropzoneIdleClasses = "border-gray-300 bg-gray-50 hover:border-brand-blue cursor-pointer";
  const dropzoneDraggingClasses = "border-brand-blue bg-brand-blue-light";
  const dropzoneDisabledClasses = "border-gray-300 bg-gray-100 cursor-not-allowed";

  if (result) {
    return (
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg mx-auto">
        <ResultsView transactions={result} onReset={resetState} />
      </div>
    );
  }

  if (lockedPdf) {
    return (
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg mx-auto">
          <UnlockPdf 
            file={lockedPdf} 
            onUnlock={handleUnlockSuccess} 
            onCancel={resetState} 
          />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg mx-auto">
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Conversion Failed</p>
            <div className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: error }} />
            <button
              onClick={() => resetState()}
              className="mt-4 bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200 text-sm"
            >
              Try Again
            </button>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        aria-hidden="true"
        disabled={isLoading || isCheckingPdf}
      />

      {!file && !error && !isCheckingPdf ? (
        <div 
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`${dropzoneBaseClasses} ${isLoading ? dropzoneDisabledClasses : (isDragging ? dropzoneDraggingClasses : dropzoneIdleClasses)}`}
          role="button"
          tabIndex={isLoading ? -1 : 0}
          onKeyDown={(e) => !isLoading && e.key === 'Enter' && openFileDialog()}
          aria-label="File upload dropzone"
          aria-disabled={isLoading}
        >
          <div className="bg-brand-blue-light rounded-full p-4">
            <svg className="h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-brand-dark">Drag & Drop Your Files Here</p>
          <p className="text-sm text-brand-gray">or <span className="text-brand-blue font-medium">click to browse</span></p>
          <p className="text-xs text-brand-gray pt-2">Supported formats: PDF, JPG, PNG</p>
        </div>
      ) : null }

      {isCheckingPdf ? (
        <div className="text-center h-64 flex flex-col justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-brand-gray">Analyzing PDF...</p>
        </div>
      ) : null}
      
      {file && !error ? (
        <div className="text-center h-64 flex flex-col justify-center">
          {isLoading ? (
            <div className="space-y-4 px-4">
              <p className="text-lg font-semibold text-brand-dark">
                {progress.total > 1 ? `Processing Page ${progress.processed} of ${progress.total}...` : 'Processing document...'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%` }}></div>
              </div>
              <p className="text-sm text-brand-gray">
                This can take a moment for complex documents. Please keep this window open.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium text-brand-dark mb-4">
                File Ready for Conversion
              </h3>
              <div className="p-3 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
                </div>
                <button onClick={resetState} aria-label="Remove file" className="ml-4 text-gray-500 hover:text-red-600 transition-colors flex-shrink-0" disabled={isLoading}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-brand-gray pt-2 mt-2">Ready to convert. Click the button below.</p>
            </>
          )}
        </div>
      ) : null}
      
      <div className="mt-6">
        <button 
          onClick={handleConvert}
          disabled={!file || isLoading || isCheckingPdf} 
          className="w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200 disabled:bg-brand-blue/60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          ) : (
            'Convert to Excel'
          )}
        </button>
      </div>
    </div>
  );
};

export default Converter;