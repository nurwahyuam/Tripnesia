import React, { useEffect, useState } from "react";
import GuestLayout from "../../layouts/GuestLayout";
import BgHeader from "../../assets/Bg-Header.png";
import DateRangePicker from "../../components/DateRangePicker";
import GuestSelector from "../../components/GuestSelector";
import TripSlider from "../../components/TripSlider";
import DiscoverRajaAmpatSection from "../../components/DiscoverRajaAmpatSection";
import WhyChooseTripNesia from "../../components/WhyChooseTripNesia";

const Welcome = () => {
  const [tripType, setTripType] = useState("Open Trip");
  const [passengerCount, setPassengerCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2025-09-19"),
    endDate: new Date("2025-10-03"),
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDateChange = (range) => {
    setDateRange(range);
    setShowCalendar(false);
  };

  const trips = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With Akassa Cruise",
      price: "IDR 9.000.000/person",
      operator: "Akassa Cruise",
      isTour: false,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1589308078499-cd0b155245f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With Carnaby",
      price: "IDR 8.000.000/person",
      operator: "Carnaby",
      isTour: false,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With 3 Islands",
      price: "IDR 3.500.000/person",
      operator: "3 Islands",
      isTour: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With Cordelia",
      price: "IDR 4.950.000/person",
      operator: "Cordelia",
      isTour: false,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1503950880713-7798e1254483?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With Andalucia",
      price: "IDR 4.150.000/person",
      operator: "Andalucia",
      isTour: true,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1503950880713-7798e1254483?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With Andalucia",
      price: "IDR 4.150.000/person",
      operator: "Andalucia",
      isTour: true,
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1503950880713-7798e1254483?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open trip",
      title: "3 Days 2 Nights Open Trip With Andalucia",
      price: "IDR 4.150.000/person",
      operator: "Andalucia",
      isTour: true,
    },
  ];

  useEffect(() => {
    const shouldReload = sessionStorage.getItem("reloadOnce");
    if (shouldReload) {
      sessionStorage.removeItem("reloadOnce");
      window.location.reload();
    }
  }, []);

  return (
    <GuestLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-cover bg-bottom bg-no-repeat py-32 md:py-36" style={{ backgroundImage: `url(${BgHeader})` }}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-left text-white">
              <h1 className="text-4xl md:text-5xl mb-6">
                Relax Your Way Through <br /> Raja Ampat
              </h1>
              <p className="text-xl md:text-2xl font-extralight mb-16 opacity-90">Feel the comfort of exploring the stunning financial paradise.</p>

              <div className="relative">
                {/* Trip Type Selector */}
                <div className="absolute -top-8 left-5 flex justify-center gap-2 mb-8 p-2 bg-white rounded-full shadow-md">
                  <button
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${tripType === "Open Trip" ? "bg-[#01A2A61F] text-primary" : "bg-white bg-opacity-20 text-gray-500 hover:bg-opacity-30"}`}
                    onClick={() => setTripType("Open Trip")}
                  >
                    Open Trip
                  </button>
                  <button
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${tripType === "Private Trip" ? "bg-[#01A2A61F] text-primary" : "bg-white bg-opacity-20 text-gray-500 hover:bg-opacity-30"}`}
                    onClick={() => setTripType("Private Trip")}
                  >
                    Private Trip
                  </button>
                </div>

                {/* Search Form */}
                <div className="bg-white bg-opacity-90 rounded-2xl md:px-5 md:pt-14 md:pb-5 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-end">
                    {/* Date Input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={`${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`}
                        className="w-full text-sm px-4 py-3 border border-gray-300 rounded-xl text-gray-700 cursor-pointer"
                        readOnly
                        onClick={() => setShowCalendar(!showCalendar)}
                      />
                      {showCalendar && <DateRangePicker initialStartDate={dateRange.startDate} initialEndDate={dateRange.endDate} onChange={handleDateChange} />}
                    </div>

                    {/* Guest Selector */}
                    <GuestSelector value={passengerCount} onChange={setPassengerCount} />

                    {/* Search Button */}
                    <button className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-colors font-medium w-full md:w-auto">Search</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Our Trip Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-3">
              <h1 className="text-2xl font-semibold">Explore Our Trip</h1>
            </div>
            <TripSlider trips={trips} />
          </div>
        </section>

        {/* Promo Section */}
        <section className="mb-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl">
              {/* Background Image */}
              <div
                className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
                }}
                role="img"
                aria-label="Promo boat trip in Raja Ampat"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Konten Promo — diposisikan di kiri atas dengan margin aman */}
                <div className="absolute top-1/2 left-6 sm:left-12 transform -translate-y-1/2 w-full max-w-md px-2 sm:px-0">
                  <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Launching Promo: Get 20% Off!</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Celebrate your holiday with an unforgettable adventure! Enjoy up to 20% off on a variety of boat rentals to Raja Ampat's favorite destinations.</p>
                    <button className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-sm">Get Deals</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Raja Ampat */}
        <DiscoverRajaAmpatSection />

        {/* Explore Our Trip Section */}
        <WhyChooseTripNesia />
      </div>
    </GuestLayout>
  );
};

export default Welcome;
