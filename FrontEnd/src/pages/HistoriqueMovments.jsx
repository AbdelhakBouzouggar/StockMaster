import { useState, useEffect } from "react";
import axios from "axios";

export default function HistoriqueMovments() {
  const [mouvements, setMouvements] = useState([]);

  useEffect(() => {
    fetchMouvements();
  }, []);

  const fetchMouvements = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/stock-movements");
      setMouvements(res.data);
    } catch (err) {
      console.error("Erreur de chargement des mouvements", err);
    }
  };

  return (
    <>
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Historique des mouvements</h3>
        <div className="max-h-96 overflow-y-auto"> {/* Added scroll container */}
          <ul className="space-y-2 pr-2"> {/* Added pr-2 to prevent content from touching scrollbar */}
            {mouvements.map((mvt) => (
              <li
                key={mvt.id}
                className="p-4 border rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{mvt.produit?.nom || "Produit inconnu"}</p>
                  <p>
                    {mvt.type_mouvement} | {mvt.quantite} unités
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(mvt.date_mouvement).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600 italic">{mvt.commentaire}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}