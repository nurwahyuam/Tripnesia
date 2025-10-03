// AboutUs.js
import React from 'react';

const AboutUs = () => {
  const steps = [
    {
      number: "1",
      title: "Choose Your Trip",
      description: "Browse through our curated selection of Raja Ampat experiences and find the perfect trip that matches your preferences."
    },
    {
      number: "2",
      title: "Payment Your Trip",
      description: "Secure and easy payment process with multiple payment options available for your convenience."
    },
    {
      number: "3",
      title: "Enjoy Your Trip",
      description: "Relax and immerse yourself in the breathtaking beauty of Raja Ampat with our expert guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-2xl font-bold text-blue-600">TripNesia</div>
            
            <nav className="flex flex-wrap items-center gap-6 md:gap-8 justify-center">
              <a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Book & Boat
              </a>
              <a href="/about" className="text-blue-600 font-medium transition-colors">
                About Us
              </a>
              <a href="#support" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Support
              </a>
              <div className="text-gray-500 text-sm">IDR - Rp</div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium">
                  Sign Up
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Sign In
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              LET US PLAN YOUR A PERFECT<br />
              <span className="text-yellow-300">RAJA AMPAT TRIP</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-12">
              Experience the ultimate tropical paradise with our expert planning
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-b from-blue-50 to-white hover:shadow-xl transition-all duration-300 border border-blue-100"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Placeholder */}
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full h-96 md:h-[500px] bg-blue-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-semibold">Raja Ampat Beauty</p>
                    <p className="text-sm opacity-75">1442 x 1193</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Text */}
            <div className="order-1 lg:order-2">
              <div className="max-w-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  About <span className="text-blue-600">TripNesia</span>
                </h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                    <span className="font-semibold text-blue-600">TripNesia</span> offers a slow trend experience amidst tropical beauty, with a heart of modern boats equipped with air conditioning, private bathrooms, and comfortable cabins.
                  </p>
                  <p>
                    We make it easy for you to enjoy every moment of your journey. Your health and safety are our top priorities, ensuring that you can fully immerse yourself in the breathtaking beauty of Raja Ampat.
                  </p>
                  <p>
                    Our experienced local guides and well-maintained fleet provide the perfect combination of adventure and comfort, creating unforgettable memories in one of the world's most spectacular marine destinations.
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">50+</div>
                    <div className="text-gray-600 text-sm">Trips Completed</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">1000+</div>
                    <div className="text-gray-600 text-sm">Happy Travelers</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">5★</div>
                    <div className="text-gray-600 text-sm">Customer Rating</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">24/7</div>
                    <div className="text-gray-600 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
              Our Commitment to Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide unforgettable Raja Ampat experiences through sustainable tourism, exceptional service, and deep respect for local culture and environment.
                </p>
              </div>
              <div className="p-8 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading sustainable tourism provider in Indonesia, creating meaningful connections between travelers and the natural wonders of Raja Ampat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Raja Ampat?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have experienced the magic of Raja Ampat with TripNesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition-colors font-bold text-lg">
              Book Your Trip Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-bold text-lg">
              Contact Us
            </button>
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
              <p className="text-gray-400 mb-2">
                &copy; 2024 TripNesia. All rights reserved.
              </p>
              <p className="text-gray-400">
                Your trusted partner for Raja Ampat adventures
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;