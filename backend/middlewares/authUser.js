import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);
    
    if (!authHeader) {
      console.log("❌ No authorization header");
      return res.status(401).json({
        success: false,
        message: "No authorization header provided"
      });
    }
    
    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid authorization format");
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format - Bearer token required"
      });
    }
    
    const token = authHeader.split(" ")[1];
    console.log("EXTRACTED TOKEN:", token ? `${token.substring(0, 20)}...` : "null");
    console.log("TOKEN LENGTH:", token?.length);
    
    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);
    
    if (!decoded.id) {
      console.log("❌ No user ID in token");
      return res.status(401).json({
        success: false,
        message: "Invalid token format - no user ID"
      });
    }
    
    req.userId = decoded.id;
    console.log("✅ SET REQ.USERID:", req.userId);
    
    next();
    
  } catch (error) {
    console.log("❌ AUTH ERROR:", error.message);
    console.log("Error details:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token has expired - please login again"
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Authentication failed"
      });
    }
  }
};

export default authUser