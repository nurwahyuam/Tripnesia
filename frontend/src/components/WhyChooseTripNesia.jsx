import React from "react";
import { ShieldCheck, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const WhyChooseTripNesia = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="relative mb-12">
          {/* Garis horizontal penuh sepanjang container */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>

          {/* Judul di tengah, menutupi garis */}
          <div className="relative z-10 text-center">
            <h2 className="inline-block bg-white px-6 text-2xl font-bold text-gray-800">Why Choose TripNesia</h2>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* Card 1: Expert Local Guides */}
          <div className="p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="mb-4 text-teal-500">
              <Briefcase className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Local Guides</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our passionate local guides don't just show you places, they share stories, culture, and hidden gems that transform your journey into an authentic adventure.</p>
            <div className="flex items-center text-green-500 text-xs font-medium">
              <span>Average guide rating: 4.9/5</span>
            </div>
          </div>

          {/* Card 2: Easy & Flexible Reschedule — CENTER & LARGER */}
          <div className="p-8 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md md:max-w-lg mx-auto">
            <h3 className="text-4xl font-semibold text-gray-800 mb-10 text-center">Easy & Flexible Reschedule</h3>
            <div className="mb-10 flex justify-center">
              <ShieldCheck className="h-32 w-32 text-teal-500" />
            </div>
            <p className="text-gray-600 text-xs leading-relaxed text-center">Reschedule your trip up to 30 days before departure—at no extra cost.</p>
          </div>

          {/* Card 3: Solo-Friendly Groups */}
          <div className="p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="mb-4 text-teal-500">
              <Users className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Solo-Friendly Groups</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">85% of our travelers are solo adventurers who become lifelong friends. Join small groups (6–16 people) of like-minded explorers from around the world.</p>
            <p className="text-gray-500 text-xs">Join 50.000+ solo travelers 🌍</p>
          </div>
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <a href={"/"} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition flex items-center gap-2 justify-center w-1/4">
            Find out more reasons to choose us  
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTripNesia;
