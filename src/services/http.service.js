import Axios from 'axios'

const BASE_URL = import.meta.env.PROD
    ? '/api/'
    : '//localhost:3030/api/'


const axios = Axios.create({ withCredentials: true })

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null

    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        // Always log errors for debugging
        console.error(`[HTTP Error] ${method} ${endpoint}:`, {
            url,
            status: err.response?.status,
            statusText: err.response?.statusText,
            message: err.message,
            code: err.code,
            response: err.response?.data,
            isNetworkError: !err.response
        })

        // Handle 401 unauthorized
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
            // window.location.assign('/')
        }

        // Enhance error object with more details for better error handling
        if (!err.response) {
            // Network error - no response from server
            err.isNetworkError = true
            err.userMessage = err.code === 'ERR_NETWORK'
                ? 'Network error: Could not connect to server'
                : err.code === 'ECONNABORTED'
                    ? 'Request timeout: Server took too long to respond'
                    : 'Connection error: Please check your internet connection'
        } else {
            // Server responded with error
            err.userMessage = err.response?.data?.err || err.response?.data?.message || err.message
        }

        throw err
    }
}