const CallToAction = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-lg p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Need more?</h2>
              <p className="text-gray-300 max-w-2xl">
                For clients that need to process documents in different formats, we provide custom services. Tell us how we may be of assistance!
              </p>
            </div>
            <div>
              <a
                href="#contact"
                className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-hover transition-colors duration-200 whitespace-nowrap"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;