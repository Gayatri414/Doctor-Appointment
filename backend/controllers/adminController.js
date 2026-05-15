
import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import adminModel from "../models/adminModel.js"
import jwt from 'jsonwebtoken'
//API for adding doctor
const addDoctor=async(req,res)=>{
try{
const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
const imageFile=req.file

//checking for all data to add doctor
if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!address){
    return res.json({success:false,message:"Missing Details"})
}

let parsedAddress = address
if (typeof address === "string") {
  try {
    parsedAddress = JSON.parse(address.trim())
  } catch (e) {
    return res.json({ success: false, message: "Invalid address format" })
  }
}
//validating email format
if(!validator.isEmail(email)){
 return res.json({success:false,message:"Please enter a valid email"})
}

//validating strong password
if(password.length<8){
    return res.json({success:false,message:"Please enter a strong password"})
}
//hashing doctor password
const salt=await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)

//upload image to cloudinary
const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
const imageUrl=imageUpload.secure_url

const doctorData={
    name,
    email,
    image:imageUrl,
    password:hashedPassword,
    speciality,
    degree,
    experience,
    about,
    fees,
    address: parsedAddress,
    date:Date.now()

}
const newDoctor=new doctorModel(doctorData)
await newDoctor.save()

res.json({success:true,message:"Doctor Added"})

}catch(error){
console.log(error)
res.json({success:false,message:error.message})
}
}
//api for the admin login


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Create or update admin profile in database
            let admin = await adminModel.findOne({ email: process.env.ADMIN_EMAIL });
            
            if (!admin) {
                // Create default admin profile if it doesn't exist
                admin = new adminModel({
                    name: "Administrator",
                    email: process.env.ADMIN_EMAIL,
                    phone: "",
                    address: "",
                    image: ""
                });
                await admin.save();
                console.log("✅ Default admin profile created");
            }

            const token = jwt.sign(
                { 
                    email,
                    id: admin._id,
                    role: "admin"
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.json({
                success: true,
                token,
                admin: {
                    name: admin.name,
                    email: admin.email,
                    role: "admin"
                }
            });
        } else {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (error) {
        console.log("Admin login error:", error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};
//api to get all doctor list for admin panel
const allDoctors = async (req, res) => {
  try {
    console.log("ALL DOCTORS HIT ✅");
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log("ERROR IN allDoctors:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get admin profile
const getAdminProfile = async (req, res) => {
  try {
    console.log("ADMIN PROFILE ROUTE HIT ✅");
    console.log("Admin email from token:", req.adminEmail);
    
    // Find admin by email from the JWT token
    const admin = await adminModel.findOne({ email: req.adminEmail }).select("-__v");
    
    if (!admin) {
      // Create default admin profile if it doesn't exist
      const newAdmin = new adminModel({
        name: "Administrator",
        email: req.adminEmail,
        phone: "",
        address: "",
        image: ""
      });
      await newAdmin.save();
      
      console.log("✅ Created default admin profile");
      return res.status(200).json({
        success: true,
        admin: newAdmin
      });
    }

    console.log("✅ Admin profile found:", admin.name);
    res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    console.log("ADMIN PROFILE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// API to update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    console.log("UPDATE ADMIN PROFILE HIT ✅");
    console.log("Admin email from token:", req.adminEmail);
    console.log("Update data:", req.body);
    
    const { name, email, phone, address } = req.body;
    
    // Find and update admin profile
    const admin = await adminModel.findOneAndUpdate(
      { email: req.adminEmail },
      {
        name: name || "Administrator",
        phone: phone || "",
        address: address || ""
        // Note: We don't update email as it's tied to environment variable
      },
      { new: true, upsert: true }
    ).select("-__v");

    console.log("✅ Admin profile updated:", admin.name);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin
    });

  } catch (error) {
    console.log("UPDATE ADMIN PROFILE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export { addDoctor, loginAdmin, allDoctors, getAdminProfile, updateAdminProfile };