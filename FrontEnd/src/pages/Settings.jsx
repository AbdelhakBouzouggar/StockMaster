import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCog, HiOutlineBell, HiOutlineSave, HiOutlineColorSwatch, HiOutlineTerminal } from 'react-icons/hi'
import { useNotification } from '../context/NotificationContext'

function Settings() {
    const [activeTab, setActiveTab] = useState('general')
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
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100 }
      }
    }
    
    const tabs = [
        { id: 'general', label: 'General', icon: HiOutlineCog },
        { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
        { id: 'appearance', label: 'Appearance', icon: HiOutlineColorSwatch },
        { id: 'advanced', label: 'Advanced', icon: HiOutlineTerminal },
    ]
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Manage your system settings and preferences</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-4 flex items-center border-b-2 font-medium text-sm whitespace-nowrap
                        ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                    </button>
                ))}
                </nav>
            </div>
            
            <div className="p-6">
                {activeTab === 'general' && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                        <input
                            type="text"
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="StockMaster Inventory"
                        />
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="usd"
                        >
                            <option value="usd">USD ($)</option>
                            <option value="eur">EUR (€)</option>
                            <option value="gbp">GBP (£)</option>
                            <option value="jpy">JPY (¥)</option>
                        </select>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="mdy"
                        >
                            <option value="mdy">MM/DD/YYYY</option>
                            <option value="dmy">DD/MM/YYYY</option>
                            <option value="ymd">YYYY/MM/DD</option>
                        </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                        <input
                            id="lowStock"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            defaultChecked
                        />
                        <label htmlFor="lowStock" className="text-sm text-gray-700">
                            Enable low stock alerts
                        </label>
                        </div>
                        
                        <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            onClick={() => notify.success('Changes saved successfully!')}
                        >
                            <HiOutlineSave className="mr-2" />
                            Save Changes
                        </button>
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}
                
                {activeTab === 'notifications' && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Email Notifications</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                            <label htmlFor="orderCreated" className="text-sm text-gray-600">
                                New order received
                            </label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                id="orderCreated"
                                type="checkbox" 
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                defaultChecked
                                />
                                <label 
                                htmlFor="orderCreated" 
                                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                ></label>
                            </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                            <label htmlFor="lowStockAlert" className="text-sm text-gray-600">
                                Low stock alerts
                            </label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                id="lowStockAlert"
                                type="checkbox" 
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                defaultChecked
                                />
                                <label 
                                htmlFor="lowStockAlert" 
                                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                ></label>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div className="pt-4 border-b border-gray-200 pb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Push Notifications</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                            <label htmlFor="pushOrderCreated" className="text-sm text-gray-600">
                                New order received
                            </label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                id="pushOrderCreated"
                                type="checkbox" 
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                defaultChecked
                                />
                                <label 
                                htmlFor="pushOrderCreated" 
                                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                ></label>
                            </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                            <label htmlFor="pushLowStockAlert" className="text-sm text-gray-600">
                                Low stock alerts
                            </label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                id="pushLowStockAlert"
                                type="checkbox" 
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                defaultChecked
                                />
                                <label 
                                htmlFor="pushLowStockAlert" 
                                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                                ></label>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            onClick={() => notify.success('Changes saved successfully!')}
                        >
                            <HiOutlineSave className="mr-2" />
                            Save Changes
                        </button>
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}
                
                {activeTab === 'appearance' && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h3>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="blue"
                        >
                            <option value="blue">Blue (Default)</option>
                            <option value="purple">Purple</option>
                            <option value="green">Green</option>
                            <option value="indigo">Indigo</option>
                            <option value="red">Red</option>
                        </select>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme Mode</label>
                        <div className="mt-1 space-y-2">
                            <div className="flex items-center">
                            <input
                                id="light-mode"
                                name="theme-mode"
                                type="radio"
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                defaultChecked
                            />
                            <label htmlFor="light-mode" className="ml-3 text-sm text-gray-700">
                                Light Mode
                            </label>
                            </div>
                            <div className="flex items-center">
                            <input
                                id="dark-mode"
                                name="theme-mode"
                                type="radio"
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="dark-mode" className="ml-3 text-sm text-gray-700">
                                Dark Mode
                            </label>
                            </div>
                            <div className="flex items-center">
                            <input
                                id="system-mode"
                                name="theme-mode"
                                type="radio"
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="system-mode" className="ml-3 text-sm text-gray-700">
                                System Default
                            </label>
                            </div>
                        </div>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sidebar Style</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="expanded"
                        >
                            <option value="expanded">Expanded by Default</option>
                            <option value="collapsed">Collapsed by Default</option>
                        </select>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interface Density</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="comfortable"
                        >
                            <option value="comfortable">Comfortable (Default)</option>
                            <option value="compact">Compact</option>
                            <option value="spacious">Spacious</option>
                        </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                        <input
                            id="animations"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            defaultChecked
                        />
                        <label htmlFor="animations" className="text-sm text-gray-700">
                            Enable animations
                        </label>
                        </div>
                        
                        <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            onClick={() => notify.success('Changes saved successfully!')}
                        >
                            <HiOutlineSave className="mr-2" />
                            Save Changes
                        </button>
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}
                
                {activeTab === 'advanced' && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Export</label>
                        <div className="mt-1 space-y-2">
                            <p className="text-sm text-gray-500">Export all your data as CSV, Excel or JSON format.</p>
                            <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                            >
                                Export as CSV
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                            >
                                Export as Excel
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                            >
                                Export as JSON
                            </button>
                            </div>
                        </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Import</label>
                        <div className="mt-1 space-y-2">
                            <p className="text-sm text-gray-500">Import data from a CSV, Excel or JSON file.</p>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">CSV, Excel, or JSON up to 10MB</p>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cache Management</label>
                        <div className="mt-1 space-y-2">
                            <p className="text-sm text-gray-500">Clear cached data to free up space and refresh the application.</p>
                            <button
                            type="button"
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                            >
                            Clear Cache
                            </button>
                        </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">System Information</label>
                        <div className="mt-1 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-2">
                            <div>App Version:</div>
                            <div>1.0.0</div>
                            <div>Database:</div>
                            <div>MongoDB 4.4.6</div>
                            <div>Server:</div>
                            <div>Node.js 16.13.1</div>
                            <div>Last Updated:</div>
                            <div>June 15, 2023</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}
            </div>
            </div>
        </motion.div>
    )
}

export default Settings
