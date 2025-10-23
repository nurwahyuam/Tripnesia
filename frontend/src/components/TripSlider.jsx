import React, { useRef } from "react";
import TripCard from "./TripCard";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const TripSlider = ({ trips }) => {
  const {user} = useAuth();
  const sliderRef = useRef(null);

  console.log(user);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = 360; // width + margin
      const scrollAmount = cardWidth * 1;
      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = 360;
      const scrollAmount = cardWidth * 1;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative h-125">
      {/* Navigation Buttons */}
      <button onClick={scrollLeft} className="absolute -left-5 top-1/4 transform -translate-y-1/2 z-10 bg-white rounded-full text-primary hover:opacity-50 shadow-lg transition p-2 border border-[#29d9c2]">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={scrollRight} className="absolute -right-5 top-1/4 transform -translate-y-1/2 z-10 bg-white rounded-full text-primary hover:opacity-90 shadow-lg transition p-2 border border-[#29d9c2]">
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slider Container */}
      <div ref={sliderRef} className="trip-slider flex gap-8 py-4" style={{ scrollBehavior: "smooth" }}>
        {trips.map((trip, index) => (
          <TripCard key={index} trip={trip} />
        ))}
      </div>

      {/* Show More Button */}
      <div className="mt-6">
        <Link to={`${user === null  ? '/product' : '/customer/product'}`} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition flex items-center justify-center gap-3 w-1/7">
          <p>Show More</p>
          <MoveRight className="text-gray-700 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default TripSlider;
