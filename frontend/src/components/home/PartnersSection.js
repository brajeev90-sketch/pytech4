import React from 'react';

const PartnersSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="partners-heading">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by industry leaders and partnered with global technology giants
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {/* Google Partner */}
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" data-testid="partner-google">
            <img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
              alt="Google Partner"
              className="h-12 w-auto"
            />
          </div>

          {/* Amazon Partner */}
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" data-testid="partner-amazon">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon Partner"
              className="h-10 w-auto"
            />
          </div>

          {/* Microsoft Partner */}
          <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" data-testid="partner-microsoft">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft Partner"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Partner Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          <div className="bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-sm font-medium text-gray-700">Google Partner</span>
          </div>
          <div className="bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-sm font-medium text-gray-700">AWS Partner</span>
          </div>
          <div className="bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-sm font-medium text-gray-700">Microsoft Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
