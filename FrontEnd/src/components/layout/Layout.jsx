import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Title from './Title'

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Title />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="container mx-auto">
                        <Outlet />
                    </div>
                </main>
                
                <Footer />
            </div>
        </div>
    )
}

export default Layout
