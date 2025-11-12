import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { ExternalLink } from 'lucide-react';

// Handle both development and production environments  
const getBackendURL = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  if (window.location.hostname === 'pytech.digital' || window.location.hostname === 'www.pytech.digital') {
    return 'https://localseo-master.preview.emergentagent.com';
  }
  return window.location.origin;
};

const BACKEND_URL = getBackendURL();
const API = `${BACKEND_URL}/api`;

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`${API}/portfolio`);
        setPortfolio(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Portfolio - PyTech Digital | Web Design, App Development & Digital Marketing Projects</title>
        <meta
          name="description"
          content="Explore PyTech Digital's portfolio of successful web design, app development, branding, and digital marketing projects across India."
        />
        <link rel="canonical" href="https://pytech.digital/portfolio" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-50 via-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Our Portfolio
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our collection of successful projects and see how we've helped businesses achieve their digital goals
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20">
                <div className="text-2xl text-gray-600">Loading portfolio...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
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
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Want to See Your Project Here?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Let's work together to create something amazing for your business.
            </p>
            <a
              href="#contact"
              className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Your Project
            </a>
          </div>
        </section>

        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default PortfolioPage;