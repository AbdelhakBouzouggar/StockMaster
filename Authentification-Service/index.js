const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const authRoutes = require('./Routes/auth')

dotenv.config()
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

app.use('/api/auth', authRoutes)

const authMiddleware = require('./middleware/authMiddleware')
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.user}` })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
