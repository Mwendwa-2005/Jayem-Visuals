const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, date, service, location, message } = req.body;

        const booking = await Booking.create({
            name,
            email,
            phone,
            date,
            service,
            location,
            message
        });

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Booking Confirmation - Willfred Jayem Photography',
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${name},</p>
                <p>Thank you for booking with Willfred Jayem Photography. Your booking details:</p>
                <ul>
                    <li><strong>Service:</strong> ${service}</li>
                    <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
                    <li><strong>Location:</strong> ${location || 'To be determined'}</li>
                </ul>
                <p>We will contact you within 24 hours to confirm your booking.</p>
                <p>Best regards,<br>Willfred Jayem</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        // Send status update email
        if (status === 'confirmed') {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: booking.email,
                subject: 'Booking Confirmed - Willfred Jayem Photography',
                html: `
                    <h1>Booking Confirmed!</h1>
                    <p>Dear ${booking.name},</p>
                    <p>Your booking has been confirmed. We look forward to working with you!</p>
                    <p><strong>Service:</strong> ${booking.service}</p>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p>Best regards,<br>Willfred Jayem</p>
                `
            };
            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
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