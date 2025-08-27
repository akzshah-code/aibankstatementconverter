import { useState, useRef, DragEvent, ChangeEvent } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null); // In a real app, define a type for the result
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setError(null);
    setIsLoading(false);
    setResult(null);
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      resetState();
      setFile(selectedFile);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    handleFileSelect(selectedFile || null);
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
    handleFileSelect(droppedFile || null);
  };

  const openFileDialog = () => {
    if (!isLoading) fileInputRef.current?.click();
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { mimeType, data: base64Data } = await fileToBase64(file);

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data, mimeType: mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      setResult(responseData.transactions);
      // For now, we just log the result. In the next step, we'll add a download button.
      console.log('Conversion successful:', responseData.transactions);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Conversion Failed: ${errorMessage}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const dropzoneBaseClasses = "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 flex flex-col items-center justify-center space-y-4 h-64";
  const dropzoneIdleClasses = "border-gray-300 bg-gray-50 hover:border-brand-blue cursor-pointer";
  const dropzoneDraggingClasses = "border-brand-blue bg-brand-blue-light";
  const dropzoneDisabledClasses = "border-gray-300 bg-gray-100 cursor-not-allowed";

  return (
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg mx-auto">
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Action Required</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => resetState()}
              className="mt-3 bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 text-sm"
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
        disabled={isLoading}
      />

      {!file && !error ? (
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
          <p className="text-xs text-brand-gray pt-2">Supported formats: PDF, JPG, PNG (max 700KB)</p>
        </div>
      ) : null }
      
      {file && !error ? (
        <div className="text-center h-64 flex flex-col justify-center">
            <h3 className="text-lg font-medium text-brand-dark mb-4">
              {result ? 'Conversion Successful!' : 'File Ready for Conversion'}
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
            {result ? (
               <p className="text-xs text-brand-gray pt-2 mt-2">{result.length} transactions found. Ready to download.</p>
            ) : (
               <p className="text-xs text-brand-gray pt-2 mt-2">Ready to convert. Click the button below.</p>
            )}
        </div>
      ) : null}
      
      <div className="mt-6">
        <button 
          onClick={handleConvert}
          disabled={!file || isLoading || !!result} 
          className="w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
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