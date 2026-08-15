import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { formatPrice } from '../utils/helpers';

const CompareTool = ({ properties, onRemove, onClear }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-4xl mb-2">📊</p>
        <p>Belum ada properti untuk dibandingkan</p>
        <p className="text-sm">Tambahkan 2-4 properti dari daftar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-lg font-bold">
          Perbandingan Properti ({properties.length}/4)
        </h3>
        {properties.length > 0 && (
          <button
            onClick={onClear}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Hapus Semua
          </button>
        )}
      </div>

      <div className={`grid gap-4 ${properties.length === 2 ? 'grid-cols-2' : properties.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {properties.map((property, index) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card-shadow p-4 relative"
          >
            <button
              onClick={() => onRemove(property._id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTimes />
            </button>

            <img
              src={property.images?.[0] || '/images/placeholder.jpg'}
              alt={property.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />

            <h4 className="font-semibold text-sm line-clamp-1 mb-1">
              {property.title}
            </h4>

            <p className="text-primary-500 font-bold text-sm">
              {formatPrice(property.price)}
              {property.status === 'sewa' && <span className="text-xs font-normal text-gray-500">/bulan</span>}
            </p>

            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <FaMapMarkerAlt className="text-xs" />
                <span className="line-clamp-1">{property.location?.city || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex items-center gap-1">
                  <FaHome className="text-xs" />
                  <span>{property.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBed className="text-xs" />
                  <span>{property.specifications?.bedrooms || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBath className="text-xs" />
                  <span>{property.specifications?.bathrooms || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <FaRulerCombined className="text-xs" />
                <span>{property.specifications?.buildingSize || 0} m²</span>
              </div>
            </div>

            <a
              href={`/properties/${property._id}`}
              className="mt-3 block text-center text-xs text-primary-500 hover:underline"
            >
              Lihat Detail
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompareTool;