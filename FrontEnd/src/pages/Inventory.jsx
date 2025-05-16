import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiFilter, HiOutlineSearch, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineExclamationCircle, HiEye } from 'react-icons/hi'
import { useNotification } from '../context/NotificationContext'
import laravelApi from '../api/laravelApi'
import Spinner from '../components/layout/Spinner'

function Inventory() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        quantite: 0,
        image: '',
        categorie_id: null,
    })

    const [productsLoading, setProductsLoading] = useState(true)
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const isLoading = productsLoading || categoriesLoading
    const [error, setError] = useState(null)

    
    const fetchProducts = async () => {
        try {
            const response = await laravelApi.get('/produits')
            setProducts(response.data)
        } catch (err) {
            setError('Failed to load products.')
            console.error(err)
        } finally {
            setProductsLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await laravelApi.get('/categories')
            setCategories(res.data)
        } catch (err) {
            console.error('Failed to fetch categories:', err)
        } finally {
            setCategoriesLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const [sortField, setSortField] = useState('name')
    const [sortDirection, setSortDirection] = useState('asc')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 10

    useEffect(() => {
        if (currentProduct) {
            const categoryExists = categories.some(
                cat => cat.id === currentProduct.categorie_id
            )

            setFormData({
                name: currentProduct.name,
                description: currentProduct.description,
                price: currentProduct.price,
                quantite: currentProduct.quantite,
                image: currentProduct.image,
                categorie_id: categoryExists ? currentProduct.categorie_id : null,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                quantite: 0,
                image: '',
                categorie_id: null,
            });
        }
    }, [currentProduct, categories])

    const statuses = ['In Stock', 'Low Stock', 'Out of Stock']

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (product.category && product.category.nom
                            ?product.category.nom.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        const matchesCategory = categoryFilter ? product.category?.nom === categoryFilter : true
        const matchesStatus = statusFilter ? product.status === statusFilter : true
        
        return matchesSearch && matchesCategory && matchesStatus
    }).sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1
        } else {
            return a[sortField] < b[sortField] ? 1 : -1
        }
    })

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber)
    }

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    )

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const handleEditProduct = async (id, updatedData) => {
        try {
            const res = await laravelApi.put(`/produits/${id}`, updatedData)
            setProducts(products.map(p => p.id === id ? res.data : p))
            fetchProducts()
            fetchCategories()
            notify.success('Product updated successfully!')
        } catch (err) {
            notify.error('Failed to update product.')
            console.error(err)
        }
    }

    const handleAddProduct = async () => {

        const formDataObj = new FormData();

        formDataObj.append('name', formData.name);
        formDataObj.append('description', formData.description);
        formDataObj.append('price', formData.price);
        formDataObj.append('quantite', formData.quantite);
        formDataObj.append('categorie_id', formData.categorie_id);

        if (formDataObj.image) {
            formDataObj.append('image', formData.image);
        }

        try {
            const res = await laravelApi.post('/produits', formDataObj, {
                'Content-Type': 'multipart/form-data'
            })
            setProducts([...products, res.data])
            fetchProducts()
            fetchCategories()
            notify.success('Product added successfully!')
        } catch (err) {
            notify.error('Failed to add product.')
            console.error(err)
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try {
            await laravelApi.delete(`/produits/${id}`)
            setProducts(products.filter(p => p.id !== id))
            fetchProducts()
            fetchCategories()
            notify.success('Product deleted successfully!')
        } catch (err) {
            notify.error('Failed to delete product.')
            console.error(err)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    }

    const { notify } = useNotification()
    
    const user = JSON.parse(localStorage.getItem('user'))
    const userRole = user?.role || 'employe'
    const isGestionnaire = userRole === 'gestionnaire'
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            {error ? (
                <>
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center text-red-700">
                        <HiOutlineExclamationCircle className="h-6 w-6 mr-2" />
                        <p className="font-medium">Error: Could not load inventory</p>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                        It seems like the server might be down or there was a connection issue. Please try again later.
                        </p>
                    </div>
                </>
            ) : (isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                            <p className="text-gray-600">Manage and track your product inventory</p>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                            {isGestionnaire && (<button 
                                onClick={() => {
                                    setCurrentProduct(null)
                                    setIsModalOpen(true)
                                }}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                <HiPlus className="mr-2" /> Add Product
                            </button>)}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mb-6">
                        <div className="p-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                    placeholder="Search products by name or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                </div>
                                
                                <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                <HiFilter className="mr-2" /> Filters
                                {showFilters ? <HiOutlineChevronUp className="ml-1" /> : <HiOutlineChevronDown className="ml-1" />}
                                </button>
                            </div>
                            
                            {showFilters && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.nom}>{category.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer"
                                        >
                                            <option value="">All Statuses</option>
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="md:col-span-2 flex justify-end">
                                        <button 
                                            onClick={() => {
                                                setSearchTerm('')
                                                setCategoryFilter('')
                                                setStatusFilter('')
                                            }}
                                            className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('name')}
                                    >
                                    <div className="flex items-center space-x-1">
                                        <span>Product Name</span>
                                        {sortField === 'name' && (
                                        sortDirection === 'asc' ? 
                                            <HiOutlineChevronUp className="h-4 w-4" /> : 
                                            <HiOutlineChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                    </th>
                                    <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('category')}
                                    >
                                    <div className="flex items-center space-x-1">
                                        <span>Category</span>
                                        {sortField === 'category' && (
                                        sortDirection === 'asc' ? 
                                            <HiOutlineChevronUp className="h-4 w-4" /> : 
                                            <HiOutlineChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                    </th>
                                    <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('price')}
                                    >
                                    <div className="flex items-center space-x-1">
                                        <span>Price</span>
                                        {sortField === 'price' && (
                                        sortDirection === 'asc' ? 
                                            <HiOutlineChevronUp className="h-4 w-4" /> : 
                                            <HiOutlineChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                    </th>
                                    <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('quantity')}
                                    >
                                    <div className="flex items-center space-x-1">
                                        <span>Quantity</span>
                                        {sortField === 'quantity' && (
                                        sortDirection === 'asc' ? 
                                            <HiOutlineChevronUp className="h-4 w-4" /> : 
                                            <HiOutlineChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                    </th>
                                    <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}
                                    >
                                    <div className="flex items-center space-x-1">
                                        <span>Status</span>
                                        {sortField === 'status' && (
                                        sortDirection === 'asc' ? 
                                            <HiOutlineChevronUp className="h-4 w-4" /> : 
                                            <HiOutlineChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((product, index) => (
                                    <motion.tr
                                        key={product.id}
                                        variants={itemVariants}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{product.category?.nom}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${isNaN(parseFloat(product.price)) ? '0.00' : parseFloat(product.price).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.quantite}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${product.status === 'In Stock' 
                                            ? 'bg-green-100 text-green-800' 
                                            : product.status === 'Low Stock' 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-red-100 text-red-800'}`}
                                        >
                                            {product.status === 'Low Stock' && <HiOutlineExclamationCircle className="mr-1 h-4 w-4" />}
                                            {product.status}
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {!isGestionnaire ? (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            if (!categoriesLoading) {
                                                                setCurrentProduct(product)
                                                                setIsModalOpen(true)
                                                            }
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                                                    ><HiEye className="h-5 w-5" /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            if (!categoriesLoading) {
                                                                setCurrentProduct(product)
                                                                setIsModalOpen(true)
                                                            }
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                                                    >
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-600 hover:text-red-900 cursor-pointer"
                                                    >
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No products found matching your criteria.
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No products found matching the current filters.
                                </div>
                            ) : (
                                <div className="flex justify-between items-center px-6 py-3 bg-gray-50">
                                    <p className="text-sm text-gray-600">
                                        Showing {(currentPage - 1) * productsPerPage + 1} to{' '}
                                        {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                                    </p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50 cursor-pointer"
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => goToPage(i + 1)}
                                                className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                                                    currentPage === i + 1
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-600 border-gray-300'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50 cursor-pointer"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="flex items-center justify-center min-h-screen">
                                <div className="fixed inset-0 bg-opacity-75 transition-opacity" style={{ background: 'rgba(0, 0, 0, 0.15)' }} onClick={() => setIsModalOpen(false)}></div>

                                <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl z-10">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        {isGestionnaire ? (currentProduct ? 'Edit Product' : 'Add New Product') : "View Product"}
                                    </h2>
                                    
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (currentProduct) {
                                            handleEditProduct(currentProduct.id, formData);
                                        } else {
                                            handleAddProduct(formData);
                                        }
                                        setIsModalOpen(false);
                                    }}>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    required
                                                    readOnly={!isGestionnaire || false}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    readOnly={!isGestionnaire || false}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const num = value === '' ? '' : parseFloat(value);
                                                        setFormData({ ...formData, price: num });
                                                    }}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    required
                                                    readOnly={!isGestionnaire || false}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">Quantity</label>
                                                <input
                                                    type="number"
                                                    id="quantite"
                                                    name="quantite"
                                                    value={formData.quantite}
                                                    onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value, 10) })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    required
                                                    readOnly={!isGestionnaire || false}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                                                <input
                                                    type="text"
                                                    id="image"
                                                    name="image"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    readOnly={!isGestionnaire || false}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700">Category</label>
                                                <select
                                                    id="categorie_id"
                                                    name="categorie_id"
                                                    value={formData.categorie_id || ''}
                                                    onChange={(e) => setFormData({ ...formData, categorie_id: parseInt(e.target.value, 10) || null })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
                                                    disabled={!isGestionnaire || false}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category?.nom}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            {isGestionnaire && (<button
                                                type="submit"
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                            >
                                                {currentProduct ? 'Update Product' : 'Add Product'}
                                            </button>)}
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

export default Inventory
