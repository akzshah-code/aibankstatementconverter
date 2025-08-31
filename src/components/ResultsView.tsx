import { ExtractedTransaction } from '../lib/types';
import ExcelJS from 'exceljs';

interface ResultsViewProps {
  transactions: ExtractedTransaction[];
  onReset: () => void;
}

const ResultsView = ({ transactions, onReset }: ResultsViewProps) => {

  const handleDownload = async (format: 'xlsx' | 'csv' | 'json') => {
    // Re-order and rename columns for export
    const dataForExport = transactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Amount: t.amount,
      Currency: t.currency,
      Type: t.type
    }));

    if (format === 'json') {
      const jsonStr = JSON.stringify(transactions, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transactions.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: 'Date', key: 'Date', width: 15 },
      { header: 'Description', key: 'Description', width: 50 },
      { header: 'Amount', key: 'Amount', width: 15 },
      { header: 'Currency', key: 'Currency', width: 10 },
      { header: 'Type', key: 'Type', width: 10 },
    ];

    worksheet.addRows(dataForExport);

    // Apply number formatting to the Amount column to display currency correctly.
    worksheet.getColumn('Amount').numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00';
    
    const downloadFile = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (format === 'xlsx') {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        downloadFile(blob, 'transactions.xlsx');
    } else if (format === 'csv') {
        const buffer = await workbook.csv.writeBuffer();
        const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
        downloadFile(blob, 'transactions.csv');
    }
  };
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">Conversion Complete!</h2>
      <p className="text-brand-gray mb-6">{transactions.length} transactions found.</p>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="overflow-y-auto max-h-72">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">Date</th>
                <th scope="col" className="px-4 py-2 font-medium">Description</th>
                <th scope="col" className="px-4 py-2 font-medium text-right">Amount</th>
                <th scope="col" className="px-4 py-2 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-4 py-3">{transaction.description}</td>
                  <td className={`px-4 py-3 font-medium text-right whitespace-nowrap ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transaction.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {transaction.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Download Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-brand-dark mb-4">Download Your Combined Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button onClick={() => handleDownload('xlsx')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm3 2v2h10V5H5zm0 4v2h4v-2H5zm0 4v2h4v-2H5zm6 0v2h4v-2h-4z" />
                </svg>
                Excel (.xlsx)
            </button>
            <button onClick={() => handleDownload('csv')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7zm-1 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                CSV (.csv)
            </button>
            <button onClick={() => handleDownload('json')} className="flex items-center justify-center w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                JSON (.json)
            </button>
        </div>
        <button 
          onClick={onReset}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          Start Your Own Conversion
        </button>
      </div>
    </div>
  );
};

export default ResultsView;