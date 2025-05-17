import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = {
    '/': 'Dashboard | StockMaster',
    '/inventory': 'Inventory | StockMaster',
    '/orders': 'Orders | StockMaster',
    '/movements': 'Stock Movements | StockMaster',
    '/historique': 'Stock History | StockMaster',
    '/users': 'Users | StockMaster',
    '/login': 'Login | StockMaster',
    '/register': 'Register | StockMaster',
}

export default function Title() {
    const location = useLocation()

    useEffect(() => {
        const path = location.pathname
        let title = TITLES[path]
        if (!title) {
            title = 'StockMaster'
        }
        document.title = title
    }, [location.pathname])

    return null
}
