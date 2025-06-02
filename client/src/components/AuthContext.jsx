import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { googleLogout } from '@react-oauth/google'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUserData = async () => {
        const token = localStorage.getItem('googleToken')
        
        if (!token) {
            setUser(null)
            setIsAuthenticated(false)
            setIsLoading(false)
            return
        }

        try {
            const response = await axios.get('http://localhost:5000/api/user/status', {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            })
            
            if (response.status === 200) {
                setUser(response.data)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
            localStorage.removeItem('googleToken')
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    const login = (token) => {
        localStorage.setItem('googleToken', token)
        fetchUserData()
    }

    const logout = () => {
        googleLogout()
        localStorage.removeItem('googleToken')
        setUser(null)
        setIsAuthenticated(false)
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser: fetchUserData
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
