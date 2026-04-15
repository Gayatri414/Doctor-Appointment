import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized, login again"
            });
        }

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
            message: error.message
        });
    }
};

export default authAdmin;