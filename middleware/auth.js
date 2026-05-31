const jwt = require("jsonwebtoken");

const User =
   require("../model/usermodel");

const admin =
   require("../model/admin");

const protect = async (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Extract token
        const token =
            authHeader.split(" ")[1];

        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );
        console.log("decoded");
        // Find normal user
        let user =
            await User.findById(decoded.id)
                .select("-password");

        // If not found, check admin
        if (!user) {

            user =
                await admin.findById(decoded.id)
                    .select("-password");
        }

        // If still not found
        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // Attach user
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            message:
               "Invalid or expired token"
        });
    }
};

module.exports = protect;