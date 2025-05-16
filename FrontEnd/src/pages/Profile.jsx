import { useState } from 'react'
import { HiUserCircle, HiMail, HiPhone, HiOfficeBuilding, HiCalendar, HiIdentification, HiPencil, HiLockClosed, HiSave, HiX, HiCamera } from 'react-icons/hi'
import { motion } from 'framer-motion'
import { useNotification } from '../context/NotificationContext'

function Profile() {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Admin',
        department: 'IT',
        joinDate: 'January 15, 2022',
        id: 'USR-2022-0001',
        avatar: null
    })
    
    const [isEditing, setIsEditing] = useState(false)
    const [editedUser, setEditedUser] = useState({ ...user })
    const [activeTab, setActiveTab] = useState('info')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    
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
    
    const handleEdit = () => {
        setIsEditing(true)
        setEditedUser({ ...user })
    }
    
    const handleCancel = () => {
        setIsEditing(false)
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedUser(prev => ({
        ...prev,
        [name]: value
        }))
    }
    
    const handleSave = () => {
        setUser({ ...editedUser })
        setIsEditing(false)
        notify.success('Profile updated successfully!')
    }
    
    const handlePasswordChange = (e) => {
        e.preventDefault()
        
        if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match')
        notify.error('New passwords do not match')
        return
        }
        
        if (newPassword.length < 8) {
        setPasswordError('Password must be at least 8 characters long')
        notify.error('Password must be at least 8 characters long')
        return
        }
        
        notify.success('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordError('')
    }
    
    const userInfoFields = [
        { icon: HiMail, label: 'Email', value: user.email, name: 'email', type: 'email' },
        { icon: HiPhone, label: 'Phone', value: user.phone, name: 'phone', type: 'tel' },
        { icon: HiIdentification, label: 'ID', value: user.id, name: 'id', type: 'text', readOnly: true },
        { icon: HiOfficeBuilding, label: 'Department', value: user.department, name: 'department', type: 'text' },
        { icon: HiCalendar, label: 'Join Date', value: user.joinDate, name: 'joinDate', type: 'text', readOnly: true },
    ]
    
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="py-6"
        >
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-600">Manage your account information and settings</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Profile Card */}
                <motion.div 
                variants={itemVariants}
                className="lg:w-1/3"
                >
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <div className="relative mx-auto mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow">
                        {user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                        />
                        ) : (
                        <HiUserCircle className="w-full h-full text-gray-300" />
                        )}
                    </div>
                    
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md">
                        <HiCamera className="h-5 w-5" />
                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" />
                    </label>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500">{user.role}</p>
                    
                    <div className="mt-6 space-y-2">
                    <button className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        activeTab === 'info' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`} onClick={() => setActiveTab('info')}>
                        Profile Information
                    </button>
                    
                    <button className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        activeTab === 'security' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`} onClick={() => setActiveTab('security')}>
                        Security Settings
                    </button>
                    
                    <button className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        activeTab === 'preferences' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`} onClick={() => setActiveTab('preferences')}>
                        Preferences
                    </button>
                    </div>
                </div>
                </motion.div>
                
                {/* Right Column - Content */}
                <motion.div 
                variants={itemVariants}
                className="lg:w-2/3"
                >
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Profile Information Tab */}
                    {activeTab === 'info' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                        
                        {isEditing ? (
                            <div className="flex space-x-2">
                            <button 
                                onClick={handleCancel}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
                            >
                                <HiX className="mr-1.5 h-4 w-4" />
                                Cancel
                            </button>
                            
                            <button 
                                onClick={handleSave}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer"
                            >
                                <HiSave className="mr-1.5 h-4 w-4" />
                                Save
                            </button>
                            </div>
                        ) : (
                            <button 
                            onClick={handleEdit}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer"
                            >
                            <HiPencil className="mr-1.5 h-4 w-4" />
                            Edit
                            </button>
                        )}
                        </div>
                        
                        <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiUserCircle className="h-5 w-5 text-gray-400" />
                            </div>
                            {isEditing ? (
                                <input
                                type="text"
                                name="name"
                                id="name"
                                value={editedUser.name}
                                onChange={handleChange}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full bg-gray-50">
                                {user.name}
                                </div>
                            )}
                            </div>
                        </div>
                        
                        {userInfoFields.map((field, index) => (
                            <div key={index}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <field.icon className="h-5 w-5 text-gray-400" />
                                </div>
                                {isEditing && !field.readOnly ? (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    id={field.name}
                                    value={editedUser[field.name]}
                                    onChange={handleChange}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                ) : (
                                <div className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full bg-gray-50">
                                    {field.value}
                                </div>
                                )}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                    
                    {/* Security Tab */}
                    {activeTab === 'security' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h3>
                        
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                            <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                        </div>
                        
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            </div>
                        </div>
                        
                        {passwordError && (
                            <div className="text-red-500 text-sm">{passwordError}</div>
                        )}
                        
                        <div>
                            <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer"
                            >
                            <HiSave className="mr-2 h-5 w-5" />
                            Update Password
                            </button>
                        </div>
                        </form>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-medium text-gray-800 mb-4">Account Activity</h4>
                        
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Last login</span>
                            <span className="font-medium">Today, 9:32 AM</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Last password change</span>
                            <span className="font-medium">3 months ago</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Active sessions</span>
                            <span className="font-medium">2 devices</span>
                            </li>
                        </ul>
                        </div>
                    </div>
                    )}
                    
                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">User Preferences</h3>
                        
                        <div className="space-y-6">
                        <div>
                            <h4 className="text-md font-medium text-gray-800 mb-3">Notifications</h4>
                            
                            <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                id="email-notif"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                                />
                                <label htmlFor="email-notif" className="ml-3 text-sm text-gray-700">
                                Email notifications
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                id="app-notif"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                                />
                                <label htmlFor="app-notif" className="ml-3 text-sm text-gray-700">
                                In-app notifications
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                id="stock-alert"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                                />
                                <label htmlFor="stock-alert" className="ml-3 text-sm text-gray-700">
                                Low stock alerts
                                </label>
                            </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-md font-medium text-gray-800 mb-3">Display Settings</h4>
                            
                            <div className="space-y-4">
                            <div>
                                <label htmlFor="theme" className="block text-sm text-gray-700">Theme</label>
                                <select
                                id="theme"
                                className="mt-1 pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                defaultValue="system"
                                >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System Default</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="language" className="block text-sm text-gray-700">Language</label>
                                <select
                                id="language"
                                className="mt-1 pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                defaultValue="en"
                                >
                                <option value="en">English</option>
                                <option value="fr">Français</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                                </select>
                            </div>
                            </div>
                        </div>
                        
                        <div className="pt-4">
                            <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors cursor-pointer"
                            onClick={() => notify.success('Preferences saved successfully!')}
                            >
                            <HiSave className="mr-2 h-5 w-5" />
                            Save Preferences
                            </button>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Profile
