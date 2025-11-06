import React from "react";
import GuestLayout from "../../../layouts/GuestLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import ImageCarousel from "../../../components/ImageCarousel";
import { Link, useParams } from "react-router-dom";
import { useShipBySlug } from "../../../hooks/useShipBySlug";
import { ArrowLeft, Users, Wallet } from "lucide-react";
import { getImageUrl } from "../../../lib/getImageUrl";
import { useActiveSection } from "../../../hooks/useActiveSection";
import IconFerry from "../../../assets/icons/Ferry-Boat.svg";

const Detail = () => {
  const { slug } = useParams();
  const { ship, loading, error } = useShipBySlug(slug);
  const [isScrolled, setIsScrolled] = React.useState(false);
  console.log(ship);

  React.useEffect(() => {
    const handleScroll = () => {
      // Munculkan tab saat scroll melewati tinggi awal (misal 400px)
      setIsScrolled(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatPrice = (price) => {
    if (!price || price === 0 || price === null) return "Price not available";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const sectionIds = ["overview", "about-ship", "itinerary", "policies"];
  const activeSection = useActiveSection(sectionIds);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <GuestLayout>
        <Breadcrumb />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ship details...</p>
        </div>
      </GuestLayout>
    );
  }

  if (error || !ship) {
    return (
      <GuestLayout>
        <Breadcrumb />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Ship not found</h3>
            <p className="text-red-600 mb-4">{error || "The ship you're looking for doesn't exist."}</p>
          </div>
        </div>
      </GuestLayout>
    );
  }

  // Generate gallery images
  const mainImage = ship.image_ship ? getImageUrl(ship.image_ship) : null;
  const additionalImages = (ship.images || []).map((img) => getImageUrl(img.image_ship_url));
  let galleryImages = [mainImage, ...additionalImages];
  const placeholder = "https://via.placeholder.com/300x200?text=No+Image";
  while (galleryImages.length < 4) {
    galleryImages.push(placeholder);
  }
  galleryImages = galleryImages.slice(0, 4);

  const scheduleName = ship.schedules?.[0]?.name || "Trip";
  const tripType = ship.type === "private" ? "Private Trip" : "Open Trip";

  return (
    <GuestLayout hideNavbar={!isScrolled ? false : true}>
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to={"/product"} className="flex items-center gap-2 mb-8 text-sm">
          <ArrowLeft size={18} />
          See all ships
        </Link>

        {/* Gallery */}
        <div className="border border-gray-400 rounded-xl p-2 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-1">
            <img
              src={galleryImages[0]}
              alt="Main Ship View"
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div>
              <img
                src={galleryImages[1]}
                alt="Interior View"
                className="w-full h-31 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = placeholder;
                }}
              />
            </div>
            <div>
              <img
                src={galleryImages[2]}
                alt="Cabin View"
                className="w-full h-31 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = placeholder;
                }}
              />
            </div>
          </div>
          <div className="md:col-span-1 mt-2 md:mt-0">
            <img
              src={galleryImages[3]}
              alt="Sunset Sail"
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        <div className={`sticky top-0 z-10 bg-white ${isScrolled ? "" : "border-b border-gray-300"} transition-shadow duration-300`}>
          <div className="container mx-auto px-4 pt-2">
            <div className="flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "about-ship", label: "About Ship" },
                { id: "itinerary", label: "Itinerary" },
                { id: "policies", label: "Policies" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => scrollToSection(tab.id)} className={`pb-2 font-medium relative group transition-colors duration-200 ${activeSection === tab.id ? "text-primary" : "text-gray-500 hover:text-gray-700"}`}>
                  {tab.label}
                  {activeSection === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* About Ship */}
          <section id="about-ship" className="-scroll-mt-10 mt-4">
            {/* Header & Price */}
            <div className="flex">
              <div className="w-3/4 pr-6">
                <div>
                  <span className="flex items-center justify-center gap-2 bg-green-600 w-1/7 text-white py-2 rounded-xl mb-4">
                    <Wallet size={16} />
                    <span>{tripType}</span>
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {scheduleName} {tripType} With {ship.name}
                </h1>
                <div className="mb-4">
                  <h2 className="flex items-center gap-2">
                    <img src={IconFerry} alt="Ship Icon" className="w-10 h-10 bg-primary p-1 rounded-xl" />
                    <p className="text-xl font-semibold">{ship.name}</p>
                  </h2>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About Ship</h2>
                  <p className="text-gray-600 leading-relaxed text-justify">{ship.description}</p>
                </div>
              </div>

              <div className="w-1/4 border border-gray-300 p-5 rounded-xl">
                <div className=" ">
                  <h1 className="flex items-center gap-2 ">
                    <Users size={18} />
                    {ship.min_pax}-{ship.max_pax} Guest
                  </h1>
                  <span className="text-xs text-gray-500">Price start from</span>
                </div>
                <h1 className="text-3xl font-bold mb-3">{formatPrice(ship.minPrice)}</h1>
                <p className="text-lg mb-3">
                  {scheduleName} {tripType}
                </p>
                <button className="w-full bg-primary hover:opacity-60 text-white py-2 rounded-lg transition-all font-medium mb-4">Select Date</button>
                <hr className="border border-gray-300" />
                <div className="flex items-center gap-2 justify-center pt-8 pb-3">
                  <img src={IconFerry} alt="Ship Icon" className="w-8 h-8 bg-primary p-1 rounded-xl" />
                  <p className="text-lg">{ship.name}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 ">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Ship Specifications</h2>
              {ship.specifications && ship.specifications.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                  {ship.specifications.map((spec) => (
                    <li key={spec._id} className="flex items-center gap-2 text-gray-800">
                      <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                      {spec.name}: {spec.unit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No facilities listed.</p>
              )}
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Ship Facilities</h2>
              {ship.facilities && ship.facilities.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                  {ship.facilities.map((facility) => (
                    <li key={facility._id} className="flex items-center gap-2 text-gray-800">
                      <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                      {facility.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No facilities listed.</p>
              )}
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Safety Equipment</h2>
              {ship.tools && ship.tools.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                  {ship.tools.map((tool) => (
                    <li key={tool._id} className="flex items-center gap-2 text-gray-800">
                      <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                      {tool.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No facilities listed.</p>
              )}
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Cabin List</h2>
              {ship.cabins && ship.cabins.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ship.cabins.map((cabin) => {
                    // Ekstrak fitur dari field "other"
                    const hasPrivateBathroom = cabin.other?.some((item) => item.name === "Private Bathroom");
                    const hasAirConditioning = cabin.other?.some((item) => item.name === "Air Conditioning");

                    return (
                      <div key={cabin._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Carousel Gambar */}
                        <ImageCarousel images={cabin.images || []} placeholder={placeholder} />

                        {/* Konten Kamar */}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-800">{cabin.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{cabin.bed} bed</span>
                            {hasPrivateBathroom && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Private Bathroom</span>}
                            {hasAirConditioning && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Air Conditioning</span>}
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Max {cabin.pax} Pax</span>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">Harga per kamar</p>
                            <p className="font-bold text-lg text-primary">{formatPrice(cabin.price)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No cabins available.</p>
              )}
            </div>
          </section>

          <hr className="border border-gray-300" />

          {/* Itinerary */}
          <section id="itinerary" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cabin List</h2>
            <p className="text-gray-600 leading-relaxed">
              Day 1: Pickup at Labuan Bajo → Sailing to Komodo Island → Snorkeling at Pink Beach → Overnight on board
              <br />
              Day 2: Trekking to Komodo Dragon viewpoint → Lunch on board → Sailing to Rinca Island → Sunset cruise
              <br />
              Day 3: Breakfast → Disembark at Labuan Bajo
            </p>
          </section>

          {/* Policies */}
          <section id="policies" className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Policies</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Full payment required 7 days before departure</li>
              <li>Cancellation fee: 50% if canceled 3-7 days prior, 100% if less than 3 days</li>
              <li>Minimum 2 persons required for private trip</li>
              <li>Children under 5 years old free of charge (no bed)</li>
            </ul>
          </section>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Detail;
