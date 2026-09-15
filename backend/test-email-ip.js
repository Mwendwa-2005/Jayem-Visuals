const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Testing with direct IP address...\n');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Password length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');
console.log('');

const transporter = nodemailer.createTransport({
    host: '142.251.127.109',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        servername: 'smtp.gmail.com'
    }
});

console.log('Sending test email...');

transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: 'Test Email - Jayem Visuals',
    html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
}, function(err, info) {
    if (err) {
        console.error('❌ Error:', err.message);
    } else {
        console.log('✅ Email sent successfully!');
        console.log('Response:', info.response);
    }
    process.exit(0);
});