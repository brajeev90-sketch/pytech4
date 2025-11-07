import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const services = [
    { name: 'Branding Services', slug: 'branding-services' },
    { name: 'Website Design', slug: 'website-design' },
    { name: 'App Development', slug: 'app-development' },
    { name: 'Digital Marketing Services', slug: 'digital-marketing-services' },
    { name: 'Enquiry Generation Services', slug: 'enquiry-generation-services' },
    { name: 'Search Engine Optimization', slug: 'search-engine-optimization' },
    { name: 'App Marketing', slug: 'app-marketing' },
    { name: 'Content Marketing', slug: 'content-marketing' },
    { name: 'PPC/Paid Marketing', slug: 'ppc-paid-marketing' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <img
              src="https://customer-assets.emergentagent.com/job_72b5f121-ec40-4b5f-8120-c28f47aa0596/artifacts/gwmdlouv_ib6o5403_logo-pytech.png"
              alt="PyTech Digital Logo"
              className="h-12 w-auto"
              data-testid="logo-image"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              data-testid="nav-home"
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-cyan-600 font-medium transition-colors" data-testid="nav-services-dropdown">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" data-testid="services-dropdown-menu">
                {services.map((service) => (
                  <DropdownMenuItem
                    key={service.slug}
                    onClick={() => navigate(`/${service.slug}/delhi`)}
                    className="cursor-pointer"
                    data-testid={`service-item-${service.slug}`}
                  >
                    {service.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/about"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              data-testid="nav-about"
            >
              About Us
            </Link>
            <Link
              to="/portfolio"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              data-testid="nav-portfolio"
            >
              Portfolio
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+919205222170"
              className="flex items-center text-gray-700 hover:text-cyan-600 transition-colors"
              data-testid="header-phone-link"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-medium">+91 9205 222 170</span>
            </a>
            <Button
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => navigate('/contact')}
              data-testid="get-quote-button"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4" data-testid="mobile-menu">
            <Link
              to="/"
              className="block text-gray-700 hover:text-cyan-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-nav-home"
            >
              Home
            </Link>
            <div className="space-y-2">
              <p className="text-gray-900 font-semibold">Services</p>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={`/${service.slug}/delhi`}
                  className="block pl-4 text-gray-600 hover:text-cyan-600"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-service-${service.slug}`}
                >
                  {service.name}
                </Link>
              ))}
            </div>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-cyan-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-nav-about"
            >
              About Us
            </Link>
            <Link
              to="/portfolio"
              className="block text-gray-700 hover:text-cyan-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-nav-portfolio"
            >
              Portfolio
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-cyan-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-nav-contact"
            >
              Contact
            </Link>
            <a
              href="tel:+919205222170"
              className="flex items-center text-gray-700 hover:text-cyan-600"
              data-testid="mobile-phone-link"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-medium">+91 9205 222 170</span>
            </a>
            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => {
                navigate('/contact');
                setMobileMenuOpen(false);
              }}
              data-testid="mobile-get-quote-button"
            >
              Get Quote
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;