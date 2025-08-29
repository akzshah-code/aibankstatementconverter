import { demoTransactions } from '../lib/demo-data';

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex-grow text-center border border-gray-100">
    <p className="text-sm text-brand-gray">{title}</p>
    <p className="text-2xl font-bold text-brand-blue">{value}</p>
  </div>
);

const DemoView = ({ onExitDemo }: { onExitDemo: () => void }) => {
  
  const handleDownload = () => {
    const headers = ['Date', 'Description', 'Amount', 'Currency', 'Type'];
    const csvContent = [
      headers.join(','),
      ...demoTransactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`, // Escape double quotes
        t.amount,
        t.currency,
        t.type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'demo-transactions.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">Demo Ready!</h2>
      
      {/* Stats Section */}
      <div className="flex justify-center items-stretch gap-4 mb-6">
        <StatCard title="Transactions" value={demoTransactions.length} />
        <StatCard title="Pages Analyzed" value={2} />
        <StatCard title="Processing Time" value="3.5s" />
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-64">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">Date</th>
                <th scope="col" className="px-4 py-2 font-medium">Description</th>
                <th scope="col" className="px-4 py-2 font-medium text-right">Amount</th>
                <th scope="col" className="px-4 py-2 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {demoTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-4 py-3">{transaction.description}</td>
                  <td className={`px-4 py-3 font-medium text-right whitespace-nowrap ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: transaction.currency })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'Credit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Buttons Section */}
      <div className="mt-6 space-y-3">
        <button 
          onClick={handleDownload}
          className="w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download CSV
        </button>
        <button 
          onClick={onExitDemo}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default DemoView;