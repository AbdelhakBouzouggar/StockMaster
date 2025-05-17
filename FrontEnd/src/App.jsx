import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/auth/PrivateRoute'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'
import PublicRoute from './components/auth/PublicRoute'
import StockMovementForm from './pages/StockMovementForm'
import HistoriqueMovments from './pages/HistoriqueMovments'
import StockMovements from './pages/StockMovements'
function App() {
    return (
        <Router>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={['employe', 'gestionnaire']} />}>
                    <Route path="/StockMovements" element={<StockMovements />} />
                    <Route path="/" element={<Layout />}>
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/movements" element={<StockMovementForm />} />
                        <Route path="/historique" element={<HistoriqueMovments />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={['gestionnaire', 'admin']} />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Route>

                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
