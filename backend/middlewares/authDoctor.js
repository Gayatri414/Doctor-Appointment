import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
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

    req.body.docId = decoded.id;

    next();
  } catch (error) {
    console.log("Doctor JWT Error:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Doctor token expired - Please login again" });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid doctor token - Please login again" });
    } else {
      return res.status(401).json({ success: false, message: "Doctor authentication failed" });
    }
  }
};

export default authDoctor;