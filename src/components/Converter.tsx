import { useState, useRef, DragEvent } from 'react';

const Converter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      // Future: Add validation for file type and size
      setFile(selectedFile);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    handleFileSelect(selectedFile || null);
    // Reset file input to allow selecting the same file again
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
    setIsDragging(true);
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
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    handleFileSelect(droppedFile || null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
  };

  const dropzoneBaseClasses = "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center space-y-4 h-64";
  const dropzoneIdleClasses = "border-gray-300 bg-gray-50 hover:border-brand-purple";
  const dropzoneDraggingClasses = "border-brand-purple bg-brand-purple-light";

  return (
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        aria-hidden="true"
      />

      {!file ? (
        <div 
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`${dropzoneBaseClasses} ${isDragging ? dropzoneDraggingClasses : dropzoneIdleClasses}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}
          aria-label="File upload dropzone"
        >
          <div className="bg-green-100 rounded-full p-4">
            <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-brand-dark">Drag & Drop Your Files Here</p>
          <p className="text-sm text-brand-gray">or <span className="text-brand-purple font-medium">click to browse</span></p>
          <p className="text-xs text-brand-gray pt-2">Supported formats: PDF, JPG, PNG (max 700KB)</p>
        </div>
      ) : (
        <div className="text-center h-64 flex flex-col justify-center">
            <h3 className="text-lg font-medium text-brand-dark mb-4">File Ready for Conversion</h3>
            <div className="p-3 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
              </div>
              <button onClick={removeFile} aria-label="Remove file" className="ml-4 text-gray-500 hover:text-red-600 transition-colors flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-brand-gray pt-2 mt-2">Ready to convert. Click the button below.</p>
        </div>
      )}
      
      <div className="mt-6">
        <button disabled={!file} className="w-full bg-brand-purple text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
          Convert to Excel
        </button>
      </div>
    </div>
  );
};

export default Converter;