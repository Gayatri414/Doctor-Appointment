import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Protected routes
userRouter.get('/profile', authUser, getProfile)
userRouter.get('/get-profile', authUser, getProfile)

userRouter.put(
  '/profile',
  authUser,
  upload.single('image'),
  updateProfile
)

export default userRouter