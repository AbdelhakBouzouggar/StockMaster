import { Navigate, Outlet, useLocation } from 'react-router-dom'

function PrivateRoute({ allowedRoles = [] }) {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    const location = useLocation()

    if (!token) return <Navigate to="/login" state={{ from: location }} replace />

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />
}

export default PrivateRoute
