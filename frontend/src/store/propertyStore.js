import { create } from 'zustand';
import api from '../services/api';  // ← PAKAI API.JS!

export const usePropertyStore = create((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  pagination: null,
  filters: {
    type: [],
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    sort: '-createdAt',
    search: '',
  },
  wishlist: [],
  compare: [],

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchProperties: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      const { filters } = get();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          if (Array.isArray(filters[key]) && filters[key].length > 0) {
            params.append(key, filters[key].join(','));
          } else {
            params.append(key, filters[key]);
          }
        }
      });
      params.append('page', page);

      const { data } = await api.get(`/properties?${params}`);  // ← PAKAI API.JS!
      set({ 
        properties: page === 1 ? data.data : [...get().properties, ...data.data],
        pagination: data.pagination,
        loading: false 
      });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch properties', loading: false });
      throw error;
    }
  },

  toggleWishlist: (propertyId) => {
    set((state) => {
      const index = state.wishlist.indexOf(propertyId);
      if (index > -1) {
        return { wishlist: state.wishlist.filter(id => id !== propertyId) };
      } else {
        return { wishlist: [...state.wishlist, propertyId] };
      }
    });
  },

  toggleCompare: (propertyId) => {
    set((state) => {
      const index = state.compare.indexOf(propertyId);
      if (index > -1) {
        return { compare: state.compare.filter(id => id !== propertyId) };
      } else if (state.compare.length < 4) {
        return { compare: [...state.compare, propertyId] };
      }
      return state;
    });
  },

  clearCompare: () => set({ compare: [] }),
}));