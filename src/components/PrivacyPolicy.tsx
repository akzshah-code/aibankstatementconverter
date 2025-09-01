
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

const PrivacyPolicy = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Privacy Policy</h1>
            <p className="mt-4 text-lg text-brand-gray">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </header>

          <div className="prose lg:prose-lg max-w-none text-brand-dark">
            <Paragraph>
              Your privacy is critically important to us. At BankConverts.com ("BankConverts", "we", "us", or "our"), we have a few fundamental principles. This Privacy Policy explains how we handle your information when you use our website and services (the "Service").
            </Paragraph>

            <SectionTitle>1. The Core Principle: Your Data is Yours</SectionTitle>
            <Paragraph>
              We have designed BankConverts with privacy as a foundational feature. The core functionality of our service—converting your bank statements—is performed entirely on your device (client-side) in your web browser.
            </Paragraph>
            <ul className="list-disc">
              <ListItem><strong>We do not upload your files to our servers.</strong> The documents you select for conversion are never transmitted to, stored on, or processed by our servers.</ListItem>
              <ListItem><strong>We do not see your financial data.</strong> Because the processing happens in your browser, we have no access to the content of your bank statements.</ListItem>
              <ListItem><strong>Password unlocking is done locally.</strong> If you provide a password to unlock a PDF, it is used only within your browser to decrypt the file and is never sent over the network.</ListItem>
            </ul>

            <SectionTitle>2. Information We Do Collect</SectionTitle>
            <Paragraph>
              While we do not access the content of your files, we do collect a minimal amount of information necessary to provide and improve our service for registered users.
            </Paragraph>
            <ul className="list-disc">
              <ListItem><strong>Account Information:</strong> When you register for an account, we collect your name and email address. This is used to manage your account, track your usage limits, and communicate with you about the service.</ListItem>
              <ListItem><strong>Payment Information:</strong> If you subscribe to a paid plan, our payment processor (Razorpay) will collect your payment details. We do not store your full credit card information on our servers. We only receive a token to confirm your payment status.</ListItem>
              <ListItem><strong>Usage Analytics:</strong> We may collect anonymous analytics data about how users interact with our website (e.g., page views, button clicks) to improve user experience. This data is aggregated and cannot be used to identify you personally.</ListItem>
            </ul>
            
            <SectionTitle>3. How We Use Your Information</SectionTitle>
            <Paragraph>
                We use the information we collect to:
            </Paragraph>
             <ul className="list-disc">
                <ListItem>Provide, maintain, and improve our Service.</ListItem>
                <ListItem>Process transactions and manage your subscription.</ListItem>
                <ListItem>Communicate with you, including sending service-related emails and responding to support requests.</ListItem>
                <ListItem>Monitor and analyze trends to enhance the security and functionality of our Service.</ListItem>
            </ul>

            <SectionTitle>4. Data Security</SectionTitle>
            <Paragraph>
              We implement industry-standard security measures to protect the limited account information we store. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </Paragraph>

            <SectionTitle>5. Third-Party Services</SectionTitle>
            <Paragraph>
              We use third-party services for payment processing (Razorpay) and potentially for analytics. These services have their own privacy policies, and we recommend you review them.
            </Paragraph>

            <SectionTitle>6. Your Rights</SectionTitle>
            <Paragraph>
                You have the right to access, update, or delete your account information at any time by logging into your account or contacting us for assistance.
            </Paragraph>

            <SectionTitle>7. Changes to This Privacy Policy</SectionTitle>
            <Paragraph>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </Paragraph>
            
            <SectionTitle>8. Contact Us</SectionTitle>
            <Paragraph>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@bankconverts.com" className="text-brand-blue hover:underline">support@bankconverts.com</a>.
            </Paragraph>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;