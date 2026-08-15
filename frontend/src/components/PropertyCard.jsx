import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import { FiEye, FiShare2 } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usePropertyStore } from '../store/propertyStore';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, index }) => {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = usePropertyStore();
  const [isWishlisted, setIsWishlisted] = useState(
    wishlist.includes(property._id)
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save to wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toggleWishlist(property._id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const getStatusBadge = () => {
    const badges = [];
    if (property.featured) badges.push({ label: 'Featured', color: 'bg-primary-500' });
    if (property.isNew) badges.push({ label: 'New', color: 'bg-green-500' });
    if (property.isHotDeal) badges.push({ label: 'Hot Deal', color: 'bg-red-500' });
    return badges;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative card-shadow overflow-hidden"
    >
      <Link to={`/properties/${property._id}`}>
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={property.images?.[0] || '/images/placeholder.jpg'}
            alt={property.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {getStatusBadge().map((badge, i) => (
              <span
                key={i}
                className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded shadow-lg`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          {/* Status */}
          <div className="absolute top-3 right-3">
            <span className={`${
              property.status === 'jual' 
                ? 'bg-blue-600' 
                : 'bg-green-600'
            } text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
              {property.status === 'jual' ? 'Dijual' : 'Disewa'}
            </span>
          </div>

          {/* Floating buttons */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={handleWishlist}
              className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 text-lg animate-heart-beat" />
              ) : (
                <FaRegHeart className="text-gray-600 dark:text-gray-300 text-lg" />
              )}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toast.success('Shared!'); }}
              className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <FiShare2 className="text-gray-600 dark:text-gray-300 text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading text-lg font-bold line-clamp-1 group-hover:text-primary-500 transition-colors text-gray-900 dark:text-white">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-yellow-500">
              <span>★</span>
              <span>{property.rating?.toFixed(1) || '0'}</span>
              <span className="text-gray-400">({property.totalReviews || 0})</span>
            </div>
          </div>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
            <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.location?.address}</span>
          </div>

          <div className="text-2xl font-bold text-primary-500 mb-3">
            {formatPrice(property.price)}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
              {property.status === 'jual' ? '' : '/bulan'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FaBed className="text-primary-500" />
              <span>{property.specifications?.bedrooms || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBath className="text-primary-500" />
              <span>{property.specifications?.bathrooms || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaRulerCombined className="text-primary-500" />
              <span>{property.specifications?.buildingSize || 0} m²</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <FiEye className="text-gray-400" />
              <span className="text-gray-400">{property.views || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
