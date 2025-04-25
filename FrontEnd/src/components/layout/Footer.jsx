import { HiHeart } from 'react-icons/hi'

function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div className="text-gray-600 text-sm mb-2 sm:mb-0">
                    &copy {currentYear} StockMaster. All rights reserved.
                </div>
                
                <div className="flex items-center space-x-6"></div>
                
                <div className="hidden md:flex items-center text-sm text-gray-600 mt-2 sm:mt-0">
                    <span>Made with</span> 
                    <HiHeart className="w-4 h-4 mx-1 text-red-500" /> 
                    <span>by StockMaster Team</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
