import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineInformationCircle, HiX } from 'react-icons/hi'

function Notification({ type = 'info', message, duration = 5000, onClose }) {
    const [isVisible, setIsVisible] = useState(true)
    
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false)
                setTimeout(() => {
                    onClose && onClose()
                }, 300)
            }, duration)
            
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])
    
    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            onClose && onClose()
        }, 300)
    }
    
    const getIcon = () => {
        switch (type) {
        case 'success':
            return <HiOutlineCheckCircle className="h-6 w-6 text-green-500" />
        case 'error':
            return <HiOutlineExclamationCircle className="h-6 w-6 text-red-500" />
        case 'warning':
            return <HiOutlineExclamationCircle className="h-6 w-6 text-yellow-500" />
        default:
            return <HiOutlineInformationCircle className="h-6 w-6 text-blue-500" />
        }
    }
    
    const getBgColor = () => {
        switch (type) {
        case 'success':
            return 'bg-green-50 border-green-200'
        case 'error':
            return 'bg-red-50 border-red-200'
        case 'warning':
            return 'bg-yellow-50 border-yellow-200'
        default:
            return 'bg-blue-50 border-blue-200'
        }
    }
  
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className={`fixed top-16 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border ${getBgColor()}`}
                >
                    <div className="p-4 flex items-start">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">{message}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={handleClose}
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Notification
