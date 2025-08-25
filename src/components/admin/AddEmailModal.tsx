import { useState, FormEvent } from 'react';
import { EmailTemplate } from '../../lib/types';

interface AddEmailModalProps {
  onSave: (template: Omit<EmailTemplate, 'id'>) => void;
  onClose: () => void;
}

const AddEmailModal = ({ onSave, onClose }: AddEmailModalProps) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [trigger, setTrigger] = useState('');
  const [active, setActive] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name, subject, trigger, active });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-dark">Add New Email Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"/>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"/>
          </div>
          <div>
            <label htmlFor="trigger" className="block text-sm font-medium text-gray-700">Trigger</label>
            <input type="text" name="trigger" id="trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="e.g., On User Registration" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"/>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="active" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"/>
            <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-brand-purple text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90">Create Template</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmailModal;