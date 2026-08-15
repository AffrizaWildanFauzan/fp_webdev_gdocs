import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaPhone, FaCalendarAlt, FaCheck, FaClock } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate, formatRelativeTime } from '../../utils/helpers';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiries/agent');
      setInquiries(data.data);
    } catch (error) {
      toast.error('Gagal memuat inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      toast.success('Status updated');
      fetchInquiries();
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      read: 'bg-blue-100 text-blue-700',
      responded: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 skeleton w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-heading text-xl font-bold mb-6">
        Inquiries ({inquiries.length})
      </h3>

      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <motion.div
              key={inquiry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-shadow p-4"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 font-bold text-sm flex-shrink-0">
                      {inquiry.name?.[0] || '?'}
                    </div>
                    <div>
                      <h4 className="font-semibold">{inquiry.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-xs" />
                          {inquiry.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-xs" />
                          {inquiry.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" />
                          {formatRelativeTime(inquiry.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {inquiry.message}
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Property:</span>
                        <a
                          href={`/properties/${inquiry.propertyId?._id}`}
                          className="ml-1 text-primary-500 hover:underline"
                        >
                          {inquiry.propertyId?.title || 'N/A'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                  {inquiry.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(inquiry._id, 'read')}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      <FaCheck className="inline mr-1" /> Mark Read
                    </button>
                  )}
                  {inquiry.status === 'read' && (
                    <button
                      onClick={() => updateStatus(inquiry._id, 'responded')}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                    >
                      <FaCheck className="inline mr-1" /> Mark Responded
                    </button>
                  )}
                  {(inquiry.status === 'pending' || inquiry.status === 'read') && (
                    <button
                      onClick={() => {
                        window.location.href = `mailto:${inquiry.email}`;
                      }}
                      className="text-xs bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada inquiries</p>
        </div>
      )}
    </div>
  );
};

export default Inquiries;