import api from './api'

const authService = {

    login: async (email, password) => {
        const response = await api.post('/login', {
            email, password,
        })
        return response
    },

    logout: async () => {
        const response = await api.post('/logout')
        return response
    },

    profile: async () => {
        const response = await api.get('/profile')
        return response
    },

    forgotPassword: async (data) => {
        const response = await api.post('/forgot-password', data)
        return response
    },

    resetPassword: async (data) => {
        const response = await api.post('/reset-password', data)
        return response
    },
}

export default authService