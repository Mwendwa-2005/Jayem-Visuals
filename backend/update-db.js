const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Create theme_settings table
db.run(`CREATE TABLE IF NOT EXISTS theme_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Insert default theme settings
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

const stmt = db.prepare('INSERT OR IGNORE INTO theme_settings (setting_key, setting_value) VALUES (?, ?)');
defaultSettings.forEach(([key, value]) => {
    stmt.run(key, value);
});
stmt.finalize();

console.log('✅ Theme settings table created with default values!');
db.close();