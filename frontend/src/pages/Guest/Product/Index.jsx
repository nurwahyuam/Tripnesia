// src/pages/Guest/Product/Index.jsx
import React, { useState, useMemo, useCallback } from "react";
import GuestLayout from "../../../layouts/GuestLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import { usePublicShips } from "../../../hooks/usePublicShips";
import { Link, useSearchParams } from "react-router-dom";
import DateRangePicker from "../../../components/DateRangePicker";
import GuestSelector from "../../../components/GuestSelector";
import { Calendar, Wallet, X } from "lucide-react";
import { getImageUrl } from "../../../lib/getImageUrl";
import IconFerry from "../../../assets/icons/Ferry-Boat.svg";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "open";
  const [tripType, setTripType] = useState(initialType === "private" ? "Private Trip" : "Open Trip");

  const [filters, setFilters] = useState({
    tripDuration: [],
    classTrip: [],
    budget: [],
    shipBrand: [],
  });

  const [sortBy, setSortBy] = useState("recommended");
  const [paxCount, setPaxCount] = useState(null);

  // State untuk date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

  const { ships, loading, error } = usePublicShips();
  console.log(ships);

  // Filter options sesuai gambar
  const filterOptions = {
    tripDuration: ["2 Day", "3 Day", "4 Day", "More Than 5 Days"],
    classTrip: ["Standard", "Superior", "Deluxe", "Luxury"],
    budget: ["Less than IDR 2,000,000", "IDR 2,000,000 - IDR 5,000,000", "IDR 5,000,000 - IDR 7,000,000", "IDR 7,000,000 - IDR 10,000,000", "More than IDR 10,000,000"],
    shipBrand: useMemo(() => {
      if (!Array.isArray(ships)) return [];
      return [...new Set(ships.map((ship) => ship.merk).filter(Boolean))];
    }, [ships]),
  };

  // Mapping budget ke range harga
  const getBudgetRange = (label) => {
    if (label === "Less than IDR 2,000,000") return { min: 0, max: 2000000 };
    if (label === "IDR 2,000,000 - IDR 5,000,000") return { min: 2000000, max: 5000000 };
    if (label === "IDR 5,000,000 - IDR 7,000,000") return { min: 5000000, max: 7000000 };
    if (label === "IDR 7,000,000 - IDR 10,000,000") return { min: 7000000, max: 10000000 };
    if (label === "More than IDR 10,000,000") return { min: 10000000, max: 999999999 };
    return { min: 0, max: 999999999 };
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value) ? prev[category].filter((item) => item !== value) : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      tripDuration: [],
      classTrip: [],
      budget: [],
      shipBrand: [],
    });
    setSelectedDates({
      startDate: null,
      endDate: null,
    });
    setPaxCount(null);
    setShowDatePicker(false);
  };

  const handleTripTypeChange = (type) => {
    const newType = type === "Private Trip" ? "private" : "open";
    setTripType(type);
    setSearchParams({ type: newType });
  };

  // Handler untuk date range picker
  const handleDateChange = (dates) => {
    setSelectedDates({
      startDate: dates.startDate,
      endDate: dates.endDate,
    });
    if (dates.startDate && dates.endDate) {
      setShowDatePicker(false);
    }
  };

  // Handler untuk guest selector
  const handlePaxChange = (newPaxCount) => {
    setPaxCount(newPaxCount);
  };

  // Format date untuk display
  const formatDisplayDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = useCallback((price) => {
    if (!price || price === 0 || price === null) return "Price not available";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  const calculateDuration = useCallback((date_start, date_end) => {
    try {
      const start = new Date(date_start);
      const end = new Date(date_end);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return e;
    }
  }, []);

  const parsePrice = useCallback((priceString) => {
    if (!priceString) return 0;
    const numericPrice = parseFloat(priceString.toString().replace(/[^0-9]/g, ""));
    return isNaN(numericPrice) ? 0 : numericPrice;
  }, []);

  // Map ships data to UI format
  const mappedTrips = useMemo(() => {
    if (!Array.isArray(ships)) return [];

    const expandedTrips = [];

    ships
      .filter((ship) => {
        const shipType = ship.type?.toLowerCase() || "";
        const filterType = tripType === "Private Trip" ? "private" : "open";
        return shipType.includes(filterType);
      })
      .forEach((ship) => {
        // Default: at least one "virtual" schedule if none exist
        const schedulesToUse = ship.schedules && ship.schedules.length > 0 ? ship.schedules : [{ name: "Trip", _id: "default" }];

        schedulesToUse.forEach((schedule) => {
          // Calculate durations from cabins or fallback
          let durations = [];
          if (ship.cabins && Array.isArray(ship.cabins) && ship.cabins.length > 0) {
            const cabinDurations = ship.cabins.map((cabin) => calculateDuration(cabin.date_start, cabin.date_end)).filter((days) => days > 0);
            if (cabinDurations.length > 0) {
              durations = [...new Set(cabinDurations)];
            }
          }

          if (durations.length === 0) {
            // Try to infer from schedule name like "3 Days 2 Nights"
            const daysMatch = schedule.name?.match(/(\d+)\s*Days?/i);
            const durationFromName = daysMatch ? parseInt(daysMatch[1], 10) : 3;
            durations = [durationFromName];
          }

          // Min price logic
          let minPrice = ship.minPrice;
          if (!minPrice && ship.cabins?.length > 0) {
            const cabinPrices = ship.cabins.map((cabin) => parsePrice(cabin.price)).filter((p) => p > 0);
            if (cabinPrices.length > 0) minPrice = Math.min(...cabinPrices);
          }
          minPrice = minPrice || 0;

          // Cheapest cabin
          const cheapestCabin =
            ship.cabins?.reduce((cheapest, cabin) => {
              const cabinPrice = parsePrice(cabin.price);
              return !cheapest || cabinPrice < parsePrice(cheapest.price) ? cabin : cheapest;
            }, null) || null;

          const durationDisplay = durations.map((days) => {
            if (days > 5) return "More Than 5 Days";
            return `${days} Day${days > 1 ? "s" : ""}`;
          });

          expandedTrips.push({
            id: `${ship._id}-${schedule._id}`, // Unique key per schedule
            shipId: ship._id,
            scheduleId: schedule._id,
            scheduleName: schedule.name || "Trip",
            type: ship.type?.includes("private") ? "Private Trip" : "Open Trip",
            title: ship.name,
            price: formatPrice(minPrice),
            minPrice: minPrice,
            operator: ship.merk || "Unknown Operator",
            duration: durationDisplay[0] || "3 Days",
            durations: durationDisplay,
            durationDays: Math.min(...durations),
            class: ship.class ? ship.class.charAt(0).toUpperCase() + ship.class.slice(1).toLowerCase() : "Standard",
            brand: ship.merk || "Unknown Brand",
            minPax: ship.min_pax || 0,
            maxPax: ship.max_pax || 0,
            cabins: ship.cabins || [],
            cheapestCabin: cheapestCabin,
            slug: ship.slug,
            status: ship.status,
            hasCabins: !!(ship.cabins && ship.cabins.length > 0),
            image: getImageUrl(ship.image_ship),
          });
        });
      });

    return expandedTrips;
  }, [ships, tripType, calculateDuration, parsePrice, formatPrice]);

  // Apply filters dengan date filter dan pax filter
  const filteredTrips = useMemo(() => {
    return mappedTrips.filter((trip) => {
      // Pax filter - ship harus bisa menampung jumlah pax yang diminta
      if (paxCount > 0) {
        if (trip.maxPax && paxCount > trip.maxPax) return false;
        if (trip.minPax && paxCount < trip.minPax) return false;
      }

      // Trip Duration filter - sesuai dengan format gambar
      if (filters.tripDuration.length > 0) {
        const hasMatchingDuration = trip.durations.some((duration) => filters.tripDuration.includes(duration));
        if (!hasMatchingDuration) return false;
      }

      // Class filter
      if (filters.classTrip.length > 0) {
        const tripClass = trip.class.charAt(0).toUpperCase() + trip.class.slice(1).toLowerCase();
        if (!filters.classTrip.includes(tripClass)) {
          return false;
        }
      }

      // Brand filter
      if (filters.shipBrand.length > 0 && !filters.shipBrand.includes(trip.brand)) {
        return false;
      }

      // Budget filter
      if (filters.budget.length > 0) {
        if (!trip.minPrice || trip.minPrice === 0) {
          return false;
        }

        const passesBudget = filters.budget.some((range) => {
          const budgetRange = getBudgetRange(range);
          return trip.minPrice >= budgetRange.min && trip.minPrice <= budgetRange.max;
        });
        if (!passesBudget) return false;
      }

      // DATE FILTER - Filter berdasarkan ketersediaan cabin pada tanggal yang dipilih
      if (selectedDates.startDate && selectedDates.endDate) {
        const hasAvailableCabins =
          trip.cabins &&
          trip.cabins.some((cabin) => {
            if (!cabin.date_start || !cabin.date_end) return false;

            const cabinStart = new Date(cabin.date_start);
            const cabinEnd = new Date(cabin.date_end);
            const selectedStart = new Date(selectedDates.startDate);
            const selectedEnd = new Date(selectedDates.endDate);

            // Cabin available jika ada overlap tanggal
            const hasOverlap = selectedStart <= cabinEnd && selectedEnd >= cabinStart;
            return hasOverlap;
          });

        if (!hasAvailableCabins) return false;
      }

      return true;
    });
  }, [mappedTrips, filters, selectedDates, paxCount]);

  // Sort trips berdasarkan pilihan user
  const sortedTrips = useMemo(() => {
    const trips = [...filteredTrips];

    switch (sortBy) {
      case "price-low":
        return trips.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
      case "price-high":
        return trips.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
      case "duration":
        return trips.sort((a, b) => (a.durationDays || 0) - (b.durationDays || 0));
      case "recommended":
      default:
        // Recommended: tersedia dulu, lalu harga terendah
        return trips.sort((a, b) => {
          if (a.hasCabins !== b.hasCabins) return b.hasCabins - a.hasCabins;
          return (a.minPrice || 0) - (b.minPrice || 0);
        });
    }
  }, [filteredTrips, sortBy]);

  // Close date picker ketika klik di luar
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest(".date-picker-container")) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <GuestLayout>
      <Breadcrumb />
      <div className="container mx-auto px-4">
        <h1 className="font-bold text-3xl mb-16">Book a Boat Rental in Raja Ampat</h1>

        {/* Trip Type Selector */}
        <div className="relative mb-8">
          <div className="absolute z-10 flex gap-2 -top-9 left-1/2 transform -translate-x-1/2 border border-gray-300 bg-white p-2 rounded-full">
            <button className={`px-6 py-3 rounded-full font-medium transition-colors ${tripType === "Open Trip" ? "bg-[#01A2A61F] text-primary" : "text-gray-500 hover:bg-gray-200"}`} onClick={() => handleTripTypeChange("Open Trip")}>
              Open Trip
            </button>
            <button className={`px-6 py-3 rounded-full font-medium transition-colors ${tripType === "Private Trip" ? "bg-[#01A2A61F] text-primary" : "text-gray-500 hover:bg-gray-200"}`} onClick={() => handleTripTypeChange("Private Trip")}>
              Private Trip
            </button>
          </div>

          {/* Date and Pax Picker */}
          <div className="border border-gray-300 rounded-xl p-6 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
              {/* Date Picker */}
              <div className="date-picker-container relative">
                <Calendar className="absolute left-3 top-3 z-10 text-gray-400" size={24} />
                <button onClick={() => setShowDatePicker(!showDatePicker)} className="w-full px-4 py-2.5 pl-12 border border-gray-300 rounded-xl text-left bg-white flex justify-between items-center hover:border-gray-400 transition-colors">
                  <span className={`${selectedDates.startDate ? "text-gray-900" : "text-gray-500"}`}>
                    {selectedDates.startDate && selectedDates.endDate ? `${formatDisplayDate(selectedDates.startDate)} - ${formatDisplayDate(selectedDates.endDate)}` : "Select trip dates"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showDatePicker ? "rotate-180 text-gray-700" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showDatePicker && <DateRangePicker onChange={handleDateChange} initialStartDate={selectedDates.startDate} initialEndDate={selectedDates.endDate} />}
              </div>
              <GuestSelector value={paxCount} onChange={handlePaxChange} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter by</h3>
              </div>

              {/* Trip Duration Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Trip Duration</h4>
                <div className="space-y-3">
                  {filterOptions.tripDuration.map((d) => (
                    <label key={d} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={filters.tripDuration.includes(d)} onChange={() => handleFilterChange("tripDuration", d)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      <span className="text-gray-600 text-sm">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Class Trip Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Class Trip</h4>
                <div className="space-y-3">
                  {filterOptions.classTrip.map((c) => (
                    <label key={c} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={filters.classTrip.includes(c)} onChange={() => handleFilterChange("classTrip", c)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      <span className="text-gray-600 text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Budget Trip</h4>
                <div className="space-y-3">
                  {filterOptions.budget.map((b) => (
                    <label key={b} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={filters.budget.includes(b)} onChange={() => handleFilterChange("budget", b)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      <span className="text-gray-600 text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ship Brand Filter */}
              {filterOptions.shipBrand.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-700 mb-4">Ship Brand</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {filterOptions.shipBrand.map((b) => (
                      <label key={b} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={filters.shipBrand.includes(b)} onChange={() => handleFilterChange("shipBrand", b)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="text-gray-600 text-sm">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trip Listings */}
          <div className="lg:col-span-3 mb-12">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading available trips...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load trips</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {(filters.tripDuration.length > 0 || filters.classTrip.length > 0 || filters.budget.length > 0 || filters.shipBrand.length > 0 || selectedDates.startDate || selectedDates.endDate || paxCount > 1) && (
                  <button onClick={clearFilters} className="text-sm text-white bg-primary px-3 py-1 rounded-full hover:opacity-50 font-medium flex items-center justify-between gap-1">
                    <X size={18} />
                    Clear All
                  </button>
                )}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-md text-gray-800">
                    {sortedTrips.length} {sortedTrips.length === 1 ? "result" : "results"} found
                    {selectedDates.startDate && selectedDates.endDate && ` for selected dates`}
                    {paxCount > 1 && ` for ${paxCount} people`}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                      <option value="recommended">Recommended</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>

                {sortedTrips.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedDates.startDate && selectedDates.endDate ? "No trips available for the selected dates. Try adjusting your dates or filters." : "Try adjusting your filters or search criteria"}
                    </p>
                    <button onClick={clearFilters} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedTrips.map((trip) => (
                      <Link
                        key={trip.id}
                        to={`/product/${trip.slug}`}
                        className={`bg-white rounded-2xl border border-gray-300 hover:shadow-sm transition-shadow duration-300 flex flex-col ${!trip.hasCabins ? "cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={(e) => {
                          if (!trip.hasCabins) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <div className="h-48 flex items-center justify-center relative rounded-4xl overflow-hidden">
                          <div className="p-2.5 w-full h-full">
                            <img
                              src={trip.image}
                              alt={trip.title}
                              className="w-full h-full rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                              }}
                            />
                          </div>
                        </div>

                        <div className="pl-4 pr-4 pb-4 pt-1">
                          <div className="mb-3">
                            <span className="text-sm font-medium rounded flex items-center gap-2 text-gray-400">
                              <Wallet size={20} />
                              {trip.type}
                            </span>
                          </div>

                          <div className="mb-3">
                            <span className="flex text-start font-bold text-gray-800 text-lg">{`${trip.scheduleName} ${trip.type} With ${trip.title}`}</span>
                          </div>

                          <div className="mb-3">
                            <p className="flex text-start text-sm text-gray-400">Starting from</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold">
                                {trip.price}
                                <span className="font-semibold">
                                  /<span className="text-sm font-bold">person</span>
                                </span>
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-sm flex items-center gap-2 text-gray-500">
                              <img src={IconFerry} alt="Icon Tripnesia" />
                              {trip.title}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Index;
