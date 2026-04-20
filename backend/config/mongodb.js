import mongoose from "mongoose";
const connectDB=async()=>{
  mongoose.connection.on('connected',()=>console.log("Database Connected"))
  mongoose.connection.on('error',(err)=>console.log("Database Connection Error:", err?.message || err))

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log("Database not connected: MONGODB_URI is missing")
    return false
  }

  try {
    await mongoose.connect(uri)
    return true
  } catch (err) {
    console.log("Database not connected:", err?.message || err)
    return false
  }
}
export default connectDB