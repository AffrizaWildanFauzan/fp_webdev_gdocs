import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Pesan berhasil dikirim!');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const contacts = [
    { icon: FaMapMarkerAlt, label: 'Alamat', value: 'Jl. Contoh No. 123, Jakarta' },
    { icon: FaPhone, label: 'Telepon', value: '+62 812 3456 7890' },
    { icon: FaEnvelope, label: 'Email', value: 'info@realestate.com' },
    { icon: FaClock, label: 'Jam Operasional', value: 'Senin - Jumat, 08:00 - 17:00' },
  ];

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-heading text-4xl font-bold">Hubungi Kami</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Kami siap membantu Anda
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-shadow p-6"
        >
          <h2 className="font-heading text-2xl font-bold mb-4">Kirim Pesan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subjek</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pesan</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary"
            >
              {submitting ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {contacts.map((item, index) => (
            <div key={index} className="card-shadow p-4 flex items-start gap-4">
              <item.icon className="text-primary-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold">{item.label}</h4>
                <p className="text-gray-500 dark:text-gray-400">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="card-shadow p-4">
            <h4 className="font-semibold mb-2">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">Facebook</a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-primary-500 transition-colors">Instagram</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;