import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from 'axios'

const AuthProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("googleToken")
            if (!token) {
                setIsAuthenticated(false)
                return
            }

            try {
                const response = await axios.get("http://localhost:5000/api/auth/validate", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                setIsAuthenticated(response.data.valid)
            } catch (error) {
                console.error("Token verification failed:", error)
                setIsAuthenticated(false)
            }
        }
        verifyToken()
    }, [])

    if (isAuthenticated === null) {
        return <p>Loading...</p>
    }

    return isAuthenticated ? children : <Navigate to="/login" />
}

export default AuthProtectedRoute
