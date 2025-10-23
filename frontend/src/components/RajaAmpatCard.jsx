import React, { useState } from 'react';

const RajaAmpatCard = ({ image, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden h-96 w-full cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gambar */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />

      {/* Overlay + Teks */}
      <div className={`absolute inset-0 bg-black/50 flex flex-col justify-end p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
        {/* Judul — selalu tampil */}
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>

        {/* Deskripsi — hanya muncul saat hover */}
        {isHovered && (
          <p className="text-white text-sm leading-tight opacity-90">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default RajaAmpatCard;