import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('admin_token')
        const user = localStorage.getItem('admin_user')

        if (token && user) {
            setIsAuthenticated(true)
            setAdmin(JSON.parse(user))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const response = await authService.login(email, password)
        const data = response.data
        if (!data?.success) {
            throw new Error(
                data?.message || 'Login failed'
            )
        }

        if (!data.token) {
            throw new Error('Token not received from server')
        }

        // Save token
        localStorage.setItem('admin_token', data.token)

        // Save user
        localStorage.setItem('admin_user', JSON.stringify(data.user))

        // Optional role
        if (data.roles?.length) {
            localStorage.setItem('admin_role', data.roles[0])
        }

        // Update state
        setIsAuthenticated(true)
        setAdmin(data.user)

        return data
    }

    const logout = async () => {

        try {
            await authService.logout()
        } catch (error) {
            console.log('Logout API error:', error)
        }

        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        localStorage.removeItem('admin_role')

        setIsAuthenticated(false)
        setAdmin(null)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                admin,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}