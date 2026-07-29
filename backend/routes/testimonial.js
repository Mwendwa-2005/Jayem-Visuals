const express = require('express');
const router = express.Router();

// ============================================
// GET APPROVED TESTIMONIALS (Public)
// ============================================
router.get('/', (req, res) => {
    const db = req.app.get('db');
    console.log('📊 Fetching approved testimonials...');
    
    db.all('SELECT * FROM testimonials WHERE approved = 1 ORDER BY createdAt DESC LIMIT 6', (err, rows) => {
        if (err) {
            console.error('❌ Error fetching testimonials:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        console.log(`📊 Found ${rows.length} approved testimonials`);
        res.json({ success: true, count: rows.length, data: rows });
    });
});

// ============================================
// GET ALL TESTIMONIALS (Admin)
// ============================================
router.get('/admin', (req, res) => {
    const db = req.app.get('db');
    console.log('📊 Admin: Fetching all testimonials...');
    
    db.all('SELECT * FROM testimonials ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('❌ Error fetching testimonials:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        console.log(`📊 Found ${rows.length} testimonials`);
        res.json({ success: true, count: rows.length, data: rows });
    });
});

// ============================================
// CREATE TESTIMONIAL (Public)
// ============================================
router.post('/', (req, res) => {
    const db = req.app.get('db');
    const { name, email, content, rating, service } = req.body;
    
    console.log('📝 New testimonial received:', { name, email, service, rating });
    
    // Validate
    if (!name || !email || !content || !rating || !service) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all fields'
        });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }
    
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D0D0D&color=e63946&size=100`;
    
    db.run(
        `INSERT INTO testimonials (name, email, content, rating, service, approved, avatar) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, content, rating, service, 0, avatar],
        function(err) {
            if (err) {
                console.error('❌ Database error:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
            console.log('✅ Testimonial saved with ID:', this.lastID);
            res.status(201).json({
                success: true,
                message: 'Testimonial submitted for approval',
                data: { id: this.lastID, name, email, service, rating, content }
            });
        }
    );
});

// ============================================
// APPROVE TESTIMONIAL (Admin)
// ============================================
router.put('/:id/approve', (req, res) => {
    const db = req.app.get('db');
    const { approved } = req.body;
    
    console.log(`🔄 Approving testimonial ${req.params.id} to ${approved ? 'approved' : 'pending'}`);
    
    db.run(
        'UPDATE testimonials SET approved = ? WHERE id = ?',
        [approved ? 1 : 0, req.params.id],
        function(err) {
            if (err) {
                console.error('❌ Error approving testimonial:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Testimonial not found' });
            }
            console.log('✅ Testimonial status updated');
            res.json({ success: true, message: approved ? 'Testimonial approved' : 'Testimonial rejected' });
        }
    );
});

// ============================================
// DELETE TESTIMONIAL (Admin)
// ============================================
router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    
    console.log(`🗑️ Deleting testimonial ${req.params.id}`);
    
    db.run('DELETE FROM testimonials WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            console.error('❌ Error deleting testimonial:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        console.log('✅ Testimonial deleted');
        res.json({ success: true, message: 'Testimonial deleted successfully' });
    });
});

module.exports = router;