import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
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
          <h2 className="font-heading text-3xl font-bold">Login</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Masuk ke akun Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-center"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary-500 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Akun demo:</p>
          <p>agent@realestate.com / password123</p>
          <p>user@realestate.com / password123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;