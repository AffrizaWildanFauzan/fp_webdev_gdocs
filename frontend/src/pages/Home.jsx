import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight, FaBuilding, FaUsers, FaShieldAlt, FaClock } from 'react-icons/fa';
import { usePropertyStore } from '../store/propertyStore';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const { properties, fetchProperties } = usePropertyStore();

  useEffect(() => {
    fetchProperties(1);
  }, []);

  const featuredProperties = properties.filter(p => p.featured).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-4">
              Temukan Properti <br />
              <span className="text-primary-500">Impian Anda</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Platform properti terpercaya untuk mencari, menjual, dan menyewa properti dengan mudah.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/properties" className="btn-primary text-lg px-8 py-4">
                Cari Properti
                <FaArrowRight className="inline ml-2" />
              </Link>
              <Link to="/about" className="btn-outline border-white text-white hover:bg-white hover:text-secondary-500 text-lg px-8 py-4">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container-custom -mt-8 relative z-20">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Cari properti, lokasi..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-transparent"
              />
            </div>
            <select className="px-4 py-3 border border-gray-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-transparent">
              <option value="">Tipe Properti</option>
              <option value="rumah">Rumah</option>
              <option value="apartemen">Apartemen</option>
              <option value="villa">Villa</option>
              <option value="tanah">Tanah</option>
              <option value="ruko">Ruko</option>
            </select>
            <select className="px-4 py-3 border border-gray-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-transparent">
              <option value="">Status</option>
              <option value="jual">Dijual</option>
              <option value="sewa">Disewa</option>
            </select>
            <button className="btn-primary flex items-center justify-center gap-2">
              <FaSearch />
              Cari
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: FaBuilding, label: 'Properti Aktif', value: '1,234+' },
            { icon: FaUsers, label: 'Agen Terpercaya', value: '89+' },
            { icon: FaShieldAlt, label: 'Transaksi Aman', value: '99.9%' },
            { icon: FaClock, label: 'Respons Cepat', value: '24/7' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-shadow p-6 text-center"
            >
              <stat.icon className="text-3xl text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h2 className="font-heading text-3xl font-bold">Properti Unggulan</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Pilihan properti terbaik untuk Anda</p>
            </div>
            <Link to="/properties" className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
              Lihat Semua
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property._id} property={property} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl font-bold">Mengapa Memilih Kami?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Layanan terbaik untuk kebutuhan properti Anda</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔒',
              title: 'Transaksi Aman',
              description: 'Sistem keamanan terenkripsi untuk melindungi data dan transaksi Anda.'
            },
            {
              icon: '⚡',
              title: 'Proses Cepat',
              description: 'Proses pencarian dan transaksi yang cepat dan efisien.'
            },
            {
              icon: '🏆',
              title: 'Agen Berpengalaman',
              description: 'Agen properti profesional dengan pengalaman bertahun-tahun.'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-shadow p-6 text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-heading text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;