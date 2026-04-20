import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js'; 
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import { doctorList } from './controllers/doctorController.js';
import userRouter from './routes/userRoute.js';

// Always load env from backend/.env (independent of cwd)
dotenv.config({ path: new URL('./.env', import.meta.url) });
//app config
const app=express();
const port =process.env.PORT||4000
connectCloudinary();

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
// Fallback: ensure public doctor list is reachable
app.get('/api/doctor/list', doctorList)
app.use('/api/user',userRouter)


app.get('/',(req,res)=>{
res.send('API WORKING')
})

const startServer = async () => {
  await connectDB()
  app.listen(port,()=>console.log("Server Started",port))
}

startServer()