// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD
  },
});

const sendVerificationEmail = async (to, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: to,
      subject: subject,
      html: html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendVerificationEmail
};
