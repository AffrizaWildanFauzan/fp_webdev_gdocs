import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaUsers, FaShieldAlt, FaClock, FaRocket, FaAward } from 'react-icons/fa';

const About = () => {
  const features = [
    { icon: FaBuilding, title: 'Properti Berkualitas', desc: 'Kami hanya menampilkan properti terbaik dari agen terpercaya' },
    { icon: FaUsers, title: 'Agen Profesional', desc: 'Agen kami berpengalaman dan siap membantu Anda' },
    { icon: FaShieldAlt, title: 'Transaksi Aman', desc: 'Sistem keamanan terenkripsi untuk transaksi Anda' },
    { icon: FaClock, title: 'Respons Cepat', desc: 'Layanan 24/7 untuk kebutuhan properti Anda' },
    { icon: FaRocket, title: 'Inovatif', desc: 'Menggunakan teknologi terkini untuk kemudahan Anda' },
    { icon: FaAward, title: 'Terpercaya', desc: 'Telah dipercaya oleh ribuan pelanggan' },
  ];

  return (
    <div className="min-h-screen">
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl font-bold">Tentang Kami</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Platform properti terpercaya yang menghubungkan pembeli dengan properti impian mereka
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
              alt="About"
              className="rounded-xl shadow-lg w-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-heading text-2xl font-bold mb-4">Misi Kami</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Memberikan pengalaman terbaik dalam mencari, menjual, dan menyewa properti.
              Kami berkomitmen untuk menghadirkan platform yang transparan, aman, dan mudah digunakan.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Dengan dukungan agen properti profesional dan teknologi terkini,
              kami membantu Anda menemukan properti impian dengan mudah.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-shadow p-6 text-center"
            >
              <feature.icon className="text-4xl text-primary-500 mx-auto mb-3" />
              <h3 className="font-heading text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default About;