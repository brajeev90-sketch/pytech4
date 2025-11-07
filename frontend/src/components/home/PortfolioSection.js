import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const PortfolioSection = ({ portfolio, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" data-testid="portfolio-heading">
            Our Recent Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore some of our latest projects and success stories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              data-testid={`portfolio-item-${item.id}`}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="text-sm text-cyan-600 font-medium mb-2">{item.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                {item.city && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {item.city}
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => navigate('/portfolio')}
            data-testid="view-all-portfolio-button"
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;