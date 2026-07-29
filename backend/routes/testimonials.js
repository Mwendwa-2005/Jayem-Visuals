const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ approved: true })
            .sort({ createdAt: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, content, rating, service } = req.body;

        const testimonial = await Testimonial.create({
            name,
            email,
            content,
            rating,
            service,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D0D0D&color=e63946&size=100`
        });

        res.status(201).json({
            success: true,
            data: testimonial,
            message: 'Testimonial submitted for approval'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
});

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @desc    Approve testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private/Admin
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        testimonial.approved = true;
        await testimonial.save();

        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        await testimonial.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

module.exports = router;