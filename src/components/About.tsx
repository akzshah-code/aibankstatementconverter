import React from 'react';

const ValueCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
        <div className="text-primary text-3xl mb-4">
            <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

const About: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 md:py-20 animate-fade-in">
            <div className="container mx-auto px-6 max-w-5xl">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">About AI Bank Statement Converter</h1>
                    <p className="mt-4 text-lg text-secondary">
                        Streamlining financial data management with the power of artificial intelligence.
                    </p>
                </header>

                <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Our mission is simple: to eliminate the tedious, time-consuming task of manually transcribing bank statements. We believe that small business owners, accountants, and individuals should spend their valuable time on analysis and growth, not on mind-numbing data entry. We provide a fast, accurate, and secure tool that transforms complex financial documents into clean, usable data in seconds.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ValueCard icon="fa-shield-alt" title="Security First">
                            Your privacy is paramount. PDF unlocking happens entirely in your browser, and uploaded statements for conversion are not stored on our servers after processing.
                        </ValueCard>
                        <ValueCard icon="fa-crosshairs" title="Uncompromising Accuracy">
                            Leveraging Google's state-of-the-art Gemini AI, we strive for the highest level of accuracy in data extraction, ensuring you can trust the numbers you work with.
                        </ValueCard>
                        <ValueCard icon="fa-lightbulb" title="Radical Simplicity">
                            We've designed our tool to be incredibly intuitive. A clean interface and a straightforward process mean you can go from PDF to Excel with just a few clicks.
                        </ValueCard>
                    </div>
                </section>

                 <section className="text-center mt-16">
                    <h2 className="text-2xl font-bold text-gray-800">Ready to Get Started?</h2>
                    <p className="text-gray-600 my-4">Join thousands of users saving hours of work every week.</p>
                     <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-hover transition-all duration-300 text-lg shadow-md hover:shadow-lg">
                        Convert Your First Statement
                    </a>
                </section>
            </div>
        </div>
    );
};

export default About;
