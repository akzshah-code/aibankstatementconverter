import React from 'react';

const ValueCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-3">
            <div className="bg-brand-blue-light p-3 rounded-full text-brand-blue">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
        </div>
        <p className="text-brand-gray">{children}</p>
    </div>
);

const About = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Our Mission: Simplifying Financial Data</h1>
                        <p className="mt-4 text-lg text-brand-gray">We believe that everyone should have easy access to their financial data, free from the tedious task of manual entry.</p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="prose lg:prose-lg text-brand-dark">
                             <h2 className="text-3xl font-bold text-brand-dark mb-4">Our Story</h2>
                             <p>
                                BankConverts was born from a simple frustration: the time-consuming and error-prone process of manually transcribing bank statements. As finance professionals and developers, we knew there had to be a better way.
                            </p>
                            <p>
                                We set out to build a tool that was not only powerful and accurate but also fundamentally secure and easy to use. By harnessing the power of AI and prioritizing on-device processing, we've created a service that puts you in control of your data.
                            </p>
                        </div>
                         <div className="bg-gray-100 rounded-lg p-8 h-full flex items-center justify-center">
                            <img src="/logo.png" alt="BankConverts Logo" className="h-24 w-auto" />
                        </div>
                    </div>

                    <div className="text-center mb-16">
                         <h2 className="text-3xl font-bold text-brand-dark">Our Core Values</h2>
                         <p className="mt-2 text-brand-gray">The principles that guide our work every day.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ValueCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                            title="Security First"
                        >
                            Your privacy is non-negotiable. We build our tools from the ground up to ensure your data stays yours, always.
                        </ValueCard>
                        <ValueCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                            title="User-Centric Design"
                        >
                            We obsess over creating intuitive and seamless experiences. If it's not easy to use, we go back to the drawing board.
                        </ValueCard>
                         <ValueCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                            title="Continuous Innovation"
                        >
                            We are committed to constantly improving our technology to deliver faster, more accurate, and more capable tools.
                        </ValueCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
