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
            { expiresIn: "1d" }
        )

        res.status(201).json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// LOGIN USER (your existing one)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
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

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

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
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
//API to get user profile data
const getProfile = async (req, res) => {
    try {
        console.log("PROFILE API HIT");
        const { userId } = req.body;

        const userData = await userModel.findById(userId).select('-password');

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.log(error);
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
    return res.json({success:false,message:error.message})
}
await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
if(imageFile){
    //upload image to cloudinary
const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image',folder:'appointment'})
const imageURL=imageUpload.secure_url;
await userModel.findByIdAndUpdate(userId,{image:imageURL})

}
res.json({success:true,message:error.message})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export { registerUser, loginUser, getProfile,updateProfile }