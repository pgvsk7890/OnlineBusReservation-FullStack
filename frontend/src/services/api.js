import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8080"
})

api.interceptors.request.use(
    (config) => {
        const requestUrl = config.url || ""

        // Auth endpoints should not receive stale bearer tokens from localStorage.
        if (requestUrl.startsWith("/auth/")) {
            return config
        }

        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`
                }
            } catch (e) {
                console.error("Error parsing user from localStorage", e)
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default api
