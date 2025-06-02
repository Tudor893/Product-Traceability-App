import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const RoleProtectedRoute = ({ children, allowedRole }) => {
    const { user, isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (allowedRole && user?.role && user?.role !== allowedRole) {
        return <Navigate to="/unauthorized" />
    }

    return children
}

export default RoleProtectedRoute