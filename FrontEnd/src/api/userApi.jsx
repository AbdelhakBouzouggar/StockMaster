import axios from 'axios'

const userApi = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const userService = {
    getAll: async () => {
        try {
            const response = await userApi.get('/users')
            return response.data
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error)
            throw error
        }
    },

    create: async (userData) => {
        try {
            const response = await userApi.post('/users', userData)
            return response.data
        } catch (error) {
            console.error('Erreur lors de la création d\'un utilisateur:', error)
            throw error
        }
    },

    update: async (id, userData) => {
        try {
            const response = await userApi.put(`/users/${id}`, userData)
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error)
            throw error
        }
    },

    delete: async (id) => {
        try {
            const response = await userApi.delete(`/users/${id}`)
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error)
            throw error
        }
    }
}

export default userApi

