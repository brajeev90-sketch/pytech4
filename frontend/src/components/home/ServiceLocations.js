import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ServiceLocations = ({ cities, services, loading }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return null;
  }

  const displayedCities = cities
    .filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 18);

  return (
    <section className="py-20 bg-white" id="locations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" data-testid="locations-heading">
            We Serve Across India
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Professional digital services available in major cities across India
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for your city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="city-search-input"
            />
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {displayedCities.map((city) => (
            <button
              key={city.id}
              onClick={() => navigate(`/website-design/${city.slug}`)}
              className="group flex flex-col items-center p-4 bg-gray-50 hover:bg-cyan-50 rounded-xl transition-all duration-300 hover:shadow-md"
              data-testid={`city-button-${city.slug}`}
            >
              <div className="bg-white p-3 rounded-full mb-3 group-hover:bg-cyan-600 transition-colors">
                <MapPin className="h-6 w-6 text-cyan-600 group-hover:text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">{city.name}</span>
              <span className="text-xs text-gray-500 mt-1">{city.state}</span>
            </button>
          ))}
        </div>

        {/* Service Coverage */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4" data-testid="service-coverage-heading">
            Can't Find Your City?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            We provide our services across India. Contact us to discuss how we can help your business grow,
            no matter where you're located.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-cyan-600 hover:bg-gray-100"
            onClick={() => navigate('/contact')}
            data-testid="contact-us-button"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceLocations;