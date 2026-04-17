import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.json({
                success: false,
                message: "Not Authorized, login again"
            });
        }

        //  REMOVE "Bearer "
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // check admin email
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Invalid Token"
        });
    }
};
console.log("AUTH MIDDLEWARE HIT ✅");

export default authAdmin;