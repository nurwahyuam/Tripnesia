// AboutUs.js
import React from "react";
import GuestLayout from "../../layouts/GuestLayout";
import BgAboutUs from "../../assets/Bg-AboutUs.webp";
import BoatImage from "../../assets/Logo-AboutUs.svg";
import BoatImagePNG from "../../assets/Logo-AboutUs.png";
import OpenTripImage from "../../assets/Bg-OpenTrip.png";
import PrivateTripImage from "../../assets/Bg-PrivateTrip.png";
import { BookText, Compass, MessagesSquare, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <GuestLayout>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <img src={BgAboutUs} alt="Raja Ampat Trip" className="w-full h-auto object-cover max-h-[80vh] md:max-h-[140vh]" loading="lazy" />

        {/* Overlay semi-transparan untuk keterbacaan */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Konten teks & list */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-5 md:px-8 lg:px-12">
            <div className="text-left text-white max-w-lg">
              {/* Header */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 uppercase tracking-wide">LET US PLAN YOUR PERFECT</h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">RAJA AMPAT</h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-10">TRIP</h1>

              {/* List Vertikal dengan Garis */}
              <div className="flex items-start gap-6">
                {/* Nomor & Garis Vertikal */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-bold text-sm">1</div>
                  <div className="w-px h-24 bg-white opacity-50"></div>
                  <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-bold text-sm">2</div>
                  <div className="w-px h-24 bg-white opacity-50"></div>
                  <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-bold text-sm">3</div>
                </div>

                {/* Teks Step */}
                <div className="space-y-25.5 text-base sm:text-lg">
                  <p>Choose Your Trip</p>
                  <p>Payment Your Trip</p>
                  <p>Enjoy Your Trip</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Header About Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#29D9C2] to-[#29D9C2] rounded-3xl overflow-hidden shadow-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8 p-6 md:p-10">
              {/* Teks Bagian Kiri */}
              <div className="lg:w-1/2 text-white space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">About TripNesia</h2>
                <p className="text-sm md:text-base leading-relaxed opacity-90">
                  Tripnesia offers a slow travel experience amidst tropical beauty. With a fleet of modern boats equipped with air conditioning, private bathrooms, and comfortable lounges, we make it easy for you to enjoy every moment of
                  Raja Ampat’s natural beauty.
                </p>
              </div>

              {/* Gambar Kapal + Shape Kuning */}
              <div className="lg:w-1/2 relative flex justify-center">
                {/* Lingkaran Kuning (Wave Shape) */}
                <div className="absolute -top-90 -right-15 w-128 h-128 bg-[#FBC02C] rounded-full"></div>
                <div className="absolute -top-80 -right-15 w-48 h-48 bg-[#FBC02C] rounded-full blur-xl opacity-50"></div>

                {/* Gambar Kapal */}
                <img
                  src={BoatImage} // ganti dengan path gambar kamu
                  alt="Tripnesia Boat"
                  className="w-full max-w-md h-65 object-contain z-10 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-xl mb-4">Our Mission</h1>
          <h1 className="text-3xl font-semibold mb-16">
            To Provide Unforgettable <br />
            Journeys Every Time
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Gambar Kapal di Kiri */}
            <div className="order-1 lg:order-1">
              <div className="rounded-2xl overflow-hidden">
                <img src={BoatImagePNG} alt="Luxury Boat in Raja Ampat" className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Konten Teks di Kanan */}
            <div className="order-2 lg:order-2">
              {/* Box 01 - Memorable Journey */}
              <div className="bg-white p-6 rounded-xl border border-gray-400 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">01. Memorable Journey</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  At <span className="text-primary">Tripnesia</span>, we design each cruise in detail so you can truly let go and relax. Our fleet is equipped with air-conditioned cabins, en suite bathrooms, and comfortable lounges,
                  complete with local guides who are ready to accompany you on snorkeling trips in crystal clear waters or trekking to nearby islands.
                </p>
              </div>

              {/* Box 02 - Guest Satisfaction */}
              <div className="bg-white p-6 rounded-xl border border-gray-400 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">02. Guest Satisfaction</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We provide an experience designed specifically for your comfort. From the booking process to the end of your trip, every detail is carefully considered just for you.</p>
              </div>

              {/* Box 03 - Security Priority */}
              <div className="bg-white p-6 rounded-xl border border-gray-400">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">03. Security Priority</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your safety is <span className="text-primary">Tripnesia</span> top priority. Our fleet undergoes routine maintenance in accordance with standards to ensure the comfort and safety of every voyage. Each ship is equipped with
                  safety equipment—from life jackets and lifeboats to navigation and communication systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl text-gray-400 text-center mb-12">Why Choose Us</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: 24/7 Assistance */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <MessagesSquare className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">24/7 assistance</h3>
                <p className="text-gray-600 text-sm">Contact our team anytime via WhatsApp or Phone</p>
              </div>

              {/* Card 2: Professional Guides */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Professional Guides</h3>
                <p className="text-gray-600 text-sm">Explore Every Corner with Reliable Local Guides</p>
              </div>

              {/* Card 3: Easy & Flexible Rescheduling */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Easy & Flexible Rescheduling</h3>
                <p className="text-gray-600 text-sm">Reschedule your trip up to 30 days before departure—at no extra cost.</p>
              </div>

              {/* Card 4: No Additional Fees */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <BookText className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">No Additional Fees</h3>
                <p className="text-gray-600 text-sm">We are completely transparent about what is included in your trip.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl text-gray-400 text-center mb-12">Trip Plan</h2>
          <div className="flex flex-col lg:flex-row items-start gap-12 max-w-6xl mx-auto">
            {/* Teks Kiri */}
            <div className="lg:w-1/3">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Explore More Trip<br/> Styles and Passions</h2>
              <p className="text-gray-600 text-lg mb-8">Contact us to begin planning your next adventure.</p>
            </div>

            {/* Card Trip Plan */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Open Trip Card */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group">
                <img
                  src={OpenTripImage} // ganti dengan path gambar kamu
                  alt="Open Trip Boat"
                  className="w-full h-72 md:h-100 object-cover transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Open Trip</h3>
                  <Link to="/product?type=open" className="inline-block bg-white text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
                    Discover
                  </Link>
                </div>
              </div>

              {/* Private Trip Card */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group">
                <img
                  src={PrivateTripImage} // ganti dengan path gambar kamu
                  alt="Private Trip Boat"
                  className="w-full h-72 md:h-100 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Private Trip</h3>
                  <Link to="/product?type=private" className="inline-block bg-white text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
                    Discover
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
};

export default AboutUs;
