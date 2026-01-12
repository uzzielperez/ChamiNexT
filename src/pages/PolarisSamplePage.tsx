import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, Plane, Hotel, MapPin, Navigation, Calendar, Search, Train, Bus } from 'lucide-react';

const PolarisSamplePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'routes'>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const localPlaces = [
    { id: 1, name: 'Central Park', type: 'Park', distance: '2.3 km', rating: 4.8, transport: 'Bus 15 min' },
    { id: 2, name: 'Art Museum', type: 'Museum', distance: '4.1 km', rating: 4.6, transport: 'Metro 20 min' },
    { id: 3, name: 'Waterfront District', type: 'Entertainment', distance: '5.7 km', rating: 4.9, transport: 'Train 25 min' },
    { id: 4, name: 'Botanical Gardens', type: 'Nature', distance: '8.2 km', rating: 4.7, transport: 'Bus 35 min' },
    { id: 5, name: 'Historic Quarter', type: 'Culture', distance: '3.5 km', rating: 4.8, transport: 'Walk 40 min' }
  ];

  const flightDeals = [
    { id: 1, from: 'NYC', to: 'Paris', price: '$649', duration: '7h 30m', date: 'Mar 15' },
    { id: 2, from: 'NYC', to: 'Tokyo', price: '$1,249', duration: '13h 45m', date: 'Mar 20' },
    { id: 3, from: 'NYC', to: 'London', price: '$599', duration: '6h 15m', date: 'Mar 18' }
  ];

  const hotelDeals = [
    { id: 1, name: 'Grand Plaza Hotel', location: 'Downtown', price: '$129/night', rating: 4.5, amenities: 'WiFi, Pool, Gym' },
    { id: 2, name: 'Boutique Inn', location: 'Historic District', price: '$89/night', rating: 4.7, amenities: 'WiFi, Breakfast' },
    { id: 3, name: 'City View Suites', location: 'Business District', price: '$159/night', rating: 4.6, amenities: 'WiFi, Gym, Spa' }
  ];

  const routes = [
    { id: 1, from: 'Home', to: 'Central Park', duration: '15 min', method: 'Bus', cost: '$2.50', steps: ['Walk 5 min to stop', 'Bus #15', 'Walk 2 min'] },
    { id: 2, from: 'Home', to: 'Art Museum', duration: '20 min', method: 'Metro', cost: '$3.00', steps: ['Walk 3 min to station', 'Metro Line A', 'Walk 5 min'] },
    { id: 3, from: 'Home', to: 'Waterfront', duration: '25 min', method: 'Train + Walk', cost: '$4.50', steps: ['Train to Central', 'Transfer to Line 2', 'Walk 8 min'] }
  ];

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/marketplace')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </PremiumButton>

          <div className="card border-accent-blue/20 mb-6">
            <h1 className="text-hero-headline font-bold text-text-primary mb-4">
              Polaris — Travel Companion
            </h1>
            <p className="text-subheadline text-text-secondary mb-4">
              A comprehensive travel companion that encourages exploration both near and far. Seamlessly book flights and hotels while discovering local adventures and finding the best public transportation routes.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Sample Preview — Not Fully Functional
            </div>
          </div>

          {/* Search Bar */}
          <div className="card mb-6 border-accent-blue/20">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search destinations, places, or routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                />
              </div>
              <PremiumButton variant="primary">
                Search
              </PremiumButton>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Explore Local
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Plane className="w-4 h-4" />
              Book Travel
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'routes'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Public Transit
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'explore' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">Discover Local Places</h2>
              <p className="text-text-secondary mb-6">Explore nearby attractions and find the best ways to get there using public transportation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localPlaces.map((place) => (
                <div key={place.id} className="card hover:border-accent-blue/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{place.name}</h3>
                      <p className="text-sm text-text-secondary">{place.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <span className="text-sm font-medium">{place.rating}</span>
                      <span className="text-xs">★</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="w-4 h-4" />
                      {place.distance} away
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent-blue">
                      {place.transport.includes('Bus') && <Bus className="w-4 h-4" />}
                      {place.transport.includes('Metro') && <Train className="w-4 h-4" />}
                      {place.transport.includes('Walk') && <Navigation className="w-4 h-4" />}
                      {place.transport.includes('Train') && <Train className="w-4 h-4" />}
                      {place.transport}
                    </div>
                  </div>

                  <PremiumButton variant="secondary" size="sm" fullWidth>
                    View Route
                  </PremiumButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Flights */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Plane className="w-6 h-6 text-accent-blue" />
                  <h2 className="text-xl font-bold text-text-primary">Flight Deals</h2>
                </div>
                
                <div className="space-y-4">
                  {flightDeals.map((flight) => (
                    <div key={flight.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-accent-blue/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-lg font-semibold text-text-primary">
                            {flight.from} → {flight.to}
                          </div>
                          <div className="text-sm text-text-secondary">{flight.duration}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-accent-blue">{flight.price}</div>
                          <div className="text-xs text-text-secondary">{flight.date}</div>
                        </div>
                      </div>
                      <PremiumButton variant="secondary" size="sm" fullWidth>
                        Book Flight
                      </PremiumButton>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Hotel className="w-6 h-6 text-accent-purple" />
                  <h2 className="text-xl font-bold text-text-primary">Hotel Deals</h2>
                </div>
                
                <div className="space-y-4">
                  {hotelDeals.map((hotel) => (
                    <div key={hotel.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-accent-purple/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-text-primary mb-1">{hotel.name}</div>
                          <div className="text-sm text-text-secondary mb-2">{hotel.location}</div>
                          <div className="text-xs text-text-secondary">{hotel.amenities}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-accent-purple mb-1">{hotel.price}</div>
                          <div className="flex items-center gap-1 text-yellow-400 text-xs">
                            <span>{hotel.rating}</span>
                            <span>★</span>
                          </div>
                        </div>
                      </div>
                      <PremiumButton variant="secondary" size="sm" fullWidth>
                        Book Hotel
                      </PremiumButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Combined Booking */}
            <div className="card bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-accent-blue/20">
              <h3 className="text-lg font-semibold text-text-primary mb-4">✨ Book Flight + Hotel Together</h3>
              <p className="text-text-secondary mb-4">Save up to 25% when you book your flight and hotel together.</p>
              <PremiumButton variant="primary">
                <Plane className="w-4 h-4 mr-2" />
                <Hotel className="w-4 h-4 mr-2" />
                Book Package Deal
              </PremiumButton>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">Public Transportation Routes</h2>
              <p className="text-text-secondary mb-6">Find the best routes using buses, trains, and metro to get anywhere in the city.</p>
            </div>

            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route.id} className="card hover:border-accent-blue/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-text-primary">
                            {route.from} → {route.to}
                          </div>
                          <div className="text-sm text-text-secondary">{route.method}</div>
                        </div>
                      </div>
                      
                      <div className="ml-13 space-y-2">
                        {route.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm text-text-secondary">
                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-lg font-bold text-accent-blue mb-1">{route.duration}</div>
                      <div className="text-sm text-text-secondary">{route.cost}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <PremiumButton variant="secondary" size="sm" className="flex-1">
                      View on Map
                    </PremiumButton>
                    <PremiumButton variant="primary" size="sm" className="flex-1">
                      Start Navigation
                    </PremiumButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolarisSamplePage;
