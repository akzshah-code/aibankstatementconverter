
import type { ReactNode } from 'react';

// FIX: Added the `children` prop to allow embedding additional components like progress bars or text.
interface StatCardProps {
    icon?: ReactNode;
    title: string;
    value: string | number;
    children?: ReactNode;
    align?: 'left' | 'center';
}

// FIX: Updated component to render children below the main value, and adjusted flex alignment for consistency.
export const StatCard = ({ icon, title, value, children, align = 'left' }: StatCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4 flex-grow">
        {icon && (
            <div className="bg-brand-blue-light p-3 rounded-full flex-shrink-0">
                {icon}
            </div>
        )}
        <div className={`flex-grow ${align === 'center' ? 'text-center w-full' : ''}`}>
            <p className="text-sm text-brand-gray">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
            {children && <div className="mt-2">{children}</div>}
        </div>
    </div>
);