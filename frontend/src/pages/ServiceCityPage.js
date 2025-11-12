import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { CheckCircle2, MapPin } from 'lucide-react';

// Handle both development and production environments
const getBackendURL = () => {
  // If REACT_APP_BACKEND_URL is set, use it
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // If on pytech.digital, use the preview backend
  if (window.location.hostname === 'pytech.digital' || window.location.hostname === 'www.pytech.digital') {
    return 'https://localseo-master.preview.emergentagent.com';
  }
  
  // Otherwise use current origin (for local dev)
  return window.location.origin;
};

const BACKEND_URL = getBackendURL();
const API = `${BACKEND_URL}/api`;

// Log for debugging
console.log('ServiceCityPage - Current hostname:', window.location.hostname);
console.log('ServiceCityPage - BACKEND_URL:', BACKEND_URL);
console.log('ServiceCityPage - Full API URL:', API);

const ServiceCityPage = () => {
  const { serviceSlug, citySlug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        console.log('Fetching data for:', serviceSlug, citySlug);
        console.log('API URL:', `${API}/service-city/${serviceSlug}/${citySlug}`);
        const response = await axios.get(`${API}/service-city/${serviceSlug}/${citySlug}`);
        console.log('Page data received:', response.data);
        setPageData(response.data);
      } catch (error) {
        console.error('Error fetching page data:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Service or city not found');
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug && citySlug) {
      fetchPageData();
    } else {
      console.error('Missing serviceSlug or citySlug');
      setError('Invalid page parameters');
      setLoading(false);
    }
  }, [serviceSlug, citySlug, API]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-2xl text-gray-600 mb-4">Loading...</div>
          <div className="text-sm text-gray-400">
            {serviceSlug && citySlug ? `Loading ${serviceSlug} in ${citySlug}` : 'Initializing...'}
          </div>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center p-8">
            <div className="text-2xl text-gray-900 mb-4">{error || 'Page not found'}</div>
            <div className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or the service/city combination is not available.
            </div>
            <a href="/" className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors">
              Go to Homepage
            </a>
            <div className="mt-4 text-sm text-gray-400">
              Service: {serviceSlug || 'Not specified'} | City: {citySlug || 'Not specified'}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { service, city, meta_title, meta_description, keywords } = pageData;

  // Schema markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "PyTech Digital",
    "description": meta_description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, Plot No. 21 & 21A, Sector 142",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201304",
      "addressCountry": "IN"
    },
    "telephone": "+919205222170",
    "email": "info@pytechdigital.com",
    "url": `https://pytech.digital/${serviceSlug}/${citySlug}`,
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": city.name
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.name,
      "itemListElement": service.features.map((feature) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature
        }
      }))
    }
  };

  return (
    <>
      <Helmet>
        <title>{meta_title}</title>
        <meta name="description" content={meta_description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={`https://pytech.digital/${serviceSlug}/${citySlug}`} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-50 via-blue-50 to-white py-20" data-testid="service-city-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                <MapPin className="h-4 w-4 text-cyan-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{city.name}, {city.state}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {service.name} Company in {city.name}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {service.description}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to PyTech Digital - Your Trusted {service.name} Partner in {city.name}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Looking for professional {service.name.toLowerCase()} in {city.name}? PyTech Digital is your trusted partner
                for delivering exceptional digital solutions. With over 10 years of experience and a team of expert professionals,
                we've helped hundreds of businesses in {city.name} and across India achieve their digital goals.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our {service.name.toLowerCase()} solutions are tailored to meet the unique needs of businesses in {city.name}.
                We understand the local market dynamics and combine our expertise with cutting-edge technology to deliver results
                that exceed expectations.
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our {service.name} Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive services designed to help your business succeed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`feature-${index}`}
                >
                  <CheckCircle2 className="h-8 w-8 text-cyan-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature}</h3>
                  <p className="text-gray-600 text-sm">
                    Professional {feature.toLowerCase()} services tailored for businesses in {city.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose PyTech Digital in {city.name}?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cyan-600">10+</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Years of Experience</h3>
                <p className="text-gray-600">Proven track record in delivering quality digital solutions</p>
              </div>

              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cyan-600">200+</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Happy Clients</h3>
                <p className="text-gray-600">Trusted by businesses across {city.name} and India</p>
              </div>

              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cyan-600">24/7</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600">Round-the-clock customer support and assistance</p>
              </div>

              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cyan-600">100%</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Satisfaction</h3>
                <p className="text-gray-600">Committed to delivering results that exceed expectations</p>
              </div>

              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cyan-600">₹₹</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">Best value for money with transparent pricing</p>
              </div>

              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">On-Time Delivery</h3>
                <p className="text-gray-600">Reliable project timelines and delivery schedules</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Process
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A streamlined approach to deliver exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {service.process_steps.map((step) => (
                <div key={step.step} className="text-center" data-testid={`process-step-${step.step}`}>
                  <div className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                We Serve {city.name} and Surrounding Areas
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {city.areas.map((area, index) => (
                <div
                  key={index}
                  className="bg-gray-50 px-6 py-3 rounded-full text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                  data-testid={`area-${index}`}
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What makes PyTech Digital the best {service.name.toLowerCase()} company in {city.name}?
                </h3>
                <p className="text-gray-600">
                  We combine years of experience, expert professionals, and cutting-edge technology to deliver exceptional results.
                  Our local presence in {city.name} ensures we understand your market and deliver tailored solutions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How much does {service.name.toLowerCase()} cost in {city.name}?
                </h3>
                <p className="text-gray-600">
                  Our pricing is competitive and transparent. Costs vary based on project scope and requirements.
                  Contact us for a free consultation and customized quote.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long does it take to complete a {service.name.toLowerCase()} project?
                </h3>
                <p className="text-gray-600">
                  Project timelines depend on complexity and scope. We provide realistic timelines during consultation
                  and ensure on-time delivery.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you provide ongoing support after project completion?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer comprehensive ongoing support and maintenance services to ensure your continued success.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I see examples of your previous {service.name.toLowerCase()} work in {city.name}?
                </h3>
                <p className="text-gray-600">
                  Absolutely! We have a portfolio of successful projects. Contact us to see relevant case studies and examples.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />

        <Footer />
      </div>
    </>
  );
};

export default ServiceCityPage;