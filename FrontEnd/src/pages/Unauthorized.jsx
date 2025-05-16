import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
            >
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <p className="text-lg text-gray-700 mb-2">Unauthorized Access</p>
                <p className="text-gray-500 mb-6">
                    You do not have permission to view this page.
                </p>
                <Link
                    to="/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Go to Dashboard
                </Link>
            </motion.div>
        </div>
    )
}

export default Unauthorized
