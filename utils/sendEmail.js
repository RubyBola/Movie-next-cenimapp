const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },

      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    console.log("Testing SMTP connection...");

    await transporter.verify();

    console.log("SMTP connection successful");

    const info = await transporter.sendMail({
      from: {
        name: "Movie Nest Cinema",
        address: process.env.EMAIL_USERNAME,
      },
      to,
      subject,
      text: text || "",
      html: html || "",
    });

    console.log("Email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;