const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, authorize, checkVendorOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'active', isActive: true };

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Vendor filter
    if (req.query.vendor) {
      query.vendor = req.query.vendor;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Search filter
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = new RegExp(req.query.brand, 'i');
    }

    // Tags filter
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }

    // Build sort
    let sort = {};
    switch (req.query.sort) {
      case 'price_low':
        sort.price = 1;
        break;
      case 'price_high':
        sort.price = -1;
        break;
      case 'rating':
        sort['rating.average'] = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popular':
        sort.totalSales = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Execute query
    const products = await Product.find(query)
      .populate('vendor', 'businessName rating')
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'businessName businessDescription rating totalSales')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
      isActive: true
    })
    .populate('vendor', 'businessName rating')
    .limit(8)
    .lean();

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor only)
router.post('/', protect, authorize('vendor'), checkVendorOwnership, async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      category,
      subcategory,
      brand,
      price,
      comparePrice,
      costPrice,
      images,
      variants,
      inventory,
      dimensions,
      shipping,
      seo,
      tags,
      featured
    } = req.body;

    // Generate SKU
    const sku = `${req.vendor.businessName.substring(0, 3).toUpperCase()}-${Date.now()}`;

    const product = await Product.create({
      name,
      description,
      shortDescription,
      vendor: req.vendor._id,
      category,
      subcategory,
      brand,
      sku,
      price,
      comparePrice,
      costPrice,
      images: images || [],
      variants: variants || [],
      inventory: {
        quantity: inventory?.quantity || 0,
        lowStockThreshold: inventory?.lowStockThreshold || 10,
        trackQuantity: inventory?.trackQuantity !== false
      },
      dimensions: dimensions || {},
      shipping: shipping || {},
      seo: seo || {},
      tags: tags || [],
      featured: featured || false,
      status: 'active'
    });

    // Update category product count
    await Category.findByIdAndUpdate(category, { $inc: { productCount: 1 } });

    const populatedProduct = await Product.findById(product._id)
      .populate('vendor', 'businessName')
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor only - own products)
router.put('/:id', protect, authorize('vendor'), checkVendorOwnership, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('vendor', 'businessName')
    .populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor only - own products)
router.delete('/:id', protect, authorize('vendor'), checkVendorOwnership, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if vendor owns this product
    if (product.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update category product count
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      images: images || []
    };

    product.reviews.push(review);

    // Update product rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating.count = product.reviews.length;
    product.rating.average = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @desc    Get vendor products
// @route   GET /api/products/vendor/my-products
// @access  Private (Vendor only)
router.get('/vendor/my-products', protect, authorize('vendor'), checkVendorOwnership, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { vendor: req.vendor._id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search filter
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;