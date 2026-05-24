const User = require('../model/usermodel');
const Admin = require('../model/admin');
const bcrypt = require('bcryptjs');
const upload = require("../middleware/upload");
const jwt = require("jsonwebtoken");
const { generateCode } = require("../utils/code");
const sendEmail= require("../utils/sendEmail");
const Product = require("../model/product");
const Booking = require('../model/booking');

const user = { name: "John Doe", email: "boluwa@gmail.com:", password: "password123" }
const user1 = { name: "John Doe 1", email: "boluwa@gmail11.com:", password: "password222123" }
const user2 = { name: "John Doe 2", email: "boluwa@gmail2222.com:", password: "password1www23" }
const data = [user, user1, user2,]

console.log("Data before loop:", data[0])

data.forEach((item, index) => {
    item.name
    console.log(`Data at index ${index} after loop:`, item)
})

const generateAccountNumber = () => {
    const randomNum = Math.floor(Math.random() * 10000000000)
    return randomNum.toString().padStart(10, '0')
}
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Already verified" });
    }

    if (
      !user.verificationCode ||
      user.verificationCode.toString() !== otp.toString()
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("this is the user",user,user.email)

    // 🔐 Generate token
    //const token = crypto.randomBytes(32).toString("hex");
    const token = generateCode();

    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000; // 30 mins

    await user.save();

    // 🔗 Reset link
    const resetLink = `http://localhost:5001/api/reset-password/${token}`;
await sendEmail({
  to: user.email,
  subject: "Password Reset Code",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <p>Hello ${user.firstName},</p>

      <p>Use the code below to reset your password:</p>

      <h2 style="
        letter-spacing: 5px;
        background: #f4f4f4;
        display: inline-block;
        padding: 10px 20px;
        border-radius: 8px;
      ">
        ${token}
      </h2>

      <p>This code will expire in 10 minutes.</p>

      <p>If you didn’t request this, please ignore this email.</p>
    </div>
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
    const { token, newPassword, confirmPassword } = req.body;
    console.log("token",token)
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please provide both password fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      // resetTokenExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token. Please request a new one." 
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    // Optional: Send confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Successful",
        html: `
          <p>Hello ${user.firstName},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't perform this action, please contact support immediately.</p>
        `
      });
    } catch (emailError) {
      console.log("Confirmation email failed:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({ 
      message: "Password reset successful. You can now login with your new password." 
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const code = generateCode();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      verificationCode: code,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    await sendEmail({
      to: email,
      subject: "Verify Your User Account",
      html: `
        <p>Hello ${firstName},</p>
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code expires in 10 minutes.</p>
      `
    });

    res.status(201).json({
      message: "User created. Check email for OTP."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
// const verifyUserEmail = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "Already verified" });
//     }

//     if (
//       !user.verificationCode ||
//       user.verificationCode.toString() !== otp.toString()
//     ) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (
//       user.verificationCodeExpires &&
//       user.verificationCodeExpires < Date.now()
//     ) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     user.isVerified = true;
//     user.verificationCode = null;
//     user.verificationCodeExpires = null;

//     await user.save();

//     res.json({ message: "Email verified successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const adminSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const code = generateCode();

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      verificationCode: code,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Admin Account",
      html: `
        <p>Hello ${firstName},</p>
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code expires in 10 minutes.</p>
      `
    });

    res.status(201).json({
      message: "Admin created. Check email for OTP."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyAdminEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: "Already verified" });
    }

    if (
      !admin.verificationCode ||
      admin.verificationCode.toString() !== otp.toString()
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (
      admin.verificationCodeExpires &&
      admin.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "OTP expired" });
    }

    admin.isVerified = true;
    admin.verificationCode = null;
    admin.verificationCodeExpires = null;

    await admin.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function greet(name) {
    return 'Hello' + name + "!"
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 📩 Check if verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // ✅ Success
    res.json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
    console.log(
        "Login request received with email:", req.body.email
    )

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).send({ message: "Email does not exist in Database, kindly crosscheck and signup" })

    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Incorrect password, kindly crosscheck and try again" })
    }

    const userData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role:user.role
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role:user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "31d" }
    )
    res.status(200).send({ message: "User logged in successfully", token, user: userData })
}

const updateUser = async (req, res) => {
    const id = req.params.id
    const { firstName, lastName, email } = req.body

    if (!id) {
        return res.status(400).send({ message: "ID is required" })
    }
    const user = await User.findById(id)
    if (!user) {
        return res.status(400).send({ message: "User does not exist in Database, kindly crosscheck and signup" })
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.email = email || user.email

    await user.save()

    const UserData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    }

    res.status(200).send({ message: "User updated successfully", user: UserData })
}

const updatePassword = async (req, res) => {
    const id = req.params.id
    const { password } = req.body
    if (!id) {
        return res.status(400).send({ message: "ID is required" })
    }
    if (!password) {
        return res.status(400).send({ message: "Password is required" })
    }
    const user = await User.findById(id)
    if (!user) {
        return res.status(400).send({ message: "User does not exist in Database, kindly crosscheck and signup" })
    }

    user.password = password || user.password

    await user.save()
    res.status(200).send({ message: "Password updated successfully" })

}

const uploadProfileImage = async (req, res) => {
    const id = req.user.id

    if (!id) return res.status(400).json({ message: "ID is required" })

    if (!req.file) return res.status(400).json({ error: "No file received." })

    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ message: "User not found" })

        user.profileImage = req.file.path
        await user.save()

        return res.status(200).json({
            message: "Profile image updated successfully",
            profileImage: user.profileImage
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
const uploadProduct = async (req, res) => {
  console.log("Name and Price and other details", req.body)
  try {
    const { Name, Price, Description } = req.body;

    // ✅ Validation
    if (!Name || !Price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = new Product({
      Name,
      Price,
      Description,
      user: req.user?.id, // optional (if using auth)
    });

    await product.save();

    res.status(201).json({
      message: "Product upload successfully ✅",
      product,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const loop = () => {
    let count = 6
    for (let i = 10; i > count; i--) {
        console.log(i)
    }
}

const fetchUser = async (req, res) => {


    const id = req.user.id
    console.log("Received Id:", id)

    if (!id) {
        return res.status(400).send({ message: "ID is required" })
    }
    try {
        const user = await User.findById(id).select("-password")
        if (!user) {
            console.log("User not found")
            return null
        }

        return res.status(200).send({ message: "User fetched successfully", user })


    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    } return user
}

module.exports = { signup, login, loop, updateUser, updatePassword, sleep, greet, uploadProfileImage, fetchUser,verifyAdminEmail,loginUser,uploadProduct,forgotPassword,resetPassword,adminSignup,adminLogin,verifyEmail}