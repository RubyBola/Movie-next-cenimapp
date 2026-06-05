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

    const admin = await Admin.findById(decoded.id)
      .select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    if (admin.role !== "admin") {
  return res.status(403).json({
    message: "Access denied"
  });
}

    req.admin = admin;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = adminProtect;