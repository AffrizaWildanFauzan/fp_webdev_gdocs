import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['inquiry', 'price_change', 'new_property', 'status_change', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
  },
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;