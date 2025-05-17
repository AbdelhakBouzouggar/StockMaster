const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        if (!['employe', 'gestionnaire', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ username, email, password: hashedPassword, role })
        await newUser.save()

        res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'User undefined!' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' })

        const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        )

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
