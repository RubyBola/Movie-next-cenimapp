const bcrypt = require("bcryptjs");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash the token before saving (more secure)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetToken = hashedToken; // Save the HASHED token
    user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 mins

    await user.save();

    // 🔗 Reset link (use the UNHASHED token in the URL)
    const resetLink = `http://localhost:5001/api/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>Hello ${user.firstName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "Reset link sent to email 📩" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 🔐 Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ❌ Clear token
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    res.json({ message: "Password reset successful ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { forgotPassword, resetPassword };