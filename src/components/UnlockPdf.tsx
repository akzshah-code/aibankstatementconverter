import { useState, FormEvent } from 'react';
import { PDFDocument } from 'pdf-lib';

interface UnlockPdfProps {
  file: File;
  onUnlock: (unlockedFile: File) => void;
  onCancel: () => void;
}

const UnlockPdf = ({ file, onUnlock, onCancel }: UnlockPdfProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || isUnlocking) return;

    setIsUnlocking(true);
    setError(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      // FIX: The project's version of pdf-lib seems to have outdated TypeScript definitions
      // that don't include the 'password' option. Casting to 'any' bypasses the incorrect
      // compile-time error, allowing the valid runtime option to be used.
      const pdfDoc = await PDFDocument.load(fileBuffer, { password: password } as any);
      const pdfBytes = await pdfDoc.save();

      const unlockedFile = new File([pdfBytes as BlobPart], file.name, { type: 'application/pdf' });

      onUnlock(unlockedFile);
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes('password')) {
        setError('Incorrect password. Please try again.');
      } else {
        // Provide an actionable solution for unrecoverable errors.
        setError("This PDF appears to be corrupted or uses an unsupported format.<br/><strong class='mt-2 inline-block'>Solution:</strong> Open the file on your computer and use the 'Print to PDF' function to create a new, unlocked copy. Then, upload the new file.");
        console.error("PDF Unlock Error:", err);
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="text-center h-64 flex flex-col justify-center">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-4 text-left" role="alert">
        <p className="font-bold">Password Required</p>
        <p className="text-sm">This PDF is encrypted. Please enter the password to unlock it.</p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-4">
        <div>
          <label htmlFor="pdf-password" className="sr-only">PDF Password</label>
          <div className="relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="pdf-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PDF Password"
              required
              autoFocus
              className={`w-full px-4 py-2 border rounded-md transition-colors pr-10 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'}`}
              aria-describedby={error ? "password-error" : undefined}
              disabled={isUnlocking}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-brand-blue focus:outline-none"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.27 6.347 14.425 4 10 4a9.95 9.95 0 00-4.509 1.071L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
                  <path d="M2.046 10a9.96 9.96 0 011.85-4.175l-1.414-1.414A11.957 11.957 0 000 10a11.957 11.957 0 002.93 5.586l1.414-1.414A9.96 9.96 0 012.046 10z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.73 6.347 5.575 4 10 4s8.27 2.347 9.542 6c-1.272 3.653-5.117 6-9.542 6S1.73 13.653.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          {error && <p id="password-error" className="text-red-600 text-sm mt-1 text-left" dangerouslySetInnerHTML={{ __html: error.replace('Solution:', '<br/><strong class="mt-2 inline-block">Solution:</strong>') }}></p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUnlocking}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUnlocking || !password}
            className="w-full bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUnlocking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Unlocking...
              </>
            ) : 'Unlock & Convert'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnlockPdf;
