import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized - No token provided"
            });
        }

        // Remove "Bearer "
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized - Invalid token format"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // check admin email
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized - Admin access required"
            });
        }

        // Add admin info to request object
        req.adminEmail = decoded.email;
        req.adminId = decoded.id;

        next();

    } catch (error) {
        console.log("Admin JWT Error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Admin token expired - Please login again"
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid admin token - Please login again"
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Admin authentication failed"
            });
        }
    }
};

export default authAdmin;