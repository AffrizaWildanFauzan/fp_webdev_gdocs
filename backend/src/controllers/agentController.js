import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import User from '../models/User.js';

export const getAgentStats = async (req, res) => {
  try {
    const agentId = req.user.id;

    const properties = await Property.find({ agentId });
    const totalProperties = properties.length;
    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

    const propertyIds = properties.map(p => p._id);
    const inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } });
    const totalInquiries = inquiries.length;

    const monthlyData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthProperties = properties.filter(p => 
        p.createdAt >= month && p.createdAt <= monthEnd
      );
      
      const monthInquiries = inquiries.filter(q => 
        q.createdAt >= month && q.createdAt <= monthEnd
      );

      monthlyData.push({
        month: month.toLocaleString('default', { month: 'short' }),
        views: monthProperties.reduce((sum, p) => sum + (p.views || 0), 0),
        inquiries: monthInquiries.length,
        properties: monthProperties.length,
      });
    }

    res.json({
      success: true,
      totalProperties,
      totalViews,
      totalInquiries,
      properties,
      monthlyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agentId: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};