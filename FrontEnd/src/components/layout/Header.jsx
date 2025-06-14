import { Link } from 'react-router-dom'
import { HiMenuAlt2, HiBell, HiOutlineSearch, HiTrash, HiX } from 'react-icons/hi'
import { useState, useRef, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'
import axios from 'axios'

function Header({ toggleSidebar }) {
    const [notifications, setNotifications] = useState([])
    const [error, setError] = useState(null)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [selectedNotifi, setSelectedNotifi] = useState(null)
    const dropdownRef = useRef(null)

    const { notify } = useNotification()

    const fetchNotifications = async () => {
        try {
            const data = await axios.get('http://localhost:5003/notifications')

            const notifications = data.data
            console.log(notifications)
            setNotifications(notifications)
            setError(null)
        } catch (err) {
            setError('Erreur lors du chargement des noifications')
            notify.error('Impossible de charger les noifications')
            console.error(err)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownOpen])

    const handleRemove = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
        setSelectedNotifi(null)
    }

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleSidebar} 
                        className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <HiMenuAlt2 className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center">
                        <Link to='/' className="text-xl font-bold text-blue-600">StockMaster</Link>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative max-w-xl w-full mx-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder="Search products, orders..."
                    />
                </div>
                
                {/* User Actions */}
                <div className="flex items-center space-x-4">
                    {/* Notification Bell */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="text-gray-500 hover:text-gray-700 relative cursor-pointer"
                            onClick={() => setDropdownOpen((open) => !open)}
                        >
                            <HiBell className="w-6 h-6" />
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                            )}
                        </button>
                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                <div className="p-2 font-semibold border-b">Notifications</div>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-gray-500 text-center">No notifications</div>
                                ) : (
                                <ul>
                                    {notifications.map((notifi) => (
                                    <li
                                        key={notifi.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        onClick={() => {
                                            setSelectedNotifi(notifi)
                                            setDropdownOpen(false)
                                        }}
                                    >
                                        {notifi.message.length > 40
                                        ? notifi.message.slice(0, 40) + '...'
                                        : notifi.message}
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal for notification details */}
            {selectedNotifi && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => setSelectedNotifi(null)}
                            aria-label="Close"
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                        <div className="mb-4 text-lg font-semibold">Notification</div>
                        <div className="mb-6 text-gray-700">{selectedNotifi.message}</div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => handleRemove(selectedNotifi.id)}
                            aria-label="Remove Notification"
                        >
                            <HiTrash className="w-5 h-5" />
                            <span className="sr-only">Remove Notification</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
