const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Create admin_users table
db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Create logo_settings table
db.run(`CREATE TABLE IF NOT EXISTS logo_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Insert default logo setting
db.run(`INSERT OR IGNORE INTO logo_settings (setting_key, setting_value) VALUES ('logo_image', '')`);
db.run(`INSERT OR IGNORE INTO logo_settings (setting_key, setting_value) VALUES ('logo_text', 'Willfred Jayem')`);

// Check if admin user exists
db.get('SELECT * FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
    if (err) {
        console.error('Error checking admin user:', err.message);
        return;
    }
    
    if (!row) {
        // Create default admin user
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.run(
            'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
            ['admin', hashedPassword, 'admin@willfredjayem.com'],
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

console.log('✅ Database tables updated!');
db.close();