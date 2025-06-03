import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Spinner from "../components/layout/Spinner"

export default function HistoriqueMovements() {
  const [mouvements, setMouvements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const movementsPerPage = 10

  useEffect(() => {
    fetchMouvements()
  }, [])

  const fetchMouvements = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8000/api/stock-movements")
      setMouvements(res.data)
    } catch (err) {
      setError("Échec du chargement des mouvements.")
      console.error("Erreur de chargement des mouvements", err)
    } finally {
      setLoading(false)
    }
  }

  const getMovementTypeClass = (type) => {
    switch (type) {
      case "entrée":
        return "bg-green-100 text-green-800"
      case "sortie":
        return "bg-red-100 text-red-800"
      case "ajustement":
        return "bg-yellow-100 text-yellow-800"
      case "transfert":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredMovements = mouvements.filter((movement) => {
    const productName = movement.product?.name?.toLowerCase() || ""
    const comment = movement.commentaire?.toLowerCase() || ""
    const searchTermLower = searchTerm.toLowerCase()

    return productName.includes(searchTermLower) || comment.includes(searchTermLower)
  })

  const totalPages = Math.ceil(filteredMovements.length / movementsPerPage)
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * movementsPerPage,
    currentPage * movementsPerPage
  )

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6">
      {error ? (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center text-red-700">
            <p className="font-medium">Error : Could not load historique</p>
          </div>
          <p className="text-sm text-red-600 mt-1">
            It seems like the server might be down or there was a connection issue. Please try again later.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-xl font-bold mb-4">Historique mouvements</h3>

          {/* Search Bar */}
          <div className="relative flex items-center mb-6">
            <input
              type="text"
              placeholder="Rechercher par produit ou commentaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          {/* List Container */}
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-3">
              {paginatedMovements.length > 0 ? (
                paginatedMovements.map((mvt) => (
                  <li
                    key={mvt.id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {mvt.product?.name || "Produit inconnu"}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMovementTypeClass(
                            mvt.type_mouvement
                          )}`}
                        >
                          {mvt.type_mouvement.charAt(0).toUpperCase() +
                            mvt.type_mouvement.slice(1)}
                        </span>
                        <p className="mt-1">
                          Quantité :{" "}
                          <span className="font-medium">{mvt.quantite}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(mvt.date_mouvement).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <p className="text-sm italic text-gray-600 max-w-xs truncate">
                        {mvt.commentaire || "-"}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center py-4 text-gray-500">
                  No Historique mouvement found.
                </li>
              )}
            </ul>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Affichage de{" "}
                {(currentPage - 1) * movementsPerPage + 1} à{" "}
                {Math.min(
                  currentPage * movementsPerPage,
                  filteredMovements.length
                )}{" "}
                sur {filteredMovements.length} entrées
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
