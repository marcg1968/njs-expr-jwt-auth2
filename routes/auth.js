import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

const router = express.Router()

// register a new user
router.post('/register', async (req, res) => {
    const { user: username, email, pw: password } = req.body || {}
    if (!username || !email || !pw) return res.status(500).json({ err: `at least one param missing`})
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()

        res.status(201).json({ message: 'User created successfully' })
    }
    catch (err) {
        console.log(24, err)
        res.status(500).json({ message: 'Server error' })
    }
})

// log in and issue JWT
router.post('/login', async (req, res) => {
    const { email = '', pw: password = '' } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const payload = { id: user._id, email: user.email }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })

        res.json({ token })
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// export default router
export const authRouter = router
