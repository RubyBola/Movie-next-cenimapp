const jwt = require("jsonwebtoken");

const User = require("../model/usermodel");

const admin = require("../model/admin");

const protect = async (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;

        console.log("AUTH HEADER:", authHeader);

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

        console.log("TOKEN:", token);

        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log("DECODED:", decoded);

        // Find normal user
        let user =
            await User.findById(decoded.id)
                .select("-password");

        console.log("USER:", user);

        // Check admin if no user
        if (!user) {

            user =
                await admin.findById(decoded.id)
                    .select("-password");

            console.log("ADMIN:", user);
        }

        // Still no user
        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;