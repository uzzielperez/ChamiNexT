import React from 'react';

const partners = [
  { name: 'Google', logo: 'https://images.pexels.com/photos/2180784/pexels-photo-2180784.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Microsoft', logo: 'https://images.pexels.com/photos/2180783/pexels-photo-2180783.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Amazon', logo: 'https://images.pexels.com/photos/2180782/pexels-photo-2180782.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Meta', logo: 'https://images.pexels.com/photos/2180781/pexels-photo-2180781.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Apple', logo: 'https://images.pexels.com/photos/2180780/pexels-photo-2180780.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const PartnersSection: React.FC = () => {
  return (
    <div className="py-16 bg-slate-900/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <p className="text-center text-gray-400 text-sm mb-8">
          Trusted by leading technology companies worldwide
        </p> */}
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-none w-48 mx-8 opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;