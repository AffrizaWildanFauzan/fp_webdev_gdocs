import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  statusProperty: z.string(),
  location: z.object({
    address: z.string().min(1, 'Alamat harus diisi'),
    city: z.string().min(1, 'Kota harus diisi'),
    province: z.string().min(1, 'Provinsi harus diisi'),
  }),
});

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await api.get(`/properties/${id}`);
      const property = data.data;
      // Set form values
      setValue('title', property.title);
      setValue('description', property.description);
      setValue('type', property.type);
      setValue('status', property.status);
      setValue('price', property.price);
      setValue('statusProperty', property.statusProperty);
      setValue('location.address', property.location?.address || '');
      setValue('location.city', property.location?.city || '');
      setValue('location.province', property.location?.province || '');
    } catch (error) {
      toast.error('Gagal memuat properti');
      navigate('/dashboard/properties');
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put(`/properties/${id}`, data);
      toast.success('Properti berhasil diupdate!');
      navigate('/dashboard/properties');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate properti');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 skeleton w-1/3" />
        <div className="space-y-3">
          <div className="h-12 skeleton" />
          <div className="h-12 skeleton" />
          <div className="h-12 skeleton" />
        </div>
      </div>
    );
  }

  const propertyTypes = ['rumah', 'apartemen', 'villa', 'tanah', 'ruko'];
  const statusOptions = ['tersedia', 'terjual', 'disewa', 'proses'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="font-heading text-2xl font-bold mb-6">Edit Properti</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Properti</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 min-h-[120px]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium mb-1">Status Properti</label>
            <select
              {...register('statusProperty')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Harga</label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Menyimpan...' : 'Update Properti'}
        </button>
      </form>
    </motion.div>
  );
};

export default EditProperty;