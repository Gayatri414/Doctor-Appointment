import express from 'express'
import { registerUser } from '../controllers/userController.js'
import { loginUser } from '../controllers/userController.js'
import authUser from '../middleware/authMiddleware.js'

const userRouter = express.Router()

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Protected route example
userRouter.get('/profile', authUser, (req, res) => {
    res.json({
        success: true,
        message: "Access Granted",
        userId: req.userId
    })
})

export default userRouter