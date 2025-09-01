
import { useState, lazy, Suspense, Dispatch, SetStateAction } from "react";
import { User, BlogPost, EmailTemplate, EmailRoute } from "../lib/types";
import { StatCard } from "./shared/StatCard";
import { ChartCard } from "./shared/ChartCard";
import BarChart from "./charts/BarChart";

// Lazy-load the components for each admin tab to split them into separate chunks.
const UserManagement = lazy(() => import("./admin/UserManagement"));
const BlogManagement = lazy(() => import("./admin/BlogManagement"));
const EmailAutomations = lazy(() => import("./admin/EmailAutomations"));
const EmailRouting = lazy(() => import("./admin/EmailRouting"));


interface AdminDashboardProps {
    user: User | null;
    users: User[];
    posts: BlogPost[];
    templates: EmailTemplate[];
    routes: EmailRoute[];
    setUsers: Dispatch<SetStateAction<User[]>>;
    setPosts: Dispatch<SetStateAction<BlogPost[]>>;
    setTemplates: Dispatch<SetStateAction<EmailTemplate[]>>;
    setRoutes: Dispatch<SetStateAction<EmailRoute[]>>;
}

const TabContentFallback = () => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-brand-gray">Loading section...</p>
    </div>
);


const AdminDashboard = ({ user, users, posts, templates, routes, setUsers, setPosts, setTemplates, setRoutes }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState('users');

    if (!user || user.role !== 'admin') return null;

    const TABS = [
        { id: 'users', label: 'User Management' },
        { id: 'blog', label: 'Blog Management' },
        { id: 'emails', label: 'Email Automations' },
        { id: 'routing', label: 'Email Routing' },
    ];
    
    // Calculate stats from props
    const totalUsers = users.length;
    const planCounts = users.reduce((acc, user) => {
        acc[user.plan] = (acc[user.plan] || 0) + 1;
        return acc;
    }, {} as Record<User['plan'], number>);

    const barChartData = [
        { label: 'Free', value: planCounts.Free || 0 },
        { label: 'Starter', value: planCounts.Starter || 0 },
        { label: 'Professional', value: planCounts.Professional || 0 },
        { label: 'Business', value: planCounts.Business || 0 },
    ];

    const totalPagesUsed = users.reduce((sum, u) => sum + u.usage.used, 0);

    return (
        <div className="space-y-8">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-brand-dark">Admin Dashboard</h1>
                <p className="text-brand-gray mt-1">Application overview and user management.</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                ? 'border-brand-blue text-brand-blue'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Analytics Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-brand-dark">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.24-1.88M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.284.24-1.88M12 11a4 4 0 110-8 4 4 0 010 8z" /></svg>}
                        title="Total Users"
                        value={totalUsers}
                    />
                    <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                        title="Active Subscriptions"
                        value={totalUsers - (planCounts.Free || 0)}
                    />
                     <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                        title="Total Revenue (MRR)"
                        value={"$0"}
                    />
                     <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                        title="Total Pages Used"
                        value={totalPagesUsed.toLocaleString()}
                    />
                </div>
                <div className="pt-4">
                    <ChartCard title="User Analytics by Plan">
                        <BarChart data={barChartData} />
                    </ChartCard>
                </div>
            </div>

            {/* Content for active tab */}
            <div>
                <Suspense fallback={<TabContentFallback />}>
                    {activeTab === 'users' && <UserManagement users={users} setUsers={setUsers} />}
                    {activeTab === 'blog' && <BlogManagement posts={posts} setPosts={setPosts} />}
                    {activeTab === 'emails' && <EmailAutomations templates={templates} setTemplates={setTemplates} />}
                    {activeTab === 'routing' && <EmailRouting routes={routes} setRoutes={setRoutes} />}
                </Suspense>
            </div>

        </div>
    );
};

export default AdminDashboard;