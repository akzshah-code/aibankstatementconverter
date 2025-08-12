import React, { useMemo, useRef, useState } from 'react';

type EncryptionKind = 'standard' | 'certificate' | 'none' | 'unknown';
type RLevel = 2 | 3 | 4 | 5 | 6 | null;

interface InspectInfo {
  kind: EncryptionKind;              // 'standard' | 'certificate' | 'none' | 'unknown'
  method?: string;                   // 'AES-256' | 'AES-128' | 'RC4-128' | 'RC4-40' | ...
  rLevel: RLevel;                    // 2/3/4/5/6 when known
  metadataEncrypted?: boolean;       // EncryptMetadata flag
  linearized?: boolean;
  incrementalUpdates?: boolean;
}

interface ConversionResult {
  transactions?: any[];              // your typed shape if you have it
  meta?: Record<string, any>;
  // Optionally include URLs or blobs for unlocked PDF/CSV/XLSX if you return them
}

interface ApiError {
  type:
    | 'wrong_password'
    | 'cert_encryption'
    | 'unsupported_encryption'
    | 'file_too_large'
    | 'invalid_file'
    | 'network'
    | 'server'
    | 'rate_limited'
    | 'unknown';
  message?: string;
  details?: any;
  inspect?: InspectInfo;
}

interface Props {
  onConversionSuccess?: (data: ConversionResult) => void;
  onDownloadUnlocked?: (blob: Blob) => void;    // optional: receive unlocked pdf
  maxSizeMB?: number;                           // default 25
}

const bytesFromMB = (mb: number) => Math.floor(mb * 1024 * 1024);

const normalizePassword = (s: string) =>
  s.normalize('NFC').replace(/\u2019/g, "'").trim();

const Converter: React.FC<Props> = ({
  onConversionSuccess,
  onDownloadUnlocked,
  maxSizeMB = 25,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<'idle' | 'inspecting' | 'unlocking' | 'converting' | 'done' | 'error'>('idle');
  const [inspectInfo, setInspectInfo] = useState<InspectInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  const [progressText, setProgressText] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const sizeLimitBytes = useMemo(() => bytesFromMB(maxSizeMB), [maxSizeMB]);

  const reset = () => {
    setStage('idle');
    setInspectInfo(null);
    setErrorMsg('');
    setHint('');
    setProgressText('');
    abortRef.current?.abort();
    abortRef.current = null;
  };

  const handleFileChange = (f: File | null) => {
    reset();
    setFile(f);
  };

  const validate = (): string | null => {
    if (!file) return 'Please choose a PDF file.';
    const typeOk = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!typeOk) return 'Only PDF files are supported here.';
    if (file.size > sizeLimitBytes) return `File exceeds ${maxSizeMB} MB limit.`;
    return null;
  };

  const mapErrorToUX = (err: ApiError) => {
    switch (err.type) {
      case 'wrong_password':
        return {
          message: 'Incorrect password. Double‑check capitalization and spaces, then try again.',
          hint: 'Tip: Type the password instead of paste; some banks use tricky characters.',
        };
      case 'cert_encryption':
        return {
          message: 'This PDF uses certificate‑based encryption and cannot be unlocked with a password.',
          hint: 'Workaround: Open in Chrome/Adobe → Print → Save as PDF → Upload the new file.',
        };
      case 'unsupported_encryption':
        return {
          message: 'This PDF uses an unsupported encryption variant.',
          hint: 'If possible, “Save as PDF” from a viewer and retry, or request a non‑encrypted statement.',
        };
      case 'file_too_large':
        return {
          message: 'The file is too large for processing.',
          hint: `Try splitting the PDF or compressing below ${maxSizeMB} MB.`,
        };
      case 'invalid_file':
        return {
          message: 'The file appears to be corrupted or not a valid PDF.',
          hint: 'Download the statement again from your bank and retry.',
        };
      case 'rate_limited':
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          hint: 'If this persists, contact support.',
        };
      case 'server':
        return {
          message: 'Server error while processing your file.',
          hint: 'Please try again in a minute.',
        };
      case 'network':
        return {
          message: 'Network error. Please check your connection and retry.',
          hint: '',
        };
      default:
        return {
          message: err.message || 'Something went wrong.',
          hint: '',
        };
    }
  };

  const inspect = async (): Promise<InspectInfo | null> => {
    if (!file) return null;
    setStage('inspecting');
    setProgressText('Inspecting encryption…');
    setBusy(true);
    setErrorMsg('');
    setHint('');
    abortRef.current = new AbortController();

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/inspect', {
        method: 'POST',
        body: fd,
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err: ApiError = await safeJson(res);
        const { message, hint } = mapErrorToUX(err);
        setErrorMsg(message);
        setHint(hint);
        setStage('error');
        setBusy(false);
        return null;
      }

      const info: InspectInfo = await res.json();
      setInspectInfo(info);
      setBusy(false);
      return info;
    } catch {
      setErrorMsg('Network error during inspect. Please retry.');
      setStage('error');
      setBusy(false);
      return null;
    }
  };

  const unlockAndConvert = async () => {
    const invalid = validate();
    if (invalid) {
      setErrorMsg(invalid);
      setStage('error');
      return;
    }

    // Step 1: Inspect
    const info = await inspect();
    if (!info) return;

    if (info.kind === 'certificate') {
      setErrorMsg('This PDF is certificate‑encrypted; a password will not work.');
      setHint('Workaround: Open in Chrome/Adobe → Print → Save as PDF → Upload that file.');
      setStage('error');
      return;
    }

    // Step 2: Unlock + Convert
    setStage('unlocking');
    setProgressText('Unlocking PDF…');
    setBusy(true);
    abortRef.current = new AbortController();

    const fd = new FormData();
    fd.append('file', file as File);

    const pwd = normalizePassword(password);
    if (pwd) fd.append('password', pwd);

    try {
      const res = await fetch('/api/unlock-and-convert', {
        method: 'POST',
        body: fd,
        signal: abortRef.current.signal,
      });

      if (res.status === 401 || res.status === 403) {
        const err: ApiError = await safeJson(res);
        const { message, hint } = mapErrorToUX({ ...err, type: err.type || 'wrong_password' });
        setErrorMsg(message);
        setHint(hint);
        setStage('error');
        setBusy(false);
        return;
      }

      if (!res.ok) {
        const err: ApiError = await safeJson(res);
        const { message, hint } = mapErrorToUX(err);
        if (err.inspect) setInspectInfo(err.inspect);
        setErrorMsg(message);
        setHint(hint);
        setStage('error');
        setBusy(false);
        return;
      }

      // Successful response can be JSON (parsed data) or multipart with unlocked PDF
      const contentType = res.headers.get('content-type') || '';
      let result: ConversionResult | null = null;

      if (contentType.includes('application/json')) {
        result = await res.json();
      } else if (contentType.includes('application/pdf')) {
        // If backend returns unlocked PDF directly
        const blob = await res.blob();
        onDownloadUnlocked?.(blob);
        result = { meta: { note: 'Unlocked PDF returned' } };
      } else if (contentType.startsWith('multipart/')) {
        // Optional: handle multipart mixed (JSON + PDF)
        // For simplicity, you can switch backend to JSON + separate download endpoint
        result = { meta: { note: 'Multipart response handled server-side' } };
      }

      setStage('converting');
      setProgressText('Extracting transactions…');

      // In most designs, the backend already returned extracted data alongside unlock.
      // If not, call a separate /api/convert endpoint here with the unlocked artifact.

      setStage('done');
      setProgressText('Complete.');
      setBusy(false);

      if (result && onConversionSuccess) onConversionSuccess(result);
    } catch {
      setErrorMsg('Network error while unlocking/converting. Please retry.');
      setStage('error');
      setBusy(false);
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setBusy(false);
    setProgressText('');
    if (stage !== 'done') setStage('idle');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Unlock & Convert Bank Statement</h2>

      <div className="space-y-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
          aria-label="Upload PDF statement"
        />

        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (if required by your PDF)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md text-sm"
              aria-label="PDF password"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="px-3 py-2 text-xs border rounded-md text-gray-600 hover:bg-gray-50"
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {inspectInfo && (
          <div className="text-xs text-gray-600 bg-gray-50 border rounded p-3">
            <div className="font-semibold mb-1">Encryption details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <div><span className="text-gray-500">Kind:</span> {inspectInfo.kind}</div>
              <div><span className="text-gray-500">Method:</span> {inspectInfo.method || '—'}</div>
              <div><span className="text-gray-500">R level:</span> {inspectInfo.rLevel ?? '—'}</div>
              <div><span className="text-gray-500">Encrypt metadata:</span> {inspectInfo.metadataEncrypted ? 'Yes' : 'No'}</div>
              <div><span className="text-gray-500">Linearized:</span> {inspectInfo.linearized ? 'Yes' : 'No'}</div>
              <div><span className="text-gray-500">Incremental updates:</span> {inspectInfo.incrementalUpdates ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="text-sm rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
          <div className="font-semibold mb-1">Issue</div>
          <div>{errorMsg}</div>
          {hint && <div className="mt-1 text-red-600/90">{hint}</div>}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={unlockAndConvert}
          disabled={!file || busy}
          className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary-hover disabled:opacity-50"
        >
          {busy ? (stage === 'inspecting' ? 'Inspecting…' : stage === 'unlocking' ? 'Unlocking…' : stage === 'converting' ? 'Converting…' : 'Working…') : 'Unlock & Convert'}
        </button>
        <button
          onClick={cancel}
          disabled={!busy}
          className="px-4 py-2 rounded-md border text-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
        {progressText && <span className="text-sm text-gray-600">{progressText}</span>}
      </div>

      <div className="text-xs text-gray-500">
        - Supports AES‑256 (R=6/R=5), AES‑128 (R=4), and RC4 (R=3/2).  
        - Detects certificate encryption and guides you with a safe workaround.
      </div>
    </div>
  );
};

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // Map generic HTTP into typed error shapes
    const type: ApiError['type'] =
      res.status === 413 ? 'file_too_large' :
      res.status === 429 ? 'rate_limited' :
      res.status >= 500 ? 'server' : 'unknown';
    return { type, message: text };
  }
}

export default Converter;
