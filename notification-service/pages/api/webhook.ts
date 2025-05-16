// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';

// Types pour Socket.IO avec Next.js
interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// Type pour les données de notification
interface StockNotification {
  type: 'add' | 'remove';
  product: {
    id: number;
    name: string;
    category?: string;
    image?: string;
    price?: number;
  };
  quantity: number;
  timestamp?: string;
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const notification = req.body as StockNotification;

    // Validation des données
    if (!notification.type || !notification.product || notification.quantity === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        requiredFields: ['type', 'product', 'quantity']
      });
    }

    // Initialiser Socket.IO si pas déjà fait
    if (!res.socket.server.io) {
      console.log('Initialisation de Socket.IO');
      const io = new SocketIOServer(res.socket.server);
      res.socket.server.io = io;

      io.on('connection', (socket) => {
        console.log('Client connecté:', socket.id);
        socket.on('disconnect', () => {
          console.log('Client déconnecté:', socket.id);
        });
      });
    }

    // Ajouter un timestamp si non fourni
    const fullNotification: StockNotification = {
      ...notification,
      timestamp: notification.timestamp || new Date().toISOString(),
    };
    
    // Envoyer la notification à tous les clients connectés
    console.log('Émission de notification:', fullNotification);
    res.socket.server.io.emit('stock-update', fullNotification);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur de webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}