import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const RoleProtectedRoute = ({ children, allowedRole }) => {
    const [userRole, setUserRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUserRole = async () => {
            const token = localStorage.getItem('googleToken')
            if (!token) {
                setUserRole(null)
                setLoading(false)
                return
            }

            try {
                const response = await axios.get('http://localhost:5000/api/user/status', {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                })
                setUserRole(response.data.role)
            } catch (error) {
                setUserRole(null)
            }
            setLoading(false)
        }

        getUserRole()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }
    
    if (allowedRole !== userRole) {
        return <Navigate to="/unauthorized" />
    }

    return children
}

export default RoleProtectedRoute
