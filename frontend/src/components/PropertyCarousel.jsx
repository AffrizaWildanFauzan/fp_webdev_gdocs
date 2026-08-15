import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const PropertyCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-dark-700 rounded-xl h-96 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Carousel */}
      <div className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-dark-700">
        <div className="relative h-[400px] md:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(currentIndex)}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-dark-800/80 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors"
            >
              <FaChevronLeft className="text-secondary-600 dark:text-gray-300" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-dark-800/80 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-dark-700 transition-colors"
            >
              <FaChevronRight className="text-secondary-600 dark:text-gray-300" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-3xl hover:text-primary-500 transition-colors"
            >
              <FaTimes />
            </button>

            <div className="relative max-w-6xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[lightboxIndex]}
                alt=""
                className="w-full h-[80vh] object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white transition-colors"
                  >
                    <FaChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => {
                      setLightboxIndex((prev) => (prev + 1) % images.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white transition-colors"
                  >
                    <FaChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyCarousel;