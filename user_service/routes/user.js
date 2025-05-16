const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const db = require('../db')

router.post('/', async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email  || !password) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' })
    }

    const checkEmailSql = 'SELECT * FROM users WHERE email = ?'

    db.query(checkEmailSql, [email], async (checkErr, checkResult) => {
        if (checkErr) return res.status(500).json({ error: checkErr.message })
        
        if (checkResult.length > 0) {
            return res.status(409).json({ error: 'Cet email existe déjà.' })
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
        const role = 'gestionnaire'

        const sql = `INSERT INTO users (name, email, role, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW()) `

        db.query(sql, [name, email, role, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: err.message })

            res.status(201).json({
                message: 'Utilisateur ajouté avec succès.',
                userId: result.insertId
            })
        })
    })
})

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM users'

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message })

        res.status(200).json(results)
    })
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { name, email, oldPassword, newPassword } = req.body

    if (!name || !email) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' })
    }

    const checkEmailSql = 'SELECT * FROM users WHERE email = ? AND id != ?'

    db.query(checkEmailSql, [email, id], async (checkErr, checkResult) => {
        if (checkErr) return res.status(500).json({ error: checkErr.message })
        
        if (checkResult.length > 0) {
            return res.status(409).json({ error: 'Cet email existe déjà.' })
        }

        let hashedPassword = null

        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ error: 'Old password is required to change password.' })
            }

            const getUserSql = 'SELECT password FROM users WHERE id = ?'
            db.query(getUserSql, [id], async (err, results) => {
                if (err) return res.status(500).json({ error: err.message })
                if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé.' })

                const valid = await bcrypt.compare(oldPassword, results[0].password)
                if (!valid) return res.status(401).json({ error: 'Old password is incorrect.' })

                hashedPassword = await bcrypt.hash(newPassword, 10)

                const sql = `UPDATE users SET name = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?`
                db.query(sql, [name, email, hashedPassword, id], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message })
                    if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé.' })
                    return res.status(200).json({ message: 'Utilisateur mis à jour avec succès.' })
                })
            })
        } else {
            const sql = `UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?`
            db.query(sql, [name, email, id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message })
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé.' })
                return res.status(200).json({ message: 'Utilisateur mis à jour avec succès.' })
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const sql = 'DELETE FROM users WHERE id = ?'

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message })

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' })
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' })
    })
})

module.exports = router
