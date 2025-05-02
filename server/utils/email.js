// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendAppointmentConfirmation = async (email, appointmentDetails) => {
  const mailOptions = {
    from: 'noreply@godoc.com',
    to: email,
    subject: 'Appointment Confirmation',
    html: `<h1>Your appointment on ${appointmentDetails.date} is confirmed</h1>`
  };

  await transporter.sendMail(mailOptions);
};