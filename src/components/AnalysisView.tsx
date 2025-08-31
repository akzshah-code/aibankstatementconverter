
import { ConversionResult } from '../lib/types';

interface AnalysisViewProps {
    batchResult: ConversionResult;
    onDownload: (format: 'xlsx' | 'csv' | 'json') => void;
    onReset: () => void;
}

const StatCard = ({ title, value }: { title: string, value: string | number }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex-grow text-center border border-gray-100">
        <p className="text-sm text-brand-gray">{title}</p>
        <p className="text-2xl font-bold text-brand-blue">{value}</p>
    </div>
);

export const AnalysisView = ({ batchResult, onDownload, onReset }: AnalysisViewProps) => {
    return (
        <div className="analysis-view">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Batch Complete!</h2>
            <div className="flex justify-center items-stretch gap-4 mb-6">
                <StatCard title="Files Processed" value={batchResult.fileCount} />
                <StatCard title="Successful" value={batchResult.successfulFiles} />
                <StatCard title="Transactions" value={batchResult.transactions.toLocaleString()} />
                <StatCard title="Pages Used" value={batchResult.pages} />
            </div>
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">Download Combined Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <button onClick={() => onDownload('xlsx')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90">Excel (.xlsx)</button>
                    <button onClick={() => onDownload('csv')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90">CSV (.csv)</button>
                    <button onClick={() => onDownload('json')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90">JSON (.json)</button>
                </div>
                <button onClick={onReset} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Convert More Files</button>
            </div>
        </div>
    );
};
