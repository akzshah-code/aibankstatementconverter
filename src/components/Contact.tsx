
import { useState, FormEvent, ChangeEvent } from 'react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a backend service.
    // For this demo, we'll just log it and show a success message.
    console.log('Form submitted:', formState);
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Get in Touch</h1>
          <p className="mt-4 text-lg text-brand-gray">
            We'd love to hear from you. Fill out the form below or email us directly.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          {isSubmitted ? (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-brand-dark">Thank you!</h2>
              <p className="text-brand-gray mt-2">Your message has been sent. We'll get back to you shortly.</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-brand-dark">Contact Information</h3>
                <p className="text-brand-gray">
                    Email us at: <a href="mailto:support@bankconverts.com" className="text-brand-blue hover:underline">support@bankconverts.com</a>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue transition-colors"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-brand-blue text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-blue-hover transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;