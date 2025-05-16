const express = require('express');
const amqp = require('amqplib');
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/notifications-service')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// 📨 Créer une connexion RabbitMQ
async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('notifications');

  console.log('⏳ Waiting for messages in notifications queue...');
  channel.consume('notifications', async (msg) => {
    const content = JSON.parse(msg.content.toString());
    const notification = new Notification(content);
    await notification.save();
    console.log('✅ Notification saved:', content);
    channel.ack(msg);
  });
}

connectRabbitMQ();

// 🧾 GET notifications
app.get('/notifications', async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});
// 🧾 GET notifications par utilisateur
app.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Erreur récupération notifications:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`✅ Notification Service running on port ${PORT}`);
});
