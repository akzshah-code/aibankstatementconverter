
import type { FC, ReactNode } from 'react';

const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-bold text-brand-dark mt-8 mb-4">{children}</h2>
);

const Paragraph: FC<{ children: ReactNode }> = ({ children }) => (
  <p className="mb-4">{children}</p>
);

const ListItem: FC<{ children: ReactNode }> = ({ children }) => (
  <li className="mb-2 ml-6">{children}</li>
);

const TermsOfService = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Terms of Service</h1>
            <p className="mt-4 text-lg text-brand-gray">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </header>

          <div className="prose lg:prose-lg max-w-none text-brand-dark">
            <Paragraph>
              Welcome to BankConverts.com ("BankConverts", "we", "us", or "our"). These Terms of Service ("Terms") govern your use of our website and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </Paragraph>

            <SectionTitle>1. Acceptance of Terms</SectionTitle>
            <Paragraph>
              By creating an account, uploading files, or otherwise using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use the Service.
            </Paragraph>

            <SectionTitle>2. Description of Service</SectionTitle>
            <Paragraph>
              BankConverts provides a tool to convert bank statements from various formats (such as PDF and images) into structured data formats like Excel (XLSX) and CSV. The conversion process is powered by artificial intelligence and is designed to happen entirely within your browser to protect your privacy.
            </Paragraph>

            <SectionTitle>3. User Conduct and Responsibilities</SectionTitle>
            <Paragraph>You agree not to use the Service for any unlawful purpose or in any way that could harm, disable, or impair the Service. You are responsible for:</Paragraph>
            <ul className="list-disc">
              <ListItem>Ensuring you have the legal right to upload and process any documents you submit.</ListItem>
              <ListItem>Maintaining the confidentiality of your account credentials, if applicable.</ListItem>
              <ListItem>Complying with all applicable laws and regulations regarding your use of the Service.</ListItem>
            </ul>

            <SectionTitle>4. Data Privacy and Security</SectionTitle>
            <Paragraph>
              We prioritize your privacy. All file processing, including for password-protected documents, is performed client-side in your web browser. Your files are not uploaded to or stored on our servers. Please review our Privacy Policy for a detailed explanation of our data practices.
            </Paragraph>
            
            <SectionTitle>5. Intellectual Property</SectionTitle>
            <Paragraph>
              All content and materials available on the Service, including but not limited to text, graphics, website name, code, images, and logos, are the intellectual property of BankConverts and are protected by applicable copyright and trademark law. You may not copy, reproduce, or distribute any content from the Service without our express written permission.
            </Paragraph>

            <SectionTitle>6. Disclaimers</SectionTitle>
            <Paragraph>
              The Service is provided on an "as is" and "as available" basis. While we strive for high accuracy, we do not warrant that the data extracted will be 100% accurate or error-free. You are responsible for verifying the accuracy of the converted data before use. We disclaim all warranties, express or implied, including the warranty of merchantability, fitness for a particular purpose, and non-infringement.
            </Paragraph>

            <SectionTitle>7. Limitation of Liability</SectionTitle>
            <Paragraph>
              In no event shall BankConverts, its owners, or its affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of our Service, whether based on contract, tort, strict liability, or otherwise.
            </Paragraph>
            
            <SectionTitle>8. Changes to Terms</SectionTitle>
            <Paragraph>
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </Paragraph>
            
            <SectionTitle>9. Contact Us</SectionTitle>
            <Paragraph>
              If you have any questions about these Terms, please contact us via the information provided on our website.
            </Paragraph>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;