import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { ConversionHistoryItem } from '@/lib/types';

interface DashboardProps {
    onNavigateToPricing: () => void;
}

const StatCard: React.FC<{ icon: string; value: string; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const HistoryTable: React.FC<{ history: ConversionHistoryItem[] }> = ({ history }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">File Name</th>
                    <th scope="col" className="px-6 py-3 text-center">Pages</th>
                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                {history.length > 0 ? history.map(item => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {new Date(item.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 truncate max-w-sm" title={item.fileName}>{item.fileName}</td>
                        <td className="px-6 py-4 text-center">{item.pages}</td>
                        <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.status}
                            </span>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="text-center py-10 text-gray-500">No conversion history from the last 30 days.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToPricing }) => {
    const { user } = useUser();

    if (!user) {
        return (
            <div className="text-center py-20">
                <p>Loading user data or not logged in...</p>
            </div>
        );
    }

    const { subscription, history, name } = user;
    const { planName, pagesUsed, pagesQuota, endDate, isAnnual } = subscription;

    const usagePercentage = pagesQuota > 0 ? (pagesUsed / pagesQuota) * 100 : 0;
    const remainingPages = pagesQuota - pagesUsed;
    const renewalDate = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
            <div className="container mx-auto px-6 space-y-10 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back, {name}!</h1>
                    <p className="text-gray-600">Here's your account overview.</p>
                </div>
                
                {planName !== 'Business' && (
                    <div className="bg-primary/10 border-l-4 border-primary text-primary-dark p-4 rounded-r-lg flex items-center justify-between">
                        <div className="flex items-center">
                           <i className="fas fa-rocket mr-3 text-primary"></i>
                           <p className="text-gray-700">
                             <span className="font-bold">Upgrade your plan!</span> Unlock more pages and premium features.
                           </p>
                        </div>
                         <button onClick={onNavigateToPricing} className="bg-primary text-white font-semibold px-5 py-2 rounded-md hover:bg-primary-hover transition-colors text-sm whitespace-nowrap">
                            View Plans
                        </button>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon="fa-file-alt" value={planName} label="Current Plan" />
                    <StatCard icon="fa-calendar-alt" value={renewalDate} label={isAnnual ? "Renews On" : "Next Billing Date"} />
                    <StatCard icon="fa-balance-scale-right" value={`${remainingPages}`} label="Pages Remaining" />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Usage This Period</h2>
                    <p className="text-sm text-gray-500 mb-4">{pagesUsed} of {pagesQuota} pages used.</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-primary h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${usagePercentage}%` }}
                            role="progressbar"
                            aria-valuenow={pagesUsed}
                            aria-valuemin={0}
                            aria-valuemax={pagesQuota}
                            aria-label={`Usage: ${pagesUsed} of ${pagesQuota} pages`}
                        ></div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">30-Day Conversion History</h2>
                    <HistoryTable history={history} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;