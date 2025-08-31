
import { useState, FormEvent } from 'react';
import { FileState } from '../lib/types';
import { LockIcon } from './Icon';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    filesToUnlock: FileState[];
    onUnlockSuccess: (fileId: string, password: string) => void;
}

export const PasswordModal = ({ isOpen, onClose, filesToUnlock, onUnlockSuccess }: PasswordModalProps) => {
    const [passwords, setPasswords] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const handlePasswordChange = (id: string, value: string) => {
        setPasswords(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        Object.entries(passwords).forEach(([id, password]) => {
            if (password) {
                onUnlockSuccess(id, password);
            }
        });
        setPasswords({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-dark flex items-center"><LockIcon className="mr-2"/> Unlock Files</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <p className="text-sm text-brand-gray mb-6">One or more of your PDFs are password protected. Please enter the passwords below.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {filesToUnlock.map(file => (
                        <div key={file.id}>
                            <label htmlFor={`password-${file.id}`} className="block text-sm font-medium text-gray-700 truncate mb-1" title={file.file.name}>
                                {file.file.name}
                            </label>
                            <input
                                type="password"
                                id={`password-${file.id}`}
                                value={passwords[file.id] || ''}
                                onChange={e => handlePasswordChange(file.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="Enter password"
                                autoFocus={filesToUnlock.length === 1}
                            />
                        </div>
                    ))}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90">Unlock</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
