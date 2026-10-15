import User from '../models/user.js'
import Resume from '../models/resume.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Generate JWT token
const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    return token
}

// Controller for user registration
// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Missing required fields'
            })
        }

        // Check if user already exists
        const user = await User.findOne({ email: email.trim().toLowerCase() })

        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // Generate token
        const token = generateToken(newUser._id)

        newUser.password = undefined

        // Return success message
        return res.status(200).json({
            message: 'User created successfully',
            token,
            user: newUser
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for user login
// POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const user = await User.findOne({ email: email.trim().toLowerCase() })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            })
        }

        // Check if password is correct
        if (!(await user.comparePassword(password))) {
            return res.status(400).json({
                message: 'Invalid email or password'
            })
        }

        // Return success message
        const token = generateToken(user._id)

        user.password = undefined

        return res.status(200).json({
            message: 'Login successful',
            token,
            user
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for getting user by ID
// GET /api/users/data
const getUserById = async (req, res) => {
    try {
        const userId = req.userId

        // Check if user exists
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        // Return user
        user.password = undefined

        return res.status(200).json({
            user
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for getting user resumes
// GET /api/users/resumes
const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId

        // Return user resumes
        const resumes = await Resume.find({ userId })

        return res.status(200).json({
            resumes
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export {
    registerUser,
    loginUser,
    getUserById,
    getUserResumes
}