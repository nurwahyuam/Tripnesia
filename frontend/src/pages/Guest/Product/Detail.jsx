import React, { useEffect, useState } from "react";
import GuestLayout from "../../../layouts/GuestLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import ImageCarousel from "../../../components/ImageCarousel";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShipBySlugPublic } from "../../../hooks/useShipBySlugPublic";
import { ArrowLeft, Bath, BedDouble, BedSingle, Calendar, Check, Dock, Eye, Fence, Minus, Plus, ShowerHead, Users, Wallet, X } from "lucide-react";
import { getImageUrl } from "../../../lib/getImageUrl";
import { useActiveSection } from "../../../hooks/useActiveSection";
import IconFerry from "../../../assets/icons/Ferry-Boat.png";
import { formatPrice } from "../../../lib/formatPrice";
import { formatDate } from "../../../lib/dateFormatter";

const generateUniqueDateRanges = (cabins) => {
  const rangesMap = new Map();

  cabins.forEach((cabin) => {
    const start = new Date(cabin.date_start);
    const end = new Date(cabin.date_end);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    const rangeKey = `${startStr} to ${endStr}`;

    if (!rangesMap.has(rangeKey)) {
      rangesMap.set(rangeKey, {
        key: rangeKey,
        start: startStr,
        end: endStr,
      });
    }
  });

  return Array.from(rangesMap.values()).sort((a, b) => new Date(a.start) - new Date(b.start));
};

const Detail = () => {
  const { slug } = useParams();
  const navigation = useNavigate();
  const { shipPublic, loading, error } = useShipBySlugPublic(slug);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedCabins, setSelectedCabins] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);

  const isCabinFullyBooked = (cabinId, selectedRange) => {
    const cabin = shipPublic.cabins.find((c) => c._id === cabinId);
    if (!cabin || !selectedRange) return false;

    if (selectedRange === "2025-11-07 to 2025-11-09" && cabin._id === "69041a1a60ff3e1d20f21485") {
      return true;
    }

    return false;
  };

  const updatePax = (cabinId, type, change) => {
    const current = selectedCabins[cabinId] || { adult: 0, child: 0 };

    if (type === "adult") {
      const newValue = Math.max(0, current.adult + change);
      // Batas dewasa: tidak boleh melebihi cabin.pax
      const cabin = shipPublic.cabins.find((c) => c._id === cabinId);
      if (newValue > cabin?.pax) return;

      setSelectedCabins({
        ...selectedCabins,
        [cabinId]: {
          ...current,
          adult: newValue,
        },
      });
    }

    if (type === "child") {
      const newValue = Math.max(0, current.child + change);
      // Batas anak: maksimal 2
      if (newValue > 2) return;

      setSelectedCabins({
        ...selectedCabins,
        [cabinId]: {
          ...current,
          child: newValue,
        },
      });
    }
  };

  useEffect(() => {
    if (showBookingModal) {
      // Lock scroll
      document.body.style.overflow = "hidden";
    } else {
      // Unlock scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup saat unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showBookingModal]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 380);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionIds = ["overview", "about-ship", "traveling", "policies"];
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

  if (error || !shipPublic) {
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
  const mainImage = shipPublic.image_ship ? getImageUrl(shipPublic.image_ship) : null;
  const additionalImages = (shipPublic.images || []).map((img) => getImageUrl(img.image_ship_url));
  let galleryImages = [mainImage, ...additionalImages];
  const placeholder = "https://via.placeholder.com/300x200?text=No+Image";
  while (galleryImages.length < 4) {
    galleryImages.push(placeholder);
  }
  galleryImages = galleryImages.slice(0, 4);

  const scheduleName = shipPublic.schedules?.[0]?.name || "Trip";
  const tripType = shipPublic.type === "private" ? "Private Trip" : "Open Trip";

  const availableRanges = shipPublic?.cabins ? generateUniqueDateRanges(shipPublic.cabins) : [];

  const isCabinInSelectedRange = (cabin, rangeKey) => {
    if (!rangeKey) return true;

    const start = new Date(cabin.date_start);
    const end = new Date(cabin.date_end);

    const rangeStart = new Date(rangeKey.split(" to ")[0]);
    const rangeEnd = new Date(rangeKey.split(" to ")[1]);

    // Cek apakah rentang cabin cocok dengan rentang yang dipilih
    return start.getTime() === rangeStart.getTime() && end.getTime() === rangeEnd.getTime();
  };

  const filteredCabins = shipPublic?.cabins ? shipPublic.cabins.filter((cabin) => isCabinInSelectedRange(cabin, selectedRange)) : [];

  const handleBooking = () => {
    const totalPrice = Object.keys(selectedCabins).reduce((sum, cabinId) => {
      const cabin = shipPublic.cabins.find((c) => c._id === cabinId);
      const pax = selectedCabins[cabinId];
      if (pax.adult > 0) {
        const pricePerCabin = cabin ? parseFloat(cabin.price) || 0 : 0;
        return sum + pricePerCabin * pax.adult;
      }
      return sum;
    }, 0);

    // Data yang akan dikirim ke checkout
    const bookingData = {
      ship: {
        _id: shipPublic._id,
        name: shipPublic.name,
        type: shipPublic.type,
        slug: shipPublic.slug,
        image: shipPublic.image_ship,
      },
      cabins: Object.keys(selectedCabins)
        .map((cabinId) => {
          const cabin = shipPublic.cabins.find((c) => c._id === cabinId);
          const pax = selectedCabins[cabinId];
          if (pax.adult + pax.child > 0) {
            return {
              _id: cabin._id,
              name: cabin.name,
              other: cabin.other.map((item) => ({
                key: item.key,
                value: item.value,
              })),
              bed: cabin.bed,
              pax: pax,
              price: parseFloat(cabin.price) || 0,
              totalPrice: (parseFloat(cabin.price) || 0) * pax.adult,
            };
          }
          return null;
        })
        .filter(Boolean),
      dateRange: selectedRange,
      schedule: scheduleName,
      totalPax: {
        adult: Object.values(selectedCabins).reduce((sum, pax) => sum + pax.adult, 0),
        child: Object.values(selectedCabins).reduce((sum, pax) => sum + pax.child, 0),
      },
      totalPrice: totalPrice,
    };

    // Navigasi ke halaman checkout dengan data
    navigation(`/product/${shipPublic.slug}/checkout`, { state: { bookingData } });
  };

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
                src={galleryImages[1] ? galleryImages[1] : placeholder}
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
        <div className={` ${showBookingModal ? "hidden" : "sticky"} top-0 z-10 bg-white ${isScrolled ? "" : "border-b border-gray-300"} transition-shadow duration-300`}>
          <div className="container mx-auto px-4 pt-2">
            <div className="flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "about-ship", label: "About Ship" },
                { id: "traveling", label: "Traveling" },
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
          <section id="about-ship" className="scroll-mt-16 mt-4">
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
                  {scheduleName} {tripType} With {shipPublic.name}
                </h1>
                <div className="mb-4">
                  <h2 className="flex items-center gap-2">
                    <img src={IconFerry} alt="Ship Icon" className="w-10 h-10 bg-primary p-1 rounded-xl" />
                    <p className="text-xl font-semibold">{shipPublic.name}</p>
                  </h2>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About Ship</h2>
                  <p className="text-gray-600 leading-relaxed text-justify">{shipPublic.description}</p>
                </div>
              </div>

              <div className="w-1/4 border border-gray-300 p-5 rounded-xl">
                <div className="">
                  <h1 className="flex items-center gap-2">
                    <Users size={18} />
                    {shipPublic.min_pax}-{shipPublic.max_pax} Guest
                  </h1>
                  <span className="text-xs text-gray-500">Price start from</span>
                </div>
                <h1 className="text-3xl font-bold mb-3">{formatPrice(shipPublic.minPrice)}</h1>
                <p className="text-lg mb-3">
                  {scheduleName} {tripType}
                </p>
                <button onClick={() => scrollToSection("cabins")} className="w-full bg-primary hover:opacity-60 text-white py-2 rounded-lg transition-all font-medium mb-4">Select Date</button>
                <hr className="border border-gray-300" />
                <div className="flex items-center gap-2 justify-center pt-8 pb-3">
                  <img src={IconFerry} alt="Ship Icon" className="w-8 h-8 bg-primary p-1 rounded-xl" />
                  <p className="text-lg">{shipPublic.name}</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Ship Specifications</h2>
              {shipPublic.specifications && shipPublic.specifications.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                  {shipPublic.specifications.map((spec) => (
                    <li key={spec._id} className="flex items-center gap-2 text-gray-800">
                      <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                      {spec.name}: {spec.unit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No specifications listed.</p>
              )}
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Ship Facilities</h2>
              {shipPublic.facilities && shipPublic.facilities.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                  {shipPublic.facilities.map((facility) => (
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
              {shipPublic.tools && shipPublic.tools.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                  {shipPublic.tools.map((tool) => (
                    <li key={tool._id} className="flex items-center gap-2 text-gray-800">
                      <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                      {tool.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No safety equipment listed.</p>
              )}
            </div>

            {/* Cabin List */}
            <div className="mt-12 mb-20" id="cabins">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Cabin List</h2>

              <div className="border border-gray-300 rounded-xl p-6">
                {/* Filter Tanggal */}
                <div className="mb-6 w-full relative">
                  <Calendar className="absolute top-2.5 left-3" />
                  <select id="cabin-range" value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="w-full px-10 py-2.5 border border-gray-300 rounded-lg text-gray-500">
                    <option value="">Select Trip Date</option>
                    {availableRanges.map((range) => (
                      <option key={range.key} value={range.key}>
                        {formatDate(range.start)} - {formatDate(range.end)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Daftar Kabin yang Difilter */}
                {filteredCabins.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCabins.map((cabin) => {
                      const getOtherValue = (cabin, key) => {
                        const item = cabin.other?.find((item) => item.key === key);
                        return item ? item.value : null;
                      };

                      const bathroomValue = getOtherValue(cabin, "Bathroom");
                      const balconyValue = getOtherValue(cabin, "Balcony");
                      const airValue = getOtherValue(cabin, "Air");
                      const tableValue = getOtherValue(cabin, "Table");
                      const viewValue = getOtherValue(cabin, "View");

                      const currentPax = selectedCabins[cabin._id] || { adult: 0, child: 0 };

                      // Cek apakah kamar penuh
                      const isFull = currentPax.adult >= cabin.pax;

                      return (
                        <div key={cabin._id} className={`border border-gray-300 rounded-xl overflow-hidden relative ${isFull ? "opacity-70" : ""}`}>
                          {/* Carousel Gambar */}
                          <ImageCarousel images={cabin.images || []} placeholder={placeholder} />

                          {/* Konten Kamar */}
                          <div className="p-4">
                            <span className="capitalize text-sm px-3 py-1 bg-[#DDFFFB] text-primary rounded-full">{cabin.type}</span>
                            <h3 className="mt-2 mb-4 font-semibold text-lg text-gray-800">{cabin.name}</h3>

                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="flex items-center font-semibold gap-2 text-sm rounded-full">
                                {cabin.bed === "Single Size" ? <BedSingle size={18} /> : <BedDouble size={18} />} {cabin.bed} Bed
                              </span>
                              <span className="flex items-center gap-2 font-semibold text-sm">
                                <Users size={18} /> {cabin.pax} Person
                              </span>
                              {bathroomValue && (
                                <span className="text-sm flex items-center gap-2 font-semibold">
                                  <Bath size={18} />
                                  {bathroomValue}
                                </span>
                              )}
                              {balconyValue && (
                                <span className="text-sm flex items-center gap-2 font-semibold">
                                  <Fence size={18} />
                                  {balconyValue}
                                </span>
                              )}
                              {airValue && (
                                <span className="text-sm flex items-center gap-2 font-semibold">
                                  <ShowerHead size={18} />
                                  {airValue}
                                </span>
                              )}
                              {tableValue && (
                                <span className="text-sm flex items-center gap-2 font-semibold">
                                  <Dock size={18} />
                                  {tableValue}
                                </span>
                              )}
                              {viewValue && (
                                <span className="text-sm flex items-center gap-2 font-semibold">
                                  <Eye size={18} />
                                  {viewValue}
                                </span>
                              )}
                            </div>

                            <div className="my-4">
                              <p className="text-sm">Price per Room</p>
                              <p className="font-bold text-lg ">{formatPrice(cabin.price)}</p>
                            </div>

                            {isCabinFullyBooked(cabin._id, selectedRange) ? (
                              <div className="border-t border-gray-300">
                                <div className="absolute bottom-3 right-3 text-red-500 text-sm font-medium">Full Book</div>
                              </div>
                            ) : (
                              selectedRange && (
                                // Jika tanggal dipilih dan kamar tersedia, tampilkan input pax
                                <div className="border-t border-gray-300">
                                  <div className="flex justify-between gap-2">
                                    <div className="mt-2">
                                      <h1 className="text-md font-semibold">
                                        5 Tahun ke Atas
                                        <p className="text-sm font-normal text-gray-500">Adult</p>
                                      </h1>
                                      <h1 className="text-md font-semibold mt-6">
                                        0 - 5 Tahun
                                        <p className="text-sm font-normal text-gray-500">Free without a bed</p>
                                      </h1>
                                    </div>
                                    <div className="mt-2">
                                      {/* Dewasa */}
                                      <div className="flex items-center justify-center gap-2 mb-6 border border-gray-300 py-1.5 px-1.5 rounded-xl">
                                        <button onClick={() => updatePax(cabin._id, "adult", -1)} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-300">
                                          <Minus size={14} className="text-gray-800" />
                                        </button>
                                        <span className="text-sm w-4 text-center">{currentPax.adult}</span>
                                        <button
                                          onClick={() => updatePax(cabin._id, "adult", 1)}
                                          className={`w-8 h-8 flex border border-gray-300 rounded-lg items-center justify-center ${currentPax.adult >= cabin.pax ? "cursor-not-allowed bg-gray-300" : " hover:bg-gray-300"}`}
                                          disabled={currentPax.adult >= cabin.pax}
                                        >
                                          <Plus size={14} className="text-gray-800" />
                                        </button>
                                      </div>
                                      {/* Anak */}
                                      <div className="flex items-center gap-2 border border-gray-300 py-1.5 justify-center rounded-xl">
                                        <button onClick={() => updatePax(cabin._id, "child", -1)} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-300">
                                          <Minus size={14} className="text-gray-800" />
                                        </button>
                                        <span className="text-sm w-4 text-center">{currentPax.child}</span>
                                        <button
                                          onClick={() => updatePax(cabin._id, "child", 1)}
                                          className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 ${currentPax.child >= 2 ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-300"}`}
                                          disabled={currentPax.child >= 2}
                                        >
                                          <Plus size={14} className="text-gray-800" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">{selectedRange ? "Tidak ada kabin tersedia untuk rentang ini." : "Tidak ada kabin tersedia."}</p>
                )}
                {/* Tombol Reservation */}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      if (Object.keys(selectedCabins).length > 0 && Object.values(selectedCabins).some((pax) => pax.adult + pax.child > 0)) {
                        setShowBookingModal(true);
                      } else {
                        alert("Please select at least one cabin with pax > 0.");
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      Object.keys(selectedCabins).length > 0 && Object.values(selectedCabins).some((pax) => pax.adult + pax.child > 0) ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!(Object.keys(selectedCabins).length > 0 && Object.values(selectedCabins).some((pax) => pax.adult + pax.child > 0))}
                  >
                    Reservation
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Traveling */}
          <section id="traveling" className="scroll-mt-10 pt-8 pb-12 border-t border-gray-300">
            <div className="flex">
              <div className="w-1/10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Travel Plan</h2>
              </div>
              <div className="w-full">
                <div className="px-28">
                  {shipPublic.schedules.map((schedule) => (
                    <div key={schedule._id} className="flex items-start gap-24">
                      {schedule.plans.map((day) => (
                        <div key={day._id}>
                          <h3 className="uppercase font-semibold text-3xl mb-3">Day {day.day}</h3>
                          <ul className="space-y-2">
                            {day.plans.map((activity, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-800">
                                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="px-28 mt-6">
                  <h3 className="capitalize font-semibold text-3xl mb-3">Included in the Package</h3>
                  <ul className="space-y-2 grid grid-cols-2">
                    {shipPublic.package.map((pack, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-800">
                        <Check size={20} className="text-green-500" />
                        {pack}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-28 mt-6">
                  <h3 className="capitalize font-semibold text-3xl mb-3">Not Included in the Package</h3>
                  <ul className="space-y-2 grid grid-cols-2">
                    {shipPublic.unpackage.map((pack, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-800">
                        <X size={20} className="text-red-500" />
                        {pack}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Policies */}
          <section id="policies" className="scroll-mt-10 pt-8 border-t border-gray-300">
            <div className="flex">
              <div className="w-1/7">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Payment Policy</h2>
              </div>
              <div className="w-full px-24">
                <h3 className="mb-3 font-semibold text-xl">Booking</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">All bookings must be made through a registered account and will be connected to Kapalsantai Customer Service on WhatsApp.</p>
                <h3 className="mb-3 font-semibold text-xl">Full Payment in Advance</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">Slots are locked after 100% of the package price has been paid in advance.</p>
                <h3 className="mb-3 font-semibold text-xl">Payment Link Validity Period</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">The payment link is valid for 24 hours; if expired, the slot will automatically return to inventory without penalty.</p>
                <h3 className="mb-3 font-semibold text-xl">Payment</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">The payment link is valid for 24 hours; if expired, the slot will automatically return to inventory without penalty.</p>
                <ul className="list-decimal ml-12 space-y-2">
                  <li className="text-gray-500 text-justify text-lg">
                    <p className="mb-3 text-gray-500 text-justify text-lg">Kapalsantai provides multiple payment platforms, including:</p>
                    <ul className="list-disc ml-12 space-y-2">
                      <li>Credit & Debit Cards</li>
                      <li>ATM</li>
                      <li>Virtual Account</li>
                      <li> E-wallet</li>
                    </ul>
                  </li>
                  <li className="text-gray-500 text-justify text-lg">Kapalsantai does not charge any administrative fees; if there are additional fees from third parties, they will be borne entirely by the guest.</li>
                </ul>
              </div>
            </div>
            <div className="flex mt-10">
              <div className="w-1/7">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Boat Policy</h2>
              </div>
              <div className="w-full px-24">
                <h3 className="mb-3 font-semibold text-xl">Reschedule</h3>
                <ul className="ml-12 list-disc space-y-2 mb-3">
                  <li className="text-gray-500 text-justify text-lg">Rescheduling is only allowed once. Submit your reschedule request via WhatsApp no later than 30 days before the trip date.</li>
                  <li className="text-gray-500 text-justify text-lg">The replacement date must be in the same calendar year. If there is a price difference on the replacement date, the guest must pay the difference.</li>
                </ul>
                <h3 className="mb-3 font-semibold text-xl">No-Show & Delays</h3>
                <ul className="ml-12 list-disc space-y-2 mb-3">
                  <li className="text-gray-500 text-justify text-lg">Open Trips depart on time; late guests can catch up at their own expense.</li>
                  <li className="text-gray-500 text-justify text-lg">Private Trips: in case of delays, the captain will determine whether the trip can continue after assessing the current sea currents and weather conditions.</li>
                </ul>
                <h3 className="mb-3 font-semibold text-xl">Capacity & Age</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">The number of guests cannot exceed the operator's manifest (check the ship catalog). Price categories: </p>
                <ul className="ml-12 list-disc space-y-2 mb-3">
                  <li className="text-gray-500 text-justify text-lg">Infants {"<"}2 years old are free.</li>
                  <li className="text-gray-500 text-justify text-lg">Toddlers 2-5 years old are 50% (if the operator supports it).</li>
                  <li className="text-gray-500 text-justify text-lg">Children ≥ 5 years old are charged the full rate.</li>
                </ul>
                <h3 className="mb-3 font-semibold text-xl">Health</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">
                  Guests with serious heart conditions, epilepsy, pregnancy ≥ 32 weeks, and others must consult a doctor. The Ship Partner reserves the right to refuse boarding if the guest's condition is deemed unsuitable for sailing.
                </p>
                <h3 className="mb-3 font-semibold text-xl">Behavior</h3>
                <ul className="ml-12 list-disc space-y-2 mb-3">
                  <li className="text-gray-500 text-justify text-lg">Smoking and consuming alcohol on board must comply with ship rules.</li>
                  <li className="text-gray-500 text-justify text-lg">Guests are prohibited from disposing of plastic waste into the sea/island; waste disposal bins are provided.</li>
                </ul>
                <h3 className="mb-3 font-semibold text-xl">Food & Beverage Policy</h3>
                <ul className="ml-12 list-disc space-y-2 mb-3">
                  <li className="text-gray-500 text-justify text-lg">
                    Each ship provides a basic halal menu (rice, side dishes, vegetables, fruit).For additional menus (Western, vegetarian/vegan), allergies, or special preferences, please submit your request via Kapalsantai WhatsApp no
                    later than 7 days before departure.
                  </li>
                  <li className="text-gray-500 text-justify text-lg">Alcoholic beverages are available as add-ons; purchases and payments are made on board or pre-ordered via WhatsApp.</li>
                </ul>
                <h3 className="mb-3 font-semibold text-xl">Safety Briefing</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">The Ship Partner is required to demonstrate life jackets and evacuation procedures before the ship sails.</p>
                <h3 className="mb-3 font-semibold text-xl">Boat Replacement</h3>
                <ul className="list-decimal ml-12 space-y-2">
                  <li className="text-gray-500 text-justify text-lg">
                    <h4 className="text-gray-800 text-justify text-lg font-semibold">Force Majeure</h4>
                    <p className="text-gray-500 text-justify text-lg">Events beyond control (extreme weather, sailing restrictions) → automatic full refund.</p>
                  </li>
                  <li className="text-gray-500 text-justify text-lg">
                    <h4 className="text-gray-800 text-justify text-lg font-semibold">Double Booking</h4>
                    <p className="text-gray-500 text-justify text-lg">
                      Schedule update error by the boat admin → the boat admin will find a replacement boat according to the trip type (Private/Open). Kapalsantai will confirm within 2×24 hours; if there is no response, an automatic refund
                      will be issued.
                    </p>
                  </li>
                  <li className="text-gray-500 text-justify text-lg">
                    <h4 className="text-gray-800 text-justify text-lg font-semibold">Overbooking</h4>
                    <p className="text-gray-500 text-justify text-lg">Full slots on the booked ship → transferred to another ship.</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex mt-10">
              <div className="w-1/7">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">Refund & Reschedule Policy</h2>
              </div>
              <div className="w-full px-24">
                <h3 className="mb-3 font-semibold text-xl">Collective Cancellation</h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">The system does not support partial refunds; refunds are only applicable if the entire booking is canceled.</p>
                <h3 className="mb-3 font-semibold text-xl">One Transaction, One Responsible Party </h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">Each reservation is recorded as one transaction under the name of one main guest/representative.</p>
                <h3 className="mb-3 font-semibold text-xl">Guest Substitution </h3>
                <p className="mb-3 text-gray-500 text-justify text-lg">
                  Cancelled guests can be replaced without a refund process; simply provide the replacement details to Customer Service when requesting changes at least 14 days before the trip date.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* Modal Booking */}
      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* Backdrop Gelap */}
          <div className="bg-black opacity-70 w-full h-full absolute z-50"></div>

          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto z-51">
            <h3 className="text-xl font-semibold text-gray-800 capitalize">
              {shipPublic.type} With {shipPublic.name}
            </h3>

            {(() => {
              const totalAdults = Object.values(selectedCabins).reduce((sum, pax) => sum + pax.adult, 0);
              const totalChildren = Object.values(selectedCabins).reduce((sum, pax) => sum + pax.child, 0);
              const totalPax = totalAdults + totalChildren;

              if (totalPax === 0) return null;

              return (
                <p key="total-summary" className="mt-1 text-justify text-xs font-semibold text-gray-600">
                  To accommodate the number of guests staying, we provide an estimate of the total room price that suits your needs:{" "}
                  <span className="text-black">
                    {totalPax} guest ({totalAdults} adult and {totalChildren} children).
                  </span>
                </p>
              );
            })()}

            {/* Daftar Kamar yang Dipilih */}
            {Object.keys(selectedCabins).length > 0 ? (
              <div className="mt-4 bg-gray-200 px-3 py-2 rounded-xl">
                {Object.keys(selectedCabins).map((cabinId) => {
                  const cabin = shipPublic.cabins.find((c) => c._id === cabinId);
                  const pax = selectedCabins[cabinId];
                  const totalPax = pax.adult + pax.child;

                  // Parse harga ke number
                  const cabinPrice = parseFloat(cabin?.price) || 0;
                  const totalPrice = pax.adult * cabinPrice;
                  const pricePax = formatPrice(totalPrice);

                  if (totalPax === 0) return null;

                  return (
                    <div key={cabinId}>
                      <div className="">
                        <h4 className="text-sm font-semibold text-gray-800">{cabin.name}</h4>
                        {pax.adult !== 0 && (
                          <div className={`${pax.child === 0 ? "mb-4" : ""} flex justify-between mt-2 text-xs`}>
                            <span>{pax.adult} Adult</span>
                            <span>{pricePax}</span>
                          </div>
                        )}
                        {pax.child !== 0 && (
                          <div className="flex justify-between text-xs mb-4">
                            <span>{pax.child} Child</span>
                            <span>Free</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* Total Keseluruhan */}
                <div className="pb-3 border-t-3 border-dotted border-gray-300">
                  <div className="flex justify-between font-semibold text-sm   mt-2">
                    <span>Total Price:</span>
                    <span>
                      {formatPrice(
                        Object.keys(selectedCabins).reduce((sum, cabinId) => {
                          const cabin = shipPublic.cabins.find((c) => c._id === cabinId);
                          const pax = selectedCabins[cabinId];
                          if (pax.adult > 0) {
                            const pricePerCabin = cabin ? parseFloat(cabin.price) || 0 : 0;
                            return sum + pricePerCabin * pax.adult;
                          }
                          return sum; // ✅ Tambahkan ini agar tidak undefined
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No cabins selected.</p>
            )}

            {/* Tombol Aksi */}
            <div className="mt-3 flex-col space-y-1.5">
              <button onClick={() => setShowBookingModal(false)} className="w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-300 transition-all">
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:opacity-60 transition-all"
                disabled={Object.values(selectedCabins).some((pax) => pax.adult + pax.child > 0) && Object.keys(selectedCabins).some((cabinId) => isCabinFullyBooked(cabinId, selectedRange))}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </GuestLayout>
  );
};

export default Detail;
