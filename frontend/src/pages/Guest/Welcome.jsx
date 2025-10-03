// App.js
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

const Welcome = () => {
  const [tripType, setTripType] = useState("Open Trip");
  const [passengerCount, setPassengerCount] = useState(1);

  const trips = [
    {
      id: 1,
      type: "Open Trip",
      title: "3 Days 2 Night Open Trip With Andalama",
      price: "IDR 4.150.000/person",
      operator: "Andalama",
    },
    {
      id: 2,
      type: "Open Trip",
      title: "3 Days 2 Night Open Trip With Andalama",
      price: "IDR 4.150.000/person",
      operator: "Andalama",
    },
    {
      id: 3,
      type: "Open Trip",
      title: "3 Days 2 Night Open Trip With Andalama",
      price: "IDR 4.150.000/person",
      operator: "Andalama",
    },
    {
      id: 4,
      type: "Open Trip",
      title: "3 Days 2 Night Open Trip With Andalama",
      price: "IDR 4.150.000/person",
      operator: "Andalama",
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Easy & Flexible Booking",
      description: "Simple booking process with flexible cancellation options",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Expert Local Guides",
      description: "Knowledgeable local guides for authentic experiences",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: "Solo-Friendly Groups",
      description: "Perfect for solo travelers with friendly group dynamics",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="bg-cover bg-center bg-no-repeat py-20 md:py-28"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Relax Your Way Through Raja Ampat</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Feel the comfort of exploring the stunning financial paradise.</p>

            {/* Trip Type Selector */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${tripType === "Open Trip" ? "bg-blue-600 text-white" : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"}`}
                onClick={() => setTripType("Open Trip")}
              >
                Open Trip
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${tripType === "Private Trip" ? "bg-blue-600 text-white" : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"}`}
                onClick={() => setTripType("Private Trip")}
              >
                Private Trip
              </button>
            </div>

            {/* Search Form */}
            <div className="bg-white bg-opacity-90 rounded-xl p-6 md:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-end">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-medium mb-2 text-left">Date</label>
                  <input
                    type="text"
                    value="19 September 2025 - 03 October 2025"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    readOnly
                  />
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-gray-700 text-sm font-medium mb-2 text-left">Passengers</label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                    <button className="text-blue-600 hover:text-blue-700 text-xl font-bold w-8 h-8 flex items-center justify-center" onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}>
                      -
                    </button>
                    <span className="mx-4 text-gray-700 font-medium min-w-8 text-center">{passengerCount}</span>
                    <button className="text-blue-600 hover:text-blue-700 text-xl font-bold w-8 h-8 flex items-center justify-center" onClick={() => setPassengerCount(passengerCount + 1)}>
                      +
                    </button>
                  </div>
                </div>

                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full md:w-auto">Search</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Launching France, Get 2017, Off!</h2>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">Discover More about Raja Ampat</button>
          </div>
        </div>
      </section>

      {/* Why Choose TripNesia Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">Why Choose TripNesia!</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Experience the best of Raja Ampat with our trusted services and expert guidance</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Our Trip Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Explore Our Trip</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="text-blue-600 text-sm font-medium mb-3">{trip.type}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">{trip.title}</h3>
                <div className="text-xl font-bold text-blue-600 mb-2">{trip.price}</div>
                <div className="text-gray-500 text-sm mb-4">{trip.operator}</div>
                <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium">Share More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-white mb-4">TripNesia</div>
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
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">&copy; 2024 TripNesia. All rights reserved.</p>
              <p className="text-gray-400">Experience the beauty of Indonesia with us</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
