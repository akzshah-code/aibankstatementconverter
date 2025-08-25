import { useState, useRef } from 'react';

const Converter = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg mx-auto">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-purple-light mb-4">
          <svg className="h-6 w-6 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-brand-dark">Upload Bank Statement</h3>
        <p className="text-sm text-brand-gray mt-1">Supported formats: PDF, JPG, PNG (max 700KB)</p>
      </div>
      <div className="mt-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        {fileName ? (
          <div className="mt-4 text-center p-3 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
          </div>
        ) : (
          <button
            onClick={handleButtonClick}
            className="w-full bg-white border-2 border-dashed border-gray-300 rounded-md px-4 py-8 text-center hover:border-brand-purple transition-colors duration-200"
          >
            <span className="text-brand-purple font-semibold">Choose File</span>
          </button>
        )}
      </div>
      <div className="mt-6">
         <button disabled={!fileName} className="w-full bg-brand-purple text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
          Convert to Excel
        </button>
      </div>
    </div>
  );
};

export default Converter;
