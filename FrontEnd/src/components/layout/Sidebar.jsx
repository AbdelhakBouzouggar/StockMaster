import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiViewGrid, HiArchive, HiShoppingCart, HiCog, HiUsers, HiChartBar,HiChevronLeft,HiChevronRight,HiUserCircle } from 'react-icons/hi'
import { FiLogOut } from "react-icons/fi"

function Sidebar({ isOpen, toggleSidebar }) {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const role = user?.role || 'employe'

    const commonItems = [
        { name: 'Dashboard', icon: HiViewGrid, path: '/' },
        { name: 'Profile', icon: HiUserCircle, path: '/profile' },
    ]

    const roleBasedItems = {
        employe: [
            { name: 'Inventory', icon: HiArchive, path: '/inventory' },
            { name: 'Orders', icon: HiShoppingCart, path: '/orders' },
        ],
        gestionnaire: [
            { name: 'Inventory', icon: HiArchive, path: '/inventory' },
            { name: 'Reports', icon: HiChartBar, path: '/reports' },
            { name: 'Users', icon: HiUsers, path: '/users' },
            { name: 'Settings', icon: HiCog, path: '/settings' },
        ],
        admin: [
            { name: 'Users', icon: HiUsers, path: '/users' },
            { name: 'Reports', icon: HiChartBar, path: '/reports' },
            { name: 'Settings', icon: HiCog, path: '/settings' },
        ]
    }

    const menuItems = [...commonItems, ...(roleBasedItems[role] || [])]

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("welcomeNotificationDismissed")
        navigate('/login')
    }

    return (
        <AnimatePresence>
            <motion.aside 
                initial={{ width: isOpen ? 240 : 80 }}
                animate={{ width: isOpen ? 240 : 80 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-700 text-white shadow-lg h-screen z-20 overflow-hidden relative"
            >
                <div className="flex items-center justify-between p-4 border-b border-blue-600">
                {isOpen && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    >
                    <Link to='/' className="text-xl font-bold">StockMaster</Link>
                    </motion.div>
                )}
                
                <button 
                    onClick={toggleSidebar} 
                    className="p-1 rounded-full hover:bg-blue-600 focus:outline-none cursor-pointer"
                >
                    {isOpen ? <HiChevronLeft className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
                </button>
                </div>
                
                <nav className="mt-6">
                <ul className="space-y-2 px-2">
                    {menuItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                isActive 
                                    ? 'bg-blue-800 text-white' 
                                    : 'text-blue-100 hover:bg-blue-600'
                                }`
                            }
                        >
                        <item.icon className="w-6 h-6 flex-shrink-0" />
                        
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="ml-3"
                            >
                                {item.name}
                            </motion.span>
                        )}
                        </NavLink>
                    </li>
                    ))}
                </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="absolute bottom-0 left-0 w-full flex items-center px-4 py-3 cursor-pointer bg-blue-800 hover:bg-blue-900 transition-colors border-t border-blue-600 focus:outline-none"
                >
                <FiLogOut className="w-6 h-6" />
                {isOpen && (
                    <span className="ml-3">Logout</span>
                )}
                </button>
            </motion.aside>
        </AnimatePresence>
    )
}

export default Sidebar
