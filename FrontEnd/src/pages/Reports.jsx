import { useState } from 'react'
import { HiDownload, HiFilter, HiCalendar, HiChartBar, HiChartPie, HiChartSquareBar, HiRefresh } from 'react-icons/hi'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, TimeScale, Filler } from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement, 
    PointElement, 
    LineElement,
    TimeScale,
    Filler
)

function Reports() {
    const [dateRange, setDateRange] = useState('month')
    const [reportType, setReportType] = useState('sales')
    
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
    
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
        {
            label: 'Revenue',
            data: [4500, 5200, 4800, 5800, 7100, 6500, 7800, 8200],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        },
        {
            label: 'Profit',
            data: [1800, 2100, 1900, 2500, 3000, 2700, 3500, 3800],
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
        },
        ],
    }
    
    const inventoryData = {
        labels: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Office Supplies', 'Food', 'Other'],
        datasets: [
        {
            label: 'Stock Value',
            data: [25000, 18000, 12000, 8000, 9500, 6000, 4500],
            backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(244, 63, 94, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(20, 184, 166, 0.6)',
            'rgba(107, 114, 128, 0.6)',
            ],
            borderWidth: 1,
        },
        ],
    }

    const trendData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [
        {
            label: 'Orders',
            data: [28, 35, 32, 40, 42, 38, 45, 50],
            borderColor: 'rgba(59, 130, 246, 0.8)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
            fill: true,
        },
        ],
    }

    const summaryData = [
        { 
        title: 'Total Revenue', 
        value: '$49,900', 
        change: '+8.2%', 
        trend: 'up',
        icon: <HiChartBar className="h-7 w-7 text-blue-500" />
        },
        { 
        title: 'Average Order Value', 
        value: '$85.40', 
        change: '+3.5%', 
        trend: 'up',
        icon: <HiChartSquareBar className="h-7 w-7 text-green-500" />
        },
        { 
        title: 'Total Products', 
        value: '156', 
        change: '-2.1%', 
        trend: 'down',
        icon: <HiChartPie className="h-7 w-7 text-purple-500" />
        },
        { 
        title: 'Conversion Rate', 
        value: '3.2%', 
        change: '+0.8%', 
        trend: 'up',
        icon: <HiChartBar className="h-7 w-7 text-red-500" />
        },
    ]

    const topProducts = [
        { id: 1, name: 'Wireless Headphones', category: 'Electronics', sold: 42, revenue: '$4,200' },
        { id: 2, name: 'Ergonomic Chair', category: 'Furniture', sold: 28, revenue: '$5,600' },
        { id: 3, name: 'Smartwatch XS', category: 'Electronics', sold: 25, revenue: '$3,750' },
        { id: 4, name: 'Coffee Maker', category: 'Kitchen', sold: 22, revenue: '$2,200' },
        { id: 5, name: 'Bluetooth Speaker', category: 'Electronics', sold: 20, revenue: '$1,800' },
    ]
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                <p className="text-gray-600">Analyze your business performance and trends</p>
                </div>
                
                <motion.div
                variants={itemVariants}
                className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3"
                >
                <div className="relative">
                    <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <HiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                
                <div className="relative">
                    <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                    <option value="sales">Sales Report</option>
                    <option value="inventory">Inventory Report</option>
                    <option value="orders">Orders Report</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <HiFilter className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-offset-2 transition-colors cursor-pointer">
                    <HiDownload className="mr-2 h-5 w-5" />
                    Export
                </button>
                </motion.div>
            </div>
            
            {/* Summary Cards */}
            <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {summaryData.map((item, index) => (
                <div 
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    <div className="flex justify-between items-start">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        {item.icon}
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">{item.title}</p>
                        <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
                    </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end text-sm">
                    {item.trend === 'up' ? (
                        <span className="text-green-500 flex items-center">
                        <HiRefresh className="h-4 w-4 mr-1" />
                        {item.change}
                        </span>
                    ) : (
                        <span className="text-red-500 flex items-center">
                        <HiRefresh className="h-4 w-4 mr-1" />
                        {item.change}
                        </span>
                    )}
                    <span className="text-gray-500 ml-1">vs last period</span>
                    </div>
                </div>
                ))}
            </motion.div>
            
            {/* Main Chart */}
            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-6 mb-8"
            >
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {reportType === 'sales' ? 'Revenue & Profit Overview' :
                    reportType === 'inventory' ? 'Inventory Value by Category' :
                    'Order Trends'}
                </h3>
                </div>
                <div className="h-80">
                {reportType === 'sales' && <Bar data={salesData} options={{ maintainAspectRatio: false }} />}
                {reportType === 'inventory' && <Doughnut data={inventoryData} options={{ maintainAspectRatio: false }} />}
                {reportType === 'orders' && <Line data={trendData} options={{ maintainAspectRatio: false }} />}
                </div>
            </motion.div>
            
            {/* Top Products Table */}
            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm mb-8"
            >
                <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{product.sold}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.revenue}</div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Reports
