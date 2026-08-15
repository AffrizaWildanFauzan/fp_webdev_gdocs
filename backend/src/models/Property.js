import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['rumah', 'apartemen', 'villa', 'tanah', 'ruko'],
    required: true,
  },
  status: {
    type: String,
    enum: ['jual', 'sewa'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  pricePerMeter: {
    type: Number,
    min: 0,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    postalCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  specifications: {
    landSize: {
      type: Number,
      min: 0,
    },
    buildingSize: {
      type: Number,
      min: 0,
    },
    bedrooms: {
      type: Number,
      min: 0,
      default: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
      default: 0,
    },
    yearBuilt: Number,
    certificateType: {
      type: String,
      enum: ['SHM', 'SHGB', 'HGB', 'Hak Pakai', 'Lainnya'],
    },
    condition: {
      type: String,
      enum: ['Baru', 'Bekas', 'Renovasi'],
    },
    facing: {
      type: String,
      enum: ['Utara', 'Selatan', 'Timur', 'Barat', 'Timur Laut', 'Tenggara', 'Barat Daya', 'Barat Laut'],
    },
  },
  facilities: [{
    type: String,
    enum: [
      'AC', 'AC Central', 'Split AC', 
      'Kolam Renang', 'Garasi 2 Mobil', 'Garasi 1 Mobil', 'Garasi', 
      'Taman', 'Taman Depan', 'Taman Belakang', 
      'Keamanan 24 Jam', 'CCTV', 
      'Parkir Luas', 'Parkir', 
      'Furnished', 'Dapur Modern', 'Dapur', 
      'Ruang Keluarga', 'Ruang Makan', 'Ruang Tamu',
      'Kamar Pembantu', 'Kulkas', 'TV', 'Internet', 'Air Panas', 'Water Heater',
      'Lift', 'Gym', 'Sauna', 'Pemandangan', 'Balkon', 'Halaman Luas',
      'Jemuran'
    ],
  }],
  images: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  isHotDeal: {
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  statusProperty: {
    type: String,
    enum: ['tersedia', 'terjual', 'disewa', 'proses'],
    default: 'tersedia',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
propertySchema.index({ 'location.city': 1, 'location.province': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });

const Property = mongoose.model('Property', propertySchema);
export default Property;