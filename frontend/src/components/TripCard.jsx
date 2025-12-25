import { Briefcase, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import FerryIcons from "../assets/icons/Ferry-Boat.svg";
import { getImageUrl } from "../lib/getImageUrl";
import { formatPrice } from "../lib/formatPrice";

const TripCard = ({ trip }) => {
  const [lowestPrice, setLowestPrice] = useState(null);

  useEffect(() => {
    if (trip.cabins && trip.cabins.length > 0) {
      const minPrice = trip.cabins.reduce((min, cabin) => {
        const price = parseInt(cabin.price);
        return price < min ? price : min;
      }, Infinity);

      setLowestPrice(minPrice !== Infinity ? minPrice : null);
    }
  }, [trip.cabins]);

  // Ambil nama schedule pertama jika ada
  const scheduleName = trip.schedules && trip.schedules.length > 0 
    ? trip.schedules[0].name 
    : "3 Days 2 Nights";

  return (
    <div className="bg-white rounded-xl hover:shadow-md overflow-hidden border border-gray-300 w-72 flex-shrink-0">
      <div className="relative">
        <img 
          src={getImageUrl(trip.image_ship)} 
          alt={trip.name} 
          className="w-full h-48 object-cover p-2.5 rounded-3xl" 
        />
        {/* <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition">
          <Heart className="w-5 h-5 text-red-500" />
        </button> */}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500 capitalize">{trip.type}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 leading-5.5 capitalize">
          {scheduleName} {trip.type} With {trip.name}
        </h3>
        <div className="mb-3 leading-5.5">
          <span className="text-sm text-gray-500">Starting from</span>
          <br />
          <p className="font-semibold">{formatPrice(lowestPrice)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <img src={FerryIcons} alt="Icons" />
          <span>{trip.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;  