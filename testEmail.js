require("dotenv").config();

const nodemailer = require("nodemailer");

console.log("EMAIL:", process.env.EMAIL_USERNAME);
console.log(
  "PASSWORD EXISTS:",
  !!process.env.EMAIL_PASSWORD
);

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  try {
    console.log("Testing SMTP...");

    await transporter.verify();

    console.log("SMTP connection successful ✅");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME,
      subject: "Movie Nest Cinema SMTP Test",
      text: "SMTP is working successfully!",
    });

    console.log("Email sent successfully ✅");
    console.log("Message ID:", info.messageId);

  } catch (error) {
    console.error("SMTP TEST ERROR:", error);
  }
}

testEmail();