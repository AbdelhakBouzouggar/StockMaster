const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  event: { type: String, required: true },
  produit_id: { type: Number, required: true },
  product_name: { type: String, required: true },
  type_mouvement: { type: String, required: true },
  quantite: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  message: { type: String, required: true },
  status: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
