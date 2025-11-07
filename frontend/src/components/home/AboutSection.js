import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
  const features = [
    '10+ Years of Industry Experience',
    'Expert Team of Professionals',
    'Proven Track Record of Success',
    '24/7 Customer Support',
    'Competitive Pricing',
    'On-Time Project Delivery',
  ];

  return (
    <section className="py-20 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6" data-testid="about-heading">
              About PyTech Digital
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              PyTech Digital is a leading digital agency based in Noida, serving clients across India. We specialize in
              creating powerful digital solutions that drive business growth and success.
            </p>
            <p className="text-gray-600 mb-8">
              Our team of experienced professionals is dedicated to delivering high-quality services in branding, web design,
              app development, digital marketing, and lead generation. We combine creativity with technology to create
              exceptional digital experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center" data-testid={`about-feature-${index}`}>
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="w-full h-auto"
                data-testid="about-image"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-transparent"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;