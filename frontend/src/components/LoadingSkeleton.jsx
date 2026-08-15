import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 6 }) => {
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card-shadow overflow-hidden"
          >
            <div className="h-48 skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-4 skeleton w-3/4" />
              <div className="h-3 skeleton w-1/2" />
              <div className="h-6 skeleton w-1/3" />
              <div className="flex gap-4">
                <div className="h-3 skeleton w-1/4" />
                <div className="h-3 skeleton w-1/4" />
                <div className="h-3 skeleton w-1/4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-[400px] skeleton rounded-xl" />
          <div className="mt-6 space-y-4">
            <div className="h-8 skeleton w-3/4" />
            <div className="h-4 skeleton w-1/2" />
            <div className="h-20 skeleton w-full" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card-shadow p-4 space-y-4">
            <div className="h-10 skeleton w-1/2" />
            <div className="h-20 skeleton w-full" />
            <div className="h-12 skeleton w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-shadow p-4">
              <div className="h-4 skeleton w-1/2" />
              <div className="h-8 skeleton w-1/3 mt-2" />
            </div>
          ))}
        </div>
        <div className="card-shadow p-4">
          <div className="h-64 skeleton" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;