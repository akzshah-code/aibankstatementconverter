import React, { useState } from 'react';

interface Props {
  onConversionSuccess: (data: any) => void;
}

const Converter: React.FC<Props> = ({ onConversionSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    if (password) formData.append('password', password);

    try {
      const res = await fetch('/api/unlock-and-convert', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const error = await res.json();
        if (error.type === 'cert_encryption') {
          setErrorMsg('This file uses certificate-based encryption (public key) and cannot be unlocked with a password.');
        } else if (error.type === 'wrong_password') {
          setErrorMsg('Incorrect password. Please try again or leave it blank for auto detection.');
        } else if (error.type === 'unsupported_encryption') {
          setErrorMsg('This file uses an unsupported encryption type. Please try a different statement.');
        } else {
          setErrorMsg('Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      const result = await res.json();
      onConversionSuccess(result.data);
    } catch (err) {
      setErrorMsg('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Unlock & Convert Bank Statement</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full"
      />
      <input
        type="password"
        placeholder="Password (if known)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full px-4 py-2 border rounded-md"
      />
      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-hover disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Convert'}
      </button>
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
    </div>
  );
};

export default Converter;
