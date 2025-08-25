import { useState } from 'react';
import { emailTemplates as initialTemplates } from '../../lib/mock-data';
import { EmailTemplate } from '../../lib/types';
import EditEmailModal from './EditEmailModal';

const EmailAutomations = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    const handleSaveTemplate = (updatedTemplate: EmailTemplate) => {
        setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setEditingTemplate(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">Email Automations</h2>
                <button className="bg-brand-purple text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200">
                    New Template
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b font-medium bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Template Name</th>
                        <th scope="col" className="px-6 py-3">Trigger</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map(template => (
                    <tr key={template.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-semibold">{template.name}</div>
                            <div className="text-brand-gray text-xs">Subject: {template.subject}</div>
                        </td>
                        <td className="px-6 py-4">{template.trigger}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {template.active ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                         <button onClick={() => setEditingTemplate(template)} className="font-medium text-brand-purple hover:text-brand-purple/80">
                            Edit
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {editingTemplate && <EditEmailModal template={editingTemplate} onSave={handleSaveTemplate} onClose={() => setEditingTemplate(null)} />}
        </div>
    );
};

export default EmailAutomations;