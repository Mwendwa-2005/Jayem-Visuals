const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

db.all('SELECT * FROM bookings ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
        return;
    }
    console.log(`📊 Found ${rows.length} bookings:`);
    rows.forEach(row => {
        console.log(`  - ${row.name} | ${row.service} | ${row.status} | ${row.createdAt}`);
    });
    db.close();
});