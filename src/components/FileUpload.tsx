
import { useState, useRef, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import ExcelJS from 'exceljs';
import { AuthUser, FileState, ConversionResult } from '../lib/types';
import { getPlanDetails } from '../lib/plans';
import { extractTransactionsFromApi } from '../services/apiService';
import { FileUploadIcon, CloudUploadIcon, LockIcon, XIcon, CogsIcon } from './Icon.tsx';
import { PasswordModal } from './PasswordModal.tsx';
import { AnalysisView } from './AnalysisView.tsx';
import CliCommandView from './CliCommandView.tsx';

const generateId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const StatusBadge = ({ status }: { status: FileState['status'] }) => {
    const statusMap = {
        queued: { text: 'Queued', className: 'bg-gray-200 text-gray-800' },
        locked: { text: 'Password Required', className: 'bg-yellow-200 text-yellow-800' },
        processing: { text: 'Processing', className: 'bg-blue-200 text-blue-800' },
        success: { text: 'Success', className: 'bg-green-200 text-green-800' },
        error: { text: 'Error', className: 'bg-red-200 text-red-800' },
    };
    const { text, className } = statusMap[status] || { text: 'Unknown', className: '' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{text}</span>;
};

export const FileUpload = ({ user, onConversionComplete }: { user: AuthUser | null, onConversionComplete: (result: ConversionResult) => void }) => {
    const [files, setFiles] = useState<FileState[]>([]);
    const [isProcessingBatch, setIsProcessingBatch] = useState(false);
    const [batchResult, setBatchResult] = useState<ConversionResult | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [cliVisibility, setCliVisibility] = useState<{ [key: string]: boolean }>({});
    const [copiedCommandId, setCopiedCommandId] = useState<string | null>(null);

    const toggleCliVisibility = (id: string) => {
        setCliVisibility(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopyCommand = (command: string, id: string) => {
        navigator.clipboard.writeText(command).then(() => {
            setCopiedCommandId(id);
            setTimeout(() => setCopiedCommandId(null), 2000);
        }).catch(err => {
            console.error('Failed to copy command: ', err);
        });
    };

    const resetState = () => {
        setFiles([]);
        setIsProcessingBatch(false);
        setBatchResult(null);
        setGlobalError(null);
        setIsPasswordModalOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const updateFileState = (id: string, updates: Partial<FileState>) => {
        setFiles(prevFiles => prevFiles.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        setGlobalError(null);
        if(!isProcessingBatch) setBatchResult(null);

        const newFilesPromises = Array.from(selectedFiles).map(async (file): Promise<FileState> => {
            const fileInfo: FileState = {
                id: generateId(),
                file, status: 'queued', progress: 0, transactions: [],
                error: null, pages: 0, password: null,
            };

            if (file.size > 10 * 1024 * 1024) {
                fileInfo.status = 'error';
                fileInfo.error = 'File size exceeds 10MB.';
                return fileInfo;
            }

            if (file.type === 'application/pdf') {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                    if (pdfDoc.isEncrypted) {
                        fileInfo.status = 'locked';
                    }
                } catch (err) {
                    fileInfo.status = 'error';
                    fileInfo.error = 'Invalid or corrupted PDF. Please provide a valid file.';
                }
            }
            return fileInfo;
        });

        const newFiles = await Promise.all(newFilesPromises);
        setFiles(prev => [...prev, ...newFiles]);

        if (newFiles.some(f => f.status === 'locked')) {
            setIsPasswordModalOpen(true);
        }
    };
    
    const handleUnlockSuccess = (fileId: string, password: string) => {
        updateFileState(fileId, { status: 'queued', password: password, error: null });
        // If all files are unlocked, close the modal
        const stillLocked = files.filter(f => f.id !== fileId && f.status === 'locked');
        if (stillLocked.length === 0) {
            setIsPasswordModalOpen(false);
        }
    };

    const handleRemoveFile = (idToRemove: string) => {
        setFiles(files.filter(f => f.id !== idToRemove));
    };
    
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            const syntheticEvent = { target: { files: e.dataTransfer.files } } as unknown as ChangeEvent<HTMLInputElement>;
            await handleFileChange(syntheticEvent);
        }
    };
    
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragOver(true);
        else if (e.type === 'dragleave') setIsDragOver(false);
    };

    const processFile = async (id: string) => {
        const fileToProcess = files.find(f => f.id === id);
        if (!fileToProcess) return;

        updateFileState(id, { status: 'processing', progress: 0, error: null });
        
        try {
            updateFileState(id, { progress: 30 });
            const parsedData = await extractTransactionsFromApi(fileToProcess.file, fileToProcess.password);
            
            updateFileState(id, { progress: 90 });
            if (!Array.isArray(parsedData)) throw new Error("AI returned invalid data structure.");

            const pagesProcessed = Math.ceil(parsedData.length / 25) || 1;
            updateFileState(id, { status: 'success', progress: 100, transactions: parsedData, pages: pagesProcessed });
            return { pages: pagesProcessed, transactions: parsedData.length };
        } catch (e: any) {
            const errorMessage = e.message || 'An unknown error occurred.';
            let status: FileState['status'] = 'error';

            if (errorMessage.includes('Unsupported encryption')) status = 'error';
            else if (errorMessage.includes('Incorrect password')) status = 'locked';
            else if (errorMessage.includes('PDF is encrypted')) status = 'locked';

            updateFileState(id, { status, error: errorMessage, progress: 100, password: status === 'locked' ? null : fileToProcess.password });
            return { pages: 0, transactions: 0 };
        }
    };
    
    const handleConvertAll = async () => {
        if (files.some(f => f.status === 'locked')) {
            setIsPasswordModalOpen(true);
            return;
        }

        if (user) {
            if (user.plan === 'Free') {
                const now = Date.now();
                const dailyUsage = user.dailyUsage || { pagesUsed: 0, resetTimestamp: 0 };
                const currentUsage = now > dailyUsage.resetTimestamp ? 0 : dailyUsage.pagesUsed;

                if (currentUsage >= 5) {
                    const resetTime = new Date(dailyUsage.resetTimestamp).toLocaleString();
                    setGlobalError(`You have reached your daily limit of 5 pages. Your limit resets on ${resetTime}.`);
                    return;
                }
            } else {
                const planDetails = getPlanDetails(user.plan);
                if (user.usage.used >= planDetails.pages) {
                    setGlobalError(`You have used all ${planDetails.pages} pages for your current billing cycle. Please upgrade your plan.`);
                    return;
                }
            }
        }
        
        const startTime = Date.now();
        setIsProcessingBatch(true);
        setGlobalError(null);
        setBatchResult(null);

        let totalPages = 0;
        let totalTransactions = 0;
        let successfulFiles = 0;

        for (const file of files) {
            if (file.status === 'queued') {
                const result = await processFile(file.id);
                if (result) {
                    totalPages += result.pages;
                    totalTransactions += result.transactions;
                    if (result.transactions > 0) successfulFiles++;
                }
            }
        }

        const endTime = Date.now();
        const processingTime = (endTime - startTime) / 1000;

        const finalResult: ConversionResult = {
            transactions: totalTransactions,
            pages: totalPages,
            fileCount: files.length,
            successfulFiles,
            processingTime,
        };
        setBatchResult(finalResult);
        if(user && totalPages > 0) onConversionComplete(finalResult);
        setIsProcessingBatch(false);
    };

    const handleDownloadCombined = async (format: 'xlsx' | 'csv' | 'json') => {
        const allTransactions = files.flatMap(f => f.status === 'success' ? f.transactions : []);
        if (allTransactions.length === 0) return;
        const safeFileName = `BankDataBot_Export_${new Date().toISOString().slice(0, 10)}`;

        const dataForExport = allTransactions.map(t => ({
            'Transaction Date': t.date,
            'Value Date': t.valueDate,
            'Description': t.description,
            'Reference': t.reference,
            'Debit': t.debit,
            'Credit': t.credit,
            'Balance': t.balance,
            'Category': t.category,
        }));

        if (format === 'json') {
            const jsonString = JSON.stringify(dataForExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${safeFileName}.json`;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Combined Transactions");
        worksheet.columns = [
            { header: 'Transaction Date', key: 'Transaction Date', width: 15 },
            { header: 'Value Date', key: 'Value Date', width: 15 },
            { header: 'Description', key: 'Description', width: 50 },
            { header: 'Reference', key: 'Reference', width: 20 },
            { header: 'Debit', key: 'Debit', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'Credit', key: 'Credit', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'Balance', key: 'Balance', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'Category', key: 'Category', width: 20 },
        ];
        worksheet.addRows(dataForExport);

        const buffer = format === 'xlsx' ? await workbook.xlsx.writeBuffer() : await workbook.csv.writeBuffer();
        const blob = new Blob([buffer], { type: format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${safeFileName}.${format}`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
    };
    
    const hasQueue = files.length > 0;
    const lockedFiles = files.filter(f => f.status === 'locked');
    const hasLockedFiles = lockedFiles.length > 0;
    const queuedFilesCount = files.filter(f => f.status === 'queued').length;
    const canConvert = hasQueue && !hasLockedFiles && queuedFilesCount > 0 && !isProcessingBatch;

    return (
        <section id="convert" className="converter-section">
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                filesToUnlock={lockedFiles}
                onUnlockSuccess={handleUnlockSuccess}
            />
            <div className={`upload-card ${isDragOver ? 'drag-over' : ''}`} onDragEnter={handleDragEvents} onDragOver={handleDragEvents} onDragLeave={handleDragEvents} onDrop={handleDrop}>
                {!hasQueue && !batchResult && (
                    <>
                        <div className="upload-icon"><FileUploadIcon/></div>
                        <h2 className="upload-title text-2xl font-bold">Upload Bank Statements</h2>
                        <p className="upload-description text-brand-gray">Drag & drop or click to select files for bulk conversion.</p>
                        <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}><CloudUploadIcon/> Choose Files</button>
                    </>
                )}
                
                {hasQueue && (
                    <div className="file-queue-container w-full">
                        {batchResult ? (
                           <AnalysisView batchResult={batchResult} onDownload={handleDownloadCombined} onReset={resetState} />
                        ) : (
                            <>
                                <div className="file-queue space-y-3 max-h-96 overflow-y-auto p-2">
                                    {files.map(f => (
                                        <div key={f.id} className="file-queue-item flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                                            <div className="file-info flex-grow truncate mr-4">
                                                <span className="file-name font-medium text-brand-dark flex items-center truncate">
                                                    {f.status === 'locked' ? <LockIcon className="text-yellow-500 mr-2 flex-shrink-0"/> : <span className="mr-2 flex-shrink-0">📄</span>} 
                                                    <span className="truncate" title={f.file.name}>{f.file.name}</span>
                                                </span>
                                                {f.status === 'processing' && <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-brand-blue h-1.5 rounded-full" style={{ width: `${f.progress}%` }}></div></div>}
                                                {f.error && (
                                                    <div className="text-red-600 text-xs mt-1">
                                                        <span>{f.error}</span>
                                                        {f.error.includes('Unsupported encryption') &&
                                                            <div className="cli-alternative">
                                                                <button className="text-blue-600 hover:underline text-xs" onClick={() => toggleCliVisibility(f.id)}>
                                                                    {cliVisibility[f.id] ? 'Hide' : 'Show'} CLI Alternative
                                                                </button>
                                                                <CliCommandView 
                                                                    file={f}
                                                                    isVisible={cliVisibility[f.id]}
                                                                    onCopy={handleCopyCommand}
                                                                    copiedCommandId={copiedCommandId}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            <div className="file-status flex items-center space-x-3">
                                                <StatusBadge status={f.status} />
                                                <button onClick={() => handleRemoveFile(f.id)} className="btn-remove-file text-gray-400 hover:text-red-500" title="Remove file" disabled={isProcessingBatch}><XIcon /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {hasLockedFiles && (
                                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-md text-sm mt-4">
                                        You have {lockedFiles.length} locked file(s). <button className="font-semibold underline" onClick={() => setIsPasswordModalOpen(true)}>Unlock them</button> to continue.
                                    </div>
                                )}

                                <div className="queue-actions flex justify-between items-center mt-6 pt-4 border-t">
                                    <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={isProcessingBatch}>Add More Files</button>
                                    <button className="btn btn-primary" onClick={handleConvertAll} disabled={!canConvert && !hasLockedFiles}>
                                        {isProcessingBatch ? 'Processing...' : (
                                            hasLockedFiles ? <><LockIcon /> Unlock Files ({lockedFiles.length})</> : <><CogsIcon /> Convert All ({queuedFilesCount})</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.csv,.txt" hidden multiple disabled={isProcessingBatch} />
                {globalError && <div className="error-message bg-red-100 text-red-700 p-3 rounded-md mt-4 text-sm">{globalError}</div>}
            </div>
        </section>
    );
};
