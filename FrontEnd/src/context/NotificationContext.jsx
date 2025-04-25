import { createContext, useState, useContext } from 'react'
import Notification from '../components/ui/Notification'

const NotificationContext = createContext()

let notificationId = 0
const getUniqueId = () => `notification-${notificationId++}`

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = getUniqueId()
        setNotifications(prev => [...prev, { id, message, type, duration }])
        return id
    }

    const notify = {
        info: (message, duration) => addNotification(message, 'info', duration),
        success: (message, duration) => addNotification(message, 'success', duration),
        warning: (message, duration) => addNotification(message, 'warning', duration),
        error: (message, duration) => addNotification(message, 'error', duration),
    }

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }

    const clearNotifications = () => {
        setNotifications([])
    }

    return (
        <NotificationContext.Provider
            value={{
                notify,
                removeNotification,
                clearNotifications
            }}
        >
            {children}
            
            <div className="notification-container">
            {notifications.map(({ id, ...props }) => (
                <Notification
                    key={id}
                    {...props}
                    onClose={() => removeNotification(id)}
                />
            ))}
            </div>
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}

export default NotificationContext
