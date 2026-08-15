import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user',
  },
  profileImage: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
  inquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry',
  }],
  refreshToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;