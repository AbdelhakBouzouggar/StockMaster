const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ message: 'No auth token, access denied' })

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified.id
        next()
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, access denied' })
    }
}

module.exports = authMiddleware
