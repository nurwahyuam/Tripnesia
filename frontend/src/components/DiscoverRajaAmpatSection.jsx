import React from 'react';
import RajaAmpatCard from './RajaAmpatCard';

const DiscoverRajaAmpatSection = () => {
  const destinations = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Pianemo Hill: A Piece of Heaven in Raja Ampat, West Papua",
      description: "Hike to the iconic viewpoint and witness the breathtaking panorama of countless islands scattered across turquoise waters."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1589308078499-cd0b155245f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Blue River: Raja Ampat’s Hidden Gem",
      description: "At Blue River, you can swim in crystal-clear turquoise waters and relax in the lush jungle surroundings."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Pianemo Hill: A Piece of Heaven in Raja Ampat, West Papua",
      description: "Explore the hidden coves and snorkel among vibrant coral reefs that make this area a diver's paradise."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1503950880713-7798e1254483?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Pianemo Hill: A Piece of Heaven in Raja Ampat, West Papua",
      description: "Stand on the cliff edge and feel the sea breeze while taking in views that look like they’re straight out of a postcard."
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Discover More about Raja Ampat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <RajaAmpatCard
              key={dest.id}
              image={dest.image}
              title={dest.title}
              description={dest.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverRajaAmpatSection;