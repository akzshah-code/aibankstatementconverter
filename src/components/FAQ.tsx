import React, { useState } from 'react';

const faqData = [
    {
        question: "Is my banking data secure?",
        answer: "Absolutely! We use bank-grade 256-bit encryption for all data transfers and storage. Files are automatically deleted from our servers immediately after processing. We never store your financial data long-term."
    },
    {
        question: "Can it read scanned statements or photographs?",
        answer: "Yes! Our advanced AI combines OCR (Optical Character Recognition) with bank statement pattern recognition to accurately extract data even from low-quality scans or mobile photographs of statements."
    },
    {
        question: "What file types are accepted, and what if my PDF is password-protected?",
        answer: "We accept PDF, JPG, and PNG files for conversion. If your PDF is password-protected, please use our 'Unlock PDF' tool first. If the tool shows an error even with the correct password, it's likely due to advanced encryption. You can securely unlock it yourself by opening the file in your browser or Adobe Reader, pressing Ctrl+P (or Cmd+P), and choosing 'Save as PDF' as the printer. Then, upload the new, unlocked file to our converter."
    },
    {
        question: "Do you offer an API for integration?",
        answer: "Yes, we offer a robust API as part of our Pro plan. You can integrate AI Bank Statement Converter directly with your accounting software, ERP, or custom applications. Our API documentation is comprehensive and we provide dedicated support for integration."
    },
    {
        question: "Which banks do you support?",
        answer: "We currently support all major Indian banks including HDFC, ICICI, SBI, Axis, Kotak, IDFC FIRST, and more. New formats are added every month. If your bank isn't listed, contact us and we'll prioritize adding it."
    },
    {
        question: "What file formats can I export to?",
        answer: "You can export your bank statement data to Excel (XLSX), CSV, or JSON formats. The Excel format is optimized for direct import into Tally, Zoho Books, and other accounting software."
    }
];

const FaqItem: React.FC<{ item: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 py-4 last:border-b-0">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span>{item.question}</span>
                <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}></i>
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-gray-600 pt-2">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};


const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first item by default

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-gray-50 py-12 md:py-20 animate-fade-in">
            <div className="container mx-auto px-6 max-w-4xl">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Frequently Asked Questions</h1>
                    <p className="mt-4 text-lg text-secondary">
                        Find answers to common questions about AI Bank Statement Converter.
                    </p>
                </header>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


export default FAQ;