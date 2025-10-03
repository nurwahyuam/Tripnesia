// BoatRentalPage.js
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';

const Index = () => {
  const [tripType, setTripType] = useState('Open Trip');
  const [filters, setFilters] = useState({
    tripDuration: [],
    classTrip: [],
    budget: [],
    shipBrand: []
  });

  const boatTrips = [
    {
      id: 1,
      type: 'Open Trip',
      title: '3 Days 2 Night Open Trip With Andatama',
      price: 'IDR 4.150.000/person',
      originalPrice: 'IDR 2.250.000/person',
      operator: 'Andatama',
      duration: '3 Day',
      class: 'Superior',
      budget: 'IDR 2,000,000 - IDR 5,000,000',
      brand: 'Andatama'
    },
    {
      id: 2,
      type: 'Open Trip',
      title: '5 Days 4 Night Open Trip With Andatama',
      price: 'IDR 7.150.000/person',
      originalPrice: 'IDR 1.500.000/person',
      operator: 'Andatama',
      duration: 'More Than 5 Days',
      class: 'Deluxe',
      budget: 'IDR 5,000,000 - IDR 7,000,000',
      brand: 'Andatama'
    },
    {
      id: 3,
      type: 'Open Trip',
      title: '2 Days 1 Night Open Trip With Sarba Samudra Marine',
      price: 'IDR 1.500.000/person',
      originalPrice: 'IDR 2.250.000/person',
      operator: 'Solara Samudra Marine',
      duration: '2 Day',
      class: 'Standard',
      budget: 'Less than IDR 2,000,000',
      brand: 'Sarba Samuda Marine'
    },
    {
      id: 4,
      type: 'Open Trip',
      title: '3 Days 2 Night Open Trip With Andatama',
      price: 'IDR 6.950.000/person',
      originalPrice: 'IDR 8.950.000/person',
      operator: 'Palindo Marine',
      duration: '3 Day',
      class: 'Luxury',
      budget: 'More than IDR 10,000,000',
      brand: 'Palindo Marine'
    },
    {
      id: 5,
      type: 'Open Trip',
      title: '4 Days 3 Night Open Trip With Printed Nusantara',
      price: 'IDR 5.500.000/person',
      originalPrice: 'IDR 6.800.000/person',
      operator: 'Printed Nusantara',
      duration: '4 Day',
      class: 'Superior',
      budget: 'IDR 5,000,000 - IDR 7,000,000',
      brand: 'Printed Nusantara'
    },
    {
      id: 6,
      type: 'Open Trip',
      title: '3 Days 2 Night Open Trip With Oeds',
      price: 'IDR 3.800.000/person',
      originalPrice: 'IDR 4.500.000/person',
      operator: 'Oeds',
      duration: '3 Day',
      class: 'Standard',
      budget: 'IDR 2,000,000 - IDR 5,000,000',
      brand: 'Oeds'
    }
  ];

  const filterOptions = {
    tripDuration: ['Full Days', '2 Day', '3 Day', '4 Day', 'More Than 5 Days'],
    classTrip: ['Standard', 'Superior', 'Deluxe', 'Luxury'],
    budget: [
      'Less than IDR 2,000,000',
      'IDR 2,000,000 - IDR 5,000,000',
      'IDR 5,000,000 - IDR 7,000,000',
      'More than IDR 10,000,000'
    ],
    shipBrand: [
      'Sarba Samuda Marine',
      'Andatama',
      'Oeds',
      'Palindo Marine',
      'Printed Nusantara'
    ]
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const filteredTrips = boatTrips.filter(trip => {
    return (
      (filters.tripDuration.length === 0 || filters.tripDuration.includes(trip.duration)) &&
      (filters.classTrip.length === 0 || filters.classTrip.includes(trip.class)) &&
      (filters.budget.length === 0 || filters.budget.includes(trip.budget)) &&
      (filters.shipBrand.length === 0 || filters.shipBrand.includes(trip.brand))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Filter by</h3>
              
              {/* Trip Duration Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Trip</h4>
                <div className="space-y-3">
                  {filterOptions.tripDuration.map((duration) => (
                    <label key={duration} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.tripDuration.includes(duration)}
                        onChange={() => handleFilterChange('tripDuration', duration)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">{duration}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Class Trip Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Class Trip</h4>
                <div className="space-y-3">
                  {filterOptions.classTrip.map((classType) => (
                    <label key={classType} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.classTrip.includes(classType)}
                        onChange={() => handleFilterChange('classTrip', classType)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">{classType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Budget Trip</h4>
                <div className="space-y-3">
                  {filterOptions.budget.map((budget) => (
                    <label key={budget} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.budget.includes(budget)}
                        onChange={() => handleFilterChange('budget', budget)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">{budget}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ship Brand Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Ship Brand</h4>
                <div className="space-y-3">
                  {filterOptions.shipBrand.map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.shipBrand.includes(brand)}
                        onChange={() => handleFilterChange('shipBrand', brand)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  tripDuration: [],
                  classTrip: [],
                  budget: [],
                  shipBrand: []
                })}
                className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Trip Listings */}
          <div className="lg:col-span-3">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Book a Boat Rental in Raja Ampat
              </h1>
              
              {/* Trip Type Selector */}
              <div className="flex space-x-4 mb-6">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    tripType === 'Open Trip' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setTripType('Open Trip')}
                >
                  Open Trip
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    tripType === 'Private Trip' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setTripType('Private Trip')}
                >
                  Private Trip
                </button>
              </div>

              {/* Date Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select trip start date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select trip end date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredTrips.length} results found
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Recommended</option>
                <option>Sort by: Price Low to High</option>
                <option>Sort by: Price High to Low</option>
                <option>Sort by: Duration</option>
              </select>
            </div>

            {/* Trip Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  {/* Trip Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                      </svg>
                      <p className="text-sm font-medium">{trip.brand}</p>
                    </div>
                  </div>

                  {/* Trip Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                        {trip.type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                        {trip.duration}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {trip.title}
                    </h3>

                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-blue-600">{trip.price}</span>
                      <span className="text-sm text-gray-500 line-through">{trip.originalPrice}</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{trip.operator}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        {trip.class}
                      </span>
                    </div>

                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredTrips.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to find more options.</p>
                <button
                  onClick={() => setFilters({
                    tripDuration: [],
                    classTrip: [],
                    budget: [],
                    shipBrand: []
                  })}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">TripNesia</h3>
              <div className="space-y-2 text-gray-300">
                <p className="font-medium">Head Office</p>
                <p>9 Fiestan Digital</p>
                <p>On Maripati No. 55,</p>
                <p>Bajayaripanda Bank, DI</p>
                <p>Yogyakarta, Indonesia</p>
                <p>Bangalore</p>
                <p>City Outdoerland GmbH</p>
                <p>4051 Bangalore, Santamana</p>
                <p>info@trignesia.com</p>
                <p className="font-medium mt-3">Contact Center</p>
                <p>+62 853 3833 7756</p>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/europe" className="hover:text-white transition-colors">Europe With TripNesia</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/support" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Term & Conditions</a></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Social Media</h4>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </button>
                <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </button>
              </div>
              <p className="text-gray-300 mt-4">TripNesia</p>
              <p className="text-gray-300">TripNesia</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TripNesia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;