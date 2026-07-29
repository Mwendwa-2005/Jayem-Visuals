const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

console.log('📧 Testing Email Configuration...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email From:', process.env.EMAIL_FROM);

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email
const mailOptions = {
    from: process.env.EMAIL_FROM || `Willfred Jayem Photography <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to yourself for testing
    subject: '✅ Test Email - Willfred Photography',
    html: `
        <h1 style="color: #e63946;">Test Email ✅</h1>
        <p>Your email configuration is working correctly!</p>
        <p>This is a test email from Willfred Jayem Photography.</p>
        <p>If you received this, emails will work for your bookings.</p>
    `
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('❌ ERROR:', error);
        console.log('\n🔍 Common Issues:');
        console.log('1. Check EMAIL_USER is correct');
        console.log('2. Check EMAIL_PASS is the 16-char app password (not your regular password)');
        console.log('3. Make sure 2-Step Verification is enabled on your Google account');
        console.log('4. Make sure "Less secure app access" is turned ON for testing');
        console.log('5. Check your internet connection');
    } else {
        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Check your inbox at:', process.env.EMAIL_USER);
        console.log('Response:', info.response);
    }
});