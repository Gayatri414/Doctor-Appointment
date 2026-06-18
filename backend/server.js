import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js'; 
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import mockPaymentRouter from './routes/mockPaymentRoute.js';
import { doctorList } from './controllers/doctorController.js';

// Always load env from backend/.env (independent of cwd)
dotenv.config({ path: new URL('./.env', import.meta.url) });

// Debug JWT_SECRET on startup
console.log("=== STARTUP DEBUG ===");
console.log("JWT SECRET:", process.env.JWT_SECRET);
console.log("JWT SECRET LENGTH:", process.env.JWT_SECRET?.length);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

//app config
const app = express();
const port = process.env.PORT || 4000;
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors({
  origin: [
    'https://doctor-appointment-three-beige.vercel.app',
    'https://doctor-appointment-7p5d.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

//api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/mock-payment', mockPaymentRouter);

// Fallback: ensure public doctor list is reachable
app.get('/api/doctor/list', doctorList);

app.get('/', (req, res) => {
  res.send('API WORKING');
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => console.log("Server Started", port));
};

startServer();