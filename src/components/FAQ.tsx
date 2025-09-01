
import { useState, type FC } from 'react';

const faqData = [
  {
    question: 'Is my financial data secure with BankConverts?',
    answer: 'Absolutely. Security is our top priority. All file processing, including PDF unlocking, happens directly in your browser. Files are sent securely to our AI for data extraction and are never stored on our servers. Your financial data remains private and under your control.'
  },
  {
    question: 'What file formats can I upload?',
    answer: 'You can upload bank statements in PDF, JPG, JPEG, or PNG formats. Our AI is designed to handle both digitally generated PDFs and scanned images with high accuracy.'
  },
  {
    question: 'Which banks are supported?',
    answer: 'Our tool is built to be universally compatible with statements from thousands of banks worldwide, with special optimization for all major Indian banks. Since our AI reads the document visually, it can adapt to most statement layouts.'
  },
  {
    question: 'How do you handle password-protected PDF files?',
    answer: 'When you upload a password-protected PDF, our application will prompt you to enter the password. The unlocking process is performed securely within your browser, and the password is never sent to our servers. Once unlocked, the file is processed like any other.'
  },
  {
    question: 'Is there a free trial or a free plan available?',
    answer: 'Yes! You can use BankConverts for free to process a limited number of pages daily. This allows you to test the accuracy and speed of our service. For higher volumes, please check out our competitive pricing plans.'
  },
];

// FIX: Explicitly type the component as a React.FunctionComponent (FC) to ensure TypeScript
// correctly handles special React props like 'key' and doesn't treat it as a regular prop.
const FaqItem: FC<{ question: string, answer: string, isOpen: boolean, onClick: () => void }> = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b">
    <button
      onClick={onClick}
      className="w-full text-left py-4 px-6 flex justify-between items-center focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
      aria-expanded={isOpen}
    >
      <span className="text-lg font-medium text-brand-dark">{question}</span>
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="p-6 pt-0 text-brand-gray">
        {answer}
      </div>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-brand-gray">
            Can't find the answer you're looking for? Reach out to our customer support team.
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-lg shadow-md border overflow-hidden">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;