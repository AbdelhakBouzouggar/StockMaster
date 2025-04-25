import { useState } from 'react'
import { HiUserAdd, HiPencil, HiTrash, HiSearch, HiFilter, HiArrowUp, HiArrowDown, HiUserCircle } from 'react-icons/hi'
import { motion } from 'framer-motion'
import { useNotification } from '../context/NotificationContext'

function Users() {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-08-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', lastLogin: '2023-08-14' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Staff', status: 'Active', lastLogin: '2023-08-10' },
        { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Staff', status: 'Inactive', lastLogin: '2023-07-25' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Manager', status: 'Active', lastLogin: '2023-08-13' },
        { id: 6, name: 'Sarah Taylor', email: 'sarah@example.com', role: 'Staff', status: 'Active', lastLogin: '2023-08-11' },
        { id: 7, name: 'James Anderson', email: 'james@example.com', role: 'Staff', status: 'Pending', lastLogin: 'Never' },
    ])
    
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    
    const { notify } = useNotification()
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
        }
    }
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
        }
    }
    
    const handleAdd = () => {
        setShowAddModal(true)
    }
    
    const handleEdit = (user) => {
        setCurrentUser(user)
        setShowEditModal(true)
    }
    
    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(user => user.id !== userId))
        notify.success('User deleted successfully!')
        }
    }
    
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'All' || user.role === filterRole
        const matchesStatus = filterStatus === 'All' || user.status === filterStatus
        
        return matchesSearch && matchesRole && matchesStatus
    })
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-600">Manage system users, roles and permissions</p>
                </div>
                <motion.button
                variants={itemVariants}
                onClick={handleAdd}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                <HiUserAdd className="mr-2 h-5 w-5" />
                Add New User
                </motion.button>
            </div>
            
            {/* Filters */}
            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-4 mb-6"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <HiFilter className="h-5 w-5 text-gray-400" />
                    </div>
                    </div>
                    
                    <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <HiFilter className="h-5 w-5 text-gray-400" />
                    </div>
                    </div>
                </div>
                </div>
            </motion.div>
            
            {/* Users Table */}
            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <HiUserCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'
                            }`}>
                            {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'
                            }`}>
                            {user.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                            <HiPencil className="h-5 w-5" />
                            </button>
                            <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                            >
                            <HiTrash className="h-5 w-5" />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                {filteredUsers.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No users found matching the current filters.
                </div>
                )}
            </motion.div>

            {/* Add User Modal */}
            {showAddModal && (
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
                        Add New User
                    </h3>
                    <form className="space-y-4" onSubmit={e => {
                        e.preventDefault()
                        const form = e.target
                        const name = form.name.value.trim()
                        const email = form.email.value.trim()
                        const role = form.role.value
                        const status = form.status.value
                        if (!name || !email) {
                        notify.error('Please fill in all required fields.')
                        return
                        }
                        setUsers([
                        ...users,
                        {
                            id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
                            name,
                            email,
                            role,
                            status,
                            lastLogin: 'Never',
                        },
                        ])
                        setShowAddModal(false)
                        notify.success('User added successfully!')
                    }}>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter user name"
                            required
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter user email"
                            required
                        />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                            </label>
                            <select
                            name="role"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Staff"
                            >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Staff">Staff</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                            </label>
                            <select
                            name="status"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Active"
                            >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                            </select>
                        </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Add User
                        </button>
                        </div>
                    </form>
                    </div>
                </motion.div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && currentUser && (
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
                        Edit User
                    </h3>
                    <form className="space-y-4" onSubmit={e => {
                        e.preventDefault()
                        const form = e.target
                        const name = form.name.value.trim()
                        const email = form.email.value.trim()
                        const role = form.role.value
                        const status = form.status.value
                        if (!name || !email) {
                        notify.error('Please fill in all required fields.')
                        return
                        }
                        setUsers(users.map(u =>
                        u.id === currentUser.id
                            ? { ...u, name, email, role, status }
                            : u
                        ))
                        setShowEditModal(false)
                        setCurrentUser(null)
                        notify.success('User updated successfully!')
                    }}>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter user name"
                            defaultValue={currentUser.name}
                            required
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter user email"
                            defaultValue={currentUser.email}
                            required
                        />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                            </label>
                            <select
                            name="role"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={currentUser.role}
                            >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Staff">Staff</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                            </label>
                            <select
                            name="status"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue={currentUser.status}
                            >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                            </select>
                        </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => { setShowEditModal(false) ; setCurrentUser(null) }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                        </div>
                    </form>
                    </div>
                </motion.div>
                </div>
            )}
        </motion.div>
    )
}

export default Users
