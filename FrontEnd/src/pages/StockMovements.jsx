import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel API pour récupérer les mouvements de stock
    axios.get('http://localhost:3000/api/stock-movements')
      .then(response => {
        setMovements(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Mouvements de Stock</h2>
      <ul>
        {movements.map((mvt) => (
          <li key={mvt._id}>
            <strong>Produit:</strong> {mvt.product_name} <br />
            <strong>Type:</strong> {mvt.type_mouvement} <br />
            <strong>Quantité:</strong> {mvt.quantite} <br />
            <strong>Utilisateur:</strong> {mvt.user_id} <br />
            <small>{new Date(mvt.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockMovements;
