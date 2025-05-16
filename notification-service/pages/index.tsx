// pages/index.tsx
import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, VStack, Badge, Flex, Divider } from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';

// Type pour les notifications
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
  timestamp: string;
}

export default function Home() {
  const [notifications, setNotifications] = useState<StockNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connexion au socket
    const socketInit = io();
    setSocket(socketInit);

    socketInit.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
      setIsConnected(true);
    });

    socketInit.on('disconnect', () => {
      console.log('Déconnecté du serveur Socket.IO');
      setIsConnected(false);
    });

    // Écouter les notifications de stock
    socketInit.on('stock-update', (data: StockNotification) => {
      console.log('Notification reçue:', data);
      setNotifications((prev) => [data, ...prev].slice(0, 100)); // Garder 100 max
    });

    return () => {
      socketInit.disconnect();
    };
  }, []);

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" mb={4} textAlign="center">
        Tableau de bord des notifications de stock
      </Heading>
      
      <Flex justifyContent="center" mb={6}>
        <Badge 
          colorScheme={isConnected ? 'green' : 'red'} 
          fontSize="md" 
          p={2} 
          borderRadius="md"
        >
          {isConnected ? 'Connecté au serveur' : 'Déconnecté'}
        </Badge>
      </Flex>
      
      <Divider mb={6} />
      
      <VStack spacing={4} align="stretch">
        {notifications.length === 0 ? (
          <Box p={6} borderWidth={1} borderRadius="lg" textAlign="center" bg="gray.50">
            <Text>En attente de notifications...</Text>
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <Box 
              key={index} 
              p={4} 
              borderWidth={1} 
              borderRadius="md" 
              borderLeftWidth={4}
              borderLeftColor={notification.type === 'add' ? 'green.400' : 'red.400'}
              bg="white"
              shadow="sm"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Badge colorScheme={notification.type === 'add' ? 'green' : 'red'}>
                  {notification.type === 'add' ? 'Ajout au stock' : 'Retrait du stock'}
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {new Date(notification.timestamp).toLocaleString()}
                </Text>
              </Flex>
              
              <Text fontWeight="bold" mt={2}>
                Produit: {notification.product.name}
              </Text>
              
              {notification.product.category && (
                <Text fontSize="sm" color="gray.600">
                  Catégorie: {notification.product.category}
                </Text>
              )}
              
              <Text mt={1}>
                Quantité: {notification.type === 'add' ? '+' : ''}{notification.quantity}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
}