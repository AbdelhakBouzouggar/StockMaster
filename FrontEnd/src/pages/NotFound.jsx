import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
            >
                <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
                <p className="text-lg text-gray-700 mb-2">Page Not Found</p>
                <p className="text-gray-500 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Return to Dashboard
                </Link>
            </motion.div>
        </div>
    )
}

export default NotFound
