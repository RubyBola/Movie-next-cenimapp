const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.gmail.com
      port: process.env.EMAIL_PORT, // 465 or 587
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text: text || "",
      html: html || "",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return { success: true };

  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;