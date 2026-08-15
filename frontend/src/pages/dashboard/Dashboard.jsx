import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaEye, FaEnvelope, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    properties: [],
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/agents/stats');
      setStats(data);
    } catch (error) {
      toast.error('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const statCards = [
    { icon: FaBuilding, label: 'Total Properti', value: stats.totalProperties, color: 'text-blue-500', link: '/dashboard/properties' },
    { icon: FaEye, label: 'Total Views', value: stats.totalViews, color: 'text-green-500' },
    { icon: FaEnvelope, label: 'Total Inquiries', value: stats.totalInquiries, color: 'text-purple-500', link: '/dashboard/inquiries' },
    { icon: FaChartLine, label: 'Rata-rata Views', value: stats.totalProperties > 0 ? Math.round(stats.totalViews / stats.totalProperties) : 0, color: 'text-orange-500' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Selamat datang kembali, {user?.name}! Berikut ringkasan properti Anda.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-shadow p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`text-2xl ${stat.color}`} />
            </div>
            {stat.link && (
              <Link to={stat.link} className="text-xs text-primary-500 hover:underline mt-2 inline-block">
                Lihat Detail <FaArrowRight className="inline ml-1" size={10} />
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link to="/dashboard/properties/add" className="card-shadow p-4 hover:shadow-xl transition-shadow flex items-center gap-4">
          <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
            <FaBuilding className="text-primary-500 text-xl" />
          </div>
          <div>
            <h4 className="font-semibold">Tambah Properti</h4>
            <p className="text-sm text-gray-500">Tambahkan properti baru ke marketplace</p>
          </div>
        </Link>
        <Link to="/dashboard/inquiries" className="card-shadow p-4 hover:shadow-xl transition-shadow flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <FaEnvelope className="text-purple-500 text-xl" />
          </div>
          <div>
            <h4 className="font-semibold">Lihat Inquiries</h4>
            <p className="text-sm text-gray-500">Kelola pertanyaan dari pembeli</p>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-shadow p-4"
        >
          <h3 className="font-heading text-lg font-bold mb-4">Views per Bulan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-shadow p-4"
        >
          <h3 className="font-heading text-lg font-bold mb-4">Inquiries per Bulan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="inquiries" stroke="#1A2A3A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-shadow p-4 mt-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading text-lg font-bold">Properti Terbaru</h3>
          <Link to="/dashboard/properties" className="text-sm text-primary-500 hover:underline">
            Lihat Semua →
          </Link>
        </div>
        {stats.properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-2 px-3">Judul</th>
                  <th className="text-left py-2 px-3">Harga</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.properties.slice(0, 5).map((prop) => (
                  <tr key={prop._id} className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="py-2 px-3">{prop.title}</td>
                    <td className="py-2 px-3">{formatPrice(prop.price)}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prop.statusProperty === 'tersedia' ? 'bg-green-100 text-green-700' :
                        prop.statusProperty === 'terjual' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {prop.statusProperty}
                      </span>
                    </td>
                    <td className="py-2 px-3">{prop.views || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Belum ada properti.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;