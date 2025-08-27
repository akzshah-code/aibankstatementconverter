import React, { useState } from 'react';
import { EmailRoute } from '../../lib/types';
import ToggleSwitch from '../ToggleSwitch';

interface EmailRoutingProps {
  routes: EmailRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<EmailRoute[]>>;
}

const EmailRouting = ({ routes, setRoutes }: EmailRoutingProps) => {
    const [catchAllActive, setCatchAllActive] = useState(true);

    const handleToggle = (routeId: string, newStatus: boolean) => {
        setRoutes(prevRoutes => 
            prevRoutes.map(route => 
                route.id === routeId ? { ...route, active: newStatus } : route
            )
        );
    };

    return (
        <div className="space-y-8">
            {/* Catch-All Rule */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-bold text-brand-dark mb-4">Catch-All Rule</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b font-medium bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Custom address</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr className="border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-semibold">Catch-All</td>
                                <td className="px-6 py-4">Drop</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <ToggleSwitch 
                                            checked={catchAllActive}
                                            onChange={setCatchAllActive}
                                            ariaLabel="Toggle Catch-All rule"
                                        />
                                        <span className={catchAllActive ? 'text-green-700' : 'text-gray-500'}>
                                            {catchAllActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="font-medium text-brand-blue hover:text-brand-blue/80">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
            </div>
            
            {/* Custom Addresses */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-brand-dark">Custom addresses</h2>
                    <p className="text-brand-gray text-sm mt-1">Create custom email addresses and set the action to take on received emails.</p>
                </div>
                
                {/* Filters and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full md:w-auto flex-grow">
                        <input 
                            type="search"
                            placeholder="Search"
                            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
                        <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue">
                            <option>All domains</option>
                        </select>
                         <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue">
                            <option>All actions</option>
                        </select>
                        <button className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200">
                            Create address
                        </button>
                    </div>
                </div>

                {/* Routes Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="border-b font-medium bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Custom address</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Destination</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map(route => (
                                <tr key={route.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{route.address}</td>
                                    <td className="px-6 py-4">{route.action}</td>
                                    <td className="px-6 py-4">{route.destination}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <ToggleSwitch
                                                checked={route.active}
                                                onChange={(newStatus) => handleToggle(route.id, newStatus)}
                                                ariaLabel={`Toggle status for ${route.address}`}
                                            />
                                             <span className={route.active ? 'text-green-700' : 'text-gray-500'}>
                                                {route.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-brand-blue hover:text-brand-blue/80">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmailRouting;