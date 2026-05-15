import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing Details"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        // check existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        console.log("✅ Registration token generated");
        console.log("Token preview:", `${token.substring(0, 20)}...`);
        console.log("JWT_SECRET used:", process.env.JWT_SECRET);
        console.log("User ID in token:", user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
                image: user.image
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        console.log("=== LOGIN REQUEST ===");
        console.log("Request body:", req.body);
        
        const { email, password } = req.body

        // Validate required fields
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            console.log("Invalid email format:", email);
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            })
        }

        // Find user
        const user = await userModel.findOne({ email })
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({
                success: false,
                message: "No account found with this email address"
            })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            console.log("Invalid password for user:", email);
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            })
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        console.log("✅ Token generated successfully");
        console.log("Token preview:", `${token.substring(0, 20)}...`);
        console.log("JWT_SECRET used:", process.env.JWT_SECRET);
        console.log("User ID in token:", user._id);
        console.log("Login successful for user:", email);
        
        res.status(200).json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
                image: user.image
            }
        })

    } catch (error) {
        console.log("Login error:", error)
        res.status(500).json({
            success: false,
            message: "Server error during login"
        })
    }
}
//API to get user profile data
const getProfile = async (req, res) => {
    try {
        console.log("=== PROFILE API HIT ===");
        console.log("REQUEST USER ID:", req.userId);
        
        if (!req.userId) {
            console.log("❌ No userId found in request");
            return res.status(400).json({
                success: false,
                message: "User ID not found in request"
            });
        }

        console.log("🔍 Searching for user with ID:", req.userId);
        const userData = await userModel.findById(req.userId).select('-password');

        if (!userData) {
            console.log("❌ User not found in database");
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("✅ User found successfully");
        console.log("User data:", { name: userData.name, email: userData.email });

        res.status(200).json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.log("❌ Profile API error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
//Api to update user profile data
const updateProfile = async (req, res) => {
    try{
        const{userId,name,phone,address,dob,gender}=req.body;
        const imageFile=req.file;

if(!name||!phone||!dob||!gender){
    return res.json({success:false,message:"Missing Details"})
}
await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
if(imageFile){
    //upload image to cloudinary
const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image',folder:'appointment'})
const imageURL=imageUpload.secure_url;
await userModel.findByIdAndUpdate(userId,{image:imageURL})

}
res.json({success:true,message:"Profile Updated"})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export { registerUser, loginUser, getProfile,updateProfile }