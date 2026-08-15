import Review from '../models/Review.js';
import Property from '../models/Property.js';

export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.id })
      .populate('userId', 'name profileImage')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const propertyId = req.params.id;

    const existingReview = await Review.findOne({
      propertyId,
      userId: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property',
      });
    }

    const review = await Review.create({
      propertyId,
      userId: req.user.id,
      rating,
      comment,
    });

    const reviews = await Review.find({ propertyId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Property.findByIdAndUpdate(propertyId, {
      rating: avgRating,
      totalReviews: reviews.length,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};