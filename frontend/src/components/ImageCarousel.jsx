// components/ImageCarousel.jsx
import React, { useState } from "react";
import { getImageUrl } from "../lib/getImageUrl";

const ImageCarousel = ({ images, placeholder }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative h-48 overflow-hidden">
        <img src={placeholder} alt="No image" className="w-full h-full object-cover" />
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-72 overflow-hidden rounded-t-xl">
      {/* Gambar Aktif */}
      <img src={images[currentIndex]?.image_cabin_url ? getImageUrl(images[currentIndex].image_cabin_url) : placeholder} alt={`Cabin ${currentIndex + 1}`} className="w-full h-full object-cover transition-opacity duration-300" />

      {/* Tombol Navigasi */}
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition" aria-label="Previous image">
            ❮
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition" aria-label="Next image">
            ❯
          </button>

          {/* Indikator Titik */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-gray-400"}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </>
      )}

      {/* Jumlah Foto */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
