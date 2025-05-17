import { useState, useEffect } from 'react'
import { HiTrendingUp, HiArchive, HiShoppingCart, HiExclamationCircle, HiArrowUp, HiArrowDown, HiOutlineExclamationCircle } from 'react-icons/hi'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import Notification from '../components/ui/Notification'
import laravelApi from '../api/laravelApi'
import Spinner from '../components/layout/Spinner'

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement, 
    PointElement, 
    LineElement
)

function Dashboard() {
    const [userName, setUserName] = useState("")
    const [showNotification, setShowNotification] = useState(false)

    const [totalProducts, setTotalProducts] = useState(false)
    const [totalOrders, setTotalOrders] = useState(false)
    const [lowStockItems, setLowStockItems] = useState(false)
    const [revenueChange, setRevenueChange] = useState(false)

    const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] })
    const [productCategoryData, setProductCategoryData] = useState({ labels: [], datasets: [] })
    const [trendData, setTrendData] = useState({ labels: [], datasets: [] })
    const [recentActivity, setRecentActivity] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        const notificationDismissed = localStorage.getItem("welcomeNotificationDismissed")

        if (storedUser && storedUser.username) {
            setUserName(storedUser.username)
            if (!notificationDismissed) {
                setShowNotification(true)
            }
        }

        laravelApi.get('/dashboard')
        .then(response => {
            const data = response.data

            setTotalProducts(data.stats.totalProducts)
            setTotalOrders(data.stats.totalOrders)
            setLowStockItems(data.stats.lowStockItems)
            setRevenueChange(data.stats.revenueChange)

            setMonthlyData({
                labels: data.monthlyData.labels,
                datasets: data.monthlyData.datasets
            })

            setProductCategoryData({
                labels: data.productCategoryData.labels,
                datasets: data.productCategoryData.datasets
            })

            setTrendData({
                labels: data.trendData.labels,
                datasets: data.trendData.datasets
            })

            setRecentActivity(data.recentActivity)
            setLoading(false)
        })
        .catch(error => {
            console.error("Error fetching dashboard data:", error)
            setError('Failed to load dashboard data.')
            setLoading(false)
            notify.error('Failed to load dashboard data')
        })
    }, [])
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >   
            {showNotification && (
                <Notification 
                    type="success" 
                    message={`Welcome, ${userName}!`} 
                    duration={4000} 
                    onClose={() => {
                        setShowNotification(false)
                        localStorage.setItem("welcomeNotificationDismissed", "true")
                    }} 
                />
            )}
            
            {error ? (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center text-red-700">
                    <HiOutlineExclamationCircle className="h-6 w-6 mr-2" />
                    <p className="font-medium">Error: Failed to load dashboard data</p>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                    There was an issue retrieving dashboard data. The server may be unavailable or there could be a network problem. Please try again later.
                    </p>
                </div>
            ) : (loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                        <p className="text-gray-600">Welcome back Mr. <strong>{userName}</strong>! Here's what's happening with your inventory today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{totalProducts}</h3>
                                </div>
                                <div className="bg-blue-100 p-5 rounded-full">
                                    <HiArchive className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <HiArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">4.3%</span>
                                <span className="text-gray-500 ml-1">from last month</span>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{totalOrders}</h3>
                                </div>
                                <div className="bg-green-100 p-5 rounded-full">
                                    <HiShoppingCart className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <HiArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">2.8%</span>
                                <span className="text-gray-500 ml-1">from last month</span>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{lowStockItems}</h3>
                                </div>
                                <div className="bg-yellow-100 p-5 rounded-full">
                                    <HiExclamationCircle className="h-6 w-6 text-yellow-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <HiArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-500 font-medium">1.5%</span>
                                <span className="text-gray-500 ml-1">requires attention</span>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Revenue Growth</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{revenueChange}%</h3>
                                </div>
                                <div className="bg-purple-100 p-5 rounded-full">
                                    <HiTrendingUp className="h-6 w-6 text-purple-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <HiArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">12.5%</span>
                                <span className="text-gray-500 ml-1">from last month</span>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h3>
                            <div className="h-80">
                                <Bar data={monthlyData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-4"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Doughnut data={productCategoryData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </motion.div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Trend</h3>
                            <div className="h-60">
                                <Line data={trendData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-sm p-4"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                                <a href="" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
                            </div>
                            
                            <div className="space-y-4">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start">
                                        <div className="mr-4">
                                            <div className={`rounded-full p-2 ${
                                                activity.type === 'add' ? 'bg-green-100' : 
                                                activity.type === 'update' ? 'bg-blue-100' : 
                                                activity.type === 'ship' ? 'bg-purple-100' : 
                                                activity.type === 'alert' ? 'bg-red-100' : 'bg-yellow-100'
                                            }`}>
                                                {activity.type === 'add' && <HiArchive className="h-4 w-4 text-green-500" />}
                                                {activity.type === 'update' && <HiTrendingUp className="h-4 w-4 text-blue-500" />}
                                                {activity.type === 'ship' || activity.type === 'order' && <HiShoppingCart className="h-4 w-4 text-purple-500" />}
                                                {activity.type === 'alert' && <HiExclamationCircle className="h-4 w-4 text-red-500" />}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800">{activity.activity}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </>
            ))}
        </motion.div>
    )
}

export default Dashboard
