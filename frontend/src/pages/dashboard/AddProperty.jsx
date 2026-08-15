import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import toast from 'react-hot-toast';

const propertySchema = z.object({
  title: z.string().min(3, 'Title minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  type: z.string().min(1, 'Pilih tipe properti'),
  status: z.string().min(1, 'Pilih status'),
  price: z.number().min(1, 'Harga harus diisi'),
  location: z.object({
    address: z.string().min(1, 'Alamat harus diisi'),
    city: z.string().min(1, 'Kota harus diisi'),
    province: z.string().min(1, 'Provinsi harus diisi'),
  }),
  specifications: z.object({
    landSize: z.number().optional(),
    buildingSize: z.number().optional(),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
  }),
});

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'jual',
      type: 'rumah',
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
      },
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Add images to data
      const propertyData = {
        ...data,
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c4c3d9?w=800',
        ],
        facilities: ['AC', 'Garasi', 'Taman', 'Keamanan 24 Jam'],
        featured: false,
        isNew: true,
      };

      await api.post('/properties', propertyData);
      toast.success('Properti berhasil ditambahkan!');
      navigate('/dashboard/properties');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan properti');
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = ['rumah', 'apartemen', 'villa', 'tanah', 'ruko'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="font-heading text-2xl font-bold mb-6">Tambah Properti</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Judul Properti</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            placeholder="Masukkan judul properti"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 min-h-[120px]"
            placeholder="Deskripsi properti"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipe</label>
            <select
              {...register('type')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="jual">Dijual</option>
              <option value="sewa">Disewa</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Harga</label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            placeholder="Masukkan harga"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h4 className="font-semibold">Lokasi</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Alamat</label>
            <input
              {...register('location.address')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kota</label>
              <input
                {...register('location.city')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Provinsi</label>
              <input
                {...register('location.province')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h4 className="font-semibold">Spesifikasi</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Luas Tanah (m²)</label>
              <input
                type="number"
                {...register('specifications.landSize', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Luas Bangunan (m²)</label>
              <input
                type="number"
                {...register('specifications.buildingSize', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kamar Tidur</label>
              <input
                type="number"
                {...register('specifications.bedrooms', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kamar Mandi</label>
              <input
                type="number"
                {...register('specifications.bathrooms', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Menyimpan...' : 'Simpan Properti'}
        </button>
      </form>
    </motion.div>
  );
};

export default AddProperty;