import React from 'react';
import { Award, Users, Target, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Award,
      value: '500+',
      label: 'Projects Completed',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Users,
      value: '200+',
      label: 'Happy Clients',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Target,
      value: '50+',
      label: 'Cities Covered',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Client Satisfaction',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="stats-heading">
            Our Achievements
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Numbers that speak for our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group"
                data-testid={`stat-card-${index}`}
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                  <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-full">
                    <Icon className="h-10 w-10" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;