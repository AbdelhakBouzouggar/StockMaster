import { useEffect, useState } from 'react'
import { HiUserAdd, HiPencil, HiTrash, HiSearch, HiFilter, HiUserCircle } from 'react-icons/hi'
import { motion } from 'framer-motion'
import { useNotification } from '../context/NotificationContext'
import { userService } from '../api/userApi'
import Spinner from '../components/layout/Spinner'
import laravelApi from '../api/laravelApi'

function Users() {
    const [users, setUsers] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const userPerPage = 4

    const user = JSON.parse(localStorage.getItem('user'))
    const userRole = user?.role || 'employe'
    const isAdmin = userRole === 'admin'
    
    const { notify } = useNotification()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await userService.getAll()

            const formattedUsers = data.map(user => ({
                ...user,
            }))
            setUsers(formattedUsers)
            setError(null)
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs')
            notify.error('Impossible de charger les utilisateurs')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    
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
  
    const handleDelete = async (userId) => {
        setUserToDelete(userId)
        setShowConfirmModal(true)
    }

    const handleAddUser = async (formData) => {
        try {
            let response
            if (isAdmin) {
                response = await userService.create(formData)
            } else {
                response = await laravelApi.post('/users', formData)
            }

            const newUser = {
                id: response.userId,
                ...formData,
            }
            
            setUsers([...users, newUser])
            setShowAddModal(false)
            fetchUsers()
            notify.success('Utilisateur ajouté avec succès!')
        } catch (error) {
            notify.error('Erreur lors de l\'ajout de l\'utilisateur')
            console.error(error)
        }
    }

    const handleUpdateUser = async (formData) => {
        if (!currentUser) return
        
        try {
            if (isAdmin) {
                await userService.update(currentUser.id, formData)
            } else {
                await laravelApi.put(`/users/${currentUser.id}`, formData)
            }
            
            setUsers(users.map(u => 
                u.id === currentUser.id
                ? { ...u, ...formData }
                : u
            ))
            
            setShowEditModal(false)
            setCurrentUser(null)
            fetchUsers()
            notify.success('Utilisateur mis à jour avec succès!')
        } catch (error) {
            notify.error('Erreur lors de la mise à jour de l\'utilisateur')
            console.error(error)
        }
    }
    
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'All' || user.role === filterRole
        const matchesStatus = filterStatus === 'All' || user.status === filterStatus
        
        return matchesSearch && matchesRole && matchesStatus
    })

    const totalPages = Math.ceil(filteredUsers.length / userPerPage)

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * userPerPage,
        currentPage * userPerPage
    )

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1))
    }

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            {/* État de chargement ou d'erreur */}
            {loading && (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                    <Spinner />
                </div>
            )}

            {error && !loading && (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={fetchUsers}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            )}
            
            {/* Users Table */}
            {!loading && !error &&(
                <>
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-gray-600">Manage system users, roles and permissions</p>
                    </div>
                    <motion.button
                    variants={itemVariants}
                    onClick={handleAdd}
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
                                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="All">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="gestionnaire">Gestionnaire</option>
                                <option value="employe">Employe</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <HiFilter className="h-5 w-5 text-gray-400" />
                            </div>
                            </div>
                        </div>
                        </div>
                    </motion.div>

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
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.map((user) => (
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
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                    user.role === 'gestionnaire' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-green-100 text-green-800'
                                    }`}>
                                    {user.role}
                                    </span>
                                </td>
                                {user.role === "employe" && userRole === "gestionnaire" && (<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                                    >
                                    <HiPencil className="h-5 w-5" />
                                    </button>
                                    <button 
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                    >
                                    <HiTrash className="h-5 w-5" />
                                    </button>
                                </td>)}
                                {user.role === "gestionnaire" && userRole === "admin" && (<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                                    >
                                    <HiPencil className="h-5 w-5" />
                                    </button>
                                    <button 
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                    >
                                    <HiTrash className="h-5 w-5" />
                                    </button>
                                </td>)}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No users found matching the current filters.
                            </div>
                        ) : (
                            <div className="flex justify-between items-center px-6 py-3 bg-gray-50">
                                <p className="text-sm text-gray-600">
                                    Showing {(currentPage - 1) * userPerPage + 1} to {Math.min(currentPage * userPerPage, filteredUsers.length)} of {filteredUsers.length} entries
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
                                            key={i + 1}
                                            onClick={() => goToPage(i + 1)}
                                            className={`px-3 py-1 border rounded text-sm ${currentPage === i + 1
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
                                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
            
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.15)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Are you sure?</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Do you really want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false)
                                    setUserToDelete(null)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        if (isAdmin) {
                                            await userService.delete(userToDelete)
                                        } else {
                                            await laravelApi.delete(`/users/${userToDelete}`)
                                        }
                                        setUsers(users.filter(user => user.id !== userToDelete))
                                        notify.success('Utilisateur supprimé avec succès!')
                                        fetchUsers()
                                    } catch (error) {
                                        notify.error('Erreur lors de la suppression de l\'utilisateur')
                                        console.error(error)
                                    } finally {
                                        setShowConfirmModal(false)
                                        setUserToDelete(null)
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

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
                        const password = form.password.value.trim()

                        if (!name || !email || !password) {
                            notify.error('Please fill in all required fields.')
                            return
                        }

                        handleAddUser({
                            name,
                            email,
                            password,
                        })
                    }}>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter user email"
                            required
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Entrez le mot de passe"
                            required
                        />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
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
                        const oldPassword = form.oldPassword.value.trim()
                        const newPassword = form.newPassword.value.trim()
                        const confirmPassword = form.confirmPassword.value.trim()

                        if (!name || !email) {
                            notify.error('Please fill in all required fields.')
                            return
                        }

                        if (newPassword || confirmPassword) {
                            if (newPassword !== confirmPassword) {
                                notify.error("New passwords don't match.")
                                return
                            }
                            if (newPassword.length < 6) {
                                notify.error("Password must be at least 6 characters.")
                                return
                            }
                        }

                        const userData = {
                            name,
                            email,
                            oldPassword,
                            newPassword,
                        }
                        
                        handleUpdateUser(userData)
                    }}>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter user email"
                            defaultValue={currentUser.email}
                            required
                        />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                            <input
                                name="oldPassword"
                                type="password"
                                placeholder="Enter current password"
                                className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                name="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => { setShowEditModal(false) ; setCurrentUser(null) }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
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
