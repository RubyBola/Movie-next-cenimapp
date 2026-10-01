const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const adminProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("ADMIN DECODED:", decoded);

    const admin = await Admin.findById(decoded.id)
      .select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found"
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    // Attach admin
    req.admin = admin;

    next();

  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired admin token"
    });
  }
};

module.exports = adminProtect;