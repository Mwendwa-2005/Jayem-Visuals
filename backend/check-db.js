const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

console.log('📊 Checking database tables...\n');

// Check all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error('❌ Error:', err.message);
        return;
    }
    
    console.log('📋 Tables in database:');
    tables.forEach(table => {
        console.log('  ✅', table.name);
    });
    console.log();

    // Check admin_users
    db.get('SELECT * FROM admin_users', (err, row) => {
        if (err) {
            console.log('❌ admin_users table not found or empty');
        } else if (row) {
            console.log('✅ Admin user found:');
            console.log('   Username:', row.username);
            console.log('   Email:', row.email);
            console.log('   Created:', row.created_at);
        } else {
            console.log('⚠️ admin_users table exists but no users found');
        }
        console.log();

        // Check logo_settings
        db.all('SELECT * FROM logo_settings', (err, rows) => {
            if (err) {
                console.log('❌ logo_settings table not found');
            } else {
                console.log('✅ Logo settings:');
                rows.forEach(row => {
                    console.log('   ', row.setting_key, '=', row.setting_value || '(empty)');
                });
            }
            console.log();

            // Check theme_settings
            db.all('SELECT * FROM theme_settings', (err, rows) => {
                if (err) {
                    console.log('❌ theme_settings table not found');
                } else {
                    console.log('✅ Theme settings:');
                    rows.forEach(row => {
                        console.log('   ', row.setting_key, '=', row.setting_value || '(empty)');
                    });
                }
                console.log('\n✅ Database check complete!');
                db.close();
            });
        });
    });
});