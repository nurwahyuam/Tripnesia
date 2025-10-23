import { Briefcase, Heart } from "lucide-react";
import React from "react";
import FerryIcons from "../assets/icons/Ferry-Boat.svg" 

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-xl hover:shadow-md overflow-hidden border border-gray-300 w-72 flex-shrink-0">
      <div className="relative">
        <img src={trip.image} alt={trip.title} className="w-full h-48 object-cover p-2.5 rounded-3xl" />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition">
          <Heart className="w-5 h-5 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">{trip.type}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 leading-5.5">{trip.title}</h3>
        <div></div>
        <div className=" mb-3 leading-5.5">
          <span className="text-sm text-gray-500">Starting from</span>
          <br />
          <p className="font-semibold">{trip.price}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
         <img src={FerryIcons} alt="Icons" />
          <span>{trip.operator}</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
