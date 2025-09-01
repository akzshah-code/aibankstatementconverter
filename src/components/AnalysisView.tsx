import { ConversionResult } from '../lib/types';
import { StatCard } from './shared/StatCard';

interface AnalysisViewProps {
    batchResult: ConversionResult;
    onDownload: (format: 'xlsx' | 'csv' | 'json') => void;
}

export const AnalysisView = ({ batchResult, onDownload }: AnalysisViewProps) => {
    return (
        <div className="w-full p-6 bg-brand-blue-light border border-brand-blue/20 rounded-lg mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 text-center">Batch Complete!</h2>
            <div className="flex flex-wrap justify-center items-stretch gap-4 mb-6">
                <StatCard title="Files Processed" value={batchResult.fileCount} align="center" />
                <StatCard title="Successful" value={batchResult.successfulFiles} align="center" />
                <StatCard title="Transactions" value={batchResult.transactions.toLocaleString()} align="center" />
                <StatCard title="Pages Used" value={batchResult.pages} align="center" />
            </div>
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4 text-center">Download Combined Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onClick={() => onDownload('xlsx')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200">Excel (.xlsx)</button>
                    <button onClick={() => onDownload('csv')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200">CSV (.csv)</button>
                    <button onClick={() => onDownload('json')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200">JSON (.json)</button>
                </div>
            </div>
        </div>
    );
};