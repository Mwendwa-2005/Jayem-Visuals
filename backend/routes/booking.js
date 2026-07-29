const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ============================================
// CREATE BOOKING (Public)
// ============================================
router.post('/', (req, res) => {
    const db = req.app.get('db');
    const { name, email, phone, date, service, location, message } = req.body;
    
    console.log('📝 New booking received:', { name, email, service, date });
    
    if (!name || !email || !phone || !date || !service) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill in all required fields' 
        });
    }
    
    db.run(
        `INSERT INTO bookings (name, email, phone, date, service, location, message, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, date, service, location || '', message || '', 'pending'],
        function(err) {
            if (err) {
                console.error('❌ Database error:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
            console.log('✅ Booking saved with ID:', this.lastID);
            
            // Send auto-reply to client
            sendAutoReplyEmail(email, name, service, date);
            
            res.status(201).json({ 
                success: true, 
                message: 'Booking created successfully',
                data: { id: this.lastID, name, email, phone, date, service, location, message }
            });
        }
    );
});

// ============================================
// GET ALL BOOKINGS (Admin)
// ============================================
router.get('/admin', (req, res) => {
    const db = req.app.get('db');
    console.log('📊 Admin: Fetching all bookings...');
    
    db.all('SELECT * FROM bookings ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('❌ Error fetching bookings:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        console.log(`📊 Found ${rows.length} bookings`);
        res.json({ success: true, count: rows.length, data: rows });
    });
});

// ============================================
// UPDATE BOOKING STATUS (Admin)
// ============================================
router.put('/:id/status', (req, res) => {
    const db = req.app.get('db');
    const { status } = req.body;
    
    console.log(`🔄 Updating booking ${req.params.id} to ${status}`);
    
    // First get the booking details
    db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, booking) => {
        if (err) {
            console.error('❌ Error fetching booking:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        console.log('📧 Booking details:', { email: booking.email, name: booking.name, service: booking.service });
        
        // Update status
        db.run(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, req.params.id],
            function(err) {
                if (err) {
                    console.error('❌ Error updating status:', err.message);
                    return res.status(500).json({ success: false, message: err.message });
                }
                
                console.log('✅ Booking status updated to:', status);
                
                // Send appropriate email based on status
                if (status === 'confirmed') {
                    console.log('📧 Sending confirmation email to:', booking.email);
                    sendConfirmationEmail(booking.email, booking.name, booking.service, booking.date);
                } else if (status === 'completed') {
                    console.log('📧 Sending completion email to:', booking.email);
                    sendCompletionEmail(booking.email, booking.name, booking.service);
                } else if (status === 'cancelled') {
                    console.log('📧 Sending cancellation email to:', booking.email);
                    sendCancellationEmail(booking.email, booking.name, booking.service);
                }
                
                res.json({ success: true, message: 'Booking status updated' });
            }
        );
    });
});

// ============================================
// DELETE BOOKING (Admin)
// ============================================
router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    
    console.log(`🗑️ Deleting booking ${req.params.id}`);
    
    db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            console.error('❌ Error deleting booking:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        console.log('✅ Booking deleted');
        res.json({ success: true, message: 'Booking deleted successfully' });
    });
});

// ============================================
// EMAIL FUNCTIONS - UPDATED TO JAYEM VISUALS
// ============================================

// 1. Auto-reply when client submits booking
function sendAutoReplyEmail(email, name, service, date) {
    console.log('📧 Sending auto-reply to:', email);
    const mailOptions = {
        from: process.env.EMAIL_FROM || `Jayem Visuals <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '📸 Booking Received - Jayem Visuals',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #1a1a1a; color: #ffffff; border-radius: 10px;">
                <h1 style="color: #e63946; font-size: 28px; text-align: center;">Booking Received! 📸</h1>
                <p style="text-align: center; color: #8d99ae;">Thank you for choosing Jayem Visuals</p>
                <hr style="border-color: #333;">
                <p>Dear <strong style="color: #e63946;">${name}</strong>,</p>
                <p>Thank you for booking with <strong>Jayem Visuals</strong>!</p>
                <p>We have received your booking request and will review it within 24 hours.</p>
                <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e63946;">
                    <h3 style="color: #e63946; margin-bottom: 10px;">📋 Booking Details</h3>
                    <p><strong>📷 Service:</strong> ${service}</p>
                    <p><strong>📅 Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <p>We will contact you shortly to confirm your booking.</p>
                <p>If you have any questions, please reply to this email.</p>
                <br>
                <p style="text-align: center;">Best regards,<br>
                <strong style="color: #e63946; font-size: 18px;">Jayem Visuals</strong><br>
                Professional Photography</p>
                <hr style="border-color: #333;">
                <p style="font-size: 12px; color: #8d99ae; text-align: center;">© 2024 Jayem Visuals. All rights reserved.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Auto-reply email error:', error);
        } else {
            console.log('✅ Auto-reply email sent to:', email);
        }
    });
}

// 2. Confirmation email when admin confirms booking
function sendConfirmationEmail(email, name, service, date) {
    console.log('📧 Sending confirmation email to:', email);
    const mailOptions = {
        from: process.env.EMAIL_FROM || `Jayem Visuals <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Booking Confirmed - Jayem Visuals',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #1a1a1a; color: #ffffff; border-radius: 10px;">
                <h1 style="color: #4caf50; font-size: 28px; text-align: center;">Booking Confirmed! ✅</h1>
                <p style="text-align: center; color: #8d99ae;">Your photography session is officially booked</p>
                <hr style="border-color: #333;">
                <p>Dear <strong style="color: #4caf50;">${name}</strong>,</p>
                <p>Great news! Your booking with <strong>Jayem Visuals</strong> has been <strong style="color: #4caf50;">CONFIRMED</strong>! 🎉</p>
                <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h3 style="color: #4caf50; margin-bottom: 10px;">📋 Confirmed Booking Details</h3>
                    <p><strong>📷 Service:</strong> ${service}</p>
                    <p><strong>📅 Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <p>We look forward to working with you! Please arrive 15 minutes early for your session.</p>
                <p>If you need to reschedule or have any questions, please reply to this email.</p>
                <br>
                <p style="text-align: center;">Best regards,<br>
                <strong style="color: #e63946; font-size: 18px;">Jayem Visuals</strong><br>
                Professional Photography</p>
                <hr style="border-color: #333;">
                <p style="font-size: 12px; color: #8d99ae; text-align: center;">© 2024 Jayem Visuals. All rights reserved.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Confirmation email error:', error);
        } else {
            console.log('✅ Confirmation email sent to:', email);
        }
    });
}

// 3. Completion email with star rating when service is completed
function sendCompletionEmail(email, name, service) {
    console.log('📧 Sending completion email to:', email);
    const ratingToken = Buffer.from(email + '|' + Date.now()).toString('base64');
    
    const mailOptions = {
        from: process.env.EMAIL_FROM || `Jayem Visuals <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '⭐ Share Your Experience - Jayem Visuals',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #1a1a1a; color: #ffffff; border-radius: 10px;">
                <h1 style="color: #e63946; font-size: 28px; text-align: center;">Thank You! ⭐</h1>
                <p style="text-align: center; color: #8d99ae;">Your ${service} session with us is now complete</p>
                <hr style="border-color: #333;">
                <p>Dear <strong style="color: #e63946;">${name}</strong>,</p>
                <p>Thank you for choosing <strong>Jayem Visuals</strong> for your ${service} photography needs!</p>
                <p>We hope you loved your experience as much as we enjoyed working with you.</p>
                <div style="background: #2a2a2a; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #e63946;">
                    <h2 style="color: #e63946; margin-bottom: 10px;">⭐ Rate Your Experience</h2>
                    <p style="color: #8d99ae;">How was your experience with us? Your feedback helps us improve!</p>
                    <div style="display: flex; justify-content: center; gap: 10px; font-size: 40px; margin: 20px 0;">
                        <a href="http://localhost:3000/rate.html?token=${ratingToken}&rating=1" style="text-decoration: none; color: #ffd700; transition: transform 0.3s;">⭐</a>
                        <a href="http://localhost:3000/rate.html?token=${ratingToken}&rating=2" style="text-decoration: none; color: #ffd700; transition: transform 0.3s;">⭐⭐</a>
                        <a href="http://localhost:3000/rate.html?token=${ratingToken}&rating=3" style="text-decoration: none; color: #ffd700; transition: transform 0.3s;">⭐⭐⭐</a>
                        <a href="http://localhost:3000/rate.html?token=${ratingToken}&rating=4" style="text-decoration: none; color: #ffd700; transition: transform 0.3s;">⭐⭐⭐⭐</a>
                        <a href="http://localhost:3000/rate.html?token=${ratingToken}&rating=5" style="text-decoration: none; color: #ffd700; transition: transform 0.3s;">⭐⭐⭐⭐⭐</a>
                    </div>
                    <p style="font-size: 12px; color: #8d99ae;">Click a star above to rate your experience</p>
                    <p style="font-size: 12px; color: #8d99ae; margin-top: 10px;">Or visit: <a href="http://localhost:3000/#testimonials" style="color: #e63946;">Leave a Testimonial</a></p>
                </div>
                <p>We would love to hear your feedback and see you again soon!</p>
                <br>
                <p style="text-align: center;">Best regards,<br>
                <strong style="color: #e63946; font-size: 18px;">Jayem Visuals</strong><br>
                Professional Photography</p>
                <hr style="border-color: #333;">
                <p style="font-size: 12px; color: #8d99ae; text-align: center;">© 2024 Jayem Visuals. All rights reserved.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Completion email error:', error);
        } else {
            console.log('✅ Completion email sent to:', email);
        }
    });
}

// 4. Cancellation email
function sendCancellationEmail(email, name, service) {
    console.log('📧 Sending cancellation email to:', email);
    const mailOptions = {
        from: process.env.EMAIL_FROM || `Jayem Visuals <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Booking Cancelled - Jayem Visuals',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #1a1a1a; color: #ffffff; border-radius: 10px;">
                <h1 style="color: #f44336; font-size: 28px; text-align: center;">Booking Cancelled ❌</h1>
                <hr style="border-color: #333;">
                <p>Dear <strong>${name}</strong>,</p>
                <p>Your ${service} booking with <strong>Jayem Visuals</strong> has been cancelled.</p>
                <p>If you believe this is a mistake, please contact us immediately.</p>
                <br>
                <p style="text-align: center;">Best regards,<br>
                <strong style="color: #e63946; font-size: 18px;">Jayem Visuals</strong><br>
                Professional Photography</p>
                <hr style="border-color: #333;">
                <p style="font-size: 12px; color: #8d99ae; text-align: center;">© 2024 Jayem Visuals. All rights reserved.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Cancellation email error:', error);
        } else {
            console.log('✅ Cancellation email sent to:', email);
        }
    });
}

module.exports = router;