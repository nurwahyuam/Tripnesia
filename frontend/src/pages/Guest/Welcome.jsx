import React, { useEffect, useState } from "react";
import GuestLayout from "../../layouts/GuestLayout";
import BgHeader from "../../assets/Bg-Header.png";
import DateRangePicker from "../../components/DateRangePicker";
import GuestSelector from "../../components/GuestSelector";
import TripSlider from "../../components/TripSlider";
import DiscoverRajaAmpatSection from "../../components/DiscoverRajaAmpatSection";
import WhyChooseTripNesia from "../../components/WhyChooseTripNesia";
import { formatDate } from "../../lib/dateFormatter";
import { usePublicShips } from "../../hooks/usePublicShips";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import BgPromo from "../../assets/Bg-Promo.png";

const Welcome = () => {
  const navigate = useNavigate(); // Gunakan useNavigate
  const { ships } = usePublicShips();
  const [tripType, setTripType] = useState("Open Trip");
  const [passengerCount, setPassengerCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2025-09-19"),
    endDate: new Date("2025-10-03"),
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (range) => {
    setDateRange(range);
    setShowCalendar(false);
  };

  // Handler untuk tombol search
  const handleSearch = () => {
    const params = new URLSearchParams();

    // Trip type
    params.set("type", tripType === "Private Trip" ? "private" : "open");

    // Date range
    if (dateRange.startDate && dateRange.endDate) {
      params.set("startDate", dateRange.startDate.toISOString().split("T")[0]);
      params.set("endDate", dateRange.endDate.toISOString().split("T")[0]);
    }

    // Passenger count
    params.set("pax", passengerCount);

    // Navigate ke halaman product dengan filter
    navigate(`/product?${params.toString()}`);
  };

  useEffect(() => {
    const shouldReload = sessionStorage.getItem("reloadOnce");
    if (shouldReload) {
      sessionStorage.removeItem("reloadOnce");
      window.location.reload();
    }
  }, []);

  const handlePromo = () => {
    navigate("/login");
  };

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
                    <GuestSelector value={passengerCount} onChange={setPassengerCount} welcome={false}/>

                    {/* Search Button */}
                    <button 
                      onClick={handleSearch} // Gunakan handler baru
                      className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-colors font-medium w-full md:w-auto"
                    >
                      Search
                    </button>
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
            <TripSlider trips={ships} />
          </div>
        </section>

        {/* Promo Section */}
        <section className="mb-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl">
              {/* Background Image */}
              <div
                className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `url(${BgPromo})`,
                  backgroundPosition: "center", // Pastikan posisi tengah
                  backgroundSize: "cover", // Gambar mengisi container
                  backgroundRepeat: "no-repeat", // Hindari pengulangan
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
                    <button onClick={handlePromo} className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-sm">
                      Get Deals
                    </button>
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
