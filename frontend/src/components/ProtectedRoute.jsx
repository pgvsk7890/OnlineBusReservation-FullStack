import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, allowedRoles }) {
    const userStr = localStorage.getItem("user")
    
    if (!userStr) {
        return <Navigate to="/login" replace />
    }

    let user
    try {
        user = JSON.parse(userStr)
    } catch {
        localStorage.removeItem("user")
        return <Navigate to="/login" replace />
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin" replace />
        } else if (user.role === "USER") {
            return <Navigate to="/home" replace />
        }
    }

    return children
}

export default ProtectedRoute
