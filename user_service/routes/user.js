const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  const sql = `
    INSERT INTO users (name, email, role, password, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(sql, [name, email, role, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: '✅ Utilisateur ajouté avec succès.',
      userId: result.insertId
    });
  });
});

module.exports = router;
