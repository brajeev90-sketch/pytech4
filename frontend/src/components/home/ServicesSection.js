import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Palette, Globe, Smartphone, TrendingUp, Target, ArrowRight } from 'lucide-react';

const ServicesSection = ({ services, loading }) => {
  const navigate = useNavigate();

  const serviceIcons = {
    'branding-services': Palette,
    'website-design': Globe,
    'app-development': Smartphone,
    'digital-marketing-services': TrendingUp,
    'enquiry-generation-services': Target,
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" data-testid="services-heading">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = serviceIcons[service.slug] || Globe;
            return (
              <div
                key={service.id}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/${service.slug}/delhi`)}
                data-testid={`service-card-${service.slug}`}
              >
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.short_description}</p>
                <Button
                  variant="link"
                  className="text-cyan-600 hover:text-cyan-700 p-0 group/btn"
                  data-testid={`service-learn-more-${service.slug}`}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;