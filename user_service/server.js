const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// 1) Autoriser toutes les origines (en dev)
app.use(cors());

// 2) JSON + routes API
app.use(express.json());
app.use('/api/users', require('./routes/user'));

// 3) Servir les fichiers statiques (ton formulaire)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
