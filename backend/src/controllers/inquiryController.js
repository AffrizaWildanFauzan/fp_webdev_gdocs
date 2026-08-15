import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Create inquiry
// @route   POST /api/inquiries
export const createInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const inquiryData = {
      propertyId,
      name,
      email,
      phone,
      message,
      isGuest: !req.user,
    };

    if (req.user) {
      inquiryData.userId = req.user.id;
    }

    const inquiry = await Inquiry.create(inquiryData);

    // Create notification for agent
    await Notification.create({
      userId: property.agentId,
      type: 'inquiry',
      title: 'Inquiry Baru',
      message: `Pertanyaan baru untuk properti "${property.title}" dari ${name}`,
      data: { inquiryId: inquiry._id, propertyId: property._id },
      link: `/dashboard/inquiries/${inquiry._id}`,
    });

    res.status(201).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user inquiries
// @route   GET /api/inquiries/my
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ userId: req.user.id })
      .populate('propertyId', 'title images price location')
      .sort('-createdAt');

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get agent inquiries
// @route   GET /api/inquiries/agent
export const getAgentInquiries = async (req, res) => {
  try {
    const properties = await Property.find({ agentId: req.user.id });
    const propertyIds = properties.map(p => p._id);

    const inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } })
      .populate('propertyId', 'title images price location')
      .sort('-createdAt');

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};