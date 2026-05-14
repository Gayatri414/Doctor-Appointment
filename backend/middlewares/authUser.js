import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    console.log("HEADER:", req.headers.authorization);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Not Authorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized - Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired - Please login again" });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token - Please login again" });
    } else {
      return res.status(401).json({ success: false, message: "Authentication failed" });
    }
  }
};

export default authUser