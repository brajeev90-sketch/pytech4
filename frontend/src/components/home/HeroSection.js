import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6" data-testid="hero-badge">
            <Sparkles className="h-4 w-4 text-cyan-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Your Trusted Digital Partner</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" data-testid="hero-heading">
            Transform Your Business with
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Digital Excellence
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10" data-testid="hero-subheading">
            Leading digital agency in India offering professional branding, website design, app development,
            digital marketing, and enquiry generation services across the nation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg group"
              onClick={() => navigate('/contact')}
              data-testid="hero-get-started-button"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-8 py-6 text-lg"
              onClick={() => navigate('/portfolio')}
              data-testid="hero-view-portfolio-button"
            >
              View Portfolio
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="trust-indicator-projects">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600 mt-1">Projects Delivered</div>
            </div>
            <div className="text-center" data-testid="trust-indicator-clients">
              <div className="text-3xl font-bold text-gray-900">200+</div>
              <div className="text-sm text-gray-600 mt-1">Happy Clients</div>
            </div>
            <div className="text-center" data-testid="trust-indicator-cities">
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600 mt-1">Cities Served</div>
            </div>
            <div className="text-center" data-testid="trust-indicator-experience">
              <div className="text-3xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-600 mt-1">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;