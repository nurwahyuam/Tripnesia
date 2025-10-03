// SupportPage.js
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const Support = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Step Booking",
      description: "Start a new story",
      content: "Add a book to the group and add a book from the group. Complete the booking process by selecting your preferred dates and making payment.",
      buttonText: "Submit →"
    },
    {
      id: 2,
      title: "Payment Process",
      description: "Secure payment methods",
      content: "Choose from various payment options including credit card, bank transfer, or digital wallets. All transactions are encrypted and secure.",
      buttonText: "Submit →"
    },
    {
      id: 3,
      title: "Trip Preparation",
      description: "Get ready for your journey",
      content: "Receive your booking confirmation, travel documents, and preparation guide. Our team will assist with any special requirements.",
      buttonText: "Submit →"
    },
    {
      id: 4,
      title: "During Your Trip",
      description: "24/7 support available",
      content: "Access our support team anytime during your trip. We're here to ensure your experience is smooth and memorable.",
      buttonText: "Submit →"
    },
    {
      id: 5,
      title: "Post-Trip Support",
      description: "Share your experience",
      content: "Provide feedback about your trip and share your stories. We value your input to improve our services.",
      buttonText: "Submit →"
    },
    {
      id: 6,
      title: "Cancellation Policy",
      description: "Flexible cancellation options",
      content: "Understand our cancellation terms and conditions. We offer flexible options with transparent policies.",
      buttonText: "Submit →"
    },
    {
      id: 7,
      title: "Group Bookings",
      description: "Special group arrangements",
      content: "Planning for a group? We offer special rates and customized itineraries for group bookings.",
      buttonText: "Submit →"
    },
    {
      id: 8,
      title: "Special Requests",
      description: "Customize your experience",
      content: "Have special requirements? Let us know and we'll do our best to accommodate your needs.",
      buttonText: "Submit →"
    }
  ];

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Create",
      description: "Send us an email for general inquiries",
      action: "Email Support"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Make Pending Manual",
      description: "Check pending requests status",
      action: "Check Status"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Pending Data",
      description: "Review and update your information",
      action: "Update Data"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      title: "Apply URLs",
      description: "Access important links and resources",
      action: "View Links"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Subscribe",
      description: "Get updates and promotions",
      action: "Subscribe Now"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to the Help Center
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need for your Raja Ampat adventure.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Steps */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Booking Steps & Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-blue-600 font-medium mb-3">
                          {step.description}
                        </p>
                      </div>
                      <div className={`transform transition-transform ${activeStep === step.id ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {activeStep === step.id && (
                      <div className="mt-4 animate-fade-in">
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {step.content}
                        </p>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          {step.buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Contact & Info */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{method.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        {method.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Head Office */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Head Office</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our Services team is responsible for ensuring that all our customers receive the highest level of support. 
                We are committed to providing comprehensive assistance throughout your journey with us.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We continuously work to improve our services and ensure that our business operations are fully compliant 
                with industry standards. Our dedicated team is here to support you every step of the way.
              </p>
            </div>

            {/* TripNesia Info */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">TripNesia</h3>
              <p className="leading-relaxed mb-4">
                Start your own story with us. Follow our journey and explore more about our services on our website.
              </p>
              <a 
                href="https://www.tripnesia.com/about-trip-nesia-types.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Visit Our Website
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Quick Support */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Immediate Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-800 font-medium">Phone Support</span>
                  <span className="text-green-600 font-bold">+62 21 1234 5678</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-800 font-medium">Email Support</span>
                  <span className="text-blue-600 font-bold">support@tripnesia.com</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-purple-800 font-medium">Live Chat</span>
                  <span className="text-purple-600 font-bold">Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How far in advance should I book my trip?",
                answer: "We recommend booking at least 2-3 months in advance, especially for peak season."
              },
              {
                question: "What is your cancellation policy?",
                answer: "We offer flexible cancellation with full refund up to 30 days before the trip."
              },
              {
                question: "Do you provide travel insurance?",
                answer: "Yes, we offer comprehensive travel insurance options for all our packages."
              },
              {
                question: "What should I pack for Raja Ampat?",
                answer: "Light clothing, swimwear, sunscreen, and underwater camera are essential."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
              <p className="text-gray-400 mb-2">
                &copy; 2024 TripNesia. All rights reserved.
              </p>
              <p className="text-gray-400">
                24/7 Support Available
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;