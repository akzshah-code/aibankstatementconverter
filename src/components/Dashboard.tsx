import { User } from "../lib/types";

interface DashboardProps {
    user: User | null;
}

const StatCard = ({ icon, title, value }: { icon: JSX.Element, title: string, value: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-brand-blue-light p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-brand-gray">{title}</p>
            <p className="text-xl font-semibold text-brand-dark">{value}</p>
        </div>
    </div>
);

const Dashboard = ({ user }: DashboardProps) => {
    if (!user) return null;

    const usagePercentage = user.usage.total > 0 ? (user.usage.used / user.usage.total) * 100 : 0;
    
    return (
        <div className="space-y-8">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-brand-dark">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-brand-gray mt-1">Here's your account overview.</p>
            </div>
            
            <div className="bg-brand-blue-light p-6 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <div>
                        <h2 className="font-semibold text-brand-dark">Upgrade your plan!</h2>
                        <p className="text-sm text-brand-gray">Unlock more pages and premium features.</p>
                    </div>
                </div>
                <a href="#pricing" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap">
                    View Plans
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    title="Current Plan"
                    value={user.plan}
                />
                 <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    title="Next Billing Date"
                    value={user.planRenews}
                />
                 <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                    title="Pages Remaining"
                    value={`${user.usage.total - user.usage.used}`}
                />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">Usage This Period</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                </div>
                <p className="text-sm text-right text-brand-gray mt-2">{user.usage.used} of {user.usage.total} pages used.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">30-Day Conversion History</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">File Name</th>
                                <th scope="col" className="px-6 py-3">Pages</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b">
                                <td colSpan={4} className="text-center px-6 py-10 text-brand-gray">
                                    No conversion history found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;