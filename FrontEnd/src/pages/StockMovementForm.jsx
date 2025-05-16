import { useState, useEffect } from "react";
import axios from "axios";
import laravelApi from '../api/laravelApi';
import { FaEdit } from "react-icons/fa";

function StockMovementForm() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    id: null,
    produit_id: "",
    type_mouvement: "",
    quantite: "",
    commentaire: "",
    utilisateur_id: user.id,
  });

  const [produits, setProduits] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // 👈 Toggle form
  const [isEditing, setIsEditing] = useState(false); // 👈 Editing mode

  useEffect(() => {
    fetchProduits();
    fetchMouvements();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await laravelApi.get('/produits');
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur de chargement des produits", err);
    }
  };

  const fetchMouvements = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/stock-movements");
      setMouvements(res.data);
    } catch (err) {
      console.error("Erreur de chargement des mouvements", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/stock-movements/${formData.id}`, formData);
        setMessage("Mouvement mis à jour avec succès.");
      } else {
        await axios.post("http://localhost:8000/api/stock-movements", formData);
        setMessage("Mouvement enregistré avec succès.");
      }

      setFormData({
        id: null,
        produit_id: "",
        type_mouvement: "",
        quantite: "",
        commentaire: "",
        utilisateur_id: user.id,
      });
      setIsEditing(false);
      setShowForm(false);
      fetchMouvements();
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'enregistrement.");
    }
  };

  const handleEdit = (mvt) => {
    setFormData({
      id: mvt.id,
      produit_id: mvt.produit_id,
      type_mouvement: mvt.type_mouvement,
      quantite: mvt.quantite,
      commentaire: mvt.commentaire || "",
      utilisateur_id: mvt.utilisateur_id,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mouvements de stock</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({
              id: null,
              produit_id: "",
              type_mouvement: "",
              quantite: "",
              commentaire: "",
              utilisateur_id: user.id,
            });
            setIsEditing(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Fermer" : "Ajouter Mouvement"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {message && <p className="text-green-600">{message}</p>}

          <div>
            <label className="block mb-1">Produit</label>
            <select
              name="produit_id"
              value={formData.produit_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Choisir un produit --</option>
              {produits.map((produit) => (
                <option key={produit.id} value={produit.id}>
                  {produit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Type de mouvement</label>
            <select
              name="type_mouvement"
              value={formData.type_mouvement}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Choisir un type --</option>
              <option value="entrée">Entrée</option>
              <option value="sortie">Sortie</option>
              <option value="ajustement">Ajustement</option>
              <option value="transfert">Transfert</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Quantité</label>
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Commentaire</label>
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? "Mettre à jour" : "Enregistrer"}
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold mb-3">Historique des mouvements</h3>
<div className="max-h-96 overflow-y-auto"> {/* Scroll container */}
  <ul className="space-y-2 pr-2"> {/* Added right padding */}
    {mouvements.map((mvt) => (
      <li
        key={mvt.id}
        className="p-4 border rounded shadow-sm flex justify-between items-center"
      >
        <div>
          <p className="font-medium">{mvt.produit?.name || "Produit inconnu"}</p>
          <p>{mvt.type_mouvement} | {mvt.quantite} unités</p>
          <p className="text-sm text-gray-500">
            {new Date(mvt.date_mouvement).toLocaleString()}
          </p>
          <p className="text-sm italic text-gray-600">{mvt.commentaire}</p>
        </div>
        <button
          onClick={() => handleEdit(mvt)}
          className="text-blue-500 hover:underline"
        >
          <FaEdit />
        </button>
      </li>
    ))}
  </ul>
</div>
    </div>
  );
}

export default StockMovementForm;
