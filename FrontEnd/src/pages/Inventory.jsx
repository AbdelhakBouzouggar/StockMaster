import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiFilter, HiOutlineSearch, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineExclamationCircle } from 'react-icons/hi'
import { useNotification } from '../context/NotificationContext'

function Inventory() {
    const [products, setProducts] = useState([
        { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', price: 999.99, quantity: 25, status: 'In Stock' },
        { id: 2, name: 'MacBook Air M2', category: 'Electronics', price: 1199.99, quantity: 15, status: 'In Stock' },
        { id: 3, name: 'Logitech MX Master 3', category: 'Accessories', price: 99.99, quantity: 8, status: 'Low Stock' },
        { id: 4, name: 'Samsung Galaxy S22', category: 'Electronics', price: 799.99, quantity: 20, status: 'In Stock' },
        { id: 5, name: 'Desk Chair', category: 'Furniture', price: 249.99, quantity: 5, status: 'Low Stock' },
        { id: 6, name: 'Monitor Stand', category: 'Accessories', price: 49.99, quantity: 0, status: 'Out of Stock' },
        { id: 7, name: 'Wireless Keyboard', category: 'Accessories', price: 79.99, quantity: 12, status: 'In Stock' },
        { id: 8, name: 'HDMI Cable', category: 'Accessories', price: 19.99, quantity: 30, status: 'In Stock' },
        { id: 9, name: 'Wireless Mouse', category: 'Accessories', price: 39.99, quantity: 3, status: 'Low Stock' },
        { id: 10, name: 'External SSD 1TB', category: 'Storage', price: 149.99, quantity: 0, status: 'Out of Stock' },
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const [sortField, setSortField] = useState('name')
    const [sortDirection, setSortDirection] = useState('asc')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)

    const categories = [...new Set(products.map(product => product.category))]

    const statuses = ['In Stock', 'Low Stock', 'Out of Stock']

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true
        const matchesStatus = statusFilter ? product.status === statusFilter : true
        
        return matchesSearch && matchesCategory && matchesStatus
    }).sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1
        } else {
            return a[sortField] < b[sortField] ? 1 : -1
        }
    })

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const handleEditProduct = (product) => {
        setCurrentProduct(product)
        setIsModalOpen(true)
    }

    const handleAddProduct = () => {
        setCurrentProduct(null)
        setIsModalOpen(true)
    }

    const handleDeleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(product => product.id !== id))
            notify.success('Product deleted successfully!')
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
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-gray-600">Manage and track your product inventory</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                    <button 
                        onClick={handleAddProduct}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <HiPlus className="mr-2" /> Add Product
                    </button>
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
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        </div>
                        
                        <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
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
                                    className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
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
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                            <motion.tr
                                key={product.id}
                                variants={itemVariants}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{product.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.quantity}</div>
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
                                <button 
                                    onClick={() => handleEditProduct(product)}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                    <HiPencil className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <HiTrash className="h-5 w-5" />
                                </button>
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
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
                        <span className="font-medium">{products.length}</span> products
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.15)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
                >
                    <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {currentProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    <form className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product name"
                            defaultValue={currentProduct?.name || ''}
                        />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                            </label>
                            <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={currentProduct?.category || ''}
                            >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                            <option value="new">+ Add New</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                            </label>
                            <input
                            type="number"
                            step="0.01"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            defaultValue={currentProduct?.price || ''}
                            />
                        </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                            </label>
                            <input
                            type="number"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                            defaultValue={currentProduct?.quantity || ''}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                            </label>
                            <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={currentProduct?.status || 'In Stock'}
                            >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                            </select>
                        </div>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        </div>
                    </form>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => {
                            const modal = document.querySelector('.fixed.inset-0 .bg-white')
                            const inputs = modal.querySelectorAll('input, select')
                            const name = inputs[0].value.trim()
                            const category = inputs[1].value
                            const price = parseFloat(inputs[2].value)
                            const quantity = parseInt(inputs[3].value, 10)
                            const status = inputs[4].value
                            if (!name || !category || isNaN(price) || isNaN(quantity) || !status) {
                            notify.error('Please fill in all fields correctly.')
                            return
                            }
                            if (currentProduct) {
                            setProducts(products.map(p =>
                                p.id === currentProduct.id
                                ? { ...p, name, category, price, quantity, status }
                                : p
                            ))
                            notify.success('Product updated successfully!')
                            } else {
                            setProducts([
                                ...products,
                                {
                                id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
                                name,
                                category,
                                price,
                                quantity,
                                status
                                }
                            ])
                            notify.success('Product added successfully!')
                            }
                            setIsModalOpen(false)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                        {currentProduct ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                    </div>
                </motion.div>
                </div>
            )}
        </motion.div>
    )
}

export default Inventory
