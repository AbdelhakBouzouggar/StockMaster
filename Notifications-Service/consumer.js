// consumer.js
const amqp = require('amqplib');
const mongoose = require('mongoose');
const Notification = require('./models/Notification');  

mongoose.connect('mongodb://localhost:27017/notifications-service')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Connexion à RabbitMQ
async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('notifications');

  console.log('⏳ Waiting for messages in notifications queue...');
  channel.consume('notifications', async (msg) => {
    const content = JSON.parse(msg.content.toString());

    content.user_id = new mongoose.Types.ObjectId(content.user_id);

    const notification = new Notification(content);
    await notification.save();
    console.log('✅ Notification saved:', content);

    channel.ack(msg);  
  });
}

connectRabbitMQ();  
