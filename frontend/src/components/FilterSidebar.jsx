import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { usePropertyStore } from '../store/propertyStore';

const PROPERTY_TYPES = [
  { value: 'rumah', label: 'Rumah' },
  { value: 'apartemen', label: 'Apartemen' },
  { value: 'villa', label: 'Villa' },
  { value: 'tanah', label: 'Tanah' },
  { value: 'ruko', label: 'Ruko' },
];

const FACILITIES = [
  'AC', 'Kolam Renang', 'Garasi', 'Taman', 'Keamanan 24 Jam',
  'Parkir', 'Furnished', 'Jemuran', 'Dapur', 'Kulkas',
  'TV', 'Internet', 'Air Panas'
];

const FilterSidebar = ({ isOpen, onClose }) => {
  const { filters, setFilters, fetchProperties } = usePropertyStore();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTypeToggle = (type) => {
    const currentTypes = localFilters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setLocalFilters(prev => ({ ...prev, type: newTypes }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    fetchProperties(1);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      type: [],
      status: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      sort: '-createdAt',
      search: '',
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    fetchProperties(1);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -380 }}
        animate={{ x: isOpen ? 0 : -380 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed top-0 left-0 h-full w-[380px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilter className="text-primary-500" />
            <h2 className="font-heading text-xl font-bold">Filter</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Property Type */}
          <div>
            <h3 className="font-semibold mb-2">Tipe Properti</h3>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localFilters.type?.includes(type.value)}
                    onChange={() => handleTypeToggle(type.value)}
                    className="rounded text-primary-500 focus:ring-primary-500"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="flex gap-2">
              {['jual', 'sewa'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleChange('status', localFilters.status === status ? '' : status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    localFilters.status === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'jual' ? 'Dijual' : 'Disewa'}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-2">Rentang Harga</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Min</label>
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) => handleChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Max</label>
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Kamar Tidur</h3>
              <select
                value={localFilters.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Kamar Mandi</h3>
              <select
                value={localFilters.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-2">Lokasi</h3>
            <input
              type="text"
              value={localFilters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Cari kota..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Facilities */}
          <div>
            <h3 className="font-semibold mb-2">Fasilitas</h3>
            <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
              {FACILITIES.map((facility) => (
                <label key={facility} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localFilters.facilities?.includes(facility)}
                    onChange={() => {
                      const current = localFilters.facilities || [];
                      const updated = current.includes(facility)
                        ? current.filter(f => f !== facility)
                        : [...current, facility];
                      handleChange('facilities', updated);
                    }}
                    className="rounded text-primary-500 focus:ring-primary-500"
                  />
                  {facility}
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-2">Urutkan</h3>
            <select
              value={localFilters.sort}
              onChange={(e) => handleChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="-createdAt">Terbaru</option>
              <option value="price">Harga Terendah</option>
              <option value="-price">Harga Tertinggi</option>
              <option value="-rating">Rating Tertinggi</option>
              <option value="-views">Paling Banyak Dilihat</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleApply}
              className="flex-1 btn-primary text-center"
            >
              Terapkan Filter
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default FilterSidebar;