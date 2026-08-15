import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice, formatDate } from '../../utils/helpers';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await api.get('/agents/properties');
      setProperties(data.data);
    } catch (error) {
      toast.error('Gagal memuat properti');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus properti ini?')) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success('Properti berhasil dihapus');
      fetchProperties();
    } catch (error) {
      toast.error('Gagal menghapus properti');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 skeleton w-1/4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading text-xl font-bold">Properti Saya</h3>
        <Link to="/dashboard/properties/add" className="btn-primary text-sm flex items-center gap-2">
          <FaPlus />
          Tambah Properti
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700">
                <th className="text-left py-3 px-3">Judul</th>
                <th className="text-left py-3 px-3">Harga</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-left py-3 px-3">Views</th>
                <th className="text-left py-3 px-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="py-3 px-3">
                    <div>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-xs text-gray-500">{formatDate(property.createdAt)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-primary-500">
                    {formatPrice(property.price)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.statusProperty === 'tersedia' ? 'bg-green-100 text-green-700' :
                      property.statusProperty === 'terjual' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {property.statusProperty}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <FaEye className="text-gray-400" />
                      {property.views || 0}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/dashboard/properties/edit/${property._id}`}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada properti</p>
          <Link to="/dashboard/properties/add" className="btn-primary inline-block mt-4">
            Tambah Properti Pertama
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProperties;