import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import laravelApi from "../api/laravelApi"
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiFilter,
  HiOutlineSearch,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiArrowUp,
  HiArrowDown,
  HiAdjustments,
} from "react-icons/hi"
import Spinner from '../components/layout/Spinner'
import { useNotification } from '../context/NotificationContext'

function StockMovementForm() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [formData, setFormData] = useState({
    id: null,
    produit_id: "",
    type_mouvement: "",
    quantite: "",
    commentaire: "",
    utilisateur_id: user.id,
  })

  const { notify } = useNotification()

  const [produits, setProduits] = useState([])
  const [mouvements, setMouvements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMovement, setCurrentMovement] = useState(null)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Sorting
  const [sortField, setSortField] = useState("date_mouvement")
  const [sortDirection, setSortDirection] = useState("desc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const movementsPerPage = 10

  useEffect(() => {
    fetchProduits()
    fetchMouvements()
  }, [])

  useEffect(() => {
    if (currentMovement) {
      setFormData({
        id: currentMovement.id,
        produit_id: currentMovement.produit_id,
        type_mouvement: currentMovement.type_mouvement,
        quantite: currentMovement.quantite,
        commentaire: currentMovement.commentaire || "",
        utilisateur_id: currentMovement.utilisateur_id || user.id,
      })
    } else {
      setFormData({
        id: null,
        produit_id: "",
        type_mouvement: "",
        quantite: "",
        commentaire: "",
        utilisateur_id: user.id,
      })
    }
  }, [currentMovement])

  const fetchProduits = async () => {
    try {
      const res = await laravelApi.get("/produits")
      setProduits(res.data)
    } catch (err) {
      console.error("Erreur de chargement des produits", err)
    }
  }

  const fetchMouvements = async () => {
    setLoading(true)
    try {
      const res = await laravelApi.get("/stock-movements")
      setMouvements(res.data)
    } catch (err) {
      setError("Échec du chargement des mouvements.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      if (currentMovement) {
        await laravelApi.put(`/stock-movements/${formData.id}`, formData)
      } else {
        await laravelApi.post("/stock-movements", formData)
      }
      fetchMouvements()
      closeModal()
    } catch (err) {
      console.error("Erreur lors de l'enregistrement.", err)
    }
  }

  const handleEdit = (movement) => {
    setCurrentMovement(movement)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce mouvement ?")) return
    try {
      await laravelApi.delete(`/stock-movements/${id}`)
      setMouvements(mouvements.filter((mvt) => mvt.id !== id))
    } catch (err) {
      console.error("Erreur lors de la suppression.", err)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentMovement(null)
  }

  const getMovementTypeIcon = (type) => {
    switch (type) {
      case "entrée":
        return <HiArrowUp className="h-4 w-4 text-green-600" />
      case "sortie":
        return <HiArrowDown className="h-4 w-4 text-red-600" />
      case "ajustement":
        return <HiAdjustments className="h-4 w-4 text-yellow-600" />
      default:
        return null
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

  const filteredMovements = mouvements
    .filter((movement) => {
      const productName = movement.product?.name?.toLowerCase() || ""
      const comment = movement.commentaire?.toLowerCase() || ""
      const matchesSearch =
        productName.includes(searchTerm.toLowerCase()) ||
        comment.includes(searchTerm.toLowerCase())
      const matchesProduct = productFilter
        ? String(movement.produit_id) === productFilter
        : true
      const matchesType = typeFilter
        ? movement.type_mouvement === typeFilter
        : true
      return matchesSearch && matchesProduct && matchesType
    })
    .sort((a, b) => {
      let valueA = a[sortField]
      let valueB = b[sortField]

      if (sortField === "date_mouvement") {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      {error ? (
        <>
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center text-red-700">
                <HiOutlineExclamationCircle className="h-6 w-6 mr-2" />
                <p className="font-medium">Error: Could not load stock movements</p>
                </div>
                <p className="text-sm text-red-600 mt-1">
                It seems like the server might be down or there was a connection issue. Please try again later.
                </p>
            </div>
        </>
    ) : (loading ? (
        <div className="flex justify-center items-center h-40">
            <Spinner />
        </div>
    ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mouvements de stock</h2>
            <button
              onClick={() => {
                setCurrentMovement(null)
                setIsModalOpen(true)
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <HiPlus className="mr-2" /> Ajouter Mouvement
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <HiOutlineSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par produit ou commentaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <HiFilter className="mr-2" /> Filtres
                {showFilters ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produit
                  </label>
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                  >
                    <option value="">Tous les produits</option>
                    {produits.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                  >
                    <option value="">Tous les types</option>
                    <option value="entrée">Entrée</option>
                    <option value="sortie">Sortie</option>
                    <option value="ajustement">Ajustement</option>
                    <option value="transfert">Transfert</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setProductFilter("")
                      setTypeFilter("")
                    }}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Effacer les filtres
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort("produit_id")}
                      className="px-6 py-3 text-left cursor-pointer"
                    >
                      Produit{" "}
                      {sortField === "produit_id" &&
                        (sortDirection === "asc" ? (
                          <HiOutlineChevronUp />
                        ) : (
                          <HiOutlineChevronDown />
                        ))}
                    </th>
                    <th
                      onClick={() => handleSort("type_mouvement")}
                      className="px-6 py-3 text-left cursor-pointer"
                    >
                      Type{" "}
                      {sortField === "type_mouvement" &&
                        (sortDirection === "asc" ? (
                          <HiOutlineChevronUp />
                        ) : (
                          <HiOutlineChevronDown />
                        ))}
                    </th>
                    <th
                      onClick={() => handleSort("quantite")}
                      className="px-6 py-3 text-left cursor-pointer"
                    >
                      Quantité{" "}
                      {sortField === "quantite" &&
                        (sortDirection === "asc" ? (
                          <HiOutlineChevronUp />
                        ) : (
                          <HiOutlineChevronDown />
                        ))}
                    </th>
                    <th
                      onClick={() => handleSort("date_mouvement")}
                      className="px-6 py-3 text-left cursor-pointer"
                    >
                      Date{" "}
                      {sortField === "date_mouvement" &&
                        (sortDirection === "asc" ? (
                          <HiOutlineChevronUp />
                        ) : (
                          <HiOutlineChevronDown />
                        ))}
                    </th>
                    <th className="px-6 py-3 text-left">Commentaire</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedMovements.length > 0 ? (
                    paginatedMovements.map((mvt) => (
                      <tr key={mvt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{mvt.product?.name || "Inconnu"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMovementTypeClass(
                              mvt.type_mouvement
                            )}`}
                          >
                            {getMovementTypeIcon(mvt.type_mouvement)}
                            <span className="ml-1">{mvt.type_mouvement}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">{mvt.quantite}</td>
                        <td className="px-6 py-4">
                          {new Date(mvt.date_mouvement).toLocaleString("fr-FR")}
                        </td>
                        <td className="px-6 py-4 truncate max-w-xs">
                          {mvt.commentaire || "-"}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(mvt)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <HiPencil />
                          </button>
                          <button
                            onClick={() => handleDelete(mvt.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <HiTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No mouvement found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
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
          </div>

          {/* Modal Form */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen">
                <div
                  className="fixed inset-0 bg-black opacity-50"
                  onClick={closeModal}
                ></div>
                <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-10">
                  <h3 className="text-lg font-semibold mb-4">
                    {currentMovement
                      ? "Modifier le mouvement"
                      : "Ajouter un mouvement"}
                  </h3>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                      <div>
                        <label>Produit</label>
                        <select
                          name="produit_id"
                          value={formData.produit_id}
                          onChange={handleChange}
                          className="w-full border rounded p-2"
                          required
                        >
                          <option value="">-- Choisir --</option>
                          {produits.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Type</label>
                        <select
                          name="type_mouvement"
                          value={formData.type_mouvement}
                          onChange={handleChange}
                          className="w-full border rounded p-2"
                          required
                        >
                          <option value="">-- Choisir --</option>
                          <option value="entrée">Entrée</option>
                          <option value="sortie">Sortie</option>
                          <option value="ajustement">Ajustement</option>
                          <option value="transfert">Transfert</option>
                        </select>
                      </div>
                      <div>
                        <label>Quantité</label>
                        <input
                          type="number"
                          name="quantite"
                          value={formData.quantite}
                          onChange={handleChange}
                          className="w-full border rounded p-2"
                          required
                        />
                      </div>
                      <div>
                        <label>Commentaire</label>
                        <textarea
                          name="commentaire"
                          value={formData.commentaire}
                          onChange={handleChange}
                          rows={3}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border rounded"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {currentMovement ? "Mettre à jour" : "Enregistrer"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
    ))}
    </motion.div>
  )
}

export default StockMovementForm
