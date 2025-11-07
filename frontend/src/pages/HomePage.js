import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import PartnersSection from '@/components/home/PartnersSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import ServiceLocations from '@/components/home/ServiceLocations';
import ContactSection from '@/components/ContactSection';
import { Helmet } from 'react-helmet';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, citiesRes, testimonialsRes, portfolioRes] = await Promise.all([
          axios.get(`${API}/services`),
          axios.get(`${API}/cities`),
          axios.get(`${API}/testimonials`),
          axios.get(`${API}/portfolio`)
        ]);

        setServices(servicesRes.data);
        setCities(citiesRes.data);
        setTestimonials(testimonialsRes.data);
        setPortfolio(portfolioRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>PyTech Digital - Leading Digital Agency in India | Website Design, App Development & Digital Marketing</title>
        <meta name="description" content="PyTech Digital offers professional branding, website design, app development, digital marketing, and enquiry generation services across India. Contact us: +91 9205 222 170" />
        <meta name="keywords" content="digital agency india, website design, app development, digital marketing, branding services, lead generation" />
        <link rel="canonical" href="https://pytech.digital" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <ServicesSection services={services} loading={loading} />
          <AboutSection />
          <StatsSection />
          <TestimonialsSection testimonials={testimonials} loading={loading} />
          <PortfolioSection portfolio={portfolio} loading={loading} />
          <ServiceLocations cities={cities} services={services} loading={loading} />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;