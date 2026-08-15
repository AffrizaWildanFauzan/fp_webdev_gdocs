import Property from '../models/Property.js';
import Review from '../models/Review.js';
import { formatPrice, generateSlug } from '../utils/helpers.js';  

// @desc    Get all properties with filters
// @route   GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minLandSize,
      maxLandSize,
      minBuildingSize,
      maxBuildingSize,
      city,
      province,
      facilities,
      sort = '-createdAt',
      search,
    } = req.query;

    const query = {};

    // Filters
    if (type) query.type = { $in: type.split(',') };
    if (status) query.status = status;
    if (bedrooms) query['specifications.bedrooms'] = { $gte: parseInt(bedrooms) };
    if (bathrooms) query['specifications.bathrooms'] = { $gte: parseInt(bathrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (minLandSize || maxLandSize) {
      query['specifications.landSize'] = {};
      if (minLandSize) query['specifications.landSize'].$gte = parseInt(minLandSize);
      if (maxLandSize) query['specifications.landSize'].$lte = parseInt(maxLandSize);
    }
    if (minBuildingSize || maxBuildingSize) {
      query['specifications.buildingSize'] = {};
      if (minBuildingSize) query['specifications.buildingSize'].$gte = parseInt(minBuildingSize);
      if (maxBuildingSize) query['specifications.buildingSize'].$lte = parseInt(maxBuildingSize);
    }
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (province) query['location.province'] = { $regex: province, $options: 'i' };
    if (facilities) {
      query.facilities = { $all: facilities.split(',') };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
      ];
    }

    // Only show available properties
    query.statusProperty = 'tersedia';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(query)
      .populate('agentId', 'name email profileImage phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Format price for each property (optional)
    const formattedProperties = properties.map(p => ({
      ...p.toObject(),
      formattedPrice: formatPrice(p.price),  // ← BARU!
    }));

    res.json({
      success: true,
      data: formattedProperties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agentId', 'name email profileImage phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    // Get reviews
    const reviews = await Review.find({ propertyId: property._id })
      .populate('userId', 'name profileImage')
      .sort('-createdAt');

    res.json({
      success: true,
      data: {
        ...property.toObject(),
        formattedPrice: formatPrice(property.price),  
        slug: generateSlug(property.title),           
      },
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
export const createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      agentId: req.user.id,
    };

    // Parse facilities if sent as string
    if (typeof propertyData.facilities === 'string') {
      propertyData.facilities = propertyData.facilities.split(',');
    }

    // Parse specifications
    if (typeof propertyData.specifications === 'string') {
      propertyData.specifications = JSON.parse(propertyData.specifications);
    }

    // Parse location
    if (typeof propertyData.location === 'string') {
      propertyData.location = JSON.parse(propertyData.location);
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      data: {
        ...property.toObject(),
        formattedPrice: formatPrice(property.price),  // ← BARU!
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (property.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property',
      });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        ...property.toObject(),
        formattedPrice: formatPrice(property.price),  // ← BARU!
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get properties by agent
// @route   GET /api/properties/agent/:agentId
export const getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agentId: req.params.agentId })
      .sort('-createdAt');

    const formattedProperties = properties.map(p => ({
      ...p.toObject(),
      formattedPrice: formatPrice(p.price),  
    }));

    res.json({
      success: true,
      data: formattedProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};