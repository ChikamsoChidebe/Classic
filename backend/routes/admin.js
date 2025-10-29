const express = require('express');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        pendingVendors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get pending vendors
// @route   GET /api/admin/vendors/pending
// @access  Private (Admin only)
router.get('/vendors/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: 'pending' })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: vendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Approve/Reject vendor
// @route   PUT /api/admin/vendors/:id/status
// @access  Private (Admin only)
router.put('/vendors/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: status === 'approved' ? req.user._id : undefined,
        approvedAt: status === 'approved' ? new Date() : undefined,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined
      },
      { new: true }
    ).populate('user', 'firstName lastName email');

    res.json({
      success: true,
      message: `Vendor ${status} successfully`,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;