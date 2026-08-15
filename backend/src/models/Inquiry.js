import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'responded', 'closed'],
    default: 'pending',
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;