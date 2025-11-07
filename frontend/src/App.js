import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import HomePage from '@/pages/HomePage';
import ServiceCityPage from '@/pages/ServiceCityPage';
import AboutPage from '@/pages/AboutPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ContactPage from '@/pages/ContactPage';
import FloatingButtons from '@/components/FloatingButtons';
import { Toaster } from '@/components/ui/sonner';

function App() {
  useEffect(() => {
    // Remove Emergent branding dynamically
    const removeEmergentBranding = () => {
      const elements = document.querySelectorAll('[data-testid*="emergent"], [class*="emergent"], [style*="z-index: 2147483647"], iframe[style*="position: fixed"]');
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.remove();
        }
      });

      // Check for fixed positioned elements in bottom right
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' && 
            (el.textContent?.toLowerCase().includes('emergent') || 
             el.textContent?.toLowerCase().includes('made with'))) {
          el.remove();
        }
      });
    };

    // Run immediately
    removeEmergentBranding();

    // Run periodically to catch dynamically added elements
    const interval = setInterval(removeEmergentBranding, 1000);

    // Run on DOM changes
    const observer = new MutationObserver(removeEmergentBranding);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <FloatingButtons />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:serviceSlug/:citySlug" element={<ServiceCityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;