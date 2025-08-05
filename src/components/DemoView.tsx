import React from 'react';
import { demoTransactions } from '../lib/demo-data';
import { Transaction } from '../lib/types';

// Utility functions for data conversion and download
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
    // Add BOM for better Excel compatibility
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

// --- Sub-components ---

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="bg-gray-100 rounded-lg p-6 text-center shadow-sm">
        <p className="text-4xl font-bold text-primary">{value}</p>
        <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-wider">{label}</p>
    </div>
);

// --- Main Demo Component ---

const DemoView: React.FC<{ onExitDemo: () => void }> = ({ onExitDemo }) => {
    
    const handleDownload = (format: 'csv' | 'xls' | 'json') => {
        const dataToConvert: Transaction[] = demoTransactions;
        const baseFilename = 'demo-bank-statement';
        
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
          const transformedData = dataToConvert.map(tx => ({
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
          const csvData = jsonToCsv(dataToConvert, headers);
          const filename = format === 'csv' ? `${baseFilename}.csv` : `${baseFilename}.xls`; 
          downloadData(csvData, filename, 'text/csv;charset=utf-8;');
        }
    };
    
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-6">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Demo Ready!</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                    <StatCard value={demoTransactions.length.toString()} label="Transactions" />
                    <StatCard value="2" label="Pages Analyzed" />
                    <StatCard value="1.7s" label="Processing Time" />
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Narration</th>
                                    <th scope="col" className="px-6 py-3">Chq./Ref.No.</th>
                                    <th scope="col" className="px-6 py-3">ValueDt</th>
                                    <th scope="col" className="px-6 py-3 text-right">WithdrawalAmt</th>
                                    <th scope="col" className="px-6 py-3 text-right">DepositAmt</th>
                                    <th scope="col" className="px-6 py-3 text-right">ClosingBalance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demoTransactions.map((tx, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{tx.date}</td>
                                        <td className="px-6 py-4 max-w-md truncate" title={tx.narration}>{tx.narration}</td>
                                        <td className="px-6 py-4">{tx.refNo ?? ''}</td>
                                        <td className="px-6 py-4">{tx.valueDate}</td>
                                        <td className="px-6 py-4 text-right font-mono text-red-600">
                                            {tx.withdrawalAmt ? tx.withdrawalAmt.toFixed(2) : ''}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-green-600">
                                            {tx.depositAmt ? tx.depositAmt.toFixed(2) : ''}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-800">{tx.closingBalance.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 border-t">
                        {demoTransactions.length} transactions found.
                    </div>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Download Your Combined Data</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-3xl mx-auto">
                        <button onClick={() => handleDownload('xls')} className="w-full md:w-auto flex-1 bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                            <i className="fas fa-file-excel"></i>Excel (.xls)
                        </button>
                        <button onClick={() => handleDownload('csv')} className="w-full md:w-auto flex-1 bg-gray-700 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                            <i className="fas fa-file-csv"></i>CSV (.csv)
                        </button>
                        <button onClick={() => handleDownload('json')} className="w-full md:w-auto flex-1 bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-primary-hover transition-all duration-300 text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                             <i className="fas fa-file-code"></i>JSON (.json)
                        </button>
                    </div>
                </div>
                
                 <div className="text-center">
                     <button 
                        onClick={onExitDemo} 
                        className="bg-primary text-white font-bold py-4 px-10 rounded-lg hover:bg-primary-hover transition-all duration-300 text-lg transform hover:scale-105 flex items-center justify-center gap-2 mx-auto shadow-xl hover:shadow-2xl"
                    >
                        <i className="fas fa-rocket"></i>Start Your Own Conversion
                    </button>
                 </div>

            </div>
        </div>
    );
};

export default DemoView;