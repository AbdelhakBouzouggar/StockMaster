import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/auth/PrivateRoute'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'
import PublicRoute from './components/auth/PublicRoute'
import StockMovementForm from './pages/StockMovementForm'
import HistoriqueMovments from './pages/HistoriqueMovments'
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
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/orders" element={<Orders />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={['employe', 'admin']} />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="/movements" element={<StockMovementForm />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={['gestionnaire', 'admin']} />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={['gestionnaire']} />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="/historique" element={<HistoriqueMovments />} />
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
