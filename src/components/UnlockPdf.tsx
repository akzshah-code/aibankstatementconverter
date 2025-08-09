import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useUser } from '../contexts/UserContext';

type Status = 'idle' | 'analyzing' | 'password' | 'loading' | 'unlocked';

const UnlockPdf: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [unlockedMessage, setUnlockedMessage] = useState<string>('');
  const [unsupportedEncryptionError, setUnsupportedEncryptionError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, recordConversion, checkAnonymousUsage, recordAnonymousUsage } = useUser();

  const reset = useCallback((keepFile: boolean = false) => {
    if (!keepFile) {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
    setError(null);
    setStatus('idle');
    setPassword('');
    setShowPassword(false);
    setUnsupportedEncryptionError(false);
  }, []);

  const handleFile = useCallback(async (selectedFile: File | null) => {
    reset();

    if (selectedFile) {
        if (selectedFile.type !== 'application/pdf') {
            setError('Invalid file type. Please select a PDF.');
            return;
        }
        if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit
            setError('File is too large. Maximum size is 20MB.');
            return;
        }

        // Check user quota (unlocking costs 1 page credit)
        const pageCost = 1;
        if (user) {
            const remainingPages = user.subscription.pagesQuota - user.subscription.pagesUsed;
            if (pageCost > remainingPages) {
                setError(`You do not have enough page credits to unlock a file. This action requires ${pageCost} credit, but you only have ${remainingPages} remaining.`);
                return;
            }
        } else {
            if (!checkAnonymousUsage()) {
                setError('You have reached your daily limit for anonymous actions (1/day). Please register for a free account to unlock more files.');
                return;
            }
        }

        setFile(selectedFile);
        setStatus('analyzing');

        try {
            const fileBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

            if (pdfDoc.isEncrypted) {
                setStatus('password');
            } else {
                if (user) recordConversion(selectedFile.name, pageCost, 'Completed');
                else recordAnonymousUsage();

                const unlockedPdfBytes = await pdfDoc.save();
                const unlockedFile = new File([unlockedPdfBytes], selectedFile.name.replace(/\.pdf$/i, '-unlocked.pdf'), { type: 'application/pdf' });
                setFile(unlockedFile);
                setUnlockedMessage('This PDF is not password protected.');
                setStatus('unlocked');
            }
        } catch (err: unknown) {
            console.error("PDF analysis failed:", err);
            reset();
            setError('Failed to read PDF. The file may be corrupted.');
        }
    }
  }, [reset, user, checkAnonymousUsage, recordConversion, recordAnonymousUsage]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (!password.trim()) {
        setError("Please enter a password.");
        return;
    }
    setStatus('loading');
    setError(null);
    setUnsupportedEncryptionError(false);
    
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer, { password: password } as any);
      
      const unlockedPdfBytes = await pdfDoc.save();
      const unlockedFile = new File([unlockedPdfBytes], file.name.replace(/\.pdf$/i, '-unlocked.pdf'), { type: 'application/pdf' });
      
      const pageCost = 1;
      if (user) recordConversion(file.name, pageCost, 'Completed');
      else recordAnonymousUsage();
      
      setFile(unlockedFile);
      setUnlockedMessage('PDF Unlocked Successfully!');
      setStatus('unlocked');
      setPassword('');

    } catch (err: unknown) {
      setStatus('password'); // Go back to password entry screen
      if (err instanceof Error && (err.name === 'PasswordIsIncorrectError' || (err.message && err.message.toLowerCase().includes('encrypted')))) {
        setError('Incorrect password. If you are certain the password is correct, the file may use an encryption method that is not supported.');
        setUnsupportedEncryptionError(true);
      } else {
        console.error("PDF Unlock failed:", err);
        setError('An unexpected error occurred. The file may be corrupted or use unsupported encryption.');
      }
    }
  };
  
  const handleDownload = () => {
    if (!file || status !== 'unlocked') return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name; // Already renamed to "-unlocked.pdf"
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'idle') setIsDragging(true);
  }, [status]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (status === 'idle') {
        const droppedFile = e.dataTransfer.files?.[0] || null;
        await handleFile(droppedFile);
    }
  }, [status, handleFile]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    await handleFile(selectedFile);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const boxClassName = `relative border-2 border-dashed rounded-xl p-8 md:p-12 w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'}`;

  const renderContent = () => {
      switch (status) {
          case 'unlocked':
              return (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                  <div className="text-center p-8 bg-green-50 border-2 border-dashed border-green-300 rounded-xl">
                    <div className="text-green-500 text-6xl mb-4">
                      <i className="fas fa-unlock"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{unlockedMessage}</h3>
                    <p className="text-gray-600 mt-2">{file?.name}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                     <button onClick={handleDownload} className="w-full sm:w-auto flex-1 bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-primary-hover transition-all duration-300 text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                        <i className="fas fa-download"></i>Download PDF
                     </button>
                     <button onClick={() => reset()} className="w-full sm:w-auto flex-1 bg-gray-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-700 transition-all duration-300 text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                        <i className="fas fa-sync-alt"></i>Unlock Another
                     </button>
                  </div>
                </div>
              );
          case 'analyzing':
          case 'loading':
            return (
                <div className={boxClassName}>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                        <p className="text-lg font-semibold text-gray-700">
                          {status === 'analyzing' ? 'Analyzing your PDF...' : 'Unlocking your PDF...'}
                        </p>
                    </div>
                </div>
            );
          case 'password':
            const inputClassName = `w-full pl-12 pr-14 py-3 border rounded-md shadow-sm focus:outline-none ${
              error
                ? 'border-red-500 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary focus:border-primary'
            }`;
            return (
              <div className="max-w-md mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow-lg animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-800 text-left">Password Required</h3>
                   {error && !unsupportedEncryptionError && <p id="password-error" className="mt-2 text-sm font-medium text-red-600 text-left">{error}</p>}
                   {error && unsupportedEncryptionError && <p id="password-error-special" className="mt-2 text-sm font-medium text-red-600 text-left">{error}</p>}

                  {unsupportedEncryptionError && (
                      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                          <div className="flex">
                              <div className="flex-shrink-0">
                                  <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                              </div>
                              <div className="ml-3">
                                  <h4 className="text-sm font-bold text-blue-800">A Secure Workaround</h4>
                                  <div className="text-sm text-blue-700 mt-2 space-y-2">
                                      <p>
                                          Some banks use advanced encryption our tool can't handle in the browser. For your security, we never upload locked files. Here’s a simple, secure fix:
                                      </p>
                                      <ol className="list-decimal list-inside space-y-1 pl-2">
                                          <li>Open the PDF in your web browser (like Chrome) or Adobe Reader.</li>
                                          <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac) to open the print dialog.</li>
                                          <li>Change the 'Destination' or 'Printer' to <strong>"Save as PDF"</strong>.</li>
                                          <li>Click "Save" to create a new, unlocked version of the file.</li>
                                          <li>Upload that newly saved file to our converter.</li>
                                      </ol>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-4 mb-4">This file is encrypted. Please enter the password to unlock it.</p>
                  
                  <form onSubmit={handleUnlock} className="space-y-4">
                      <div>
                          <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                  <i className="fas fa-lock text-gray-400"></i>
                              </span>
                              <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => {
                                      setPassword(e.target.value);
                                      if (error) setError(null);
                                      if (unsupportedEncryptionError) setUnsupportedEncryptionError(false);
                                  }}
                                  placeholder="Password"
                                  required
                                  className={inputClassName}
                                  aria-invalid={!!error}
                                  aria-describedby={error ? "password-error" : undefined}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center">
                                  <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="h-full px-4 text-gray-600 rounded-r-md hover:bg-gray-100 flex items-center justify-center focus:outline-none"
                                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  >
                                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                  </button>
                              </div>
                          </div>
                         
                      </div>
                      
                      <div className="flex justify-end pt-2">
                           <button onClick={() => reset()} type="button" className="text-sm text-gray-600 hover:text-primary font-semibold mr-4">
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary-hover transition-colors duration-300 shadow-md hover:shadow-lg"
                          >
                              Unlock
                          </button>
                      </div>
                  </form>
              </div>
            );
          case 'idle':
          default:
            return (
              <div 
                className={boxClassName}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  type="file" id="file-input" accept=".pdf" className="hidden"
                  onChange={onFileChange} ref={fileInputRef}
                />
                <>
                  <div className="text-primary text-5xl mb-4">
                    <i className="fas fa-file-import"></i>
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">Drag & Drop your PDF here</p>
                  <p className="text-gray-500 mb-4">or</p>
                  <button
                    onClick={onButtonClick}
                    className="px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-colors duration-300"
                  >
                    Choose PDF
                  </button>
                  {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
                </>
              </div>
            );
      }
  };

  return (
    <section id="unlock" className="py-20 bg-white min-h-[calc(100vh-80px)] flex items-center">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Unlock Encrypted PDFs</h2>
          <p className="text-lg text-secondary mb-4">
            Remove passwords from your PDF files securely in your browser. Your files never leave your computer. Unlocking costs 1 page credit.
          </p>
          <p className="text-xs text-gray-500 italic mb-10">
            By using this tool, you confirm that you have the legal right to access and decrypt this file.
          </p>
        </div>
        
        {renderContent()}

      </div>
    </section>
  );
};

export default UnlockPdf;