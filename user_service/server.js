const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['*', 'GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json())
app.use('/api/users', require('./routes/user'))

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`))
