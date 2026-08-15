import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-500 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">
              <span className="text-primary-500">Real</span>Estate
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform properti terpercaya untuk mencari, menjual, dan menyewa properti dengan mudah.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties" className="text-gray-300 hover:text-primary-500 transition-colors">Cari Properti</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary-500 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary-500 transition-colors">Hubungi Kami</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-primary-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Untuk Pengguna</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="text-gray-300 hover:text-primary-500 transition-colors">Daftar Akun</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-primary-500 transition-colors">Login</Link></li>
              <li><Link to="/wishlist" className="text-gray-300 hover:text-primary-500 transition-colors">Wishlist</Link></li>
              <li><Link to="/compare" className="text-gray-300 hover:text-primary-500 transition-colors">Bandingkan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300">
                <FaMapMarkerAlt className="text-primary-500 mt-1" />
                <span>Jl. Jenderal Sudirman Kav. 52-52, SCBD, Jakarta Selatan 12190</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaPhone className="text-primary-500" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <FaEnvelope className="text-primary-500" />
                <span>cs@realestate.co.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} RealEstate Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;