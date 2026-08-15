import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/users/wishlist');
      setProperties(data.wishlist || []);
    } catch (error) {
      toast.error('Gagal memuat wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold">Login untuk Melihat Wishlist</h2>
        <p className="text-gray-500 mt-2">Simpan properti favorit Anda di sini</p>
        <Link to="/login" className="btn-primary inline-block mt-4">
          Login Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <FaHeart className="text-red-500 text-2xl" />
        <h1 className="font-heading text-3xl font-bold">Wishlist</h1>
        <span className="text-gray-500">({properties.length} properti)</span>
      </motion.div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={property._id} property={property} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-bold">Wishlist Kosong</h3>
          <p className="text-gray-500 mt-2">Belum ada properti yang disimpan</p>
          <Link to="/properties" className="btn-primary inline-block mt-4">
            Cari Properti
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;