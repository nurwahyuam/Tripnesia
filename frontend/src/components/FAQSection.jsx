import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "How far in advance should I book my trip?",
      answer: "We recommend booking at least 2-3 months in advance, especially for peak season.",
    },
    {
      question: "What is your cancellation policy?",
      answer: "We offer flexible cancellation with full refund up to 30 days before the trip.",
    },
    {
      question: "Do you provide travel insurance?",
      answer: "Yes, we offer comprehensive travel insurance options for all our packages.",
    },
    {
      question: "What should I pack for Raja Ampat?",
      answer: "Light clothing, swimwear, sunscreen, and underwater camera are essential.",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 border border-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
            <p className="text-gray-600 text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;