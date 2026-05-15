import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    const token = authHeader.split(" ")[1];
    console.log("EXTRACTED TOKEN:", token);
    console.log("TOKEN LENGTH:", token.length);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);
    
    req.userId = decoded.id;
    console.log("SET REQ.USERID:", req.userId);
    
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

export default authUser