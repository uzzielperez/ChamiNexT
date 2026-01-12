import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, Calendar, MapPin, Users, CreditCard, Clock, Star, Filter, Search, CheckCircle2 } from 'lucide-react';

const EventHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'discover' | 'my-events' | 'create'>('discover');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const locations = ['All', 'Madrid', 'Barcelona', 'Paris', 'Dubai', 'Istanbul', 'London', 'Berlin', 'Rome'];

  const events = [
    {
      id: 1,
      title: 'Sunday Football Match',
      type: 'Sports',
      location: 'Madrid',
      venue: 'Campo de Fútbol Central',
      date: '2024-03-17',
      time: '10:00 AM',
      price: 15,
      spots: { available: 8, total: 22 },
      organizer: 'Madrid Football Club',
      rating: 4.8,
      attendees: 14,
      description: 'Weekly Sunday football match. All skill levels welcome!'
    },
    {
      id: 2,
      title: 'Board Game Night',
      type: 'Gaming',
      location: 'Barcelona',
      venue: 'Game Café Barcelona',
      date: '2024-03-15',
      time: '7:00 PM',
      price: 12,
      spots: { available: 5, total: 20 },
      organizer: 'Barcelona Board Gamers',
      rating: 4.9,
      attendees: 15,
      description: 'Join us for an evening of board games, snacks, and great company!'
    },
    {
      id: 3,
      title: 'Beach Volleyball Tournament',
      type: 'Sports',
      location: 'Dubai',
      venue: 'JBR Beach',
      date: '2024-03-20',
      time: '4:00 PM',
      price: 25,
      spots: { available: 12, total: 32 },
      organizer: 'Dubai Sports Community',
      rating: 4.7,
      attendees: 20,
      description: 'Competitive beach volleyball tournament. Teams of 4.'
    },
    {
      id: 4,
      title: 'Chess Championship',
      type: 'Gaming',
      location: 'Paris',
      venue: 'Café de la Paix',
      date: '2024-03-18',
      time: '2:00 PM',
      price: 20,
      spots: { available: 3, total: 16 },
      organizer: 'Paris Chess Club',
      rating: 4.9,
      attendees: 13,
      description: 'Monthly chess championship. All levels welcome!'
    },
    {
      id: 5,
      title: 'Running Group',
      type: 'Fitness',
      location: 'Istanbul',
      venue: 'Bosphorus Park',
      date: '2024-03-16',
      time: '6:30 AM',
      price: 0,
      spots: { available: 18, total: 30 },
      organizer: 'Istanbul Runners',
      rating: 4.8,
      attendees: 12,
      description: 'Morning running group along the Bosphorus. Free event!'
    },
    {
      id: 6,
      title: 'Yoga in the Park',
      type: 'Wellness',
      location: 'Barcelona',
      venue: 'Park Güell',
      date: '2024-03-19',
      time: '9:00 AM',
      price: 10,
      spots: { available: 7, total: 25 },
      organizer: 'Barcelona Wellness',
      rating: 4.9,
      attendees: 18,
      description: 'Outdoor yoga session in beautiful Park Güell. Mats provided.'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });

  const paymentMethods = [
    { id: 'bizum', name: 'Bizum', icon: '💳', available: true },
    { id: 'credit', name: 'Credit Card', icon: '💳', available: true },
    { id: 'debit', name: 'Debit Card', icon: '💳', available: true }
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
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  EventHub
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Event management platform for organizing and joining local events. Reserve spots, pay securely, and connect with your community.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Sample Preview — Not Fully Functional
            </div>
          </div>

          {/* Search and Filter */}
          <div className="card mb-6 border-accent-blue/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      selectedLocation === location
                        ? 'bg-accent-blue text-white'
                        : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'discover'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Search className="w-4 h-4" />
              Discover Events
            </button>
            <button
              onClick={() => setActiveTab('my-events')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'my-events'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Events
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'discover' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-section-header font-bold text-text-primary">
                Available Events ({filteredEvents.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="card hover:border-accent-blue/50 transition-all cursor-pointer"
                  onClick={() => setSelectedEvent(event.id.toString())}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                        <MapPin className="w-4 h-4" />
                        {event.location} • {event.venue}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Users className="w-4 h-4" />
                      {event.spots.available} spots available • {event.attendees} attending
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-2xl font-bold text-accent-blue">
                        {event.price === 0 ? 'Free' : `€${event.price}`}
                      </div>
                      <div className="text-xs text-text-secondary">per person</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                      {event.type}
                    </span>
                  </div>

                  <PremiumButton variant="primary" size="sm" fullWidth>
                    Reserve Spot
                  </PremiumButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-events' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">My Events</h2>
              <p className="text-text-secondary">Events you've registered for or created</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 1,
                  title: 'Sunday Football Match',
                  location: 'Madrid',
                  date: '2024-03-17',
                  status: 'Registered',
                  payment: 'Paid'
                },
                {
                  id: 2,
                  title: 'Board Game Night',
                  location: 'Barcelona',
                  date: '2024-03-15',
                  status: 'Registered',
                  payment: 'Paid'
                }
              ].map((event) => (
                <div key={event.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{event.title}</h3>
                      <div className="text-sm text-text-secondary">{event.location} • {event.date}</div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      {event.status}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Payment:</span>
                      <span className="text-green-400 font-medium">{event.payment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">Create New Event</h2>
              <p className="text-text-secondary">Organize your own event and let the community join</p>
            </div>

            <div className="card max-w-2xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Sunday Football Match"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:border-accent-blue">
                      <option>Select location...</option>
                      {locations.filter(l => l !== 'All').map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Venue</label>
                    <input
                      type="text"
                      placeholder="Venue name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Price (€)</label>
                    <input
                      type="number"
                      placeholder="0 for free events"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Total Spots</label>
                    <input
                      type="number"
                      placeholder="Maximum attendees"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your event..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <PremiumButton variant="primary" fullWidth>
                  Create Event
                </PremiumButton>
              </form>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const event = events.find(e => e.id.toString() === selectedEvent);
                if (!event) return null;

                return (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-section-header font-bold text-text-primary mb-2">{event.title}</h2>
                        <div className="flex items-center gap-4 text-text-secondary">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="text-text-secondary hover:text-text-primary text-2xl"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Event Details</h3>
                        <div className="space-y-2 text-text-secondary">
                          <div><strong className="text-text-primary">Venue:</strong> {event.venue}</div>
                          <div><strong className="text-text-primary">Organizer:</strong> {event.organizer}</div>
                          <div><strong className="text-text-primary">Type:</strong> {event.type}</div>
                          <div><strong className="text-text-primary">Spots Available:</strong> {event.spots.available} / {event.spots.total}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Pricing</h3>
                        <div className="text-3xl font-bold text-accent-blue mb-4">
                          {event.price === 0 ? 'Free' : `€${event.price}`}
                        </div>
                        <div className="text-sm text-text-secondary mb-4">{event.description}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-text-primary font-medium">{event.rating}</span>
                          <span className="text-text-secondary">({event.attendees} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-3">Payment Methods</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center hover:border-accent-blue/50 transition-colors cursor-pointer"
                          >
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <div className="text-sm font-medium text-text-primary">{method.name}</div>
                            {method.available && (
                              <div className="text-xs text-green-400 mt-1">Available</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <PremiumButton variant="secondary" fullWidth onClick={() => setSelectedEvent(null)}>
                        Cancel
                      </PremiumButton>
                      <PremiumButton variant="primary" fullWidth>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Reserve & Pay
                      </PremiumButton>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventHubPage;
