const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('✅ Auth routes file loaded!');

// ADMIN LOGIN
router.post('/login', (req, res) => {
    console.log('🔐 Login route called!');
    const db = req.app.get('db');
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide username and password'
        });
    }
    
    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        if (!user) {
            console.log('❌ User not found:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            console.log('❌ Invalid password for:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        console.log('✅ Login successful:', username);
        
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
});

// VERIFY TOKEN
router.get('/verify', (req, res) => {
    console.log('🔐 Verify route called');
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        res.json({
            success: true,
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// CHANGE PASSWORD - NO TOKEN REQUIRED
router.put('/change-password', (req, res) => {
    console.log('🔑 Password change attempt received');
    const db = req.app.get('db');
    const { username, oldPassword, newPassword } = req.body;
    
    console.log('📝 Username:', username);
    
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all fields'
        });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }
    
    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        if (!user) {
            console.log('❌ User not found:', username);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            console.log('❌ Incorrect current password for:', username);
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        
        db.run(
            'UPDATE admin_users SET password = ? WHERE username = ?',
            [hashedPassword, username],
            function(err) {
                if (err) {
                    console.error('❌ Error updating password:', err.message);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }
                
                console.log('✅ Password changed successfully for:', username);
                res.json({
                    success: true,
                    message: 'Password changed successfully'
                });
            }
        );
    });
});

module.exports = router;