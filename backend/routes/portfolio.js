const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const path = require('path');

// ============================================
// GET ALL PORTFOLIO ITEMS (Public)
// ============================================
router.get('/', (req, res) => {
    const db = req.app.get('db');
    const { category, featured } = req.query;
    
    let sql = 'SELECT * FROM portfolios';
    let params = [];
    let conditions = [];
    
    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (featured === 'true') {
        conditions.push('featured = 1');
    }
    
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY createdAt DESC';
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, count: rows.length, data: rows });
    });
});

// ============================================
// CREATE PORTFOLIO ITEM WITH FILE UPLOAD (Admin)
// ============================================
router.post('/admin', upload.single('image'), (req, res) => {
    const db = req.app.get('db');
    const { title, category, description, imageUrl, featured } = req.body;
    
    console.log('📸 New portfolio item:', { title, category });
    console.log('📁 File uploaded:', req.file ? req.file.filename : 'No file');
    
    // Determine image URL
    let finalImageUrl = imageUrl;
    
    if (req.file) {
        // File was uploaded - use the file path
        finalImageUrl = '/uploads/' + req.file.filename;
    }
    
    // Validate
    if (!title || !category) {
        return res.status(400).json({ 
            success: false, 
            message: 'Title and category are required' 
        });
    }
    
    if (!finalImageUrl) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide an image URL or upload a file' 
        });
    }
    
    db.run(
        'INSERT INTO portfolios (title, category, description, imageUrl, featured) VALUES (?, ?, ?, ?, ?)',
        [title, category, description || '', finalImageUrl, featured ? 1 : 0],
        function(err) {
            if (err) {
                console.error('❌ Database error:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
            console.log('✅ Portfolio item saved with ID:', this.lastID);
            res.status(201).json({ 
                success: true, 
                message: 'Portfolio item added successfully',
                data: { 
                    id: this.lastID, 
                    title, 
                    category, 
                    description, 
                    imageUrl: finalImageUrl, 
                    featured 
                }
            });
        }
    );
});

// ============================================
// DELETE PORTFOLIO ITEM (Admin)
// ============================================
router.delete('/admin/:id', (req, res) => {
    const db = req.app.get('db');
    const fs = require('fs');
    
    // First get the item to delete its file
    db.get('SELECT * FROM portfolios WHERE id = ?', [req.params.id], (err, item) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        
        if (!item) {
            return res.status(404).json({ success: false, message: 'Portfolio item not found' });
        }
        
        // Delete the file if it's an uploaded file
        if (item.imageUrl && item.imageUrl.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', item.imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('🗑️ Deleted file:', filePath);
            }
        }
        
        // Delete from database
        db.run('DELETE FROM portfolios WHERE id = ?', [req.params.id], function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            console.log('✅ Portfolio item deleted');
            res.json({ success: true, message: 'Portfolio item deleted successfully' });
        });
    });
});

module.exports = router;