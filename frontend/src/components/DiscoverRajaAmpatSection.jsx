import React from "react";
import RajaAmpatCard from "./RajaAmpatCard";
import image2 from "../assets/Discover/1.png";
import image4 from "../assets/Discover/2.png";
import image1 from "../assets/Discover/3.png";
import image3 from "../assets/Discover/4.png";

const DiscoverRajaAmpatSection = () => {
  const destinations = [
    {
      id: 1,
      image: image1,
      title: "Pianemo Hill: A Piece of Heaven in Raja Ampat, West Papua",
      description: "Hike to the iconic viewpoint and witness the breathtaking panorama of karst islands surrounded by turquoise waters.",
    },
    {
      id: 2,
      image: image2,
      title: "Blue River: The Hidden Oasis of Raja Ampat",
      description: "Swim in the crystal-clear turquoise waters of Blue River, a serene spot tucked within lush tropical forests.",
    },
    {
      id: 3,
      image: image3,
      title: "Wayag Island: The Iconic Peaks of Raja Ampat",
      description: "Climb to the top of Wayag’s limestone hills and enjoy one of the most stunning views in Indonesia — a sea dotted with emerald islands.",
    },
    {
      id: 4,
      image: image4,
      title: "Pasir Timbul: The Vanishing Sand Island",
      description: "Visit this magical sandbar that appears only during low tide, surrounded by clear blue waters perfect for snorkeling.",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Discover More about Raja Ampat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <RajaAmpatCard key={dest.id} image={dest.image} title={dest.title} description={dest.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverRajaAmpatSection;
