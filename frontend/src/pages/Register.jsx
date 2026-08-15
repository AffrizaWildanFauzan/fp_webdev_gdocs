import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    const { password, confirmPassword, ...userData } = formData;
    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full card-shadow p-8"
      >
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold">Daftar</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Buat akun baru
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

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
                placeholder="Nama Anda"
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
                placeholder="email@example.com"
                required
              />
            </div>
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
                placeholder="08123456789"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Daftar Sebagai</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">Pembeli/Penyewa</option>
              <option value="agent">Agen Properti</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-center"
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-500 hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;