import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaThLarge, FaList, FaHeart, FaBalanceScale } from 'react-icons/fa';
import { usePropertyStore } from '../store/propertyStore';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../services/api';
import toast from 'react-hot-toast';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { filters, setFilters, compare } = usePropertyStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const search = searchParams.get('q');
    if (search) {
      setFilters({ search });
    }
    loadProperties(1);
  }, []);

  const loadProperties = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/properties?page=${pageNum}&limit=10`);
      
      setPagination(data.pagination);
      
      const uniqueProperties = data.data.filter((prop, index, self) => 
        index === self.findIndex((p) => p._id === prop._id)
      );
      
      setProperties(prev => pageNum === 1 ? uniqueProperties : [...prev, ...uniqueProperties]);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Gagal memuat properti');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProperties(nextPage);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Properti</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Menampilkan {properties.length} dari {pagination?.total || 0} properti
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 mr-2">
              <Link
                to="/wishlist"
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaHeart />
                <span>Wishlist</span>
              </Link>
              {compare?.length > 0 && (
                <Link
                  to="/compare"
                  className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <FaBalanceScale />
                  <span>Compare ({compare.length})</span>
                </Link>
              )}
            </div>
            
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <FaFilter />
              Filter
            </button>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && page === 1 ? (
          <LoadingSkeleton type="card" count={6} />
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {properties.map((property, index) => (
                <PropertyCard 
                  key={`${property._id}-${index}`}
                  property={property} 
                  index={index} 
                />
              ))}
            </div>

            {properties.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tidak Ada Properti</h3>
                <p className="text-gray-500 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            )}

            {/* Load More */}
            {pagination && page < pagination.totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-primary px-8"
                >
                  {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default Properties;
