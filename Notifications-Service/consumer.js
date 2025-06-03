const amqp = require('amqplib');
const mongoose = require('mongoose');
const Notification = require('./models/Notification');

// Connect to MongoDB
async function connectMongo() {
  try {
    await mongoose.connect('mongodb://localhost:27017/notifications-service');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

// Start RabbitMQ consumer
async function startConsumer() {
  await connectMongo();

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'notifications';
    await channel.assertQueue(queue, { durable: true });

    console.log('⏳ Waiting for messages in queue:', queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log('📦 Message reçu:', content);

          if (content.event === 'stock.movement') {
            const notification = new Notification({
              event: content.event,
              produit_id: content.produit_id,
              product_name: content.name,
              type_mouvement: content.type_mouvement,
              quantite: content.quantite,
              user_id: content.utilisateur_id || null,
              message: `Stock ${content.type_mouvement} de ${content.quantite} unités du produit ${content.name}`,
              status: content.status || null,
              timestamp: new Date()
            });

            await notification.save();
            console.log('✅ Notification enregistrée dans MongoDB');

            channel.ack(msg);
          } else {
            console.warn('⚠️ Événement non pris en charge:', content.event);
            channel.ack(msg);
          }
        } catch (err) {
          console.error('❌ Erreur lors du traitement du message:', err);
          channel.nack(msg, false, false); // Requeue or reject based on need
        }
      }
    }, { noAck: false }); // Make sure ack is handled manually

  } catch (error) {
    console.error('❌ RabbitMQ Consumer error:', error);
  }
}

startConsumer();