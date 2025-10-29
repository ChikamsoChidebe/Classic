const express = require('express');
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Apply to become vendor
// @route   POST /api/vendors/apply
// @access  Private
router.post('/apply', protect, async (req, res) => {
  try {
    // Check if user already has vendor application
    const existingVendor = await Vendor.findOne({ user: req.user._id });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor application already exists'
      });
    }

    const vendor = await Vendor.create({
      user: req.user._id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Vendor application submitted successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Vendor application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor only)
router.get('/profile', protect, authorize('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;