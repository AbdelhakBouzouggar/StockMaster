import axios from 'axios'

const token = localStorage.getItem('token')

const laravelApi = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization : `Bearer ${token}`
    },
})

export default laravelApi
