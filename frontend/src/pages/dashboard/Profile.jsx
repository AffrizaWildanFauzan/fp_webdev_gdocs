import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      toast.success('Profile berhasil diupdate!');
      if (setUser) setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-3xl font-bold text-primary-500 mx-auto">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
            <FaCamera size={14} />
          </button>
        </div>
        <h2 className="font-heading text-2xl font-bold mt-4">{user?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              required
              disabled
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 min-h-[80px]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </motion.div>
  );
};

export default Profile;