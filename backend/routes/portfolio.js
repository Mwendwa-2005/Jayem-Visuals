const express = require('express');
const router = express.Router();

// Get all portfolio items (Public)
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

// Get single portfolio item (Public)
router.get('/:id', (req, res) => {
    const db = req.app.get('db');
    db.get('SELECT * FROM portfolios WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: 'Portfolio item not found' });
        }
        res.json({ success: true, data: row });
    });
});

// Create portfolio item (Admin)
router.post('/admin', (req, res) => {
    const db = req.app.get('db');
    const { title, category, description, imageUrl, featured } = req.body;
    
    if (!title || !category || !imageUrl) {
        return res.status(400).json({ 
            success: false, 
            message: 'Title, category, and image URL are required' 
        });
    }
    
    db.run(
        'INSERT INTO portfolios (title, category, description, imageUrl, featured) VALUES (?, ?, ?, ?, ?)',
        [title, category, description || '', imageUrl, featured ? 1 : 0],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            res.status(201).json({ 
                success: true, 
                message: 'Portfolio item added successfully',
                data: { id: this.lastID, title, category, description, imageUrl, featured }
            });
        }
    );
});

// Update portfolio item (Admin)
router.put('/admin/:id', (req, res) => {
    const db = req.app.get('db');
    const { title, category, description, imageUrl, featured } = req.body;
    
    db.run(
        'UPDATE portfolios SET title = ?, category = ?, description = ?, imageUrl = ?, featured = ? WHERE id = ?',
        [title, category, description, imageUrl, featured ? 1 : 0, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Portfolio item not found' });
            }
            res.json({ success: true, message: 'Portfolio updated successfully' });
        }
    );
});

// Delete portfolio item (Admin)
router.delete('/admin/:id', (req, res) => {
    const db = req.app.get('db');
    db.run('DELETE FROM portfolios WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Portfolio item not found' });
        }
        res.json({ success: true, message: 'Portfolio item deleted successfully' });
    });
});

module.exports = router;