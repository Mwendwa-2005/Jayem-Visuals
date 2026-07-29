const express = require('express');
const router = express.Router();

// ============================================
// GET ALL THEME SETTINGS (Public)
// ============================================
router.get('/', (req, res) => {
    const db = req.app.get('db');
    
    db.all('SELECT setting_key, setting_value FROM theme_settings', (err, rows) => {
        if (err) {
            console.error('❌ Error fetching theme settings:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        
        res.json({ success: true, data: settings });
    });
});

// ============================================
// UPDATE THEME SETTINGS (Admin)
// ============================================
router.put('/', (req, res) => {
    const db = req.app.get('db');
    const settings = req.body;
    
    console.log('🎨 Updating theme settings:', settings);
    
    const updates = Object.keys(settings).map(key => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE theme_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
                [settings[key], key],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    });
    
    Promise.all(updates)
        .then(() => {
            console.log('✅ Theme settings updated successfully');
            res.json({ success: true, message: 'Theme settings updated successfully' });
        })
        .catch(err => {
            console.error('❌ Error updating theme settings:', err.message);
            res.status(500).json({ success: false, message: err.message });
        });
});
// ============================================
// GET LOGO SETTINGS
// ============================================
router.get('/logo', (req, res) => {
    const db = req.app.get('db');
    
    db.all('SELECT setting_key, setting_value FROM logo_settings', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        
        res.json({ success: true, data: settings });
    });
});

// ============================================
// UPDATE LOGO SETTINGS
// ============================================
router.put('/logo', (req, res) => {
    const db = req.app.get('db');
    const { logo_image, logo_text } = req.body;
    
    const updates = [];
    if (logo_image !== undefined) {
        updates.push(new Promise((resolve, reject) => {
            db.run(
                'UPDATE logo_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
                [logo_image, 'logo_image'],
                (err) => err ? reject(err) : resolve()
            );
        }));
    }
    if (logo_text !== undefined) {
        updates.push(new Promise((resolve, reject) => {
            db.run(
                'UPDATE logo_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
                [logo_text, 'logo_text'],
                (err) => err ? reject(err) : resolve()
            );
        }));
    }
    
    Promise.all(updates)
        .then(() => {
            res.json({ success: true, message: 'Logo settings updated' });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: err.message });
        });
});

// ============================================
// RESET THEME SETTINGS TO DEFAULT (Admin)
// ============================================
router.post('/reset', (req, res) => {
    const db = req.app.get('db');
    
    const defaultSettings = [
        ['hero_image', 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=1920&q=80'],
        ['logo_text', 'Willfred Jayem'],
        ['primary_color', '#e63946'],
        ['secondary_color', '#f1faee'],
        ['accent_color', '#1a1a1a'],
        ['text_color', '#ffffff'],
        ['font_family', 'Montserrat'],
        ['hero_title', 'CAPTURE THE MOMENT'],
        ['hero_subtitle', 'Professional photography services specializing in wildlife, weddings, events, and studio work.']
    ];
    
    const updates = defaultSettings.map(([key, value]) => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE theme_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
                [value, key],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    });
    
    Promise.all(updates)
        .then(() => {
            console.log('✅ Theme settings reset to default');
            res.json({ success: true, message: 'Theme settings reset to default' });
        })
        .catch(err => {
            console.error('❌ Error resetting theme settings:', err.message);
            res.status(500).json({ success: false, message: err.message });
        });
});

module.exports = router;