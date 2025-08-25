import { useState } from "react";
import { User, BlogPost, EmailTemplate } from "../lib/types";
import UserManagement from "./admin/UserManagement";
import BlogManagement from "./admin/BlogManagement";
import EmailAutomations from "./admin/EmailAutomations";

interface AdminDashboardProps {
    user: User | null;
    users: User[];
    posts: BlogPost[];
    templates: EmailTemplate[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
    setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
}

const StatCard = ({ icon, title, value }: { icon: JSX.Element, title: string, value: string | number }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-brand-purple-light p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-brand-gray">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);


const AdminDashboard = ({ user, users, posts, templates, setUsers, setPosts, setTemplates }: AdminDashboardProps) => {
    const [activeTab, setActiveTab] = useState('users');

    if (!user || user.role !== 'admin') return null;

    const TABS = [
        { id: 'users', label: 'User Management' },
        { id: 'blog', label: 'Blog Management' },
        { id: 'emails', label: 'Email Automations' },
    ];
    
    // Calculate stats from props
    const totalUsers = users.length;
    const professionalPlans = users.filter(u => u.plan === 'Professional').length;
    const starterPlans = users.filter(u => u.plan === 'Starter').length;
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
                                ? 'border-brand-purple text-brand-purple'
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
                <h2 className="text-2xl font-bold text-brand-dark">Analytics & Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.24-1.88M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.284.24-1.88M12 11a4 4 0 110-8 4 4 0 010 8z" /></svg>}
                        title="Total Users"
                        value={totalUsers}
                    />
                    <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                        title="Professional Plans"
                        value={professionalPlans}
                    />
                     <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                        title="Starter Plans"
                        value={starterPlans}
                    />
                     <StatCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                        title="Total Pages Used"
                        value={totalPagesUsed}
                    />
                </div>
            </div>

            {/* Content for active tab */}
            <div>
                {activeTab === 'users' && <UserManagement users={users} setUsers={setUsers} />}
                {activeTab === 'blog' && <BlogManagement posts={posts} setPosts={setPosts} />}
                {activeTab === 'emails' && <EmailAutomations templates={templates} setTemplates={setTemplates} />}
            </div>

        </div>
    );
};

export default AdminDashboard;