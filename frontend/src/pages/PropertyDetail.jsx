import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaHeart, FaRegHeart, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaShare, FaCalendar, FaBuilding, FaShieldAlt, FaPhone, FaEnvelope, FaWhatsapp, FaStar, FaUser } from 'react-icons/fa';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usePropertyStore } from '../store/propertyStore';
import toast from 'react-hot-toast';
import PropertyCarousel from '../components/PropertyCarousel';
import PropertyMap from '../components/PropertyMap';
import MortgageCalculator from '../components/MortgageCalculator';
import ReviewSystem from '../components/ReviewSystem';
import LoadingSkeleton from '../components/LoadingSkeleton';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = usePropertyStore();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const isWishlisted = wishlist.includes(id);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/properties/${id}`);
      setProperty(data.data);
      setReviews(data.reviews || []);
      if (user) {
        setInquiryData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        }));
      }
    } catch (error) {
      toast.error('Gagal memuat properti');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }
    toggleWishlist(id);
    toast.success(isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/inquiries', {
        propertyId: id,
        ...inquiryData,
      });
      toast.success('Pertanyaan berhasil dikirim!');
      setShowInquiryForm(false);
      setInquiryData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim pertanyaan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="detail" />;
  }

  if (!property) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Properti Tidak Ditemukan</h2>
        <Link to="/properties" className="btn-primary inline-block mt-4">
          Kembali ke Daftar Properti
        </Link>
      </div>
    );
  }

  const images = property.images || [];

  return (
    <>
      <Helmet>
        <title>{property.title} - Real Estate Marketplace</title>
        <meta name="description" content={property.description?.slice(0, 160)} />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/" className="hover:text-primary-500">Beranda</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary-500">Properti</Link>
            <span>/</span>
            <span className="text-primary-500">{property.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-2">
              {/* Gallery */}
              <PropertyCarousel images={images} title={property.title} />

              {/* Description */}
              <div className="mt-8">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Deskripsi</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Map */}
              <div className="mt-8">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Lokasi</h2>
                <PropertyMap 
                  properties={[property]} 
                  center={[property.location?.coordinates?.lat || -6.2, property.location?.coordinates?.lng || 106.8]} 
                />
              </div>

              {/* Specifications */}
              <div className="mt-8">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Spesifikasi</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: FaBuilding, label: 'Tipe', value: property.type },
                    { icon: FaRulerCombined, label: 'Luas Tanah', value: `${property.specifications?.landSize || 0} m²` },
                    { icon: FaRulerCombined, label: 'Luas Bangunan', value: `${property.specifications?.buildingSize || 0} m²` },
                    { icon: FaBed, label: 'Kamar Tidur', value: property.specifications?.bedrooms || 0 },
                    { icon: FaBath, label: 'Kamar Mandi', value: property.specifications?.bathrooms || 0 },
                    { icon: FaCalendar, label: 'Tahun Dibangun', value: property.specifications?.yearBuilt || '-' },
                    { icon: FaShieldAlt, label: 'Sertifikat', value: property.specifications?.certificateType || '-' },
                    { icon: FaBuilding, label: 'Kondisi', value: property.specifications?.condition || '-' },
                  ].map((spec, i) => (
                    <div key={i} className="card-shadow p-4">
                      <spec.icon className="text-primary-500 text-xl mb-1" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">{spec.label}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              {property.facilities?.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Fasilitas</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.facilities.map((facility, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="mt-8">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Ulasan</h2>
                <ReviewSystem 
                  propertyId={id} 
                  reviews={reviews} 
                  onReviewAdded={fetchProperty}
                />
              </div>
            </div>

            {/* Right Column - Info & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price & Status */}
                <div className="card-shadow p-6">
                  <div className="text-3xl font-bold text-primary-500">
                    {formatPrice(property.price)}
                    {property.status === 'sewa' && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/bulan</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      property.status === 'jual' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {property.status === 'jual' ? 'Dijual' : 'Disewa'}
                    </span>
                    {property.featured && (
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full text-xs font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Mortgage Calculator */}
                <MortgageCalculator propertyPrice={property.price} />

                {/* Agent Info */}
                <div className="card-shadow p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-3">Agen Properti</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xl font-bold text-primary-500">
                      {property.agentId?.name?.[0] || 'A'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{property.agentId?.name || 'Agent'}</div>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        <FaStar />
                        <span>4.8</span>
                        <span className="text-gray-400">(123 ulasan)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FaPhone className="text-primary-500" />
                      <span>{property.agentId?.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FaEnvelope className="text-primary-500" />
                      <span>{property.agentId?.email || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = `https://wa.me/62${property.agentId?.phone || ''}`}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp />
                    Hubungi via WhatsApp
                  </button>
                  <button
                    onClick={() => setShowInquiryForm(!showInquiryForm)}
                    className="w-full btn-primary"
                  >
                    Kirim Pertanyaan
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleWishlist}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${
                        isWishlisted
                          ? 'bg-red-50 border-red-500 text-red-500 dark:bg-red-900/20'
                          : 'border-gray-300 hover:border-primary-500 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {isWishlisted ? <FaHeart className="text-red-500 animate-heart-beat" /> : <FaRegHeart />}
                      {isWishlisted ? 'Disukai' : 'Sukai'}
                    </button>
                    <button
                      onClick={() => { toast.success('Tautan disalin!'); }}
                      className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 hover:border-primary-500 dark:border-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <FaShare />
                      Bagikan
                    </button>
                  </div>
                </div>

                {/* Inquiry Form */}
                {showInquiryForm && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-shadow p-4 space-y-3"
                    onSubmit={handleInquiry}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white">Kirim Pertanyaan</h4>
                    <input
                      type="text"
                      placeholder="Nama"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Nomor Telepon"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <textarea
                      placeholder="Pesan..."
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary"
                    >
                      {submitting ? 'Mengirim...' : 'Kirim'}
                    </button>
                  </motion.form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
