import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, MapPin, AlertTriangle, Heart, Leaf, Users, Shield, Navigation, CheckCircle2 } from 'lucide-react';

const KapwaResponsePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'disaster' | 'eco-villages' | 'community'>('disaster');

  // Sample disaster data
  const activeDisasters = [
    {
      id: 1,
      type: 'Typhoon',
      location: 'Luzon Region',
      severity: 'High',
      status: 'Active',
      affectedAreas: 15,
      responseTeams: 8,
      lastUpdate: '2 hours ago'
    },
    {
      id: 2,
      type: 'Flooding',
      location: 'Metro Manila',
      severity: 'Medium',
      status: 'Monitoring',
      affectedAreas: 5,
      responseTeams: 3,
      lastUpdate: '5 hours ago'
    },
    {
      id: 3,
      type: 'Earthquake',
      location: 'Visayas Region',
      severity: 'Low',
      status: 'Resolved',
      affectedAreas: 2,
      responseTeams: 2,
      lastUpdate: '1 day ago'
    }
  ];

  // Sample eco villages
  const ecoVillages = [
    {
      id: 1,
      name: 'Sagada Eco Village',
      location: 'Mountain Province',
      status: 'Active',
      residents: 120,
      sustainability: 95,
      features: ['Solar Power', 'Water Harvesting', 'Organic Farming', 'Waste Management'],
      needs: ['Educational Materials', 'Medical Supplies'],
      progress: 85
    },
    {
      id: 2,
      name: 'Palawan Green Community',
      location: 'Palawan',
      status: 'Active',
      residents: 200,
      sustainability: 88,
      features: ['Renewable Energy', 'Composting', 'Bamboo Construction', 'Marine Conservation'],
      needs: ['Technical Training', 'Seed Funding'],
      progress: 72
    },
    {
      id: 3,
      name: 'Batanes Sustainable Village',
      location: 'Batanes',
      status: 'In Development',
      residents: 80,
      sustainability: 65,
      features: ['Wind Energy', 'Traditional Building', 'Local Food Systems'],
      needs: ['Infrastructure Support', 'Community Training'],
      progress: 45
    }
  ];

  // Community resources
  const communityResources = [
    {
      id: 1,
      type: 'Medical Supplies',
      location: 'Quezon City',
      quantity: '50 boxes',
      status: 'Available',
      contact: 'kapwa-medical@example.com'
    },
    {
      id: 2,
      type: 'Food Relief',
      location: 'Cebu',
      quantity: '200 meals',
      status: 'Available',
      contact: 'kapwa-food@example.com'
    },
    {
      id: 3,
      type: 'Emergency Shelter',
      location: 'Davao',
      quantity: '30 units',
      status: 'Available',
      contact: 'kapwa-shelter@example.com'
    }
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  Kapwa Response
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Socially-responsible disaster response and mapping platform for the Philippines, with integrated support for sustainable eco villages and community resilience.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30">
              <Heart className="w-4 h-4 mr-2" />
              Social Impact Product - Free to Use
            </div>
          </div>

          {/* Mission Statement */}
          <div className="card bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3">Our Mission</h3>
            <p className="text-text-secondary mb-4">
              Kapwa Response empowers Filipino communities through real-time disaster mapping, emergency coordination, and sustainable development support. We believe in <strong className="text-text-primary">kapwa</strong> (shared identity) - that we are all connected and responsible for each other's well-being.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-text-secondary">Disaster Preparedness</span>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-green-400" />
                <span className="text-sm text-text-secondary">Sustainable Communities</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-sm text-text-secondary">Community Resilience</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('disaster')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'disaster'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Disaster Response
            </button>
            <button
              onClick={() => setActiveTab('eco-villages')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'eco-villages'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Leaf className="w-4 h-4" />
              Eco Villages
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'community'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              Community Resources
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'disaster' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">Active Disaster Response</h2>
              <p className="text-text-secondary mb-6">Real-time disaster mapping and emergency coordination for the Philippines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {activeDisasters.map((disaster) => (
                <div key={disaster.id} className="card hover:border-accent-blue/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{disaster.type}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                        <MapPin className="w-4 h-4" />
                        {disaster.location}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      disaster.severity === 'High'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : disaster.severity === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {disaster.severity}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Status:</span>
                      <span className={`font-medium ${
                        disaster.status === 'Active' ? 'text-red-400' : 
                        disaster.status === 'Monitoring' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {disaster.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Affected Areas:</span>
                      <span className="text-text-primary font-medium">{disaster.affectedAreas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Response Teams:</span>
                      <span className="text-text-primary font-medium">{disaster.responseTeams}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Last Update:</span>
                      <span className="text-text-secondary">{disaster.lastUpdate}</span>
                    </div>
                  </div>

                  <PremiumButton variant="secondary" size="sm" fullWidth>
                    <Navigation className="w-4 h-4 mr-2" />
                    View on Map
                  </PremiumButton>
                </div>
              ))}
            </div>

            {/* Disaster Map Placeholder */}
            <div className="card bg-gray-900/50 border-gray-700">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Interactive Disaster Map</h3>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-accent-blue mx-auto mb-4" />
                  <p className="text-text-secondary">Interactive map showing disaster locations, affected areas, and response teams</p>
                  <p className="text-sm text-text-secondary mt-2">Real-time updates from government agencies and community reports</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eco-villages' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">Sustainable Eco Villages</h2>
              <p className="text-text-secondary mb-6">Supporting mini sustainable eco villages across the Philippines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecoVillages.map((village) => (
                <div key={village.id} className="card hover:border-green-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{village.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                        <MapPin className="w-4 h-4" />
                        {village.location}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      village.status === 'Active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {village.status}
                    </span>
                  </div>

                  {/* Sustainability Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">Sustainability Score</span>
                      <span className="text-sm font-bold text-green-400">{village.sustainability}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${village.sustainability}%` }}
                      />
                    </div>
                  </div>

                  {/* Village Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Users className="w-4 h-4" />
                      <span>{village.residents} residents</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Leaf className="w-4 h-4 text-green-400" />
                      <span>Progress: {village.progress}%</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-text-primary mb-2">Features</div>
                    <div className="flex flex-wrap gap-2">
                      {village.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          {feature}
                        </span>
                      ))}
                      {village.features.length > 3 && (
                        <span className="px-2 py-1 rounded text-xs bg-gray-800 text-text-secondary border border-gray-700">
                          +{village.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Needs */}
                  {village.needs.length > 0 && (
                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-sm font-semibold text-text-primary mb-2">Support Needed</div>
                      <ul className="space-y-1">
                        {village.needs.map((need, index) => (
                          <li key={index} className="text-xs text-text-secondary flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-400" />
                            {need}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <PremiumButton variant="secondary" size="sm" fullWidth className="mt-4">
                    <Heart className="w-4 h-4 mr-2" />
                    Support Village
                  </PremiumButton>
                </div>
              ))}
            </div>

            {/* Eco Village Map */}
            <div className="card mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Eco Village Network Map</h3>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <Leaf className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-text-secondary">Interactive map showing all eco villages across the Philippines</p>
                  <p className="text-sm text-text-secondary mt-2">Track sustainability progress and connect communities</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-4">Community Resources</h2>
              <p className="text-text-secondary mb-6">Share and access community resources for disaster response and sustainable development</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {communityResources.map((resource) => (
                <div key={resource.id} className="card hover:border-accent-blue/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{resource.type}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        {resource.location}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      {resource.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Quantity:</span>
                      <span className="text-text-primary font-medium">{resource.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Contact:</span>
                      <span className="text-accent-blue text-xs">{resource.contact}</span>
                    </div>
                  </div>

                  <PremiumButton variant="secondary" size="sm" fullWidth>
                    Request Resource
                  </PremiumButton>
                </div>
              ))}
            </div>

            {/* How to Help */}
            <div className="card bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-accent-blue/20">
              <h3 className="text-xl font-bold text-text-primary mb-4">How You Can Help</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">For Disaster Response</h4>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Report disasters and emergencies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Volunteer for response teams
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Share resources and supplies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Provide real-time updates
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">For Eco Villages</h4>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Donate to village projects
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Share expertise and training
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Connect villages with resources
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Support sustainable initiatives
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KapwaResponsePage;
