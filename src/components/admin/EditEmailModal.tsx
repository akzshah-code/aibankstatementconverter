import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { EmailTemplate } from '../../lib/types';

interface EditEmailModalProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onClose: () => void;
}

const EditEmailModal = ({ template, onSave, onClose }: EditEmailModalProps) => {
  const [formData, setFormData] = useState<EmailTemplate>(template);

  useEffect(() => {
    setFormData(template);
  }, [template]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: EmailTemplate) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-dark">Edit Email Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"/>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"/>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"/>
            <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmailModal;