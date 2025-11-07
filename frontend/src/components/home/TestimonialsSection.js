import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = ({ testimonials, loading }) => {
  if (loading) {
    return null;
  }

  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" data-testid="testimonials-heading">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow"
              data-testid={`testimonial-card-${testimonial.id}`}
            >
              <Quote className="h-8 w-8 text-cyan-200 mb-4" />
              
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-900">{testimonial.client_name}</div>
                <div className="text-sm text-gray-600">{testimonial.company}</div>
                {testimonial.city && (
                  <div className="text-sm text-cyan-600 mt-1">{testimonial.city}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;