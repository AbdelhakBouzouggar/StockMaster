const amqp = require('amqplib');
const mongoose = require('mongoose');
const Notification = require('./models/notificationModel');

async function connectMongo() {
  try {
    await mongoose.connect('mongodb://localhost:27017/notifications-service');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(' MongoDB connection error:', error);
  }
}

async function startConsumer() {
  await connectMongo();

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'notifications';
await channel.assertQueue(queue, { durable: true });

    console.log(' Waiting for messages in queue:', queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log(' Message reçu:', content);

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
          console.log(' Notification enregistrée dans MongoDB');

          console.log(' Stock movement:', {
            product: content.name,
            movementType: content.type_mouvement,
            quantity: content.quantite,
            user: content.utilisateur_id
          });
        }

        channel.ack(msg); 
      }
    });
  } catch (error) {
    console.error(' RabbitMQ Consumer error:', error);
  }
}

startConsumer();
