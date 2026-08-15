import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaEnvelope, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/dashboard/properties', label: 'Properti', icon: FaBuilding },
    { to: '/dashboard/inquiries', label: 'Inquiries', icon: FaEnvelope },
    { to: '/dashboard/profile', label: 'Profile', icon: FaUser },
    { to: '/dashboard/settings', label: 'Settings', icon: FaCog },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 hidden md:block">
          <div className="p-4 border-b border-gray-200 dark:border-dark-700">
            <Link to="/" className="font-heading text-xl font-bold">
              <span className="text-primary-500">Real</span>Estate
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.to)
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full mt-4"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Selamat datang, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaHome />
              </Link>
              <button
                onClick={logout}
                className="md:hidden text-red-500 hover:text-red-600"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;