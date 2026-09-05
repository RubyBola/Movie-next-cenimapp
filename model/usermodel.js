// model/usermodel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true },
  lastName: { 
    type: String, 
    required: true },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: { 
    type: String, 
    required: true
   },
  
  accountNumber: {
     type: String
     },
   resetToken: {
    type: String
  },
  resetTokenExpires: {
    type: Date
  },
  verificationCode: { 
    type: String 
  },
  isVerified: { 
    type: Boolean, 
    default: false
   },
});

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     description: {
//       type: String,
//     },

//     image: {
//       type: String, // URL or file path
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

const User = mongoose.model("User", userSchema);
module.exports = User;