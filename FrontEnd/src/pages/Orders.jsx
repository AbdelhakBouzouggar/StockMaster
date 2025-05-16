import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineClock, HiOutlineCheckCircle, HiOutlineTruck, HiOutlineShoppingCart, HiOutlineX, HiOutlineExclamationCircle, HiOutlineInformationCircle, HiOutlineEye, HiFilter } from 'react-icons/hi'
import { useNotification } from '../context/NotificationContext'
import laravelApi from '../api/laravelApi'
import Spinner from '../components/layout/Spinner'

function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const fetchOrders = async () => {
        try {
            const response = await laravelApi.get('/orders')
            const formattedOrders = response.data.map(order => ({
                ...order,
                id: order.id,
                customer: order.user?.name || 'Unknown',
                email: order.user?.email || '',
                date: order.created_at,
                total: order.total,
                status: order.status,
                items: order.order_items?.map(item => ({
                    id: item.id,
                    product: item.produit?.name || 'Unknown Product',
                    quantity: item.quantite,
                    price: item.prix_unitaire
                })) || [],
            }))
            setOrders(formattedOrders || [])
            setLoading(false)
        } catch (err) {
            setError('Failed to load orders.')
            setLoading(false)
            notify.error('Failed to load orders')
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [])
    
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    
    const [sortField, setSortField] = useState('date')
    const [sortDirection, setSortDirection] = useState('desc')
    
    const [selectedOrder, setSelectedOrder] = useState(null)
    
    const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 10
    
    const { notify } = useNotification()
    
    const filteredOrders = orders
        .filter(order => {
        const matchesSearch = order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
                            order.customer?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter ? order.status === statusFilter : true
        
        return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
        if (sortDirection === 'asc') {
            if (sortField === 'date') {
            return new Date(a.date) - new Date(b.date)
            }
            return a[sortField] > b[sortField] ? 1 : -1
        } else {
            if (sortField === 'date') {
            return new Date(b.date) - new Date(a.date)
            }
            return a[sortField] < b[sortField] ? 1 : -1
        }
        })
        
    const handleSort = (field) => {
        if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
        setSortField(field)
        setSortDirection('desc')
        }
    }

    const indexOfLastOrder = currentPage * productsPerPage
    const indexOfFirstOrder = indexOfLastOrder - productsPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    const totalPages = Math.ceil(filteredOrders.length / productsPerPage)

    const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    }
    
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await laravelApi.put(`/orders/${orderId}/status`, {
                status: newStatus
            })

            console.log("Updated order data:", response.data)

            setOrders(orders.map(order =>
                order.id === orderId ? response.data : order
            ))

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(response.data)
            }

            fetchOrders()
            window.location.reload()

            notify.success('Order status updated successfully!')
        } catch (err) {
            notify.error('Failed to update order status')
        }
    }
    
    const viewOrderDetails = (order) => {
        setSelectedOrder(order)
    }
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('en-US', options)
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
    
    const getStatusIcon = (status) => {
        switch(status) {
        case 'Pending':
            return <HiOutlineClock className="h-5 w-5 text-yellow-500" />
        case 'Processing':
            return <HiOutlineShoppingCart className="h-5 w-5 text-blue-500" />
        case 'Shipped':
            return <HiOutlineTruck className="h-5 w-5 text-purple-500" />
        case 'Delivered':
            return <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />
        case 'Cancelled':
            return <HiOutlineX className="h-5 w-5 text-red-500" />
        default:
            return <HiOutlineInformationCircle className="h-5 w-5 text-gray-500" />
        }
    }
    
    const getStatusColor = (status) => {
        switch(status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800'
        case 'Processing':
            return 'bg-blue-100 text-blue-800'
        case 'Shipped':
            return 'bg-purple-100 text-purple-800'
        case 'Delivered':
            return 'bg-green-100 text-green-800'
        case 'Cancelled':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
        }
    }
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            {error ? (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center text-red-700">
                    <HiOutlineExclamationCircle className="h-6 w-6 mr-2" />
                    <p className="font-medium">Error: Failed to load orders</p>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                    There was an issue retrieving order data. The server may be unavailable or there could be a network problem. Please try again later.
                    </p>
                </div>
            ) : (loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            ) : (
                <>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                    <p className="text-gray-600">Track and manage customer orders</p>
                </div>
                
                {/* Search and Filters */}
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
                            placeholder="Search by order ID or customer name..."
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
                        className="mt-4"
                        >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                {orderStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            </div>
                            
                            <div className="flex items-end">
                            <button 
                                onClick={() => {
                                setSearchTerm('')
                                setStatusFilter('')
                                }}
                                className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
                            >
                                Clear Filters
                            </button>
                            </div>
                        </div>
                        </motion.div>
                    )}
                    </div>
                </div>
                
                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('id')}
                            >
                            <div className="flex items-center space-x-1">
                                <span>Order ID</span>
                                {sortField === 'id' && (
                                sortDirection === 'asc' ? 
                                    <HiOutlineChevronUp className="h-4 w-4" /> : 
                                    <HiOutlineChevronDown className="h-4 w-4" />
                                )}
                            </div>
                            </th>
                            <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('customer')}
                            >
                            <div className="flex items-center space-x-1">
                                <span>Customer</span>
                                {sortField === 'customer' && (
                                sortDirection === 'asc' ? 
                                    <HiOutlineChevronUp className="h-4 w-4" /> : 
                                    <HiOutlineChevronDown className="h-4 w-4" />
                                )}
                            </div>
                            </th>
                            <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('date')}
                            >
                            <div className="flex items-center space-x-1">
                                <span>Date</span>
                                {sortField === 'date' && (
                                sortDirection === 'asc' ? 
                                    <HiOutlineChevronUp className="h-4 w-4" /> : 
                                    <HiOutlineChevronDown className="h-4 w-4" />
                                )}
                            </div>
                            </th>
                            <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('total')}
                            >
                            <div className="flex items-center space-x-1">
                                <span>Total</span>
                                {sortField === 'total' && (
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
                        {filteredOrders && filteredOrders.length > 0 ? (
                            currentOrders.map((order, index) => (
                            <motion.tr
                                key={order.id}
                                variants={itemVariants}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                <div className="text-sm text-gray-500">{order.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1">{order.status}</span>
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => viewOrderDetails(order)}
                                    className="text-blue-600 hover:text-blue-900 flex items-center justify-end cursor-pointer"
                                >
                                    <HiOutlineEye className="h-5 w-5 mr-1" />
                                    <span>View</span>
                                </button>
                                </td>
                            </motion.tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                No orders found matching your criteria.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            No orders found matching the current filters.
                        </div>
                        ) : (
                        <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * productsPerPage + 1} to{' '}
                            {Math.min(currentPage * productsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
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
                
                {/* Order Details Modal */}
                <AnimatePresence>
                    {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ background: 'rgba(0, 0, 0, 0.15)' }}
                    >
                        <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        >
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Order Details: {selectedOrder.id}
                                </h3>
                                <p className="text-sm text-gray-500">
                                Placed on {formatDate(selectedOrder.date)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                                <HiOutlineX className="h-6 w-6" />
                            </button>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                                <p className="text-sm text-gray-900">{selectedOrder.customer}</p>
                                <p className="text-sm text-gray-600 mt-1">{selectedOrder.email}</p>
                            </div>
                            
                            {/* Order Status */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-2">Order Status</h4>
                                <div className="flex items-center">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    <span className="ml-1">{selectedOrder.status}</span>
                                </span>
                                </div>
                                
                                {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                <div className="mt-3">
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Update Status</label>
                                    <select
                                    className="block w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer"
                                    value={selectedOrder.status}
                                    onChange={(e) => {
                                        updateOrderStatus(selectedOrder.id, e.target.value)
                                    }}
                                    >
                                    {orderStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                    </select>
                                </div>
                                )}
                            </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className="mt-6">
                            <h4 className="font-medium text-gray-700 mb-3">Order Items</h4>
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder?.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {item.product}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {item.quantity}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            </div>
                            
                            {/* Order Summary */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Order Total:</span>
                                <span className="text-lg font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                            </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                Close
                            </button>
                            </div>
                        </div>
                        </motion.div>
                    </motion.div>
                    )}
                </AnimatePresence>
                </>
            ))}
        </motion.div>
    )
}

export default Orders
