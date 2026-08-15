import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ReviewSystem = ({ propertyId, reviews: initialReviews, onReviewAdded }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }
    if (rating === 0) {
      toast.error('Berikan rating terlebih dahulu');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/reviews/${propertyId}`, { rating, comment });
      const newReviews = [data.data, ...reviews];
      setReviews(newReviews);
      setRating(0);
      setComment('');
      setShowForm(false);
      toast.success('Review berhasil ditambahkan!');
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500">
            {averageRating > 0 ? averageRating.toFixed(1) : '0'}
          </div>
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'} />
            ))}
          </div>
          <div className="text-sm text-gray-500">{reviews.length} ulasan</div>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4">{star}</span>
                <FaStar className="text-yellow-500 text-xs" />
                <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-500 text-xs w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Button */}
      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-sm"
        >
          Tulis Ulasan
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-shadow p-4"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Tulis Ulasan</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-2xl transition-colors"
              >
                <FaStar
                  className={
                    star <= (hoverRating || rating)
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-300'
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating > 0 ? `${rating} bintang` : 'Klik untuk rating'}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan pengalaman Anda..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 min-h-[100px]"
            required
          />

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm"
            >
              {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-sm"
            >
              Batal
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 dark:border-dark-700 pb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 font-bold text-sm flex-shrink-0">
                {review.userId?.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h5 className="font-semibold">{review.userId?.name || 'User'}</h5>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'} size={12} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        <FaCalendarAlt className="inline mr-1" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Belum ada ulasan. Jadilah yang pertama!
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;