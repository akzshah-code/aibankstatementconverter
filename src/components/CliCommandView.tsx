
import { FileState } from '../lib/types';

interface CliCommandViewProps {
    file: FileState;
    isVisible: boolean;
    onCopy: (command: string, id: string) => void;
    copiedCommandId: string | null;
}

const CliCommandView = ({ file, isVisible, onCopy, copiedCommandId }: CliCommandViewProps) => {
    if (!isVisible) return null;

    const command = `qpdf --decrypt --password=${file.password || 'YOUR_PASSWORD'} "${file.file.name}" "unlocked_${file.file.name}"`;
    const isCopied = copiedCommandId === file.id;

    return (
        <div className="cli-command-view">
            <p>
                This file uses an encryption type (e.g., AES-256) that is best handled by a command-line tool like QPDF.
                You can install it and run the following command:
            </p>
            <div className="command-box">
                <code>{command}</code>
                <button onClick={() => onCopy(command, file.id)} className="btn-copy">
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

export default CliCommandView;
