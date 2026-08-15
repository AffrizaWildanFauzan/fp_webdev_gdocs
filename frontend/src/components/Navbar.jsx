import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaHeart, FaUser, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes, FaBuilding, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePropertyStore } from '../store/propertyStore';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { wishlist } = usePropertyStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Beranda', icon: FaHome },
    { to: '/properties', label: 'Properti', icon: FaBuilding },
    { to: '/wishlist', label: 'Wishlist', icon: FaHeart, badge: wishlist?.length },
  ];

  return (
    <nav className="glass-effect border-b border-gray-200 dark:border-dark-700 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-primary-500">Real</span>
            <span className="font-heading text-2xl font-bold text-secondary-500 dark:text-white">Estate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari properti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48 lg:w-64"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
              >
                <link.icon />
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                  Daftar
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-dark-700"
          >
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Cari properti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-dark-600 bg-transparent focus:ring-2 focus:ring-primary-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              <Link
                to="/about"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Tentang Kami</span>
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Hubungi Kami</span>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserCircle />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </>
              )}
              
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors w-full"
              >
                {isDark ? <FaSun /> : <FaMoon />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;