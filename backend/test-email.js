require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log('Testing SMTP connection...');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('From:', process.env.SMTP_FROM);
console.log('Pass:', process.env.SMTP_PASS ? '✓ SET' : '✗ NOT SET');

transporter.verify((error, success) => {
  if (error) {
    console.error('\n✗ SMTP connection FAILED:', error.message);
  } else {
    console.log('\n✓ SMTP connection OK — sending test email...');
    transporter.sendMail({
      from: `"JP Barber Test" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_FROM,
      subject: 'Test Email from Barbershop',
      text: 'If you received this, SMTP is working correctly!',
    }, (err, info) => {
      if (err) console.error('✗ Send FAILED:', err.message);
      else console.log('✓ Email sent! Message ID:', info.messageId);
    });
  }
});
