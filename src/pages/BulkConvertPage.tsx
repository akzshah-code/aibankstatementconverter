
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileUpload } from '../components/FileUpload';
import { User, ConversionResult } from '../lib/types';

interface BulkConvertPageProps {
  user: User | null;
  onLogout: () => void;
  onConversionComplete: (result: ConversionResult) => void;
}

const BulkConvertPage = ({ user, onLogout, onConversionComplete }: BulkConvertPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-brand-dark">Bulk Statement Converter</h1>
            <p className="mt-2 text-lg text-brand-gray max-w-2xl mx-auto">
                Upload multiple files at once. We'll process them in a batch and provide a combined download.
            </p>
        </div>
        <div className="max-w-4xl mx-auto">
            <FileUpload user={user} onConversionComplete={onConversionComplete} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BulkConvertPage;
