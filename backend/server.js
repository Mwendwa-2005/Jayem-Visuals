const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app FIRST
const app = express();

// Middleware - AFTER app is initialized
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    // Create default admin user if none exists
    db.get('SELECT * FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
        if (err) {
            console.error('Error checking admin user:', err.message);
            return;
        }
        
        if (!row) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run(
                'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
                ['admin', hashedPassword, 'admin@jayemvisuals.com'],
                function(err) {
                    if (err) {
                        console.error('Error creating admin user:', err.message);
                    } else {
                        console.log('✅ Default admin user created!');
                        console.log('📧 Username: admin');
                        console.log('🔑 Password: admin123');
                    }
                }
            );
        } else {
            console.log('✅ Admin user already exists');
        }
    });
    )`);

    // Portfolio table
    db.run(`CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT NOT NULL,
        featured INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        date DATETIME NOT NULL,
        service TEXT NOT NULL,
        location TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Testimonials table
    db.run(`CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        service TEXT NOT NULL,
        approved INTEGER DEFAULT 0,
        avatar TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ SQLite database initialized');
});

// Make db available to routes
app.set('db', db);

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message:"Jayem Visuals API is running!",
        database: 'SQLite',
        endpoints: {
            portfolio: '/api/portfolio',
            bookings: '/api/bookings',
            bookings_admin: '/api/bookings/admin',
            testimonials: '/api/testimonials',
            auth: '/api/auth'
        }
    });
});

// Routes - Add these AFTER app is initialized
console.log('🔧 Registering routes...');
console.log('📦 About to load auth routes...');

// Routes
app.use('/api/auth', require('./routes/auth'));
console.log('✅ Auth routes loaded from file');
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/testimonials', require('./routes/testimonial'));
app.use('/api/theme', require('./routes/theme'));
// Simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});
// Debug route to see all registered routes
app.get('/api/debug/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((layer) => {
        if (layer.route) {
            const path = layer.route.path;
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            routes.push({ path, methods });
        }
    });
    res.json({ routes });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

// 404 handler - MUST be last
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 Bookings Admin: http://localhost:${PORT}/api/bookings/admin`);
});

module.exports = app;