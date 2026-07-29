const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create all tables in order
db.serialize(() => {
    // 1. Create admin_users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating admin_users:', err.message);
        } else {
            console.log('✅ admin_users table created');
        }
    });

    // 2. Create logo_settings table
    db.run(`CREATE TABLE IF NOT EXISTS logo_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating logo_settings:', err.message);
        } else {
            console.log('✅ logo_settings table created');
        }
    });

    // 3. Create theme_settings table
    db.run(`CREATE TABLE IF NOT EXISTS theme_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating theme_settings:', err.message);
        } else {
            console.log('✅ theme_settings table created');
        }
    });

    // 4. Insert default theme settings
    const defaultTheme = [
        ['hero_image', 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=1920&q=80'],
        ['hero_title', 'CAPTURE THE MOMENT'],
        ['hero_subtitle', 'Professional photography services specializing in wildlife, weddings, events, and studio work.'],
        ['primary_color', '#e63946'],
        ['secondary_color', '#f1faee'],
        ['accent_color', '#1a1a1a'],
        ['text_color', '#ffffff'],
        ['font_family', 'Montserrat']
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO theme_settings (setting_key, setting_value) VALUES (?, ?)');
    defaultTheme.forEach(([key, value]) => {
        stmt.run(key, value);
    });
    stmt.finalize();
    console.log('✅ Default theme settings inserted');

    // 5. Insert default logo settings
    db.run(`INSERT OR IGNORE INTO logo_settings (setting_key, setting_value) VALUES ('logo_image', '')`);
    db.run(`INSERT OR IGNORE INTO logo_settings (setting_key, setting_value) VALUES ('logo_text', 'Willfred Jayem')`);
    console.log('✅ Default logo settings inserted');

    // 6. Create default admin user
    db.get('SELECT * FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
        if (err) {
            console.error('❌ Error checking admin user:', err.message);
            return;
        }
        
        if (!row) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run(
                'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
                ['admin', hashedPassword, 'admin@willfredjayem.com'],
                function(err) {
                    if (err) {
                        console.error('❌ Error creating admin user:', err.message);
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
});

// Close the database after all operations
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('✅ Database setup complete!');
        }
    });
}, 1000);