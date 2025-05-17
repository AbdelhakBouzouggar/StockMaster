const dotenv = require('dotenv')
const mysql = require('mysql2/promise')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('./models/User')

const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_service',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

dotenv.config()

const mongoUri = process.env.MONGO_URI

async function migrateUsers() {
    try {
        const mysqlPool = mysql.createPool(mysqlConfig)
        console.log('Connected to MySQL')

        console.log('Mongo URI:', mongoUri)

        await mongoose.connect(mongoUri)
        console.log('Connected to MongoDB')

        const [mysqlUsers] = await mysqlPool.query('SELECT id, name, email, password, role FROM users')
        console.log(`Found ${mysqlUsers.length} users in MySQL`)

        const mongoUsers = await User.find({})
        console.log(`Found ${mongoUsers.length} users in MongoDB`)

        const mongoEmails = new Set(mongoUsers.map(u => u.email))
        const mysqlEmails = new Set(mysqlUsers.map(u => u.email))

        for (const row of mysqlUsers) {
            const userData = {
                username: row.name,
                email: row.email,
                password: await bcrypt.hash(row.password, 10),
                role: row.role || 'employe'
            }

            const existingUser = await User.findOne({ email: row.email })

            if (!existingUser) {
                await User.create(userData)
                console.log(`Inserted user: ${row.email}`)
            } else {
                let needsUpdate = false
                for (const field in userData) {
                    if (userData[field] !== existingUser[field]) {
                        existingUser[field] = userData[field]
                        needsUpdate = true
                    }
                }

                if (needsUpdate) {
                    await existingUser.save()
                    console.log(`Updated user: ${row.email}`)
                } else {
                    console.log(`User ${row.email} is up to date`)
                }
                console.log(`User ${row.email} already exists in MongoDB`)
            }
        }

        for (const mongoUser of mongoUsers) {
            if (!mysqlEmails.has(mongoUser.email)) {
                await User.findByIdAndDelete(mongoUser._id)
                console.log(`Deleted user: ${mongoUser.email}`)
            }
        }

        console.log('Migration completed.')
        await mongoose.disconnect()
    } catch (error) {
        console.error('Error during migration:', error)
    }
}

migrateUsers().then(() => {
    console.log('Migration script finished.')
    process.exit(0)
}).catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
})
